"""API router for campaigns."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import CampaignsCreate, CampaignsListResponse, CampaignsResponse, CampaignsUpdate
from .service import CampaignsService

router = AuditedAPIRouter(prefix="/campaigns")


@router.post(
    "",
    response_model=EnvelopeResponse[CampaignsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Campaigns 생성",
    description="Campaigns를 생성합니다.",
)
async def create_campaigns(
    data: CampaignsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CampaignsResponse]:
    """Campaigns 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await CampaignsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[CampaignsListResponse],
    summary="Campaigns 목록 조회",
    description="Campaigns 목록을 조회합니다.",
)
async def get_campaigns_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CampaignsListResponse]:
    """Campaigns 목록 조회"""
    items = await CampaignsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[CampaignsResponse],
    summary="Campaigns 상세 조회",
    description="Campaigns를 조회합니다.",
)
async def get_campaigns(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CampaignsResponse]:
    """Campaigns 상세 조회"""
    item = await CampaignsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[CampaignsResponse],
    summary="Campaigns 수정",
    description="Campaigns를 수정합니다.",
)
async def update_campaigns(
    item_id: UUID,
    data: CampaignsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CampaignsResponse]:
    """Campaigns 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await CampaignsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Campaigns 삭제",
    description="Campaigns를 삭제합니다.",
)
async def delete_campaigns(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Campaigns 삭제"""
    await CampaignsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Campaigns가 삭제되었습니다"})
