from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PartnerContacts"]


class PartnerContacts(TenantBaseModel):
    """거래처 담당자 정보 관리 테이블"""
    __tablename__ = "partner_contacts"
    __table_args__ = {"schema": "crm"}

    partner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 거래처 식별자
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 담당자명
    position: Mapped[str | None] = mapped_column(String(100))  # 직책/직위
    department: Mapped[str | None] = mapped_column(String(100))  # 소속 부서
    phone: Mapped[str | None] = mapped_column(String(50))  # 직장 전화번호
    mobile: Mapped[str | None] = mapped_column(String(50))  # 휴대폰 번호
    email: Mapped[str | None] = mapped_column(String(255))  # 이메일 주소
    contact_type: Mapped[str | None] = mapped_column(String(20))  # 업무 유형 (SALES: 영업, PURCHASING: 구매, ACCOUNTING: 회계, TECHNICAL: 기술, MANAGEMENT: 경영진, OTHER: 기타)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 주담당자 여부
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='ACTIVE')  # 상태 (ACTIVE/INACTIVE)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그