"""Codes schemas for request/response validation."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CodesBase(BaseModel):
    """Codes base schema."""

    group_id: UUID = Field(..., description="코드그룹 식별자")
    code: str = Field(..., min_length=1, max_length=50, description="코드값 (영대문자, 숫자, 언더스코어 1-50자)")
    name: str = Field(..., min_length=1, max_length=200, description="코드명")
    name_en: str | None = Field(None, max_length=200, description="영문 코드명 (다국어 지원)")
    description: str | None = Field(None, description="설명")
    attribute1: str | None = Field(None, max_length=100, description="추가 속성1 (확장 속성)")
    attribute2: str | None = Field(None, max_length=100, description="추가 속성2 (확장 속성)")
    attribute3: str | None = Field(None, max_length=100, description="추가 속성3 (확장 속성)")
    sort_order: int | None = Field(0, description="정렬 순서")
    is_active: bool = Field(True, description="활성 여부")
    is_system: bool = Field(False, description="시스템 코드 여부 (수정/삭제 제한)")
    is_deleted: bool = Field(False, description="논리 삭제 플래그")


class CodesCreate(CodesBase):
    """Codes creation schema."""

    pass


class CodesUpdate(BaseModel):
    """Codes update schema."""

    group_id: UUID | None = Field(None, description="코드그룹 식별자")
    code: str | None = Field(None, min_length=1, max_length=50, description="코드값")
    name: str | None = Field(None, min_length=1, max_length=200, description="코드명")
    name_en: str | None = Field(None, max_length=200, description="영문 코드명")
    description: str | None = Field(None, description="설명")
    attribute1: str | None = Field(None, max_length=100, description="추가 속성1")
    attribute2: str | None = Field(None, max_length=100, description="추가 속성2")
    attribute3: str | None = Field(None, max_length=100, description="추가 속성3")
    sort_order: int | None = Field(None, description="정렬 순서")
    is_active: bool | None = Field(None, description="활성 여부")
    is_system: bool | None = Field(None, description="시스템 코드 여부")
    is_deleted: bool | None = Field(None, description="논리 삭제 플래그")


class CodesResponse(CodesBase):
    """Codes response schema."""

    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class CodesListResponse(BaseModel):
    """Codes list response schema."""

    items: list[CodesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
