"""Workflows schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional, Dict, Any

from pydantic import BaseModel, Field


class WorkflowsBase(BaseModel):
    """Workflows base schema."""

    name: str = Field(..., min_length=1, max_length=255, description="워크플로우명")
    description: Optional[str] = Field(None, description="설명")
    workflow_type: str = Field(..., max_length=50, description="워크플로우 유형 (approval, task, etc)")
    status: str = Field("draft", max_length=50, description="상태 (draft, active, inactive)")
    is_active: bool = Field(True, description="활성 여부")
    config: Optional[Dict[str, Any]] = Field(None, description="워크플로우 설정 (JSON)")
    version: int = Field(1, ge=1, description="버전")


class WorkflowsCreate(WorkflowsBase):
    """Workflows creation schema."""

    pass


class WorkflowsUpdate(BaseModel):
    """Workflows update schema."""

    name: Optional[str] = Field(None, min_length=1, max_length=255, description="워크플로우명")
    description: Optional[str] = Field(None, description="설명")
    workflow_type: Optional[str] = Field(None, max_length=50, description="워크플로우 유형")
    status: Optional[str] = Field(None, max_length=50, description="상태")
    is_active: Optional[bool] = Field(None, description="활성 여부")
    config: Optional[Dict[str, Any]] = Field(None, description="워크플로우 설정")


class WorkflowsResponse(WorkflowsBase):
    """Workflows response schema."""

    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

    class Config:
        """Pydantic config."""

        from_attributes = True


class WorkflowsListResponse(BaseModel):
    """Workflows list response schema."""

    items: list[WorkflowsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
