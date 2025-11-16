"""Manager IDAM User Roles - Queries

사용자-역할 매핑 조회 Query 구현
공통 모듈을 사용한 표준화된 조회 로직
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.user_role import UserRole as UserRoleModel

from .types import ManagerUserRole


def manager_user_role_to_graphql(user_role: UserRoleModel) -> ManagerUserRole:
    """
    UserRoleModel(DB 모델)을 UserRole(GraphQL 타입)으로 변환

    Args:
        user_role: 데이터베이스 사용자-역할 매핑 모델

    Returns:
        ManagerUserRole: GraphQL 사용자-역할 매핑 타입
    """
    return ManagerUserRole(
        id=strawberry.ID(str(user_role.id)),
        user_id=strawberry.ID(str(user_role.user_id)),
        role_id=strawberry.ID(str(user_role.role_id)),
        scope=user_role.scope,
        tenant_context=strawberry.ID(str(user_role.tenant_context))
        if user_role.tenant_context
        else None,
        granted_at=user_role.granted_at,
        granted_by=strawberry.ID(str(user_role.granted_by)) if user_role.granted_by else None,
        expires_at=user_role.expires_at,
        status=user_role.status,
        created_at=user_role.created_at,
        updated_at=user_role.updated_at,
    )


async def get_manager_user_role_by_id(
    db: AsyncSession, user_role_id: UUID
) -> "ManagerUserRole | None":
    """
    ID로 Manager 사용자-역할 매핑 단건 조회

    Args:
        db: 데이터베이스 세션
        user_role_id: 조회할 매핑 ID

    Returns:
        ManagerUserRole: 매핑 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=UserRoleModel,
        id_=user_role_id,
        to_graphql=manager_user_role_to_graphql,
    )


async def get_manager_user_roles(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0,
    user_id: UUID | None = None,
    role_id: UUID | None = None,
    scope: str | None = None,
    status: str | None = None,
) -> "list[ManagerUserRole]":
    """
    Manager 사용자-역할 매핑 목록 조회

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 (기본값: 50)
        offset: 건너뛸 개수 (페이징용)
        user_id: 사용자 ID 필터 (선택)
        role_id: 역할 ID 필터 (선택)
        scope: 범위 필터 (선택)
        status: 상태 필터 (선택)

    Returns:
        list[UserRole]: 매핑 객체 리스트
    """
    # 필터 조건 구성
    filters = {}
    if user_id:
        filters["user_id"] = user_id
    if role_id:
        filters["role_id"] = role_id
    if scope:
        filters["scope"] = scope
    if status:
        filters["status"] = status

    # 공통 모듈을 사용한 리스트 조회
    return await get_list(
        db=db,
        model_class=UserRoleModel,
        to_graphql=manager_user_role_to_graphql,
        limit=limit,
        offset=offset,
        order_by=UserRoleModel.created_at.desc(),  # 최신 순으로 정렬
        **filters,
    )


async def get_manager_roles_by_user_id(db: AsyncSession, user_id: UUID) -> "list[ManagerUserRole]":
    """
    특정 사용자에게 할당된 모든 역할 조회

    활성 상태(ACTIVE)의 역할만 조회합니다.

    Args:
        db: 데이터베이스 세션
        user_id: 조회할 사용자 ID

    Returns:
        list[UserRole]: 사용자에게 할당된 역할 매핑 리스트
    """
    return await get_manager_user_roles(
        db=db,
        user_id=user_id,
        status="ACTIVE",
        limit=1000,
    )


async def get_manager_users_by_role_id(db: AsyncSession, role_id: UUID) -> "list[ManagerUserRole]":
    """
    특정 역할이 할당된 모든 사용자 조회

    활성 상태(ACTIVE)의 매핑만 조회합니다.

    Args:
        db: 데이터베이스 세션
        role_id: 조회할 역할 ID

    Returns:
        list[UserRole]: 역할이 할당된 사용자 매핑 리스트
    """
    return await get_manager_user_roles(
        db=db,
        role_id=role_id,
        status="ACTIVE",
        limit=1000,
    )


@strawberry.type
class ManagerUserRoleQueries:
    """
    Manager IDAM User Roles Query

    사용자-역할 매핑 조회 관련 GraphQL 쿼리를 제공합니다.
    """

    @strawberry.field(description="Manager 사용자-역할 매핑 조회 (ID)")
    async def user_role(self, info, id: strawberry.ID) -> "ManagerUserRole | None":
        """
        ID로 사용자-역할 매핑 단건 조회

        Args:
            id: 매핑 ID

        Returns:
            UserRole: 매핑 객체 또는 None
        """
        db = info.context.manager_db_session
        return await get_manager_user_role_by_id(db, UUID(id))

    @strawberry.field(description="Manager 사용자-역할 매핑 목록")
    async def user_roles(
        self,
        info,
        limit: int = 50,
        offset: int = 0,
        user_id: strawberry.ID | None = None,
        role_id: strawberry.ID | None = None,
        scope: str | None = None,
        status: str | None = None,
    ) -> "list[ManagerUserRole]":
        """
        사용자-역할 매핑 목록 조회 (페이징 및 필터링 지원)

        Args:
            limit: 조회 개수
            offset: 건너뛸 개수
            user_id: 사용자 ID 필터
            role_id: 역할 ID 필터
            scope: 범위 필터
            status: 상태 필터

        Returns:
            list[UserRole]: 매핑 객체 리스트
        """
        db = info.context.manager_db_session
        return await get_manager_user_roles(
            db,
            limit,
            offset,
            UUID(user_id) if user_id else None,
            UUID(role_id) if role_id else None,
            scope,
            status,
        )

    @strawberry.field(description="사용자에게 할당된 역할 목록")
    async def roles_by_user(self, info, user_id: strawberry.ID) -> list[ManagerUserRole]:
        """
        특정 사용자에게 할당된 모든 역할 조회

        Args:
            user_id: 사용자 ID

        Returns:
            list[UserRole]: 사용자에게 할당된 역할 매핑 리스트
        """
        db = info.context.manager_db_session
        return await get_manager_roles_by_user_id(db, UUID(user_id))

    @strawberry.field(description="역할이 할당된 사용자 목록")
    async def users_by_role(self, info, role_id: strawberry.ID) -> list[ManagerUserRole]:
        """
        특정 역할이 할당된 모든 사용자 조회

        Args:
            role_id: 역할 ID

        Returns:
            list[UserRole]: 역할이 할당된 사용자 매핑 리스트
        """
        db = info.context.manager_db_session
        return await get_manager_users_by_role_id(db, UUID(role_id))
