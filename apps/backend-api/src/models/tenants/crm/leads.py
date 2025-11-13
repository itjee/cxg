from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Leads"]


class Leads(TenantBaseModel):
    """리드/잠재고객 관리 테이블"""
    __tablename__ = "leads"
    __table_args__ = {"schema": "crm"}

    lead_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 리드 코드 (고유번호)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 회사명
    website: Mapped[str | None] = mapped_column(String(200))  # 웹사이트
    industry: Mapped[str | None] = mapped_column(String(100))  # 업종
    employee_count: Mapped[int | None] = mapped_column(Integer)  # 직원 수
    annual_revenue: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 연매출액
    contact_name: Mapped[str] = mapped_column(String(100), nullable=False)  # 담당자명
    contact_title: Mapped[str | None] = mapped_column(String(100))  # 직책
    contact_phone: Mapped[str | None] = mapped_column(String(20))  # 전화번호
    contact_mobile: Mapped[str | None] = mapped_column(String(20))  # 휴대폰
    contact_email: Mapped[str | None] = mapped_column(String(100))  # 이메일
    country_code: Mapped[str | None] = mapped_column(String(3), ForeignKey("adm.countries.id"))  # 국가 코드
    postcode: Mapped[str | None] = mapped_column(String(20))  # 우편번호
    address1: Mapped[str | None] = mapped_column(String(200))  # 주소1
    address2: Mapped[str | None] = mapped_column(String(200))  # 주소2
    city: Mapped[str | None] = mapped_column(String(100))  # 도시
    state_province: Mapped[str | None] = mapped_column(String(100))  # 주/도
    source: Mapped[str | None] = mapped_column(String(50))  # 리드 출처 (WEBSITE/REFERRAL/EXHIBITION/COLD_CALL/PARTNER 등)
    source_detail: Mapped[str | None] = mapped_column(String(200))  # 출처 상세 설명
    lead_score: Mapped[int | None] = mapped_column(Integer, default=0)  # 리드 점수 (0-100, Lead Scoring)
    rating: Mapped[str | None] = mapped_column(String(20))  # 등급 (HOT/WARM/COLD)
    interest_product: Mapped[str | None] = mapped_column(String(200))  # 관심 제품
    interest_service: Mapped[str | None] = mapped_column(String(200))  # 관심 서비스
    budget_range: Mapped[str | None] = mapped_column(String(50))  # 예산 범위
    purchase_timeframe: Mapped[str | None] = mapped_column(String(50))  # 구매 시기 (IMMEDIATE/1_MONTH/3_MONTHS/6_MONTHS/1_YEAR)
    owner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 담당 영업자 UUID
    converted_partner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 전환된 거래처 ID
    converted_at: Mapped[datetime | None] = mapped_column(DateTime)  # 전환 일시
    converted_by: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 전환 처리자 UUID
    status: Mapped[str | None] = mapped_column(String(20), default='NEW')  # 상태 (NEW/CONTACTED/QUALIFIED/CONVERTED/LOST)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고