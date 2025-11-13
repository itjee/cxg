"""거래(결제) 모듈 스키마 (Pydantic DTO)"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class TransactionBase(BaseModel):
    """거래 기본 정보"""

    transaction_no: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="거래 번호 (시스템 고유)"
    )
    tenant_id: UUID = Field(..., description="테넌트 ID")
    invoice_id: UUID | None = Field(
        None,
        description="연관 청구서 ID"
    )

    transaction_type: str = Field(
        default="PAYMENT",
        description="거래 유형 (PAYMENT/REFUND/CHARGEBACK)"
    )

    amount: Decimal = Field(..., gt=0, description="거래 금액")
    currency: str = Field(
        default="KRW",
        max_length=3,
        description="통화 단위 (ISO 4217)"
    )

    payment_method: str = Field(
        ...,
        max_length=50,
        description="결제 수단"
    )

    payment_gateway: str | None = Field(
        None,
        max_length=50,
        description="결제 게이트웨이"
    )
    payment_gateway_id: str | None = Field(
        None,
        max_length=255,
        description="결제 게이트웨이 거래 ID"
    )

    exchange_rate: Decimal | None = Field(
        None,
        gt=0,
        description="환율"
    )

    card_digits: str | None = Field(
        None,
        max_length=4,
        description="카드 마지막 4자리"
    )


class TransactionCreate(TransactionBase):
    """거래 생성 요청"""

    status: str = Field(
        default="PENDING",
        description="거래 상태"
    )


class TransactionUpdate(BaseModel):
    """거래 수정 요청 (모든 필드 선택사항)"""

    status: str | None = Field(None, max_length=20)
    processed_at: datetime | None = None
    failed_at: datetime | None = None
    failure_reason: str | None = None

    exchange_rate: Decimal | None = Field(None, gt=0)
    card_digits: str | None = Field(None, max_length=4)


class TransactionResponse(TransactionBase):
    """거래 응답 DTO"""

    id: UUID
    status: str
    processed_at: datetime | None = None
    failed_at: datetime | None = None
    failure_reason: str | None = None

    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None
    deleted: bool = False

    class Config:
        """Pydantic 설정"""
        from_attributes = True


class TransactionListResponse(BaseModel):
    """거래 목록 응답 (페이지네이션)"""

    items: list[TransactionResponse]
    total: int = Field(..., ge=0, description="전체 개수")
    page: int = Field(..., ge=1, description="현재 페이지")
    page_size: int = Field(..., ge=1, le=100, description="페이지 크기")
    total_pages: int = Field(..., ge=0, description="전체 페이지 수")
