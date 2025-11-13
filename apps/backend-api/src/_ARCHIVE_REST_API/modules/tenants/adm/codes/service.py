"""Codes service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.adm import CodeGroups, Codes

from .schemas import CodesCreate, CodesListResponse, CodesResponse, CodesUpdate


class CodesService:
    """Codes service class."""

    @staticmethod
    async def create(db: AsyncSession, data: CodesCreate, created_by: UUID | None = None) -> CodesResponse:
        """Create a new code."""
        # Check if code group exists
        stmt = select(CodeGroups).where(CodeGroups.id == data.group_id)
        result = await db.execute(stmt)
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="코드 그룹을 찾을 수 없습니다",
            )

        # Create code
        code = Codes(
            group_id=data.group_id,
            code=data.code,
            name=data.name,
            name_en=data.name_en,
            description=data.description,
            attribute1=data.attribute1,
            attribute2=data.attribute2,
            attribute3=data.attribute3,
            sort_order=data.sort_order,
            is_active=data.is_active,
            is_system=data.is_system,
            is_deleted=data.is_deleted,
            created_by=created_by,
        )

        db.add(code)
        await db.commit()
        await db.refresh(code)

        return CodesResponse.model_validate(code)

    @staticmethod
    async def get_by_id(db: AsyncSession, code_id: UUID) -> CodesResponse:
        """Get code by ID."""
        stmt = select(Codes).where(Codes.id == code_id)
        result = await db.execute(stmt)
        code = result.scalar_one_or_none()

        if not code:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="코드를 찾을 수 없습니다",
            )

        return CodesResponse.model_validate(code)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        group_id: UUID | None = None,
        is_active: bool | None = None,
        is_deleted: bool | None = False,
        search: str | None = None,
    ) -> CodesListResponse:
        """Get code list with pagination and filters."""
        # Base query
        stmt = select(Codes)

        # Apply filters
        if group_id:
            stmt = stmt.where(Codes.group_id == group_id)
        if is_active is not None:
            stmt = stmt.where(Codes.is_active == is_active)
        if is_deleted is not None:
            stmt = stmt.where(Codes.is_deleted == is_deleted)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                (Codes.code.ilike(search_pattern))
                | (Codes.name.ilike(search_pattern))
                | (Codes.name_en.ilike(search_pattern))
            )

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Apply pagination
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        # Execute query
        result = await db.execute(stmt)
        codes = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return CodesListResponse(
            items=[CodesResponse.model_validate(code) for code in codes],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, code_id: UUID, data: CodesUpdate, updated_by: UUID | None = None
    ) -> CodesResponse:
        """Update code."""
        stmt = select(Codes).where(Codes.id == code_id)
        result = await db.execute(stmt)
        code = result.scalar_one_or_none()

        if not code:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="코드를 찾을 수 없습니다",
            )

        # Check if code is system code (cannot be updated)
        if code.is_system:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="시스템 코드는 수정할 수 없습니다",
            )

        # Check if group is being changed and if new group exists
        if data.group_id and data.group_id != code.group_id:
            stmt = select(CodeGroups).where(CodeGroups.id == data.group_id)
            result = await db.execute(stmt)
            if not result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="코드 그룹을 찾을 수 없습니다",
                )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(code, field, value)

        code.updated_by = updated_by
        code.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(code)

        return CodesResponse.model_validate(code)

    @staticmethod
    async def delete(db: AsyncSession, code_id: UUID, deleted_by: UUID | None = None) -> None:
        """Soft delete code."""
        stmt = select(Codes).where(Codes.id == code_id)
        result = await db.execute(stmt)
        code = result.scalar_one_or_none()

        if not code:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="코드를 찾을 수 없습니다",
            )

        # Check if code is system code (cannot be deleted)
        if code.is_system:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="시스템 코드는 삭제할 수 없습니다",
            )

        # Soft delete
        code.is_deleted = True
        code.updated_by = deleted_by
        code.updated_at = datetime.now(timezone.utc)

        await db.commit()
