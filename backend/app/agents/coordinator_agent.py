import logging
from typing import Any

from app.agents.medical_agent import MedicalReportAgent
from app.services.adk import GoogleADKService, adk_service

logger = logging.getLogger("vayu.agents.coordinator")


class CoordinatorAgent:
    """
    Orchestrator Agent designed to coordinate workflows between other specialized agents
    (medical, hospital, cost, travel, document) using the Google Agent Development Kit (Google ADK).
    """
    def __init__(
        self,
        medical_report_agent: MedicalReportAgent | None = None,
        adk: GoogleADKService = adk_service,
    ) -> None:
        self.adk = adk
        self.root_agent = self.adk.create_llm_agent(
            name="coordinator_agent",
            description="Routes VAYU chat requests to the correct specialized Google ADK agent.",
            instruction=(
                "You are VAYU's root Coordinator Agent. Determine which specialized agent should "
                "handle the request, call that agent, and return structured JSON. In Phase 2, "
                "route all chat requests to MedicalReportAgent."
            ),
        )
        self.agent_registry = {
            "medical_report": medical_report_agent or MedicalReportAgent(adk=self.adk),
        }
        logger.info("CoordinatorAgent initialized with Google ADK root agent.")

    async def chat(self, message: str) -> dict[str, Any]:
        logger.info("CoordinatorAgent routing chat request to MedicalReportAgent.")
        medical_agent = self.agent_registry["medical_report"]
        return await medical_agent.chat(message)

    async def orchestrate_journey(self, patient_id: str, document_id: str) -> dict[str, Any]:
        """
        Orchestrates the multi-agent workflow:
        1. Summarizes the medical report.
        2. Proposes a treatment pathway.
        3. Identifies matching hospitals.
        4. Estimates cost and travel logistics.
        """
        logger.info(f"Orchestrating journey for patient {patient_id} using document {document_id}")
        return {
            "status": "initiated",
            "message": "Orchestrator workflow placeholder active.",
            "patient_id": patient_id,
            "document_id": document_id
        }


coordinator_agent = CoordinatorAgent()
