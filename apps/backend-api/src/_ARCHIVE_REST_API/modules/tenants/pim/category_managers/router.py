"""API router for category_managers."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import CategoryManagersCreate, CategoryManagersListResponse, CategoryManagersResponse, CategoryManagersUpdate
from .service import CategoryManagersService

router = AuditedAPIRouter(prefix="/category_managers")


@router.post(
    "",
    response_model=EnvelopeResponse[CategoryManagersResponse],
    status_code=status.HTTP_201_CREATED,
    summary="카테고리 담당자 생성",
    description="카테고리 담당자를 생성합니다.",
)
async def create_category_managers(
    data: CategoryManagersCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CategoryManagersResponse]:
    """카테고리 담당자 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await CategoryManagersService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[CategoryManagersListResponse],
    summary="카테고리 담당자 목록 조회",
    description="카테고리 담당자 목록을 조회합니다.",
)
async def get_category_managers_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CategoryManagersListResponse]:
    """카테고리 담당자 목록 조회"""
    items = await CategoryManagersService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[CategoryManagersResponse],
    summary="카테고리 담당자 상세 조회",
    description="카테고리 담당자를 조회합니다.",
)
async def get_category_managers(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CategoryManagersResponse]:
    """카테고리 담당자 상세 조회"""
    item = await CategoryManagersService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[CategoryManagersResponse],
    summary="카테고리 담당자 수정",
    description="카테고리 담당자를 수정합니다.",
)
async def update_category_managers(
    item_id: UUID,
    data: CategoryManagersUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CategoryManagersResponse]:
    """카테고리 담당자 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await CategoryManagersService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="카테고리 담당자 삭제",
    description="카테고리 담당자를 삭제합니다.",
)
async def delete_category_managers(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """카테고리 담당자 삭제"""
    await CategoryManagersService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "카테고리 담당자가 삭제되었습니다"})
