"""API router for warehouse_employees."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import WarehouseEmployeesCreate, WarehouseEmployeesListResponse, WarehouseEmployeesResponse, WarehouseEmployeesUpdate
from .service import WarehouseEmployeesService

router = AuditedAPIRouter(prefix="/warehouse_employees")


@router.post(
    "",
    response_model=EnvelopeResponse[WarehouseEmployeesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Warehouse Employees 생성",
    description="Warehouse Employees를 생성합니다.",
)
async def create_warehouse_employees(
    data: WarehouseEmployeesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WarehouseEmployeesResponse]:
    """Warehouse Employees 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await WarehouseEmployeesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[WarehouseEmployeesListResponse],
    summary="Warehouse Employees 목록 조회",
    description="Warehouse Employees 목록을 조회합니다.",
)
async def get_warehouse_employees_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WarehouseEmployeesListResponse]:
    """Warehouse Employees 목록 조회"""
    items = await WarehouseEmployeesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[WarehouseEmployeesResponse],
    summary="Warehouse Employees 상세 조회",
    description="Warehouse Employees를 조회합니다.",
)
async def get_warehouse_employees(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WarehouseEmployeesResponse]:
    """Warehouse Employees 상세 조회"""
    item = await WarehouseEmployeesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[WarehouseEmployeesResponse],
    summary="Warehouse Employees 수정",
    description="Warehouse Employees를 수정합니다.",
)
async def update_warehouse_employees(
    item_id: UUID,
    data: WarehouseEmployeesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WarehouseEmployeesResponse]:
    """Warehouse Employees 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await WarehouseEmployeesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Warehouse Employees 삭제",
    description="Warehouse Employees를 삭제합니다.",
)
async def delete_warehouse_employees(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Warehouse Employees 삭제"""
    await WarehouseEmployeesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Warehouse Employees가 삭제되었습니다"})
