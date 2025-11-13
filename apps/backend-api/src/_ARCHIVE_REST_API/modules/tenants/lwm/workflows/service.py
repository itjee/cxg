"""Workflows service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.lwm import Workflows

from .schemas import WorkflowsCreate, WorkflowsListResponse, WorkflowsResponse, WorkflowsUpdate


class WorkflowsService:
    """Workflows service class."""

    @staticmethod
    async def create(db: AsyncSession, data: WorkflowsCreate, created_by: UUID | None = None) -> WorkflowsResponse:
        """Create a new workflow."""
        # Create workflow
        workflow = Workflows(
            name=data.name,
            description=data.description,
            workflow_type=data.workflow_type,
            status=data.status,
            is_active=data.is_active,
            config=data.config,
            version=data.version,
            created_by=created_by,
        )

        db.add(workflow)
        await db.commit()
        await db.refresh(workflow)

        return WorkflowsResponse.model_validate(workflow)

    @staticmethod
    async def get_by_id(db: AsyncSession, workflow_id: UUID) -> WorkflowsResponse:
        """Get workflow by ID."""
        stmt = select(Workflows).where(Workflows.id == workflow_id)
        result = await db.execute(stmt)
        workflow = result.scalar_one_or_none()

        if not workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="워크플로우를 찾을 수 없습니다",
            )

        return WorkflowsResponse.model_validate(workflow)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        is_active: bool | None = None,
        workflow_type: str | None = None,
        search: str | None = None,
    ) -> WorkflowsListResponse:
        """Get workflow list with pagination and filters."""
        # Base query
        stmt = select(Workflows)

        # Apply filters
        if is_active is not None:
            stmt = stmt.where(Workflows.is_active == is_active)
        if workflow_type:
            stmt = stmt.where(Workflows.workflow_type == workflow_type)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(Workflows.name.ilike(search_pattern))

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Apply pagination
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        # Execute query
        result = await db.execute(stmt)
        workflows = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return WorkflowsListResponse(
            items=[WorkflowsResponse.model_validate(workflow) for workflow in workflows],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, workflow_id: UUID, data: WorkflowsUpdate, updated_by: UUID | None = None
    ) -> WorkflowsResponse:
        """Update workflow."""
        stmt = select(Workflows).where(Workflows.id == workflow_id)
        result = await db.execute(stmt)
        workflow = result.scalar_one_or_none()

        if not workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="워크플로우를 찾을 수 없습니다",
            )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(workflow, field, value)

        workflow.updated_by = updated_by
        workflow.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(workflow)

        return WorkflowsResponse.model_validate(workflow)

    @staticmethod
    async def delete(db: AsyncSession, workflow_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete workflow."""
        stmt = select(Workflows).where(Workflows.id == workflow_id)
        result = await db.execute(stmt)
        workflow = result.scalar_one_or_none()

        if not workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="워크플로우를 찾을 수 없습니다",
            )

        await db.delete(workflow)
        await db.commit()
