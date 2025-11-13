"""Service for inventory_transfers business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.ivm import InventoryTransfers

from .schemas import InventoryTransfersCreate, InventoryTransfersListResponse, InventoryTransfersResponse, InventoryTransfersUpdate


class InventoryTransfersService:
    """Service class for inventory_transfers."""

    @staticmethod
    async def create(db: AsyncSession, data: InventoryTransfersCreate, created_by: UUID | None = None) -> InventoryTransfersResponse:
        """Create a new inventory_transfers record."""
        item = InventoryTransfers(
            **data.model_dump(),
            created_by=created_by,
        )

        db.add(item)
        await db.commit()
        await db.refresh(item)

        return InventoryTransfersResponse.model_validate(item)

    @staticmethod
    async def get_by_id(db: AsyncSession, item_id: UUID) -> InventoryTransfersResponse:
        """Get inventory_transfers by ID."""
        stmt = select(InventoryTransfers).where(InventoryTransfers.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory Transfers를 찾을 수 없습니다",
            )

        return InventoryTransfersResponse.model_validate(item)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
    ) -> InventoryTransfersListResponse:
        """Get inventory_transfers list with pagination."""
        stmt = select(InventoryTransfers)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return InventoryTransfersListResponse(
            items=[InventoryTransfersResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, item_id: UUID, data: InventoryTransfersUpdate, updated_by: UUID | None = None
    ) -> InventoryTransfersResponse:
        """Update inventory_transfers."""
        stmt = select(InventoryTransfers).where(InventoryTransfers.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory Transfers를 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        item.updated_by = updated_by
        item.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(item)

        return InventoryTransfersResponse.model_validate(item)

    @staticmethod
    async def delete(db: AsyncSession, item_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete inventory_transfers."""
        stmt = select(InventoryTransfers).where(InventoryTransfers.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory Transfers를 찾을 수 없습니다",
            )

        await db.delete(item)
        await db.commit()
