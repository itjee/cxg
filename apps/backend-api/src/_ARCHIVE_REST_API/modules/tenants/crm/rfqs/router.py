"""API router for rfqs."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import RfqsCreate, RfqsListResponse, RfqsResponse, RfqsUpdate
from .service import RfqsService

router = AuditedAPIRouter(prefix="/rfqs")


@router.post(
    "",
    response_model=EnvelopeResponse[RfqsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Rfqs 생성",
    description="Rfqs를 생성합니다.",
)
async def create_rfqs(
    data: RfqsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RfqsResponse]:
    """Rfqs 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await RfqsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[RfqsListResponse],
    summary="Rfqs 목록 조회",
    description="Rfqs 목록을 조회합니다.",
)
async def get_rfqs_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RfqsListResponse]:
    """Rfqs 목록 조회"""
    items = await RfqsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[RfqsResponse],
    summary="Rfqs 상세 조회",
    description="Rfqs를 조회합니다.",
)
async def get_rfqs(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RfqsResponse]:
    """Rfqs 상세 조회"""
    item = await RfqsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[RfqsResponse],
    summary="Rfqs 수정",
    description="Rfqs를 수정합니다.",
)
async def update_rfqs(
    item_id: UUID,
    data: RfqsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RfqsResponse]:
    """Rfqs 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await RfqsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Rfqs 삭제",
    description="Rfqs를 삭제합니다.",
)
async def delete_rfqs(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Rfqs 삭제"""
    await RfqsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Rfqs가 삭제되었습니다"})
