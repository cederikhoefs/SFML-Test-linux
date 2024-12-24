#version 410

uniform int screenx;
uniform int screeny;

uniform float scalex;
uniform float scaley;

uniform vec3 viewport;

uniform int thickness;
uniform int mode;
uniform int iterations;

uniform float a;

uniform float margin;

uniform mat4x4 functionx;
uniform mat4x4 functiony;

vec2 P(in vec2 pos){
	return vec2(-pos.x -pos.y, pos.x*pos.y);
}

vec2 pq(in vec2 pos){
	return vec2(-pos.x/2 + sqrt(pos.x*pos.x/4-pos.y), -pos.x/2 - sqrt(pos.x*pos.x/4-pos.y));
}

vec3 P3(in vec3 pos){
	return vec3(-pos.x -pos.y -pos.z, pos.x*pos.y+pos.y*pos.z+pos.z*pos.x, -pos.x*pos.y*pos.z);
}

vec2 M(in vec2 pos, in vec2 pos0){
	return vec2(pos.x*pos.x-pos.y*pos.y+pos0.x,2*pos.x*pos.y+pos0.y);
}

vec2 C(in vec2 pos){
	float a = float(pos.x);
	float b = float(pos.y);
	vec4 powx = vec4(1, a, a*a, a*a*a);
	vec4 powy = vec4(1, b, b*b, b*b*b);

	return vec2(dot(functionx*powx, powy), dot(functiony*powx,powy));
}

vec2 P1(in vec2 pos){
	return vec2(-pos.x*pos.x+pos.y*pos.y-pos.x,2*pos.x*pos.y-pos.y);
}

