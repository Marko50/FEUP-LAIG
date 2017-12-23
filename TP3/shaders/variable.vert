#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float timeFactor;


void main() {
	vec4 vertex=vec4(aVertexPosition+aVertexNormal*timeFactor, 1.0);
	gl_Position = uPMatrix * uMVMatrix * vertex;
}
