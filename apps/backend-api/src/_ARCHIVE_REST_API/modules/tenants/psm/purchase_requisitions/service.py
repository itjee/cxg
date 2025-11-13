"""Service for purchase_requisitions business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.psm import PurchaseRequisitions

from .schemas import PurchaseRequisitionsCreate, PurchaseRequisitionsListResponse, PurchaseRequisitionsResponse, PurchaseRequisitionsUpdate


class PurchaseRequisitionsService:
    """Service class for purchase_requisitions."""

    @staticmethod
    async def create(db: AsyncSession, data: PurchaseRequisitionsCreate, created_by: UUID | None = None) -> PurchaseRequisitionsResponse:
        """Create a new purchase_requisitions record."""
        item = PurchaseRequisitions(
            **data.model_dump(),
            created_by=created_by,
        )

        db.add(item)
        await db.commit()
        await db.refresh(item)

        return PurchaseRequisitionsResponse.model_validate(item)

    @staticmethod
    async def get_by_id(db: AsyncSession, item_id: UUID) -> PurchaseRequisitionsResponse:
        """Get purchase_requisitions by ID."""
        stmt = select(PurchaseRequisitions).where(PurchaseRequisitions.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Purchase Requisitions를 찾을 수 없습니다",
            )

        return PurchaseRequisitionsResponse.model_validate(item)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
    ) -> PurchaseRequisitionsListResponse:
        """Get purchase_requisitions list with pagination."""
        stmt = select(PurchaseRequisitions)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return PurchaseRequisitionsListResponse(
            items=[PurchaseRequisitionsResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, item_id: UUID, data: PurchaseRequisitionsUpdate, updated_by: UUID | None = None
    ) -> PurchaseRequisitionsResponse:
        """Update purchase_requisitions."""
        stmt = select(PurchaseRequisitions).where(PurchaseRequisitions.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Purchase Requisitions를 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        item.updated_by = updated_by
        item.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(item)

        return PurchaseRequisitionsResponse.model_validate(item)

    @staticmethod
    async def delete(db: AsyncSession, item_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete purchase_requisitions."""
        stmt = select(PurchaseRequisitions).where(PurchaseRequisitions.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Purchase Requisitions를 찾을 수 없습니다",
            )

        await db.delete(item)
        await db.commit()
