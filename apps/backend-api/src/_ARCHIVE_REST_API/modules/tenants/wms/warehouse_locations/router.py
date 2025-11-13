"""API router for warehouse_locations."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import WarehouseLocationsCreate, WarehouseLocationsListResponse, WarehouseLocationsResponse, WarehouseLocationsUpdate
from .service import WarehouseLocationsService

router = AuditedAPIRouter(prefix="/warehouse_locations")


@router.post(
    "",
    response_model=EnvelopeResponse[WarehouseLocationsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Warehouse Locations 생성",
    description="Warehouse Locations를 생성합니다.",
)
async def create_warehouse_locations(
    data: WarehouseLocationsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WarehouseLocationsResponse]:
    """Warehouse Locations 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await WarehouseLocationsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[WarehouseLocationsListResponse],
    summary="Warehouse Locations 목록 조회",
    description="Warehouse Locations 목록을 조회합니다.",
)
async def get_warehouse_locations_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WarehouseLocationsListResponse]:
    """Warehouse Locations 목록 조회"""
    items = await WarehouseLocationsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[WarehouseLocationsResponse],
    summary="Warehouse Locations 상세 조회",
    description="Warehouse Locations를 조회합니다.",
)
async def get_warehouse_locations(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WarehouseLocationsResponse]:
    """Warehouse Locations 상세 조회"""
    item = await WarehouseLocationsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[WarehouseLocationsResponse],
    summary="Warehouse Locations 수정",
    description="Warehouse Locations를 수정합니다.",
)
async def update_warehouse_locations(
    item_id: UUID,
    data: WarehouseLocationsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WarehouseLocationsResponse]:
    """Warehouse Locations 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await WarehouseLocationsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Warehouse Locations 삭제",
    description="Warehouse Locations를 삭제합니다.",
)
async def delete_warehouse_locations(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Warehouse Locations 삭제"""
    await WarehouseLocationsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Warehouse Locations가 삭제되었습니다"})
