"""API router for attendances."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import AttendancesCreate, AttendancesListResponse, AttendancesResponse, AttendancesUpdate
from .service import AttendancesService

router = AuditedAPIRouter(prefix="/attendances")


@router.post(
    "",
    response_model=EnvelopeResponse[AttendancesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="출퇴근 생성",
    description="출퇴근을 생성합니다.",
)
async def create_attendances(
    data: AttendancesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AttendancesResponse]:
    """출퇴근 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await AttendancesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[AttendancesListResponse],
    summary="출퇴근 목록 조회",
    description="출퇴근 목록을 조회합니다.",
)
async def get_attendances_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AttendancesListResponse]:
    """출퇴근 목록 조회"""
    items = await AttendancesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[AttendancesResponse],
    summary="출퇴근 상세 조회",
    description="출퇴근을 조회합니다.",
)
async def get_attendances(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AttendancesResponse]:
    """출퇴근 상세 조회"""
    item = await AttendancesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[AttendancesResponse],
    summary="출퇴근 수정",
    description="출퇴근을 수정합니다.",
)
async def update_attendances(
    item_id: UUID,
    data: AttendancesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AttendancesResponse]:
    """출퇴근 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await AttendancesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="출퇴근 삭제",
    description="출퇴근을 삭제합니다.",
)
async def delete_attendances(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """출퇴근 삭제"""
    await AttendancesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "출퇴근이 삭제되었습니다"})
