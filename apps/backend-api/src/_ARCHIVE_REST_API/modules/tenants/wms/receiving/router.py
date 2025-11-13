"""API router for receiving."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ReceivingCreate, ReceivingListResponse, ReceivingResponse, ReceivingUpdate
from .service import ReceivingService

router = AuditedAPIRouter(prefix="/receiving")


@router.post(
    "",
    response_model=EnvelopeResponse[ReceivingResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Receiving 생성",
    description="Receiving를 생성합니다.",
)
async def create_receiving(
    data: ReceivingCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ReceivingResponse]:
    """Receiving 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ReceivingService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ReceivingListResponse],
    summary="Receiving 목록 조회",
    description="Receiving 목록을 조회합니다.",
)
async def get_receiving_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ReceivingListResponse]:
    """Receiving 목록 조회"""
    items = await ReceivingService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ReceivingResponse],
    summary="Receiving 상세 조회",
    description="Receiving를 조회합니다.",
)
async def get_receiving(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ReceivingResponse]:
    """Receiving 상세 조회"""
    item = await ReceivingService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ReceivingResponse],
    summary="Receiving 수정",
    description="Receiving를 수정합니다.",
)
async def update_receiving(
    item_id: UUID,
    data: ReceivingUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ReceivingResponse]:
    """Receiving 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ReceivingService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Receiving 삭제",
    description="Receiving를 삭제합니다.",
)
async def delete_receiving(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Receiving 삭제"""
    await ReceivingService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Receiving가 삭제되었습니다"})
