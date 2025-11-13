"""PaymentTerms service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.adm import PaymentTerms

from .schemas import PaymentTermsCreate, PaymentTermsListResponse, PaymentTermsResponse, PaymentTermsUpdate


class PaymentTermsService:
    """PaymentTerms service class."""

    @staticmethod
    async def create(db: AsyncSession, data: PaymentTermsCreate, created_by: UUID | None = None) -> PaymentTermsResponse:
        """Create a new payment term."""
        # Create payment term
        payment_term = PaymentTerms(
            code=data.code,
            name=data.name,
            description=data.description,
            days_to_pay=data.days_to_pay,
            is_cash_on_delivery=data.is_cash_on_delivery,
            is_active=data.is_active,
            is_deleted=data.is_deleted,
            created_by=created_by,
        )

        db.add(payment_term)
        await db.commit()
        await db.refresh(payment_term)

        return PaymentTermsResponse.model_validate(payment_term)

    @staticmethod
    async def get_by_id(db: AsyncSession, payment_term_id: UUID) -> PaymentTermsResponse:
        """Get payment term by ID."""
        stmt = select(PaymentTerms).where(PaymentTerms.id == payment_term_id)
        result = await db.execute(stmt)
        payment_term = result.scalar_one_or_none()

        if not payment_term:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="결제 조건을 찾을 수 없습니다",
            )

        return PaymentTermsResponse.model_validate(payment_term)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        is_active: bool | None = None,
        is_deleted: bool | None = False,
        search: str | None = None,
    ) -> PaymentTermsListResponse:
        """Get payment term list with pagination and filters."""
        # Base query
        stmt = select(PaymentTerms)

        # Apply filters
        if is_active is not None:
            stmt = stmt.where(PaymentTerms.is_active == is_active)
        if is_deleted is not None:
            stmt = stmt.where(PaymentTerms.is_deleted == is_deleted)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                (PaymentTerms.code.ilike(search_pattern))
                | (PaymentTerms.name.ilike(search_pattern))
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
        payment_terms = result.scalars().all()

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return PaymentTermsListResponse(
            items=[PaymentTermsResponse.model_validate(pt) for pt in payment_terms],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, payment_term_id: UUID, data: PaymentTermsUpdate, updated_by: UUID | None = None
    ) -> PaymentTermsResponse:
        """Update payment term."""
        stmt = select(PaymentTerms).where(PaymentTerms.id == payment_term_id)
        result = await db.execute(stmt)
        payment_term = result.scalar_one_or_none()

        if not payment_term:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="결제 조건을 찾을 수 없습니다",
            )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(payment_term, field, value)

        payment_term.updated_by = updated_by
        payment_term.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(payment_term)

        return PaymentTermsResponse.model_validate(payment_term)

    @staticmethod
    async def delete(db: AsyncSession, payment_term_id: UUID, deleted_by: UUID | None = None) -> None:
        """Soft delete payment term."""
        stmt = select(PaymentTerms).where(PaymentTerms.id == payment_term_id)
        result = await db.execute(stmt)
        payment_term = result.scalar_one_or_none()

        if not payment_term:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="결제 조건을 찾을 수 없습니다",
            )

        # Soft delete
        payment_term.is_deleted = True
        payment_term.updated_by = deleted_by
        payment_term.updated_at = datetime.now(timezone.utc)

        await db.commit()
