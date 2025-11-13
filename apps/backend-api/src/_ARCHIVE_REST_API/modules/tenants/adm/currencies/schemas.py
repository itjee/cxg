"""Currencies schemas for request/response validation."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CurrenciesBase(BaseModel):
    """Currencies base schema."""

    code: str = Field(..., min_length=3, max_length=3, description="통화 코드 (ISO 4217 - 3자리 영대문자, 예: KRW, USD, JPY)")
    name: str = Field(..., min_length=1, max_length=100, description="통화명 (한글명, 예: 대한민국 원)")
    name_en: str | None = Field(None, max_length=100, description="통화명 (영문명, 예: South Korean Won)")
    symbol: str | None = Field(None, max_length=10, description="심볼 (¥, $, € 등)")
    decimal_places: int | None = Field(2, ge=0, le=4, description="소수점 자릿수 (통화별 자릿수, 0-4)")
    is_active: bool = Field(True, description="활성 여부")
    is_base_currency: bool = Field(False, description="기준 통화 여부 (환율 계산 기준)")


class CurrenciesCreate(CurrenciesBase):
    """Currencies creation schema."""

    pass


class CurrenciesUpdate(BaseModel):
    """Currencies update schema."""

    code: str | None = Field(None, min_length=3, max_length=3, description="통화 코드")
    name: str | None = Field(None, min_length=1, max_length=100, description="통화명")
    name_en: str | None = Field(None, max_length=100, description="통화명 (영문)")
    symbol: str | None = Field(None, max_length=10, description="심볼")
    decimal_places: int | None = Field(None, ge=0, le=4, description="소수점 자릿수")
    is_active: bool | None = Field(None, description="활성 여부")
    is_base_currency: bool | None = Field(None, description="기준 통화 여부")


class CurrenciesResponse(CurrenciesBase):
    """Currencies response schema."""

    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class CurrenciesListResponse(BaseModel):
    """Currencies list response schema."""

    items: list[CurrenciesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
