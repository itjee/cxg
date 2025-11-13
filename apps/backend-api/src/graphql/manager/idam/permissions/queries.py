"""Manager IDAM Permissions - Queries

Manager 시스템 권한 조회 Query 구현
RBAC 시스템의 권한 관리를 위한 조회 기능을 제공합니다.
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.permission import Permission as PermissionModel

from .types import ManagerPermission


def permission_to_graphql(permission: PermissionModel) -> ManagerPermission:
    """
    PermissionModel(DB 모델)을 ManagerPermission(GraphQL 타입)으로 변환

    Args:
        permission: 데이터베이스 권한 모델

    Returns:
        ManagerPermission: GraphQL 타입
    """
    return ManagerPermission(
        id=strawberry.ID(str(permission.id)),
        code=permission.code,
        name=permission.name,
        description=permission.description,
        category=permission.category,
        resource=permission.resource,
        action=permission.action,
        scope=permission.scope,
        applies_to=permission.applies_to,
        is_system=permission.is_system,
        status=permission.status,
        created_at=permission.created_at,
        updated_at=permission.updated_at,
    )


async def get_manager_permission_by_id(
    db: AsyncSession, permission_id: UUID
) -> ManagerPermission | None:
    """
    ID로 Manager 권한 단건 조회

    Args:
        db: 데이터베이스 세션
        permission_id: 조회할 권한 ID

    Returns:
        ManagerPermission: 권한 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=PermissionModel,
        id_=permission_id,
        to_graphql=permission_to_graphql,
    )


async def get_manager_permissions(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0,
    category: str | None = None,
    resource: str | None = None,
    status: str | None = None,
) -> list[ManagerPermission]:
    """
    Manager 권한 목록 조회

    카테고리, 리소스, 상태별로 필터링하여 권한을 조회합니다.
    RBAC 시스템 구성 시 사용 가능한 권한 목록을 확인하는데 사용됩니다.

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 제한 (기본값: 50)
        offset: 건너뛸 개수 (페이징용)
        category: 카테고리 필터 (예: "사용자 관리", "시스템 설정")
        resource: 리소스 필터 (예: "users", "tenants")
        status: 상태 필터 (ACTIVE, INACTIVE)

    Returns:
        list[ManagerPermission]: 권한 객체 리스트

    Note:
        카테고리 → 리소스 → 액션 순으로 정렬됩니다.
        이를 통해 권한을 계층적으로 표시할 수 있습니다.

    사용 예:
        # 사용자 관리 관련 권한만 조회
        perms = await get_manager_permissions(db, category="사용자 관리")

        # users 리소스의 활성 권한 조회
        perms = await get_manager_permissions(db, resource="users", status="ACTIVE")
    """
    # 필터 조건 구성
    filters = {}
    if category:
        filters["category"] = category
    if resource:
        filters["resource"] = resource
    if status:
        filters["status"] = status

    return await get_list(
        db=db,
        model_class=PermissionModel,
        to_graphql=permission_to_graphql,
        limit=limit,
        offset=offset,
        order_by=[
            PermissionModel.category,  # 1차: 카테고리별 그룹화
            PermissionModel.resource,  # 2차: 리소스별 그룹화
            PermissionModel.action,  # 3차: 액션별 정렬
        ],
        **filters,
    )


@strawberry.type
class ManagerPermissionQueries:
    """
    Manager IDAM Permissions Query

    Manager 시스템의 권한 조회 관련 GraphQL Query들을 제공합니다.
    """

    @strawberry.field(description="Manager 권한 조회 (ID)")
    async def manager_permission(self, info, id: strawberry.ID) -> ManagerPermission | None:
        """
        ID로 권한 단건 조회

        Args:
            id: 권한 ID

        Returns:
            ManagerPermission: 권한 객체 또는 None
        """
        db = info.context.manager_db_session
        return await get_manager_permission_by_id(db, UUID(id))

    @strawberry.field(description="Manager 권한 목록")
    async def manager_permissions(
        self,
        info,
        limit: int = 50,
        offset: int = 0,
        category: str | None = None,
        resource: str | None = None,
        status: str | None = None,
    ) -> list[ManagerPermission]:
        """
        권한 목록 조회 (페이징 및 필터링 지원)

        역할에 권한을 할당하거나, 사용 가능한 권한 목록을 확인할 때 사용합니다.

        Args:
            limit: 조회 개수 (기본값: 50)
            offset: 건너뛸 개수
            category: 카테고리 필터 (선택)
            resource: 리소스 필터 (선택)
            status: 상태 필터 (선택)

        Returns:
            list[ManagerPermission]: 권한 객체 리스트

        사용 예:
            # 모든 활성 권한 조회
            query {
              managerPermissions(status: "ACTIVE") {
                id code name category resource action
              }
            }

            # 사용자 관리 권한만 조회
            query {
              managerPermissions(category: "사용자 관리") {
                id code name action
                roles { id name }
              }
            }
        """
        db = info.context.manager_db_session
        return await get_manager_permissions(db, limit, offset, category, resource, status)
