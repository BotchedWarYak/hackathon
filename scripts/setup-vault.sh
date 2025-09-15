#!/bin/bash

# Comprehensive setup script for HashiCorp Vault integration
# This script sets up Vault with all necessary secrets for the application

set -e

echo "🔐 Setting up HashiCorp Vault for Hackathon Application"
echo "======================================================="

# Check if required tools are installed
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "❌ jq is required but not installed. Please install jq." >&2; exit 1; }

# Check if secrets file exists
SECRETS_FILE="./secrets.local.json"
if [ ! -f "$SECRETS_FILE" ]; then
    echo "❌ Secrets file not found at $SECRETS_FILE"
    echo "Please create the secrets file first. Example content:"
    echo '{
  "database": {
    "host": "sqlserver",
    "port": "1433",
    "name": "HackathonDB",
    "user": "sa",
    "password": "YourStrong!Passw0rd"
  },
  "jwt": {
    "secret_key": "your-secret-key-here",
    "algorithm": "HS256",
    "access_token_expire_minutes": 30
  },
  "gemini": {
    "api_key": "your-gemini-api-key-here"
  }
}'
    exit 1
fi

echo "✅ Found secrets file at $SECRETS_FILE"

# Start Docker containers if not running
echo "🐳 Starting Docker containers..."
docker-compose up -d vault

# Wait for Vault to be ready
echo "⏳ Waiting for Vault to be ready..."
for i in {1..60}; do
    if curl -f -s "http://localhost:8200/v1/sys/health" > /dev/null 2>&1; then
        echo "✅ Vault is ready!"
        break
    fi
    echo "   Waiting for Vault... ($i/60)"
    sleep 2
done

if [ $i -eq 60 ]; then
    echo "❌ Vault failed to start within timeout period"
    exit 1
fi

# Install Vault CLI if not present (for local development)
if ! command -v vault >/dev/null 2>&1; then
    echo "📦 Installing Vault CLI for local development..."

    # Detect OS
    case "$(uname -s)" in
        Linux*)
            wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
            echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
            sudo apt update && sudo apt install vault
            ;;
        Darwin*)
            if command -v brew >/dev/null 2>&1; then
                brew tap hashicorp/tap
                brew install hashicorp/tap/vault
            else
                echo "❌ Please install Homebrew first or install Vault CLI manually"
                exit 1
            fi
            ;;
        *)
            echo "⚠️  Please install Vault CLI manually for your OS"
            echo "   Visit: https://www.vaultproject.io/downloads"
            ;;
    esac
fi

# Set Vault environment variables
export VAULT_ADDR="http://localhost:8200"
export VAULT_TOKEN="dev-only-token"

echo "🔧 Configuring Vault..."

# Initialize secrets from local file
echo "📝 Loading secrets into Vault..."
cd vault/init
./init-secrets.sh
cd ../..

echo "✅ Vault setup completed successfully!"
echo ""
echo "🔍 Vault Information:"
echo "   URL: http://localhost:8200"
echo "   Token: dev-only-token (development only)"
echo "   UI: http://localhost:8200/ui"
echo ""
echo "🧪 You can test the secrets with:"
echo "   vault kv get secret/database"
echo "   vault kv get secret/jwt"
echo "   vault kv get secret/gemini"
echo ""
echo "🚀 Start the full application with:"
echo "   docker-compose up"
echo ""
echo "⚠️  IMPORTANT FOR PRODUCTION:"
echo "   1. Use a proper Vault server (not dev mode)"
echo "   2. Configure TLS/SSL certificates"
echo "   3. Use cloud-based storage backend"
echo "   4. Implement proper authentication methods"
echo "   5. Set up proper policies and access controls"