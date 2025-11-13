"""Salary Structures API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import SalaryStructuresCreate, SalaryStructuresListResponse, SalaryStructuresResponse, SalaryStructuresUpdate
from .service import SalaryStructuresService

router = AuditedAPIRouter(prefix="/salary-structures")


@router.post(
    "",
    response_model=EnvelopeResponse[SalaryStructuresResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create(
    data: SalaryStructuresCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalaryStructuresResponse]:
    """Create new record."""
    creator_id = UUID(current_user["user_id"])
    record = await SalaryStructuresService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(record)


@router.get(
    "",
    response_model=EnvelopeResponse[SalaryStructuresListResponse],
)
async def get_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalaryStructuresListResponse]:
    """Get list."""
    records = await SalaryStructuresService.get_list(db, page=page, page_size=page_size)
    return EnvelopeResponse.success_response(records)


@router.get(
    "/{record_id}",
    response_model=EnvelopeResponse[SalaryStructuresResponse],
)
async def get_by_id(
    record_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalaryStructuresResponse]:
    """Get by ID."""
    record = await SalaryStructuresService.get_by_id(db, record_id)
    return EnvelopeResponse.success_response(record)


@router.put(
    "/{record_id}",
    response_model=EnvelopeResponse[SalaryStructuresResponse],
)
async def update(
    record_id: UUID,
    data: SalaryStructuresUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalaryStructuresResponse]:
    """Update record."""
    updater_id = UUID(current_user["user_id"])
    record = await SalaryStructuresService.update(db, record_id, data, updated_by=updater_id)
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
    await SalaryStructuresService.delete(db, record_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Record deleted"})
