"""API router for campaign_members."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import CampaignMembersCreate, CampaignMembersListResponse, CampaignMembersResponse, CampaignMembersUpdate
from .service import CampaignMembersService

router = AuditedAPIRouter(prefix="/campaign_members")


@router.post(
    "",
    response_model=EnvelopeResponse[CampaignMembersResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Campaign Members 생성",
    description="Campaign Members를 생성합니다.",
)
async def create_campaign_members(
    data: CampaignMembersCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CampaignMembersResponse]:
    """Campaign Members 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await CampaignMembersService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[CampaignMembersListResponse],
    summary="Campaign Members 목록 조회",
    description="Campaign Members 목록을 조회합니다.",
)
async def get_campaign_members_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CampaignMembersListResponse]:
    """Campaign Members 목록 조회"""
    items = await CampaignMembersService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[CampaignMembersResponse],
    summary="Campaign Members 상세 조회",
    description="Campaign Members를 조회합니다.",
)
async def get_campaign_members(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CampaignMembersResponse]:
    """Campaign Members 상세 조회"""
    item = await CampaignMembersService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[CampaignMembersResponse],
    summary="Campaign Members 수정",
    description="Campaign Members를 수정합니다.",
)
async def update_campaign_members(
    item_id: UUID,
    data: CampaignMembersUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CampaignMembersResponse]:
    """Campaign Members 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await CampaignMembersService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Campaign Members 삭제",
    description="Campaign Members를 삭제합니다.",
)
async def delete_campaign_members(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Campaign Members 삭제"""
    await CampaignMembersService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Campaign Members가 삭제되었습니다"})
