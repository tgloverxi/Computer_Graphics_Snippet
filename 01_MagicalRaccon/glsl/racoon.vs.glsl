// Create shared variable for the vertex and fragment shaders
varying vec3 interpolatedNormal;
varying float my_distance;
uniform vec3 remotePosition;
uniform float scale;
uniform float speed;
uniform float clock;
uniform int rcState;
uniform float time;
uniform float freq;
uniform float amp;
/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */

void main() {
    // Set shared variable to vertex normal
    interpolatedNormal = normal;
    mat3 remoteScale = mat3(4.0,0.0,0.0,
                            0.0,4.0,0.0,
                            0.0,0.0,4.0);

    if(rcState == 4){
        mat3 newScale = mat3(scale, 0.0,0.0,
                               0.0,scale,0.0,
                               0.0,0.0, scale);
        mat3 rotationMatrix = mat3(cos(time),0,sin(time),
                            0,1.0,0,
                            -sin(time),0,cos(time));

        vec3 newPosition = newScale * rotationMatrix * vec3(position.x, position.y,position.z);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }else if(rcState == 6){

    float h = amp * sin(freq * position.z + time);
    float xh = amp * abs(sin(freq * position.z + time));
    vec3 newPosition = remoteScale * position ;
    newPosition.z += h;
    newPosition.x += xh;
    //newPosition.y += h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    }else if (rcState == 7){
        //reference: https://learnopengl.com/Advanced-OpenGL/Geometry-Shader
        //explosion effect

        vec3 newPosition = remoteScale * interpolatedNormal * sin(time) + remoteScale * position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    }else{


// Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    //part1(a)
    
    vec3 newPosition = remoteScale * vec3(position.x, position.y, position.z-0.58);
    vec4 newWorldPosition = modelMatrix * vec4(newPosition,1.0);
    my_distance = distance(remotePosition, newWorldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
    
    
}
