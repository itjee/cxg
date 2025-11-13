"""API router for makers."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import MakersCreate, MakersListResponse, MakersResponse, MakersUpdate
from .service import MakersService

router = AuditedAPIRouter(prefix="/makers")


@router.post(
    "",
    response_model=EnvelopeResponse[MakersResponse],
    status_code=status.HTTP_201_CREATED,
    summary="제조사 생성",
    description="제조사를 생성합니다.",
)
async def create_makers(
    data: MakersCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[MakersResponse]:
    """제조사 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await MakersService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[MakersListResponse],
    summary="제조사 목록 조회",
    description="제조사 목록을 조회합니다.",
)
async def get_makers_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[MakersListResponse]:
    """제조사 목록 조회"""
    items = await MakersService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[MakersResponse],
    summary="제조사 상세 조회",
    description="제조사를 조회합니다.",
)
async def get_makers(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[MakersResponse]:
    """제조사 상세 조회"""
    item = await MakersService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[MakersResponse],
    summary="제조사 수정",
    description="제조사를 수정합니다.",
)
async def update_makers(
    item_id: UUID,
    data: MakersUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[MakersResponse]:
    """제조사 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await MakersService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="제조사 삭제",
    description="제조사를 삭제합니다.",
)
async def delete_makers(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """제조사 삭제"""
    await MakersService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "제조사가 삭제되었습니다"})
