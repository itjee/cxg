"""API router for customer_segment_members."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import CustomerSegmentMembersCreate, CustomerSegmentMembersListResponse, CustomerSegmentMembersResponse, CustomerSegmentMembersUpdate
from .service import CustomerSegmentMembersService

router = AuditedAPIRouter(prefix="/customer_segment_members")


@router.post(
    "",
    response_model=EnvelopeResponse[CustomerSegmentMembersResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Customer Segment Members 생성",
    description="Customer Segment Members를 생성합니다.",
)
async def create_customer_segment_members(
    data: CustomerSegmentMembersCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CustomerSegmentMembersResponse]:
    """Customer Segment Members 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await CustomerSegmentMembersService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[CustomerSegmentMembersListResponse],
    summary="Customer Segment Members 목록 조회",
    description="Customer Segment Members 목록을 조회합니다.",
)
async def get_customer_segment_members_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CustomerSegmentMembersListResponse]:
    """Customer Segment Members 목록 조회"""
    items = await CustomerSegmentMembersService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[CustomerSegmentMembersResponse],
    summary="Customer Segment Members 상세 조회",
    description="Customer Segment Members를 조회합니다.",
)
async def get_customer_segment_members(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CustomerSegmentMembersResponse]:
    """Customer Segment Members 상세 조회"""
    item = await CustomerSegmentMembersService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[CustomerSegmentMembersResponse],
    summary="Customer Segment Members 수정",
    description="Customer Segment Members를 수정합니다.",
)
async def update_customer_segment_members(
    item_id: UUID,
    data: CustomerSegmentMembersUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CustomerSegmentMembersResponse]:
    """Customer Segment Members 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await CustomerSegmentMembersService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Customer Segment Members 삭제",
    description="Customer Segment Members를 삭제합니다.",
)
async def delete_customer_segment_members(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Customer Segment Members 삭제"""
    await CustomerSegmentMembersService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Customer Segment Members가 삭제되었습니다"})
