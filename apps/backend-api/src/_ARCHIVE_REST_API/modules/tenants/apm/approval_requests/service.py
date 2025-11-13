"""Service for approval_requests business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.apm import ApprovalRequests

from .schemas import ApprovalRequestsCreate, ApprovalRequestsListResponse, ApprovalRequestsResponse, ApprovalRequestsUpdate


class ApprovalRequestsService:
    """Service class for approval_requests."""

    @staticmethod
    async def create(db: AsyncSession, data: ApprovalRequestsCreate, created_by: UUID | None = None) -> ApprovalRequestsResponse:
        """Create a new approval_requests record."""
        item = ApprovalRequests(
            **data.model_dump(),
            created_by=created_by,
        )

        db.add(item)
        await db.commit()
        await db.refresh(item)

        return ApprovalRequestsResponse.model_validate(item)

    @staticmethod
    async def get_by_id(db: AsyncSession, item_id: UUID) -> ApprovalRequestsResponse:
        """Get approval_requests by ID."""
        stmt = select(ApprovalRequests).where(ApprovalRequests.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Approval Requests를 찾을 수 없습니다",
            )

        return ApprovalRequestsResponse.model_validate(item)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
    ) -> ApprovalRequestsListResponse:
        """Get approval_requests list with pagination."""
        stmt = select(ApprovalRequests)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return ApprovalRequestsListResponse(
            items=[ApprovalRequestsResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, item_id: UUID, data: ApprovalRequestsUpdate, updated_by: UUID | None = None
    ) -> ApprovalRequestsResponse:
        """Update approval_requests."""
        stmt = select(ApprovalRequests).where(ApprovalRequests.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Approval Requests를 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        item.updated_by = updated_by
        item.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(item)

        return ApprovalRequestsResponse.model_validate(item)

    @staticmethod
    async def delete(db: AsyncSession, item_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete approval_requests."""
        stmt = select(ApprovalRequests).where(ApprovalRequests.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Approval Requests를 찾을 수 없습니다",
            )

        await db.delete(item)
        await db.commit()
