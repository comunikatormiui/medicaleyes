#ifndef PCV_H_
#define PCV_H_
#include <cmath>
#include <iostream>
#include <opencv2/core/utility.hpp>
#include "opencv2/core.hpp"
#include "opencv2/cudaimgproc.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/imgproc.hpp"
using namespace std;
using namespace cv;
using namespace cv::cuda;
void help();
int cntr_img(const string filename);
#endif
