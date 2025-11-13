"""ExchangeRates schemas for request/response validation."""

from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel, Field


class ExchangeRatesBase(BaseModel):
    """ExchangeRates base schema."""

    from_currency: str = Field(..., min_length=3, max_length=3, description="기준 통화 (ISO 4217, 예: USD)")
    to_currency: str = Field(..., min_length=3, max_length=3, description="대상 통화 (ISO 4217, 예: KRW)")
    rate: float = Field(..., gt=0, description="환율 (기준통화 1단위당 대상통화 환산율)")
    rate_date: date = Field(..., description="환율 적용일")
    source: str | None = Field(None, max_length=50, description="환율 출처 (중앙은행, API 등)")
    rate_type: str | None = Field("SPOT", max_length=20, description="환율 유형 (SPOT, FORWARD, BUYING, SELLING)")


class ExchangeRatesCreate(ExchangeRatesBase):
    """ExchangeRates creation schema."""

    pass


class ExchangeRatesUpdate(BaseModel):
    """ExchangeRates update schema."""

    from_currency: str | None = Field(None, min_length=3, max_length=3, description="기준 통화")
    to_currency: str | None = Field(None, min_length=3, max_length=3, description="대상 통화")
    rate: float | None = Field(None, gt=0, description="환율")
    rate_date: date | None = Field(None, description="환율 적용일")
    source: str | None = Field(None, max_length=50, description="환율 출처")
    rate_type: str | None = Field(None, max_length=20, description="환율 유형")


class ExchangeRatesResponse(ExchangeRatesBase):
    """ExchangeRates response schema."""

    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class ExchangeRatesListResponse(BaseModel):
    """ExchangeRates list response schema."""

    items: list[ExchangeRatesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
