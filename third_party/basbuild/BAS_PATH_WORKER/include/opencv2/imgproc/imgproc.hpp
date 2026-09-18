#pragma once
#include <vector>
#include <string>
namespace cv {
 struct Mat { int cols=0,rows=0; Mat(){} Mat(int h,int w,int t,void*d){cols=w;rows=h;} void release(){} void create(int r,int c,int t){rows=r;cols=c;} };
 struct Point {int x=0,y=0;};
 inline void cvtColor(const Mat&,Mat&,int){}
 inline void matchTemplate(const Mat&,const Mat&,Mat&,int){}
 inline void minMaxLoc(const Mat&, double*,double*,Point*,Point*,const Mat&){ if(false){} }
}
#define CV_8UC4 0
#define CV_32FC1 0
#define COLOR_BGRA2RGBA 0
#define CV_TM_CCOEFF_NORMED 0
