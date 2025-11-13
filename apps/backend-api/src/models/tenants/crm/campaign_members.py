from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from ..base import TenantBaseModel


__all__ = ["CampaignMembers"]


class CampaignMembers(TenantBaseModel):
    """캠페인 참여자 관리 테이블"""

    __tablename__ = "campaign_members"
    __table_args__ = {"schema": "crm"}

    campaign_id: Mapped[str] = mapped_column(
        ForeignKey("crm.campaigns.id"), nullable=False
    )  # 캠페인 ID
    member_type: Mapped[str] = mapped_column(
        nullable=False
    )  # 참여자 유형 (PARTNER: 거래처, LEAD: 리드)
    partner_id: Mapped[str | None] = mapped_column(ForeignKey("crm.partners.id"))  # 거래처 ID
    lead_id: Mapped[str | None] = mapped_column(ForeignKey("crm.leads.id"))  # 리드 ID
    contact_id: Mapped[str | None] = mapped_column(
        ForeignKey("crm.partner_contacts.id")
    )  # 담당자 ID (partner_contacts)
    joined_date: Mapped[str] = mapped_column(nullable=False)  # 참여일
    invited_by: Mapped[str | None] = mapped_column(ForeignKey("hrm.employees.id"))  # 초대자 UUID
    member_status: Mapped[str | None] = mapped_column(
        default="INVITED"
    )  # 참여 상태 (INVITED/REGISTERED/ATTENDED/NO_SHOW/DECLINED/CANCELLED)
    has_responded: Mapped[str | None] = mapped_column(default=False)  # 응답 여부
    response_date: Mapped[str | None] = mapped_column()  # 응답일
    response_type: Mapped[str | None] = (
        mapped_column()
    )  # 응답 유형 (POSITIVE/NEUTRAL/NEGATIVE/INTERESTED/NOT_INTERESTED)
    is_converted_to_lead: Mapped[str | None] = mapped_column(default=False)  # 리드 전환 여부
    is_converted_to_opportunity: Mapped[str | None] = mapped_column(
        default=False
    )  # 영업기회 전환 여부
    opportunity_id: Mapped[str | None] = mapped_column(
        ForeignKey("crm.opportunities.id")
    )  # 생성된 영업기회 ID
    channel: Mapped[str | None] = mapped_column()  # 참여 채널
    is_deleted: Mapped[str | None] = mapped_column(default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column()  # 비고
