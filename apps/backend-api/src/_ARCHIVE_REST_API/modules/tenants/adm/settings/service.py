"""Settings service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.adm import Settings

from .schemas import SettingsCreate, SettingsListResponse, SettingsResponse, SettingsUpdate


class SettingsService:
    """Settings service class."""

    @staticmethod
    async def create(db: AsyncSession, data: SettingsCreate, created_by: UUID | None = None) -> SettingsResponse:
        """Create a new setting."""
        # Create setting
        setting = Settings(
            key=data.key,
            value=data.value,
            value_type=data.value_type,
            default_value=data.default_value,
            description=data.description,
            category=data.category,
            is_active=data.is_active,
            is_system=data.is_system,
            is_encrypted=data.is_encrypted,
            created_by=created_by,
        )

        db.add(setting)
        await db.commit()
        await db.refresh(setting)

        return SettingsResponse.model_validate(setting)

    @staticmethod
    async def get_by_id(db: AsyncSession, setting_id: UUID) -> SettingsResponse:
        """Get setting by ID."""
        stmt = select(Settings).where(Settings.id == setting_id)
        result = await db.execute(stmt)
        setting = result.scalar_one_or_none()

        if not setting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="설정을 찾을 수 없습니다",
            )

        return SettingsResponse.model_validate(setting)

    @staticmethod
    async def get_by_key(db: AsyncSession, key: str) -> SettingsResponse:
        """Get setting by key."""
        stmt = select(Settings).where(Settings.key == key)
        result = await db.execute(stmt)
        setting = result.scalar_one_or_none()

        if not setting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="설정을 찾을 수 없습니다",
            )

        return SettingsResponse.model_validate(setting)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        category: str | None = None,
        is_active: bool | None = None,
        search: str | None = None,
    ) -> SettingsListResponse:
        """Get setting list with pagination and filters."""
        # Base query
        stmt = select(Settings)

        # Apply filters
        if category:
            stmt = stmt.where(Settings.category == category)
        if is_active is not None:
            stmt = stmt.where(Settings.is_active == is_active)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                (Settings.key.ilike(search_pattern))
                | (Settings.description.ilike(search_pattern))
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
        settings = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return SettingsListResponse(
            items=[SettingsResponse.model_validate(s) for s in settings],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, setting_id: UUID, data: SettingsUpdate, updated_by: UUID | None = None
    ) -> SettingsResponse:
        """Update setting."""
        stmt = select(Settings).where(Settings.id == setting_id)
        result = await db.execute(stmt)
        setting = result.scalar_one_or_none()

        if not setting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="설정을 찾을 수 없습니다",
            )

        # Check if setting is system setting (cannot be updated)
        if setting.is_system:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="시스템 설정은 수정할 수 없습니다",
            )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(setting, field, value)

        setting.updated_by = updated_by
        setting.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(setting)

        return SettingsResponse.model_validate(setting)

    @staticmethod
    async def delete(db: AsyncSession, setting_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete setting."""
        stmt = select(Settings).where(Settings.id == setting_id)
        result = await db.execute(stmt)
        setting = result.scalar_one_or_none()

        if not setting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="설정을 찾을 수 없습니다",
            )

        # Check if setting is system setting (cannot be deleted)
        if setting.is_system:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="시스템 설정은 삭제할 수 없습니다",
            )

        await db.delete(setting)
        await db.commit()
