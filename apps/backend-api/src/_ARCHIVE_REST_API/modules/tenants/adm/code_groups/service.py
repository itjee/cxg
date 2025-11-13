"""CodeGroups service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.adm import CodeGroups

from .schemas import CodeGroupsCreate, CodeGroupsListResponse, CodeGroupsResponse, CodeGroupsUpdate


class CodeGroupsService:
    """CodeGroups service class."""

    @staticmethod
    async def create(db: AsyncSession, data: CodeGroupsCreate, created_by: UUID | None = None) -> CodeGroupsResponse:
        """Create a new code group."""
        # Check if parent group exists if specified
        if data.parent_group_id:
            stmt = select(CodeGroups).where(CodeGroups.id == data.parent_group_id)
            result = await db.execute(stmt)
            if not result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="상위 그룹을 찾을 수 없습니다",
                )

        # Create code group
        code_group = CodeGroups(
            code=data.code,
            name=data.name,
            description=data.description,
            parent_group_id=data.parent_group_id,
            level=data.level,
            sort_order=data.sort_order,
            is_active=data.is_active,
            is_deleted=data.is_deleted,
            created_by=created_by,
        )

        db.add(code_group)
        await db.commit()
        await db.refresh(code_group)

        return CodeGroupsResponse.model_validate(code_group)

    @staticmethod
    async def get_by_id(db: AsyncSession, code_group_id: UUID) -> CodeGroupsResponse:
        """Get code group by ID."""
        stmt = select(CodeGroups).where(CodeGroups.id == code_group_id)
        result = await db.execute(stmt)
        code_group = result.scalar_one_or_none()

        if not code_group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="코드 그룹을 찾을 수 없습니다",
            )

        return CodeGroupsResponse.model_validate(code_group)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        is_active: bool | None = None,
        is_deleted: bool | None = False,
        search: str | None = None,
    ) -> CodeGroupsListResponse:
        """Get code group list with pagination and filters."""
        # Base query
        stmt = select(CodeGroups)

        # Apply filters
        if is_active is not None:
            stmt = stmt.where(CodeGroups.is_active == is_active)
        if is_deleted is not None:
            stmt = stmt.where(CodeGroups.is_deleted == is_deleted)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                (CodeGroups.code.ilike(search_pattern))
                | (CodeGroups.name.ilike(search_pattern))
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
        code_groups = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return CodeGroupsListResponse(
            items=[CodeGroupsResponse.model_validate(cg) for cg in code_groups],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, code_group_id: UUID, data: CodeGroupsUpdate, updated_by: UUID | None = None
    ) -> CodeGroupsResponse:
        """Update code group."""
        stmt = select(CodeGroups).where(CodeGroups.id == code_group_id)
        result = await db.execute(stmt)
        code_group = result.scalar_one_or_none()

        if not code_group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="코드 그룹을 찾을 수 없습니다",
            )

        # Check if parent group exists if being changed
        if data.parent_group_id and data.parent_group_id != code_group.parent_group_id:
            stmt = select(CodeGroups).where(CodeGroups.id == data.parent_group_id)
            result = await db.execute(stmt)
            if not result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="상위 그룹을 찾을 수 없습니다",
                )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(code_group, field, value)

        code_group.updated_by = updated_by
        code_group.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(code_group)

        return CodeGroupsResponse.model_validate(code_group)

    @staticmethod
    async def delete(db: AsyncSession, code_group_id: UUID, deleted_by: UUID | None = None) -> None:
        """Soft delete code group."""
        stmt = select(CodeGroups).where(CodeGroups.id == code_group_id)
        result = await db.execute(stmt)
        code_group = result.scalar_one_or_none()

        if not code_group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="코드 그룹을 찾을 수 없습니다",
            )

        # Soft delete
        code_group.is_deleted = True
        code_group.updated_by = deleted_by
        code_group.updated_at = datetime.now(timezone.utc)

        await db.commit()
