"""Service layer for Resources."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.ifra import Resources

from .schemas import ResourcesCreate, ResourcesListResponse, ResourcesResponse, ResourcesUpdate


class ResourcesService:
    """Service class for Resources."""

    @staticmethod
    async def create(
        db: AsyncSession, data: ResourcesCreate, created_by: UUID | None = None
    ) -> ResourcesResponse:
        """Create a new Resources."""
        obj = Resources(**data.model_dump(), created_by=created_by)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return ResourcesResponse.model_validate(obj)

    @staticmethod
    async def get_by_id(db: AsyncSession, obj_id: UUID) -> ResourcesResponse:
        """Get Resources by ID."""
        stmt = select(Resources).where(Resources.id == obj_id, Resources.is_active == True)
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="데이터를 찾을 수 없습니다",
            )

        return ResourcesResponse.model_validate(obj)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        search: str | None = None,
        resource_filter: str | None = None,
        status_filter: str | None = None,
        tenant_id_filter: UUID | None = None,
        region_filter: str | None = None,
    ) -> ResourcesListResponse:
        """Get Resources list with pagination and filters."""
        stmt = select(Resources).where(Resources.is_active == True, Resources.deleted == False)

        # Apply search filter (resource_name, resource_id)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                (Resources.resource_name.ilike(search_pattern))
                | (Resources.resource_id.ilike(search_pattern))
            )

        # Apply resource type filter
        if resource_filter:
            stmt = stmt.where(Resources.resource == resource_filter)

        # Apply status filter
        if status_filter:
            stmt = stmt.where(Resources.status == status_filter)

        # Apply tenant filter
        if tenant_id_filter:
            stmt = stmt.where(Resources.tenant_id == tenant_id_filter)

        # Apply region filter
        if region_filter:
            stmt = stmt.where(Resources.region == region_filter)

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Apply pagination and ordering
        offset = (page - 1) * page_size
        stmt = stmt.order_by(Resources.created_at.desc()).offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return ResourcesListResponse(
            items=[ResourcesResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, obj_id: UUID, data: ResourcesUpdate, updated_by: UUID | None = None
    ) -> ResourcesResponse:
        """Update Resources."""
        stmt = select(Resources).where(Resources.id == obj_id, Resources.is_active == True)
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

        return ResourcesResponse.model_validate(obj)

    @staticmethod
    async def delete(db: AsyncSession, obj_id: UUID, deleted_by: UUID | None = None) -> None:
        """Soft delete Resources."""
        stmt = select(Resources).where(Resources.id == obj_id, Resources.is_active == True)
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
