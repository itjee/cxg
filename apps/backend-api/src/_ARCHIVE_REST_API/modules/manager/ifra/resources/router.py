"""API Router for Resources."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ResourcesCreate, ResourcesListResponse, ResourcesResponse, ResourcesUpdate
from .service import ResourcesService

router = AuditedAPIRouter(prefix="/resources")


@router.post(
    "",
    response_model=EnvelopeResponse[ResourcesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Resources 생성",
    description="새로운 Resources를 생성합니다.",
)
async def create(
    data: ResourcesCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ResourcesResponse]:
    """Resources 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await ResourcesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[ResourcesListResponse],
    summary="Resources 목록 조회",
    description="Resources 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어 (리소스명, 리소스ID)"),
    resource: str | None = Query(None, description="리소스 유형 필터"),
    status: str | None = Query(None, description="상태 필터"),
    tenant_id: UUID | None = Query(None, description="테넌트 ID 필터"),
    region: str | None = Query(None, description="리전 필터"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ResourcesListResponse]:
    """Resources 목록 조회."""
    result = await ResourcesService.get_list(
        db,
        page=page,
        page_size=page_size,
        search=search,
        resource_filter=resource,
        status_filter=status,
        tenant_id_filter=tenant_id,
        region_filter=region,
    )
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[ResourcesResponse],
    summary="Resources 상세 조회",
    description="Resources 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ResourcesResponse]:
    """Resources 상세 조회."""
    obj = await ResourcesService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[ResourcesResponse],
    summary="Resources 수정",
    description="Resources 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: ResourcesUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ResourcesResponse]:
    """Resources 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await ResourcesService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Resources 삭제",
    description="Resources를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Resources 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await ResourcesService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "Resources가 삭제되었습니다"})