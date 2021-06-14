varying vec4 V_Color;

uniform vec3 lightColorUni;
uniform vec3 ambientColorUni;
uniform vec3 lightPositionUni;
uniform vec3 baseColorUni;
uniform float kAmbientUni;
uniform float kDiffuseUni;
uniform float kSpecularUni;
uniform float shininessUni;


void main() {
	// COMPUTE COLOR ACCORDING TO GOURAUD HERE
//Every vector need to be normalized	
vec3 ambient = kAmbientUni * ambientColorUni;
vec3 N = normalize(normalMatrix * normal);	

vec4 newPos = modelViewMatrix * vec4(position,1.0);
//vec3 L = normalize((viewMatrix * vec4(lightPositionUni, 1.0)).xyz - newPos.xyz);
//what is the exact meaning of the forth entry in vec4?
vec3 L = normalize(vec3(viewMatrix * vec4(lightPositionUni, 0.0)));
vec3 diffuse = kDiffuseUni * baseColorUni *lightColorUni* max(0.0, dot(N,L));

vec3 V = normalize(vec3(0.0)-newPos.xyz);
vec3 R = reflect(-L, N);
vec3 specular = kSpecularUni * pow(max(0.0,dot(R,V)),shininessUni)* lightColorUni ;
V_Color = vec4(ambient + diffuse + specular, 1.0);
// Position
gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);

}