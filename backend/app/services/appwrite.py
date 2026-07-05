import logging
from datetime import datetime, timezone
from typing import Optional
from appwrite.exception import AppwriteException
from appwrite.client import Client
from appwrite.id import ID
from appwrite.input_file import InputFile
from appwrite.query import Query
from appwrite.services.storage import Storage
from appwrite.services.tables_db import TablesDB

from app.config.settings import settings

logger = logging.getLogger("vayu.services.appwrite")


def _as_dict(value) -> dict:
    if hasattr(value, "model_dump"):
        return value.model_dump()
    return value


def _document_id(document: dict) -> str:
    document = _as_dict(document)
    return document.get("$id") or document.get("id") or document.get("rowId") or ""


def _report_response(document: dict) -> dict:
    document = _as_dict(document)
    return {
        "id": _document_id(document),
        "userId": document["userId"],
        "title": document["title"],
        "fileId": document.get("fileId"),
        "fileName": document.get("fileName"),
        "fileUrl": document.get("fileUrl"),
        "status": document["status"],
        "createdDate": document["createdDate"],
    }


def _without_none(data: dict) -> dict:
    return {key: value for key, value in data.items() if value is not None}

class AppwriteService:
    def __init__(self):
        self.client = Client()
        if settings.APPWRITE_ENDPOINT and settings.APPWRITE_PROJECT_ID:
            self.client.set_endpoint(settings.APPWRITE_ENDPOINT)
            self.client.set_project(settings.APPWRITE_PROJECT_ID)
            if settings.APPWRITE_API_KEY:
                self.client.set_key(settings.APPWRITE_API_KEY)
            self.tables = TablesDB(self.client)
            self.storage = Storage(self.client)
            logger.info("Appwrite client initialized successfully.")
        else:
            self.tables = None
            self.storage = None
            logger.warning("Appwrite credentials not fully provided. Appwrite services will be unavailable.")

    @property
    def is_configured(self) -> bool:
        return (
            self.tables is not None
            and self.storage is not None
            and bool(settings.APPWRITE_DATABASE_ID)
            and settings.APPWRITE_PROJECT_ID != "placeholder_project_id"
            and settings.APPWRITE_API_KEY != "placeholder_api_key"
        )

    async def ensure_user_profile(self, user_id: str) -> Optional[dict]:
        """
        Ensure the current Clerk user exists in the Appwrite users collection.

        The Appwrite users schema currently stores app-specific fields only:
        role, phoneNumber, address, city, dateOfBirth, and isActive.
        Clerk remains the source of truth for identity/email/name, and the
        Appwrite document ID is the Clerk user ID.
        """
        if not self.is_configured or not self.tables:
            return None

        try:
            return self._get_row(settings.APPWRITE_USERS_COLLECTION_ID, user_id)
        except AppwriteException as e:
            if e.code != 404:
                logger.error(f"Failed to fetch Appwrite user profile: {e}")
                return None

            try:
                return self._create_row(
                    settings.APPWRITE_USERS_COLLECTION_ID,
                    user_id,
                    {
                        "role": "patient",
                        "isActive": True,
                    },
                )
            except Exception as create_error:
                logger.error(f"Failed to create Appwrite user profile: {create_error}")
                return None
        except Exception as e:
            logger.error(f"Unexpected Appwrite user profile error: {e}")
            return None

    async def upload_file(self, bucket_id: str, file_id: str, file_bytes: bytes, file_name: str) -> Optional[str]:
        """Upload a file to Appwrite storage and return its public view URL."""
        if not self.storage or not bucket_id:
            logger.error("Appwrite storage is not initialized.")
            return None
        
        try:
            self.storage.create_file(
                bucket_id,
                file_id,
                InputFile.from_bytes(file_bytes, file_name),
            )
            logger.info(f"Placeholder: Uploading file {file_name} to bucket {bucket_id}")
            return f"{settings.APPWRITE_ENDPOINT}/storage/buckets/{bucket_id}/files/{file_id}/view?project={settings.APPWRITE_PROJECT_ID}"
        except Exception as e:
            logger.error(f"Failed to upload file to Appwrite: {e}")
            return None

    async def create_report(
        self,
        *,
        user_id: str,
        title: str,
        file_name: Optional[str],
        file_bytes: Optional[bytes],
    ) -> Optional[dict]:
        if not self.is_configured or not self.tables:
            return None

        file_id = ID.unique() if file_bytes and settings.APPWRITE_REPORTS_BUCKET_ID else None
        file_url = None
        if file_id and file_name and file_bytes:
            file_url = await self.upload_file(
                settings.APPWRITE_REPORTS_BUCKET_ID,
                file_id,
                file_bytes,
                file_name,
            )

        try:
            document = self._create_row(
                settings.APPWRITE_REPORTS_COLLECTION_ID,
                ID.unique(),
                _without_none({
                    "userId": user_id,
                    "title": title,
                    "fileId": file_id if file_url else None,
                    "fileName": file_name,
                    "fileUrl": file_url,
                    "status": "uploaded",
                    "createdDate": datetime.now(timezone.utc).isoformat(),
                }),
            )
            return _report_response(document)
        except Exception as e:
            logger.error(f"Failed to create Appwrite report: {e}")
            return None

    async def list_user_reports(self, user_id: str) -> list[dict]:
        if not self.is_configured or not self.tables:
            return []

        try:
            result = self._list_rows(
                settings.APPWRITE_REPORTS_COLLECTION_ID,
                [
                    Query.equal("userId", user_id),
                    Query.order_desc("createdDate"),
                    Query.limit(25),
                ],
            )
            return [_report_response(document) for document in result.get("rows", [])]
        except Exception as e:
            logger.error(f"Failed to list Appwrite reports: {e}")
            return []

    def _create_row(self, table_id: str, row_id: str, data: dict) -> dict:
        return self.client.call(
            "post",
            f"/tablesdb/{settings.APPWRITE_DATABASE_ID}/tables/{table_id}/rows",
            {
                "X-Appwrite-Project": self.client.get_config("project"),
                "content-type": "application/json",
                "accept": "application/json",
            },
            {
                "rowId": row_id,
                "data": data,
            },
        )

    def _get_row(self, table_id: str, row_id: str) -> dict:
        return self.client.call(
            "get",
            f"/tablesdb/{settings.APPWRITE_DATABASE_ID}/tables/{table_id}/rows/{row_id}",
            {
                "X-Appwrite-Project": self.client.get_config("project"),
                "accept": "application/json",
            },
        )

    def _list_rows(self, table_id: str, queries: list[str]) -> dict:
        return self.client.call(
            "get",
            f"/tablesdb/{settings.APPWRITE_DATABASE_ID}/tables/{table_id}/rows",
            {
                "X-Appwrite-Project": self.client.get_config("project"),
                "accept": "application/json",
            },
            {
                "queries": queries,
            },
        )

appwrite_service = AppwriteService()
