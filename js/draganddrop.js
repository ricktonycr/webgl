// Permitir el arrastrado
function allowDrop(ev) {
  ev.preventDefault();
}

// Transferir información al arrastrar
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

// Obtener información al soltar el objeto
function drop(ev) {
  ev.preventDefault();
  // Obtener la posición del mouse
  var mouseX = (ev.offsetX / ancho) * 2 - 1;
  var mouseY = -(ev.offsetY / alto) * 2 + 1;

  // Obtener la proyección de la posición del mouse en la escena para dejar el objeto en la posición establecida
  var mouse = new THREE.Vector2();
  mouse.x   = mouseX;
  mouse.y   = mouseY;
  hall.raycaster.setFromCamera( mouse, hall.camera );
  var intersects = hall.raycaster.intersectObject(hall.plane);

  // Obtengo información adjunta de la imagen y la agrego a un objeto nuevo
  var data        = {};
  var Oid         = ev.dataTransfer.getData("text");
  var o           = document.getElementById(Oid);
  data.url1       = o.getAttribute("data-url1");
  data.url2       = o.getAttribute("data-url2");
  data.url3       = o.getAttribute("data-url3");
  data.url4       = o.getAttribute("data-url4");
  data.url5       = o.getAttribute("data-url5");
  data.size       = 0 + o.getAttribute("data-size");
  data.name       = o.getAttribute("data-name");
  data.price      = o.getAttribute("data-price");
  data.mesures    = o.getAttribute("data-mesures");
  data.personalID = 0;
  data.id         = Oid;

  // Sumamos
  cantidad += 1;
  monto    += parseFloat(data.price);
  var cantidadE = document.getElementById("cantidad");
  cantidadE.innerHTML = cantidad + " elementos (Ver detalles)";
  var montoE = document.getElementById("monto");
  montoE.innerHTML = "Total: S/. " + Math.abs(monto.toFixed(2));


  // Creamos el nuevo objeto Three y el material a utilizar con textura de la imagen arrastrada
  var object, material, radius;
  
  // Cargamos la textura
  const loader  = new THREE.TextureLoader();
  const texture = loader.load(data.url1, function(texture){
    var h = texture.image.height;
    var w = texture.image.width;

    // Establecemos las dimensiones de la malla en 1 para poder manejar el zoom in/zoom out en perspectiva Ortográfica
    var objGeometry = new THREE.PlaneBufferGeometry(1, 1, 8, 8);
    material        = new THREE.MeshLambertMaterial({color: 0xeeeeee, map: texture,
      alphaTest: 0.1,
      transparent: true,
      side: THREE.DoubleSide});
    material.transparent   = true;
    object                 = new THREE.Mesh(objGeometry.clone(), material);

    // Agregamos el objeto adicional con información adjunta
    object.data            = data;

    // Establecemos el contador para el ID de cada imagen arrastrada
    count                  = count + 1;
    object.data.personalID = count;

    // Establecemos que la primera opción sea la seleccionada
    object.data.selected   = 1;

    // Escalamos el objeto al tamaño calculado
    var z = data.size;
    a     = 10*z;
    b     = 10*z/h*w;
    object.scale.set( b, a, 1 );

    // Establecemos la posición del objeto donde se "soltó"
    object.position.copy(intersects[0].point);

    // Establecemos la máxima "altura" en 4 para no tener problemas de visualización con los fondos de colores
    max = 4;
    for (let index = 0; index < hall.objects.length; index++) {
      const element = hall.objects[index];
      if(element.position.z > max){
        max = element.position.z;
      } 
    }
    max               = max + 1;
    object.position.z = max;

    // Agregamos el objeto al array de productos almacenados
    hall.objects.push(object);
    // object.scale.x = 1.5;
    // object.scale.y = 1.5;
    // object.position.x = Math.random() * 50 - 25;
    // object.position.y = Math.random() * 50 - 25;
    // object.position.z = 400;

    // Agregamos el objeto a la escena para ser renderizado
    hall.scene.add(object);

  // Se establecen dos funciones de retorno: carga de textura(aún no soportado por Threejs) y si ocurrió un error al cargar la textura
  },function(xhr){console.log( (xhr.loaded / xhr.total * 100) + '% loaded' )},function(xhr){console.log(xhr );});

  // Agregar a la lista de detalles
  var lista = document.getElementById("lista");
  var item  = document.createElement("div");
  item.classList.add("itemList");
  item.id = "e" + Oid;
  var part1 = document.createElement("div");
  part1.classList.add("part1");
  var limg = document.createElement("img");
  limg.src = o.src;
  part1.appendChild(limg);
  item.appendChild(part1);
  var part2 = document.createElement("div");
  part2.classList.add("part2");
  var nombre = document.createElement("p");
  nombre.innerHTML = data.name;
  part2.appendChild(nombre);
  var mesures = document.createElement("p");
  mesures.innerHTML = data.mesures;
  part2.appendChild(mesures);
  item.appendChild(part2);
  var part3 = document.createElement("div");
  part3.classList.add("part3");
  var price = document.createElement("p");
  price.innerHTML = data.price;
  part3.appendChild(price);
  var other = document.createElement("p");
  other.innerHTML = "disponible en Arequipa";
  part3.appendChild(other);
  item.appendChild(part3);
  lista.appendChild(item);
}