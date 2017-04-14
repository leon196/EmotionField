varying vec2 v_texCoord;
uniform sampler2D u_currentFrame;

void main() {
	vec2 uv = v_texCoord;
	vec4 frame = texture2D(u_currentFrame, uv);
	gl_FragColor = frame;
}
