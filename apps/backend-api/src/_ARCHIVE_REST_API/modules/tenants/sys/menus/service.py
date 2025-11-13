"""Service for menus business logic."""

from datetime import datetime, timezone
from uuid import UUID
from typing import List, Dict, Any

from fastapi import HTTPException, status
from sqlalchemy import func, select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.sys import Menus

from .schemas import (
    MenusCreate,
    MenusListResponse,
    MenusResponse,
    MenusUpdate,
    MenuTreeNode,
    MenuTreeResponse,
)


class MenusService:
    """Service class for menus."""

    @staticmethod
    async def create(
        db: AsyncSession, data: MenusCreate, created_by: UUID | None = None
    ) -> MenusResponse:
        """Create a new menu record."""
        item = Menus(
            **data.model_dump(),
            created_by=created_by,
        )

        db.add(item)
        await db.commit()
        await db.refresh(item)

        return MenusResponse.model_validate(item)

    @staticmethod
    async def get_by_id(db: AsyncSession, item_id: UUID) -> MenusResponse:
        """Get menu by ID."""
        stmt = select(Menus).where(Menus.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="메뉴를 찾을 수 없습니다",
            )

        return MenusResponse.model_validate(item)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        menu_type: str | None = None,
        module_code: str | None = None,
        parent_id: UUID | None = None,
        is_active: bool | None = None,
        is_visible: bool | None = None,
    ) -> MenusListResponse:
        """Get menus list with pagination and filters."""
        stmt = select(Menus)

        # Apply filters
        filters = []
        if menu_type:
            filters.append(Menus.menu_type == menu_type)
        if module_code:
            filters.append(Menus.module_code == module_code)
        if parent_id:
            filters.append(Menus.parent_id == parent_id)
        if is_active is not None:
            filters.append(Menus.is_active == is_active)
        if is_visible is not None:
            filters.append(Menus.is_visible == is_visible)

        if filters:
            stmt = stmt.where(and_(*filters))

        # Order by depth and sort_order
        stmt = stmt.order_by(Menus.depth, Menus.sort_order)

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Pagination
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return MenusListResponse(
            items=[MenusResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def get_tree(
        db: AsyncSession,
        is_active: bool | None = True,
        is_visible: bool | None = True,
    ) -> MenuTreeResponse:
        """Get menu tree (hierarchical structure)."""
        stmt = select(Menus)

        # Apply filters
        filters = []
        if is_active is not None:
            filters.append(Menus.is_active == is_active)
        if is_visible is not None:
            filters.append(Menus.is_visible == is_visible)

        if filters:
            stmt = stmt.where(and_(*filters))

        # Order by depth and sort_order
        stmt = stmt.order_by(Menus.depth, Menus.sort_order)

        result = await db.execute(stmt)
        all_menus = result.scalars().all()

        # Build tree structure
        menu_dict: Dict[UUID, MenuTreeNode] = {}
        root_menus: List[MenuTreeNode] = []

        # First pass: create all nodes
        for menu in all_menus:
            node = MenuTreeNode(
                **MenusResponse.model_validate(menu).model_dump(),
                children=[]
            )
            menu_dict[menu.id] = node

        # Second pass: build tree
        for menu in all_menus:
            node = menu_dict[menu.id]
            if menu.parent_id is None:
                root_menus.append(node)
            elif menu.parent_id in menu_dict:
                menu_dict[menu.parent_id].children.append(node)

        return MenuTreeResponse(
            items=root_menus,
            total=len(all_menus),
        )

    @staticmethod
    async def update(
        db: AsyncSession,
        item_id: UUID,
        data: MenusUpdate,
        updated_by: UUID | None = None,
    ) -> MenusResponse:
        """Update menu."""
        stmt = select(Menus).where(Menus.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="메뉴를 찾을 수 없습니다",
            )

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        item.updated_at = datetime.now(timezone.utc)
        item.updated_by = updated_by

        await db.commit()
        await db.refresh(item)

        return MenusResponse.model_validate(item)

    @staticmethod
    async def delete(db: AsyncSession, item_id: UUID) -> None:
        """Delete menu (soft delete)."""
        stmt = select(Menus).where(Menus.id == item_id)
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="메뉴를 찾을 수 없습니다",
            )

        # Soft delete
        item.is_deleted = True
        item.updated_at = datetime.now(timezone.utc)

        await db.commit()

    @staticmethod
    async def update_sort_order(
        db: AsyncSession,
        updates: List[Dict[str, Any]],
        updated_by: UUID | None = None,
    ) -> List[MenusResponse]:
        """Update sort order for multiple menus."""
        updated_items = []

        for update_item in updates:
            item_id = update_item.get("id")
            sort_order = update_item.get("sort_order")

            stmt = select(Menus).where(Menus.id == item_id)
            result = await db.execute(stmt)
            item = result.scalar_one_or_none()

            if item:
                item.sort_order = sort_order
                item.updated_at = datetime.now(timezone.utc)
                item.updated_by = updated_by
                updated_items.append(item)

        await db.commit()

        return [MenusResponse.model_validate(item) for item in updated_items]
