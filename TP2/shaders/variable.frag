#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;
uniform float timeFactor2;
uniform vec3 initialColor;
uniform vec3 finalColor;

void main() {
	vec3 aux = initialColor*timeFactor + finalColor*timeFactor2;
	gl_FragColor = vec4(aux,1.0);
}
