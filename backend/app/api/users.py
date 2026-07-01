from fastapi import APIRouter, Depends

from app.schemas.user import UserSessionResponse
from app.auth.clerk import get_current_user, UserSession

router = APIRouter()

@router.get("/me", response_model=UserSessionResponse)
async def get_me(current_user: UserSession = Depends(get_current_user)):
    """
    Protected endpoint to retrieve the currently authenticated user's session details.
    Uses Clerk JWT verification.
    """
    return UserSessionResponse(
        userId=current_user.userId,
        email=current_user.email
    )
