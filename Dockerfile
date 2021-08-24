FROM node:alpine3.14 as BUILDER

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npm run build:ts

FROM node:alpine3.14

WORKDIR /app

COPY package.json .

COPY wait-for.sh .

RUN npm i --only=prod

COPY --from=BUILDER /app/dist /app/dist