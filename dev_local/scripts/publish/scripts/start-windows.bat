docker kill $(docker ps -q)
start http://localhost:8080
start http://localhost:8000
docker-compose up