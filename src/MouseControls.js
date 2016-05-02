/**
 * @author dmarcos / http://github.com/dmarcos
 *
 * This controls allow to change the orientation of the camera using the mouse
 */

THREE.MouseControls = function (object) {

	var me = this;
	var PI_2 = Math.PI / 2;

	var drag = false;

	me.enabled = true;

	var rotation = { x:0, y:0 };
	var lastPosition = { x:0, y:0 };
	var lastZoom = 1;

	function onMouseDown (event) {
		event.preventDefault();
		drag = true;
		lastPosition = getPosition(event);
	}

	function onMouseUp (event) {
		drag = false;
	}

	function onMouseMove (event) {
		if (me.enabled === false) return;
		if (!drag) return;

		var position = getPosition(event);
		var movementX = position.x - lastPosition.x;
		var movementY = position.y - lastPosition.y;
		lastPosition = position;

		var moveSpeed = 2/Math.min(window.innerWidth, window.innerHeight);

		rotation.y += movementX * moveSpeed;
		rotation.x += movementY * moveSpeed;
	}

	function onGestureChange (event) {
		event.preventDefault();

		var zoomChange = event.scale/lastZoom;
		lastZoom = event.scale;
		object.fov /= zoomChange;
		if (object.fov <   1) object.fov =   1;
		if (object.fov > 150) object.fov = 150;
		object.updateProjectionMatrix();
	}

	function onGestureStart (event) {
		event.preventDefault();

		lastZoom = 1;
	}

	function getPosition (event) {
		return {
			x: event.pageX,
			y: event.pageY
		}
	}

	me.update = function() {

		if (me.enabled === false) return;

		object.rotation.x += rotation.x;
		object.rotation.y += rotation.y;
		
		object.rotation.x = Math.max(-PI_2, Math.min(PI_2, object.rotation.x));

		rotation.x = 0;
		rotation.y = 0;

		return;

	};

	me.dispose = function() {

		document.removeEventListener('mousedown', onMouseDown, false);
		document.removeEventListener('mouseup',   onMouseUp,   false);
		document.removeEventListener('mousemove', onMouseMove, false);

	}

	document.addEventListener('mousedown',     onMouseDown, false);
	document.addEventListener('mouseup',       onMouseUp,   false);
	document.addEventListener('mousemove',     onMouseMove, false);

	document.addEventListener('touchstart',    onMouseDown, false);
	document.addEventListener('touchend',      onMouseUp,   false);
	document.addEventListener('touchmove',     onMouseMove, false);

	document.addEventListener('gesturestart',  onGestureStart,  false);
	document.addEventListener('gesturechange', onGestureChange, false);

};
