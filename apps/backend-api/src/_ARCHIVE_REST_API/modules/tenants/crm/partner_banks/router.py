"""API router for partner_banks."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PartnerBanksCreate, PartnerBanksListResponse, PartnerBanksResponse, PartnerBanksUpdate
from .service import PartnerBanksService

router = AuditedAPIRouter(prefix="/partner_banks")


@router.post(
    "",
    response_model=EnvelopeResponse[PartnerBanksResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Partner Banks 생성",
    description="Partner Banks를 생성합니다.",
)
async def create_partner_banks(
    data: PartnerBanksCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PartnerBanksResponse]:
    """Partner Banks 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PartnerBanksService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PartnerBanksListResponse],
    summary="Partner Banks 목록 조회",
    description="Partner Banks 목록을 조회합니다.",
)
async def get_partner_banks_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PartnerBanksListResponse]:
    """Partner Banks 목록 조회"""
    items = await PartnerBanksService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PartnerBanksResponse],
    summary="Partner Banks 상세 조회",
    description="Partner Banks를 조회합니다.",
)
async def get_partner_banks(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PartnerBanksResponse]:
    """Partner Banks 상세 조회"""
    item = await PartnerBanksService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PartnerBanksResponse],
    summary="Partner Banks 수정",
    description="Partner Banks를 수정합니다.",
)
async def update_partner_banks(
    item_id: UUID,
    data: PartnerBanksUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PartnerBanksResponse]:
    """Partner Banks 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PartnerBanksService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Partner Banks 삭제",
    description="Partner Banks를 삭제합니다.",
)
async def delete_partner_banks(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Partner Banks 삭제"""
    await PartnerBanksService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Partner Banks가 삭제되었습니다"})
