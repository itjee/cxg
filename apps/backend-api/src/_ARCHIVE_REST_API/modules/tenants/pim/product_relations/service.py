"""Service for product_relations business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.pim import ProductRelations

from .schemas import ProductRelationsCreate, ProductRelationsListResponse, ProductRelationsResponse, ProductRelationsUpdate


class ProductRelationsService:
    """Service class for product_relations."""

    @staticmethod
    async def create(db: AsyncSession, data: ProductRelationsCreate, created_by: UUID | None = None) -> ProductRelationsResponse:
        """Create a new product_relations record."""
        item = ProductRelations(
            **data.model_dump(),
            created_by=created_by,
        )

        db.add(item)
        await db.commit()
        await db.refresh(item)

        return ProductRelationsResponse.model_validate(item)

    @staticmethod
    async def get_by_id(db: AsyncSession, item_id: UUID) -> ProductRelationsResponse:
        """Get product_relations by ID."""
        stmt = select(ProductRelations).where(ProductRelations.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product Relations를 찾을 수 없습니다",
            )

        return ProductRelationsResponse.model_validate(item)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
    ) -> ProductRelationsListResponse:
        """Get product_relations list with pagination."""
        stmt = select(ProductRelations)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return ProductRelationsListResponse(
            items=[ProductRelationsResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, item_id: UUID, data: ProductRelationsUpdate, updated_by: UUID | None = None
    ) -> ProductRelationsResponse:
        """Update product_relations."""
        stmt = select(ProductRelations).where(ProductRelations.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product Relations를 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        item.updated_by = updated_by
        item.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(item)

        return ProductRelationsResponse.model_validate(item)

    @staticmethod
    async def delete(db: AsyncSession, item_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete product_relations."""
        stmt = select(ProductRelations).where(ProductRelations.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product Relations를 찾을 수 없습니다",
            )

        await db.delete(item)
        await db.commit()
