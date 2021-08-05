#!/bin/bash

docker run --network host --restart=always --name sumsar_home \
-e TZ=Europe/Moscow \
-e PGTZ=Europe/Moscow \
-p 8088:8088 \
-w /sumsar_home \
-v /home/kutman/Documents/web_apps/sumsar_home/:/sumsar_home \
-v /etc/localtime:/etc/localtime \
-d sumsar_home


