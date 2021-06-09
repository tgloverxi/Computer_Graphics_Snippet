
// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
varying vec3 interpolatedNormal;
varying float my_distance;
uniform int rcState;
uniform float clock;
uniform vec2  u_resolution;
/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */

float rand(vec3 co){
    return fract(sin(dot(co.xyz ,vec3(12.9898,78.233,144.7272))) * 43758.5453);
}

void main() {

vec3 colorA = vec3(0.498,1.000,0.831);
vec3 colorB = vec3(0.576,0.439,0.859);
vec3 colorC = vec3(1.000,0.549,0.000);
vec3 colorD = vec3(1.000,1.000, 0.000);
// Set final rendered color according to the surface normal
if((rcState == 4)){
  gl_FragColor = vec4(normalize(interpolatedNormal), 1.0);
}else if (rcState == 5){
  //change the color over time;
  //Reference: https://thebookofshaders.com/06/ 
  vec3 color = vec3(0.0);
  float pct = abs(sin(clock));
  vec2 st = gl_FragCoord.xy/u_resolution;
  if(st.x <1.0 && st.y <1.0){
     // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
  }else if(st.x<1.0 && st.y >=1.0){
    color = mix(colorD, colorC,pct);
    gl_FragColor = vec4(color,1.0);
  }else if (st.x>=1.0 && st.y <1.0){
    color = mix(colorC, colorD, pct);

    gl_FragColor = vec4(color,1.0);

  }else{
    color = mix(colorB, colorA, pct);

    gl_FragColor = vec4(color,1.0);
  }
   
    
}else if (rcState == 6 || rcState == 7){
gl_FragColor = vec4(normalize(interpolatedNormal), 1.0); // REPLACE ME
}//else if(rcState == 8) {
  //vec3 i = floor(interpolatedNormal);
  //vec3 f = fract(interpolatedNormal);
  //vec3 u = f * f * (3.0-2.0*f);
  //float nosie = mix(rand(i), rand(i + 1.0), u.x);
  //gl_FragColor = vec4(vec3(noise), 1.0);}
else{
  //part1(d)
  if (my_distance < 1.7){
    gl_FragColor = vec4(1.0,0.9,0.0, 1.0);
  }else {
     gl_FragColor = vec4(normalize(interpolatedNormal), 1.0); // REPLACE ME
  }
}
 
  
}
