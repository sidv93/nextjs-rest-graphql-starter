FROM node:fermium

HEALTHCHECK NONE
ARG API_PORT

RUN mkdir -p /home/myuser/app

WORKDIR /home/myuser/app

COPY package*.json /home/myuser/app/

RUN npm i

COPY . /home/myuser/app/

RUN npm run build

EXPOSE ${API_PORT}

CMD [ "node", "build/index.js" ]
