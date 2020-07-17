// máxima altura para los objetos(mayor altura más cerca a la cámara)
var max = 0;

//Flag para diferenciar un click y un arrastre
var click = false;

// Objetos que conforman la interfaz del recuadro
var texto;
var l;
var t;
var r;
var x;

// Contador que define el ID de los objetos que ingresan al canvas
var count = 0;

// Objeto temporal que almacena el objeto seleccionado
var obj;

// Nombre, tamaño y precio del objeto
var nameO;
var size;
var price;

// Objetos que confirman las alternativas intercambiables
var options;
var option1;
var option2;
var option3;
var option4;
var option5;

// Variable que define la opción selecionada
var selected=0;

// Variable que almacena todo el contenido WEBGL e interacciones con el usuario
var hall = {
  // Variablles generales para la escena
  scene:     null,
  camera:    null,
  renderer:  null,
  container: null,
  controls:  null,
  clock:     null,
  stats:     null,
  plane:     null,
  selection: null,
  offset:    new THREE.Vector3(),
  objects:   [],
  raycaster: new THREE.Raycaster(),

  // Se inicalizan los objetos y variables
  init: function() {

    // Creación de la escena principal
    this.scene     = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);

    // Constantes del tamaño del canvas
    var SCREEN_WIDTH = ancho, SCREEN_HEIGHT = alto;

    // Perspectiva ortográfica, ratio de aspecto y parámetros de cámara
    var viewSize = SCREEN_HEIGHT/4;
    aspectRatio  = SCREEN_WIDTH/SCREEN_HEIGHT;
    this.camera =  new THREE.OrthographicCamera( -aspectRatio*viewSize/2, aspectRatio*viewSize/2,viewSize/2, -viewSize/2, 1, 1000 );
    this.scene.add(this.camera);
    this.camera.position.set(0, 0, 1000);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    // WEBGL render
    this.renderer = new THREE.WebGLRenderer({ alpha: true,antialias:true,preserveDrawingBuffer: true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor("#ffffff");

    // obtener y crear contenedor del canvas y demás objetos de la interfaz
    this.container = document.getElementById('container');
    texto          = document.createElement("div");
    nameO          = document.createElement("p");
    size           = document.createElement("p");
    price          = document.createElement("p");
    options        = document.createElement("div");
    option1        = document.createElement("img");
    option2        = document.createElement("img");
    option3        = document.createElement("img");
    option4        = document.createElement("img");
    option5        = document.createElement("img");
    l              = document.createElement("div");
    t              = document.createElement("div");
    r              = document.createElement("div");
    x              = document.createElement("img");

    // Agregamos el nombre del producto, su tamaño y precio al recuadro de texto
    texto.appendChild(nameO);
    texto.appendChild(size);
    texto.appendChild(price);

    // Parametrizamos el símbolo X y su comportamiento
    x.src           = "images/x.png";
    x.style.display = "none";
    x.style.zIndex  = 1000
    x.onclick = function(){
      // Busco el índice del objeto a retirar
      var i;
      var element;
      for (i = 0; i < hall.objects.length; i++) {
        element = hall.objects[i];
        if(element.data.personalID == obj.data.personalID){
          break;
        }
      }
      
      // Retiro al objeto de la escena y del array de objetos almacenados
      obj.geometry.dispose();
      obj.material.dispose();
      hall.scene.remove( obj );
      animate();
      hall.objects.splice(i,1);

      // Oculto la interfaz
      texto.style.display   = "none";
      l.style.display       = "none";
      t.style.display       = "none";
      r.style.display       = "none";
      x.style.display       = "none";
      options.style.display = "none";
    };

    // Comportamiento al hacer click en la primera opción
    option1.onclick = function(){
      if(obj.data.selected != 1){

        // Cargo la textura
        var nSrc   = obj.data.url1;
        var loader = new THREE.TextureLoader();
        loader.load( nSrc, function(tx){

          // Calculo el tamaño de la malla a partir de la textura
          tx.minFilter = THREE.LinearFilter;
          let h        = tx.image.height;
          let w        = tx.image.width;
          w            = 10*obj.data.size/h*w;
          h            = 10*obj.data.size;

          // Cambio el tamaño de la malla y cambio la textura
          obj.scale.set(w,h,1);
          obj.material.map          = tx;
          obj.material.needsUpdate  = true;

          // Modifico el borde de las opciones para diferenciar el seleccionado
          option1.style.borderColor = "#111111";
          option2.style.borderColor = "white";
          option3.style.borderColor = "white";
          option4.style.borderColor = "white";
          option5.style.borderColor = "white";
          obj.data.selected         = 1;
          refreshPanel();
        },undefined,function(){});
      }
    }

    // Comportamiento al hacer click en la segunda opción
    option2.onclick = function(){
      if(obj.data.selected != 2){

        // Cargo la textura
        var nSrc   = obj.data.url2;
        var loader = new THREE.TextureLoader();
        loader.load( nSrc, function(tx){

          // Calculo el tamaño de la malla a partir de la textura
          tx.minFilter = THREE.LinearFilter;
          let h        = tx.image.height;
          let w        = tx.image.width;
          w            = 10*obj.data.size/h*w;
          h            = 10*obj.data.size;

          // Cambio el tamaño de la malla y cambio la textura
          obj.scale.set(w,h,1);
          obj.material.map         = tx;
          obj.material.needsUpdate = true;

          // Modifico el borde de las opciones para diferenciar el seleccionado
          option2.style.borderColor = "#111111";
          option5.style.borderColor = "white";
          option4.style.borderColor = "white";
          option1.style.borderColor = "white";
          option3.style.borderColor = "white";
          obj.data.selected         = 2;
          refreshPanel();
        },undefined,function(){} );
        
      }
    }

    // Comportamiento al hacer click en la tercera opción
    option3.onclick = function(){
      if(obj.data.selected != 3){

        // Cargo la textura
        var nSrc   = obj.data.url3;
        var loader = new THREE.TextureLoader();
        loader.load( nSrc, function(tx){
          // Calculo el tamaño de la malla a partir de la textura
          tx.minFilter = THREE.LinearFilter;
          let h        = tx.image.height;
          let w        = tx.image.width;
          w            = 10*obj.data.size/h*w;
          h            = 10*obj.data.size;

          // Cambio el tamaño de la malla y cambio la textura
          obj.scale.set(w,h,1);
          obj.material.map         = tx;
          obj.material.needsUpdate = true;
          
          // Modifico el borde de las opciones para diferenciar el seleccionado
          option3.style.borderColor = "#111111";
          option5.style.borderColor = "white";
          option4.style.borderColor = "white";
          option2.style.borderColor = "white";
          option1.style.borderColor = "white";
          obj.data.selected         = 3;
          refreshPanel();
        },undefined,function(){} );
      }
    }

    // Comportamiento al hacer click en la cuarta opción
    option4.onclick = function(){
      if(obj.data.selected != 4){

        // Cargo la textura
        var nSrc   = obj.data.url4;
        var loader = new THREE.TextureLoader();
        loader.load( nSrc, function(tx){

          // Calculo el tamaño de la malla a partir de la textura
          tx.minFilter = THREE.LinearFilter;
          let h        = tx.image.height;
          let w        = tx.image.width;
          w            = 10*obj.data.size/h*w;
          h            = 10*obj.data.size;

          // Cambio el tamaño de la malla y cambio la textura
          obj.scale.set(w,h,1);
          obj.material.map         = tx;
          obj.material.needsUpdate = true;

          // Modifico el borde de las opciones para diferenciar el seleccionado
          option4.style.borderColor = "#111111";
          option5.style.borderColor = "white";
          option3.style.borderColor = "white";
          option2.style.borderColor = "white";
          option1.style.borderColor = "white";
          obj.data.selected         = 4;
          refreshPanel();
        },undefined,function(){} );
      }
    }

    // Comportamiento al hacer click en la quinta opción
    option5.onclick = function(){
      if(obj.data.selected != 5){

        // Cargo la textura
        var nSrc   = obj.data.url5;
        var loader = new THREE.TextureLoader();
        loader.load( nSrc, function(tx){

          // Calculo el tamaño de la malla a partir de la textura
          tx.minFilter = THREE.LinearFilter;
          let h        = tx.image.height;
          let w        = tx.image.width;
          w            = 10*obj.data.size/h*w;
          h            = 10*obj.data.size;

          // Cambio el tamaño de la malla y cambio la textura
          obj.scale.set(w,h,1);
          obj.material.map         = tx;
          obj.material.needsUpdate = true;

          // Modifico el borde de las opciones para diferenciar el seleccionado
          option5.style.borderColor = "#111111";
          option4.style.borderColor = "white";
          option3.style.borderColor = "white";
          option2.style.borderColor = "white";
          option1.style.borderColor = "white";
          obj.data.selected         = 5;
          refreshPanel();
        },undefined,function(){} );
      }
    }

    // Establezco las condiciones iniciales para los objetos de la interfaz
    texto.id                    = "text";
    texto.style.position        = "absolute";
    texto.style.color           = "white";
    texto.style.backgroundColor = "#111";
    l.style.position            = "absolute";
    t.style.position            = "absolute";
    r.style.position            = "absolute";
    x.style.position            = "absolute";
    options.style.position      = "absolute";
    option1.style.display       = "inline";
    option2.style.display       = "inline";
    option3.style.display       = "inline";
    option4.style.display       = "inline";
    option5.style.display       = "inline";
    l.style.backgroundColor     = "#111";
    t.style.backgroundColor     = "#111";
    r.style.backgroundColor     = "#111";
    texto.style.display         = "none";
    l.style.display             = "none";
    t.style.display             = "none";
    r.style.display             = "none";
    x.style.display             = "none";
    options.style.display       = "none";
    option1.classList.add("option");
    option2.classList.add("option");
    option3.classList.add("option");
    option4.classList.add("option");
    option5.classList.add("option");
    options.appendChild(option1);
    options.appendChild(option2);
    options.appendChild(option3);
    options.appendChild(option4);
    options.appendChild(option5);
    this.container.appendChild(texto);
    this.container.appendChild(l);
    this.container.appendChild(t);
    this.container.appendChild(r);
    this.container.appendChild(x);
    this.container.appendChild(options);
    this.container.appendChild(this.renderer.domElement);

    // Establezco los enventos a capturar
    THREEx.WindowResize(this.renderer, this.camera);
    this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
    this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
    this.renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp, false);

    // Preparar reloj para la animación de la escena
    this.clock = new THREE.Clock();

    // Se añaden luces a la escena
    this.scene.add( new THREE.AmbientLight(0x444444));
    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(200, 200, 1000).normalize();
    this.camera.add(dirLight);
    this.camera.add(dirLight.target);

    // Se añade plano que nos ayudará a establecer el movimiento de los objetos
    this.plane         = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.plane.visible = false;
    this.scene.add(this.plane);

    // Se añade planos para los colores de fondo
    this.upPlane            = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 1, 1), new THREE.MeshBasicMaterial({color: 0x707F91}));
    this.upPlane.visible    = true;
    this.upPlane.position.z = 2;
    this.upPlane.position.y = 1000;
    this.scene.add(this.upPlane);
    this.downPlane            = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.downPlane.visible    = true;
    this.downPlane.position.z = 2;
    this.downPlane.position.y = -1000;
    this.scene.add(this.downPlane);
    this.reusableTarget = new THREE.WebGLRenderTarget(1, 1);

  },

  // Evento de 
  onDocumentMouseDown: function (event) {
    // Get mouse position
    click = true;
    texto.style.display = "none";
    l.style.display = "none";
    r.style.display = "none";
    t.style.display = "none";
    x.style.display = "none";
    options.style.display = "none";
    obj = null;

    var mouseX = (event.offsetX / ancho) * 2 - 1;
    var mouseY = -(event.offsetY / alto) * 2 + 1;

    var mouse = new THREE.Vector2();
    mouse.x = mouseX;
    mouse.y = mouseY;
    hall.raycaster.setFromCamera( mouse, hall.camera );


    // Find all intersected objects
    var intersects = hall.raycaster.intersectObjects(hall.objects);
    // console.log(intersects.length);
    if (intersects.length > 0) {
      // Disable the controls
      //hall.controls.enabled = false;

      // Set the selection - first intersected object
      hall.selection = intersects[0].object;
      max = 0;
      for (let index = 0; index < hall.objects.length; index++) {
        const element = hall.objects[index];
        // console.log('->' + element.position.z);
        if(element.position.z > max){
          max = element.position.z;
        } 
      }
      max = max + 1;
      hall.selection.position.z = max;

      // Calculate the offset
      var intersects = hall.raycaster.intersectObject(hall.plane);
      hall.offset.copy(intersects[0].point).sub(hall.plane.position);

    }
  },
  onDocumentMouseMove: function (event) {
    event.preventDefault();
    click = false;
    
    if(event.offsetX < 30 || event.offsetY < 30){
      hall.selection = null;
      return;
    }
    if(event.offsetX > (ancho - 30) || event.offsetY > (alto - 30)){
      hall.selection = null;
      return;
    }
    
    // Get mouse position
    var mouseX = (event.offsetX / ancho) * 2 - 1;
    var mouseY = -(event.offsetY / alto) * 2 + 1;


    var mouse = new THREE.Vector2();
    mouse.x = mouseX;
    mouse.y = mouseY;
    hall.raycaster.setFromCamera( mouse, hall.camera );

    if (hall.selection) {
      // Check the position where the plane is intersected
      var intersects = hall.raycaster.intersectObject(hall.plane);
      // Reposition the object based on the intersection point with the plane
      hall.selection.position.copy(intersects[0].point.sub(hall.offset));
      hall.selection.position.z=max;
      // render();
      // console.log(max);
    } else {
      // Update position of the plane if need
      var intersects = hall.raycaster.intersectObjects(hall.objects);
      if (intersects.length > 0) {
        hall.plane.position.copy(intersects[0].object.position);
        hall.plane.position.z = 0;
        var v = intersects[0].object.position;
        // v.z = 0;
        hall.plane.lookAt(v);
      }
    }
  },
  onDocumentMouseUp: function (event) {
    // Enable the controls
    // hall.controls.enabled = true;
    if(click && hall.selection){
      obj = hall.selection;
      refreshPanel();
    }
    if(hall.selection)
      hall.selection.position.z=max;
    hall.selection = null;

  }
};

