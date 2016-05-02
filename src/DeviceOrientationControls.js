/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function( object ) {

	var me = this;

	me.object = object;
	me.object.rotation.reorder( "YXZ" );

	me.enabled = true;

	me.deviceOrientation = {};
	me.screenOrientation = 0;

	me.alpha = 0;
	me.alphaOffsetAngle = 0;

	var onDeviceOrientationChangeEvent = function( event ) {
		me.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function() {

		me.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function() {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		}

	}();

	me.connect = function() {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		me.enabled = true;

	};

	me.disconnect = function() {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		me.enabled = false;

	};

	me.update = function() {

		if ( me.enabled === false ) return;
		if (!me.deviceOrientation) return;
		if (!me.deviceOrientation.alpha) return;

		var alpha = me.deviceOrientation.alpha ? THREE.Math.degToRad( me.deviceOrientation.alpha ) + me.alphaOffsetAngle : 0; // Z
		var beta = me.deviceOrientation.beta ? THREE.Math.degToRad( me.deviceOrientation.beta ) : 0; // X'
		var gamma = me.deviceOrientation.gamma ? THREE.Math.degToRad( me.deviceOrientation.gamma ) : 0; // Y''
		var orient = me.screenOrientation ? THREE.Math.degToRad( me.screenOrientation ) : 0; // O

		if (beta < Math.PI/2) return;

		setObjectQuaternion( me.object.quaternion, alpha, beta, gamma, orient );
		me.alpha = alpha;

	};

	me.updateAlphaOffsetAngle = function( angle ) {

		me.alphaOffsetAngle = angle;
		me.update();

	};

	me.dispose = function() {

		me.disconnect();

	};

	me.connect();

};
