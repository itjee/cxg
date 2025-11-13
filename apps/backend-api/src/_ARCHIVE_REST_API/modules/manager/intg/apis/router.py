"""API Router for Apis."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ApisCreate, ApisListResponse, ApisResponse, ApisUpdate
from .service import ApisService

router = AuditedAPIRouter(prefix="/apis")


@router.post(
    "",
    response_model=EnvelopeResponse[ApisResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Apis 생성",
    description="새로운 Apis를 생성합니다.",
)
async def create(
    data: ApisCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApisResponse]:
    """Apis 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await ApisService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[ApisListResponse],
    summary="Apis 목록 조회",
    description="Apis 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApisListResponse]:
    """Apis 목록 조회."""
    result = await ApisService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[ApisResponse],
    summary="Apis 상세 조회",
    description="Apis 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApisResponse]:
    """Apis 상세 조회."""
    obj = await ApisService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[ApisResponse],
    summary="Apis 수정",
    description="Apis 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: ApisUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApisResponse]:
    """Apis 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await ApisService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Apis 삭제",
    description="Apis를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Apis 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await ApisService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "Apis가 삭제되었습니다"})