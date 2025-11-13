"""
이메일 템플릿 관리 테이블

Pydantic schemas for EmailTemplates model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class EmailTemplatesBase(BaseModel):
    """Base schema for EmailTemplates"""
    model_config = ConfigDict(from_attributes=True)

    template_code: str = Field(max_length=50, description="템플릿 코드 (고유번호)")
    name: str = Field(max_length=200, description="템플릿명")
    description: str | None = Field(None, description="설명")
    category: str | None = Field(None, max_length=50, description="카테고리 (영업, 마케팅, 고객지원 등)")
    template_type: str = Field(max_length=20, description="템플릿 유형 (WELCOME/FOLLOW_UP/CAMPAIGN/QUOTE/ORDER/INVOICE/SURVEY/NOTIFICATION/CUSTOM)")
    subject: str = Field(max_length=500, description="이메일 제목 (변수 사용 가능: {{customer_name}})")
    body_html: str = Field(description="본문 HTML (변수 사용 가능)")
    body_text: str | None = Field(None, description="본문 텍스트 (HTML 미지원 클라이언트용)")
    variables: dict | None = Field(None, description="사용 가능한 변수 목록 (JSON, 예: [\"customer_name\", \"order_number\"])")
    from_name: str | None = Field(None, max_length=100, description="발신자명")
    from_email: str | None = Field(None, max_length=100, description="발신자 이메일")
    reply_to: str | None = Field(None, max_length=100, description="답장 주소")
    default_attachments: dict | None = Field(None, description="기본 첨부파일 정보 (JSON)")
    usage_count: int | None = Field(default=0, description="사용 횟수")
    last_used_at: datetime | None = Field(None, description="마지막 사용 일시")
    status: str = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/ACTIVE/ARCHIVED)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class EmailTemplatesCreate(EmailTemplatesBase):
    """Schema for creating EmailTemplates"""

    # Exclude auto-generated fields
    pass


class EmailTemplatesUpdate(BaseModel):
    """Schema for updating EmailTemplates (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    template_code: str | None = Field(None, max_length=50, description="템플릿 코드 (고유번호)")
    name: str | None = Field(None, max_length=200, description="템플릿명")
    description: str | None = Field(None, description="설명")
    category: str | None = Field(None, max_length=50, description="카테고리 (영업, 마케팅, 고객지원 등)")
    template_type: str | None = Field(None, max_length=20, description="템플릿 유형 (WELCOME/FOLLOW_UP/CAMPAIGN/QUOTE/ORDER/INVOICE/SURVEY/NOTIFICATION/CUSTOM)")
    subject: str | None = Field(None, max_length=500, description="이메일 제목 (변수 사용 가능: {{customer_name}})")
    body_html: str | None = Field(None, description="본문 HTML (변수 사용 가능)")
    body_text: str | None = Field(None, description="본문 텍스트 (HTML 미지원 클라이언트용)")
    variables: dict | None = Field(None, description="사용 가능한 변수 목록 (JSON, 예: [\"customer_name\", \"order_number\"])")
    from_name: str | None = Field(None, max_length=100, description="발신자명")
    from_email: str | None = Field(None, max_length=100, description="발신자 이메일")
    reply_to: str | None = Field(None, max_length=100, description="답장 주소")
    default_attachments: dict | None = Field(None, description="기본 첨부파일 정보 (JSON)")
    usage_count: int | None = Field(default=0, description="사용 횟수")
    last_used_at: datetime | None = Field(None, description="마지막 사용 일시")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/ACTIVE/ARCHIVED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class EmailTemplatesResponse(EmailTemplatesBase):
    """Schema for EmailTemplates response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class EmailTemplatesListResponse(BaseModel):
    """Schema for paginated EmailTemplates list response"""

    items: list[EmailTemplatesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "EmailTemplatesBase",
    "EmailTemplatesCreate",
    "EmailTemplatesUpdate",
    "EmailTemplatesResponse",
    "EmailTemplatesListResponse",
]
