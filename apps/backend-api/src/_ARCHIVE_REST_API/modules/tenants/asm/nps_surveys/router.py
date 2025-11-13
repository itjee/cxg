"""API router for nps_surveys."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import NpsSurveysCreate, NpsSurveysListResponse, NpsSurveysResponse, NpsSurveysUpdate
from .service import NpsSurveysService

router = AuditedAPIRouter(prefix="/nps_surveys")


@router.post(
    "",
    response_model=EnvelopeResponse[NpsSurveysResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Nps Surveys 생성",
    description="Nps Surveys를 생성합니다.",
)
async def create_nps_surveys(
    data: NpsSurveysCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[NpsSurveysResponse]:
    """Nps Surveys 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await NpsSurveysService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[NpsSurveysListResponse],
    summary="Nps Surveys 목록 조회",
    description="Nps Surveys 목록을 조회합니다.",
)
async def get_nps_surveys_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[NpsSurveysListResponse]:
    """Nps Surveys 목록 조회"""
    items = await NpsSurveysService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[NpsSurveysResponse],
    summary="Nps Surveys 상세 조회",
    description="Nps Surveys를 조회합니다.",
)
async def get_nps_surveys(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[NpsSurveysResponse]:
    """Nps Surveys 상세 조회"""
    item = await NpsSurveysService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[NpsSurveysResponse],
    summary="Nps Surveys 수정",
    description="Nps Surveys를 수정합니다.",
)
async def update_nps_surveys(
    item_id: UUID,
    data: NpsSurveysUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[NpsSurveysResponse]:
    """Nps Surveys 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await NpsSurveysService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Nps Surveys 삭제",
    description="Nps Surveys를 삭제합니다.",
)
async def delete_nps_surveys(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Nps Surveys 삭제"""
    await NpsSurveysService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Nps Surveys가 삭제되었습니다"})
