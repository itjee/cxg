"""거래(결제) 모듈 서비스 계층 (비즈니스 로직)"""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.bill import Transaction

from .schemas import (
    TransactionCreate,
    TransactionListResponse,
    TransactionResponse,
    TransactionUpdate,
)


class TransactionService:
    """거래(결제) 서비스 (비즈니스 로직)

    CRUD 작업 및 복잡한 비즈니스 로직을 처리합니다.
    """

    @staticmethod
    async def create(
        db: AsyncSession,
        data: TransactionCreate,
        created_by: UUID | None = None,
    ) -> TransactionResponse:
        """거래 생성

        Args:
            db: 데이터베이스 세션
            data: 생성 요청 데이터
            created_by: 생성자 ID (감사)

        Returns:
            TransactionResponse: 생성된 거래

        Raises:
            HTTPException: 거래 번호 중복 시 409 Conflict
        """
        # 1단계: 거래 번호 중복 확인
        stmt = select(Transaction).where(
            and_(
                Transaction.transaction_no == data.transaction_no,
                Transaction.deleted == False,
            )
        )
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="이미 존재하는 거래 번호입니다",
            )

        # 2단계: 모델 인스턴스 생성
        transaction = Transaction(
            **data.model_dump(),
            created_by=created_by,
        )

        # 3단계: 데이터베이스 저장
        db.add(transaction)
        await db.commit()
        await db.refresh(transaction)

        # 4단계: Pydantic 스키마로 변환하여 반환
        return TransactionResponse.model_validate(transaction)

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        transaction_id: UUID,
    ) -> TransactionResponse:
        """거래 단건 조회

        Args:
            db: 데이터베이스 세션
            transaction_id: 거래 ID

        Returns:
            TransactionResponse: 거래 정보

        Raises:
            HTTPException: 데이터 없음 시 404 Not Found
        """
        stmt = select(Transaction).where(
            and_(
                Transaction.id == transaction_id,
                Transaction.deleted == False,
            )
        )
        result = await db.execute(stmt)
        transaction = result.scalar_one_or_none()

        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="거래를 찾을 수 없습니다",
            )

        return TransactionResponse.model_validate(transaction)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        search: str | None = None,
        status: str | None = None,
        tenant_id: UUID | None = None,
        transaction_type: str | None = None,
        payment_gateway: str | None = None,
    ) -> TransactionListResponse:
        """거래 목록 조회 (페이지네이션 및 필터링)

        Args:
            db: 데이터베이스 세션
            page: 페이지 번호 (1부터 시작)
            page_size: 페이지 크기
            search: 검색어 (거래 번호)
            status: 상태 필터 (PENDING, SUCCESS, FAILED, CANCELED)
            tenant_id: 테넌트 ID 필터
            transaction_type: 거래 유형 필터 (PAYMENT, REFUND, CHARGEBACK)
            payment_gateway: 결제 게이트웨이 필터

        Returns:
            TransactionListResponse: 거래 목록 및 페이지 정보
        """
        # 1단계: 기본 쿼리 (논리적 삭제 제외)
        stmt = select(Transaction).where(Transaction.deleted == False)

        # 2단계: 필터 조건 추가
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(Transaction.transaction_no.ilike(search_pattern))

        if status:
            stmt = stmt.where(Transaction.status == status)

        if tenant_id:
            stmt = stmt.where(Transaction.tenant_id == tenant_id)

        if transaction_type:
            stmt = stmt.where(Transaction.transaction_type == transaction_type)

        if payment_gateway:
            stmt = stmt.where(Transaction.payment_gateway == payment_gateway)

        # 3단계: 전체 개수 조회 (페이지 정보 계산용)
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # 4단계: 페이지네이션 적용 (정렬: 최신순)
        offset = (page - 1) * page_size
        stmt = (
            stmt.order_by(Transaction.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )

        # 5단계: 데이터 조회
        result = await db.execute(stmt)
        transactions = result.scalars().all()

        # 6단계: 응답 구성
        total_pages = (total + page_size - 1) // page_size
        return TransactionListResponse(
            items=[TransactionResponse.model_validate(tx) for tx in transactions],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession,
        transaction_id: UUID,
        data: TransactionUpdate,
        updated_by: UUID | None = None,
    ) -> TransactionResponse:
        """거래 수정

        Args:
            db: 데이터베이스 세션
            transaction_id: 거래 ID
            data: 수정 요청 데이터 (모든 필드 선택사항)
            updated_by: 수정자 ID (감사)

        Returns:
            TransactionResponse: 수정된 거래

        Raises:
            HTTPException: 데이터 없음 시 404
        """
        # 1단계: 기존 데이터 조회
        stmt = select(Transaction).where(
            and_(
                Transaction.id == transaction_id,
                Transaction.deleted == False,
            )
        )
        result = await db.execute(stmt)
        transaction = result.scalar_one_or_none()

        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="거래를 찾을 수 없습니다",
            )

        # 2단계: 제공된 필드만 업데이트
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(transaction, field, value)

        # 3단계: 감사 정보 업데이트
        transaction.updated_by = updated_by
        transaction.updated_at = datetime.now(timezone.utc)

        # 4단계: 저장
        await db.commit()
        await db.refresh(transaction)

        return TransactionResponse.model_validate(transaction)

    @staticmethod
    async def delete(
        db: AsyncSession,
        transaction_id: UUID,
        deleted_by: UUID | None = None,
    ) -> None:
        """거래 소프트 삭제

        논리적 삭제 (데이터는 유지, 삭제 플래그만 변경)

        Args:
            db: 데이터베이스 세션
            transaction_id: 거래 ID
            deleted_by: 삭제자 ID (감사)

        Raises:
            HTTPException: 데이터 없음 시 404 Not Found
        """
        # 1단계: 데이터 조회
        stmt = select(Transaction).where(
            and_(
                Transaction.id == transaction_id,
                Transaction.deleted == False,
            )
        )
        result = await db.execute(stmt)
        transaction = result.scalar_one_or_none()

        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="거래를 찾을 수 없습니다",
            )

        # 2단계: 소프트 삭제 처리
        transaction.deleted = True
        transaction.updated_by = deleted_by
        transaction.updated_at = datetime.now(timezone.utc)

        # 3단계: 저장
        await db.commit()
