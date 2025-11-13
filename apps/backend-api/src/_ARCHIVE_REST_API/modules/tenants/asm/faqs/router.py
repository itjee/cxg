"""API router for faqs."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import FaqsCreate, FaqsListResponse, FaqsResponse, FaqsUpdate
from .service import FaqsService

router = AuditedAPIRouter(prefix="/faqs")


@router.post(
    "",
    response_model=EnvelopeResponse[FaqsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Faqs 생성",
    description="Faqs를 생성합니다.",
)
async def create_faqs(
    data: FaqsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FaqsResponse]:
    """Faqs 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await FaqsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[FaqsListResponse],
    summary="Faqs 목록 조회",
    description="Faqs 목록을 조회합니다.",
)
async def get_faqs_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FaqsListResponse]:
    """Faqs 목록 조회"""
    items = await FaqsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[FaqsResponse],
    summary="Faqs 상세 조회",
    description="Faqs를 조회합니다.",
)
async def get_faqs(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FaqsResponse]:
    """Faqs 상세 조회"""
    item = await FaqsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[FaqsResponse],
    summary="Faqs 수정",
    description="Faqs를 수정합니다.",
)
async def update_faqs(
    item_id: UUID,
    data: FaqsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FaqsResponse]:
    """Faqs 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await FaqsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Faqs 삭제",
    description="Faqs를 삭제합니다.",
)
async def delete_faqs(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Faqs 삭제"""
    await FaqsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Faqs가 삭제되었습니다"})
