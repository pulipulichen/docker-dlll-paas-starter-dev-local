#!/usr/bin/sh
docker kill $(docker ps -q)
xdg-open http://localhost:8080
xdg-open http://localhost:8000
docker-compose up