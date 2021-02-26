FROM mongo:4.4.3

HEALTHCHECK NONE

ARG MONGO_USER_NAME
ARG MONGO_USER_PASSWORD
ARG MONGO_INITDB_DATABASE


COPY ./init-mongo.js /docker-entrypoint-initdb.d/

RUN sed -i 's@MONGO_USER_NAME@'"$MONGO_USER_NAME"'@' /docker-entrypoint-initdb.d/init-mongo.js
RUN sed -i 's@MONGO_USER_PASSWORD@'"$MONGO_USER_PASSWORD"'@' /docker-entrypoint-initdb.d/init-mongo.js
RUN sed -i 's@MONGO_INITDB_DATABASE@'"$MONGO_INITDB_DATABASE"'@' /docker-entrypoint-initdb.d/init-mongo.js

EXPOSE 27017
