"""Settings API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import SettingsCreate, SettingsListResponse, SettingsResponse, SettingsUpdate
from .service import SettingsService

router = AuditedAPIRouter(prefix="/settings")


@router.post(
    "",
    response_model=EnvelopeResponse[SettingsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="설정 생성",
    description="새로운 설정을 생성합니다.",
)
async def create_setting(
    data: SettingsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SettingsResponse]:
    """설정 생성."""
    creator_id = UUID(current_user["user_id"])
    setting = await SettingsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(setting)


@router.get(
    "",
    response_model=EnvelopeResponse[SettingsListResponse],
    summary="설정 목록 조회",
    description="설정 목록을 페이지네이션과 필터로 조회합니다.",
)
async def get_setting_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    category: str | None = Query(None, description="카테고리 필터"),
    is_active: bool | None = Query(None, description="활성 여부 필터"),
    search: str | None = Query(None, description="검색어 (설정 키, 설명)"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SettingsListResponse]:
    """설정 목록 조회."""
    settings = await SettingsService.get_list(
        db,
        page=page,
        page_size=page_size,
        category=category,
        is_active=is_active,
        search=search,
    )
    return EnvelopeResponse.success_response(settings)


@router.get(
    "/{setting_id}",
    response_model=EnvelopeResponse[SettingsResponse],
    summary="설정 상세 조회",
    description="특정 설정의 상세 정보를 조회합니다.",
)
async def get_setting(
    setting_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SettingsResponse]:
    """설정 상세 조회."""
    setting = await SettingsService.get_by_id(db, setting_id)
    return EnvelopeResponse.success_response(setting)


@router.put(
    "/{setting_id}",
    response_model=EnvelopeResponse[SettingsResponse],
    summary="설정 수정",
    description="설정 정보를 수정합니다.",
)
async def update_setting(
    setting_id: UUID,
    data: SettingsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SettingsResponse]:
    """설정 수정."""
    updater_id = UUID(current_user["user_id"])
    setting = await SettingsService.update(db, setting_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(setting)


@router.delete(
    "/{setting_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="설정 삭제",
    description="설정을 삭제합니다.",
)
async def delete_setting(
    setting_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """설정 삭제."""
    await SettingsService.delete(db, setting_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "설정이 삭제되었습니다"})
