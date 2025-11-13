"""API router for interactions."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import InteractionsCreate, InteractionsListResponse, InteractionsResponse, InteractionsUpdate
from .service import InteractionsService

router = AuditedAPIRouter(prefix="/interactions")


@router.post(
    "",
    response_model=EnvelopeResponse[InteractionsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Interactions 생성",
    description="Interactions를 생성합니다.",
)
async def create_interactions(
    data: InteractionsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InteractionsResponse]:
    """Interactions 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await InteractionsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[InteractionsListResponse],
    summary="Interactions 목록 조회",
    description="Interactions 목록을 조회합니다.",
)
async def get_interactions_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InteractionsListResponse]:
    """Interactions 목록 조회"""
    items = await InteractionsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[InteractionsResponse],
    summary="Interactions 상세 조회",
    description="Interactions를 조회합니다.",
)
async def get_interactions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InteractionsResponse]:
    """Interactions 상세 조회"""
    item = await InteractionsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[InteractionsResponse],
    summary="Interactions 수정",
    description="Interactions를 수정합니다.",
)
async def update_interactions(
    item_id: UUID,
    data: InteractionsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InteractionsResponse]:
    """Interactions 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await InteractionsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Interactions 삭제",
    description="Interactions를 삭제합니다.",
)
async def delete_interactions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Interactions 삭제"""
    await InteractionsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Interactions가 삭제되었습니다"})
