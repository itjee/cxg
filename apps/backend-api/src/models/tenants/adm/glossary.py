from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func, ARRAY
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Glossary"]


class Glossary(TenantBaseModel):
    """용어집 관리 테이블 - 시스템에서 사용되는 비즈니스 용어 정의 및 관리"""
    __tablename__ = "glossary"
    __table_args__ = {"schema": "adm"}

    # 용어 기본 정보
    term_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 용어 코드 (테넌트 내 유니크)
    term_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 용어명 (한글)
    term_name_en: Mapped[str | None] = mapped_column(String(200))  # 용어명 (영문)
    abbreviation: Mapped[str | None] = mapped_column(String(50))  # 약어
    
    # 용어 설명
    definition: Mapped[str] = mapped_column(Text, nullable=False)  # 용어 정의
    description: Mapped[str | None] = mapped_column(Text)  # 상세 설명
    example: Mapped[str | None] = mapped_column(Text)  # 사용 예시
    
    # 분류 정보
    category: Mapped[str | None] = mapped_column(String(50))  # 카테고리 (재무, 구매, 판매, 인사 등)
    domain: Mapped[str | None] = mapped_column(String(50))  # 도메인 (PSM, SRM, FIM, HRM 등)
    tags: Mapped[list[str] | None] = mapped_column(ARRAY(Text))  # 태그 배열 (검색용)
    
    # 관계 정보
    parent_term_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("adm.glossary.id"))  # 상위 용어 ID (계층 구조)
    related_terms: Mapped[list[PyUUID] | None] = mapped_column(ARRAY(UUID))  # 관련 용어 ID 배열
    synonyms: Mapped[list[str] | None] = mapped_column(ARRAY(Text))  # 동의어 배열
    antonyms: Mapped[list[str] | None] = mapped_column(ARRAY(Text))  # 반의어 배열
    
    # 참조 정보
    reference_url: Mapped[str | None] = mapped_column(Text)  # 참조 URL
    reference_document: Mapped[str | None] = mapped_column(Text)  # 참조 문서
    
    # 사용 정보
    usage_count: Mapped[int | None] = mapped_column(Integer, default=0)  # 사용 빈도
    last_used_at: Mapped[DateTime | None] = mapped_column(DateTime)  # 마지막 사용 일시
    
    # 표시 속성
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 표시 순서
    is_important: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 중요 용어 여부
    is_system_term: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 시스템 기본 용어 여부
    
    # 추가 정보
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    
    # 상태 관리
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)  # 활성 상태
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그
