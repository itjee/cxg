"""API Router for AuditLogs."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import AuditLogsListResponse, AuditLogsResponse
from .service import AuditLogService

router = AuditedAPIRouter(prefix="/audit_logs")


@router.get(
    "",
    response_model=EnvelopeResponse[AuditLogsListResponse],
    summary="AuditLogs 목록 조회",
    description="AuditLogs 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AuditLogsListResponse]:
    """AuditLogs 목록 조회."""
    result = await AuditLogService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[AuditLogsResponse],
    summary="AuditLogs 상세 조회",
    description="AuditLogs 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[AuditLogsResponse]:
    """AuditLogs 상세 조회."""
    obj = await AuditLogService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)