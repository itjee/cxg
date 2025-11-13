"""CodeGroups schemas for request/response validation."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CodeGroupsBase(BaseModel):
    """CodeGroups base schema."""

    code: str = Field(..., min_length=2, max_length=50, description="그룹 코드 (영대문자, 숫자, 언더스코어 2-50자)")
    name: str = Field(..., min_length=1, max_length=200, description="그룹명")
    description: str | None = Field(None, description="설명")
    parent_group_id: UUID | None = Field(None, description="상위 그룹 식별자 (계층구조 지원)")
    level: int | None = Field(1, ge=1, description="그룹 레벨 (계층 레벨, 1부터 시작)")
    sort_order: int | None = Field(0, description="정렬 순서")
    is_active: bool = Field(True, description="활성 여부")
    is_deleted: bool = Field(False, description="논리 삭제 플래그")


class CodeGroupsCreate(CodeGroupsBase):
    """CodeGroups creation schema."""

    pass


class CodeGroupsUpdate(BaseModel):
    """CodeGroups update schema."""

    code: str | None = Field(None, min_length=2, max_length=50, description="그룹 코드")
    name: str | None = Field(None, min_length=1, max_length=200, description="그룹명")
    description: str | None = Field(None, description="설명")
    parent_group_id: UUID | None = Field(None, description="상위 그룹 식별자")
    level: int | None = Field(None, ge=1, description="그룹 레벨")
    sort_order: int | None = Field(None, description="정렬 순서")
    is_active: bool | None = Field(None, description="활성 여부")
    is_deleted: bool | None = Field(None, description="논리 삭제 플래그")


class CodeGroupsResponse(CodeGroupsBase):
    """CodeGroups response schema."""

    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class CodeGroupsListResponse(BaseModel):
    """CodeGroups list response schema."""

    items: list[CodeGroupsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
