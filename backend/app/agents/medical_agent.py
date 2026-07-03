import logging
from typing import Any

from app.services.adk import GoogleADKService, adk_service

logger = logging.getLogger("vayu.agents.medical")


class MedicalReportAgent:
    """
    Google ADK-backed placeholder for medical report workflows.
    """
    agent_name = "MedicalReportAgent"

    def __init__(self, adk: GoogleADKService = adk_service) -> None:
        self.adk = adk
        self.root_agent = self.adk.create_llm_agent(
            name="medical_report_agent",
            description="Handles medical report intake and future medical report analysis workflows.",
            instruction=(
                "You are VAYU's Medical Report Agent. For Phase 2, acknowledge readiness only. "
                "Do not analyze PDFs, perform OCR, diagnose conditions, or provide medical advice."
            ),
        )
        logger.info("%s initialized with Google ADK.", self.agent_name)

    async def chat(self, message: str) -> dict[str, Any]:
        logger.info("%s received placeholder chat request.", self.agent_name)
        return {
            "agent": self.agent_name,
            "reply": "Medical Agent Ready",
        }

    async def analyze_report(self, document_content: str) -> dict[str, Any]:
        logger.info("Analyzing medical report content.")
        return {
            "summary": "AI summary placeholder.",
            "pathway": ["Consultation", "Surgical Pairing", "Rehabilitation"]
        }


MedicalAgent = MedicalReportAgent
