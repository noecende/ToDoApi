FROM node:18-alpine3.16

WORKDIR /home/node/app

COPY . ./

RUN mkdir dist

COPY package.json ./

COPY nodemon.json ./

COPY tsconfig.json ./

RUN npm install

COPY . ./
