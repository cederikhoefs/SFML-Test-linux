#version 130

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

dvec2 P(in dvec2 pos){
	return dvec2(-pos.x -pos.y, pos.x*pos.y);
}

dvec2 pq(in dvec2 pos){
	return dvec2(-pos.x/2 + sqrt(pos.x*pos.x/4-pos.y), -pos.x/2 - sqrt(pos.x*pos.x/4-pos.y));
}

dvec3 P3(in dvec3 pos){
	return dvec3(-pos.x -pos.y -pos.z, pos.x*pos.y+pos.y*pos.z+pos.z*pos.x, -pos.x*pos.y*pos.z);
}

dvec2 M(in dvec2 pos, in dvec2 pos0){
	return dvec2(pos.x*pos.x-pos.y*pos.y+pos0.x,2*pos.x*pos.y+pos0.y);
}

dvec2 C(in dvec2 pos){

	float a = float(pos.x);
	float b = float(pos.y);
	vec4 powx = vec4(1, a, a*a, a*a*a);
	vec4 powy = vec4(1, b, b*b, b*b*b);

	return dvec2(dot(functionx*powx, powy), dot(functiony*powx,powy));
}

dvec2 P1(in dvec2 pos){
	return dvec2(-pos.x*pos.x+pos.y*pos.y-pos.x,2*pos.x*pos.y-pos.y);
}

