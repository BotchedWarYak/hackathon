from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.connection import Base
import uuid

class User(Base):
    __tablename__ = "Users"

    Id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    Username = Column(String(100), unique=True, nullable=False, index=True)
    Email = Column(String(255), unique=True, nullable=False, index=True)
    PasswordHash = Column(String(255), nullable=False)
    Role = Column(String(50), nullable=False, default="user")
    Permissions = Column(Text, nullable=False, default="[]")
    CreatedAt = Column(DateTime(timezone=True), server_default=func.getutcdate())
    UpdatedAt = Column(DateTime(timezone=True), server_default=func.getutcdate(), onupdate=func.getutcdate())

    # Relationships
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="creator")

class ChatMessage(Base):
    __tablename__ = "ChatMessages"

    Id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    UserId = Column(String(36), ForeignKey("Users.Id", ondelete="CASCADE"), nullable=False)
    Message = Column(Text, nullable=False)
    Response = Column(Text, nullable=False)
    CreatedAt = Column(DateTime(timezone=True), server_default=func.getutcdate())

    # Relationships
    user = relationship("User", back_populates="chat_messages")

class Event(Base):
    __tablename__ = "Events"

    Id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    Name = Column(String(255), nullable=False)
    Description = Column(Text)
    Status = Column(String(50), nullable=False, default="draft", index=True)
    StartDate = Column(DateTime(timezone=True))
    EndDate = Column(DateTime(timezone=True))
    ParticipantCount = Column(Integer, default=0)
    Organization = Column(String(255))
    Type = Column(String(100))
    EventData = Column(Text)  # JSON string for complex event configuration
    CreatedBy = Column(String(36), ForeignKey("Users.Id"), index=True)
    CreatedAt = Column(DateTime(timezone=True), server_default=func.getutcdate())
    UpdatedAt = Column(DateTime(timezone=True), server_default=func.getutcdate(), onupdate=func.getutcdate())

    # Relationships
    creator = relationship("User", back_populates="events")
    infrastructure = relationship("Infrastructure", back_populates="event", cascade="all, delete-orphan")

class Infrastructure(Base):
    __tablename__ = "Infrastructure"

    Id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    EventId = Column(String(36), ForeignKey("Events.Id", ondelete="CASCADE"), nullable=False, index=True)
    Name = Column(String(255), nullable=False)
    Status = Column(String(50), nullable=False, default="planned")
    TotalVMs = Column(Integer, default=0)
    NetworkSegments = Column(Integer, default=0)
    EstimatedResources = Column(Text)  # JSON for resource estimates
    NetworkNodes = Column(Text)  # JSON for network topology
    CreatedAt = Column(DateTime(timezone=True), server_default=func.getutcdate())
    UpdatedAt = Column(DateTime(timezone=True), server_default=func.getutcdate(), onupdate=func.getutcdate())

    # Relationships
    event = relationship("Event", back_populates="infrastructure")