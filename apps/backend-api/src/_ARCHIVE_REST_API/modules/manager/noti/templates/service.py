"""Service layer for Templates."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.noti import Templates

from .schemas import TemplatesCreate, TemplatesListResponse, TemplatesResponse, TemplatesUpdate


class TemplatesService:
    """Service class for Templates."""

    @staticmethod
    async def create(
        db: AsyncSession, data: TemplatesCreate, created_by: UUID | None = None
    ) -> TemplatesResponse:
        """Create a new Templates."""
        obj = Templates(**data.model_dump(), created_by=created_by)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return TemplatesResponse.model_validate(obj)

    @staticmethod
    async def get_by_id(db: AsyncSession, obj_id: UUID) -> TemplatesResponse:
        """Get Templates by ID."""
        stmt = select(Templates).where(Templates.id == obj_id, Templates.is_active == True)
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="데이터를 찾을 수 없습니다",
            )

        return TemplatesResponse.model_validate(obj)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        search: str | None = None,
    ) -> TemplatesListResponse:
        """Get Templates list with pagination."""
        stmt = select(Templates).where(Templates.is_active == True)

        # Apply search filter if provided
        if search:
            # Add search logic here based on your model fields
            pass

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Apply pagination
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return TemplatesListResponse(
            items=[TemplatesResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, obj_id: UUID, data: TemplatesUpdate, updated_by: UUID | None = None
    ) -> TemplatesResponse:
        """Update Templates."""
        stmt = select(Templates).where(Templates.id == obj_id, Templates.is_active == True)
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="데이터를 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(obj, field, value)

        obj.updated_by = updated_by
        obj.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(obj)

        return TemplatesResponse.model_validate(obj)

    @staticmethod
    async def delete(db: AsyncSession, obj_id: UUID, deleted_by: UUID | None = None) -> None:
        """Soft delete Templates."""
        stmt = select(Templates).where(Templates.id == obj_id, Templates.is_active == True)
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="데이터를 찾을 수 없습니다",
            )

        obj.is_active = False
        obj.updated_by = deleted_by
        obj.updated_at = datetime.now(timezone.utc)

        await db.commit()
