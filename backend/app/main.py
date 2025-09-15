from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.routes import auth, chat, users
from app.database.connection import init_database, close_db_connections

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_database()
    yield
    # Shutdown
    close_db_connections()

app = FastAPI(
    title="Hackathon API",
    description="FastAPI backend with Gemini AI and SQL Server",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.get("/")
async def root():
    return {"message": "Hackathon API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}