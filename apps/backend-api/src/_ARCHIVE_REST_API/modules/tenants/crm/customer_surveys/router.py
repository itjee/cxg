"""API router for customer_surveys."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import CustomerSurveysCreate, CustomerSurveysListResponse, CustomerSurveysResponse, CustomerSurveysUpdate
from .service import CustomerSurveysService

router = AuditedAPIRouter(prefix="/customer_surveys")


@router.post(
    "",
    response_model=EnvelopeResponse[CustomerSurveysResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Customer Surveys 생성",
    description="Customer Surveys를 생성합니다.",
)
async def create_customer_surveys(
    data: CustomerSurveysCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CustomerSurveysResponse]:
    """Customer Surveys 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await CustomerSurveysService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[CustomerSurveysListResponse],
    summary="Customer Surveys 목록 조회",
    description="Customer Surveys 목록을 조회합니다.",
)
async def get_customer_surveys_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CustomerSurveysListResponse]:
    """Customer Surveys 목록 조회"""
    items = await CustomerSurveysService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[CustomerSurveysResponse],
    summary="Customer Surveys 상세 조회",
    description="Customer Surveys를 조회합니다.",
)
async def get_customer_surveys(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CustomerSurveysResponse]:
    """Customer Surveys 상세 조회"""
    item = await CustomerSurveysService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[CustomerSurveysResponse],
    summary="Customer Surveys 수정",
    description="Customer Surveys를 수정합니다.",
)
async def update_customer_surveys(
    item_id: UUID,
    data: CustomerSurveysUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[CustomerSurveysResponse]:
    """Customer Surveys 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await CustomerSurveysService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Customer Surveys 삭제",
    description="Customer Surveys를 삭제합니다.",
)
async def delete_customer_surveys(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Customer Surveys 삭제"""
    await CustomerSurveysService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Customer Surveys가 삭제되었습니다"})
