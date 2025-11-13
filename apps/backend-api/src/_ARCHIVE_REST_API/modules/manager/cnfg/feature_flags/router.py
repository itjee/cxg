"""API Router for FeatureFlags."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import FeatureFlagsCreate, FeatureFlagsListResponse, FeatureFlagsResponse, FeatureFlagsUpdate
from .service import FeatureFlagsService

router = AuditedAPIRouter(prefix="/feature_flags")


@router.post(
    "",
    response_model=EnvelopeResponse[FeatureFlagsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="FeatureFlags 생성",
    description="새로운 FeatureFlags를 생성합니다.",
)
async def create(
    data: FeatureFlagsCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FeatureFlagsResponse]:
    """FeatureFlags 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await FeatureFlagsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[FeatureFlagsListResponse],
    summary="FeatureFlags 목록 조회",
    description="FeatureFlags 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FeatureFlagsListResponse]:
    """FeatureFlags 목록 조회."""
    result = await FeatureFlagsService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[FeatureFlagsResponse],
    summary="FeatureFlags 상세 조회",
    description="FeatureFlags 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FeatureFlagsResponse]:
    """FeatureFlags 상세 조회."""
    obj = await FeatureFlagsService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[FeatureFlagsResponse],
    summary="FeatureFlags 수정",
    description="FeatureFlags 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: FeatureFlagsUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[FeatureFlagsResponse]:
    """FeatureFlags 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await FeatureFlagsService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="FeatureFlags 삭제",
    description="FeatureFlags를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """FeatureFlags 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await FeatureFlagsService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "FeatureFlags가 삭제되었습니다"})