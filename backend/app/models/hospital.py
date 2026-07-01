from sqlalchemy import String, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.appointment import Appointment

class Hospital(Base):
    __tablename__ = "hospitals"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    city: Mapped[str] = mapped_column(String, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    success_rate: Mapped[str] = mapped_column(String, nullable=True)
    wait_time: Mapped[str] = mapped_column(String, nullable=True)
    price_starting: Mapped[str] = mapped_column(String, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(String, nullable=True)

    # Relationships
    appointments: Mapped[List["Appointment"]] = relationship("Appointment", back_populates="hospital", cascade="all, delete-orphan")
