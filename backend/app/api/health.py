from fastapi import APIRouter
import logging

from app.schemas.health import HealthResponse
from app.services.appwrite import appwrite_service

logger = logging.getLogger("vayu.api.health")
router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify API and Appwrite configuration."""
    appwrite_status = "configured" if appwrite_service.is_configured else "unconfigured"

    return HealthResponse(
        status="ok",
        appwrite=appwrite_status
    )
