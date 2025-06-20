FROM mysql:8.0-debian

ARG SERVER_REPLICA_ID
ENV SERVER_REPLICA_ID=${SERVER_REPLICA_ID}


RUN apt-get update && apt-get install -y gettext

COPY my.cnf.template /tmp/my.cnf.template
RUN envsubst < /tmp/my.cnf.template > /etc/mysql/conf.d/custom.cnf

COPY init.sh /docker-entrypoint-initdb.d/init.sh
RUN chmod +x /docker-entrypoint-initdb.d/init.sh
