"""API Router for ApiKey."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ApiKeyCreate, ApiKeyListResponse, ApiKeyResponse, ApiKeyUpdate
from .service import ApiKeyService

router = AuditedAPIRouter(prefix="/api_keys")


@router.post(
    "",
    response_model=EnvelopeResponse[ApiKeyResponse],
    status_code=status.HTTP_201_CREATED,
    summary="ApiKey 생성",
    description="새로운 ApiKey를 생성합니다.",
)
async def create(
    data: ApiKeyCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApiKeyResponse]:
    """ApiKey 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await ApiKeyService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[ApiKeyListResponse],
    summary="ApiKey 목록 조회",
    description="ApiKey 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApiKeyListResponse]:
    """ApiKey 목록 조회."""
    result = await ApiKeyService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[ApiKeyResponse],
    summary="ApiKey 상세 조회",
    description="ApiKey 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApiKeyResponse]:
    """ApiKey 상세 조회."""
    obj = await ApiKeyService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[ApiKeyResponse],
    summary="ApiKey 수정",
    description="ApiKey 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: ApiKeyUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ApiKeyResponse]:
    """ApiKey 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await ApiKeyService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="ApiKey 삭제",
    description="ApiKey를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """ApiKey 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await ApiKeyService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "ApiKey가 삭제되었습니다"})