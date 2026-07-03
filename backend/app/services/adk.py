import logging
import os
from dataclasses import dataclass
from typing import Any

from app.config.settings import settings

logger = logging.getLogger("vayu.services.adk")


try:
    from google.adk.agents import LlmAgent
except ImportError:  # pragma: no cover - compatibility with older ADK imports
    from google.adk.agents.llm_agent import Agent as LlmAgent


@dataclass(frozen=True)
class GoogleADKConfig:
    """Runtime configuration for VAYU's Google ADK agents."""

    model: str
    api_key_configured: bool


class GoogleADKService:
    """Factory for Google ADK LLM agents configured with Gemini."""

    def __init__(self, model: str = settings.GOOGLE_ADK_MODEL) -> None:
        self.model = model
        self._configure_google_api_key()
        self.config = GoogleADKConfig(
            model=self.model,
            api_key_configured=self._has_google_api_key(),
        )
        logger.info("Google ADK initialized with Gemini model %s", self.model)

    def create_llm_agent(
        self,
        *,
        name: str,
        description: str,
        instruction: str,
        tools: list[Any] | None = None,
    ) -> LlmAgent:
        """Create a Google ADK LlmAgent using the configured Gemini model."""
        return LlmAgent(
            model=self.model,
            name=name,
            description=description,
            instruction=instruction,
            tools=tools or [],
        )

    def _configure_google_api_key(self) -> None:
        if settings.GOOGLE_API_KEY and settings.GOOGLE_API_KEY != "placeholder_google_key":
            os.environ["GOOGLE_API_KEY"] = settings.GOOGLE_API_KEY
        elif settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "placeholder_gemini_key":
            os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY

    @staticmethod
    def _has_google_api_key() -> bool:
        return bool(os.environ.get("GOOGLE_API_KEY"))


adk_service = GoogleADKService()
