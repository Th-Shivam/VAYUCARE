from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App Settings
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DEBUG: bool = True
    
    # CORS Origins
    ALLOWED_ORIGINS: Union[str, List[str]] = ["http://localhost:5173", "http://localhost:3000"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Clerk Authentication
    CLERK_JWKS_URL: str = "https://api.clerk.com/v1/jwks"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/vayu"

    # Appwrite
    APPWRITE_ENDPOINT: str = "https://cloud.appwrite.io/v1"
    APPWRITE_PROJECT_ID: str = "placeholder_project_id"
    APPWRITE_API_KEY: str = "placeholder_api_key"

    # Google ADK / Gemini
    GEMINI_API_KEY: str = "placeholder_gemini_key"
    GOOGLE_API_KEY: str = "placeholder_google_key"
    GOOGLE_ADK_MODEL: str = "gemini-flash-latest"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

# Bridge GEMINI_API_KEY and GOOGLE_API_KEY for Google ADK compatibility
import os
if settings.GOOGLE_API_KEY and settings.GOOGLE_API_KEY != "placeholder_google_key":
    os.environ["GOOGLE_API_KEY"] = settings.GOOGLE_API_KEY
elif settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "placeholder_gemini_key":
    os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY
