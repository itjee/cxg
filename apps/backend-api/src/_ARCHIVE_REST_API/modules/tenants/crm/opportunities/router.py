"""Opportunities Router"""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

router = AuditedAPIRouter(prefix="/opportunities")


@router.get(
    "",
    summary="영업기회 목록 조회",
    description="영업 기회 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """영업기회 목록 조회"""
    return EnvelopeResponse.success_response({"items": [], "total": 0, "page": page, "page_size": page_size})


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="영업기회 생성",
    description="새로운 영업 기회를 생성합니다.",
)
async def create(
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """영업기회 생성"""
    return EnvelopeResponse.success_response({"message": "영업기회 생성 기능 구현 예정"})


@router.get(
    "/{opportunitie_id}",
    summary="영업기회 조회",
    description="특정 영업 기회를 조회합니다.",
)
async def get_by_id(
    opportunitie_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """영업기회 조회"""
    return EnvelopeResponse.success_response({"message": "영업기회 조회 기능 구현 예정"})


@router.patch(
    "/{opportunitie_id}",
    summary="영업기회 수정",
    description="영업 기회를 수정합니다.",
)
async def update(
    opportunitie_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """영업기회 수정"""
    return EnvelopeResponse.success_response({"message": "영업기회 수정 기능 구현 예정"})


@router.delete(
    "/{opportunitie_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="영업기회 삭제",
    description="영업 기회를 삭제합니다.",
)
async def delete(
    opportunitie_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    """영업기회 삭제"""
    pass
