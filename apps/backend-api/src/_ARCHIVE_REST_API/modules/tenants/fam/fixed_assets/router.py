"""API router for fixed_assets."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import FixedAssetsCreate, FixedAssetsListResponse, FixedAssetsResponse, FixedAssetsUpdate
from .service import FixedAssetsService

router = AuditedAPIRouter(prefix="/fixed_assets")


@router.post(
    "",
    response_model=EnvelopeResponse[FixedAssetsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Fixed Assets 생성",
    description="Fixed Assets를 생성합니다.",
)
async def create_fixed_assets(
    data: FixedAssetsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FixedAssetsResponse]:
    """Fixed Assets 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await FixedAssetsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[FixedAssetsListResponse],
    summary="Fixed Assets 목록 조회",
    description="Fixed Assets 목록을 조회합니다.",
)
async def get_fixed_assets_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FixedAssetsListResponse]:
    """Fixed Assets 목록 조회"""
    items = await FixedAssetsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[FixedAssetsResponse],
    summary="Fixed Assets 상세 조회",
    description="Fixed Assets를 조회합니다.",
)
async def get_fixed_assets(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FixedAssetsResponse]:
    """Fixed Assets 상세 조회"""
    item = await FixedAssetsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[FixedAssetsResponse],
    summary="Fixed Assets 수정",
    description="Fixed Assets를 수정합니다.",
)
async def update_fixed_assets(
    item_id: UUID,
    data: FixedAssetsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FixedAssetsResponse]:
    """Fixed Assets 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await FixedAssetsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Fixed Assets 삭제",
    description="Fixed Assets를 삭제합니다.",
)
async def delete_fixed_assets(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Fixed Assets 삭제"""
    await FixedAssetsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Fixed Assets가 삭제되었습니다"})
