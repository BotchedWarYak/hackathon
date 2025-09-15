from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from sqlalchemy.orm import Session
from app.models.schemas import ChatMessage, ChatResponse, ChatHistory, UserResponse
from app.routes.auth import get_current_user
from app.services.gemini import GeminiService
from app.services.spacetime import DatabaseService
from app.database.connection import get_db

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def send_message(
    message: ChatMessage,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        gemini = GeminiService()
        db_service = DatabaseService(db)

        ai_response = await gemini.generate_response(message.message)

        chat_record = await db_service.save_chat_message(
            user_id=current_user.id,
            message=message.message,
            response=ai_response
        )

        return chat_record

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process message: {str(e)}"
        )

@router.get("/history", response_model=ChatHistory)
async def get_chat_history(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_service = DatabaseService(db)
    messages = await db_service.get_user_chat_history(current_user.id)
    return {"messages": messages}

@router.get("/history/{user_id}", response_model=ChatHistory)
async def get_user_chat_history(
    user_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_id != current_user.id and "admin" not in current_user.permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    db_service = DatabaseService(db)
    messages = await db_service.get_user_chat_history(user_id)
    return {"messages": messages}

@router.delete("/history")
async def clear_chat_history(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_service = DatabaseService(db)
    await db_service.clear_user_chat_history(current_user.id)
    return {"message": "Chat history cleared successfully"}