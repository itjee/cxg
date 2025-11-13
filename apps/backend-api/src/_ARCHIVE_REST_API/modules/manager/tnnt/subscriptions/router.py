"""API Router for Subscription."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import SubscriptionCreate, SubscriptionListResponse, SubscriptionResponse, SubscriptionUpdate
from .service import SubscriptionService

router = AuditedAPIRouter()


@router.post(
    "",
    response_model=EnvelopeResponse[SubscriptionResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Subscription 생성",
    description="새로운 Subscription를 생성합니다.",
)
async def create(
    data: SubscriptionCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SubscriptionResponse]:
    """Subscription 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await SubscriptionService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[SubscriptionListResponse],
    summary="Subscription 목록 조회",
    description="Subscription 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SubscriptionListResponse]:
    """Subscription 목록 조회."""
    result = await SubscriptionService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[SubscriptionResponse],
    summary="Subscription 상세 조회",
    description="Subscription 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SubscriptionResponse]:
    """Subscription 상세 조회."""
    obj = await SubscriptionService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[SubscriptionResponse],
    summary="Subscription 수정",
    description="Subscription 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: SubscriptionUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SubscriptionResponse]:
    """Subscription 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await SubscriptionService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Subscription 삭제",
    description="Subscription를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Subscription 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await SubscriptionService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "Subscription가 삭제되었습니다"})