"""API router for tax_invoice_lines."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import TaxInvoiceLinesCreate, TaxInvoiceLinesListResponse, TaxInvoiceLinesResponse, TaxInvoiceLinesUpdate
from .service import TaxInvoiceLinesService

router = AuditedAPIRouter(prefix="/tax_invoice_lines")


@router.post(
    "",
    response_model=EnvelopeResponse[TaxInvoiceLinesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="세금계산서 항목 생성",
    description="세금계산서 항목을 생성합니다.",
)
async def create_tax_invoice_lines(
    data: TaxInvoiceLinesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TaxInvoiceLinesResponse]:
    """세금계산서 항목 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await TaxInvoiceLinesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[TaxInvoiceLinesListResponse],
    summary="세금계산서 항목 목록 조회",
    description="세금계산서 항목 목록을 조회합니다.",
)
async def get_tax_invoice_lines_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TaxInvoiceLinesListResponse]:
    """세금계산서 항목 목록 조회"""
    items = await TaxInvoiceLinesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[TaxInvoiceLinesResponse],
    summary="세금계산서 항목 상세 조회",
    description="세금계산서 항목을 조회합니다.",
)
async def get_tax_invoice_lines(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TaxInvoiceLinesResponse]:
    """세금계산서 항목 상세 조회"""
    item = await TaxInvoiceLinesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[TaxInvoiceLinesResponse],
    summary="세금계산서 항목 수정",
    description="세금계산서 항목을 수정합니다.",
)
async def update_tax_invoice_lines(
    item_id: UUID,
    data: TaxInvoiceLinesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TaxInvoiceLinesResponse]:
    """세금계산서 항목 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await TaxInvoiceLinesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="세금계산서 항목 삭제",
    description="세금계산서 항목을 삭제합니다.",
)
async def delete_tax_invoice_lines(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """세금계산서 항목 삭제"""
    await TaxInvoiceLinesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "세금계산서 항목이 삭제되었습니다"})
