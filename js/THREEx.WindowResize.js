/** @namespace */
var THREEx	= THREEx || {};
var ancho = 1024;
var alto  = 300;
var te = ancho;

/**
 * Actualizar renderizador y cámara cuando la ventana cambia de tamaño
 * 
 * @param {Object} renderer
 * @param {Object} Camera
*/
THREEx.WindowResize	= function(renderer, camera){
	var callback	= function(){
		var cont = document.getElementById("container");
		ancho = cont.offsetWidth;
		alto = cont.offsetHeight;
		alto = alto/te*ancho;
		te = ancho;
		cont.style.height=alto + "px";
		// // Notificar al renderizador de los nuevos tamaños
		hall.renderer.setSize( ancho, alto );
		// // Actualizar cámara
		hall.renderer.setViewport(0, 0, ancho, alto);
		camera.fov	= ancho / window.screen.width;
		camera.aspect	= ancho / alto;
		camera.updateProjectionMatrix();

		// Actualizar selectores de color
		let top = cont.getBoundingClientRect().top;
		let c1 = document.getElementById("circle1");
		let c2 = document.getElementById("circle2");
		let cl1 = document.getElementById("UpColor");
		let cl2 = document.getElementById("DownColor");
		c1.style.top = top + alto/2 - 40 + "px";
		cl1.style.top = top + alto/2 - 40 + "px";
		c2.style.top = top + alto/2 + 20 + "px";
		cl2.style.top = top + alto/2 + 20 + "px";
	}
	// Establecer el callback en el listener
	window.addEventListener('resize', callback, false);
	return {
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}

THREEx.WindowResize.bind	= function(renderer, camera){
	return THREEx.WindowResize(renderer, camera);
}
