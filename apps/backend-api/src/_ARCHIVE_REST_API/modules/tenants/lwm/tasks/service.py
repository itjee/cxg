"""Tasks service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.lwm import Tasks, Workflows, Steps

from .schemas import TasksCreate, TasksListResponse, TasksResponse, TasksUpdate


class TasksService:
    """Tasks service class."""

    @staticmethod
    async def create(db: AsyncSession, data: TasksCreate, created_by: UUID | None = None) -> TasksResponse:
        """Create a new task."""
        # Verify workflow exists
        stmt = select(Workflows).where(Workflows.id == data.workflow_id)
        result = await db.execute(stmt)
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="워크플로우를 찾을 수 없습니다",
            )

        # Verify step exists
        stmt = select(Steps).where(Steps.id == data.step_id)
        result = await db.execute(stmt)
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="단계를 찾을 수 없습니다",
            )

        # Create task
        task = Tasks(
            workflow_id=data.workflow_id,
            step_id=data.step_id,
            request_id=data.request_id,
            assigned_to=data.assigned_to,
            assigned_group=data.assigned_group,
            task_status=data.task_status,
            priority=data.priority,
            due_date=data.due_date,
            comments=data.comments,
            config=data.config,
            created_by=created_by,
        )

        db.add(task)
        await db.commit()
        await db.refresh(task)

        return TasksResponse.model_validate(task)

    @staticmethod
    async def get_by_id(db: AsyncSession, task_id: UUID) -> TasksResponse:
        """Get task by ID."""
        stmt = select(Tasks).where(Tasks.id == task_id)
        result = await db.execute(stmt)
        task = result.scalar_one_or_none()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="작업을 찾을 수 없습니다",
            )

        return TasksResponse.model_validate(task)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        workflow_id: UUID | None = None,
        step_id: UUID | None = None,
        assigned_to: UUID | None = None,
        task_status: str | None = None,
        priority: str | None = None,
    ) -> TasksListResponse:
        """Get task list with pagination and filters."""
        # Base query
        stmt = select(Tasks)

        # Apply filters
        if workflow_id:
            stmt = stmt.where(Tasks.workflow_id == workflow_id)
        if step_id:
            stmt = stmt.where(Tasks.step_id == step_id)
        if assigned_to:
            stmt = stmt.where(Tasks.assigned_to == assigned_to)
        if task_status:
            stmt = stmt.where(Tasks.task_status == task_status)
        if priority:
            stmt = stmt.where(Tasks.priority == priority)

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Apply pagination
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        # Execute query
        result = await db.execute(stmt)
        tasks = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return TasksListResponse(
            items=[TasksResponse.model_validate(task) for task in tasks],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, task_id: UUID, data: TasksUpdate, updated_by: UUID | None = None
    ) -> TasksResponse:
        """Update task."""
        stmt = select(Tasks).where(Tasks.id == task_id)
        result = await db.execute(stmt)
        task = result.scalar_one_or_none()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="작업을 찾을 수 없습니다",
            )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        task.updated_by = updated_by
        task.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(task)

        return TasksResponse.model_validate(task)

    @staticmethod
    async def delete(db: AsyncSession, task_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete task."""
        stmt = select(Tasks).where(Tasks.id == task_id)
        result = await db.execute(stmt)
        task = result.scalar_one_or_none()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="작업을 찾을 수 없습니다",
            )

        await db.delete(task)
        await db.commit()
