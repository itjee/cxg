"""Service for product_price_history business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.pim import ProductPriceHistory

from .schemas import ProductPriceHistoryCreate, ProductPriceHistoryListResponse, ProductPriceHistoryResponse, ProductPriceHistoryUpdate


class ProductPriceHistoryService:
    """Service class for product_price_history."""

    @staticmethod
    async def create(db: AsyncSession, data: ProductPriceHistoryCreate, created_by: UUID | None = None) -> ProductPriceHistoryResponse:
        """Create a new product_price_history record."""
        item = ProductPriceHistory(
            **data.model_dump(),
            created_by=created_by,
        )

        db.add(item)
        await db.commit()
        await db.refresh(item)

        return ProductPriceHistoryResponse.model_validate(item)

    @staticmethod
    async def get_by_id(db: AsyncSession, item_id: UUID) -> ProductPriceHistoryResponse:
        """Get product_price_history by ID."""
        stmt = select(ProductPriceHistory).where(ProductPriceHistory.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product Price History를 찾을 수 없습니다",
            )

        return ProductPriceHistoryResponse.model_validate(item)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
    ) -> ProductPriceHistoryListResponse:
        """Get product_price_history list with pagination."""
        stmt = select(ProductPriceHistory)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return ProductPriceHistoryListResponse(
            items=[ProductPriceHistoryResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, item_id: UUID, data: ProductPriceHistoryUpdate, updated_by: UUID | None = None
    ) -> ProductPriceHistoryResponse:
        """Update product_price_history."""
        stmt = select(ProductPriceHistory).where(ProductPriceHistory.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product Price History를 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        item.updated_by = updated_by
        item.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(item)

        return ProductPriceHistoryResponse.model_validate(item)

    @staticmethod
    async def delete(db: AsyncSession, item_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete product_price_history."""
        stmt = select(ProductPriceHistory).where(ProductPriceHistory.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product Price History를 찾을 수 없습니다",
            )

        await db.delete(item)
        await db.commit()
