from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any

class UserSessionResponse(BaseModel):
    userId: str
    email: Optional[EmailStr] = None

class UserSessionDetail(BaseModel):
    userId: str
    email: Optional[EmailStr] = None
    claims: Dict[str, Any]
