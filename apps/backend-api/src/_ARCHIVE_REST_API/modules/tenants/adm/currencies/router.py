"""Currencies API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import CurrenciesCreate, CurrenciesListResponse, CurrenciesResponse, CurrenciesUpdate
from .service import CurrenciesService

router = AuditedAPIRouter(prefix="/currencies")


@router.post(
    "",
    response_model=EnvelopeResponse[CurrenciesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="통화 생성",
    description="새로운 통화를 생성합니다.",
)
async def create_currency(
    data: CurrenciesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CurrenciesResponse]:
    """통화 생성."""
    creator_id = UUID(current_user["user_id"])
    currency = await CurrenciesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(currency)


@router.get(
    "",
    response_model=EnvelopeResponse[CurrenciesListResponse],
    summary="통화 목록 조회",
    description="통화 목록을 페이지네이션과 필터로 조회합니다.",
)
async def get_currency_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    is_active: bool | None = Query(None, description="활성 여부 필터"),
    search: str | None = Query(None, description="검색어 (통화 코드, 통화명)"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CurrenciesListResponse]:
    """통화 목록 조회."""
    currencies = await CurrenciesService.get_list(
        db,
        page=page,
        page_size=page_size,
        is_active=is_active,
        search=search,
    )
    return EnvelopeResponse.success_response(currencies)


@router.get(
    "/{currency_id}",
    response_model=EnvelopeResponse[CurrenciesResponse],
    summary="통화 상세 조회",
    description="특정 통화의 상세 정보를 조회합니다.",
)
async def get_currency(
    currency_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CurrenciesResponse]:
    """통화 상세 조회."""
    currency = await CurrenciesService.get_by_id(db, currency_id)
    return EnvelopeResponse.success_response(currency)


@router.put(
    "/{currency_id}",
    response_model=EnvelopeResponse[CurrenciesResponse],
    summary="통화 수정",
    description="통화 정보를 수정합니다.",
)
async def update_currency(
    currency_id: UUID,
    data: CurrenciesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CurrenciesResponse]:
    """통화 수정."""
    updater_id = UUID(current_user["user_id"])
    currency = await CurrenciesService.update(db, currency_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(currency)


@router.delete(
    "/{currency_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="통화 삭제",
    description="통화를 삭제합니다.",
)
async def delete_currency(
    currency_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """통화 삭제."""
    await CurrenciesService.delete(db, currency_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "통화가 삭제되었습니다"})
