varying vec2 v_texCoord;
uniform sampler2D u_video;
uniform sampler2D u_currentFrame;
uniform sampler2D u_previousFrame;
uniform sampler2D u_opticalFlowFrame;

void main() {
	vec2 uv = v_texCoord;
	vec4 current = texture2D(u_currentFrame, uv);
	vec4 previous = texture2D(u_previousFrame, uv);
	vec4 opticalFlow = texture2D(u_opticalFlowFrame, uv);
	gl_FragColor = abs(opticalFlow);
	// gl_FragColor.rgb *= step(0.1, abs(luminance(current.rgb) - luminance(previous.rgb)));
}
