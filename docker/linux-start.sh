#!/bin/bash

echo "[1] Docker Image Build"
docker-compose build

echo "[2] Container Delete Wait"
docker-compose down -v

echo "[3] New Container Start..."
docker-compose up -d

until docker exec mysql-replica1 mysqladmin ping -uroot -proot123 --silent; do
  echo "[Replica1] Waiting for MySQL to be ready..."
  sleep 2
done

until docker exec mysql-replica2 mysqladmin ping -uroot -proot123 --silent; do
  echo "[Replica2] Waiting for MySQL to be ready..."
  sleep 2
done


echo "[5] Replica1 CopyStatus Check"
docker exec mysql-replica1 mysql -uroot -proot123 -e "SHOW SLAVE STATUS\G"

echo "[5] Replica2 CopyStatus Check"
docker exec mysql-replica2 mysql -uroot -proot123 -e "SHOW SLAVE STATUS\G"

echo "[✔ Complete] Master/Replica Ready."
