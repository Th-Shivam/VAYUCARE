from sqlalchemy import String, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.report import MedicalReport

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    report_id: Mapped[str] = mapped_column(String, ForeignKey("medical_reports.id"), nullable=False, unique=True)
    summary: Mapped[str] = mapped_column(Text, nullable=False)  # AI generated summary
    treatment_pathway: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=True)  # AI proposed pathway
    estimated_cost: Mapped[str] = mapped_column(String, nullable=True)  # AI cost estimation
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    report: Mapped["MedicalReport"] = relationship("MedicalReport", back_populates="analysis")
