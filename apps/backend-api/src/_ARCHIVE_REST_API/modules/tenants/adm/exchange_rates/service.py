"""ExchangeRates service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.adm import ExchangeRates

from .schemas import ExchangeRatesCreate, ExchangeRatesListResponse, ExchangeRatesResponse, ExchangeRatesUpdate


class ExchangeRatesService:
    """ExchangeRates service class."""

    @staticmethod
    async def create(db: AsyncSession, data: ExchangeRatesCreate, created_by: UUID | None = None) -> ExchangeRatesResponse:
        """Create a new exchange rate."""
        # Create exchange rate
        exchange_rate = ExchangeRates(
            from_currency=data.from_currency,
            to_currency=data.to_currency,
            rate=data.rate,
            rate_date=data.rate_date,
            source=data.source,
            rate_type=data.rate_type,
            created_by=created_by,
        )

        db.add(exchange_rate)
        await db.commit()
        await db.refresh(exchange_rate)

        return ExchangeRatesResponse.model_validate(exchange_rate)

    @staticmethod
    async def get_by_id(db: AsyncSession, exchange_rate_id: UUID) -> ExchangeRatesResponse:
        """Get exchange rate by ID."""
        stmt = select(ExchangeRates).where(ExchangeRates.id == exchange_rate_id)
        result = await db.execute(stmt)
        exchange_rate = result.scalar_one_or_none()

        if not exchange_rate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="환율을 찾을 수 없습니다",
            )

        return ExchangeRatesResponse.model_validate(exchange_rate)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        from_currency: str | None = None,
        to_currency: str | None = None,
        rate_type: str | None = None,
    ) -> ExchangeRatesListResponse:
        """Get exchange rate list with pagination and filters."""
        # Base query
        stmt = select(ExchangeRates)

        # Apply filters
        if from_currency:
            stmt = stmt.where(ExchangeRates.from_currency == from_currency)
        if to_currency:
            stmt = stmt.where(ExchangeRates.to_currency == to_currency)
        if rate_type:
            stmt = stmt.where(ExchangeRates.rate_type == rate_type)

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Apply pagination
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        # Execute query
        result = await db.execute(stmt)
        exchange_rates = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return ExchangeRatesListResponse(
            items=[ExchangeRatesResponse.model_validate(er) for er in exchange_rates],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, exchange_rate_id: UUID, data: ExchangeRatesUpdate, updated_by: UUID | None = None
    ) -> ExchangeRatesResponse:
        """Update exchange rate."""
        stmt = select(ExchangeRates).where(ExchangeRates.id == exchange_rate_id)
        result = await db.execute(stmt)
        exchange_rate = result.scalar_one_or_none()

        if not exchange_rate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="환율을 찾을 수 없습니다",
            )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(exchange_rate, field, value)

        exchange_rate.updated_by = updated_by
        exchange_rate.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(exchange_rate)

        return ExchangeRatesResponse.model_validate(exchange_rate)

    @staticmethod
    async def delete(db: AsyncSession, exchange_rate_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete exchange rate."""
        stmt = select(ExchangeRates).where(ExchangeRates.id == exchange_rate_id)
        result = await db.execute(stmt)
        exchange_rate = result.scalar_one_or_none()

        if not exchange_rate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="환율을 찾을 수 없습니다",
            )

        await db.delete(exchange_rate)
        await db.commit()
