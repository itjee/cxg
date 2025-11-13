"""API router for leave_policies."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import LeavePoliciesCreate, LeavePoliciesListResponse, LeavePoliciesResponse, LeavePoliciesUpdate
from .service import LeavePoliciesService

router = AuditedAPIRouter(prefix="/leave_policies")


@router.post(
    "",
    response_model=EnvelopeResponse[LeavePoliciesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="휴가 정책 생성",
    description="휴가 정책을 생성합니다.",
)
async def create_leave_policies(
    data: LeavePoliciesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[LeavePoliciesResponse]:
    """휴가 정책 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await LeavePoliciesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[LeavePoliciesListResponse],
    summary="휴가 정책 목록 조회",
    description="휴가 정책 목록을 조회합니다.",
)
async def get_leave_policies_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[LeavePoliciesListResponse]:
    """휴가 정책 목록 조회"""
    items = await LeavePoliciesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[LeavePoliciesResponse],
    summary="휴가 정책 상세 조회",
    description="휴가 정책을 조회합니다.",
)
async def get_leave_policies(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[LeavePoliciesResponse]:
    """휴가 정책 상세 조회"""
    item = await LeavePoliciesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[LeavePoliciesResponse],
    summary="휴가 정책 수정",
    description="휴가 정책을 수정합니다.",
)
async def update_leave_policies(
    item_id: UUID,
    data: LeavePoliciesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[LeavePoliciesResponse]:
    """휴가 정책 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await LeavePoliciesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="휴가 정책 삭제",
    description="휴가 정책을 삭제합니다.",
)
async def delete_leave_policies(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """휴가 정책 삭제"""
    await LeavePoliciesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "휴가 정책이 삭제되었습니다"})
