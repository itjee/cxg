"""API router for departments."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import DepartmentsCreate, DepartmentsListResponse, DepartmentsResponse, DepartmentsUpdate
from .service import DepartmentsService

router = AuditedAPIRouter(prefix="/departments")


@router.post(
    "",
    response_model=EnvelopeResponse[DepartmentsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Departments 생성",
    description="Departments를 생성합니다.",
)
async def create_departments(
    data: DepartmentsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[DepartmentsResponse]:
    """Departments 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await DepartmentsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[DepartmentsListResponse],
    summary="Departments 목록 조회",
    description="Departments 목록을 조회합니다.",
)
async def get_departments_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[DepartmentsListResponse]:
    """Departments 목록 조회"""
    items = await DepartmentsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[DepartmentsResponse],
    summary="Departments 상세 조회",
    description="Departments를 조회합니다.",
)
async def get_departments(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[DepartmentsResponse]:
    """Departments 상세 조회"""
    item = await DepartmentsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[DepartmentsResponse],
    summary="Departments 수정",
    description="Departments를 수정합니다.",
)
async def update_departments(
    item_id: UUID,
    data: DepartmentsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[DepartmentsResponse]:
    """Departments 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await DepartmentsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Departments 삭제",
    description="Departments를 삭제합니다.",
)
async def delete_departments(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Departments 삭제"""
    await DepartmentsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Departments가 삭제되었습니다"})
