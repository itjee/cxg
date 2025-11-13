"""User service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import get_password_hash, verify_password
from src.models.manager.idam import User

from .schemas import UserCreate, UserListResponse, UserResponse, UserUpdate


class UserService:
    """User service class."""

    @staticmethod
    async def create(db: AsyncSession, data: UserCreate, created_by: UUID | None = None) -> UserResponse:
        """Create a new user."""
        # Check if username already exists
        stmt = select(User).where(User.username == data.username)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 사용자명입니다",
            )

        # Check if email already exists
        stmt = select(User).where(User.email == data.email)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 이메일입니다",
            )

        # Create user
        hashed_password = get_password_hash(data.password)
        user = User(
            full_name=data.full_name,
            email=data.email,
            phone=data.phone,
            username=data.username,
            password=hashed_password,
            user_type=data.user_type,
            mfa_enabled=data.mfa_enabled,
            status="ACTIVE",
            created_by=created_by,
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return UserResponse.model_validate(user)

    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: UUID) -> UserResponse:
        """Get user by ID."""
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="사용자를 찾을 수 없습니다",
            )

        return UserResponse.model_validate(user)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        status_filter: str | None = None,
        user_type_filter: str | None = None,
        search: str | None = None,
    ) -> UserListResponse:
        """Get user list with pagination and filters."""
        # Base query
        stmt = select(User).where(User.is_active == True)

        # Apply filters
        if status_filter:
            stmt = stmt.where(User.status == status_filter)
        if user_type_filter:
            stmt = stmt.where(User.user_type == user_type_filter)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                (User.username.ilike(search_pattern))
                | (User.full_name.ilike(search_pattern))
                | (User.email.ilike(search_pattern))
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
        users = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return UserListResponse(
            items=[UserResponse.model_validate(user) for user in users],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, user_id: UUID, data: UserUpdate, updated_by: UUID | None = None
    ) -> UserResponse:
        """Update user."""
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="사용자를 찾을 수 없습니다",
            )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        user.updated_by = updated_by
        user.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(user)

        return UserResponse.model_validate(user)

    @staticmethod
    async def delete(db: AsyncSession, user_id: UUID, deleted_by: UUID | None = None) -> None:
        """Soft delete user."""
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="사용자를 찾을 수 없습니다",
            )

        # Soft delete
        user.is_active = False
        user.updated_by = deleted_by
        user.updated_at = datetime.now(timezone.utc)

        await db.commit()

    @staticmethod
    async def change_status(
        db: AsyncSession, user_id: UUID, new_status: str, updated_by: UUID | None = None
    ) -> UserResponse:
        """Change user status."""
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="사용자를 찾을 수 없습니다",
            )

        user.status = new_status
        user.updated_by = updated_by
        user.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(user)

        return UserResponse.model_validate(user)
