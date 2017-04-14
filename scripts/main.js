define(['gl', 'twgl', 'assets', 'engine/Camera', 'engine/Entity', 'engine/FrameBuffer', 'engine/uniforms', 'entities/createCube', 'entities/createGrid', 'geometries/createAxis', 'geometries/createCube', 'geometries/createFullScreenQuad', 'geometries/createGridParticles', 'geometries/createLeavesFromPoints', 'utils/getTime', 'utils/input', 'utils/video'],
function (gl, twgl, assets, Camera, Entity, FrameBuffer, uniforms, createCubeEntity, createGridEntity, createAxisGeometry, createCubeGeometry, createFullScreenQuadGeometry, createGridParticlesGeometry, createLeavesFromPoints, getTime, input, Video) {
	"use strict";

	return assets.load(function() {
		var camera = new Camera();

		function onWindowResize() {
			twgl.resizeCanvasToDisplaySize(gl.canvas);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			uniforms.u_resolution = [gl.canvas.width, gl.canvas.height];
			camera.updateProjectionMatrix();
		}
		onWindowResize();
		window.addEventListener('resize', onWindowResize);

		var frameBuffer = new FrameBuffer();
		uniforms.u_frameBuffer = frameBuffer.getTexture();

		var fullScreenQuadEntity = new Entity(createFullScreenQuadGeometry(), assets.shaders.MeshFullScreen);

		var video = new Video("videos/fillon.mp4");

		function render()
		{
			requestAnimationFrame(render);

			var time = getTime();
			uniforms.u_time = time;

			// logic
			input.mouse.update();
			camera.update(time);
			video.update(time);

			// draw
			frameBuffer.recordStart();

			gl.enable(gl.DEPTH_TEST);
			gl.disable(gl.CULL_FACE);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.clearColor(0,0,0,1);

			frameBuffer.recordStop();

			// post fx & GUI
			gl.disable(gl.DEPTH_TEST);
			fullScreenQuadEntity.draw();
		}

		requestAnimationFrame(render);
	});
});
