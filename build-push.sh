TAG=20220613-0007

REPO=docker-dlll-paas-starter-dev-local

docker build -t pudding/$REPO:$TAG .
docker push pudding/$REPO:$TAG
docker rmi pudding/$REPO:$TAG