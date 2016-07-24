#include "pcv.h"
void help() {
  cout << "Usage: " << endl;
  cout << "./pcv <image_name>, Default: ./data.jpg" << endl;
}
int cntr_img(const string fname) {
  Mat src = imread(fname, IMREAD_GRAYSCALE);
  if (src.empty()) {
    cout << "cannot open " << fname << endl;
    help();
    return 0;
  }
  Mat mask;
  cv::Canny(src, mask, 60, 20, 3);
  Mat dst_cpu;
  cv::cvtColor(mask, dst_cpu, COLOR_GRAY2BGR);
  imwrite("./out.png", dst_cpu);
  return 1;
}
