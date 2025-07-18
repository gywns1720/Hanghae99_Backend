
@echo off
echo [1] Docker Image Build
docker-compose build

echo [2] Container Delete Wait.
docker-compose down -v

echo [3] New Container Start..
docker-compose up -d

echo [4] Waiting for mysql-replica1 to start...
:wait_replica1
docker exec mysql-replica1 mysqladmin ping -uroot -proot123 --silent >nul 2>&1
if errorlevel 1 (
    echo Waiting...
    timeout /t 2 >nul
    goto wait_replica1
)

echo [4] Waiting for mysql-replica2 to start...
:wait_replica2
docker exec mysql-replica2 mysqladmin ping -uroot -proot123 --silent >nul 2>&1
if errorlevel 1 (
    echo Waiting...
    timeout /t 2 >nul
    goto wait_replica2
)

echo [5] Replica1 CopyStatus Check
docker exec mysql-replica1 mysql -uroot -proot123 -e "SHOW SLAVE STATUS\G"

echo [5] Replica2 CopyStatus Check
docker exec mysql-replica2 mysql -uroot -proot123 -e "SHOW SLAVE STATUS\G"
echo [Complete] Master/Replica Complete
pause
