# Образ-оболочка
FROM node:20.5-alpine3.17
WORKDIR /var/www/app

COPY . .
COPY ./server/package*.json ./server/
COPY ./client/package*.json ./client/

RUN cd server && npm ci
RUN cd client && npm install
COPY . .

EXPOSE 3000

CMD cd /var/www/app/client/ && npm run build && cd /var/www/app/server/ && npm run dev
