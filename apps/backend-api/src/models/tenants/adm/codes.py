from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Codes"]


class Codes(TenantBaseModel):
    """공통코드 테이블 - 시스템 전체에서 사용하는 코드값 관리 (com 스키마 통합)"""
    __tablename__ = "codes"
    __table_args__ = {"schema": "adm"}

    group_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("adm.code_groups.id"), nullable=False)  # 코드그룹 식별자
    code: Mapped[str] = mapped_column(String(50), nullable=False)  # 코드값 (영대문자, 숫자, 언더스코어 1-50자)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 코드명
    name_en: Mapped[str | None] = mapped_column(String(200))  # 영문 코드명 (다국어 지원)
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    
    # 계층 구조 (com 통합)
    parent_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("adm.codes.id"))  # 상위 코드 식별자
    level_depth: Mapped[int | None] = mapped_column(Integer, default=1)  # 계층 깊이
    
    # 확장 속성 (com 통합)
    attribute1: Mapped[str | None] = mapped_column(String(100))  # 추가 속성1
    attribute2: Mapped[str | None] = mapped_column(String(100))  # 추가 속성2
    attribute3: Mapped[str | None] = mapped_column(String(100))  # 추가 속성3
    attribute4: Mapped[str | None] = mapped_column(String(100))  # 추가 속성4
    attribute5: Mapped[str | None] = mapped_column(String(100))  # 추가 속성5
    attributes: Mapped[dict | None] = mapped_column(JSON)  # 추가 속성 (JSON 형식)
    
    # UI 표시 속성 (com 통합)
    sort_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 정렬 순서
    icon_name: Mapped[str | None] = mapped_column(String(50))  # 아이콘 이름
    color_code: Mapped[str | None] = mapped_column(String(7))  # 색상 코드 (#RRGGBB)
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    
    # 상태 관리
    is_system: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 시스템 코드 여부
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)  # 활성 여부
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그