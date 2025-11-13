"""API Router for Plans."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PlansCreate, PlansListResponse, PlansResponse, PlansUpdate
from .service import PlansService

router = AuditedAPIRouter(prefix="/plans")


@router.post(
    "",
    response_model=EnvelopeResponse[PlansResponse],
    status_code=status.HTTP_201_CREATED,
    summary="요금제 생성",
    description="새로운 요금제를 생성합니다.",
)
async def create(
    data: PlansCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PlansResponse]:
    """새로운 요금제를 생성합니다."""
    creator_id = UUID(current_user["user_id"])
    obj = await PlansService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[PlansListResponse],
    summary="요금제 목록 조회",
    description="페이지네이션, 필터링, 정렬을 지원하는 요금제 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호 (1부터 시작)"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, max_length=100, description="검색어 (코드, 이름, 설명)"),
    status: str | None = Query(None, pattern="^(ACTIVE|INACTIVE|ARCHIVED)$", description="상태 필터"),
    type: str | None = Query(None, pattern="^(TRIAL|STANDARD|PREMIUM|ENTERPRISE)$", description="유형 필터"),
    billing_cycle: str | None = Query(None, pattern="^(MONTHLY|QUARTERLY|YEARLY)$", description="청구 주기 필터"),
    sort_by: str | None = Query(None, pattern="^(name|base_price|type|status|start_time|created_at)$", description="정렬 필드"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$", description="정렬 순서"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PlansListResponse]:
    """요금제 목록을 조회합니다 (페이지네이션, 필터링, 정렬 지원)."""
    result = await PlansService.get_list(
        db,
        page=page,
        page_size=page_size,
        search=search,
        status_filter=status,
        type_filter=type,
        billing_cycle_filter=billing_cycle,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[PlansResponse],
    summary="요금제 상세 조회",
    description="특정 요금제의 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PlansResponse]:
    """특정 요금제의 상세 정보를 조회합니다."""
    obj = await PlansService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[PlansResponse],
    summary="요금제 수정",
    description="요금제 정보를 수정합니다 (부분 업데이트 지원).",
)
async def update(
    obj_id: UUID,
    data: PlansUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PlansResponse]:
    """요금제 정보를 수정합니다."""
    updater_id = UUID(current_user["user_id"])
    obj = await PlansService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="요금제 삭제",
    description="요금제를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """요금제를 삭제합니다 (소프트 삭제)."""
    deleter_id = UUID(current_user["user_id"])
    await PlansService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "요금제가 삭제되었습니다"})