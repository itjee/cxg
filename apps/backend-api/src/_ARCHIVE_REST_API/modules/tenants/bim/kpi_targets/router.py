"""API router for kpi_targets."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import KpiTargetsCreate, KpiTargetsListResponse, KpiTargetsResponse, KpiTargetsUpdate
from .service import KpiTargetsService

router = AuditedAPIRouter(prefix="/kpi_targets")


@router.post(
    "",
    response_model=EnvelopeResponse[KpiTargetsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Kpi Targets 생성",
    description="Kpi Targets를 생성합니다.",
)
async def create_kpi_targets(
    data: KpiTargetsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[KpiTargetsResponse]:
    """Kpi Targets 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await KpiTargetsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[KpiTargetsListResponse],
    summary="Kpi Targets 목록 조회",
    description="Kpi Targets 목록을 조회합니다.",
)
async def get_kpi_targets_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[KpiTargetsListResponse]:
    """Kpi Targets 목록 조회"""
    items = await KpiTargetsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[KpiTargetsResponse],
    summary="Kpi Targets 상세 조회",
    description="Kpi Targets를 조회합니다.",
)
async def get_kpi_targets(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[KpiTargetsResponse]:
    """Kpi Targets 상세 조회"""
    item = await KpiTargetsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[KpiTargetsResponse],
    summary="Kpi Targets 수정",
    description="Kpi Targets를 수정합니다.",
)
async def update_kpi_targets(
    item_id: UUID,
    data: KpiTargetsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[KpiTargetsResponse]:
    """Kpi Targets 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await KpiTargetsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Kpi Targets 삭제",
    description="Kpi Targets를 삭제합니다.",
)
async def delete_kpi_targets(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Kpi Targets 삭제"""
    await KpiTargetsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Kpi Targets가 삭제되었습니다"})
