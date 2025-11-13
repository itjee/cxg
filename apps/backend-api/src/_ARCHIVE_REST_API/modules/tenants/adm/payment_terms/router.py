"""PaymentTerms API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PaymentTermsCreate, PaymentTermsListResponse, PaymentTermsResponse, PaymentTermsUpdate
from .service import PaymentTermsService

router = AuditedAPIRouter(prefix="/payment-terms")


@router.post(
    "",
    response_model=EnvelopeResponse[PaymentTermsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="결제 조건 생성",
    description="새로운 결제 조건을 생성합니다.",
)
async def create_payment_term(
    data: PaymentTermsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PaymentTermsResponse]:
    """결제 조건 생성."""
    creator_id = UUID(current_user["user_id"])
    payment_term = await PaymentTermsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(payment_term)


@router.get(
    "",
    response_model=EnvelopeResponse[PaymentTermsListResponse],
    summary="결제 조건 목록 조회",
    description="결제 조건 목록을 페이지네이션과 필터로 조회합니다.",
)
async def get_payment_term_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    is_active: bool | None = Query(None, description="활성 여부 필터"),
    is_deleted: bool | None = Query(False, description="삭제 여부 필터"),
    search: str | None = Query(None, description="검색어 (코드, 조건명)"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PaymentTermsListResponse]:
    """결제 조건 목록 조회."""
    payment_terms = await PaymentTermsService.get_list(
        db,
        page=page,
        page_size=page_size,
        is_active=is_active,
        is_deleted=is_deleted,
        search=search,
    )
    return EnvelopeResponse.success_response(payment_terms)


@router.get(
    "/{payment_term_id}",
    response_model=EnvelopeResponse[PaymentTermsResponse],
    summary="결제 조건 상세 조회",
    description="특정 결제 조건의 상세 정보를 조회합니다.",
)
async def get_payment_term(
    payment_term_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PaymentTermsResponse]:
    """결제 조건 상세 조회."""
    payment_term = await PaymentTermsService.get_by_id(db, payment_term_id)
    return EnvelopeResponse.success_response(payment_term)


@router.put(
    "/{payment_term_id}",
    response_model=EnvelopeResponse[PaymentTermsResponse],
    summary="결제 조건 수정",
    description="결제 조건 정보를 수정합니다.",
)
async def update_payment_term(
    payment_term_id: UUID,
    data: PaymentTermsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PaymentTermsResponse]:
    """결제 조건 수정."""
    updater_id = UUID(current_user["user_id"])
    payment_term = await PaymentTermsService.update(db, payment_term_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(payment_term)


@router.delete(
    "/{payment_term_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="결제 조건 삭제",
    description="결제 조건을 삭제합니다 (소프트 삭제).",
)
async def delete_payment_term(
    payment_term_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """결제 조건 삭제."""
    await PaymentTermsService.delete(db, payment_term_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "결제 조건이 삭제되었습니다"})
