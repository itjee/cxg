"""API Router for TenantStats."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import TenantStatsCreate, TenantStatsListResponse, TenantStatsResponse, TenantStatsUpdate
from .service import TenantStatsService

router = AuditedAPIRouter(prefix="/tenant_stats")


@router.post(
    "",
    response_model=EnvelopeResponse[TenantStatsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="TenantStats 생성",
    description="새로운 TenantStats를 생성합니다.",
)
async def create(
    data: TenantStatsCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TenantStatsResponse]:
    """TenantStats 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await TenantStatsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[TenantStatsListResponse],
    summary="TenantStats 목록 조회",
    description="TenantStats 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TenantStatsListResponse]:
    """TenantStats 목록 조회."""
    result = await TenantStatsService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[TenantStatsResponse],
    summary="TenantStats 상세 조회",
    description="TenantStats 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TenantStatsResponse]:
    """TenantStats 상세 조회."""
    obj = await TenantStatsService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[TenantStatsResponse],
    summary="TenantStats 수정",
    description="TenantStats 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: TenantStatsUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TenantStatsResponse]:
    """TenantStats 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await TenantStatsService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="TenantStats 삭제",
    description="TenantStats를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """TenantStats 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await TenantStatsService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "TenantStats가 삭제되었습니다"})