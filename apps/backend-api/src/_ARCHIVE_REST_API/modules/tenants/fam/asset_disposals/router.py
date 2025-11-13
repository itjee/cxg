"""API router for asset_disposals."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import AssetDisposalsCreate, AssetDisposalsListResponse, AssetDisposalsResponse, AssetDisposalsUpdate
from .service import AssetDisposalsService

router = AuditedAPIRouter(prefix="/asset_disposals")


@router.post(
    "",
    response_model=EnvelopeResponse[AssetDisposalsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Asset Disposals 생성",
    description="Asset Disposals를 생성합니다.",
)
async def create_asset_disposals(
    data: AssetDisposalsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AssetDisposalsResponse]:
    """Asset Disposals 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await AssetDisposalsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[AssetDisposalsListResponse],
    summary="Asset Disposals 목록 조회",
    description="Asset Disposals 목록을 조회합니다.",
)
async def get_asset_disposals_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AssetDisposalsListResponse]:
    """Asset Disposals 목록 조회"""
    items = await AssetDisposalsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[AssetDisposalsResponse],
    summary="Asset Disposals 상세 조회",
    description="Asset Disposals를 조회합니다.",
)
async def get_asset_disposals(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AssetDisposalsResponse]:
    """Asset Disposals 상세 조회"""
    item = await AssetDisposalsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[AssetDisposalsResponse],
    summary="Asset Disposals 수정",
    description="Asset Disposals를 수정합니다.",
)
async def update_asset_disposals(
    item_id: UUID,
    data: AssetDisposalsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AssetDisposalsResponse]:
    """Asset Disposals 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await AssetDisposalsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Asset Disposals 삭제",
    description="Asset Disposals를 삭제합니다.",
)
async def delete_asset_disposals(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Asset Disposals 삭제"""
    await AssetDisposalsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Asset Disposals가 삭제되었습니다"})
