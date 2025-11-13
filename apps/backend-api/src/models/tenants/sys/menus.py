from uuid import UUID as PyUUID
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Menus"]


class Menus(TenantBaseModel):
    """시스템 메뉴 구조를 관리하는 테이블 (계층형 구조 지원)"""
    __tablename__ = "menus"
    __table_args__ = (
        CheckConstraint("depth >= 0 AND depth <= 5", name="ck_menus__depth_range"),
        CheckConstraint("sort_order >= 0", name="ck_menus__sort_order"),
        {"schema": "sys"},
    )

    code: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)  # 메뉴 코드 (시스템 전체 유니크)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 메뉴명
    name_en: Mapped[str | None] = mapped_column(String(200))  # 메뉴명 (영문)
    description: Mapped[str | None] = mapped_column(Text)  # 메뉴 설명
    parent_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("sys.menus.id", ondelete="CASCADE"))  # 부모 메뉴 ID
    depth: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # 메뉴 깊이 (0: 최상위)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # 정렬 순서
    path: Mapped[str | None] = mapped_column(Text)  # 계층 경로 (예: /SYS/SYS_USERS)
    menu_type: Mapped[str] = mapped_column(String(20), nullable=False, default="MENU")  # 메뉴 타입 (MENU/FOLDER/LINK/DIVIDER)
    module_code: Mapped[str | None] = mapped_column(String(50))  # 모듈 코드 (ADM/HRM/CRM 등)
    route_path: Mapped[str | None] = mapped_column(String(500))  # 라우트 경로 (/sys/users)
    component_path: Mapped[str | None] = mapped_column(String(500))  # 컴포넌트 경로 (@/pages/sys/users)
    external_url: Mapped[str | None] = mapped_column(String(1000))  # 외부 링크 URL
    icon: Mapped[str | None] = mapped_column(String(100))  # 아이콘 (lucide icon name)
    icon_type: Mapped[str | None] = mapped_column(String(20))  # 아이콘 타입 (lucide/heroicons/custom)
    badge_text: Mapped[str | None] = mapped_column(String(50))  # 배지 텍스트 (NEW/BETA 등)
    badge_color: Mapped[str | None] = mapped_column(String(20))  # 배지 색상 (blue/green/red 등)
    permission_code: Mapped[str | None] = mapped_column(String(100))  # 필요 권한 코드
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)  # 공개 메뉴 여부 (권한 없이 접근 가능)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True)  # 사이드바 표시 여부
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)  # 즐겨찾기 기본값
    open_in_new_tab: Mapped[bool] = mapped_column(Boolean, default=False)  # 새 탭에서 열기
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)  # 활성 상태
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
