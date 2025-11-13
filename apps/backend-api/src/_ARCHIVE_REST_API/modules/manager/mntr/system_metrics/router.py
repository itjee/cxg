"""API Router for SystemMetrics."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import SystemMetricsCreate, SystemMetricsListResponse, SystemMetricsResponse, SystemMetricsUpdate
from .service import SystemMetricsService

router = AuditedAPIRouter(prefix="/system_metrics")


@router.post(
    "",
    response_model=EnvelopeResponse[SystemMetricsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="SystemMetrics 생성",
    description="새로운 SystemMetrics를 생성합니다.",
)
async def create(
    data: SystemMetricsCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SystemMetricsResponse]:
    """SystemMetrics 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await SystemMetricsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[SystemMetricsListResponse],
    summary="SystemMetrics 목록 조회",
    description="SystemMetrics 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SystemMetricsListResponse]:
    """SystemMetrics 목록 조회."""
    result = await SystemMetricsService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[SystemMetricsResponse],
    summary="SystemMetrics 상세 조회",
    description="SystemMetrics 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SystemMetricsResponse]:
    """SystemMetrics 상세 조회."""
    obj = await SystemMetricsService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[SystemMetricsResponse],
    summary="SystemMetrics 수정",
    description="SystemMetrics 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: SystemMetricsUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SystemMetricsResponse]:
    """SystemMetrics 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await SystemMetricsService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="SystemMetrics 삭제",
    description="SystemMetrics를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """SystemMetrics 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await SystemMetricsService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "SystemMetrics가 삭제되었습니다"})