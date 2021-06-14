// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
varying vec2 texCoord;
uniform sampler2D textureUni;

void main() {

	// LOOK UP THE COLOR IN THE TEXTURE

vec4 texColor = texture2D(textureUni, texCoord);
  // Set final rendered color according to the surface normal

gl_FragColor = texColor;
}
