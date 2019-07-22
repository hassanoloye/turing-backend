FROM node:10.15.1-alpine as builder
ENV LANG en_US.utf8

RUN mkdir -p /usr/local/turing-backend
RUN apk add --no-cache bash

WORKDIR /usr/local/turing-backend
COPY package*.json ./
COPY tslint.json ./
COPY tsconfig.json ./
COPY src/ ./src/
COPY docs/ ./docs/
COPY Images/ ./Images/
COPY scripts/ ./scripts/
RUN npm install
RUN npm run build

CMD ["sh", "-c", "npm start"]
