define(['gl', 'twgl'], function(gl, twgl)
{
	function FrameBuffer() {
		this.buffers = [twgl.createFramebufferInfo(gl), twgl.createFramebufferInfo(gl)];
		this.current = 0;
	}

	FrameBuffer.prototype.recordStop = function ()
	{
		twgl.bindFramebufferInfo(gl, null);
	};

	FrameBuffer.prototype.recordStart = function ()
	{
		twgl.bindFramebufferInfo(gl, this.buffers[this.current]);
	};

	FrameBuffer.prototype.getTexture = function ()
	{
		return this.buffers[this.current].attachments[0];
	};

	FrameBuffer.prototype.swap = function ()
	{
		this.current = (this.current + 1) % 2;
	};

	return FrameBuffer;
});