vec4 variety()
{

	double relative_x = gl_FragCoord.x / double(screenx);
	double relative_y = gl_FragCoord.y / double(screeny);
	
	double dx = double(thickness)/2.0*scalex/double(screenx);
	double dy = double(thickness)/2.0*scaley/double(screeny);

	dvec3 pos = dvec3(dvec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy, viewport.z);
	dvec3 posdx = pos + dvec3(dx, 0, 0);
	dvec3 pos_dx = pos - dvec3(dx, 0, 0);
	dvec3 posdy = pos + dvec3(0, dy, 0);
	dvec3 pos_dy = pos - dvec3(0, dy, 0);


	for(int k = 0; k < iterations; k++){
		
		posdx = P3(posdx);
		pos_dx = P3(pos_dx);
		posdy = P3(posdy);
		pos_dy = P3(pos_dy);

		if ((sign(posdx.x-a) != sign(pos_dx.x-a)) || (sign(posdy.x-a) != sign(pos_dy.x-a))) {

			//gl_FragColor = texture2D(color, dvec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, dvec2(float(k)/float(maxiter),0));
			return vec4(0, 0, 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}

vec4 coloringmain()
{

	double relative_x = gl_FragCoord.x / double(screenx);
	double relative_y = gl_FragCoord.y / double(screeny);
	
	double dx = thickness/2.0*scalex/double(screenx);
	double dy = thickness/2.0*scaley/double(screeny);

	dvec3 pos = dvec3(dvec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy, viewport.z);

	for(int k = 0; k < iterations; k++){
	
		pos = P3(pos);
	
		if (length(pos) > 100) {

			//gl_FragColor = texture2D(color, dvec2(float(k)/float(iterations),0));
			return vec4(1.0/sqrt(float(k)/2.0), 0, 0, 1);
		
		}
		else if(abs(pos.y) < margin ){
			return vec4(0, 1.0/sqrt(sqrt(float(k)/2.0)), 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}

vec4 combined()
{

	double relative_x = gl_FragCoord.x / double(screenx);
	double relative_y = gl_FragCoord.y / double(screeny);
	
	double dx = double(thickness)/2.0*scalex/double(screenx);
	double dy = double(thickness)/2.0*scaley/double(screeny);

	dvec3 pos = dvec3(dvec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy, viewport.z);
	dvec3 posdx = pos + dvec3(dx, 0, 0);
	dvec3 pos_dx = pos - dvec3(dx, 0, 0);
	dvec3 posdy = pos + dvec3(0, dy, 0);
	dvec3 pos_dy = pos - dvec3(0, dy, 0);

	for(int k = 0; k < iterations; k++){
		
		pos = P3(pos);
		posdx = P3(posdx);
		pos_dx = P3(pos_dx);
		posdy = P3(posdy);
		pos_dy = P3(pos_dy);

		if ((sign(posdx.x-a) != sign(pos_dx.x-a)) || (sign(posdy.x-a) != sign(pos_dy.x-a))) {

			//gl_FragColor = texture2D(color, dvec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, dvec2(float(k)/float(maxiter),0));
			return vec4(1.0, 0.6, 0, 1);
		}
//		else if ((posdx.x - 1.0) * (pos_dx.x - 1.0) < 0.0 || (posdy.x - 1.0) * (pos_dy.x - 1.0) < 0.0){
//			vec4 ret = (k % 2 == 1) ? vec4(1, 0, 0, 1) : vec4(1, 0, 1, 1);
//			return ret;
//		}
				if (length(pos) > 100) {

			//gl_FragColor = texture2D(color, dvec2(float(k)/float(iterations),0));
			return vec4(1.0/sqrt(float(k)/2.0), 0, 0, 1);
		
		}
		else if(abs(pos.y) < margin ){
			return vec4(0, 1.0/sqrt(sqrt(float(k)/2.0)), 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}

vec4 dreieck(){


	double relative_x = gl_FragCoord.x / double(screenx);
	double relative_y = gl_FragCoord.y / double(screeny);
	
	double dx = thickness/2.0*scalex/double(screenx);
	double dy = thickness/2.0*scaley/double(screeny);

	dvec3 pos = dvec3(dvec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy, viewport.z);
	dvec3 posdx = pos + dvec3(dx, 0, 0);
	dvec3 pos_dx = pos - dvec3(dx, 0, 0);
	dvec3 posdy = pos + dvec3(0, dy, 0);
	dvec3 pos_dy = pos - dvec3(0, dy, 0);

	bool drin = true;

	for(int k = 0; k < iterations; k++){
	
		pos = P3(pos);
		posdx = P3(posdx);
		pos_dx = P3(pos_dx);
		posdy = P3(posdy);
		pos_dy = P3(pos_dy);

		if ((sign(posdx.x-a) != sign(pos_dx.x-a)) || (sign(posdy.x-a) != sign(pos_dy.x-a))) {

			//gl_FragColor = texture2D(color, dvec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, dvec2(float(k)/float(maxiter),0));
			return vec4(1.0, 0.6, 0, 1);
		}
//		if ((posdx.x-a) * (pos_dx.x-a) < 0.0 || (posdy.x-a) * (pos_dy.x-a) < 0.0) {
//
//			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
//			//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
//			return vec4(1.0, 0.6, 0, 1);
//		}

		drin = drin && (pos.x < a);
		//drin = drin && (length(pos) < length(dvec2(1,-2)));

	}

	return drin? vec4(0, 0, 1, 1) : vec4(1,1,1,1);

}


vec4 mandelbrot(){


	double relative_x = gl_FragCoord.x / double(screenx);
	double relative_y = gl_FragCoord.y / double(screeny);
	
	double dx = thickness/2.0*scalex/double(screenx);
	double dy = thickness/2.0*scaley/double(screeny);

	dvec2 pos0 = dvec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy;
	dvec2 pos = pos0;

	dvec2 posdx = pos + dvec2(dx, 0);
	dvec2 pos_dx = pos - dvec2(dx, 0);
	dvec2 posdy = pos + dvec2(0, dy);
	dvec2 pos_dy = pos - dvec2(0, dy);

	dvec2 posdx0 = posdx;
	dvec2 pos_dx0 = pos_dx;
	dvec2 posdy0 = posdy;
	dvec2 pos_dy0 = pos_dy;

	for(int k = 0; k < iterations; k++){
	
//		//pos = M(pos, pos0);
//		pos = P1(pos);
//		if(length(pos) > 2.0)
//			return vec4(1, 1, 1, 1);

		pos = M(pos, pos0);
		posdx = M(posdx, posdx0);
		pos_dx = M(pos_dx, pos_dx0);
		posdy = M(posdy, posdy0);
		pos_dy = M(pos_dy, pos_dy0);
		}
		if ((sign(length(posdx)-2.0) != sign(length(pos_dx)-2.0)) || (sign(length(posdy)-2.0) != sign(length(pos_dy)-2.0))) {

			//gl_FragColor = texture2D(color, dvec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, dvec2(float(k)/float(maxiter),0));
			return vec4(1.0, 0.6, 0, 1);
		

	
	}
	return vec4(1,1,1,1);
	//return vec4(0,0,0,1);

}

vec4 custom(){

	double relative_x = gl_FragCoord.x / double(screenx);
	double relative_y = gl_FragCoord.y / double(screeny);
	
	double dx = double(thickness)/2.0*scalex/double(screenx);
	double dy = double(thickness)/2.0*scaley/double(screeny);

	dvec2 pos = dvec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy;
	dvec2 posdx = pos + dvec2(dx, 0);
	dvec2 pos_dx = pos - dvec2(dx, 0);
	dvec2 posdy = pos + dvec2(0, dy);
	dvec2 pos_dy = pos - dvec2(0, dy);

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

	double relative_x = gl_FragCoord.x / double(screenx);
	double relative_y = gl_FragCoord.y / double(screeny);
//	
//	double dx = double(thickness)/2.0*scalex/double(screenx);
//	double dy = double(thickness)/2.0*scaley/double(screeny);

	dvec2 pos = dvec2((relative_x - 0.5) * scalex, (relative_y - 0.5) * scaley) + viewport.xy;
//	dvec2 posdx = pos + dvec2(dx, 0);
//	dvec2 pos_dx = pos - dvec2(dx, 0);
//	dvec2 posdy = pos + dvec2(0, dy);
//	dvec2 pos_dy = pos - dvec2(0, dy);
//
	for(int k = 0; k < iterations; k++){
		
		pos = P(pos);
		if(abs(pos.x) < margin)
			return vec4(0, 0, 0, 1);

//		posdx = P(posdx);
//		pos_dx = P(pos_dx);
//		posdy = P(posdy);
//		pos_dy = P(pos_dy);
//
//		if  ((length(posdx) - 1.0) * (length(pos_dx) - 1.0) < 0.0 || (length(posdy)-1.0) * (length(pos_dy) - 1.0) < 0.0){
//			return vec4(0, 0, 0, 1);
//		}

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
