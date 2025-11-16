"""Manager IDAM Role Permissions - Queries

역할-권한 매핑 조회 Query 구현

주요 기능:
- ID로 단건 조회
- 필터링을 통한 목록 조회 (역할별/권한별)
- 공통 모듈의 get_by_id, get_list 유틸리티 활용
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.role_permission import RolePermission as RolePermissionModel

from .types import ManagerRolePermission


def manager_role_permission_to_graphql(
    role_permission: RolePermissionModel,
) -> ManagerRolePermission:
    """RolePermissionModel을 RolePermission GraphQL 타입으로 변환
    Args:
        role_permission: SQLAlchemy 모델 인스턴스

    Returns:
        GraphQL 타입으로 변환된 객체

    Note:
        UUID는 문자열로, None 값은 적절히 처리하여 변환
    """
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
) -> "ManagerRolePermission | None":
    """ID로 Manager 역할-권한 매핑 조회

    Args:
        db: 비동기 DB 세션
        role_permission_id: 조회할 매핑 ID

    Returns:
        역할-권한 매핑 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=RolePermissionModel,
        id_=role_permission_id,
        to_graphql=manager_role_permission_to_graphql,
    )


async def get_manager_role_permissions(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0,
    role_id: UUID | None = None,
    permission_id: UUID | None = None,
) -> "list[ManagerRolePermission]":
    """Manager 역할-권한 매핑 목록 조회

    Args:
        db: 비동기 DB 세션
        limit: 최대 반환 개수
        offset: 조회 시작 위치
        role_id: 특정 역할로 필터링 (선택)
        permission_id: 특정 권한으로 필터링 (선택)

    Returns:
        역할-권한 매핑 객체 목록
    """
    filters = {}
    if role_id:
        filters["role_id"] = role_id
    if permission_id:
        filters["permission_id"] = permission_id

    return await get_list(
        db=db,
        model_class=RolePermissionModel,
        to_graphql=manager_role_permission_to_graphql,
        limit=limit,
        offset=offset,
        order_by=RolePermissionModel.created_at.desc(),
        **filters,
    )


async def get_manager_permissions_by_role_id(
    db: AsyncSession, role_id: UUID
) -> "list[ManagerRolePermission]":
    """특정 역할에 할당된 모든 권한 조회

    Args:
        db: 비동기 DB 세션
        role_id: 역할 ID

    Returns:
        해당 역할에 할당된 모든 권한 매핑 목록
    """
    return await get_manager_role_permissions(
        db=db,
        role_id=role_id,
        limit=1000,
    )


async def get_manager_roles_by_permission_id(
    db: AsyncSession, permission_id: UUID
) -> "list[ManagerRolePermission]":
    """특정 권한이 할당된 모든 역할 조회

    Args:
        db: 비동기 DB 세션
        permission_id: 권한 ID

    Returns:
        해당 권한이 할당된 모든 역할 매핑 목록
    """
    return await get_manager_role_permissions(
        db=db,
        permission_id=permission_id,
        limit=1000,
    )


@strawberry.type
class ManagerRolePermissionQueries:
    """Manager IDAM Role Permissions Query

    역할-권한 매핑 조회를 위한 GraphQL Query 정의
    """

    @strawberry.field(description="Manager 역할-권한 매핑 조회 (ID)")
    async def role_permission(self, info, id: strawberry.ID) -> "ManagerRolePermission | None":
        """Manager 역할-권한 매핑 단건 조회

        특정 ID의 역할-권한 매핑을 조회합니다.
        """
        db = info.context.manager_db_session
        return await get_manager_role_permission_by_id(db, UUID(id))

    @strawberry.field(description="Manager 역할-권한 매핑 목록")
    async def role_permissions(
        self,
        info,
        limit: int = 50,
        offset: int = 0,
        role_id: strawberry.ID | None = None,
        permission_id: strawberry.ID | None = None,
    ) -> "list[ManagerRolePermission]":
        """Manager 역할-권한 매핑 목록 조회

        역할 ID 또는 권한 ID로 필터링하여 매핑 목록을 조회합니다.
        페이지네이션을 지원합니다.
        """
        db = info.context.manager_db_session
        return await get_manager_role_permissions(
            db,
            limit,
            offset,
            UUID(role_id) if role_id else None,
            UUID(permission_id) if permission_id else None,
        )

    @strawberry.field(description="역할에 할당된 권한 목록")
    async def permissions_by_role(
        self, info, role_id: strawberry.ID
    ) -> "list[ManagerRolePermission]":
        """특정 역할에 할당된 모든 권한 조회

        역할 ID로 해당 역할이 가진 모든 권한을 조회합니다.
        """
        db = info.context.manager_db_session
        return await get_manager_permissions_by_role_id(db, UUID(role_id))

    @strawberry.field(description="권한이 할당된 역할 목록")
    async def roles_by_permission(
        self, info, permission_id: strawberry.ID
    ) -> "list[ManagerRolePermission]":
        """특정 권한이 할당된 모든 역할 조회

        권한 ID로 해당 권한을 가진 모든 역할을 조회합니다.
        """
        db = info.context.manager_db_session
        return await get_manager_roles_by_permission_id(db, UUID(permission_id))
