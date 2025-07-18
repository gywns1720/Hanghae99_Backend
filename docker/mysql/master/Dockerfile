
# MYSQL 8.0 Image
FROM mysql:8.0-debian


ARG SERVER_ID
ENV SERVER_ID=${SERVER_ID}

RUN apt-get update && apt-get install -y gettext

COPY my.cnf.template /tmp/my.cnf.template
RUN envsubst < /tmp/my.cnf.template > /etc/mysql/conf.d/custom.cnf

COPY init.sql /docker-entrypoint-initdb.d/init.sql
