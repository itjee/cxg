"""Service Requests service for business logic."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.asm import ServiceRequests

from .schemas import ServiceRequestsCreate, ServiceRequestsListResponse, ServiceRequestsResponse, ServiceRequestsUpdate


class ServiceRequestsService:
    """Service Requests service class."""

    @staticmethod
    async def create(db: AsyncSession, data: ServiceRequestsCreate, created_by: UUID | None = None) -> ServiceRequestsResponse:
        """Create a new service request."""
        service_request = ServiceRequests(
            sr_code=data.sr_code,
            customer_id=data.customer_id,
            product_id=data.product_id,
            serial_number=data.serial_number,
            purchase_date=data.purchase_date,
            warranty_end_date=data.warranty_end_date,
            is_warranty=data.is_warranty,
            issue_description=data.issue_description,
            issue_category=data.issue_category,
            service_type=data.service_type,
            priority=data.priority,
            status=data.status,
            assigned_technician_id=data.assigned_technician_id,
            scheduled_date=data.scheduled_date,
            expected_completion_date=data.expected_completion_date,
            estimated_cost=data.estimated_cost,
            actual_cost=data.actual_cost,
            currency=data.currency,
            customer_notes=data.customer_notes,
            technician_notes=data.technician_notes,
            created_by=created_by,
        )

        db.add(service_request)
        await db.commit()
        await db.refresh(service_request)

        return ServiceRequestsResponse.model_validate(service_request)

    @staticmethod
    async def get_by_id(db: AsyncSession, service_request_id: UUID) -> ServiceRequestsResponse:
        """Get service request by ID."""
        stmt = select(ServiceRequests).where(ServiceRequests.id == service_request_id)
        result = await db.execute(stmt)
        service_request = result.scalar_one_or_none()

        if not service_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="A/S 요청을 찾을 수 없습니다",
            )

        return ServiceRequestsResponse.model_validate(service_request)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        status: str | None = None,
        priority: str | None = None,
        customer_id: UUID | None = None,
    ) -> ServiceRequestsListResponse:
        """Get service request list with pagination and filters."""
        stmt = select(ServiceRequests)

        if status:
            stmt = stmt.where(ServiceRequests.status == status)
        if priority:
            stmt = stmt.where(ServiceRequests.priority == priority)
        if customer_id:
            stmt = stmt.where(ServiceRequests.customer_id == customer_id)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        service_requests = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return ServiceRequestsListResponse(
            items=[ServiceRequestsResponse.model_validate(sr) for sr in service_requests],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, service_request_id: UUID, data: ServiceRequestsUpdate, updated_by: UUID | None = None
    ) -> ServiceRequestsResponse:
        """Update service request."""
        stmt = select(ServiceRequests).where(ServiceRequests.id == service_request_id)
        result = await db.execute(stmt)
        service_request = result.scalar_one_or_none()

        if not service_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="A/S 요청을 찾을 수 없습니다",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(service_request, field, value)

        service_request.updated_by = updated_by
        service_request.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(service_request)

        return ServiceRequestsResponse.model_validate(service_request)

    @staticmethod
    async def delete(db: AsyncSession, service_request_id: UUID, deleted_by: UUID | None = None) -> None:
        """Delete service request."""
        stmt = select(ServiceRequests).where(ServiceRequests.id == service_request_id)
        result = await db.execute(stmt)
        service_request = result.scalar_one_or_none()

        if not service_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="A/S 요청을 찾을 수 없습니다",
            )

        await db.delete(service_request)
        await db.commit()
