from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import logging

from app.schemas.health import HealthResponse
from app.database.session import get_db
from app.services.appwrite import appwrite_service

logger = logging.getLogger("vayu.api.health")
router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint to verify API, Database, and Appwrite status."""
    # Check Database health
    database_status = "healthy"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        database_status = "unhealthy"

    # Check Appwrite health
    appwrite_status = "healthy" if appwrite_service.storage is not None else "unconfigured"

    return HealthResponse(
        status="ok",
        database=database_status,
        appwrite=appwrite_status
    )
