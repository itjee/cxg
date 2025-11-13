from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["FixedAssets"]


class FixedAssets(TenantBaseModel):
    """고정자산: 유형자산 및 무형자산 관리"""
    __tablename__ = "fixed_assets"
    __table_args__ = {"schema": "fam"}

    asset_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 자산 코드
    asset_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 자산명
    asset_category: Mapped[str] = mapped_column(String(50), nullable=False)  # 자산 분류
    asset_type: Mapped[str | None] = mapped_column(String(50))  # 자산 유형
    acquisition_date: Mapped[date] = mapped_column(Date, nullable=False)  # 취득일
    acquisition_method: Mapped[str | None] = mapped_column(String(20))  # 취득 방법 (PURCHASE/LEASE/DONATION/CONSTRUCTION/EXCHANGE)
    acquisition_cost: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 취득가액
    salvage_value: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 잔존가치
    depreciable_cost: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 상각대상 금액 (취득가액 - 잔존가치)
    depreciation_method: Mapped[str] = mapped_column(String(20), nullable=False, default='STRAIGHT_LINE')  # 상각 방법 (STRAIGHT_LINE/DECLINING_BALANCE/SUM_OF_YEARS/UNITS_OF_PRODUCTION)
    useful_life_years: Mapped[int] = mapped_column(Integer, nullable=False)  # 내용연수 (년)
    useful_life_months: Mapped[int] = mapped_column(Integer, nullable=False)  # 내용연수 (월)
    depreciation_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=4))  # 상각률 (%)
    account_code: Mapped[str | None] = mapped_column(String(50))  # 계정과목 코드
    depreciation_account: Mapped[str | None] = mapped_column(String(50))  # 감가상각비 계정
    accumulated_account: Mapped[str | None] = mapped_column(String(50))  # 감가상각누계액 계정
    accumulated_depreciation: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 감가상각누계액
    book_value: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 장부가액 (취득가액 - 감가상각누계액)
    location: Mapped[str | None] = mapped_column(String(200))  # 위치
    department_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 관리 부서 ID
    custodian_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 관리자 ID (사원)
    supplier_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 공급업체 ID
    supplier_name: Mapped[str | None] = mapped_column(String(200))  # 공급업체명 (스냅샷)
    manufacturer: Mapped[str | None] = mapped_column(String(200))  # 제조사
    model_number: Mapped[str | None] = mapped_column(String(100))  # 모델번호
    serial_number: Mapped[str | None] = mapped_column(String(100))  # 일련번호
    warranty_start_date: Mapped[date | None] = mapped_column(Date)  # 보증 시작일
    warranty_end_date: Mapped[date | None] = mapped_column(Date)  # 보증 종료일
    maintenance_cycle: Mapped[int | None] = mapped_column(Integer)  # 정기점검 주기 (월)
    last_maintenance_date: Mapped[date | None] = mapped_column(Date)  # 최근 점검일
    next_maintenance_date: Mapped[date | None] = mapped_column(Date)  # 다음 점검일
    disposal_date: Mapped[date | None] = mapped_column(Date)  # 처분일
    disposal_method: Mapped[str | None] = mapped_column(String(20))  # 처분 방법 (SALE/DISCARD/DONATION/EXCHANGE/LOSS)
    disposal_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 처분가액
    disposal_gain_loss: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 처분손익
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='IN_USE')  # 상태 (IN_USE/IDLE/UNDER_MAINTENANCE/DISPOSED/LOST)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 삭제 여부