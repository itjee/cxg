"""Service layer for ResourceUsages."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.ifra import ResourceUsages

from .schemas import ResourceUsagesCreate, ResourceUsagesListResponse, ResourceUsagesResponse, ResourceUsagesUpdate


class ResourceUsagesService:
    """Service class for ResourceUsages."""

    @staticmethod
    async def create(
        db: AsyncSession, data: ResourceUsagesCreate, created_by: UUID | None = None
    ) -> ResourceUsagesResponse:
        """Create a new ResourceUsages."""
        obj = ResourceUsages(**data.model_dump(), created_by=created_by)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return ResourceUsagesResponse.model_validate(obj)

    @staticmethod
    async def get_by_id(db: AsyncSession, obj_id: UUID) -> ResourceUsagesResponse:
        """Get ResourceUsages by ID."""
        stmt = select(ResourceUsages).where(ResourceUsages.id == obj_id, ResourceUsages.is_active == True)
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="리소스 사용량 메트릭을 찾을 수 없습니다",
            )

        return ResourceUsagesResponse.model_validate(obj)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        resource_id: UUID | None = None,
        tenant_id: UUID | None = None,
        metric_name: str | None = None,
        summary_period: str | None = None,
        start_time: datetime | None = None,
        end_time: datetime | None = None,
        search: str | None = None,
    ) -> ResourceUsagesListResponse:
        """Get ResourceUsages list with pagination and filters."""
        stmt = select(ResourceUsages).where(ResourceUsages.is_active == True)

        # Apply filters
        if resource_id:
            stmt = stmt.where(ResourceUsages.resource_id == resource_id)

        if tenant_id:
            stmt = stmt.where(ResourceUsages.tenant_id == tenant_id)

        if metric_name:
            stmt = stmt.where(ResourceUsages.metric_name == metric_name)

        if summary_period:
            stmt = stmt.where(ResourceUsages.summary_period == summary_period)

        if start_time:
            stmt = stmt.where(ResourceUsages.measure_time >= start_time)

        if end_time:
            stmt = stmt.where(ResourceUsages.measure_time <= end_time)

        # Search filter
        if search:
            stmt = stmt.where(
                or_(
                    ResourceUsages.metric_name.ilike(f"%{search}%"),
                    ResourceUsages.metric_unit.ilike(f"%{search}%"),
                )
            )

        # Order by measure_time descending (latest first)
        stmt = stmt.order_by(ResourceUsages.measure_time.desc())

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

        return ResourceUsagesListResponse(
            items=[ResourceUsagesResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, obj_id: UUID, data: ResourceUsagesUpdate, updated_by: UUID | None = None
    ) -> ResourceUsagesResponse:
        """Update ResourceUsages."""
        stmt = select(ResourceUsages).where(ResourceUsages.id == obj_id, ResourceUsages.is_active == True)
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="리소스 사용량 메트릭을 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(obj, field, value)

        obj.updated_by = updated_by
        obj.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(obj)

        return ResourceUsagesResponse.model_validate(obj)

    @staticmethod
    async def delete(db: AsyncSession, obj_id: UUID, deleted_by: UUID | None = None) -> None:
        """Soft delete ResourceUsages."""
        stmt = select(ResourceUsages).where(ResourceUsages.id == obj_id, ResourceUsages.is_active == True)
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="리소스 사용량 메트릭을 찾을 수 없습니다",
            )

        obj.is_active = False
        obj.updated_by = deleted_by
        obj.updated_at = datetime.now(timezone.utc)

        await db.commit()
