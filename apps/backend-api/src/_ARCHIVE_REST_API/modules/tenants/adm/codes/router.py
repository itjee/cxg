"""Codes API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import CodesCreate, CodesListResponse, CodesResponse, CodesUpdate
from .service import CodesService

router = AuditedAPIRouter(prefix="/codes")


@router.post(
    "",
    response_model=EnvelopeResponse[CodesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="코드 생성",
    description="새로운 코드를 생성합니다.",
)
async def create_code(
    data: CodesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CodesResponse]:
    """코드 생성."""
    creator_id = UUID(current_user["user_id"])
    code = await CodesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(code)


@router.get(
    "",
    response_model=EnvelopeResponse[CodesListResponse],
    summary="코드 목록 조회",
    description="코드 목록을 페이지네이션과 필터로 조회합니다.",
)
async def get_code_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    group_id: UUID | None = Query(None, description="코드그룹 필터"),
    is_active: bool | None = Query(None, description="활성 여부 필터"),
    is_deleted: bool | None = Query(False, description="삭제 여부 필터"),
    search: str | None = Query(None, description="검색어 (코드값, 코드명)"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CodesListResponse]:
    """코드 목록 조회."""
    codes = await CodesService.get_list(
        db,
        page=page,
        page_size=page_size,
        group_id=group_id,
        is_active=is_active,
        is_deleted=is_deleted,
        search=search,
    )
    return EnvelopeResponse.success_response(codes)


@router.get(
    "/{code_id}",
    response_model=EnvelopeResponse[CodesResponse],
    summary="코드 상세 조회",
    description="특정 코드의 상세 정보를 조회합니다.",
)
async def get_code(
    code_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CodesResponse]:
    """코드 상세 조회."""
    code = await CodesService.get_by_id(db, code_id)
    return EnvelopeResponse.success_response(code)


@router.put(
    "/{code_id}",
    response_model=EnvelopeResponse[CodesResponse],
    summary="코드 수정",
    description="코드 정보를 수정합니다.",
)
async def update_code(
    code_id: UUID,
    data: CodesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CodesResponse]:
    """코드 수정."""
    updater_id = UUID(current_user["user_id"])
    code = await CodesService.update(db, code_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(code)


@router.delete(
    "/{code_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="코드 삭제",
    description="코드를 삭제합니다 (소프트 삭제).",
)
async def delete_code(
    code_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """코드 삭제."""
    await CodesService.delete(db, code_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "코드가 삭제되었습니다"})
