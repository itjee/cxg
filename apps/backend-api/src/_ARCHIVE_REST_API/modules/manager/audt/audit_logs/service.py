"""Service layer for AuditLogs."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.audt import AuditLogs

from .schemas import (
    AuditLogsCreate,
    AuditLogsListResponse,
    AuditLogsResponse,
    AuditLogsUpdate,
)


class AuditLogService:
    """Service class for AuditLogs."""

    @staticmethod
    async def create_audit_log(db: AsyncSession, data: AuditLogsCreate) -> None:
        """Create a new AuditLog."""
        obj = AuditLogs(**data.model_dump())
        db.add(obj)
        await db.commit()

    @staticmethod
    async def get_by_id(db: AsyncSession, obj_id: UUID) -> AuditLogsResponse:
        """Get AuditLogs by ID."""
        stmt = select(AuditLogs).where(AuditLogs.id == obj_id, AuditLogs.is_active == True)
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="데이터를 찾을 수 없습니다",
            )

        return AuditLogsResponse.model_validate(obj)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        search: str | None = None,
    ) -> AuditLogsListResponse:
        """Get AuditLogs list with pagination."""
        stmt = select(AuditLogs).where(AuditLogs.is_active == True)

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

        return AuditLogsListResponse(
            items=[AuditLogsResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, obj_id: UUID, data: AuditLogsUpdate, updated_by: UUID | None = None
    ) -> AuditLogsResponse:
        """Update AuditLogs."""
        stmt = select(AuditLogs).where(AuditLogs.id == obj_id, AuditLogs.is_active == True)
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

        return AuditLogsResponse.model_validate(obj)

    @staticmethod
    async def delete(db: AsyncSession, obj_id: UUID, deleted_by: UUID | None = None) -> None:
        """Soft delete AuditLogs."""
        stmt = select(AuditLogs).where(AuditLogs.id == obj_id, AuditLogs.is_active == True)
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
