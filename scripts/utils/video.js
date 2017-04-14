define(['gl', 'engine/FrameBuffer', 'engine/Entity', 'assets', 'geometries/createFullScreenQuad', 'engine/uniforms'], function(gl, FrameBuffer, Entity, assets, createFullScreenQuad, uniforms) {

	function Video (videoSrc)
	{
		this.element = document.createElement('video');
		this.element.src = videoSrc;
		this.element.type = 'video/mp4';
		this.element.loop = true;
		this.element.autoplay = false;
		this.element.preload = 'auto';
		this.element.muted = true;
		this.element.load();

		this.frameRate = 30;
		this.delay = 1 / this.frameRate;
		this.start = 0;
		this.resolution = [1,1];

		this.texture = null;
		this.currentFrame = new FrameBuffer();
		this.previousFrame = new FrameBuffer();
		this.opticalFlowFrame = new FrameBuffer();
		this.frameFiredAt = 0;

		this.quadVideo = new Entity(createFullScreenQuad(), assets.shaders.Video);
		this.quadBuffer = new Entity(createFullScreenQuad(), assets.shaders.Buffer);
		this.quadOpticalFlow = new Entity(createFullScreenQuad(), assets.shaders.OpticalFlow);


		this.opticalFlowFrame.recordStart();
		gl.disable(gl.DEPTH_TEST);
		gl.disable(gl.CULL_FACE);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.clearColor(0,0,0,1);
		this.opticalFlowFrame.recordStop();
		this.opticalFlowFrame.swap();
		this.opticalFlowFrame.recordStart();
		gl.disable(gl.DEPTH_TEST);
		gl.disable(gl.CULL_FACE);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.clearColor(0,0,0,1);
		this.opticalFlowFrame.recordStop();
	}

	Video.prototype.isLoaded = function ()
	{
		return this.element.readyState > 3;
	};

	Video.prototype.isReady = function ()
	{
		return this.texture != null;
	};

	Video.prototype.createTexture = function ()
	{
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		this.resolution = [this.element.videoWidth, this.element.videoHeight];
};

	Video.prototype.update = function (time)
	{
		if (this.isLoaded())
		{
			// setup video teture
			if (this.isReady() == false)
			{
				this.createTexture();
				this.element.play();
			}

			// update gl texture
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.element);

			uniforms.u_video = this.texture;
			uniforms.u_videoResolution = this.resolution;

			if (this.frameFiredAt + this.delay < time) {
				this.frameFiredAt = time;

				uniforms.u_currentFrame = this.currentFrame.getTexture();
				uniforms.u_previousFrame = this.previousFrame.getTexture();

				this.previousFrame.recordStart();
				gl.disable(gl.DEPTH_TEST);
				gl.disable(gl.CULL_FACE);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.clearColor(0,0,0,1);
				this.quadBuffer.draw();
				this.previousFrame.recordStop();

				//

				this.currentFrame.recordStart();
				gl.disable(gl.DEPTH_TEST);
				gl.disable(gl.CULL_FACE);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.clearColor(0,0,0,1);
				this.quadVideo.draw();
				this.currentFrame.recordStop();

				//
				uniforms.u_opticalFlowFrame = this.opticalFlowFrame.getTexture();
				this.opticalFlowFrame.swap();

				this.opticalFlowFrame.recordStart();
				gl.disable(gl.DEPTH_TEST);
				gl.disable(gl.CULL_FACE);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.clearColor(0,0,0,1);
				this.quadOpticalFlow.draw();
				this.opticalFlowFrame.recordStop();
			}
		}
	}

	return Video;
});