varying vec3 V_Normal_VCS;
varying vec3 V_ViewPosition;

void main() {

	// ADJUST THESE VARIABLES TO PASS PROPER DATA TO THE FRAGMENTS
	V_Normal_VCS = normalize(normalMatrix * normal);
	V_ViewPosition = (modelViewMatrix * vec4(position,1.0)).xyz;

	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}