#!/bin/bash

VERSION=$(npm run version --silent)
echo "Build and push version: ${VERSION}"

docker build -t "sumsar_home" ./