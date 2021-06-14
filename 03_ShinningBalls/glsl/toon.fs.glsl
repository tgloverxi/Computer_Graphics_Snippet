varying vec3 V_Normal_VCS;
varying vec3 V_ViewPosition;

uniform vec3 lightColorUni;
uniform vec3 ambientColorUni;
uniform vec3 lightPositionUni;
uniform float kAmbientUni;
uniform float kDiffuseUni;
uniform float kSpecularUni;
uniform float shininessUni;
uniform vec3 baseColorUni;

void main() {

// COMPUTE LIGHTING HERE
vec3 ambient = kAmbientUni * ambientColorUni;

// change color based on the intensity;
vec3 L = normalize(vec3(viewMatrix * vec4(lightPositionUni, 0.0)));
float intensity = max(0.0, dot(V_Normal_VCS,L));

vec3 color = vec3(0.0,0.0,0.0);
if(intensity > 0.75){
    color = vec3(1.0, 0.5,0.5);
}else if (intensity>0.5){
    color = vec3(0.75, 0.375,0.375);
}else if (intensity > 0.25){
    color = vec3(0.5, 0.25,0.25);
}else {
    color = vec3(0.25, 0.125,0.125);
}


gl_FragColor = vec4(color, 1.0);

 
}