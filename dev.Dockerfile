FROM node:alpine3.14

WORKDIR /app

COPY package.json .

RUN npm i --legacy-peer-deps

COPY . .

RUN chmod +x /app/wait-for.sh

CMD [ "npm","run","dev","--port=3001"]