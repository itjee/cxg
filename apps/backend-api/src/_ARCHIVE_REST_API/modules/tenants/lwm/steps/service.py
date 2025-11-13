"""Steps service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.lwm import Steps, Workflows

from .schemas import StepsCreate, StepsListResponse, StepsResponse, StepsUpdate


class StepsService:
    """Steps service class."""

    @staticmethod
    async def create(db: AsyncSession, data: StepsCreate, created_by: UUID | None = None) -> StepsResponse:
        """Create a new step."""
        # Verify workflow exists
        stmt = select(Workflows).where(Workflows.id == data.workflow_id)
        result = await db.execute(stmt)
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="워크플로우를 찾을 수 없습니다",
            )

        # Create step
        step = Steps(
            workflow_id=data.workflow_id,
            step_number=data.step_number,
            name=data.name,
            description=data.description,
            step_type=data.step_type,
            action_type=data.action_type,
            required_approvers=data.required_approvers,
            timeout_days=data.timeout_days,
            config=data.config,
            is_active=data.is_active,
            created_by=created_by,
        )

        db.add(step)
        await db.commit()
        await db.refresh(step)

        return StepsResponse.model_validate(step)

    @staticmethod
    async def get_by_id(db: AsyncSession, step_id: UUID) -> StepsResponse:
        """Get step by ID."""
        stmt = select(Steps).where(Steps.id == step_id)
        result = await db.execute(stmt)
        step = result.scalar_one_or_none()

        if not step:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="단계를 찾을 수 없습니다",
            )

        return StepsResponse.model_validate(step)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        workflow_id: UUID | None = None,
        is_active: bool | None = None,
        step_type: str | None = None,
    ) -> StepsListResponse:
        """Get step list with pagination and filters."""
        # Base query
        stmt = select(Steps)

        # Apply filters
        if workflow_id:
            stmt = stmt.where(Steps.workflow_id == workflow_id)
        if is_active is not None:
            stmt = stmt.where(Steps.is_active == is_active)
        if step_type:
            stmt = stmt.where(Steps.step_type == step_type)

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Apply pagination
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size).order_by(Steps.step_number)

        # Execute query
        result = await db.execute(stmt)
        steps = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return StepsListResponse(
            items=[StepsResponse.model_validate(step) for step in steps],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, step_id: UUID, data: StepsUpdate, updated_by: UUID | None = None
    ) -> StepsResponse:
        """Update step."""
        stmt = select(Steps).where(Steps.id == step_id)
        result = await db.execute(stmt)
        step = result.scalar_one_or_none()

        if not step:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="단계를 찾을 수 없습니다",
            )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(step, field, value)

        step.updated_by = updated_by
        step.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(step)

        return StepsResponse.model_validate(step)

    @staticmethod
    async def delete(db: AsyncSession, step_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete step."""
        stmt = select(Steps).where(Steps.id == step_id)
        result = await db.execute(stmt)
        step = result.scalar_one_or_none()

        if not step:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="단계를 찾을 수 없습니다",
            )

        await db.delete(step)
        await db.commit()
