from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Contracts"]


class Contracts(TenantBaseModel):
    """거래처 계약/약정 관리 테이블 - 거래처와의 계약 조건 관리"""
    __tablename__ = "contracts"
    __table_args__ = {"schema": "crm"}

    partner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 거래처 식별자
    contract_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)  # 계약 코드 (고유)
    contract_type: Mapped[str] = mapped_column(String(30), nullable=False)  # 계약 유형 (PURCHASE: 구매, SUPPLY: 공급, AGENCY: 대리점, EXCLUSIVE: 배타적, SERVICE: 서비스, OTHER: 기타)
    contract_title: Mapped[str | None] = mapped_column(String(200))  # 계약 제목/명칭
    contract_date: Mapped[date] = mapped_column(Date, nullable=False)  # 계약 체결일
    start_date: Mapped[date] = mapped_column(Date, nullable=False)  # 계약 시작일 (효력 발생일)
    end_date: Mapped[date | None] = mapped_column(Date)  # 계약 종료일 (NULL이면 무기한)
    renewal_date: Mapped[date | None] = mapped_column(Date)  # 갱신 예정일
    is_auto_renewal: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 자동 갱신 여부 (true: 자동갱신, false: 별도 합의 필요)
    contract_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 계약 금액
    contract_currency: Mapped[str | None] = mapped_column(String(3), ForeignKey("adm.currencies.id"), default='KRW')  # 계약 통화 (ISO 4217)
    payment_terms: Mapped[str | None] = mapped_column(String(100))  # 결제 조건 (예: NET30, COD 등)
    signatory_company: Mapped[str | None] = mapped_column(String(200))  # 우리 회사 서명자/담당자
    signatory_partner: Mapped[str | None] = mapped_column(String(200))  # 거래처 서명자/담당자
    contract_file_path: Mapped[str | None] = mapped_column(String(500))  # 계약서 파일 저장 경로
    contract_file_name: Mapped[str | None] = mapped_column(String(255))  # 계약서 파일명
    contract_notes: Mapped[str | None] = mapped_column(Text)  # 계약 조건, 특수 약정, 비고
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='ACTIVE')  # 계약 상태 (ACTIVE: 활성, EXPIRED: 만료, TERMINATED: 해지, SUSPENDED: 중단, DRAFT: 작성중)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그