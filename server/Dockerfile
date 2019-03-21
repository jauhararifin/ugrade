FROM node:alpine as build-deps
WORKDIR /app
RUN yarn global add node-gyp
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
CMD yarn start
