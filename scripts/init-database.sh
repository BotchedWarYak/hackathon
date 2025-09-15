#!/bin/bash

# Script to initialize SQL Server database
# Wait for SQL Server to be ready and run initialization scripts

# Get database password from environment or default
DB_PASSWORD=${DATABASE_PASSWORD:-"YourStrong!Passw0rd"}

echo "Waiting for SQL Server to start..."

# Wait for SQL Server to be ready (retry up to 30 times)
for i in {1..30}; do
    if docker exec hackathon-sqlserver-1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$DB_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1; then
        echo "SQL Server is ready!"
        break
    fi
    echo "Waiting for SQL Server... ($i/30)"
    sleep 2
done

if [ $i -eq 30 ]; then
    echo "SQL Server failed to start within timeout period"
    exit 1
fi

echo "Running database initialization scripts..."

# Run the database creation script
docker exec hackathon-sqlserver-1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$DB_PASSWORD" -i /docker-entrypoint-initdb.d/01-create-database.sql

# Run the seed data script
docker exec hackathon-sqlserver-1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$DB_PASSWORD" -i /docker-entrypoint-initdb.d/02-seed-data.sql

echo "Database initialization completed!"