"""Currencies service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.adm import Currencies

from .schemas import CurrenciesCreate, CurrenciesListResponse, CurrenciesResponse, CurrenciesUpdate


class CurrenciesService:
    """Currencies service class."""

    @staticmethod
    async def create(db: AsyncSession, data: CurrenciesCreate, created_by: UUID | None = None) -> CurrenciesResponse:
        """Create a new currency."""
        # Check if currency code already exists
        stmt = select(Currencies).where(Currencies.code == data.code)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 통화 코드입니다",
            )

        # Create currency
        currency = Currencies(
            code=data.code,
            name=data.name,
            name_en=data.name_en,
            symbol=data.symbol,
            decimal_places=data.decimal_places,
            is_active=data.is_active,
            is_base_currency=data.is_base_currency,
            created_by=created_by,
        )

        db.add(currency)
        await db.commit()
        await db.refresh(currency)

        return CurrenciesResponse.model_validate(currency)

    @staticmethod
    async def get_by_id(db: AsyncSession, currency_id: UUID) -> CurrenciesResponse:
        """Get currency by ID."""
        stmt = select(Currencies).where(Currencies.id == currency_id)
        result = await db.execute(stmt)
        currency = result.scalar_one_or_none()

        if not currency:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="통화를 찾을 수 없습니다",
            )

        return CurrenciesResponse.model_validate(currency)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        is_active: bool | None = None,
        search: str | None = None,
    ) -> CurrenciesListResponse:
        """Get currency list with pagination and filters."""
        # Base query
        stmt = select(Currencies)

        # Apply filters
        if is_active is not None:
            stmt = stmt.where(Currencies.is_active == is_active)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                (Currencies.code.ilike(search_pattern))
                | (Currencies.name.ilike(search_pattern))
                | (Currencies.name_en.ilike(search_pattern))
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
        currencies = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return CurrenciesListResponse(
            items=[CurrenciesResponse.model_validate(currency) for currency in currencies],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, currency_id: UUID, data: CurrenciesUpdate, updated_by: UUID | None = None
    ) -> CurrenciesResponse:
        """Update currency."""
        stmt = select(Currencies).where(Currencies.id == currency_id)
        result = await db.execute(stmt)
        currency = result.scalar_one_or_none()

        if not currency:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="통화를 찾을 수 없습니다",
            )

        # Check if code is being changed and if new code already exists
        if data.code and data.code != currency.code:
            stmt = select(Currencies).where(Currencies.code == data.code)
            result = await db.execute(stmt)
            if result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="이미 존재하는 통화 코드입니다",
                )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(currency, field, value)

        currency.updated_by = updated_by
        currency.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(currency)

        return CurrenciesResponse.model_validate(currency)

    @staticmethod
    async def delete(db: AsyncSession, currency_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete currency."""
        stmt = select(Currencies).where(Currencies.id == currency_id)
        result = await db.execute(stmt)
        currency = result.scalar_one_or_none()

        if not currency:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="통화를 찾을 수 없습니다",
            )

        await db.delete(currency)
        await db.commit()
