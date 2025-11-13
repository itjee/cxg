"""
시스템 메뉴 구조를 관리하는 테이블 (계층형 구조 지원)

Pydantic schemas for Menus model.
"""

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from uuid import UUID


class MenusBase(BaseModel):
    """Base schema for Menus"""
    model_config = ConfigDict(from_attributes=True)

    code: str = Field(max_length=100, description="메뉴 코드 (시스템 전체 유니크)")
    name: str = Field(max_length=200, description="메뉴명")
    name_en: str | None = Field(None, max_length=200, description="메뉴명 (영문)")
    description: str | None = Field(None, description="메뉴 설명")
    parent_id: UUID | None = Field(None, description="부모 메뉴 ID (NULL이면 최상위 메뉴)")
    depth: int = Field(default=0, ge=0, le=5, description="메뉴 깊이 (0: 최상위)")
    sort_order: int = Field(default=0, ge=0, description="정렬 순서")
    path: str | None = Field(None, description="계층 경로")
    menu_type: str = Field(default="MENU", max_length=20, description="메뉴 타입 (MENU/FOLDER/LINK/DIVIDER)")
    module_code: str | None = Field(None, max_length=50, description="모듈 코드")
    route_path: str | None = Field(None, max_length=500, description="라우트 경로")
    component_path: str | None = Field(None, max_length=500, description="컴포넌트 경로")
    external_url: str | None = Field(None, max_length=1000, description="외부 링크 URL")
    icon: str | None = Field(None, max_length=100, description="아이콘")
    icon_type: str | None = Field(None, max_length=20, description="아이콘 타입")
    badge_text: str | None = Field(None, max_length=50, description="배지 텍스트")
    badge_color: str | None = Field(None, max_length=20, description="배지 색상")
    permission_code: str | None = Field(None, max_length=100, description="필요 권한 코드")
    is_public: bool = Field(default=False, description="공개 메뉴 여부")
    is_visible: bool = Field(default=True, description="사이드바 표시 여부")
    is_favorite: bool = Field(default=False, description="즐겨찾기 기본값")
    open_in_new_tab: bool = Field(default=False, description="새 탭에서 열기")
    is_active: bool = Field(default=True, description="활성 상태")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class MenusCreate(MenusBase):
    """Schema for creating Menus"""
    pass


class MenusUpdate(BaseModel):
    """Schema for updating Menus (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    code: str | None = Field(None, max_length=100, description="메뉴 코드")
    name: str | None = Field(None, max_length=200, description="메뉴명")
    name_en: str | None = Field(None, max_length=200, description="메뉴명 (영문)")
    description: str | None = Field(None, description="메뉴 설명")
    parent_id: UUID | None = Field(None, description="부모 메뉴 ID")
    depth: int | None = Field(None, ge=0, le=5, description="메뉴 깊이")
    sort_order: int | None = Field(None, ge=0, description="정렬 순서")
    path: str | None = Field(None, description="계층 경로")
    menu_type: str | None = Field(None, max_length=20, description="메뉴 타입")
    module_code: str | None = Field(None, max_length=50, description="모듈 코드")
    route_path: str | None = Field(None, max_length=500, description="라우트 경로")
    component_path: str | None = Field(None, max_length=500, description="컴포넌트 경로")
    external_url: str | None = Field(None, max_length=1000, description="외부 링크 URL")
    icon: str | None = Field(None, max_length=100, description="아이콘")
    icon_type: str | None = Field(None, max_length=20, description="아이콘 타입")
    badge_text: str | None = Field(None, max_length=50, description="배지 텍스트")
    badge_color: str | None = Field(None, max_length=20, description="배지 색상")
    permission_code: str | None = Field(None, max_length=100, description="필요 권한 코드")
    is_public: bool | None = Field(None, description="공개 메뉴 여부")
    is_visible: bool | None = Field(None, description="사이드바 표시 여부")
    is_favorite: bool | None = Field(None, description="즐겨찾기 기본값")
    open_in_new_tab: bool | None = Field(None, description="새 탭에서 열기")
    is_active: bool | None = Field(None, description="활성 상태")
    is_deleted: bool | None = Field(None, description="논리 삭제 플래그")


class MenusResponse(MenusBase):
    """Schema for Menus response"""
    id: UUID = Field(description="메뉴 고유 식별자")
    created_at: datetime = Field(description="등록 일시")
    created_by: UUID | None = Field(None, description="등록자 UUID")
    updated_at: datetime | None = Field(None, description="수정 일시")
    updated_by: UUID | None = Field(None, description="수정자 UUID")


class MenuTreeNode(MenusResponse):
    """Schema for hierarchical menu tree"""
    children: List['MenuTreeNode'] = Field(default_factory=list, description="하위 메뉴 목록")


class MenusListResponse(BaseModel):
    """Schema for paginated Menus list"""
    model_config = ConfigDict(from_attributes=True)

    items: List[MenusResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class MenuTreeResponse(BaseModel):
    """Schema for menu tree response"""
    model_config = ConfigDict(from_attributes=True)

    items: List[MenuTreeNode]
    total: int


# Enable forward references for recursive model
MenuTreeNode.model_rebuild()
