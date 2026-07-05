from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ReportResponse(BaseModel):
    id: str
    userId: str
    title: str
    fileId: Optional[str] = None
    fileName: Optional[str] = None
    fileUrl: Optional[str] = None
    status: str
    createdDate: datetime


class ReportListResponse(BaseModel):
    reports: list[ReportResponse]
