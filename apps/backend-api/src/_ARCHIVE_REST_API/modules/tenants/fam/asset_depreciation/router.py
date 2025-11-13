"""API router for asset_depreciation."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import AssetDepreciationCreate, AssetDepreciationListResponse, AssetDepreciationResponse, AssetDepreciationUpdate
from .service import AssetDepreciationService

router = AuditedAPIRouter(prefix="/asset_depreciation")


@router.post(
    "",
    response_model=EnvelopeResponse[AssetDepreciationResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Asset Depreciation 생성",
    description="Asset Depreciation를 생성합니다.",
)
async def create_asset_depreciation(
    data: AssetDepreciationCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AssetDepreciationResponse]:
    """Asset Depreciation 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await AssetDepreciationService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[AssetDepreciationListResponse],
    summary="Asset Depreciation 목록 조회",
    description="Asset Depreciation 목록을 조회합니다.",
)
async def get_asset_depreciation_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AssetDepreciationListResponse]:
    """Asset Depreciation 목록 조회"""
    items = await AssetDepreciationService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[AssetDepreciationResponse],
    summary="Asset Depreciation 상세 조회",
    description="Asset Depreciation를 조회합니다.",
)
async def get_asset_depreciation(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AssetDepreciationResponse]:
    """Asset Depreciation 상세 조회"""
    item = await AssetDepreciationService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[AssetDepreciationResponse],
    summary="Asset Depreciation 수정",
    description="Asset Depreciation를 수정합니다.",
)
async def update_asset_depreciation(
    item_id: UUID,
    data: AssetDepreciationUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AssetDepreciationResponse]:
    """Asset Depreciation 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await AssetDepreciationService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Asset Depreciation 삭제",
    description="Asset Depreciation를 삭제합니다.",
)
async def delete_asset_depreciation(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Asset Depreciation 삭제"""
    await AssetDepreciationService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Asset Depreciation가 삭제되었습니다"})
