"""API router for approval_histories."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ApprovalHistoriesCreate, ApprovalHistoriesListResponse, ApprovalHistoriesResponse, ApprovalHistoriesUpdate
from .service import ApprovalHistoriesService

router = AuditedAPIRouter(prefix="/approval_histories")


@router.post(
    "",
    response_model=EnvelopeResponse[ApprovalHistoriesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Approval Histories 생성",
    description="Approval Histories를 생성합니다.",
)
async def create_approval_histories(
    data: ApprovalHistoriesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalHistoriesResponse]:
    """Approval Histories 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ApprovalHistoriesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ApprovalHistoriesListResponse],
    summary="Approval Histories 목록 조회",
    description="Approval Histories 목록을 조회합니다.",
)
async def get_approval_histories_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalHistoriesListResponse]:
    """Approval Histories 목록 조회"""
    items = await ApprovalHistoriesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ApprovalHistoriesResponse],
    summary="Approval Histories 상세 조회",
    description="Approval Histories를 조회합니다.",
)
async def get_approval_histories(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalHistoriesResponse]:
    """Approval Histories 상세 조회"""
    item = await ApprovalHistoriesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ApprovalHistoriesResponse],
    summary="Approval Histories 수정",
    description="Approval Histories를 수정합니다.",
)
async def update_approval_histories(
    item_id: UUID,
    data: ApprovalHistoriesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalHistoriesResponse]:
    """Approval Histories 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ApprovalHistoriesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Approval Histories 삭제",
    description="Approval Histories를 삭제합니다.",
)
async def delete_approval_histories(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Approval Histories 삭제"""
    await ApprovalHistoriesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Approval Histories가 삭제되었습니다"})
