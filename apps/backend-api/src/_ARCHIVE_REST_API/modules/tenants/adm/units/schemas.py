"""Units schemas for request/response validation."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class UnitsBase(BaseModel):
    """Units base schema."""

    code: str = Field(..., min_length=1, max_length=20, description="단위 코드 (영대문자, 숫자 1-20자, 예: EA, KG, M, L)")
    name: str = Field(..., min_length=1, max_length=100, description="단위명 (한글명, 예: 개, 킬로그램, 미터, 리터)")
    name_en: str | None = Field(None, max_length=100, description="단위명 (영문명)")
    unit_type: str | None = Field(None, max_length=20, description="단위 유형 (QUANTITY, WEIGHT, LENGTH, VOLUME, AREA 등)")
    symbol: str | None = Field(None, max_length=10, description="단위 심볼 (예: kg, m, L)")
    base_unit_id: UUID | None = Field(None, description="기준 단위 식별자")
    conversion_rate: float | None = Field(None, description="기준 단위 환산율")
    is_active: bool = Field(True, description="활성 여부")
    is_base_unit: bool = Field(False, description="기준 단위 여부")


class UnitsCreate(UnitsBase):
    """Units creation schema."""

    pass


class UnitsUpdate(BaseModel):
    """Units update schema."""

    code: str | None = Field(None, min_length=1, max_length=20, description="단위 코드")
    name: str | None = Field(None, min_length=1, max_length=100, description="단위명")
    name_en: str | None = Field(None, max_length=100, description="단위명 (영문)")
    unit_type: str | None = Field(None, max_length=20, description="단위 유형")
    symbol: str | None = Field(None, max_length=10, description="단위 심볼")
    base_unit_id: UUID | None = Field(None, description="기준 단위 식별자")
    conversion_rate: float | None = Field(None, description="기준 단위 환산율")
    is_active: bool | None = Field(None, description="활성 여부")
    is_base_unit: bool | None = Field(None, description="기준 단위 여부")


class UnitsResponse(UnitsBase):
    """Units response schema."""

    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class UnitsListResponse(BaseModel):
    """Units list response schema."""

    items: list[UnitsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
