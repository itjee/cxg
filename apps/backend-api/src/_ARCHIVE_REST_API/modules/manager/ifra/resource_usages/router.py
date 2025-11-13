"""API Router for ResourceUsages."""

from datetime import datetime
from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ResourceUsagesCreate, ResourceUsagesListResponse, ResourceUsagesResponse, ResourceUsagesUpdate
from .service import ResourceUsagesService

router = AuditedAPIRouter(prefix="/resource_usages")


@router.post(
    "",
    response_model=EnvelopeResponse[ResourceUsagesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="리소스 사용량 메트릭 생성",
    description="새로운 리소스 사용량 메트릭을 생성합니다.",
)
async def create(
    data: ResourceUsagesCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ResourceUsagesResponse]:
    """리소스 사용량 메트릭 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await ResourceUsagesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[ResourceUsagesListResponse],
    summary="리소스 사용량 메트릭 목록 조회",
    description="리소스 사용량 메트릭 목록을 조회합니다. 다양한 필터와 시간 범위로 검색 가능합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    resource_id: UUID | None = Query(None, description="리소스 ID 필터"),
    tenant_id: UUID | None = Query(None, description="테넌트 ID 필터"),
    metric_name: str | None = Query(None, description="메트릭 이름 필터"),
    summary_period: str | None = Query(None, description="집계 주기 필터"),
    start_time: datetime | None = Query(None, description="시작 시간 (ISO 8601)"),
    end_time: datetime | None = Query(None, description="종료 시간 (ISO 8601)"),
    search: str | None = Query(None, description="검색어 (메트릭 이름, 단위)"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ResourceUsagesListResponse]:
    """리소스 사용량 메트릭 목록 조회."""
    result = await ResourceUsagesService.get_list(
        db,
        page=page,
        page_size=page_size,
        resource_id=resource_id,
        tenant_id=tenant_id,
        metric_name=metric_name,
        summary_period=summary_period,
        start_time=start_time,
        end_time=end_time,
        search=search,
    )
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[ResourceUsagesResponse],
    summary="리소스 사용량 메트릭 상세 조회",
    description="특정 리소스 사용량 메트릭의 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ResourceUsagesResponse]:
    """리소스 사용량 메트릭 상세 조회."""
    obj = await ResourceUsagesService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[ResourceUsagesResponse],
    summary="리소스 사용량 메트릭 수정",
    description="리소스 사용량 메트릭 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: ResourceUsagesUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ResourceUsagesResponse]:
    """리소스 사용량 메트릭 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await ResourceUsagesService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="리소스 사용량 메트릭 삭제",
    description="리소스 사용량 메트릭을 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """리소스 사용량 메트릭 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await ResourceUsagesService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "리소스 사용량 메트릭이 삭제되었습니다"})