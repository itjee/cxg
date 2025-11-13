"""API router for payroll_records."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PayrollRecordsCreate, PayrollRecordsListResponse, PayrollRecordsResponse, PayrollRecordsUpdate
from .service import PayrollRecordsService

router = AuditedAPIRouter(prefix="/payroll_records")


@router.post(
    "",
    response_model=EnvelopeResponse[PayrollRecordsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="급여 기록 생성",
    description="급여 기록을 생성합니다.",
)
async def create_payroll_records(
    data: PayrollRecordsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PayrollRecordsResponse]:
    """급여 기록 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PayrollRecordsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PayrollRecordsListResponse],
    summary="급여 기록 목록 조회",
    description="급여 기록 목록을 조회합니다.",
)
async def get_payroll_records_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PayrollRecordsListResponse]:
    """급여 기록 목록 조회"""
    items = await PayrollRecordsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PayrollRecordsResponse],
    summary="급여 기록 상세 조회",
    description="급여 기록을 조회합니다.",
)
async def get_payroll_records(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PayrollRecordsResponse]:
    """급여 기록 상세 조회"""
    item = await PayrollRecordsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PayrollRecordsResponse],
    summary="급여 기록 수정",
    description="급여 기록을 수정합니다.",
)
async def update_payroll_records(
    item_id: UUID,
    data: PayrollRecordsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PayrollRecordsResponse]:
    """급여 기록 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PayrollRecordsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="급여 기록 삭제",
    description="급여 기록을 삭제합니다.",
)
async def delete_payroll_records(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """급여 기록 삭제"""
    await PayrollRecordsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "급여 기록이 삭제되었습니다"})
