"""Tasks schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional, Dict, Any

from pydantic import BaseModel, Field


class TasksBase(BaseModel):
    """Tasks base schema."""

    workflow_id: UUID = Field(..., description="워크플로우 ID")
    step_id: UUID = Field(..., description="단계 ID")
    request_id: Optional[UUID] = Field(None, description="요청 ID")
    assigned_to: Optional[UUID] = Field(None, description="할당 대상 (사용자 ID)")
    assigned_group: Optional[UUID] = Field(None, description="할당 그룹 (그룹 ID)")
    task_status: str = Field("pending", max_length=50, description="작업 상태 (pending, in_progress, completed, rejected)")
    priority: str = Field("normal", max_length=20, description="우선순위 (low, normal, high, urgent)")
    due_date: Optional[datetime] = Field(None, description="마감일")
    comments: Optional[str] = Field(None, description="의견/코멘트")
    config: Optional[Dict[str, Any]] = Field(None, description="작업 설정 (JSON)")


class TasksCreate(TasksBase):
    """Tasks creation schema."""

    pass


class TasksUpdate(BaseModel):
    """Tasks update schema."""

    assigned_to: Optional[UUID] = Field(None, description="할당 대상")
    assigned_group: Optional[UUID] = Field(None, description="할당 그룹")
    task_status: Optional[str] = Field(None, max_length=50, description="작업 상태")
    priority: Optional[str] = Field(None, max_length=20, description="우선순위")
    due_date: Optional[datetime] = Field(None, description="마감일")
    comments: Optional[str] = Field(None, description="의견/코멘트")
    config: Optional[Dict[str, Any]] = Field(None, description="작업 설정")


class TasksResponse(TasksBase):
    """Tasks response schema."""

    id: UUID
    completed_at: Optional[datetime]
    completed_by: Optional[UUID]
    created_at: datetime
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]

    class Config:
        """Pydantic config."""

        from_attributes = True


class TasksListResponse(BaseModel):
    """Tasks list response schema."""

    items: list[TasksResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
