"""
Pydantic schemas for PermissionConflictResolution model.

권한 충돌 해결 정책 스키마
"""

from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional
from uuid import UUID


class PermissionConflictResolutionBase(BaseModel):
    """Base schema for PermissionConflictResolution"""
    model_config = ConfigDict(from_attributes=True)

    code: str = Field(..., min_length=1, max_length=100, description="정책 코드")
    name: str = Field(..., min_length=1, max_length=200, description="정책명")
    description: Optional[str] = Field(None, description="정책 설명")
    conflict_strategy: str = Field(
        ...,
        description="충돌 해결 전략 (DENY_OVERRIDE, ALLOW_UNION, PRIORITY_BASED, MOST_RESTRICTIVE)"
    )
    merge_rule: str = Field(default="DENY_OVERRIDE", description="권한 병합 규칙")
    max_concurrent_roles: Optional[int] = Field(None, ge=1, description="동시 활성 역할 수 제한 (NULL: 무제한)")
    use_role_priority: bool = Field(default=False, description="역할 우선순위 사용 여부")
    priority_direction: Optional[str] = Field(None, description="우선순위 방향 (ASC, DESC)")
    apply_global_rules: bool = Field(default=True, description="글로벌 권한 규칙 적용 여부")
    apply_to_admins: bool = Field(default=False, description="관리자에게도 적용할지 여부")
    is_system: bool = Field(default=False, description="시스템 기본 정책 여부 (수정 불가)")

    @field_validator('conflict_strategy')
    @classmethod
    def validate_conflict_strategy(cls, v):
        """Validate conflict_strategy field."""
        valid_strategies = ('DENY_OVERRIDE', 'ALLOW_UNION', 'PRIORITY_BASED', 'MOST_RESTRICTIVE')
        if v not in valid_strategies:
            raise ValueError(f"conflict_strategy must be one of {valid_strategies}")
        return v

    @field_validator('priority_direction')
    @classmethod
    def validate_priority_direction(cls, v):
        """Validate priority_direction field."""
        if v is not None and v not in ('ASC', 'DESC'):
            raise ValueError("priority_direction must be ASC or DESC")
        return v


class PermissionConflictResolutionCreate(PermissionConflictResolutionBase):
    """Schema for creating PermissionConflictResolution"""
    code: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=1, max_length=200)
    conflict_strategy: str = Field(...)


class PermissionConflictResolutionUpdate(BaseModel):
    """Schema for updating PermissionConflictResolution"""
    model_config = ConfigDict(from_attributes=True)

    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    conflict_strategy: Optional[str] = None
    merge_rule: Optional[str] = None
    max_concurrent_roles: Optional[int] = Field(None, ge=1)
    use_role_priority: Optional[bool] = None
    priority_direction: Optional[str] = None
    apply_global_rules: Optional[bool] = None
    apply_to_admins: Optional[bool] = None
    is_system: Optional[bool] = None

    @field_validator('conflict_strategy')
    @classmethod
    def validate_conflict_strategy(cls, v):
        """Validate conflict_strategy field."""
        if v is not None:
            valid_strategies = ('DENY_OVERRIDE', 'ALLOW_UNION', 'PRIORITY_BASED', 'MOST_RESTRICTIVE')
            if v not in valid_strategies:
                raise ValueError(f"conflict_strategy must be one of {valid_strategies}")
        return v

    @field_validator('priority_direction')
    @classmethod
    def validate_priority_direction(cls, v):
        """Validate priority_direction field."""
        if v is not None and v not in ('ASC', 'DESC'):
            raise ValueError("priority_direction must be ASC or DESC")
        return v


class PermissionConflictResolutionResponse(PermissionConflictResolutionBase):
    """Response schema for PermissionConflictResolution"""

    id: UUID = Field(..., description="정책 ID")
    is_active: bool = Field(default=True, description="활성 여부")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")
    created_at: datetime = Field(..., description="생성 일시")
    updated_at: Optional[datetime] = Field(None, description="수정 일시")
    created_by: Optional[UUID] = Field(None, description="생성자 ID")
    updated_by: Optional[UUID] = Field(None, description="수정자 ID")


class PermissionConflictResolutionListResponse(BaseModel):
    """Schema for paginated PermissionConflictResolution list response"""

    items: list[PermissionConflictResolutionResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PermissionConflictResolutionBase",
    "PermissionConflictResolutionCreate",
    "PermissionConflictResolutionUpdate",
    "PermissionConflictResolutionResponse",
    "PermissionConflictResolutionListResponse",
]
