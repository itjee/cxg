"""API router for service_works."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ServiceWorksCreate, ServiceWorksListResponse, ServiceWorksResponse, ServiceWorksUpdate
from .service import ServiceWorksService

router = AuditedAPIRouter(prefix="/service_works")


@router.post(
    "",
    response_model=EnvelopeResponse[ServiceWorksResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Service Works 생성",
    description="Service Works를 생성합니다.",
)
async def create_service_works(
    data: ServiceWorksCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceWorksResponse]:
    """Service Works 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ServiceWorksService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ServiceWorksListResponse],
    summary="Service Works 목록 조회",
    description="Service Works 목록을 조회합니다.",
)
async def get_service_works_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceWorksListResponse]:
    """Service Works 목록 조회"""
    items = await ServiceWorksService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ServiceWorksResponse],
    summary="Service Works 상세 조회",
    description="Service Works를 조회합니다.",
)
async def get_service_works(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceWorksResponse]:
    """Service Works 상세 조회"""
    item = await ServiceWorksService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ServiceWorksResponse],
    summary="Service Works 수정",
    description="Service Works를 수정합니다.",
)
async def update_service_works(
    item_id: UUID,
    data: ServiceWorksUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceWorksResponse]:
    """Service Works 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ServiceWorksService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Service Works 삭제",
    description="Service Works를 삭제합니다.",
)
async def delete_service_works(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Service Works 삭제"""
    await ServiceWorksService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Service Works가 삭제되었습니다"})
