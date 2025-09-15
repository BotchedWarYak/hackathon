from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from sqlalchemy.orm import Session
from app.models.schemas import UserResponse, Permission
from app.routes.auth import get_current_user
from app.services.spacetime import DatabaseService
from app.database.connection import get_db

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if Permission.ADMIN not in current_user.permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    db_service = DatabaseService(db)
    users = await db_service.get_all_users()
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_service = DatabaseService(db)
    user = await db_service.get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.id != current_user.id and Permission.ADMIN not in current_user.permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    return user

@router.put("/{user_id}/permissions")
async def update_user_permissions(
    user_id: str,
    permissions: List[Permission],
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if Permission.ADMIN not in current_user.permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    db_service = DatabaseService(db)
    user = await db_service.update_user_permissions(user_id, permissions)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {"message": "Permissions updated successfully"}