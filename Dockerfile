#FROM postgres:14.9
#
#RUN apt-get update && apt-get -y install git build-essential postgresql-server-dev-14
#
#RUN git clone https://github.com/citusdata/pg_cron.git
#RUN cd pg_cron && make && make install
#
#RUN cd / && \
#    rm -rf /pg_cron && \
#    apt-get remove -y git build-essential postgresql-server-dev-11 && \
#    apt-get autoremove --purge -y && \
#    apt-get clean && \
#    apt-get purge
#
#COPY init-db /docker-entrypoint-initdb.d

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

# ?
WORKDIR /var/www/app/client
CMD [ "npm", "run", "watch" ]

WORKDIR /var/www/app/server
CMD [ "npm", "run", "dev" ]