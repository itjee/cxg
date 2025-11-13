"""Payment Transactions API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PaymentTransactionsCreate, PaymentTransactionsListResponse, PaymentTransactionsResponse, PaymentTransactionsUpdate
from .service import PaymentTransactionsService

router = AuditedAPIRouter(prefix="/payment-transactions")


@router.post(
    "",
    response_model=EnvelopeResponse[PaymentTransactionsResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create(
    data: PaymentTransactionsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PaymentTransactionsResponse]:
    """Create new record."""
    creator_id = UUID(current_user["user_id"])
    record = await PaymentTransactionsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(record)


@router.get(
    "",
    response_model=EnvelopeResponse[PaymentTransactionsListResponse],
)
async def get_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PaymentTransactionsListResponse]:
    """Get list."""
    records = await PaymentTransactionsService.get_list(db, page=page, page_size=page_size)
    return EnvelopeResponse.success_response(records)


@router.get(
    "/{record_id}",
    response_model=EnvelopeResponse[PaymentTransactionsResponse],
)
async def get_by_id(
    record_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PaymentTransactionsResponse]:
    """Get by ID."""
    record = await PaymentTransactionsService.get_by_id(db, record_id)
    return EnvelopeResponse.success_response(record)


@router.put(
    "/{record_id}",
    response_model=EnvelopeResponse[PaymentTransactionsResponse],
)
async def update(
    record_id: UUID,
    data: PaymentTransactionsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PaymentTransactionsResponse]:
    """Update record."""
    updater_id = UUID(current_user["user_id"])
    record = await PaymentTransactionsService.update(db, record_id, data, updated_by=updater_id)
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
    await PaymentTransactionsService.delete(db, record_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Record deleted"})
