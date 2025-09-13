from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    GEMINI_API_KEY: str = ""
    
    SPACETIME_DB_URL: str = "ws://localhost:3001"
    SPACETIME_DB_NAME: str = "hackathon_db"
    
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://frontend:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()