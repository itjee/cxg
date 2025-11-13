"""Steps API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import StepsCreate, StepsListResponse, StepsResponse, StepsUpdate
from .service import StepsService

router = AuditedAPIRouter(prefix="/steps")


@router.post(
    "",
    response_model=EnvelopeResponse[StepsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="단계 생성",
    description="새로운 워크플로우 단계를 생성합니다.",
)
async def create_step(
    data: StepsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[StepsResponse]:
    """단계 생성"""
    creator_id = UUID(current_user["user_id"])
    step = await StepsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(step)


@router.get(
    "",
    response_model=EnvelopeResponse[StepsListResponse],
    summary="단계 목록 조회",
    description="워크플로우 단계 목록을 조회합니다.",
)
async def get_step_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    workflow_id: UUID | None = Query(None, description="워크플로우 ID 필터"),
    is_active: bool | None = Query(None, description="활성 여부 필터"),
    step_type: str | None = Query(None, description="단계 유형 필터"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[StepsListResponse]:
    """단계 목록 조회"""
    steps = await StepsService.get_list(
        db,
        page=page,
        page_size=page_size,
        workflow_id=workflow_id,
        is_active=is_active,
        step_type=step_type,
    )
    return EnvelopeResponse.success_response(steps)


@router.get(
    "/{step_id}",
    response_model=EnvelopeResponse[StepsResponse],
    summary="단계 상세 조회",
    description="특정 워크플로우 단계를 조회합니다.",
)
async def get_step(
    step_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[StepsResponse]:
    """단계 상세 조회"""
    step = await StepsService.get_by_id(db, step_id)
    return EnvelopeResponse.success_response(step)


@router.put(
    "/{step_id}",
    response_model=EnvelopeResponse[StepsResponse],
    summary="단계 수정",
    description="워크플로우 단계를 수정합니다.",
)
async def update_step(
    step_id: UUID,
    data: StepsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[StepsResponse]:
    """단계 수정"""
    updater_id = UUID(current_user["user_id"])
    step = await StepsService.update(db, step_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(step)


@router.delete(
    "/{step_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="단계 삭제",
    description="워크플로우 단계를 삭제합니다.",
)
async def delete_step(
    step_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """단계 삭제"""
    await StepsService.delete(db, step_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "단계가 삭제되었습니다"})
