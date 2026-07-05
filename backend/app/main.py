import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.api import agents, health, reports, users

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("vayu")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("VAYU FastAPI Backend starting up...")
    logger.info(f"CORS Allowed Origins: {settings.ALLOWED_ORIGINS}")
    yield
    # Shutdown
    logger.info("VAYU FastAPI Backend shutting down...")

def create_app() -> FastAPI:
    app = FastAPI(
        title="VAYU AI Medical Travel Coordinator API",
        description="Backend API for VAYU AI-powered medical tourism platform.",
        version="0.1.0",
        debug=settings.DEBUG,
        lifespan=lifespan
    )

    # CORS configuration
    origins = settings.ALLOWED_ORIGINS
    if isinstance(origins, str):
        origins = [origins]
        
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register API Routers
    app.include_router(health.router, tags=["Health"])
    app.include_router(users.router, tags=["Users"])
    app.include_router(reports.router, tags=["Reports"])
    app.include_router(agents.router, tags=["Agents"])

    return app

app = create_app()
