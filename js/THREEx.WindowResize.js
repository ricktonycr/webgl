// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: Start updating renderer and camera
//
// ```windowResize.stop()```
// # Code

//

/** @namespace */
var THREEx	= THREEx 		|| {};
var ancho = 1024;
var alto  = 300;

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
THREEx.WindowResize	= function(renderer, camera){
	var callback	= function(){
		var cont = document.getElementById("container");
		ancho = cont.offsetWidth;
		alto = cont.offsetHeight;
		console.log(alto);
		// notify the renderer of the size change
		renderer.setSize( ancho, alto );
		// update the camera
		camera.aspect	= ancho / alto;
		camera.updateProjectionMatrix();
	}
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}

THREEx.WindowResize.bind	= function(renderer, camera){
	return THREEx.WindowResize(renderer, camera);
}
