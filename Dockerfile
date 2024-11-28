FROM node:20.15.1-alpine
RUN apk update && apk add build-base g++ cairo-dev pango-dev giflib-dev
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install && npm run build:dev

FROM flashspys/nginx-static
RUN apk update && apk upgrade
COPY --from=0 /usr/src/app/_site /static
