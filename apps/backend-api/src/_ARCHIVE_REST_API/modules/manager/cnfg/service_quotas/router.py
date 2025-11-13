"""API Router for ServiceQuotas."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ServiceQuotasCreate, ServiceQuotasListResponse, ServiceQuotasResponse, ServiceQuotasUpdate
from .service import ServiceQuotasService

router = AuditedAPIRouter(prefix="/service_quotas")


@router.post(
    "",
    response_model=EnvelopeResponse[ServiceQuotasResponse],
    status_code=status.HTTP_201_CREATED,
    summary="ServiceQuotas 생성",
    description="새로운 ServiceQuotas를 생성합니다.",
)
async def create(
    data: ServiceQuotasCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceQuotasResponse]:
    """ServiceQuotas 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await ServiceQuotasService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[ServiceQuotasListResponse],
    summary="ServiceQuotas 목록 조회",
    description="ServiceQuotas 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceQuotasListResponse]:
    """ServiceQuotas 목록 조회."""
    result = await ServiceQuotasService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[ServiceQuotasResponse],
    summary="ServiceQuotas 상세 조회",
    description="ServiceQuotas 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceQuotasResponse]:
    """ServiceQuotas 상세 조회."""
    obj = await ServiceQuotasService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[ServiceQuotasResponse],
    summary="ServiceQuotas 수정",
    description="ServiceQuotas 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: ServiceQuotasUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceQuotasResponse]:
    """ServiceQuotas 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await ServiceQuotasService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="ServiceQuotas 삭제",
    description="ServiceQuotas를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """ServiceQuotas 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await ServiceQuotasService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "ServiceQuotas가 삭제되었습니다"})