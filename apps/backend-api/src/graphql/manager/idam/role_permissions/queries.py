"""Manager IDAM Role Permissions - Queries

공통 모듈을 사용한 Query 구현
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.role_permission import RolePermission as RolePermissionModel

from .types import ManagerRolePermission


def role_permission_to_graphql(role_permission: RolePermissionModel) -> ManagerRolePermission:
    """RolePermissionModel을 ManagerRolePermission GraphQL 타입으로 변환"""
    return ManagerRolePermission(
        id=strawberry.ID(str(role_permission.id)),
        role_id=strawberry.ID(str(role_permission.role_id)),
        permission_id=strawberry.ID(str(role_permission.permission_id)),
        granted_at=role_permission.granted_at,
        granted_by=strawberry.ID(str(role_permission.granted_by))
        if role_permission.granted_by
        else None,
        created_at=role_permission.created_at,
        updated_at=role_permission.updated_at,
    )


async def get_manager_role_permission_by_id(
    db: AsyncSession, role_permission_id: UUID
) -> ManagerRolePermission | None:
    """ID로 Manager 역할-권한 매핑 조회"""
    return await get_by_id(
        db=db,
        model_class=RolePermissionModel,
        id_=role_permission_id,
        to_graphql=role_permission_to_graphql,
    )


async def get_manager_role_permissions(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0,
    role_id: UUID | None = None,
    permission_id: UUID | None = None,
) -> list[ManagerRolePermission]:
    """Manager 역할-권한 매핑 목록 조회"""
    filters = {}
    if role_id:
        filters["role_id"] = role_id
    if permission_id:
        filters["permission_id"] = permission_id

    return await get_list(
        db=db,
        model_class=RolePermissionModel,
        to_graphql=role_permission_to_graphql,
        limit=limit,
        offset=offset,
        order_by=RolePermissionModel.created_at.desc(),
        **filters,
    )


async def get_permissions_by_role_id(
    db: AsyncSession, role_id: UUID
) -> list[ManagerRolePermission]:
    """특정 역할에 할당된 모든 권한 조회"""
    return await get_manager_role_permissions(
        db=db,
        role_id=role_id,
        limit=1000,
    )


async def get_roles_by_permission_id(
    db: AsyncSession, permission_id: UUID
) -> list[ManagerRolePermission]:
    """특정 권한이 할당된 모든 역할 조회"""
    return await get_manager_role_permissions(
        db=db,
        permission_id=permission_id,
        limit=1000,
    )


@strawberry.type
class ManagerRolePermissionQueries:
    """Manager IDAM Role Permissions Query"""

    @strawberry.field(description="Manager 역할-권한 매핑 조회 (ID)")
    async def manager_role_permission(
        self, info, id: strawberry.ID
    ) -> ManagerRolePermission | None:
        """Manager 역할-권한 매핑 단건 조회"""
        db = info.context.manager_db_session
        return await get_manager_role_permission_by_id(db, UUID(id))

    @strawberry.field(description="Manager 역할-권한 매핑 목록")
    async def manager_role_permissions(
        self,
        info,
        limit: int = 50,
        offset: int = 0,
        role_id: strawberry.ID | None = None,
        permission_id: strawberry.ID | None = None,
    ) -> list[ManagerRolePermission]:
        """Manager 역할-권한 매핑 목록 조회"""
        db = info.context.manager_db_session
        return await get_manager_role_permissions(
            db,
            limit,
            offset,
            UUID(role_id) if role_id else None,
            UUID(permission_id) if permission_id else None,
        )

    @strawberry.field(description="역할에 할당된 권한 목록")
    async def manager_permissions_by_role(
        self, info, role_id: strawberry.ID
    ) -> list[ManagerRolePermission]:
        """특정 역할에 할당된 모든 권한 조회"""
        db = info.context.manager_db_session
        return await get_permissions_by_role_id(db, UUID(role_id))

    @strawberry.field(description="권한이 할당된 역할 목록")
    async def manager_roles_by_permission(
        self, info, permission_id: strawberry.ID
    ) -> list[ManagerRolePermission]:
        """특정 권한이 할당된 모든 역할 조회"""
        db = info.context.manager_db_session
        return await get_roles_by_permission_id(db, UUID(permission_id))
