"""Schemas for Role module."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class RoleBase(BaseModel):
    """Base schema for Role."""
    code: str = Field(..., min_length=1, max_length=100, description="역할 코드")
    name: str = Field(..., min_length=1, max_length=100, description="역할 명칭")
    description: Optional[str] = Field(None, description="역할 설명")
    category: str = Field(
        default="TENANT_USER",
        description="역할 카테고리 (MANAGER_ADMIN, PLATFORM_SUPPORT, TENANT_ADMIN, TENANT_USER)"
    )
    level: int = Field(
        default=100,
        ge=1,
        le=200,
        description="역할 레벨 (1-10: 최상위, 11-50: 플랫폼, 51-100: 테넌트 관리자, 101+: 사용자)"
    )
    scope: str = Field(default="GLOBAL", description="역할 범위 (GLOBAL, TENANT)")
    is_default: bool = Field(default=False, description="기본 역할 여부")
    priority: int = Field(default=100, description="역할 우선순위 (낮을수록 높은 권한)")
    status: str = Field(default="ACTIVE", description="역할 상태 (ACTIVE, INACTIVE)")

    @field_validator('category')
    @classmethod
    def validate_category(cls, v):
        """Validate category field."""
        valid_categories = ('MANAGER_ADMIN', 'PLATFORM_SUPPORT', 'TENANT_ADMIN', 'TENANT_USER')
        if v not in valid_categories:
            raise ValueError(f"category must be one of {valid_categories}")
        return v

    @field_validator('scope')
    @classmethod
    def validate_scope(cls, v):
        """Validate scope field."""
        if v not in ('GLOBAL', 'TENANT'):
            raise ValueError("scope must be GLOBAL or TENANT")
        return v

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        """Validate status field."""
        if v not in ('ACTIVE', 'INACTIVE'):
            raise ValueError("status must be ACTIVE or INACTIVE")
        return v


class RoleCreate(RoleBase):
    """Schema for creating Role."""
    code: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(default="TENANT_USER")
    level: int = Field(default=100, ge=1, le=200)


class RoleUpdate(BaseModel):
    """Schema for updating Role."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    category: Optional[str] = None
    level: Optional[int] = Field(None, ge=1, le=200)
    scope: Optional[str] = None
    is_default: Optional[bool] = None
    priority: Optional[int] = None
    status: Optional[str] = None


class RoleResponse(RoleBase):
    """Response schema for Role."""
    id: UUID = Field(..., description="역할 ID")
    created_at: datetime = Field(..., description="생성 일시")
    updated_at: Optional[datetime] = Field(None, description="수정 일시")
    created_by: Optional[UUID] = Field(None, description="생성자 ID")
    updated_by: Optional[UUID] = Field(None, description="수정자 ID")

    class Config:
        """Pydantic config."""
        from_attributes = True


class RoleListResponse(BaseModel):
    """List response schema for Role."""
    items: list[RoleResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
