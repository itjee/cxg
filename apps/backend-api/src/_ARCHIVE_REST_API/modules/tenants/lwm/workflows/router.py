"""Workflows API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import WorkflowsCreate, WorkflowsListResponse, WorkflowsResponse, WorkflowsUpdate
from .service import WorkflowsService

router = AuditedAPIRouter(prefix="/workflows")


@router.post(
    "",
    response_model=EnvelopeResponse[WorkflowsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="워크플로우 생성",
    description="새로운 워크플로우를 생성합니다.",
)
async def create_workflow(
    data: WorkflowsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WorkflowsResponse]:
    """워크플로우 생성"""
    creator_id = UUID(current_user["user_id"])
    workflow = await WorkflowsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(workflow)


@router.get(
    "",
    response_model=EnvelopeResponse[WorkflowsListResponse],
    summary="워크플로우 목록 조회",
    description="워크플로우 목록을 조회합니다.",
)
async def get_workflow_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    is_active: bool | None = Query(None, description="활성 여부 필터"),
    workflow_type: str | None = Query(None, description="워크플로우 유형 필터"),
    search: str | None = Query(None, description="검색어 (워크플로우명)"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WorkflowsListResponse]:
    """워크플로우 목록 조회"""
    workflows = await WorkflowsService.get_list(
        db,
        page=page,
        page_size=page_size,
        is_active=is_active,
        workflow_type=workflow_type,
        search=search,
    )
    return EnvelopeResponse.success_response(workflows)


@router.get(
    "/{workflow_id}",
    response_model=EnvelopeResponse[WorkflowsResponse],
    summary="워크플로우 상세 조회",
    description="특정 워크플로우를 조회합니다.",
)
async def get_workflow(
    workflow_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WorkflowsResponse]:
    """워크플로우 상세 조회"""
    workflow = await WorkflowsService.get_by_id(db, workflow_id)
    return EnvelopeResponse.success_response(workflow)


@router.put(
    "/{workflow_id}",
    response_model=EnvelopeResponse[WorkflowsResponse],
    summary="워크플로우 수정",
    description="워크플로우를 수정합니다.",
)
async def update_workflow(
    workflow_id: UUID,
    data: WorkflowsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[WorkflowsResponse]:
    """워크플로우 수정"""
    updater_id = UUID(current_user["user_id"])
    workflow = await WorkflowsService.update(db, workflow_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(workflow)


@router.delete(
    "/{workflow_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="워크플로우 삭제",
    description="워크플로우를 삭제합니다.",
)
async def delete_workflow(
    workflow_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """워크플로우 삭제"""
    await WorkflowsService.delete(db, workflow_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "워크플로우가 삭제되었습니다"})
