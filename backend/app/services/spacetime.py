from typing import List, Optional
import json
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.schemas import UserResponse, ChatResponse, UserRole, Permission
from app.models.database import User, ChatMessage, Event, Infrastructure
from app.database.connection import get_db

class DatabaseService:
    def __init__(self, db: Session = None):
        self.db = db

    def _get_permissions_from_role(self, role: UserRole) -> List[Permission]:
        """Get default permissions based on user role"""
        if role == UserRole.ADMIN:
            return [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN]
        elif role == UserRole.MODERATOR:
            return [Permission.READ, Permission.WRITE]
        else:
            return [Permission.READ]

    async def create_user(self, username: str, email: str, hashed_password: str, role: UserRole) -> UserResponse:
        """Create a new user in the database"""
        permissions = self._get_permissions_from_role(role)

        db_user = User(
            Id=str(uuid.uuid4()),
            Username=username,
            Email=email,
            PasswordHash=hashed_password,
            Role=role.value,
            Permissions=json.dumps([p.value for p in permissions])
        )

        try:
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)

            return UserResponse(
                id=db_user.Id,
                email=db_user.Email,
                username=db_user.Username,
                role=UserRole(db_user.Role),
                created_at=db_user.CreatedAt,
                permissions=permissions
            )
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Username or email already exists")

    async def get_user_by_username(self, username: str) -> Optional[UserResponse]:
        """Get user by username"""
        db_user = self.db.query(User).filter(User.Username == username).first()
        if not db_user:
            return None

        permissions = [Permission(p) for p in json.loads(db_user.Permissions)]
        return UserResponse(
            id=db_user.Id,
            email=db_user.Email,
            username=db_user.Username,
            role=UserRole(db_user.Role),
            created_at=db_user.CreatedAt,
            permissions=permissions
        )

    async def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """Get user by email"""
        db_user = self.db.query(User).filter(User.Email == email).first()
        if not db_user:
            return None

        permissions = [Permission(p) for p in json.loads(db_user.Permissions)]
        return UserResponse(
            id=db_user.Id,
            email=db_user.Email,
            username=db_user.Username,
            role=UserRole(db_user.Role),
            created_at=db_user.CreatedAt,
            permissions=permissions
        )

    async def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """Get user by ID"""
        db_user = self.db.query(User).filter(User.Id == user_id).first()
        if not db_user:
            return None

        permissions = [Permission(p) for p in json.loads(db_user.Permissions)]
        return UserResponse(
            id=db_user.Id,
            email=db_user.Email,
            username=db_user.Username,
            role=UserRole(db_user.Role),
            created_at=db_user.CreatedAt,
            permissions=permissions
        )

    async def get_all_users(self) -> List[UserResponse]:
        """Get all users"""
        db_users = self.db.query(User).all()
        users = []

        for db_user in db_users:
            permissions = [Permission(p) for p in json.loads(db_user.Permissions)]
            users.append(UserResponse(
                id=db_user.Id,
                email=db_user.Email,
                username=db_user.Username,
                role=UserRole(db_user.Role),
                created_at=db_user.CreatedAt,
                permissions=permissions
            ))

        return users

    async def update_user_permissions(self, user_id: str, permissions: List[Permission]) -> Optional[UserResponse]:
        """Update user permissions"""
        db_user = self.db.query(User).filter(User.Id == user_id).first()
        if not db_user:
            return None

        db_user.Permissions = json.dumps([p.value for p in permissions])
        self.db.commit()
        self.db.refresh(db_user)

        return UserResponse(
            id=db_user.Id,
            email=db_user.Email,
            username=db_user.Username,
            role=UserRole(db_user.Role),
            created_at=db_user.CreatedAt,
            permissions=permissions
        )

    async def save_chat_message(self, user_id: str, message: str, response: str) -> ChatResponse:
        """Save chat message to database"""
        db_message = ChatMessage(
            Id=str(uuid.uuid4()),
            UserId=user_id,
            Message=message,
            Response=response
        )

        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)

        return ChatResponse(
            id=db_message.Id,
            user_id=db_message.UserId,
            message=db_message.Message,
            response=db_message.Response,
            created_at=db_message.CreatedAt
        )

    async def get_user_chat_history(self, user_id: str) -> List[ChatResponse]:
        """Get user's chat history"""
        db_messages = self.db.query(ChatMessage).filter(
            ChatMessage.UserId == user_id
        ).order_by(ChatMessage.CreatedAt.desc()).all()

        return [
            ChatResponse(
                id=msg.Id,
                user_id=msg.UserId,
                message=msg.Message,
                response=msg.Response,
                created_at=msg.CreatedAt
            )
            for msg in db_messages
        ]

    async def clear_user_chat_history(self, user_id: str) -> None:
        """Clear user's chat history"""
        self.db.query(ChatMessage).filter(
            ChatMessage.UserId == user_id
        ).delete()
        self.db.commit()

# Legacy alias for backward compatibility
class SpacetimeService(DatabaseService):
    pass