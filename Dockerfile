# THE GENERAL CONTAINER FOR CONNECTING ALL THE ENVIRONMENTS 😈
FROM ubuntu:22.04

#SYSTEM
ARG DEBIAN_FRONTEND=noninteractive
RUN usermod -s /bin/bash root
RUN apt-get update 
RUN apt-get install -y nodejs npm

#FRONTEND (NODE)
# install the latest nodejs and npm
COPY ./ /app
WORKDIR /app
RUN npm install --force

# IMPORT EVERYTHING ELSE
ENTRYPOINT [ "tail", "-f", "/dev/null"]