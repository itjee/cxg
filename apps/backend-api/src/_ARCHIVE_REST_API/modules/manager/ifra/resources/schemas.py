"""Schemas for Resources module."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


# Type Literals
from typing import Literal

ResourceType = Literal["DATABASE", "STORAGE", "COMPUTE", "NETWORK", "CACHE", "LOAD_BALANCER", "CDN"]
ResourceStatus = Literal["PROVISIONING", "RUNNING", "STOPPED", "TERMINATED", "ERROR", "MAINTENANCE"]
Currency = Literal["USD", "KRW", "EUR", "JPY"]


# Base Schema
class ResourcesBase(BaseModel):
    """Base schema for Resources."""
    resource: ResourceType = Field(..., description="리소스 유형")
    resource_name: str = Field(..., min_length=1, max_length=100, description="리소스 이름")
    resource_id: str = Field(..., min_length=1, max_length=100, description="클라우드 리소스 ID")
    region: str = Field(default="ap-northeast-2", max_length=50, description="리전")
    currency: Currency = Field(default="USD", description="통화 단위")


# Create Schema
class ResourcesCreate(ResourcesBase):
    """Schema for creating Resources."""
    tenant_id: UUID | None = Field(None, description="테넌트 ID")
    resource_arn: str | None = Field(None, max_length=500, description="리소스 ARN")
    availability_zone: str | None = Field(None, max_length=50, description="가용영역")
    instance_type: str | None = Field(None, max_length=50, description="인스턴스 타입")
    cpu_cores: int | None = Field(None, gt=0, description="CPU 코어 수")
    memory_size: int | None = Field(None, gt=0, description="메모리 크기 (MB)")
    storage_size: int | None = Field(None, gt=0, description="스토리지 크기 (GB)")
    hourly_cost: Decimal | None = Field(None, ge=0, description="시간당 비용")
    monthly_cost: Decimal | None = Field(None, ge=0, description="월간 예상 비용")
    tags: dict | None = Field(default_factory=dict, description="리소스 태그")
    configuration: dict | None = Field(default_factory=dict, description="설정 정보")
    status: ResourceStatus = Field(default="PROVISIONING", description="리소스 상태")


# Update Schema
class ResourcesUpdate(BaseModel):
    """Schema for updating Resources."""
    resource_name: str | None = Field(None, min_length=1, max_length=100, description="리소스 이름")
    resource_arn: str | None = Field(None, max_length=500, description="리소스 ARN")
    region: str | None = Field(None, max_length=50, description="리전")
    availability_zone: str | None = Field(None, max_length=50, description="가용영역")
    instance_type: str | None = Field(None, max_length=50, description="인스턴스 타입")
    cpu_cores: int | None = Field(None, gt=0, description="CPU 코어 수")
    memory_size: int | None = Field(None, gt=0, description="메모리 크기 (MB)")
    storage_size: int | None = Field(None, gt=0, description="스토리지 크기 (GB)")
    hourly_cost: Decimal | None = Field(None, ge=0, description="시간당 비용")
    monthly_cost: Decimal | None = Field(None, ge=0, description="월간 예상 비용")
    currency: Currency | None = Field(None, description="통화 단위")
    tags: dict | None = Field(None, description="리소스 태그")
    configuration: dict | None = Field(None, description="설정 정보")
    status: ResourceStatus | None = Field(None, description="리소스 상태")


# Response Schema
class ResourcesResponse(ResourcesBase):
    """Response schema for Resources."""
    id: UUID
    tenant_id: UUID | None
    resource_arn: str | None
    availability_zone: str | None
    instance_type: str | None
    cpu_cores: int | None
    memory_size: int | None
    storage_size: int | None
    hourly_cost: Decimal | None
    monthly_cost: Decimal | None
    tags: dict | None
    configuration: dict | None
    status: ResourceStatus
    deleted: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""
        from_attributes = True


# List Response Schema
class ResourcesListResponse(BaseModel):
    """List response schema for Resources."""
    items: list[ResourcesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
