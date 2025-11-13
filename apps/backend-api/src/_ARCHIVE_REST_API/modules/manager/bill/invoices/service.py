"""청구서 모듈 서비스 계층 (비즈니스 로직)"""

from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.bill import Invoice

from .schemas import (
    InvoiceCreate,
    InvoiceListResponse,
    InvoiceResponse,
    InvoiceUpdate,
)


class InvoiceService:
    """청구서 서비스 (비즈니스 로직)

    CRUD 작업 및 복잡한 비즈니스 로직을 처리합니다.
    """

    @staticmethod
    async def create(
        db: AsyncSession,
        data: InvoiceCreate,
        created_by: UUID | None = None,
    ) -> InvoiceResponse:
        """청구서 생성

        Args:
            db: 데이터베이스 세션
            data: 생성 요청 데이터
            created_by: 생성자 ID (감사)

        Returns:
            InvoiceResponse: 생성된 청구서

        Raises:
            HTTPException: 금액 검증 실패 시 400 Bad Request
        """
        # 1단계: 비즈니스 로직 검증 - 금액 일치 확인
        expected_total = data.base_amount + data.usage_amount - data.discount_amount + data.tax_amount
        if expected_total != data.total_amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="금액 계산이 맞지 않습니다",
                headers={
                    "X-Validation-Error": "amount_mismatch",
                    "X-Expected-Total": str(expected_total),
                    "X-Provided-Total": str(data.total_amount),
                },
            )

        # 2단계: 모델 인스턴스 생성
        invoice = Invoice(
            **data.model_dump(),
            created_by=created_by,
        )

        # 3단계: 데이터베이스 저장
        db.add(invoice)
        await db.commit()
        await db.refresh(invoice)

        # 4단계: Pydantic 스키마로 변환하여 반환
        return InvoiceResponse.model_validate(invoice)

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        invoice_id: UUID,
    ) -> InvoiceResponse:
        """청구서 단건 조회

        Args:
            db: 데이터베이스 세션
            invoice_id: 청구서 ID

        Returns:
            InvoiceResponse: 청구서 정보

        Raises:
            HTTPException: 데이터 없음 시 404 Not Found
        """
        stmt = select(Invoice).where(
            and_(
                Invoice.id == invoice_id,
                Invoice.deleted == False,
            )
        )
        result = await db.execute(stmt)
        invoice = result.scalar_one_or_none()

        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="청구서를 찾을 수 없습니다",
            )

        return InvoiceResponse.model_validate(invoice)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        search: str | None = None,
        status: str | None = None,
        tenant_id: UUID | None = None,
        payment_method: str | None = None,
    ) -> InvoiceListResponse:
        """청구서 목록 조회 (페이지네이션 및 필터링)

        Args:
            db: 데이터베이스 세션
            page: 페이지 번호 (1부터 시작)
            page_size: 페이지 크기
            search: 검색어 (청구서 번호 또는 테넌트명 검색)
            status: 상태 필터 (PENDING, SENT, PAID, OVERDUE, CANCELED)
            tenant_id: 테넌트 ID 필터
            payment_method: 결제 수단 필터

        Returns:
            InvoiceListResponse: 청구서 목록 및 페이지 정보

        Raises:
            HTTPException: 페이지 범위 초과 시
        """
        # 1단계: 기본 쿼리 (논리적 삭제 제외)
        stmt = select(Invoice).where(Invoice.deleted == False)

        # 2단계: 필터 조건 추가
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(Invoice.invoice_no.ilike(search_pattern))

        if status:
            stmt = stmt.where(Invoice.status == status)

        if tenant_id:
            stmt = stmt.where(Invoice.tenant_id == tenant_id)

        if payment_method:
            stmt = stmt.where(Invoice.payment_method == payment_method)

        # 3단계: 전체 개수 조회 (페이지 정보 계산용)
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # 4단계: 페이지네이션 적용 (정렬: 최신순)
        offset = (page - 1) * page_size
        stmt = (
            stmt.order_by(Invoice.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )

        # 5단계: 데이터 조회
        result = await db.execute(stmt)
        invoices = result.scalars().all()

        # 6단계: 응답 구성
        total_pages = (total + page_size - 1) // page_size
        return InvoiceListResponse(
            items=[InvoiceResponse.model_validate(invoice) for invoice in invoices],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession,
        invoice_id: UUID,
        data: InvoiceUpdate,
        updated_by: UUID | None = None,
    ) -> InvoiceResponse:
        """청구서 수정

        Args:
            db: 데이터베이스 세션
            invoice_id: 청구서 ID
            data: 수정 요청 데이터 (모든 필드 선택사항)
            updated_by: 수정자 ID (감사)

        Returns:
            InvoiceResponse: 수정된 청구서

        Raises:
            HTTPException: 데이터 없음 시 404, 금액 검증 실패 시 400
        """
        # 1단계: 기존 데이터 조회
        stmt = select(Invoice).where(
            and_(
                Invoice.id == invoice_id,
                Invoice.deleted == False,
            )
        )
        result = await db.execute(stmt)
        invoice = result.scalar_one_or_none()

        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="청구서를 찾을 수 없습니다",
            )

        # 2단계: 제공된 필드만 업데이트
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(invoice, field, value)

        # 3단계: 금액 재계산 검증 (필요한 경우)
        if any(k in update_data for k in ["base_amount", "usage_amount", "discount_amount", "tax_amount", "total_amount"]):
            expected_total = (
                invoice.base_amount
                + invoice.usage_amount
                - invoice.discount_amount
                + invoice.tax_amount
            )
            if expected_total != invoice.total_amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="금액 계산이 맞지 않습니다",
                )

        # 4단계: 감사 정보 업데이트
        invoice.updated_by = updated_by
        invoice.updated_at = datetime.now(timezone.utc)

        # 5단계: 저장
        await db.commit()
        await db.refresh(invoice)

        return InvoiceResponse.model_validate(invoice)

    @staticmethod
    async def delete(
        db: AsyncSession,
        invoice_id: UUID,
        deleted_by: UUID | None = None,
    ) -> None:
        """청구서 소프트 삭제

        논리적 삭제 (데이터는 유지, 삭제 플래그만 변경)

        Args:
            db: 데이터베이스 세션
            invoice_id: 청구서 ID
            deleted_by: 삭제자 ID (감사)

        Raises:
            HTTPException: 데이터 없음 시 404 Not Found
        """
        # 1단계: 데이터 조회
        stmt = select(Invoice).where(
            and_(
                Invoice.id == invoice_id,
                Invoice.deleted == False,
            )
        )
        result = await db.execute(stmt)
        invoice = result.scalar_one_or_none()

        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="청구서를 찾을 수 없습니다",
            )

        # 2단계: 소프트 삭제 처리
        invoice.deleted = True
        invoice.updated_by = deleted_by
        invoice.updated_at = datetime.now(timezone.utc)

        # 3단계: 저장
        await db.commit()
