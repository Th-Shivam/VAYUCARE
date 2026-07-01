from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.analysis import AnalysisResult

class MedicalReport(Base):
    __tablename__ = "medical_reports"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)  # Appwrite File ID / Local ID
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    file_name: Mapped[str] = mapped_column(String, nullable=False)
    file_url: Mapped[str] = mapped_column(String, nullable=False)
    mime_type: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="reports")
    analysis: Mapped[Optional["AnalysisResult"]] = relationship("AnalysisResult", back_populates="report", uselist=False, cascade="all, delete-orphan")
