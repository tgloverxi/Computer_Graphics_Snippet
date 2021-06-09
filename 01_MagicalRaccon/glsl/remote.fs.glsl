uniform int rcState;


void main() {
	// HINT: WORK WITH rcState HERE

   //Paint it red
    float r = 1.0;
	float g = 0.0;
	float b = 0.0;
	float t = 1.0;

    if(rcState == 1){
		//green
		r = 0.0;
		g = 1.0;
		b = 0.0;
	} else if (rcState == 2){
		//blue
		r = 0.0;
		g = 0.0;
		b = 1.0;
	} else if (rcState == 3){
		//yellow
		r = 1.0;
		g = 1.0;
		b = 0.0;
	} 

	
    gl_FragColor = vec4(r,g,b,t);


}