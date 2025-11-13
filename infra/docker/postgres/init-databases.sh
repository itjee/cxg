#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE mgmt;
    CREATE DATABASE tnnt;
    GRANT ALL PRIVILEGES ON DATABASE mgmt TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE tnnt TO $POSTGRES_USER;
EOSQL

echo "Databases 'mgmt' and 'tnnt' created successfully"
