#!/bin/bash

VERSION="0.0.2"
SERVICE_NAME="sumsar_main_service"
SRV_NAME_VER="${SERVICE_NAME}:${VERSION}"
echo "Build version: ${VERSION}"
docker build -t ${SRV_NAME_VER} ./

echo "Tagging version: ${VERSION}"
docker tag ${SRV_NAME_VER} 167.71.48.184:5000/${SRV_NAME_VER}

echo "Pushing version: ${VERSION}"
docker push 167.71.48.184:5000/${SRV_NAME_VER}
