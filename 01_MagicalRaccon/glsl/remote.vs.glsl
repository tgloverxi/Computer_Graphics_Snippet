// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 remotePosition;

void main() {
	/* HINT: WORK WITH remotePosition HERE! */

    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    vec3 shiftPosition = position +remotePosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(shiftPosition, 1.0);
}
