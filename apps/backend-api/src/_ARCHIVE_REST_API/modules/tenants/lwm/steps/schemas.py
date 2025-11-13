"""Steps schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional, Dict, Any

from pydantic import BaseModel, Field


class StepsBase(BaseModel):
    """Steps base schema."""

    workflow_id: UUID = Field(..., description="워크플로우 ID")
    step_number: int = Field(..., ge=1, description="단계 번호")
    name: str = Field(..., min_length=1, max_length=255, description="단계명")
    description: Optional[str] = Field(None, description="설명")
    step_type: str = Field(..., max_length=50, description="단계 유형 (sequential, parallel, conditional)")
    action_type: str = Field(..., max_length=50, description="작업 유형 (approve, reject, review, etc)")
    required_approvers: Optional[int] = Field(1, ge=1, description="필요한 승인자 수")
    timeout_days: Optional[int] = Field(None, ge=0, description="타임아웃 (일 수)")
    config: Optional[Dict[str, Any]] = Field(None, description="단계 설정 (JSON)")
    is_active: bool = Field(True, description="활성 여부")


class StepsCreate(StepsBase):
    """Steps creation schema."""

    pass


class StepsUpdate(BaseModel):
    """Steps update schema."""

    step_number: Optional[int] = Field(None, ge=1, description="단계 번호")
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="단계명")
    description: Optional[str] = Field(None, description="설명")
    step_type: Optional[str] = Field(None, max_length=50, description="단계 유형")
    action_type: Optional[str] = Field(None, max_length=50, description="작업 유형")
    required_approvers: Optional[int] = Field(None, ge=1, description="필요한 승인자 수")
    timeout_days: Optional[int] = Field(None, ge=0, description="타임아웃")
    config: Optional[Dict[str, Any]] = Field(None, description="단계 설정")
    is_active: Optional[bool] = Field(None, description="활성 여부")


class StepsResponse(StepsBase):
    """Steps response schema."""

    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

    class Config:
        """Pydantic config."""

        from_attributes = True


class StepsListResponse(BaseModel):
    """Steps list response schema."""

    items: list[StepsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
