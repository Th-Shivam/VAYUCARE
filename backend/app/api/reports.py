from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.auth.clerk import UserSession, get_current_user
from app.schemas.reports import ReportListResponse, ReportResponse
from app.services.appwrite import appwrite_service

router = APIRouter(prefix="/api/reports")


@router.get("", response_model=ReportListResponse)
async def list_reports(current_user: UserSession = Depends(get_current_user)):
    reports = await appwrite_service.list_user_reports(current_user.userId)
    return ReportListResponse(reports=reports)


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def upload_report(
    title: str = Form(...),
    file: UploadFile | None = File(default=None),
    current_user: UserSession = Depends(get_current_user),
):
    file_bytes = await file.read() if file else None
    report = await appwrite_service.create_report(
        user_id=current_user.userId,
        title=title,
        file_name=file.filename if file else None,
        file_bytes=file_bytes,
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Report could not be saved. Check Appwrite database, collection, enum values, and API key scopes.",
        )

    return ReportResponse(**report)
