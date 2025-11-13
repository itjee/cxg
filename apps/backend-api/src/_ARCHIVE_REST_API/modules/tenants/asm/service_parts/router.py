"""API router for service_parts."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ServicePartsCreate, ServicePartsListResponse, ServicePartsResponse, ServicePartsUpdate
from .service import ServicePartsService

router = AuditedAPIRouter(prefix="/service_parts")


@router.post(
    "",
    response_model=EnvelopeResponse[ServicePartsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Service Parts 생성",
    description="Service Parts를 생성합니다.",
)
async def create_service_parts(
    data: ServicePartsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServicePartsResponse]:
    """Service Parts 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ServicePartsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ServicePartsListResponse],
    summary="Service Parts 목록 조회",
    description="Service Parts 목록을 조회합니다.",
)
async def get_service_parts_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServicePartsListResponse]:
    """Service Parts 목록 조회"""
    items = await ServicePartsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ServicePartsResponse],
    summary="Service Parts 상세 조회",
    description="Service Parts를 조회합니다.",
)
async def get_service_parts(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServicePartsResponse]:
    """Service Parts 상세 조회"""
    item = await ServicePartsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ServicePartsResponse],
    summary="Service Parts 수정",
    description="Service Parts를 수정합니다.",
)
async def update_service_parts(
    item_id: UUID,
    data: ServicePartsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServicePartsResponse]:
    """Service Parts 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ServicePartsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Service Parts 삭제",
    description="Service Parts를 삭제합니다.",
)
async def delete_service_parts(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Service Parts 삭제"""
    await ServicePartsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Service Parts가 삭제되었습니다"})
