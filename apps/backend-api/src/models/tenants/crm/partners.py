from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["Partners"]


class Partners(TenantBaseModel):
    """거래처 마스터 정보 - 고객, 공급업체, 기타 거래처 통합 관리"""
    __tablename__ = "partners"
    __table_args__ = {"schema": "crm"}

    code: Mapped[str] = mapped_column(String(50), nullable=False)  # 거래처 코드 (사내 규칙, 영대문자/숫자/언더스코어 2-50자)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 거래처명
    name_en: Mapped[str | None] = mapped_column(String(200))  # 거래처명 (영문)
    partner_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 거래처 유형 (CUSTOMER: 매출거래처, SUPPLIER: 매입거래처, BOTH: 겸업, OTHER: 기타)
    tax_no: Mapped[str | None] = mapped_column(String(50))  # 법인등록번호/세무번호
    business_no: Mapped[str | None] = mapped_column(String(20))  # 사업자등록번호
    business_name: Mapped[str | None] = mapped_column(String(200))  # 상호(법인명)
    business_type: Mapped[str | None] = mapped_column(String(1), default='C')  # 사업자구분 (C: 법인, S: 개인)
    business_kind: Mapped[str | None] = mapped_column(String(100))  # 업태
    business_item: Mapped[str | None] = mapped_column(String(100))  # 종목
    ceo_name: Mapped[str | None] = mapped_column(String(50))  # 대표자명
    postcode: Mapped[str | None] = mapped_column(String(10))  # 우편번호
    address1: Mapped[str | None] = mapped_column(String(200))  # 주소1 (기본주소)
    address2: Mapped[str | None] = mapped_column(String(200))  # 주소2 (상세주소)
    phone: Mapped[str | None] = mapped_column(String(50))  # 거래처 전화번호
    fax: Mapped[str | None] = mapped_column(String(50))  # 팩스번호
    email: Mapped[str | None] = mapped_column(String(255))  # 거래처 이메일
    website: Mapped[str | None] = mapped_column(String(255))  # 웹사이트 URL
    payment_terms: Mapped[str | None] = mapped_column(String(20))  # 결제 조건 (COD: 착불, NET7~90: 후불일수, PREPAID: 선불)
    credit_limit: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2), default=0)  # 신용 한도
    currency_code: Mapped[str | None] = mapped_column(String(3), ForeignKey("adm.currencies.id"), default='KRW')  # 거래 통화 (ISO 4217, 예: KRW, USD)
    industry: Mapped[str | None] = mapped_column(String(100))  # 산업/업종
    employee_count: Mapped[int | None] = mapped_column(Integer)  # 직원 수
    annual_revenue: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 연매출액
    established_date: Mapped[date | None] = mapped_column(Date)  # 설립일
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='ACTIVE')  # 상태 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 정지, CLOSED: 폐쇄)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그