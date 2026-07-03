import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from app.agents.coordinator_agent import CoordinatorAgent, coordinator_agent
from app.schemas.agents import AgentChatRequest, AgentChatResponse

logger = logging.getLogger("vayu.api.agents")
router = APIRouter(prefix="/api/agents")


def get_coordinator_agent() -> CoordinatorAgent:
    return coordinator_agent


@router.post("/chat", response_model=AgentChatResponse)
async def chat_with_agent(
    request: AgentChatRequest,
    coordinator: CoordinatorAgent = Depends(get_coordinator_agent),
) -> AgentChatResponse:
    logger.info("Received agent chat request.")
    result = await coordinator.chat(request.message)
    return AgentChatResponse(
        success=True,
        agent=result["agent"],
        reply=result["reply"],
        timestamp=datetime.now(timezone.utc),
    )
