"""API router for leads."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import LeadsCreate, LeadsListResponse, LeadsResponse, LeadsUpdate
from .service import LeadsService

router = AuditedAPIRouter(prefix="/leads")


@router.post(
    "",
    response_model=EnvelopeResponse[LeadsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Leads 생성",
    description="Leads를 생성합니다.",
)
async def create_leads(
    data: LeadsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[LeadsResponse]:
    """Leads 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await LeadsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[LeadsListResponse],
    summary="Leads 목록 조회",
    description="Leads 목록을 조회합니다.",
)
async def get_leads_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[LeadsListResponse]:
    """Leads 목록 조회"""
    items = await LeadsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[LeadsResponse],
    summary="Leads 상세 조회",
    description="Leads를 조회합니다.",
)
async def get_leads(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[LeadsResponse]:
    """Leads 상세 조회"""
    item = await LeadsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[LeadsResponse],
    summary="Leads 수정",
    description="Leads를 수정합니다.",
)
async def update_leads(
    item_id: UUID,
    data: LeadsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[LeadsResponse]:
    """Leads 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await LeadsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Leads 삭제",
    description="Leads를 삭제합니다.",
)
async def delete_leads(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Leads 삭제"""
    await LeadsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Leads가 삭제되었습니다"})
