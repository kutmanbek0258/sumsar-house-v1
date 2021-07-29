#!/bin/bash

docker run --restart=always --link=postgres:rpdb --name rysgalpay-api -e TZ=Europe/Moscow -e PGTZ=Europe/Moscow -p 7001:7001 -v /home/rysgalpay/msdata/rysgalpay-api:/msdata/rysgalpay-api -v /etc/localtime:/etc/localtime -d rysgalpay-api
