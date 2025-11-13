from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PartnerAddresses"]


class PartnerAddresses(TenantBaseModel):
    """거래처 주소 정보 관리 테이블"""
    __tablename__ = "partner_addresses"
    __table_args__ = {"schema": "crm"}

    partner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 거래처 식별자
    address_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 주소 유형 (HEADQUARTER: 본사, BRANCH: 지사, WAREHOUSE: 창고, FACTORY: 공장, BILLING: 청구지, SHIPPING: 배송지, OTHER: 기타)
    address_name: Mapped[str | None] = mapped_column(String(100))  # 주소 별칭
    postcode: Mapped[str | None] = mapped_column(String(20))  # 우편번호
    address1: Mapped[str | None] = mapped_column(String(200))  # 기본 주소
    address2: Mapped[str | None] = mapped_column(String(200))  # 상세 주소
    building: Mapped[str | None] = mapped_column(String(200))  # 건물명
    city: Mapped[str | None] = mapped_column(String(100))  # 도시
    state_province: Mapped[str | None] = mapped_column(String(100))  # 주/도
    country_code: Mapped[str | None] = mapped_column(String(3), ForeignKey("adm.countries.id"), default='KOR')  # 국가 코드 (ISO 3166-1 alpha-3)
    region_code: Mapped[str | None] = mapped_column(String(20), ForeignKey("adm.regions.id"))  # 지역 코드
    contact_name: Mapped[str | None] = mapped_column(String(100))  # 연락처 담당자명
    phone: Mapped[str | None] = mapped_column(String(50))  # 전화번호
    mobile: Mapped[str | None] = mapped_column(String(50))  # 휴대폰 번호
    fax: Mapped[str | None] = mapped_column(String(50))  # 팩스번호
    email: Mapped[str | None] = mapped_column(String(255))  # 이메일
    is_default: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 기본 주소 여부
    is_billing: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 청구지 여부
    is_shipping: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 배송지 여부
    instruction: Mapped[str | None] = mapped_column(Text)  # 배송 지시사항
    access_code: Mapped[str | None] = mapped_column(String(20))  # 출입코드
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/SUSPENDED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그