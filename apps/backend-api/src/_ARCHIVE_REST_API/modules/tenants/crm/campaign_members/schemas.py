"""
캠페인 참여자 관리 테이블

Pydantic schemas for CampaignMembers model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class CampaignMembersBase(BaseModel):
    """Base schema for CampaignMembers"""
    model_config = ConfigDict(from_attributes=True)

    campaign_id: str
    member_type: str
    partner_id: str | None = Field(None, description="거래처 ID")
    lead_id: str | None = Field(None, description="리드 ID")
    contact_id: str | None = None
    joined_date: str = Field(description="참여일")
    invited_by: str | None = Field(None, description="초대자 UUID")
    member_status: str | None = Field(default='INVITED')
    has_responded: str | None = Field(default=False, description="응답 여부")
    response_date: str | None = Field(None, description="응답일")
    response_type: str | None = None
    is_converted_to_lead: str | None = Field(default=False, description="리드 전환 여부")
    is_converted_to_opportunity: str | None = Field(default=False)
    opportunity_id: str | None = None
    channel: str | None = Field(None, description="참여 채널")
    is_deleted: str | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class CampaignMembersCreate(CampaignMembersBase):
    """Schema for creating CampaignMembers"""

    # Exclude auto-generated fields
    pass


class CampaignMembersUpdate(BaseModel):
    """Schema for updating CampaignMembers (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    campaign_id: str | None = None
    member_type: str | None = None
    partner_id: str | None = Field(None, description="거래처 ID")
    lead_id: str | None = Field(None, description="리드 ID")
    contact_id: str | None = None
    joined_date: str | None = Field(None, description="참여일")
    invited_by: str | None = Field(None, description="초대자 UUID")
    member_status: str | None = Field(default='INVITED')
    has_responded: str | None = Field(default=False, description="응답 여부")
    response_date: str | None = Field(None, description="응답일")
    response_type: str | None = None
    is_converted_to_lead: str | None = Field(default=False, description="리드 전환 여부")
    is_converted_to_opportunity: str | None = Field(default=False)
    opportunity_id: str | None = None
    channel: str | None = Field(None, description="참여 채널")
    is_deleted: str | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class CampaignMembersResponse(CampaignMembersBase):
    """Schema for CampaignMembers response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class CampaignMembersListResponse(BaseModel):
    """Schema for paginated CampaignMembers list response"""

    items: list[CampaignMembersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "CampaignMembersBase",
    "CampaignMembersCreate",
    "CampaignMembersUpdate",
    "CampaignMembersResponse",
    "CampaignMembersListResponse",
]
