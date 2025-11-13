"""
자주 묻는 질문(FAQ) 관리 테이블

Pydantic schemas for Faqs model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class FaqsBase(BaseModel):
    """Base schema for Faqs"""
    model_config = ConfigDict(from_attributes=True)

    category: str | None = Field(None, max_length=50, description="카테고리 (제품/기술지원/정책/기타)")
    sub_category: str | None = Field(None, max_length=50, description="하위 카테고리")
    tags: str | None = Field(None, max_length=200, description="태그 (쉼표로 구분)")
    question: str = Field(description="질문")
    question_en: str | None = Field(None, description="질문 (영문)")
    answer: str = Field(description="답변")
    answer_en: str | None = Field(None, description="답변 (영문)")
    answer_summary: str | None = Field(None, max_length=500, description="답변 요약")
    related_articles: dict | None = Field(None, description="관련 문서 (JSON 배열: [{\"title\": \"...\", \"url\": \"...\"}])")
    video_url: str | None = Field(None, max_length=500, description="설명 동영상 URL")
    display_order: int | None = Field(default=0, description="정렬 순서")
    view_count: int | None = Field(default=0, description="조회수")
    helpful_count: int | None = Field(default=0, description="도움됨 카운트")
    not_helpful_count: int | None = Field(default=0, description="도움안됨 카운트")
    is_published: bool | None = Field(default=True, description="공개 여부")
    is_featured: bool | None = Field(default=False, description="추천 FAQ 여부")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class FaqsCreate(FaqsBase):
    """Schema for creating Faqs"""

    # Exclude auto-generated fields
    pass


class FaqsUpdate(BaseModel):
    """Schema for updating Faqs (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    category: str | None = Field(None, max_length=50, description="카테고리 (제품/기술지원/정책/기타)")
    sub_category: str | None = Field(None, max_length=50, description="하위 카테고리")
    tags: str | None = Field(None, max_length=200, description="태그 (쉼표로 구분)")
    question: str | None = Field(None, description="질문")
    question_en: str | None = Field(None, description="질문 (영문)")
    answer: str | None = Field(None, description="답변")
    answer_en: str | None = Field(None, description="답변 (영문)")
    answer_summary: str | None = Field(None, max_length=500, description="답변 요약")
    related_articles: dict | None = Field(None, description="관련 문서 (JSON 배열: [{\"title\": \"...\", \"url\": \"...\"}])")
    video_url: str | None = Field(None, max_length=500, description="설명 동영상 URL")
    display_order: int | None = Field(default=0, description="정렬 순서")
    view_count: int | None = Field(default=0, description="조회수")
    helpful_count: int | None = Field(default=0, description="도움됨 카운트")
    not_helpful_count: int | None = Field(default=0, description="도움안됨 카운트")
    is_published: bool | None = Field(default=True, description="공개 여부")
    is_featured: bool | None = Field(default=False, description="추천 FAQ 여부")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class FaqsResponse(FaqsBase):
    """Schema for Faqs response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class FaqsListResponse(BaseModel):
    """Schema for paginated Faqs list response"""

    items: list[FaqsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "FaqsBase",
    "FaqsCreate",
    "FaqsUpdate",
    "FaqsResponse",
    "FaqsListResponse",
]
