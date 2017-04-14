varying vec2 v_texCoord;
uniform sampler2D u_video;

void main() {
	vec2 uv = v_texCoord;
	vec4 video = texture2D(u_video, uv);
	float angle = luminance(video.rgb)*PI2;
	vec2 offset = vec2(cos(angle), sin(angle)) * 1.0 / 32.0;
	video = texture2D(u_video, uv);
	// gl_FragColor = vec4(cos(u_time + uv.x)*0.5+0.5, 0,0,1);
	gl_FragColor = video;
}
