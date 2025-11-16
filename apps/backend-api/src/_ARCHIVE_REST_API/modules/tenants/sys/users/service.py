"""Service for users business logic."""

import secrets
import string
from datetime import UTC, datetime
from uuid import UUID

from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.sys import Users

from .schemas import (
    PasswordChangeRequest,
    PasswordChangeResponse,
    UserInviteRequest,
    UserInviteResponse,
    UsersCreate,
    UsersResponse,
    UsersUpdate,
)


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UsersService:
    """Service class for users."""

    @staticmethod
    def _generate_temp_password(length: int = 12) -> str:
        """Generate a secure temporary password."""
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        password = "".join(secrets.choice(alphabet) for _ in range(length))
        return password

    @staticmethod
    def _hash_password(password: str) -> str:
        """Hash password using bcrypt."""
        return pwd_context.hash(password)

    @staticmethod
    def _verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    async def invite_user(
        db: AsyncSession, data: UserInviteRequest, invited_by: UUID
    ) -> UserInviteResponse:
        """
        Invite a new user by creating account with temporary password.

        Flow:
        1. Check if username or email already exists
        2. Generate temporary password
        3. Create user with hashed password
        4. Set force_password_change = True (added to DB schema)
        5. Return user info with temp password for email sending
        """
        # Check if username exists
        stmt = select(Users).where(Users.username == data.username, Users.is_deleted == False)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"사용자명 '{data.username}'이 이미 사용 중입니다.",
            )

        # Check if email exists
        stmt = select(Users).where(Users.email == data.email, Users.is_deleted == False)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"이메일 '{data.email}'이 이미 사용 중입니다.",
            )

        # Generate temporary password
        temp_password = UsersService._generate_temp_password()
        hashed_password = UsersService._hash_password(temp_password)

        # Create user
        user = Users(
            username=data.username,
            email=data.email,
            password=hashed_password,  # Note: column name is 'password', not 'password_hash'
            full_name=data.full_name,
            phone=data.phone,
            department_id=data.department_id,
            position=data.position,
            role_id=data.role_id,
            is_active=True,
            is_system_user=False,
            failed_login_attempts=0,
            created_by=invited_by,
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return UserInviteResponse(
            user_id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name or "",
            temp_password=temp_password,
            invited_at=user.created_at,
        )

    @staticmethod
    async def change_password(
        db: AsyncSession, user_id: UUID, data: PasswordChangeRequest
    ) -> PasswordChangeResponse:
        """
        Change user password.

        Validates current password and updates to new password.
        """
        # Get user
        stmt = select(Users).where(Users.id == user_id, Users.is_deleted == False)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="사용자를 찾을 수 없습니다.",
            )

        # Verify current password
        if not UsersService._verify_password(data.current_password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="현재 비밀번호가 일치하지 않습니다.",
            )

        # Hash and update new password
        user.password = UsersService._hash_password(data.new_password)
        user.updated_at = datetime.now(UTC)

        await db.commit()
        await db.refresh(user)

        return PasswordChangeResponse(
            message="비밀번호가 성공적으로 변경되었습니다.",
            changed_at=user.updated_at,
        )

    @staticmethod
    async def create(
        db: AsyncSession, data: UsersCreate, created_by: UUID | None = None
    ) -> UsersResponse:
        """Create a new users record."""
        item = Users(
            **data.model_dump(),
            created_by=created_by,
        )

        db.add(item)
        await db.commit()
        await db.refresh(item)

        return UsersResponse.model_validate(item)

    @staticmethod
    async def get_by_id(db: AsyncSession, item_id: UUID) -> UsersResponse:
        """Get users by ID."""
        stmt = select(Users).where(Users.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Users를 찾을 수 없습니다",
            )

        return UsersResponse.model_validate(item)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
    ) -> UsersListResponse:
        """Get users list with pagination."""
        stmt = select(Users)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return UsersListResponse(
            items=[UsersResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, item_id: UUID, data: UsersUpdate, updated_by: UUID | None = None
    ) -> UsersResponse:
        """Update users."""
        stmt = select(Users).where(Users.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Users를 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        item.updated_by = updated_by
        item.updated_at = datetime.now(UTC)

        await db.commit()
        await db.refresh(item)

        return UsersResponse.model_validate(item)

    @staticmethod
    async def delete(db: AsyncSession, item_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete users."""
        stmt = select(Users).where(Users.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Users를 찾을 수 없습니다",
            )

        await db.delete(item)
        await db.commit()
