varying vec2 texCoord;
uniform sampler2D textureUni;
//attribute vec2 uv;


void main() {
	
//ADJUST THIS FILE TO SEND PROPER DATA TO THE FRAGMENT SHADER
texCoord = uv;

// Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
