import hvac
import os
import json
import logging
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class VaultService:
    def __init__(self):
        self.vault_url = os.getenv('VAULT_ADDR', 'http://localhost:8200')
        self.vault_token = os.getenv('VAULT_TOKEN', 'dev-only-token')

        # Initialize Vault client
        self.client = hvac.Client(
            url=self.vault_url,
            token=self.vault_token
        )

        # Verify client is authenticated
        if not self.client.is_authenticated():
            logger.warning("Vault client is not authenticated. Some operations may fail.")

    def read_secret(self, path: str, mount_point: str = 'secret') -> Optional[Dict[str, Any]]:
        """
        Read a secret from Vault
        Args:
            path: Secret path (e.g., 'database/credentials')
            mount_point: Vault mount point (default: 'secret')
        Returns:
            Secret data or None if not found
        """
        try:
            response = self.client.secrets.kv.v2.read_secret_version(
                path=path,
                mount_point=mount_point
            )
            return response['data']['data']
        except hvac.exceptions.InvalidPath:
            logger.warning(f"Secret not found at path: {mount_point}/{path}")
            return None
        except Exception as e:
            logger.error(f"Error reading secret from {mount_point}/{path}: {e}")
            return None

    def write_secret(self, path: str, secret_dict: Dict[str, Any], mount_point: str = 'secret') -> bool:
        """
        Write a secret to Vault
        Args:
            path: Secret path (e.g., 'database/credentials')
            secret_dict: Dictionary containing secret data
            mount_point: Vault mount point (default: 'secret')
        Returns:
            True if successful, False otherwise
        """
        try:
            self.client.secrets.kv.v2.create_or_update_secret(
                path=path,
                secret=secret_dict,
                mount_point=mount_point
            )
            logger.info(f"Successfully wrote secret to {mount_point}/{path}")
            return True
        except Exception as e:
            logger.error(f"Error writing secret to {mount_point}/{path}: {e}")
            return False

    def delete_secret(self, path: str, mount_point: str = 'secret') -> bool:
        """
        Delete a secret from Vault
        Args:
            path: Secret path
            mount_point: Vault mount point (default: 'secret')
        Returns:
            True if successful, False otherwise
        """
        try:
            self.client.secrets.kv.v2.delete_metadata_and_all_versions(
                path=path,
                mount_point=mount_point
            )
            logger.info(f"Successfully deleted secret at {mount_point}/{path}")
            return True
        except Exception as e:
            logger.error(f"Error deleting secret from {mount_point}/{path}: {e}")
            return False

    def list_secrets(self, path: str = '', mount_point: str = 'secret') -> Optional[list]:
        """
        List secrets at a given path
        Args:
            path: Path to list (empty for root)
            mount_point: Vault mount point (default: 'secret')
        Returns:
            List of secret names or None if error
        """
        try:
            response = self.client.secrets.kv.v2.list_secrets(
                path=path,
                mount_point=mount_point
            )
            return response['data']['keys']
        except Exception as e:
            logger.error(f"Error listing secrets from {mount_point}/{path}: {e}")
            return None

# Global Vault service instance
_vault_service = None

def get_vault_service() -> VaultService:
    """Get singleton Vault service instance"""
    global _vault_service
    if _vault_service is None:
        _vault_service = VaultService()
    return _vault_service

class VaultConfig:
    """
    Configuration class that retrieves secrets from Vault with fallback to environment variables
    """
    def __init__(self):
        self.vault = get_vault_service()
        self._cache = {}

    def get_secret(self, vault_path: str, key: str, env_var: str = None, default: str = None) -> str:
        """
        Get a secret with fallback priority:
        1. Vault (if available)
        2. Environment variable
        3. Default value

        Args:
            vault_path: Path in Vault (e.g., 'database')
            key: Key name in the secret
            env_var: Environment variable name (fallback)
            default: Default value if all else fails
        """
        cache_key = f"{vault_path}:{key}"

        # Check cache first
        if cache_key in self._cache:
            return self._cache[cache_key]

        # Try Vault first
        try:
            secret_data = self.vault.read_secret(vault_path)
            if secret_data and key in secret_data:
                value = secret_data[key]
                self._cache[cache_key] = value
                return value
        except Exception as e:
            logger.debug(f"Could not read from Vault: {e}")

        # Fallback to environment variable
        if env_var:
            env_value = os.getenv(env_var)
            if env_value:
                self._cache[cache_key] = env_value
                return env_value

        # Fallback to default
        if default is not None:
            self._cache[cache_key] = default
            return default

        raise ValueError(f"Could not find secret {vault_path}:{key} in Vault, environment, or default")

    def get_database_config(self) -> Dict[str, str]:
        """Get complete database configuration"""
        return {
            'host': self.get_secret('database', 'host', 'DATABASE_HOST', 'localhost'),
            'port': self.get_secret('database', 'port', 'DATABASE_PORT', '1433'),
            'name': self.get_secret('database', 'name', 'DATABASE_NAME', 'HackathonDB'),
            'user': self.get_secret('database', 'user', 'DATABASE_USER', 'sa'),
            'password': self.get_secret('database', 'password', 'DATABASE_PASSWORD'),
        }

    def get_jwt_config(self) -> Dict[str, Any]:
        """Get JWT configuration"""
        return {
            'secret_key': self.get_secret('jwt', 'secret_key', 'SECRET_KEY'),
            'algorithm': self.get_secret('jwt', 'algorithm', 'ALGORITHM', 'HS256'),
            'expire_minutes': int(self.get_secret('jwt', 'access_token_expire_minutes', 'ACCESS_TOKEN_EXPIRE_MINUTES', '30'))
        }

    def get_gemini_api_key(self) -> str:
        """Get Gemini API key"""
        return self.get_secret('gemini', 'api_key', 'GEMINI_API_KEY')

# Global configuration instance
vault_config = VaultConfig()