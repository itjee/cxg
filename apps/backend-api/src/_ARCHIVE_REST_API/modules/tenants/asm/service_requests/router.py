"""Service Requests API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ServiceRequestsCreate, ServiceRequestsListResponse, ServiceRequestsResponse, ServiceRequestsUpdate
from .service import ServiceRequestsService

router = AuditedAPIRouter(prefix="/service-requests")


@router.post(
    "",
    response_model=EnvelopeResponse[ServiceRequestsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="A/S 요청 생성",
    description="새로운 A/S 요청을 생성합니다.",
)
async def create_service_request(
    data: ServiceRequestsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceRequestsResponse]:
    """A/S 요청 생성"""
    creator_id = UUID(current_user["user_id"])
    service_request = await ServiceRequestsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(service_request)


@router.get(
    "",
    response_model=EnvelopeResponse[ServiceRequestsListResponse],
    summary="A/S 요청 목록 조회",
    description="A/S 요청 목록을 조회합니다.",
)
async def get_service_request_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    status: str | None = Query(None, description="상태 필터"),
    priority: str | None = Query(None, description="우선순위 필터"),
    customer_id: UUID | None = Query(None, description="고객 ID 필터"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceRequestsListResponse]:
    """A/S 요청 목록 조회"""
    service_requests = await ServiceRequestsService.get_list(
        db,
        page=page,
        page_size=page_size,
        status=status,
        priority=priority,
        customer_id=customer_id,
    )
    return EnvelopeResponse.success_response(service_requests)


@router.get(
    "/{service_request_id}",
    response_model=EnvelopeResponse[ServiceRequestsResponse],
    summary="A/S 요청 상세 조회",
    description="특정 A/S 요청을 조회합니다.",
)
async def get_service_request(
    service_request_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceRequestsResponse]:
    """A/S 요청 상세 조회"""
    service_request = await ServiceRequestsService.get_by_id(db, service_request_id)
    return EnvelopeResponse.success_response(service_request)


@router.put(
    "/{service_request_id}",
    response_model=EnvelopeResponse[ServiceRequestsResponse],
    summary="A/S 요청 수정",
    description="A/S 요청을 수정합니다.",
)
async def update_service_request(
    service_request_id: UUID,
    data: ServiceRequestsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ServiceRequestsResponse]:
    """A/S 요청 수정"""
    updater_id = UUID(current_user["user_id"])
    service_request = await ServiceRequestsService.update(db, service_request_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(service_request)


@router.delete(
    "/{service_request_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="A/S 요청 삭제",
    description="A/S 요청을 삭제합니다.",
)
async def delete_service_request(
    service_request_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """A/S 요청 삭제"""
    await ServiceRequestsService.delete(db, service_request_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "A/S 요청이 삭제되었습니다"})