function refreshPanel(){
  var vector = obj.position.clone();
  var box = new THREE.Box3().setFromObject( obj );
  var a = Math.abs(box.max.x - box.min.x);
  var b = Math.abs(box.max.y - box.min.y);
  vector.x = box.min.x;
  vector.y = box.min.y;
  vector.project(hall.camera);
  vector.x = ( vector.x + 1) * ancho / 2;
  vector.y = - ( vector.y - 1) * alto / 2;
  vector.z = 0;
  texto.style.top = (vector.y + hall.renderer.domElement.getBoundingClientRect().top + 5) + "px";
  texto.style.left = (vector.x + hall.renderer.domElement.getBoundingClientRect().left - 10) + "px";
  texto.style.display = "block";
  var vector2 = obj.position.clone();
  vector2.x = box.max.x;
  vector2.y = box.max.y;
  vector2.project(hall.camera);
  vector2.x = ( vector2.x + 1) * ancho / 2;
  vector2.y = - ( vector2.y - 1) * alto / 2;
  vector2.z = 0;
  texto.style.width = (vector2.x - vector.x + 20) + "px";
  texto.style.height = "auto";

  l.style.left = (vector.x + hall.renderer.domElement.getBoundingClientRect().left - 10) + "px";
  l.style.top = (hall.renderer.domElement.getBoundingClientRect().top + vector2.y - 5) + "px";
  l.style.width = "5px";
  l.style.height = (vector.y - vector2.y + 10) + "px";
  l.style.display = "block";
  t.style.left = (vector.x + hall.renderer.domElement.getBoundingClientRect().left - 10) + "px";
  t.style.top = (hall.renderer.domElement.getBoundingClientRect().top  + vector2.y - 10) + "px";
  t.style.height = "5px";
  t.style.width = (vector2.x - vector.x + 20) + "px";
  t.style.display = "block";
  r.style.left = (hall.renderer.domElement.getBoundingClientRect().left + vector2.x + 5) + "px";
  r.style.top = (hall.renderer.domElement.getBoundingClientRect().top  + vector2.y - 5) + "px";
  r.style.height = (vector.y - vector2.y + 10) + "px";
  r.style.width = "5px";
  r.style.display = "block";
  x.style.top = (hall.renderer.domElement.getBoundingClientRect().top  + vector2.y - 20) + "px";
  x.style.left = (hall.renderer.domElement.getBoundingClientRect().left + vector2.x - 5) + "px";
  x.style.width = "30px";
  x.style.height = "30px";
  x.style.display = "block";

  nameO.innerHTML = obj.data.name;
  size.innerHTML = obj.data.mesures;
  price.innerHTML = "S/. " + obj.data.price;

  options.style.display = "block";
  options.style.top = (hall.renderer.domElement.getBoundingClientRect().top  + vector2.y - 60) + "px";
  options.style.left = (vector.x + hall.renderer.domElement.getBoundingClientRect().left - 10) + "px";
  options.style.height = "40px";
  options.style.width = "auto";

  if(obj.data.url1.length != 0){
    option1.src = obj.data.url1;
    option1.style.display = "inline";
    if(obj.data.selected == 1)
      option1.style.borderColor = "#111111";
    else
      option1.style.borderColor = "white";
  }else{
    option1.style.display = "none";
  }

  if(obj.data.url2.length != 0){
    option2.src = obj.data.url2;
    option2.style.display = "inline";
    if(obj.data.selected == 2)
      option2.style.borderColor = "#111111";
    else
      option2.style.borderColor = "white";
  }else{
    option2.style.display = "none";
  }

  if(obj.data.url3.length != 0){
    option3.src = obj.data.url3;
    option3.style.display = "inline";
    if(obj.data.selected == 3)
      option3.style.borderColor = "#111111";
    else
      option3.style.borderColor = "white";
  }else{
    option3.style.display = "none";
  }

  if(obj.data.url4.length != 0){
    option4.src = obj.data.url4;
    option4.style.display = "inline";
    if(obj.data.selected == 4)
      option4.style.borderColor = "#111111";
    else
      option4.style.borderColor = "white";
  }else{
    option4.style.display = "none";
  }

  if(obj.data.url5.length != 0){
    option5.src = obj.data.url5;
    option5.style.display = "inline";
    if(obj.data.selected == 5)
      option5.style.borderColor = "#111111";
    else
      option5.style.borderColor = "white";
  }else{
    option5.style.display = "none";
  }
}

// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

// Update controls and stats
function update() {
  var delta = hall.clock.getDelta();

  //hall.controls.update(delta);
  // hall.stats.update();
}

// Render the scene
function render() {
  if (hall.renderer) {
    hall.renderer.render(hall.scene, hall.camera);
  }
}

// Initialize lesson on page load
function initializeLesson() {
  hall.init();
  animate();
}

function compartir(){
  var imgData, imgNode;
  try {
    var strMime = "image/jpeg";
    imgData = hall.renderer.domElement.toDataURL(strMime);

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
  hall.upPlane.material.color.setHex( color.value.replace('#','0x') );
}

function change2(){
  var color = document.getElementById("DownColor");
  var round = document.getElementById("round2");
  round.style.backgroundColor = color.value;
  hall.downPlane.material.color.setHex( color.value.replace('#','0x') );
}

function mas(){
  if(hall.camera.zoom <= 2.0)
    hall.camera.zoom = hall.camera.zoom + 0.1;
  hall.camera.updateProjectionMatrix();
}

function menos(){
  if(hall.camera.zoom >= 0.5)
    hall.camera.zoom = hall.camera.zoom - 0.1;
  hall.camera.updateProjectionMatrix();
}