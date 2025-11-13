"""API router for menus."""

from typing import Any, List, Dict
from uuid import UUID

from fastapi import Depends, Query, Body, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import (
    MenusCreate,
    MenusListResponse,
    MenusResponse,
    MenusUpdate,
    MenuTreeResponse,
)
from .service import MenusService


router = AuditedAPIRouter()


@router.post(
    "",
    response_model=EnvelopeResponse[MenusResponse],
    status_code=status.HTTP_201_CREATED,
    summary="메뉴 생성",
    description="새로운 메뉴를 생성합니다.",
)
async def create_menu(
    data: MenusCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[MenusResponse]:
    """메뉴 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await MenusService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[MenusListResponse],
    summary="메뉴 목록 조회",
    description="메뉴 목록을 조회합니다 (페이지네이션, 필터링 지원).",
)
async def get_menus_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    menu_type: str | None = Query(None, description="메뉴 타입 필터 (MENU/FOLDER/LINK/DIVIDER)"),
    module_code: str | None = Query(None, description="모듈 코드 필터"),
    parent_id: UUID | None = Query(None, description="부모 메뉴 ID 필터"),
    is_active: bool | None = Query(None, description="활성 상태 필터"),
    is_visible: bool | None = Query(None, description="표시 여부 필터"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[MenusListResponse]:
    """메뉴 목록 조회"""
    items = await MenusService.get_list(
        db,
        page=page,
        page_size=page_size,
        menu_type=menu_type,
        module_code=module_code,
        parent_id=parent_id,
        is_active=is_active,
        is_visible=is_visible,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/tree",
    response_model=EnvelopeResponse[MenuTreeResponse],
    summary="메뉴 트리 조회",
    description="계층형 메뉴 트리 구조를 조회합니다.",
)
async def get_menus_tree(
    is_active: bool | None = Query(True, description="활성 메뉴만 조회"),
    is_visible: bool | None = Query(True, description="표시 메뉴만 조회"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[MenuTreeResponse]:
    """메뉴 트리 조회"""
    tree = await MenusService.get_tree(
        db,
        is_active=is_active,
        is_visible=is_visible,
    )
    return EnvelopeResponse.success_response(tree)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[MenusResponse],
    summary="메뉴 상세 조회",
    description="메뉴 상세 정보를 조회합니다.",
)
async def get_menu(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[MenusResponse]:
    """메뉴 상세 조회"""
    item = await MenusService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[MenusResponse],
    summary="메뉴 수정",
    description="메뉴 정보를 수정합니다.",
)
async def update_menu(
    item_id: UUID,
    data: MenusUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[MenusResponse]:
    """메뉴 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await MenusService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="메뉴 삭제",
    description="메뉴를 삭제합니다 (논리 삭제).",
)
async def delete_menu(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> None:
    """메뉴 삭제"""
    await MenusService.delete(db, item_id)


@router.post(
    "/sort-order",
    response_model=EnvelopeResponse[List[MenusResponse]],
    summary="메뉴 정렬 순서 변경",
    description="여러 메뉴의 정렬 순서를 일괄 변경합니다.",
)
async def update_menu_sort_order(
    updates: List[Dict[str, Any]] = Body(..., description="정렬 순서 변경 목록 [{id, sort_order}, ...]"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[List[MenusResponse]]:
    """메뉴 정렬 순서 변경"""
    updater_id = UUID(current_user["user_id"])
    items = await MenusService.update_sort_order(db, updates, updated_by=updater_id)
    return EnvelopeResponse.success_response(items)
