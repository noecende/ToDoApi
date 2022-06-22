FROM node:18-alpine3.16

WORKDIR /home/node/app

RUN mkdir dist

COPY package.json ./

COPY nodemon.json ./

COPY tsconfig.json ./

COPY . ./

RUN npm install
