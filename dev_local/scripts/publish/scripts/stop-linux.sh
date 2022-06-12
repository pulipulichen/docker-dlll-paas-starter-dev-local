#!/usr/bin/sh
docker kill $(docker ps -q)
docker-compose rm -f