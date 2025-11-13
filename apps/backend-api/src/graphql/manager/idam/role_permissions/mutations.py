"""Manager IDAM Role Permissions - Mutations

역할-권한 매핑 생성/삭제 Mutation 구현

주요 기능:
- 역할에 권한 할당 (단건/일괄)
- 역할에서 권한 해제 (단건/일괄)
- 중복 할당 방지
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
    """Manager 역할에 권한 할당

    Args:
        db: 비동기 DB 세션
        input_data: 역할 ID와 권한 ID를 포함한 입력 데이터
        granted_by: 권한을 부여한 사용자 ID (선택)

    Returns:
        생성된 역할-권한 매핑 객체

    Note:
        이미 동일한 매핑이 존재하면 새로 생성하지 않고 기존 매핑 반환
    """
    role_id = UUID(input_data.role_id)
    permission_id = UUID(input_data.permission_id)

    # 중복 체크: 동일한 역할-권한 매핑이 이미 존재하는지 확인
    stmt = select(RolePermissionModel).where(
        RolePermissionModel.role_id == role_id,
        RolePermissionModel.permission_id == permission_id,
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        # 이미 존재하면 기존 매핑 반환 (멱등성 보장)
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
    """Manager 역할에서 권한 해제

    Args:
        db: 비동기 DB 세션
        input_data: 역할 ID와 권한 ID를 포함한 입력 데이터

    Returns:
        삭제 성공 여부 (True: 삭제됨, False: 해당 매핑 없음)
    """
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
    """역할에 여러 권한을 한번에 할당

    Args:
        db: 비동기 DB 세션
        role_id: 역할 ID
        permission_ids: 할당할 권한 ID 목록
        granted_by: 권한을 부여한 사용자 ID (선택)

    Returns:
        생성된 역할-권한 매핑 객체 목록

    Note:
        각 권한을 순차적으로 할당하며, 이미 존재하는 매핑은 건너뜀
    """
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
    """역할에서 여러 권한을 한번에 해제

    Args:
        db: 비동기 DB 세션
        role_id: 역할 ID
        permission_ids: 해제할 권한 ID 목록

    Returns:
        삭제된 매핑의 개수

    Note:
        단일 쿼리로 여러 매핑을 한번에 삭제하여 효율적
    """
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
    """Manager IDAM Role Permissions Mutation

    역할-권한 매핑 생성/삭제를 위한 GraphQL Mutation 정의
    """

    @strawberry.mutation(description="Manager 역할에 권한 할당")
    async def assign_permission_to_role(
        self,
        info,
        input: ManagerRolePermissionCreateInput,
    ) -> ManagerRolePermission:
        """Manager 역할에 권한 할당

        단일 권한을 특정 역할에 할당합니다.
        """
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
        """Manager 역할에서 권한 해제

        단일 권한을 특정 역할에서 제거합니다.
        """
        db = info.context.manager_db_session
        return await delete_manager_role_permission(db, input)

    @strawberry.mutation(description="Manager 역할에 여러 권한 일괄 할당")
    async def bulk_assign_permissions_to_role(
        self,
        info,
        role_id: strawberry.ID,
        permission_ids: list[strawberry.ID],
    ) -> list[ManagerRolePermission]:
        """역할에 여러 권한을 한번에 할당

        여러 권한을 한 번의 요청으로 특정 역할에 할당합니다.
        """
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
        """역할에서 여러 권한을 한번에 해제

        여러 권한을 한 번의 요청으로 특정 역할에서 제거합니다.
        반환값은 실제 삭제된 매핑의 개수입니다.
        """
        db = info.context.manager_db_session
        return await bulk_remove_permissions_from_role(
            db,
            UUID(role_id),
            [UUID(pid) for pid in permission_ids],
        )
