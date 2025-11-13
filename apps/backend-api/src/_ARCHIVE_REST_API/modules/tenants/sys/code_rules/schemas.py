"""
엔티티별 코드 자동 생성 규칙 관리 테이블 (Prefix 및 일련번호 관리)

Pydantic schemas for CodeRules model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class CodeRulesBase(BaseModel):
    """Base schema for CodeRules"""
    model_config = ConfigDict(from_attributes=True)

    entity_name: str = Field(max_length=100, description="엔티티명 (예: 거래처, 제품, 창고)")
    entity_code: str = Field(max_length=50, description="엔티티 코드 (예: PARTNER, PRODUCT, WAREHOUSE)")
    prefix: str = Field(max_length=3, description="코드 Prefix (3자리 영문 대문자, 예: MBP, MPD, MWH)")
    current_number: int = Field(default=0, description="현재 일련번호 (다음 발급될 번호)")
    digit_length: int = Field(default=4, description="일련번호 자릿수 (2-10)")
    description: str | None = Field(None, description="규칙 설명")
    example_code: str | None = Field(None, max_length=20, description="코드 형식 예시 (예: MBP0001)")
    is_active: bool | None = Field(default=True, description="활성 상태")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class CodeRulesCreate(CodeRulesBase):
    """Schema for creating CodeRules"""

    # Exclude auto-generated fields
    pass


class CodeRulesUpdate(BaseModel):
    """Schema for updating CodeRules (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    entity_name: str | None = Field(None, max_length=100, description="엔티티명 (예: 거래처, 제품, 창고)")
    entity_code: str | None = Field(None, max_length=50, description="엔티티 코드 (예: PARTNER, PRODUCT, WAREHOUSE)")
    prefix: str | None = Field(None, max_length=3, description="코드 Prefix (3자리 영문 대문자, 예: MBP, MPD, MWH)")
    current_number: int | None = Field(default=0, description="현재 일련번호 (다음 발급될 번호)")
    digit_length: int | None = Field(default=4, description="일련번호 자릿수 (2-10)")
    description: str | None = Field(None, description="규칙 설명")
    example_code: str | None = Field(None, max_length=20, description="코드 형식 예시 (예: MBP0001)")
    is_active: bool | None = Field(default=True, description="활성 상태")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class CodeRulesResponse(CodeRulesBase):
    """Schema for CodeRules response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class CodeRulesListResponse(BaseModel):
    """Schema for paginated CodeRules list response"""

    items: list[CodeRulesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "CodeRulesBase",
    "CodeRulesCreate",
    "CodeRulesUpdate",
    "CodeRulesResponse",
    "CodeRulesListResponse",
]
