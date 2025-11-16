"""Manager IDAM Roles - Queries

역할 조회 Query 구현
공통 모듈을 사용한 표준화된 조회 로직
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.role import Role as RoleModel

from .types import ManagerRole


def manager_role_to_graphql(role: RoleModel) -> ManagerRole:
    """
    RoleModel(DB 모델)을 Role(GraphQL 타입)으로 변환

    Args:
        role: 데이터베이스 역할 모델

    Returns:
        ManagerRole: GraphQL 역할 타입
    """
    return ManagerRole(
        id=strawberry.ID(str(role.id)),
        code=role.code,
        name=role.name,
        description=role.description,
        category=role.category,
        level=role.level,
        scope=role.scope,
        is_default=role.is_default,
        priority=role.priority,
        status=role.status,
        created_at=role.created_at,
        updated_at=role.updated_at,
    )


async def get_manager_role_by_id(db: AsyncSession, role_id: UUID) -> ManagerRole | None:
    """
    ID로 Manager 역할 단건 조회

    Args:
        db: 데이터베이스 세션
        role_id: 조회할 역할 ID

    Returns:
        Role: 역할 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=RoleModel,
        id_=role_id,
        to_graphql=manager_role_to_graphql,
    )


async def get_manager_roles(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    category: str | None = None,
    status: str | None = None,
) -> list[ManagerRole]:
    """
    Manager 역할 목록 조회

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 (기본값: 20)
        offset: 건너뛸 개수 (페이징용)
        category: 카테고리 필터 (선택)
        status: 상태 필터 (선택)

    Returns:
        list[Role]: 역할 객체 리스트
    """
    # 필터 조건 구성
    filters = {}
    if category:
        filters["category"] = category
    if status:
        filters["status"] = status

    # 공통 모듈을 사용한 리스트 조회
    return await get_list(
        db=db,
        model_class=RoleModel,
        to_graphql=manager_role_to_graphql,
        limit=limit,
        offset=offset,
        order_by=RoleModel.priority,  # 우선순위 순으로 정렬
        **filters,
    )


@strawberry.type
class ManagerRoleQueries:
    """
    Manager IDAM Roles Query

    역할 관련 GraphQL 쿼리를 제공합니다.
    """

    @strawberry.field(description="Manager 역할 조회 (ID)")
    async def role(self, info, id: strawberry.ID) -> "ManagerRole | None":
        """
        ID로 역할 단건 조회

        Args:
            id: 역할 ID

        Returns:
            Role: 역할 객체 또는 None
        """
        db = info.context.manager_db_session
        return await get_manager_role_by_id(db, UUID(id))

    @strawberry.field(description="Manager 역할 목록")
    async def roles(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        category: str | None = None,
        status: str | None = None,
    ) -> "list[ManagerRole]":
        """
        역할 목록 조회 (페이징 및 필터링 지원)

        Args:
            limit: 조회 개수
            offset: 건너뛸 개수
            category: 카테고리 필터
            status: 상태 필터

        Returns:
            list[ManagerRole]: 역할 객체 리스트
        """
        db = info.context.manager_db_session
        return await get_manager_roles(db, limit, offset, category, status)
