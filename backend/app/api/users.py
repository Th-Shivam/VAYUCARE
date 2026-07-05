from fastapi import APIRouter, Depends

from app.schemas.user import UserDashboardResponse, UserSessionResponse
from app.auth.clerk import get_current_user, UserSession
from app.services.appwrite import appwrite_service

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

@router.get("/api/users/dashboard", response_model=UserDashboardResponse)
async def get_dashboard(current_user: UserSession = Depends(get_current_user)):
    """
    Returns dashboard data scoped to the authenticated Clerk user.
    Appwrite stores the user profile document using Clerk user ID as $id.
    """
    display_name = (
        current_user.claims.get("name")
        or current_user.claims.get("first_name")
        or current_user.email
        or "Patient"
    )

    appwrite_profile = await appwrite_service.ensure_user_profile(user_id=current_user.userId)

    return UserDashboardResponse(
        userId=current_user.userId,
        email=current_user.email,
        displayName=display_name,
        appwriteSynced=appwrite_profile is not None,
    )
