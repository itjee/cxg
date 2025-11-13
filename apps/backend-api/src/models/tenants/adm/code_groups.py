from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["CodeGroups"]


class CodeGroups(TenantBaseModel):
    """공통코드 그룹 테이블 - 시스템 전체에서 사용하는 코드 분류 관리 (com 스키마 통합)"""
    __tablename__ = "code_groups"
    __table_args__ = {"schema": "adm"}

    code: Mapped[str] = mapped_column(String(50), nullable=False)  # 그룹 코드 (영대문자, 숫자, 언더스코어 2-50자)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 그룹명
    name_en: Mapped[str | None] = mapped_column(String(200))  # 그룹 영문명 (다국어 지원)
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    
    # 계층 구조
    parent_group_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("adm.code_groups.id"))  # 상위 그룹 식별자
    level: Mapped[int | None] = mapped_column(Integer, default=1)  # 그룹 레벨 (1부터 시작)
    
    # UI 표시 속성 (com 통합)
    sort_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 정렬 순서
    icon_name: Mapped[str | None] = mapped_column(String(50))  # 아이콘 이름
    color_code: Mapped[str | None] = mapped_column(String(7))  # 색상 코드 (#RRGGBB)
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    
    # 상태 관리
    is_system: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 시스템 기본 그룹 여부
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)  # 활성 여부
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그