"""Activities Router"""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

router = AuditedAPIRouter(prefix="/activities")


@router.get(
    "",
    summary="활동 목록 조회",
    description="고객 활동 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """활동 목록 조회"""
    return EnvelopeResponse.success_response({"items": [], "total": 0, "page": page, "page_size": page_size})


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="활동 생성",
    description="새로운 고객 활동를 생성합니다.",
)
async def create(
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """활동 생성"""
    return EnvelopeResponse.success_response({"message": "활동 생성 기능 구현 예정"})


@router.get(
    "/{activitie_id}",
    summary="활동 조회",
    description="특정 고객 활동를 조회합니다.",
)
async def get_by_id(
    activitie_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """활동 조회"""
    return EnvelopeResponse.success_response({"message": "활동 조회 기능 구현 예정"})


@router.patch(
    "/{activitie_id}",
    summary="활동 수정",
    description="고객 활동를 수정합니다.",
)
async def update(
    activitie_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """활동 수정"""
    return EnvelopeResponse.success_response({"message": "활동 수정 기능 구현 예정"})


@router.delete(
    "/{activitie_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="활동 삭제",
    description="고객 활동를 삭제합니다.",
)
async def delete(
    activitie_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """활동 삭제"""
    pass
