"""PaymentTerms schemas for request/response validation."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class PaymentTermsBase(BaseModel):
    """PaymentTerms base schema."""

    code: str = Field(..., min_length=1, max_length=20, description="결제 조건 코드 (COD, NET7, NET15, NET30 등)")
    name: str = Field(..., min_length=1, max_length=100, description="결제 조건명 (예: 30일 외상)")
    description: str | None = Field(None, description="결제 조건 설명")
    days_to_pay: int | None = Field(None, ge=0, description="결제 기간 (일수)")
    is_cash_on_delivery: bool | None = Field(False, description="착불 여부")
    is_active: bool | None = Field(True, description="활성 여부")
    is_deleted: bool = Field(False, description="논리 삭제 플래그")


class PaymentTermsCreate(PaymentTermsBase):
    """PaymentTerms creation schema."""

    pass


class PaymentTermsUpdate(BaseModel):
    """PaymentTerms update schema."""

    code: str | None = Field(None, min_length=1, max_length=20, description="결제 조건 코드")
    name: str | None = Field(None, min_length=1, max_length=100, description="결제 조건명")
    description: str | None = Field(None, description="결제 조건 설명")
    days_to_pay: int | None = Field(None, ge=0, description="결제 기간")
    is_cash_on_delivery: bool | None = Field(None, description="착불 여부")
    is_active: bool | None = Field(None, description="활성 여부")
    is_deleted: bool | None = Field(None, description="논리 삭제 플래그")


class PaymentTermsResponse(PaymentTermsBase):
    """PaymentTerms response schema."""

    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class PaymentTermsListResponse(BaseModel):
    """PaymentTerms list response schema."""

    items: list[PaymentTermsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
