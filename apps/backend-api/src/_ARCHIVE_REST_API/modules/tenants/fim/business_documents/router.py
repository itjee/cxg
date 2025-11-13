"""Business Documents API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import BusinessDocumentsCreate, BusinessDocumentsListResponse, BusinessDocumentsResponse, BusinessDocumentsUpdate
from .service import BusinessDocumentsService

router = AuditedAPIRouter(prefix="/business-documents")


@router.post(
    "",
    response_model=EnvelopeResponse[BusinessDocumentsResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create(
    data: BusinessDocumentsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[BusinessDocumentsResponse]:
    """Create new record."""
    creator_id = UUID(current_user["user_id"])
    record = await BusinessDocumentsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(record)


@router.get(
    "",
    response_model=EnvelopeResponse[BusinessDocumentsListResponse],
)
async def get_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[BusinessDocumentsListResponse]:
    """Get list."""
    records = await BusinessDocumentsService.get_list(db, page=page, page_size=page_size)
    return EnvelopeResponse.success_response(records)


@router.get(
    "/{record_id}",
    response_model=EnvelopeResponse[BusinessDocumentsResponse],
)
async def get_by_id(
    record_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[BusinessDocumentsResponse]:
    """Get by ID."""
    record = await BusinessDocumentsService.get_by_id(db, record_id)
    return EnvelopeResponse.success_response(record)


@router.put(
    "/{record_id}",
    response_model=EnvelopeResponse[BusinessDocumentsResponse],
)
async def update(
    record_id: UUID,
    data: BusinessDocumentsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[BusinessDocumentsResponse]:
    """Update record."""
    updater_id = UUID(current_user["user_id"])
    record = await BusinessDocumentsService.update(db, record_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(record)


@router.delete(
    "/{record_id}",
    response_model=EnvelopeResponse[dict[str, str]],
)
async def delete(
    record_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Delete record."""
    await BusinessDocumentsService.delete(db, record_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Record deleted"})
