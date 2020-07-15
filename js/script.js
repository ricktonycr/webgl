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
var l;
var t;
var r;
var x;
var count = 0;
var obj;
var nameO;
var size;
var price;
var option1;
var option2;
var option3;
var selected=0;
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
    this.renderer = new THREE.WebGLRenderer({ alpha: true,antialias:true,preserveDrawingBuffer: true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor("#ffffff");

    // Prepare container
    this.container = document.getElementById('container');
    // document.body.appendChild(this.container);

    texto = document.createElement("div");
    nameO  = document.createElement("p");
    size  = document.createElement("p");
    price = document.createElement("p");
    option1 = document.createElement("img");
    option2 = document.createElement("img");
    option3 = document.createElement("img");
    texto.appendChild(nameO);
    texto.appendChild(size);
    texto.appendChild(price);
    l = document.createElement("div");
    t = document.createElement("div");
    r = document.createElement("div");
    x = document.createElement("img");
    x.src = "images/x.png";
    x.style.zIndex = -1000;
    x.onclick = function(){
      var i;
      var element;
      for (i = 0; i < lesson10.objects.length; i++) {
        element = lesson10.objects[i];
        if(element.data.personalID == obj.data.personalID){
          break;
        }
      }
      
      obj.geometry.dispose();
      obj.material.dispose();
      lesson10.scene.remove( obj );
      animate();
      lesson10.objects.splice(i,1);
      texto.style.zIndex = -1000;
      l.style.zIndex = -1000;
      t.style.zIndex = -1000;
      r.style.zIndex = -1000;
      x.style.zIndex = -1000;
      option1.style.zIndex = -1000;
      option2.style.zIndex = -1000;
      option3.style.zIndex = -1000;
    };

    option1.onclick = function(){
      if(selected != 1){
        var nSrc = obj.data.url1;
        tx = THREE.ImageUtils.loadTexture( nSrc );
        tx.minFilter = THREE.LinearFilter;
        obj.material.map = tx;
        obj.material.needsUpdate = true;
        option1.style.borderColor = "white";
        option2.style.borderColor = "#111111";
        option3.style.borderColor = "#111111";
        selected = 1;
      }
    }

    option2.onclick = function(){
      if(selected != 2){
        var nSrc = obj.data.url2;
        tx = THREE.ImageUtils.loadTexture( nSrc );
        tx.minFilter = THREE.LinearFilter;
        obj.material.map = tx;
        obj.material.needsUpdate = true;
        option2.style.borderColor = "white";
        option1.style.borderColor = "#111111";
        option3.style.borderColor = "#111111";
        selected = 2;
      }
    }

    option3.onclick = function(){
      if(selected != 3){
        var nSrc = obj.data.url3;
        tx = THREE.ImageUtils.loadTexture( nSrc );
        tx.minFilter = THREE.LinearFilter;
        obj.material.map = tx;
        obj.material.needsUpdate = true;
        option3.style.borderColor = "white";
        option2.style.borderColor = "#111111";
        option1.style.borderColor = "#111111";
        selected = 3;
      }
    }

    texto.id = "text";
    texto.style.position = "absolute";
    l.style.position = "absolute";
    t.style.position = "absolute";
    r.style.position = "absolute";
    x.style.position = "absolute";
    option1.style.position = "absolute";
    option2.style.position = "absolute";
    option3.style.position = "absolute";
    texto.style.color = "white";
    texto.style.backgroundColor = "#111";
    l.style.backgroundColor = "#111";
    t.style.backgroundColor = "#111";
    r.style.backgroundColor = "#111";
    texto.style.zIndex = -1000;
    l.style.zIndex = -1000;
    t.style.zIndex = -1000;
    r.style.zIndex = -1000;
    x.style.zIndex = -1000;
    option1.style.zIndex = -1000;
    option2.style.zIndex = -1000;
    option3.style.zIndex = -1000;
    this.container.appendChild(texto);
    this.container.appendChild(l);
    this.container.appendChild(t);
    this.container.appendChild(r);
    this.container.appendChild(x);
    this.container.appendChild(option1);
    this.container.appendChild(option2);
    this.container.appendChild(option3);
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


    // Plane, that helps to determinate an intersection position
    this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.plane.visible = false;
    this.scene.add(this.plane);

    this.upPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 1, 1), new THREE.MeshBasicMaterial({color: 0x707F91}));
    this.upPlane.visible = true;
    this.upPlane.position.z = 2;
    this.upPlane.position.y = 1000;
    this.scene.add(this.upPlane);

    this.downPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.downPlane.visible = true;
    this.downPlane.position.z = 2;
    this.downPlane.position.y = -1000;
    this.scene.add(this.downPlane);

    this.reusableTarget = new THREE.WebGLRenderTarget(1, 1);


    // Add 100 random objects (spheres)
    var object, material, radius;
    //var objGeometry = new THREE.BoxGeometry(10, 10, 1);
    var objGeometry = new THREE.PlaneBufferGeometry(10, 10, 8, 8);
    const loader = new THREE.TextureLoader();

  },
  onDocumentMouseDown: function (event) {
    // Get mouse position
    click = true;
    texto.style.zIndex = -1000;
    l.style.zIndex = -1000;
    r.style.zIndex = -1000;
    t.style.zIndex = -1000;
    x.style.zIndex = -1000;
    option1.style.zIndex = -1000;
    option2.style.zIndex = -1000;
    option3.style.zIndex = -1000;
    obj = null;

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
    
    if(event.offsetX < 30 || event.offsetY < 30){
      lesson10.selection = null;
      return;
    }
    if(event.offsetX > (ancho - 30) || event.offsetY > (alto - 30)){
      lesson10.selection = null;
      return;
    }
    
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
      // render();
      // console.log(max);
    } else {
      // Update position of the plane if need
      var intersects = lesson10.raycaster.intersectObjects(lesson10.objects);
      if (intersects.length > 0) {
        lesson10.plane.position.copy(intersects[0].object.position);
        lesson10.plane.position.z = 0;
        var v = intersects[0].object.position;
        // v.z = 0;
        lesson10.plane.lookAt(v);
      }
    }
  },
  onDocumentMouseUp: function (event) {
    // Enable the controls
    // lesson10.controls.enabled = true;
    if(click && lesson10.selection){
      obj = lesson10.selection;
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
      texto.style.top = (vector.y + lesson10.renderer.domElement.getBoundingClientRect().top + 5) + "px";
      texto.style.left = (vector.x + lesson10.renderer.domElement.getBoundingClientRect().left - 10) + "px";
      texto.style.zIndex = 1000;
      var vector2 = lesson10.selection.position.clone();
      vector2.x = box.max.x;
      vector2.y = box.max.y;
      vector2.project(lesson10.camera);
      vector2.x = ( vector2.x + 1) * ancho / 2;
      vector2.y = - ( vector2.y - 1) * alto / 2;
      vector2.z = 0;
      texto.style.width = (vector2.x - vector.x + 20) + "px";
      texto.style.height = "auto";

      l.style.left = (vector.x + lesson10.renderer.domElement.getBoundingClientRect().left - 10) + "px";
      l.style.top = (lesson10.renderer.domElement.getBoundingClientRect().top + vector2.y - 5) + "px";
      l.style.width = "5px";
      l.style.height = (vector.y - vector2.y + 10) + "px";
      l.style.zIndex = 999;
      t.style.left = (vector.x + lesson10.renderer.domElement.getBoundingClientRect().left - 10) + "px";
      t.style.top = (lesson10.renderer.domElement.getBoundingClientRect().top  + vector2.y - 10) + "px";
      t.style.height = "5px";
      t.style.width = (vector2.x - vector.x + 20) + "px";
      t.style.zIndex = 999;
      r.style.left = (lesson10.renderer.domElement.getBoundingClientRect().left + vector2.x + 5) + "px";
      r.style.top = (lesson10.renderer.domElement.getBoundingClientRect().top  + vector2.y - 5) + "px";
      r.style.height = (vector.y - vector2.y + 10) + "px";
      r.style.width = "5px";
      r.style.zIndex = 999;
      x.style.top = (lesson10.renderer.domElement.getBoundingClientRect().top  + vector2.y - 20) + "px";
      x.style.left = (lesson10.renderer.domElement.getBoundingClientRect().left + vector2.x - 5) + "px";
      x.style.width = "30px";
      x.style.height = "30px";
      x.style.zIndex = 1001;

      nameO.innerHTML = obj.data.name;
      size.innerHTML = obj.data.mesures;
      price.innerHTML = "S/. " + obj.data.price;

      if(obj.data.url1.length != 0){
        option1.src = obj.data.url1;
        option1.style.width = "40px";
        option1.style.height = "40px";
        option1.style.top = (lesson10.renderer.domElement.getBoundingClientRect().top  + vector2.y - 60) + "px";;
        option1.style.left = (vector.x + lesson10.renderer.domElement.getBoundingClientRect().left - 10) + "px";;
        option1.style.zIndex = 1000;
        option1.style.backgroundColor = "white";
        option1.style.borderStyle = "solid";
        option1.style.borderWidth = "2px";
        option1.style.borderColor = "white";
      }

      if(obj.data.url2.length != 0){
        option2.src = obj.data.url2;
        option2.style.width = "40px";
        option2.style.height = "40px";
        option2.style.top = (lesson10.renderer.domElement.getBoundingClientRect().top  + vector2.y - 60) + "px";;
        option2.style.left = (vector.x + lesson10.renderer.domElement.getBoundingClientRect().left + 40) + "px";;
        option2.style.zIndex = 1000;
        option2.style.backgroundColor = "white";
        option2.style.borderStyle = "solid";
        option2.style.borderWidth = "2px";
        option2.style.borderColor = "#111111";
      }

      if(obj.data.url3.length != 0){
        option3.src = obj.data.url3;
        option3.style.width = "40px";
        option3.style.height = "40px";
        option3.style.top = (lesson10.renderer.domElement.getBoundingClientRect().top  + vector2.y - 60) + "px";;
        option3.style.left = (vector.x + lesson10.renderer.domElement.getBoundingClientRect().left + 90) + "px";;
        option3.style.zIndex = 1000;
        option3.style.backgroundColor = "white";
        option3.style.borderStyle = "solid";
        option3.style.borderWidth = "2px";
        option3.style.borderColor = "#111111";
      }
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

function compartir(){
  var imgData, imgNode;
  try {
    var strMime = "image/jpeg";
    imgData = lesson10.renderer.domElement.toDataURL(strMime);

    saveFile(imgData.replace(strMime, "image/octet-stream"), "disenio.jpg");

  } catch (e) {
    console.log(e);
    return;
  }
}

var saveFile = function (strData, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); //Firefox requires the link to be in the body
    link.download = filename;
    link.href = strData;
    link.click();
    document.body.removeChild(link); //remove the link when done
  } else {
    location.replace(uri);
  }
}

if (window.addEventListener)
  window.addEventListener('load', initializeLesson, false);
else if (window.attachEvent)
  window.attachEvent('onload', initializeLesson);
else window.onload = initializeLesson;


function round1(){
  var color = document.getElementById("UpColor");
  color.click();
}

function round2(){
  var color = document.getElementById("DownColor");
  color.click();
}

function change1(){
  var color = document.getElementById("UpColor");
  var round = document.getElementById("round1");
  round.style.backgroundColor = color.value;
  lesson10.upPlane.material.color.setHex( color.value.replace('#','0x') );
}

function change2(){
  var color = document.getElementById("DownColor");
  var round = document.getElementById("round2");
  round.style.backgroundColor = color.value;
  lesson10.downPlane.material.color.setHex( color.value.replace('#','0x') );
}