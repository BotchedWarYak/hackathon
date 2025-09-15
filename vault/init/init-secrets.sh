#!/bin/bash

# Script to initialize HashiCorp Vault with application secrets
# This script loads secrets from the local secrets file into Vault

set -e

VAULT_ADDR=${VAULT_ADDR:-"http://localhost:8200"}
VAULT_TOKEN=${VAULT_TOKEN:-"dev-only-token"}
SECRETS_FILE=${SECRETS_FILE:-"../../../secrets.local.json"}

echo "Initializing Vault with application secrets..."
echo "Vault Address: $VAULT_ADDR"

# Wait for Vault to be ready
echo "Waiting for Vault to be ready..."
for i in {1..30}; do
    if curl -f -s "$VAULT_ADDR/v1/sys/health" > /dev/null 2>&1; then
        echo "Vault is ready!"
        break
    fi
    echo "Waiting for Vault... ($i/30)"
    sleep 2
done

if [ $i -eq 30 ]; then
    echo "Vault failed to start within timeout period"
    exit 1
fi

# Export Vault environment variables
export VAULT_ADDR
export VAULT_TOKEN

# Check if secrets file exists
if [ ! -f "$SECRETS_FILE" ]; then
    echo "Error: Secrets file not found at $SECRETS_FILE"
    echo "Please create the secrets file or set SECRETS_FILE environment variable"
    exit 1
fi

echo "Loading secrets from $SECRETS_FILE"

# Enable KV secrets engine if not already enabled
vault secrets list | grep -q "secret/" || vault secrets enable -path=secret kv-v2

# Read the secrets file and extract sections
DATABASE_HOST=$(jq -r '.database.host' "$SECRETS_FILE")
DATABASE_PORT=$(jq -r '.database.port' "$SECRETS_FILE")
DATABASE_NAME=$(jq -r '.database.name' "$SECRETS_FILE")
DATABASE_USER=$(jq -r '.database.user' "$SECRETS_FILE")
DATABASE_PASSWORD=$(jq -r '.database.password' "$SECRETS_FILE")

JWT_SECRET_KEY=$(jq -r '.jwt.secret_key' "$SECRETS_FILE")
JWT_ALGORITHM=$(jq -r '.jwt.algorithm' "$SECRETS_FILE")
JWT_EXPIRE_MINUTES=$(jq -r '.jwt.access_token_expire_minutes' "$SECRETS_FILE")

GEMINI_API_KEY=$(jq -r '.gemini.api_key' "$SECRETS_FILE")

# Store database secrets
echo "Storing database secrets..."
vault kv put secret/database \
    host="$DATABASE_HOST" \
    port="$DATABASE_PORT" \
    name="$DATABASE_NAME" \
    user="$DATABASE_USER" \
    password="$DATABASE_PASSWORD"

# Store JWT secrets
echo "Storing JWT secrets..."
vault kv put secret/jwt \
    secret_key="$JWT_SECRET_KEY" \
    algorithm="$JWT_ALGORITHM" \
    access_token_expire_minutes="$JWT_EXPIRE_MINUTES"

# Store Gemini API key
echo "Storing Gemini API key..."
vault kv put secret/gemini \
    api_key="$GEMINI_API_KEY"

echo "Successfully initialized Vault with application secrets!"
echo ""
echo "You can now verify the secrets with:"
echo "  vault kv get secret/database"
echo "  vault kv get secret/jwt"
echo "  vault kv get secret/gemini"