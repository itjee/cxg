"""Tasks API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import TasksCreate, TasksListResponse, TasksResponse, TasksUpdate
from .service import TasksService

router = AuditedAPIRouter(prefix="/tasks")


@router.post(
    "",
    response_model=EnvelopeResponse[TasksResponse],
    status_code=status.HTTP_201_CREATED,
    summary="작업 생성",
    description="새로운 워크플로우 작업을 생성합니다.",
)
async def create_task(
    data: TasksCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TasksResponse]:
    """작업 생성"""
    creator_id = UUID(current_user["user_id"])
    task = await TasksService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(task)


@router.get(
    "",
    response_model=EnvelopeResponse[TasksListResponse],
    summary="작업 목록 조회",
    description="워크플로우 작업 목록을 조회합니다.",
)
async def get_task_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    workflow_id: UUID | None = Query(None, description="워크플로우 ID 필터"),
    step_id: UUID | None = Query(None, description="단계 ID 필터"),
    assigned_to: UUID | None = Query(None, description="할당자 필터"),
    task_status: str | None = Query(None, description="작업 상태 필터"),
    priority: str | None = Query(None, description="우선순위 필터"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TasksListResponse]:
    """작업 목록 조회"""
    tasks = await TasksService.get_list(
        db,
        page=page,
        page_size=page_size,
        workflow_id=workflow_id,
        step_id=step_id,
        assigned_to=assigned_to,
        task_status=task_status,
        priority=priority,
    )
    return EnvelopeResponse.success_response(tasks)


@router.get(
    "/{task_id}",
    response_model=EnvelopeResponse[TasksResponse],
    summary="작업 상세 조회",
    description="특정 워크플로우 작업을 조회합니다.",
)
async def get_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TasksResponse]:
    """작업 상세 조회"""
    task = await TasksService.get_by_id(db, task_id)
    return EnvelopeResponse.success_response(task)


@router.put(
    "/{task_id}",
    response_model=EnvelopeResponse[TasksResponse],
    summary="작업 수정",
    description="워크플로우 작업을 수정합니다.",
)
async def update_task(
    task_id: UUID,
    data: TasksUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TasksResponse]:
    """작업 수정"""
    updater_id = UUID(current_user["user_id"])
    task = await TasksService.update(db, task_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(task)


@router.delete(
    "/{task_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="작업 삭제",
    description="워크플로우 작업을 삭제합니다.",
)
async def delete_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """작업 삭제"""
    await TasksService.delete(db, task_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "작업이 삭제되었습니다"})
