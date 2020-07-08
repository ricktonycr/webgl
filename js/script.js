/**
 *
 * WebGL With Three.js - Lesson 10 - Drag and Drop Objects
 * http://www.script-tutorials.com/webgl-with-three-js-lesson-10/
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2015, Script Tutorials
 * http://www.script-tutorials.com/
 */

var max = 0;
sbVertexShader = [
"varying vec3 vWorldPosition;",
"void main() {",
"  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
"  vWorldPosition = worldPosition.xyz;",
"  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
"}",
].join("\n");

sbFragmentShader = [
"uniform vec3 topColor;",
"uniform vec3 bottomColor;",
"uniform float offset;",
"uniform float exponent;",
"varying vec3 vWorldPosition;",
"void main() {",
"  float h = normalize( vWorldPosition + offset ).y;",
"  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );",
"}",
].join("\n");

var click = false;
var texto;
var lesson10 = {
  scene: null, camera: null, renderer: null,
  container: null, controls: null,
  clock: null, stats: null,
  plane: null, selection: null, offset: new THREE.Vector3(), objects: [],
  raycaster: new THREE.Raycaster(),

  init: function() {

    // Create main scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);

    // var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var SCREEN_WIDTH = ancho, SCREEN_HEIGHT = alto;

    // Prepare perspective camera
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
    var viewSize = SCREEN_HEIGHT/4;
    aspectRatio = SCREEN_WIDTH/SCREEN_HEIGHT;
    // this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.camera =  new THREE.OrthographicCamera( -aspectRatio*viewSize/2, aspectRatio*viewSize/2,viewSize/2, -viewSize/2, 1, 1000 );
    this.scene.add(this.camera);
    this.camera.position.set(0, 0, 1000);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    // Prepare webgl renderer
    this.renderer = new THREE.WebGLRenderer({ antialias:true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(this.scene.fog.color);

    // Prepare container
    this.container = document.getElementById('container');
    // document.body.appendChild(this.container);

    texto = document.createElement("div");
    texto.id = "text";
    texto.innerHTML = "hola";
    texto.style.position = "relative";
    texto.style.top = "20px";
    texto.style.left = "0px";
    texto.style.height = "20px";
    texto.style.width = "20px";
    texto.style.backgroundColor = "#111";
    texto.style.zIndex = -1000;
    this.container.appendChild(texto);
    this.container.appendChild(this.renderer.domElement);

    // Events
    THREEx.WindowResize(this.renderer, this.camera);
    this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
    this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
    this.renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp, false);

    // Prepare Orbit controls
    // this.controls = new THREE.OrbitControls(this.camera);
    // this.controls.target = new THREE.Vector3(0, 0, 0);
    // this.controls.maxDistance = 150;

    // Prepare clock
    this.clock = new THREE.Clock();

    // Prepare stats
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '50px';
    this.stats.domElement.style.bottom = '50px';
    this.stats.domElement.style.zIndex = 1;
    this.container.appendChild( this.stats.domElement );

    // Add lights
    this.scene.add( new THREE.AmbientLight(0x444444));

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(200, 200, 1000).normalize();
    this.camera.add(dirLight);
    this.camera.add(dirLight.target);

    // Display skybox
    this.addSkybox();

    // Plane, that helps to determinate an intersection position
    this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.plane.visible = false;
    this.scene.add(this.plane); 


    // Add 100 random objects (spheres)
    var object, material, radius;
    //var objGeometry = new THREE.BoxGeometry(10, 10, 1);
    var objGeometry = new THREE.PlaneBufferGeometry(10, 10, 8, 8);
    const loader = new THREE.TextureLoader();
    /*
    for (var i = 0; i < 10; i++) {
      const texture = loader.load('tree-01.png', function(texture){console.log(texture);
      material = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff, map: texture,
        alphaTest: 0.3,
        transparent: true,
        side: THREE.DoubleSide,});
      material.transparent = true;
      object = new THREE.Mesh(objGeometry.clone(), material);
      lesson10.objects.push(object);

      radius = Math.random() * 4 + 2;
      object.scale.x = radius;
      object.scale.y = radius;
      object.scale.z = radius;

      object.position.x = Math.random() * 50 - 25;
      object.position.y = Math.random() * 50 - 25;
      object.position.z = i;

      lesson10.scene.add(object);},function(xhr){console.log( (xhr.loaded / xhr.total * 100) + '% loaded' )},function(xhr){console.log( 'An error happened' );});
    }*/

  },
  addSkybox: function() {
    var iSBrsize = 500;
    var uniforms = {
      topColor: {type: "c", value: new THREE.Color(0x0077ff)}, bottomColor: {type: "c", value: new THREE.Color(0xffffff)},
      offset: {type: "f", value: iSBrsize}, exponent: {type: "f", value: 1.5}
    }

    var skyGeo = new THREE.SphereGeometry(iSBrsize, 32, 32);
    skyMat = new THREE.ShaderMaterial({vertexShader: sbVertexShader, fragmentShader: sbFragmentShader, uniforms: uniforms, side: THREE.DoubleSide, fog: false});
    skyMesh = new THREE.Mesh(skyGeo, skyMat);
    //this.scene.add(skyMesh);
  },
  onDocumentMouseDown: function (event) {
    // Get mouse position
    click = true;
    texto.style.zIndex = -1000;
    var mouseX = (event.offsetX / ancho) * 2 - 1;
    var mouseY = -(event.offsetY / alto) * 2 + 1;

    var mouse = new THREE.Vector2();
    mouse.x = mouseX;
    mouse.y = mouseY;
    lesson10.raycaster.setFromCamera( mouse, lesson10.camera );


    // Find all intersected objects
    var intersects = lesson10.raycaster.intersectObjects(lesson10.objects);
    // console.log(intersects.length);
    if (intersects.length > 0) {
      // Disable the controls
      //lesson10.controls.enabled = false;

      // Set the selection - first intersected object
      lesson10.selection = intersects[0].object;
      max = 0;
      for (let index = 0; index < lesson10.objects.length; index++) {
        const element = lesson10.objects[index];
        // console.log('->' + element.position.z);
        if(element.position.z > max){
          max = element.position.z;
        } 
      }
      max = max + 1;
      lesson10.selection.position.z = max;

      // Calculate the offset
      var intersects = lesson10.raycaster.intersectObject(lesson10.plane);
      lesson10.offset.copy(intersects[0].point).sub(lesson10.plane.position);
    }
  },
  onDocumentMouseMove: function (event) {
    event.preventDefault();
    click = false;
    // Get mouse position
    var mouseX = (event.offsetX / ancho) * 2 - 1;
    var mouseY = -(event.offsetY / alto) * 2 + 1;


    var mouse = new THREE.Vector2();
    mouse.x = mouseX;
    mouse.y = mouseY;
    lesson10.raycaster.setFromCamera( mouse, lesson10.camera );

    if (lesson10.selection) {
      // Check the position where the plane is intersected
      var intersects = lesson10.raycaster.intersectObject(lesson10.plane);
      // Reposition the object based on the intersection point with the plane
      lesson10.selection.position.copy(intersects[0].point.sub(lesson10.offset));
      lesson10.selection.position.z=max;
      // console.log(max);
    } else {
      // Update position of the plane if need
      var intersects = lesson10.raycaster.intersectObjects(lesson10.objects);
      if (intersects.length > 0) {
        lesson10.plane.position.copy(intersects[0].object.position);
        var v = new THREE.Vector3(0,0,100000);
        lesson10.plane.lookAt(v);
      }
    }
  },
  onDocumentMouseUp: function (event) {
    // Enable the controls
    // lesson10.controls.enabled = true;
    if(click && lesson10.selection){
      var vector = lesson10.selection.position.clone();
      var box = new THREE.Box3().setFromObject( lesson10.selection );
      var a = Math.abs(box.max.x - box.min.x);
      var b = Math.abs(box.max.y - box.min.y);
      vector.x = box.min.x;
      vector.y = box.min.y;
      vector.project(lesson10.camera);
      vector.x = ( vector.x + 1) * ancho / 2;
      vector.y = - ( vector.y - 1) * alto / 2;
      vector.z = 0;
      texto.style.top = (vector.y + 20) + "px";
      texto.style.left = vector.x + "px";
      texto.style.zIndex = 1000;
      var vector2 = lesson10.selection.position.clone();
      vector2.x = box.max.x;
      vector2.y = box.max.y;
      vector2.project(lesson10.camera);
      vector2.x = ( vector.x + 1) * ancho / 2;
      vector2.y = - ( vector.y - 1) * alto / 2;
      vector2.z = 0;
      // texto.style.width = (vector2.x - vector.x) + "px";
      texto.style.height = "60px";
      console.log(box);
      console.log(lesson10.renderer);
    }
    if(lesson10.selection)
      lesson10.selection.position.z=max;
    lesson10.selection = null;

  }
};

// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

// Update controls and stats
function update() {
  var delta = lesson10.clock.getDelta();

  //lesson10.controls.update(delta);
  lesson10.stats.update();
}

// Render the scene
function render() {
  if (lesson10.renderer) {
    lesson10.renderer.render(lesson10.scene, lesson10.camera);
  }
}

// Initialize lesson on page load
function initializeLesson() {
  lesson10.init();
  animate();
}

if (window.addEventListener)
  window.addEventListener('load', initializeLesson, false);
else if (window.attachEvent)
  window.attachEvent('onload', initializeLesson);
else window.onload = initializeLesson;
