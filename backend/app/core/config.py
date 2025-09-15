from pydantic_settings import BaseSettings
from typing import List
import os
import logging

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"

    # Vault Configuration - these are the only direct env vars needed
    VAULT_ADDR: str = "http://localhost:8200"
    VAULT_TOKEN: str = "dev-only-token"

    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://frontend:3000"]

    class Config:
        env_file = ".env"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Initialize Vault configuration
        try:
            from app.services.vault import vault_config

            # Get configuration from Vault with fallbacks
            db_config = vault_config.get_database_config()
            jwt_config = vault_config.get_jwt_config()

            # Set database configuration
            self.DATABASE_HOST = db_config['host']
            self.DATABASE_PORT = int(db_config['port'])
            self.DATABASE_NAME = db_config['name']
            self.DATABASE_USER = db_config['user']
            self.DATABASE_PASSWORD = db_config['password']

            # Construct database URL
            import urllib.parse
            password_encoded = urllib.parse.quote_plus(self.DATABASE_PASSWORD)
            self.DATABASE_URL = f"mssql+pyodbc://{self.DATABASE_USER}:{password_encoded}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}?driver=ODBC+Driver+17+for+SQL+Server"

            # Set JWT configuration
            self.SECRET_KEY = jwt_config['secret_key']
            self.ALGORITHM = jwt_config['algorithm']
            self.ACCESS_TOKEN_EXPIRE_MINUTES = jwt_config['expire_minutes']

            # Set Gemini API key
            self.GEMINI_API_KEY = vault_config.get_gemini_api_key()

            logger.info("Successfully loaded configuration from Vault")

        except Exception as e:
            logger.warning(f"Could not load configuration from Vault, using fallbacks: {e}")

            # Fallback to environment variables or defaults
            self.SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
            self.ALGORITHM = os.getenv("ALGORITHM", "HS256")
            self.ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
            self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
            self.DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
            self.DATABASE_PORT = int(os.getenv("DATABASE_PORT", "1433"))
            self.DATABASE_NAME = os.getenv("DATABASE_NAME", "HackathonDB")
            self.DATABASE_USER = os.getenv("DATABASE_USER", "sa")
            self.DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", "YourStrong!Passw0rd")

            # Construct database URL for fallback
            import urllib.parse
            password_encoded = urllib.parse.quote_plus(self.DATABASE_PASSWORD)
            self.DATABASE_URL = f"mssql+pyodbc://{self.DATABASE_USER}:{password_encoded}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}?driver=ODBC+Driver+17+for+SQL+Server"

settings = Settings()