"""Manager IDAM Role Permissions - Mutations

공통 모듈을 사용한 Mutation 구현
"""

from datetime import datetime
from uuid import UUID

import strawberry
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.idam.role_permission import RolePermission as RolePermissionModel

from .queries import role_permission_to_graphql
from .types import (
    ManagerRolePermission,
    ManagerRolePermissionCreateInput,
    ManagerRolePermissionDeleteInput,
)


async def create_manager_role_permission(
    db: AsyncSession,
    input_data: ManagerRolePermissionCreateInput,
    granted_by: UUID | None = None,
) -> ManagerRolePermission:
    """Manager 역할에 권한 할당"""
    role_id = UUID(input_data.role_id)
    permission_id = UUID(input_data.permission_id)

    # 중복 체크
    stmt = select(RolePermissionModel).where(
        RolePermissionModel.role_id == role_id,
        RolePermissionModel.permission_id == permission_id,
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        # 이미 존재하면 기존 매핑 반환
        return role_permission_to_graphql(existing)

    # 새로운 매핑 생성
    role_permission = RolePermissionModel(
        role_id=role_id,
        permission_id=permission_id,
        granted_at=datetime.utcnow(),
        granted_by=granted_by,
    )

    db.add(role_permission)
    await db.flush()
    await db.refresh(role_permission)

    return role_permission_to_graphql(role_permission)


async def delete_manager_role_permission(
    db: AsyncSession,
    input_data: ManagerRolePermissionDeleteInput,
) -> bool:
    """Manager 역할에서 권한 해제"""
    role_id = UUID(input_data.role_id)
    permission_id = UUID(input_data.permission_id)

    stmt = delete(RolePermissionModel).where(
        RolePermissionModel.role_id == role_id,
        RolePermissionModel.permission_id == permission_id,
    )

    result = await db.execute(stmt)
    await db.flush()

    # rowcount는 삭제된 행의 수를 반환
    return result.rowcount > 0 if result.rowcount else False  # type: ignore[attr-defined]


async def bulk_assign_permissions_to_role(
    db: AsyncSession,
    role_id: UUID,
    permission_ids: list[UUID],
    granted_by: UUID | None = None,
) -> list[ManagerRolePermission]:
    """역할에 여러 권한을 한번에 할당"""
    result = []

    for permission_id in permission_ids:
        input_data = ManagerRolePermissionCreateInput(
            role_id=strawberry.ID(str(role_id)),
            permission_id=strawberry.ID(str(permission_id)),
        )
        role_permission = await create_manager_role_permission(db, input_data, granted_by)
        result.append(role_permission)

    return result


async def bulk_remove_permissions_from_role(
    db: AsyncSession,
    role_id: UUID,
    permission_ids: list[UUID],
) -> int:
    """역할에서 여러 권한을 한번에 해제"""
    stmt = delete(RolePermissionModel).where(
        RolePermissionModel.role_id == role_id,
        RolePermissionModel.permission_id.in_(permission_ids),
    )

    result = await db.execute(stmt)
    await db.flush()

    # rowcount는 삭제된 행의 수를 반환
    return result.rowcount or 0  # type: ignore[attr-defined]


@strawberry.type
class ManagerRolePermissionMutations:
    """Manager IDAM Role Permissions Mutation"""

    @strawberry.mutation(description="Manager 역할에 권한 할당")
    async def assign_permission_to_role(
        self,
        info,
        input: ManagerRolePermissionCreateInput,
    ) -> ManagerRolePermission:
        """Manager 역할에 권한 할당"""
        db = info.context.manager_db_session
        # TODO: info.context에서 현재 사용자 ID 가져오기
        granted_by = None  # info.context.current_user.id
        return await create_manager_role_permission(db, input, granted_by)

    @strawberry.mutation(description="Manager 역할에서 권한 해제")
    async def remove_permission_from_role(
        self,
        info,
        input: ManagerRolePermissionDeleteInput,
    ) -> bool:
        """Manager 역할에서 권한 해제"""
        db = info.context.manager_db_session
        return await delete_manager_role_permission(db, input)

    @strawberry.mutation(description="Manager 역할에 여러 권한 일괄 할당")
    async def bulk_assign_permissions_to_role(
        self,
        info,
        role_id: strawberry.ID,
        permission_ids: list[strawberry.ID],
    ) -> list[ManagerRolePermission]:
        """역할에 여러 권한을 한번에 할당"""
        db = info.context.manager_db_session
        granted_by = None  # info.context.current_user.id
        return await bulk_assign_permissions_to_role(
            db,
            UUID(role_id),
            [UUID(pid) for pid in permission_ids],
            granted_by,
        )

    @strawberry.mutation(description="Manager 역할에서 여러 권한 일괄 해제")
    async def bulk_remove_permissions_from_role(
        self,
        info,
        role_id: strawberry.ID,
        permission_ids: list[strawberry.ID],
    ) -> int:
        """역할에서 여러 권한을 한번에 해제"""
        db = info.context.manager_db_session
        return await bulk_remove_permissions_from_role(
            db,
            UUID(role_id),
            [UUID(pid) for pid in permission_ids],
        )
