#!/bin/bash
set -e

# wait for master to be ready
until mysqladmin ping -h master --silent; do
  echo "Waiting for master..."
  sleep 2
done

# get master log file and position
MASTER_STATUS=$(mysql -h master -uroot -proot123 -e "SHOW MASTER STATUS\G")
FILE=$(echo "$MASTER_STATUS" | grep File | awk '{print $2}')
POS=$(echo "$MASTER_STATUS" | grep Position | awk '{print $2}')

# configure replication
mysql -uroot -proot123 <<-EOSQL
  CHANGE MASTER TO
    MASTER_HOST='master',
    MASTER_USER='repl',
    MASTER_PASSWORD='repl123',
    MASTER_LOG_FILE='$FILE',
    MASTER_LOG_POS=$POS;
  START SLAVE;
EOSQL
