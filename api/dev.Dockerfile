FROM node:alpine3.14

WORKDIR /app

COPY package.json .

RUN npm i --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN chmod +x /app/wait-for.sh

CMD npx prisma db push && npm run dev --port=3001