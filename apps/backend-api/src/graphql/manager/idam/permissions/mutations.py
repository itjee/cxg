"""Manager IDAM Permissions - Mutations

Manager 시스템 권한 생성 및 수정 Mutation 구현
RBAC 시스템의 권한 정의 및 관리 기능을 제공합니다.
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import create_entity, update_entity
from src.models.manager.idam.permission import Permission as PermissionModel

from .queries import manager_permission_to_graphql
from .types import ManagerPermission, ManagerPermissionCreateInput, ManagerPermissionUpdateInput


async def create_manager_permission(
    db: AsyncSession, input_data: ManagerPermissionCreateInput
) -> ManagerPermission:
    """
    Manager 권한 생성

    새로운 권한을 정의하여 RBAC 시스템에 추가합니다.
    생성된 권한은 역할(Role)에 할당하여 사용자에게 부여할 수 있습니다.

    Args:
        db: 데이터베이스 세션
        input_data: 권한 생성 입력 데이터

    Returns:
        Permission: 생성된 권한 객체

    Note:
        - code는 시스템 전체에서 고유해야 합니다
        - is_system=True로 설정된 권한은 수정/삭제가 불가능합니다
        - 권한 생성 후에는 역할에 할당해야 실제로 사용됩니다

    사용 예:
        권한 정의 → 역할에 할당 → 사용자에게 역할 부여
    """
    return await create_entity(
        db=db,
        model_class=PermissionModel,
        input_data=input_data,
        to_graphql=manager_permission_to_graphql,
    )


async def update_manager_permission(
    db: AsyncSession, permission_id: UUID, input_data: ManagerPermissionUpdateInput
) -> ManagerPermission | None:
    """
    Manager 권한 수정

    기존 권한의 정보를 수정합니다.

    Args:
        db: 데이터베이스 세션
        permission_id: 수정할 권한 ID
        input_data: 권한 수정 입력 데이터

    Returns:
        Permission: 수정된 권한 객체 또는 None

    제약사항:
        - is_system=True인 권한은 수정할 수 없습니다
        - code, resource, action은 변경할 수 없습니다 (데이터 일관성 유지)
        - status를 INACTIVE로 변경하면 해당 권한을 가진 사용자의 접근이 제한됩니다

    Note:
        권한을 비활성화(INACTIVE)하는 대신 역할에서 제거하는 것이 더 안전합니다.
    """
    return await update_entity(
        db=db,
        model_class=PermissionModel,
        entity_id=permission_id,
        input_data=input_data,
        to_graphql=manager_permission_to_graphql,
    )


@strawberry.type
class ManagerPermissionMutations:
    """
    Manager IDAM Permissions Mutation

    Manager 시스템의 권한 관련 GraphQL Mutation들을 제공합니다.
    """

    @strawberry.mutation(description="Manager 권한 생성")
    async def create_permission(
        self, info, input: ManagerPermissionCreateInput
    ) -> ManagerPermission:
        """
        Manager 권한 생성

        새로운 권한을 RBAC 시스템에 추가합니다.

        Args:
            input: 권한 생성 정보

        Returns:
            Permission: 생성된 권한 객체

        Important:
            - code는 고유해야 하며, {resource}.{action} 형식을 권장합니다
            - is_system=True로 설정하면 수정/삭제가 불가능하므로 신중하게 설정

        사용 예:
            mutation {
              createPermission(input: {
                code: "products.create"
                name: "제품 생성"
                description: "새로운 제품을 생성할 수 있는 권한"
                category: "제품 관리"
                resource: "products"
                action: "CREATE"
                scope: "GLOBAL"
                applies_to: "ALL"
              }) {
                id code name
                roles { id name }
              }
            }
        """
        db = info.context.manager_db_session
        return await create_manager_permission(db, input)

    @strawberry.mutation(description="Manager 권한 수정")
    async def update_permission(
        self, info, id: strawberry.ID, input: ManagerPermissionUpdateInput
    ) -> ManagerPermission | None:
        """
        Manager 권한 수정

        기존 권한의 표시 정보나 상태를 수정합니다.

        Args:
            id: 수정할 권한 ID
            input: 권한 수정 정보

        Returns:
            Permission: 수정된 권한 객체 또는 None

        제약사항:
            - 시스템 권한(is_system=true)은 수정 불가
            - code, resource, action은 변경 불가

        사용 예:
            mutation {
              updatePermission(
                id: "xxx"
                input: {
                  name: "제품 생성 (수정됨)"
                  description: "새로운 설명"
                }
              ) {
                id name description
              }
            }
        """
        db = info.context.manager_db_session
        return await update_manager_permission(db, UUID(id), input)
