FROM node:18-alpine3.16

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./

COPY nodemon.json ./

COPY tsconfig.json ./

RUN npm install

COPY . .