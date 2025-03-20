from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessageBase(BaseModel):
    content: str

class ChatMessageCreate(ChatMessageBase):
    user_id: int
    is_bot: bool = False

class ChatMessage(ChatMessageBase):
    id: int
    user_id: int
    is_bot: bool
    created_at: datetime

    class Config:
        from_attributes = True

class FAQBase(BaseModel):
    question: str
    answer: str
    category: str

class FAQCreate(FAQBase):
    pass

class FAQ(FAQBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    type: str
    data: dict 