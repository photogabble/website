FROM node:20.19.1 AS node-base
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

WORKDIR /usr/src/app

FROM node-base AS node-build

COPY . /usr/src/app
RUN npm install && npm run build:dev

FROM flashspys/nginx-static
RUN apk update && apk upgrade
COPY --from=node-build /usr/src/app/_site /static
