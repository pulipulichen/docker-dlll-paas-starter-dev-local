#!/usr/bin/sh
docker kill $(docker ps -q)
open http://localhost:8080
open http://localhost:8000
docker-compose up