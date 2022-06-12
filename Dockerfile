FROM cypress/included:9.6.0

RUN apt-get update || echo "apt-get update failed"
RUN apt-get install p7zip-full -y

WORKDIR /dlll-paas-starter
COPY ./package-json.txt /dlll-paas-starter/
RUN mv /dlll-paas-starter/package-json.txt /dlll-paas-starter/package.json
RUN npm i

RUN apt-get clean

CMD []
ENTRYPOINT []
