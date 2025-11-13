"""청구서 모듈 라우터 (API 엔드포인트)"""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import (
    InvoiceCreate,
    InvoiceListResponse,
    InvoiceResponse,
    InvoiceUpdate,
)
from .service import InvoiceService

router = AuditedAPIRouter(prefix="/invoices", tags=["Invoices"])


@router.post(
    "",
    response_model=EnvelopeResponse[InvoiceResponse],
    status_code=status.HTTP_201_CREATED,
    summary="청구서 생성",
    description="새로운 청구서를 생성합니다.",
)
async def create_invoice(
    data: InvoiceCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InvoiceResponse]:
    """청구서를 생성합니다.

    요청 본문에 청구서 정보를 포함하여 POST 요청을 보냅니다.
    금액 정보는 검증됩니다:
    - total_amount = base_amount + usage_amount - discount_amount + tax_amount

    Returns:
        생성된 청구서 정보
    """
    creator_id = UUID(current_user["user_id"])
    invoice = await InvoiceService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(invoice)


@router.get(
    "",
    response_model=EnvelopeResponse[InvoiceListResponse],
    summary="청구서 목록 조회",
    description="청구서 목록을 페이지네이션 및 필터링과 함께 조회합니다.",
)
async def list_invoices(
    page: int = Query(1, ge=1, description="페이지 번호 (1부터 시작)"),
    page_size: int = Query(20, ge=1, le=100, description="페이지당 항목 수"),
    search: str | None = Query(
        None,
        description="검색어 (청구서 번호)",
        example="INV-2024-001"
    ),
    status: str | None = Query(
        None,
        description="상태 필터",
        regex="^(PENDING|SENT|PAID|OVERDUE|CANCELED)?$"
    ),
    tenant_id: UUID | None = Query(
        None,
        description="테넌트 ID 필터"
    ),
    payment_method: str | None = Query(
        None,
        description="결제 수단 필터",
        regex="^(CREDIT_CARD|BANK_TRANSFER|PAYPAL|WIRE_TRANSFER|CHECK)?$"
    ),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InvoiceListResponse]:
    """청구서 목록을 조회합니다.

    페이지네이션, 검색, 필터링을 지원합니다.
    - search: 청구서 번호로 부분 검색
    - status: PENDING, SENT, PAID, OVERDUE, CANCELED 중 하나
    - tenant_id: 특정 테넌트의 청구서만 조회
    - payment_method: 결제 수단으로 필터링

    Returns:
        청구서 목록 및 페이지 정보
    """
    result = await InvoiceService.get_list(
        db,
        page=page,
        page_size=page_size,
        search=search,
        status=status,
        tenant_id=tenant_id,
        payment_method=payment_method,
    )
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{invoice_id}",
    response_model=EnvelopeResponse[InvoiceResponse],
    summary="청구서 상세 조회",
    description="청구서 상세 정보를 조회합니다.",
)
async def get_invoice(
    invoice_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InvoiceResponse]:
    """청구서 상세 정보를 조회합니다.

    Args:
        invoice_id: 청구서 ID

    Returns:
        청구서 상세 정보
    """
    invoice = await InvoiceService.get_by_id(db, invoice_id)
    return EnvelopeResponse.success_response(invoice)


@router.put(
    "/{invoice_id}",
    response_model=EnvelopeResponse[InvoiceResponse],
    summary="청구서 수정",
    description="청구서 정보를 수정합니다.",
)
async def update_invoice(
    invoice_id: UUID,
    data: InvoiceUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InvoiceResponse]:
    """청구서를 수정합니다.

    요청 본문에 수정할 필드만 포함하면 됩니다 (부분 업데이트).
    금액 관련 필드를 수정할 경우, total_amount 검증이 수행됩니다.

    Args:
        invoice_id: 청구서 ID
        data: 수정할 필드들

    Returns:
        수정된 청구서 정보
    """
    updater_id = UUID(current_user["user_id"])
    invoice = await InvoiceService.update(
        db,
        invoice_id,
        data,
        updated_by=updater_id
    )
    return EnvelopeResponse.success_response(invoice)


@router.delete(
    "/{invoice_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    status_code=status.HTTP_200_OK,
    summary="청구서 삭제",
    description="청구서를 삭제합니다 (소프트 삭제).",
)
async def delete_invoice(
    invoice_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """청구서를 삭제합니다 (소프트 삭제).

    실제로 데이터베이스에서 삭제되지 않으며,
    deleted 플래그만 TRUE로 변경됩니다.

    Args:
        invoice_id: 청구서 ID

    Returns:
        삭제 완료 메시지
    """
    deleter_id = UUID(current_user["user_id"])
    await InvoiceService.delete(db, invoice_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response(
        {"message": "청구서가 삭제되었습니다"}
    )