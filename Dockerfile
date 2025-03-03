FROM node:20

WORKDIR /app

COPY /package.json /app
COPY /src/client /app/client
COPY /src/config/ /app/config
COPY /src/db/ /app/db
COPY /src/server/ /app/server

RUN npm install

WORKDIR /app/client

RUN npm build

COPY /app/client/dist /app/server/build

EXPOSE 80

CMD [ "npm", "start" ]
