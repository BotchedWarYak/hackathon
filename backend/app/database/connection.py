from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from app.core.config import settings
import urllib.parse

# URL encode the password to handle special characters
password_encoded = urllib.parse.quote_plus(settings.DATABASE_PASSWORD)

# Construct the database URL with proper encoding
DATABASE_URL = f"mssql+pyodbc://{settings.DATABASE_USER}:{password_encoded}@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes"

# Create engine with connection pooling for production
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,  # Recycle connections after 1 hour
    pool_pre_ping=True,  # Validate connections before use
    echo=settings.ENVIRONMENT == "development",  # Log SQL queries in development
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Metadata for schema operations
metadata = MetaData()

def get_db():
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_database():
    """
    Initialize database tables
    """
    Base.metadata.create_all(bind=engine)

def close_db_connections():
    """
    Close all database connections
    """
    engine.dispose()