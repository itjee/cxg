"""Service for service_works business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.asm import ServiceWorks

from .schemas import ServiceWorksCreate, ServiceWorksListResponse, ServiceWorksResponse, ServiceWorksUpdate


class ServiceWorksService:
    """Service class for service_works."""

    @staticmethod
    async def create(db: AsyncSession, data: ServiceWorksCreate, created_by: UUID | None = None) -> ServiceWorksResponse:
        """Create a new service_works record."""
        item = ServiceWorks(
            **data.model_dump(),
            created_by=created_by,
        )

        db.add(item)
        await db.commit()
        await db.refresh(item)

        return ServiceWorksResponse.model_validate(item)

    @staticmethod
    async def get_by_id(db: AsyncSession, item_id: UUID) -> ServiceWorksResponse:
        """Get service_works by ID."""
        stmt = select(ServiceWorks).where(ServiceWorks.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service Works를 찾을 수 없습니다",
            )

        return ServiceWorksResponse.model_validate(item)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
    ) -> ServiceWorksListResponse:
        """Get service_works list with pagination."""
        stmt = select(ServiceWorks)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return ServiceWorksListResponse(
            items=[ServiceWorksResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, item_id: UUID, data: ServiceWorksUpdate, updated_by: UUID | None = None
    ) -> ServiceWorksResponse:
        """Update service_works."""
        stmt = select(ServiceWorks).where(ServiceWorks.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service Works를 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        item.updated_by = updated_by
        item.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(item)

        return ServiceWorksResponse.model_validate(item)

    @staticmethod
    async def delete(db: AsyncSession, item_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete service_works."""
        stmt = select(ServiceWorks).where(ServiceWorks.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service Works를 찾을 수 없습니다",
            )

        await db.delete(item)
        await db.commit()
