"""청구서 모듈 스키마 (Pydantic DTO)"""

from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class InvoiceBase(BaseModel):
    """청구서 기본 정보"""

    invoice_no: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="청구서 번호 (시스템 고유)"
    )
    tenant_id: UUID = Field(..., description="테넌트 ID")
    subscription_id: UUID = Field(..., description="구독 계약 ID")

    invoice_date: date = Field(..., description="청구서 발행일")
    due_date: date = Field(..., description="결제 만료일")
    start_date: date = Field(..., description="청구 기간 시작일")
    close_date: date = Field(..., description="청구 기간 종료일")

    base_amount: Decimal = Field(..., gt=0, description="기본 구독 요금")
    usage_amount: Decimal = Field(
        default=Decimal("0"),
        ge=0,
        description="사용량 기반 추가 요금"
    )
    discount_amount: Decimal = Field(
        default=Decimal("0"),
        ge=0,
        description="할인 금액"
    )
    tax_amount: Decimal = Field(
        default=Decimal("0"),
        ge=0,
        description="세금 (부가세 등)"
    )
    total_amount: Decimal = Field(..., gt=0, description="총 청구 금액")
    currency: str = Field(
        default="KRW",
        max_length=3,
        description="통화 단위 (ISO 4217)"
    )

    user_count: int = Field(..., gt=0, description="청구 기간 중 사용자 수")
    used_storage: Decimal = Field(
        default=Decimal("0"),
        ge=0,
        description="스토리지 사용량 (GB)"
    )
    api_calls: int = Field(
        default=0,
        ge=0,
        description="API 호출 횟수"
    )


class InvoiceCreate(InvoiceBase):
    """청구서 생성 요청"""

    payment_method: str | None = Field(
        None,
        max_length=50,
        description="결제 수단"
    )


class InvoiceUpdate(BaseModel):
    """청구서 수정 요청 (모든 필드 선택사항)"""

    invoice_no: str | None = Field(
        None,
        min_length=1,
        max_length=50
    )
    due_date: date | None = None
    start_date: date | None = None
    close_date: date | None = None

    usage_amount: Decimal | None = Field(None, ge=0)
    discount_amount: Decimal | None = Field(None, ge=0)
    tax_amount: Decimal | None = Field(None, ge=0)
    total_amount: Decimal | None = Field(None, gt=0)

    user_count: int | None = Field(None, gt=0)
    used_storage: Decimal | None = Field(None, ge=0)
    api_calls: int | None = Field(None, ge=0)

    status: str | None = Field(None, max_length=20)
    payment_method: str | None = Field(None, max_length=50)


class InvoiceResponse(InvoiceBase):
    """청구서 응답 DTO"""

    id: UUID
    status: str
    paid_at: datetime | None = None
    payment_method: str | None = None

    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None
    deleted: bool = False

    class Config:
        """Pydantic 설정"""
        from_attributes = True


class InvoiceListResponse(BaseModel):
    """청구서 목록 응답 (페이지네이션)"""

    items: list[InvoiceResponse]
    total: int = Field(..., ge=0, description="전체 개수")
    page: int = Field(..., ge=1, description="현재 페이지")
    page_size: int = Field(..., ge=1, le=100, description="페이지 크기")
    total_pages: int = Field(..., ge=0, description="전체 페이지 수")
