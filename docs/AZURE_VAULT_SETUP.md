# Azure Key Vault Integration Guide

This guide explains how to migrate from the local HashiCorp Vault setup to Azure Key Vault for production deployment.

## Overview

For production deployment on Azure, we recommend using Azure Key Vault instead of a self-hosted HashiCorp Vault instance. This provides better integration with Azure services, managed security, and simplified operations.

## Azure Key Vault Setup

### 1. Create Azure Key Vault

```bash
# Create resource group (if not exists)
az group create --name your-rg --location eastus

# Create Key Vault
az keyvault create \
  --name your-app-vault \
  --resource-group your-rg \
  --location eastus \
  --sku standard
```

### 2. Store Secrets in Azure Key Vault

```bash
# Database secrets
az keyvault secret set --vault-name your-app-vault --name "database-host" --value "your-sql-server.database.windows.net"
az keyvault secret set --vault-name your-app-vault --name "database-port" --value "1433"
az keyvault secret set --vault-name your-app-vault --name "database-name" --value "HackathonDB"
az keyvault secret set --vault-name your-app-vault --name "database-user" --value "sqladmin"
az keyvault secret set --vault-name your-app-vault --name "database-password" --value "your-secure-password"

# JWT secrets
az keyvault secret set --vault-name your-app-vault --name "jwt-secret-key" --value "your-production-jwt-secret"
az keyvault secret set --vault-name your-app-vault --name "jwt-algorithm" --value "HS256"
az keyvault secret set --vault-name your-app-vault --name "jwt-expire-minutes" --value "30"

# Gemini API key
az keyvault secret set --vault-name your-app-vault --name "gemini-api-key" --value "your-gemini-api-key"
```

### 3. Configure Managed Identity

For Azure Container Apps or App Service:

```bash
# Enable system-assigned managed identity
az containerapp identity assign \
  --name your-app \
  --resource-group your-rg \
  --system-assigned

# Get the principal ID
PRINCIPAL_ID=$(az containerapp identity show \
  --name your-app \
  --resource-group your-rg \
  --query principalId -o tsv)

# Grant Key Vault access
az keyvault set-policy \
  --name your-app-vault \
  --object-id $PRINCIPAL_ID \
  --secret-permissions get list
```

## Code Changes for Azure Key Vault

### 1. Install Azure Key Vault Client

Add to `requirements.txt`:
```
azure-keyvault-secrets==4.7.0
azure-identity==1.15.0
```

### 2. Create Azure Key Vault Service

Create `backend/app/services/azure_vault.py`:

```python
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
import os
import logging

logger = logging.getLogger(__name__)

class AzureVaultService:
    def __init__(self):
        vault_url = os.getenv('AZURE_KEY_VAULT_URL')
        if not vault_url:
            raise ValueError("AZURE_KEY_VAULT_URL environment variable is required")

        # Use managed identity in production
        credential = DefaultAzureCredential()
        self.client = SecretClient(vault_url=vault_url, credential=credential)

    def get_secret(self, secret_name: str) -> str:
        """Get a secret from Azure Key Vault"""
        try:
            secret = self.client.get_secret(secret_name)
            return secret.value
        except Exception as e:
            logger.error(f"Error retrieving secret {secret_name}: {e}")
            raise

    def get_database_config(self) -> dict:
        """Get database configuration from Azure Key Vault"""
        return {
            'host': self.get_secret('database-host'),
            'port': self.get_secret('database-port'),
            'name': self.get_secret('database-name'),
            'user': self.get_secret('database-user'),
            'password': self.get_secret('database-password'),
        }

    def get_jwt_config(self) -> dict:
        """Get JWT configuration from Azure Key Vault"""
        return {
            'secret_key': self.get_secret('jwt-secret-key'),
            'algorithm': self.get_secret('jwt-algorithm'),
            'expire_minutes': int(self.get_secret('jwt-expire-minutes'))
        }

    def get_gemini_api_key(self) -> str:
        """Get Gemini API key from Azure Key Vault"""
        return self.get_secret('gemini-api-key')
```

### 3. Update Configuration

Update `backend/app/core/config.py`:

```python
def __init__(self, **kwargs):
    super().__init__(**kwargs)

    # Check if running in Azure (has Key Vault URL)
    if os.getenv('AZURE_KEY_VAULT_URL'):
        try:
            from app.services.azure_vault import AzureVaultService
            vault = AzureVaultService()

            # Load from Azure Key Vault
            db_config = vault.get_database_config()
            jwt_config = vault.get_jwt_config()

            # Set configuration values...
        except Exception as e:
            logger.error(f"Failed to load from Azure Key Vault: {e}")
            # Fallback to environment variables
    else:
        # Use HashiCorp Vault or environment variables for local development
        # ... existing logic
```

## Environment Variables for Azure

### Container Apps Configuration

```bash
# Set environment variables for Container Apps
az containerapp update \
  --name your-app \
  --resource-group your-rg \
  --set-env-vars \
  AZURE_KEY_VAULT_URL="https://your-app-vault.vault.azure.net/"
```

### App Service Configuration

```bash
# Set application settings for App Service
az webapp config appsettings set \
  --resource-group your-rg \
  --name your-app \
  --settings AZURE_KEY_VAULT_URL="https://your-app-vault.vault.azure.net/"
```

## Security Best Practices

### 1. Network Security
- Configure Key Vault firewall rules
- Use private endpoints for enhanced security
- Restrict access to specific virtual networks

### 2. Access Policies
- Use least-privilege principle
- Create specific policies for different environments
- Regularly audit access logs

### 3. Secret Management
- Use versioned secrets
- Implement secret rotation policies
- Monitor secret access patterns

## Migration Steps

1. **Set up Azure Key Vault** with all required secrets
2. **Update application code** to use Azure Key Vault client
3. **Configure managed identity** for your Azure services
4. **Update deployment configuration** with Key Vault URL
5. **Test thoroughly** in staging environment
6. **Deploy to production** and monitor

## Local Development

For local development, you can still use the HashiCorp Vault setup. The application will automatically detect the environment and use the appropriate vault service.

## Monitoring and Logging

- Enable Key Vault logging to Azure Monitor
- Set up alerts for secret access patterns
- Monitor for failed authentication attempts
- Track secret rotation and expiration dates