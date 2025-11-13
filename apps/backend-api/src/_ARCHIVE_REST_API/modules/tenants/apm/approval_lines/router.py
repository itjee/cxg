"""API router for approval_lines."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ApprovalLinesCreate, ApprovalLinesListResponse, ApprovalLinesResponse, ApprovalLinesUpdate
from .service import ApprovalLinesService

router = AuditedAPIRouter(prefix="/approval_lines")


@router.post(
    "",
    response_model=EnvelopeResponse[ApprovalLinesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Approval Lines 생성",
    description="Approval Lines를 생성합니다.",
)
async def create_approval_lines(
    data: ApprovalLinesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalLinesResponse]:
    """Approval Lines 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ApprovalLinesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ApprovalLinesListResponse],
    summary="Approval Lines 목록 조회",
    description="Approval Lines 목록을 조회합니다.",
)
async def get_approval_lines_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalLinesListResponse]:
    """Approval Lines 목록 조회"""
    items = await ApprovalLinesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ApprovalLinesResponse],
    summary="Approval Lines 상세 조회",
    description="Approval Lines를 조회합니다.",
)
async def get_approval_lines(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalLinesResponse]:
    """Approval Lines 상세 조회"""
    item = await ApprovalLinesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ApprovalLinesResponse],
    summary="Approval Lines 수정",
    description="Approval Lines를 수정합니다.",
)
async def update_approval_lines(
    item_id: UUID,
    data: ApprovalLinesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalLinesResponse]:
    """Approval Lines 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ApprovalLinesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Approval Lines 삭제",
    description="Approval Lines를 삭제합니다.",
)
async def delete_approval_lines(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Approval Lines 삭제"""
    await ApprovalLinesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Approval Lines가 삭제되었습니다"})
