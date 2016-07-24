#include <iostream>
#include "pcv.h"
using namespace std;
int main(int argc, const char* argv[]) {
  const string fname = argc >= 2 ? argv[1] : "./data.jpg";
  if (cntr_img(fname)) {
    return 0;
  } else {
    return -1;
  }
}
