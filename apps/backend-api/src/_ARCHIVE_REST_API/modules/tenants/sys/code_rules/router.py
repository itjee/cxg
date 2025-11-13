"""API router for code_rules."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import CodeRulesCreate, CodeRulesListResponse, CodeRulesResponse, CodeRulesUpdate
from .service import CodeRulesService

router = AuditedAPIRouter()


@router.post(
    "",
    response_model=EnvelopeResponse[CodeRulesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Code Rules 생성",
    description="Code Rules를 생성합니다.",
)
async def create_code_rules(
    data: CodeRulesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CodeRulesResponse]:
    """Code Rules 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await CodeRulesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[CodeRulesListResponse],
    summary="Code Rules 목록 조회",
    description="Code Rules 목록을 조회합니다.",
)
async def get_code_rules_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CodeRulesListResponse]:
    """Code Rules 목록 조회"""
    items = await CodeRulesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[CodeRulesResponse],
    summary="Code Rules 상세 조회",
    description="Code Rules를 조회합니다.",
)
async def get_code_rules(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CodeRulesResponse]:
    """Code Rules 상세 조회"""
    item = await CodeRulesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[CodeRulesResponse],
    summary="Code Rules 수정",
    description="Code Rules를 수정합니다.",
)
async def update_code_rules(
    item_id: UUID,
    data: CodeRulesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CodeRulesResponse]:
    """Code Rules 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await CodeRulesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Code Rules 삭제",
    description="Code Rules를 삭제합니다.",
)
async def delete_code_rules(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Code Rules 삭제"""
    await CodeRulesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Code Rules가 삭제되었습니다"})
