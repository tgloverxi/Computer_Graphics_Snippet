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

//vec3 N = V_Normal_VCS;	
//vec4 newPos = V_ViewPosition;
//vec3 L = normalize((viewMatrix * vec4(lightPositionUni, 1.0)).xyz - V_ViewPosition);
//what is the exact meaning of the forth entry in vec4?

vec3 L = normalize(vec3(viewMatrix * vec4(lightPositionUni, 0.0)));
vec3 diffuse = kDiffuseUni * baseColorUni * lightColorUni * max(0.0, dot(V_Normal_VCS,L));

vec3 V = normalize(vec3(0.0)-V_ViewPosition);
vec3 H = normalize((L+V)*0.5);

//vec3 R = reflect(-L, V_Normal_VCS);
vec3 specular = kSpecularUni * pow(max(0.0,dot(V_Normal_VCS, H)),shininessUni)* lightColorUni ;

gl_FragColor = vec4(ambient + diffuse + specular, 1.0);

 
}