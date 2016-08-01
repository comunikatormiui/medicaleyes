# [MedicalEyes](https://medicaleyes.net) - radiology pre-diagnosis system powered by Perseus Artificial Intelligence Platform (PAIP)

## Tasks and organization

1. Get the task from **TODO** list in [Trello board](https://trello.com/b/Mhy2Me98/medeye)
2. Use card link as a commit message. For example: `git commit -m 'https://trello.com/c/lk9HiDKt'`. To get card link click `Share and more...`
3. Push commits **ONLY** to `develop` branch

## Structure
```
.
+-- web - web api and frontend files
|   +-- app - api routes & data models
|   +-- cert - ssl certififcate & server key
|   +-- config - config files
|   +-- lib - libs
|   +-- src - frontend sources
+-- paip - PAIP files
+-- data - DICOM, X-Ray etc. data files
```

## PAIP prerequisites

All code is tested in Ubuntu 16.04 x64, 4.4.0-31-generic

1. OpenCV, use sources from git repo, download [here](https://github.com/opencv/opencv)
2. NVIDIA CUDA Toolkit 7.5, download [here](https://developer.nvidia.com/cuda-downloads)
3. Use GCC 4.8.5, G++ 4.8.5

## Building PAIP 

```shell
cd ./paip
make
```

## Install

```shell
sudo make install
```

## Uninstall

```shell
sudo make uninstall
```

## Cleanup .o files and executable

```shell
make clean
```

### Code format rules
Using clang-format with Google style option

### Web part files are located in `./web` directory

## Building web part

Node.js needed to install dependencies and components. Use iptables.sh for preroute http and https to 3000/3001 ports

First, edit `./config/config.json` respectively

```shell
cd ./web
npm i
```

## Running web part
```shell
npm start
```

## Clean up build
```shell
grunt clean:build
```

## Clean up build and components
```shell
grunt clean:all
```
