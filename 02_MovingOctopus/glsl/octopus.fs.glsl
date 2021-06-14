
varying vec4 v_Color;
void main() {
  // Set final rendered color according to the surface normal
  //vec3(1.0,0.0,0.0)
  gl_FragColor = v_Color;
  //gl_FragColor = vec4( 0.5 * normalize( interpolatedNormal ) + 0.5, 1.0 );

}
