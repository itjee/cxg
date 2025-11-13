"""API router for partner_managers."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PartnerManagersCreate, PartnerManagersListResponse, PartnerManagersResponse, PartnerManagersUpdate
from .service import PartnerManagersService

router = AuditedAPIRouter(prefix="/partner_managers")


@router.post(
    "",
    response_model=EnvelopeResponse[PartnerManagersResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Partner Managers 생성",
    description="Partner Managers를 생성합니다.",
)
async def create_partner_managers(
    data: PartnerManagersCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PartnerManagersResponse]:
    """Partner Managers 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PartnerManagersService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PartnerManagersListResponse],
    summary="Partner Managers 목록 조회",
    description="Partner Managers 목록을 조회합니다.",
)
async def get_partner_managers_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PartnerManagersListResponse]:
    """Partner Managers 목록 조회"""
    items = await PartnerManagersService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PartnerManagersResponse],
    summary="Partner Managers 상세 조회",
    description="Partner Managers를 조회합니다.",
)
async def get_partner_managers(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PartnerManagersResponse]:
    """Partner Managers 상세 조회"""
    item = await PartnerManagersService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PartnerManagersResponse],
    summary="Partner Managers 수정",
    description="Partner Managers를 수정합니다.",
)
async def update_partner_managers(
    item_id: UUID,
    data: PartnerManagersUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PartnerManagersResponse]:
    """Partner Managers 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PartnerManagersService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Partner Managers 삭제",
    description="Partner Managers를 삭제합니다.",
)
async def delete_partner_managers(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Partner Managers 삭제"""
    await PartnerManagersService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Partner Managers가 삭제되었습니다"})
