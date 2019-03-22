FROM node:alpine as build-deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

FROM nginx:1.12-alpine
COPY --from=build-deps /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
