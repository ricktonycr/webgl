/** @namespace */
var THREEx	= THREEx || {};
var ancho = 1024;
var alto  = 300;

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
		console.log(alto);
		// Notificar al renderizador de los nuevos tamaños
		renderer.setSize( ancho, alto );
		// Actualizar cámara
		camera.aspect	= ancho / alto;
		camera.updateProjectionMatrix();
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
