"""ExchangeRates API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ExchangeRatesCreate, ExchangeRatesListResponse, ExchangeRatesResponse, ExchangeRatesUpdate
from .service import ExchangeRatesService

router = AuditedAPIRouter(prefix="/exchange-rates")


@router.post(
    "",
    response_model=EnvelopeResponse[ExchangeRatesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="환율 생성",
    description="새로운 환율을 생성합니다.",
)
async def create_exchange_rate(
    data: ExchangeRatesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ExchangeRatesResponse]:
    """환율 생성."""
    creator_id = UUID(current_user["user_id"])
    exchange_rate = await ExchangeRatesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(exchange_rate)


@router.get(
    "",
    response_model=EnvelopeResponse[ExchangeRatesListResponse],
    summary="환율 목록 조회",
    description="환율 목록을 페이지네이션과 필터로 조회합니다.",
)
async def get_exchange_rate_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    from_currency: str | None = Query(None, min_length=3, max_length=3, description="기준 통화 필터"),
    to_currency: str | None = Query(None, min_length=3, max_length=3, description="대상 통화 필터"),
    rate_type: str | None = Query(None, description="환율 유형 필터 (SPOT, FORWARD, BUYING, SELLING)"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ExchangeRatesListResponse]:
    """환율 목록 조회."""
    exchange_rates = await ExchangeRatesService.get_list(
        db,
        page=page,
        page_size=page_size,
        from_currency=from_currency,
        to_currency=to_currency,
        rate_type=rate_type,
    )
    return EnvelopeResponse.success_response(exchange_rates)


@router.get(
    "/{exchange_rate_id}",
    response_model=EnvelopeResponse[ExchangeRatesResponse],
    summary="환율 상세 조회",
    description="특정 환율의 상세 정보를 조회합니다.",
)
async def get_exchange_rate(
    exchange_rate_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ExchangeRatesResponse]:
    """환율 상세 조회."""
    exchange_rate = await ExchangeRatesService.get_by_id(db, exchange_rate_id)
    return EnvelopeResponse.success_response(exchange_rate)


@router.put(
    "/{exchange_rate_id}",
    response_model=EnvelopeResponse[ExchangeRatesResponse],
    summary="환율 수정",
    description="환율 정보를 수정합니다.",
)
async def update_exchange_rate(
    exchange_rate_id: UUID,
    data: ExchangeRatesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ExchangeRatesResponse]:
    """환율 수정."""
    updater_id = UUID(current_user["user_id"])
    exchange_rate = await ExchangeRatesService.update(db, exchange_rate_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(exchange_rate)


@router.delete(
    "/{exchange_rate_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="환율 삭제",
    description="환율을 삭제합니다.",
)
async def delete_exchange_rate(
    exchange_rate_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """환율 삭제."""
    await ExchangeRatesService.delete(db, exchange_rate_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "환율이 삭제되었습니다"})
