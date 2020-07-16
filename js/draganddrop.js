function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
// Get mouse position
var mouseX = (ev.offsetX / ancho) * 2 - 1;
var mouseY = -(ev.offsetY / alto) * 2 + 1;


var mouse = new THREE.Vector2();
mouse.x = mouseX;
mouse.y = mouseY;
lesson10.raycaster.setFromCamera( mouse, lesson10.camera );
var intersects = lesson10.raycaster.intersectObject(lesson10.plane);

ev.preventDefault();
var data = {};
var Oid = ev.dataTransfer.getData("text");
var o = document.getElementById(Oid);
data.url1 = o.getAttribute("data-url1");
data.url2 = o.getAttribute("data-url2");
data.url3 = o.getAttribute("data-url3");
data.size = 0 + o.getAttribute("data-size");
data.name = o.getAttribute("data-name");
data.price = o.getAttribute("data-price");
data.mesures = o.getAttribute("data-mesures");
data.personalID = 0;
console.log(data.url1);
var object, material, radius;

//var objGeometry = new THREE.BoxGeometry(10, 10, 1);
const loader = new THREE.TextureLoader();
const texture = loader.load(data.url1, function(texture){
    var h = texture.image.height;
    var w = texture.image.width;
    var z = data.size;
    //texture.minFilter = THREE.LinearFilter;
    a = 10*z;
    b = 10*z/h*w;
    var objGeometry = new THREE.PlaneBufferGeometry(1, 1, 8, 8);
    material = new THREE.MeshPhongMaterial({color: 0x999999, map: texture,
    alphaTest: 0.1,
    transparent: true,
    side: THREE.DoubleSide});
    material.transparent = true;
    object = new THREE.Mesh(objGeometry.clone(), material);
    count = count + 1;
    object.data = data;
    object.data.personalID = count;
    object.data.selected = 1;
    object.scale.set( b, a, 1 );
    object.position.copy(intersects[0].point);

    max = 4;
    for (let index = 0; index < lesson10.objects.length; index++) {
    const element = lesson10.objects[index];
    if(element.position.z > max){
        max = element.position.z;
    } 
    }
    max = max + 1;
    object.position.z = max;
    console.log(object.position);
    lesson10.objects.push(object);
    // object.scale.x = 1.5;
    // object.scale.y = 1.5;
    // object.position.x = Math.random() * 50 - 25;
    // object.position.y = Math.random() * 50 - 25;
    // object.position.z = 400;

    lesson10.scene.add(object);
},function(xhr){console.log( (xhr.loaded / xhr.total * 100) + '% loaded' )},function(xhr){console.log(xhr );});
}