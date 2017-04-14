define(['gl', 'twgl'], function(gl, twgl)
{
	function FrameBuffer() {
		this.buffer = twgl.createFramebufferInfo(gl);
	}

	FrameBuffer.prototype.recordStop = function ()
	{
		twgl.bindFramebufferInfo(gl, null);
	};

	FrameBuffer.prototype.recordStart = function ()
	{
		twgl.bindFramebufferInfo(gl, this.buffer);
	};

	FrameBuffer.prototype.getTexture = function ()
	{
		return this.buffer.attachments[0];
	};

	return FrameBuffer;
});
