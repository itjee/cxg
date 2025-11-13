"""API Router for RecoveryPlans."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import RecoveryPlansCreate, RecoveryPlansListResponse, RecoveryPlansResponse, RecoveryPlansUpdate
from .service import RecoveryPlansService

router = AuditedAPIRouter(prefix="/recovery_plans")


@router.post(
    "",
    response_model=EnvelopeResponse[RecoveryPlansResponse],
    status_code=status.HTTP_201_CREATED,
    summary="RecoveryPlans 생성",
    description="새로운 RecoveryPlans를 생성합니다.",
)
async def create(
    data: RecoveryPlansCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RecoveryPlansResponse]:
    """RecoveryPlans 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await RecoveryPlansService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[RecoveryPlansListResponse],
    summary="RecoveryPlans 목록 조회",
    description="RecoveryPlans 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RecoveryPlansListResponse]:
    """RecoveryPlans 목록 조회."""
    result = await RecoveryPlansService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[RecoveryPlansResponse],
    summary="RecoveryPlans 상세 조회",
    description="RecoveryPlans 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RecoveryPlansResponse]:
    """RecoveryPlans 상세 조회."""
    obj = await RecoveryPlansService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[RecoveryPlansResponse],
    summary="RecoveryPlans 수정",
    description="RecoveryPlans 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: RecoveryPlansUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RecoveryPlansResponse]:
    """RecoveryPlans 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await RecoveryPlansService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="RecoveryPlans 삭제",
    description="RecoveryPlans를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """RecoveryPlans 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await RecoveryPlansService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "RecoveryPlans가 삭제되었습니다"})