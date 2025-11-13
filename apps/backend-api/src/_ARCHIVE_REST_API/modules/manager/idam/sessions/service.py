"""Service layer for Session."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.idam import Session

from .schemas import SessionCreate, SessionListResponse, SessionResponse, SessionUpdate


class SessionService:
    """Service class for Session."""

    @staticmethod
    async def create(
        db: AsyncSession, data: SessionCreate, created_by: UUID | None = None
    ) -> SessionResponse:
        """Create a new Session."""
        try:
            # model_dump()로 데이터 추출
            session_data = data.model_dump()
            
            # created_by 추가
            if created_by:
                session_data["created_by"] = created_by
            
            obj = Session(**session_data)
            db.add(obj)
            await db.commit()
            await db.refresh(obj)
            return SessionResponse.model_validate(obj)
        except Exception as e:
            await db.rollback()
            print(f"Session create error: {e}")
            print(f"Session data: {data.model_dump()}")
            raise

    @staticmethod
    async def get_by_id(db: AsyncSession, obj_id: UUID) -> SessionResponse:
        """Get Session by ID."""
        stmt = select(Session).where(Session.id == obj_id, Session.is_active == True)
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="데이터를 찾을 수 없습니다",
            )

        return SessionResponse.model_validate(obj)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        search: str | None = None,
    ) -> SessionListResponse:
        """Get Session list with pagination."""
        stmt = select(Session).where(Session.is_active == True)

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

        return SessionListResponse(
            items=[SessionResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, obj_id: UUID, data: SessionUpdate, updated_by: UUID | None = None
    ) -> SessionResponse:
        """Update Session."""
        stmt = select(Session).where(Session.id == obj_id, Session.is_active == True)
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

        return SessionResponse.model_validate(obj)

    @staticmethod
    async def delete(db: AsyncSession, obj_id: UUID, deleted_by: UUID | None = None) -> None:
        """Soft delete Session."""
        stmt = select(Session).where(Session.id == obj_id, Session.is_active == True)
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
