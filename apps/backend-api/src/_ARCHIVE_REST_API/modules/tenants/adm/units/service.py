"""Units service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.adm import Units

from .schemas import UnitsCreate, UnitsListResponse, UnitsResponse, UnitsUpdate


class UnitsService:
    """Units service class."""

    @staticmethod
    async def create(db: AsyncSession, data: UnitsCreate, created_by: UUID | None = None) -> UnitsResponse:
        """Create a new unit."""
        # Check if base unit exists if specified
        if data.base_unit_id:
            stmt = select(Units).where(Units.id == data.base_unit_id)
            result = await db.execute(stmt)
            if not result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="기준 단위를 찾을 수 없습니다",
                )

        # Create unit
        unit = Units(
            code=data.code,
            name=data.name,
            name_en=data.name_en,
            unit_type=data.unit_type,
            symbol=data.symbol,
            base_unit_id=data.base_unit_id,
            conversion_rate=data.conversion_rate,
            is_active=data.is_active,
            is_base_unit=data.is_base_unit,
            created_by=created_by,
        )

        db.add(unit)
        await db.commit()
        await db.refresh(unit)

        return UnitsResponse.model_validate(unit)

    @staticmethod
    async def get_by_id(db: AsyncSession, unit_id: UUID) -> UnitsResponse:
        """Get unit by ID."""
        stmt = select(Units).where(Units.id == unit_id)
        result = await db.execute(stmt)
        unit = result.scalar_one_or_none()

        if not unit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="단위를 찾을 수 없습니다",
            )

        return UnitsResponse.model_validate(unit)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        unit_type: str | None = None,
        is_active: bool | None = None,
        search: str | None = None,
    ) -> UnitsListResponse:
        """Get unit list with pagination and filters."""
        # Base query
        stmt = select(Units)

        # Apply filters
        if unit_type:
            stmt = stmt.where(Units.unit_type == unit_type)
        if is_active is not None:
            stmt = stmt.where(Units.is_active == is_active)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                (Units.code.ilike(search_pattern))
                | (Units.name.ilike(search_pattern))
                | (Units.name_en.ilike(search_pattern))
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
        units = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return UnitsListResponse(
            items=[UnitsResponse.model_validate(unit) for unit in units],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, unit_id: UUID, data: UnitsUpdate, updated_by: UUID | None = None
    ) -> UnitsResponse:
        """Update unit."""
        stmt = select(Units).where(Units.id == unit_id)
        result = await db.execute(stmt)
        unit = result.scalar_one_or_none()

        if not unit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="단위를 찾을 수 없습니다",
            )

        # Check if base unit exists if being changed
        if data.base_unit_id and data.base_unit_id != unit.base_unit_id:
            stmt = select(Units).where(Units.id == data.base_unit_id)
            result = await db.execute(stmt)
            if not result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="기준 단위를 찾을 수 없습니다",
                )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(unit, field, value)

        unit.updated_by = updated_by
        unit.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(unit)

        return UnitsResponse.model_validate(unit)

    @staticmethod
    async def delete(db: AsyncSession, unit_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete unit."""
        stmt = select(Units).where(Units.id == unit_id)
        result = await db.execute(stmt)
        unit = result.scalar_one_or_none()

        if not unit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="단위를 찾을 수 없습니다",
            )

        await db.delete(unit)
        await db.commit()
