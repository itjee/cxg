"""API router for kpi_definitions."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import KpiDefinitionsCreate, KpiDefinitionsListResponse, KpiDefinitionsResponse, KpiDefinitionsUpdate
from .service import KpiDefinitionsService

router = AuditedAPIRouter(prefix="/kpi_definitions")


@router.post(
    "",
    response_model=EnvelopeResponse[KpiDefinitionsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Kpi Definitions 생성",
    description="Kpi Definitions를 생성합니다.",
)
async def create_kpi_definitions(
    data: KpiDefinitionsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[KpiDefinitionsResponse]:
    """Kpi Definitions 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await KpiDefinitionsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[KpiDefinitionsListResponse],
    summary="Kpi Definitions 목록 조회",
    description="Kpi Definitions 목록을 조회합니다.",
)
async def get_kpi_definitions_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[KpiDefinitionsListResponse]:
    """Kpi Definitions 목록 조회"""
    items = await KpiDefinitionsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[KpiDefinitionsResponse],
    summary="Kpi Definitions 상세 조회",
    description="Kpi Definitions를 조회합니다.",
)
async def get_kpi_definitions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[KpiDefinitionsResponse]:
    """Kpi Definitions 상세 조회"""
    item = await KpiDefinitionsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[KpiDefinitionsResponse],
    summary="Kpi Definitions 수정",
    description="Kpi Definitions를 수정합니다.",
)
async def update_kpi_definitions(
    item_id: UUID,
    data: KpiDefinitionsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[KpiDefinitionsResponse]:
    """Kpi Definitions 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await KpiDefinitionsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Kpi Definitions 삭제",
    description="Kpi Definitions를 삭제합니다.",
)
async def delete_kpi_definitions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Kpi Definitions 삭제"""
    await KpiDefinitionsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Kpi Definitions가 삭제되었습니다"})
