function GLDomeLib() {
	var stats, container, camSky, camUser;
	var camFisheye, sceneFisheye, fisheyeReflector;
	var renderer, control1, control2;

	var width = window.innerWidth;
	var height = window.innerHeight;
	var size = Math.min(width, height);

	var me = {
		maxDuration: false,
		on: on
	}

	window.addEventListener('load', start);
	window.addEventListener('resize', onResize);

	function start() {
		stats = new Stats();
		stats.showPanel(0);
		document.body.appendChild(stats.dom);

		me.scene = new THREE.Scene();
		sceneFisheye = new THREE.Scene();

		startTime = Date.now();

		initContainer();
		initCameras();

		dispatch('init');

		initRenderer();

		drawFrame();
	}

	function initContainer() {
		container = document.createElement('div');
		document.body.appendChild(container);
	}

	function initCameras() {
		camUser = new THREE.PerspectiveCamera(80, width/height, 1, 3000);
		camUser.lookAt(new THREE.Vector3(10, 0, 0));
		control1 = new THREE.DeviceOrientationControls(camUser);
		control2 = new THREE.MouseControls(camUser);

		me.scene.add(camUser);

		camSky = new THREE.CubeCamera(1, 3000, 2048);
		camSky.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		camSky.lookAt(new THREE.Vector3(0, 10, 0));
		me.scene.add(camSky);

		sceneFisheye = new THREE.Scene();
		camFisheye = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 1000000, 1001000);
		camFisheye.position.z = 1000001;
		camFisheye.lookAt(new THREE.Vector3(0, 0, 0))
		sceneFisheye.add(camFisheye);

		var material = new THREE.MeshBasicMaterial({envMap:camSky.renderTarget});
		//var material = new THREE.MeshNormalMaterial({wireframe:true});

		var points = [];
		var n = 80;
		for (var i = 0; i <= n; i++) {
			var y = (i-0.5)/(n-2);
			if (y < 0) y = 0;
			var x = -Math.log(Math.cos(y))/Math.tan(1);
			points.push(new THREE.Vector3(y/2+1e-10, x/2, 0))
		}

		fisheyeReflector = new THREE.LatheGeometry(points, Math.round(n*Math.PI));
		fisheyeReflector = new THREE.Mesh(fisheyeReflector, material);
		fisheyeReflector.scale.set(size, size, size);
		fisheyeReflector.rotation.x = -Math.PI/2;
		fisheyeReflector.updateMatrix();
		
		sceneFisheye.add(fisheyeReflector);
	}

	function initRenderer() {
		renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setClearColor(0x000000);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		renderer.sortObjects = false;

		container.appendChild(renderer.domElement);
	}
	
	function render() {
		if (size < 1500) {
			// user perspective
			renderer.render(me.scene, camUser);
		} else {
			// fisheye projection
			camSky.updateCubeMap(renderer, me.scene);
			renderer.render(sceneFisheye, camFisheye);
		}
		
	}

	function drawFrame() {
		stats.begin();
		control1.update();
		control2.update();
		dispatch('frame');
		render();
		stats.end();

		if (me.maxDuration) {
			if (Date.now() < startTime+me.maxDuration*1000) requestAnimationFrame(drawFrame);
		} else {
			requestAnimationFrame(drawFrame);
		}
	}

	function onResize() {
		width = window.innerWidth;
		height = window.innerHeight;
		size = Math.min(width, height);
		mode = (size < 2000) ? 'user' : 'fisheye';

		camUser.aspect = width/height;
		camUser.updateProjectionMatrix();
		camUser.updateMatrix();

		camFisheye.left = -width/2;
		camFisheye.right = width/2;
		camFisheye.top = height/2;
		camFisheye.bottom = -height/2;
		camFisheye.updateProjectionMatrix();
		camFisheye.updateMatrix();

		renderer.setSize(width, height);

		fisheyeReflector.scale.set(size, size, size);
		fisheyeReflector.updateMatrix();
	}

	var eventMap = {};
	function on(eventName, cb) {
		if (!eventMap[eventName]) eventMap[eventName] = [];
		eventMap[eventName].push(cb);
	}

	function dispatch(eventName) {
		var eventList = eventMap[eventName];
		if (!eventList) return;
		eventList.forEach(function (cb) {
			cb.call(me);
		});
	}

	return me;
}