vec4 variety()
{

	float relative_x = gl_FragCoord.x / float(screenx);
	float relative_y = gl_FragCoord.y / float(screeny);
	
	float dx = float(thickness)/2.0*scalex/float(screenx);
	float dy = float(thickness)/2.0*scaley/float(screeny);

	vec3 pos = vec3(vec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy, viewport.z);
	vec3 posdx = pos + vec3(dx, 0, 0);
	vec3 pos_dx = pos - vec3(dx, 0, 0);
	vec3 posdy = pos + vec3(0, dy, 0);
	vec3 pos_dy = pos - vec3(0, dy, 0);


	for(int k = 0; k < iterations; k++){
		
		posdx = P3(posdx);
		pos_dx = P3(pos_dx);
		posdy = P3(posdy);
		pos_dy = P3(pos_dy);

		if ((posdx.x-a) * (pos_dx.x-a) < 0.0 || (posdy.x-a) * (pos_dy.x-a) < 0.0) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
			return vec4(0, 0, 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}

vec4 coloringmain()
{

	float relative_x = gl_FragCoord.x / float(screenx);
	float relative_y = gl_FragCoord.y / float(screeny);
	
	float dx = thickness/2.0*scalex/float(screenx);
	float dy = thickness/2.0*scaley/float(screeny);

	vec3 pos = vec3(vec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy, viewport.z);

	for(int k = 0; k < iterations; k++){
	
		pos = P3(pos);
	
		if (length(pos) > 10000) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			return vec4(1.0/sqrt(float(k)), 0, 0, 1);
		
		}
		else if(abs(pos.y) < margin ){
			return vec4(0, 1.0/sqrt(float(k)), 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}

vec4 combined()
{

	float relative_x = gl_FragCoord.x / float(screenx);
	float relative_y = gl_FragCoord.y / float(screeny);
	
	float dx = float(thickness)/2.0*scalex/float(screenx);
	float dy = float(thickness)/2.0*scaley/float(screeny);

	vec3 pos = vec3(vec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy, viewport.z);
	vec3 posdx = pos + vec3(dx, 0, 0);
	vec3 pos_dx = pos - vec3(dx, 0, 0);
	vec3 posdy = pos + vec3(0, dy, 0);
	vec3 pos_dy = pos - vec3(0, dy, 0);

	for(int k = 0; k < iterations; k++){
		
		pos = P3(pos);
		posdx = P3(posdx);
		pos_dx = P3(pos_dx);
		posdy = P3(posdy);
		pos_dy = P3(pos_dy);

		if ((posdx.x-a) * (pos_dx.x-a) < 0.0 || (posdy.x-a) * (pos_dy.x-a) < 0.0) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
			return vec4(1.0, 0.6, 0, 1);
		}
//		else if ((posdx.x - 1.0) * (pos_dx.x - 1.0) < 0.0 || (posdy.x - 1.0) * (pos_dy.x - 1.0) < 0.0){
//			vec4 ret = (k % 2 == 1) ? vec4(1, 0, 0, 1) : vec4(1, 0, 1, 1);
//			return ret;
//		}
		else if (length(pos) > 1000) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			return vec4(1.0/sqrt(float(k)), 0, 0, 1);
		
		}
		else if(abs(pos.y) < margin ){
			return vec4(0, 1.0/sqrt(float(k)), 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}

vec4 dreieck(){


	float relative_x = gl_FragCoord.x / float(screenx);
	float relative_y = gl_FragCoord.y / float(screeny);
	
	float dx = thickness/2.0*scalex/float(screenx);
	float dy = thickness/2.0*scaley/float(screeny);

	vec3 pos = vec3(vec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy, viewport.z);
	vec3 posdx = pos + vec3(dx, 0, 0);
	vec3 pos_dx = pos - vec3(dx, 0, 0);
	vec3 posdy = pos + vec3(0, dy, 0);
	vec3 pos_dy = pos - vec3(0, dy, 0);

	for(int k = 0; k < iterations; k++){
	
		pos = P3(pos);
		posdx = P3(posdx);
		pos_dx = P3(pos_dx);
		posdy = P3(posdy);
		pos_dy = P3(pos_dy);

//		if ((posdx.x-a) * (pos_dx.x-a) < 0.0 || (posdy.x-a) * (pos_dy.x-a) < 0.0) {
//
//			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
//			//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
//			return vec4(1.0, 0.6, 0, 1);
//		}
//

		if ((abs(posdx.y)-a) * (abs(pos_dx.y)-a) < 0.0 || (abs(posdy.y)-a) * (abs(pos_dy.y)-a) < 0.0) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
			return vec4(1.0, 0.6, 0, 1);
		}


		if(abs(pos.x)>1.0)
			return vec4(1,1,1,1);

	}

	return vec4(0,0,1,1);

}


vec4 mandelbrot(){


	float relative_x = gl_FragCoord.x / float(screenx);
	float relative_y = gl_FragCoord.y / float(screeny);
	
	float dx = thickness/2.0*scalex/float(screenx);
	float dy = thickness/2.0*scaley/float(screeny);

	vec2 pos0 = vec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy;
	vec2 pos = pos0;

	for(int k = 0; k < iterations; k++){
	
		//pos = M(pos, pos0);
		pos = P1(pos);
		if(length(pos) > 2.0)
			return vec4(1, 1, 1, 1);
	
	}

	return vec4(0,0,0,1);

}


vec4 custom(){

	float relative_x = gl_FragCoord.x / float(screenx);
	float relative_y = gl_FragCoord.y / float(screeny);
	
	float dx = float(thickness)/2.0*scalex/float(screenx);
	float dy = float(thickness)/2.0*scaley/float(screeny);

	vec2 pos = vec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy;
	vec2 posdx = pos + vec2(dx, 0);
	vec2 pos_dx = pos - vec2(dx, 0);
	vec2 posdy = pos + vec2(0, dy);
	vec2 pos_dy = pos - vec2(0, dy);

	for(int k = 0; k < iterations; k++){

		pos = C(pos);
		posdx = C(posdx);
		pos_dx = C(pos_dx);
		posdy = C(posdy);
		pos_dy = C(pos_dy);

		if ((posdx.x-a) * (pos_dx.x-a) < 0.0 || (posdy.x-a) * (pos_dy.x-a) < 0.0) {

			//gl_FragColor = texture2D(color, dvec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, dvec2(float(k)/float(maxiter),0));
			return vec4(1.0, 0.6, 0, 1);
		}
//		if (length(pos) > 1000) {
//
//			return vec4(1.0/sqrt(float(k)), 0, 0, 1);
//		
//		}
//		else if(abs(pos.y) < margin ){
//			return vec4(0, 1.0/sqrt(float(k)), 0, 1);
//		}
//
	}

	return vec4(1,1,1,1);
    
}

 vec4 oldie()
{

	float relative_x = gl_FragCoord.x / float(screenx);
	float relative_y = gl_FragCoord.y / float(screeny);
	
	float dx = float(thickness)/2.0*scalex/float(screenx);
	float dy = float(thickness)/2.0*scaley/float(screeny);

	vec2 pos = vec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy;
	vec2 posdx = pos + vec2(dx, 0);
	vec2 pos_dx = pos - vec2(dx, 0);
	vec2 posdy = pos + vec2(0, dy);
	vec2 pos_dy = pos - vec2(0, dy);

	for(int k = 0; k < iterations; k++){
		
		posdx = P(posdx);
		pos_dx = P(pos_dx);
		posdy = P(posdy);
		pos_dy = P(pos_dy);

		if  ((length(posdx) - 1.0) * (length(pos_dx) - 1.0) < 0.0 || (length(posdy)-1.0) * (length(pos_dy) - 1.0) < 0.0){
			return vec4(0, 0, 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}

void main(){

	switch(mode){
	case 0:
	{
		gl_FragColor = variety();
		break;
	}
	
	case 1:
	{
		gl_FragColor = coloringmain();
		break;
	}
	case 2:
	{
		gl_FragColor = combined();
		break;
	}
	case 3:
	{
		gl_FragColor = dreieck();
		break;
	}

	case 4:
	{
		gl_FragColor = mandelbrot();
		break;
	}

	case 5:
	{
		gl_FragColor = custom();
		break;
	}

	case 6:
	{
		gl_FragColor = oldie();
		break;
	}
	
	default:
		gl_FragColor = vec4(0, 0, 0, 0);
		break;
	}
}
