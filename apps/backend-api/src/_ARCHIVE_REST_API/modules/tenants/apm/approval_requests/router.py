"""API router for approval_requests."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ApprovalRequestsCreate, ApprovalRequestsListResponse, ApprovalRequestsResponse, ApprovalRequestsUpdate
from .service import ApprovalRequestsService

router = AuditedAPIRouter(prefix="/approval_requests")


@router.post(
    "",
    response_model=EnvelopeResponse[ApprovalRequestsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Approval Requests 생성",
    description="Approval Requests를 생성합니다.",
)
async def create_approval_requests(
    data: ApprovalRequestsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalRequestsResponse]:
    """Approval Requests 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ApprovalRequestsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ApprovalRequestsListResponse],
    summary="Approval Requests 목록 조회",
    description="Approval Requests 목록을 조회합니다.",
)
async def get_approval_requests_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalRequestsListResponse]:
    """Approval Requests 목록 조회"""
    items = await ApprovalRequestsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ApprovalRequestsResponse],
    summary="Approval Requests 상세 조회",
    description="Approval Requests를 조회합니다.",
)
async def get_approval_requests(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalRequestsResponse]:
    """Approval Requests 상세 조회"""
    item = await ApprovalRequestsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ApprovalRequestsResponse],
    summary="Approval Requests 수정",
    description="Approval Requests를 수정합니다.",
)
async def update_approval_requests(
    item_id: UUID,
    data: ApprovalRequestsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApprovalRequestsResponse]:
    """Approval Requests 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ApprovalRequestsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Approval Requests 삭제",
    description="Approval Requests를 삭제합니다.",
)
async def delete_approval_requests(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Approval Requests 삭제"""
    await ApprovalRequestsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Approval Requests가 삭제되었습니다"})
