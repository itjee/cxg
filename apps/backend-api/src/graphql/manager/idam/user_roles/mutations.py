"""Manager IDAM User Roles - Mutations

공통 모듈을 사용한 Mutation 구현
"""

from datetime import datetime
from uuid import UUID

import strawberry
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import update_entity
from src.models.manager.idam.user_role import UserRole as UserRoleModel

from .queries import user_role_to_graphql
from .types import (
    ManagerUserRole,
    ManagerUserRoleCreateInput,
    ManagerUserRoleRevokeInput,
    ManagerUserRoleUpdateInput,
)


async def create_manager_user_role(
    db: AsyncSession,
    input_data: ManagerUserRoleCreateInput,
    granted_by: UUID | None = None,
) -> ManagerUserRole:
    """Manager 사용자에게 역할 할당"""
    user_id = UUID(input_data.user_id)
    role_id = UUID(input_data.role_id)

    # 중복 체크 (동일 사용자, 역할, scope의 ACTIVE 매핑)
    stmt = select(UserRoleModel).where(
        UserRoleModel.user_id == user_id,
        UserRoleModel.role_id == role_id,
        UserRoleModel.scope == input_data.scope,
        UserRoleModel.status == "ACTIVE",
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        # 이미 존재하면 기존 매핑 반환
        return user_role_to_graphql(existing)

    # 새로운 매핑 생성
    user_role = UserRoleModel(
        user_id=user_id,
        role_id=role_id,
        scope=input_data.scope,
        tenant_context=UUID(input_data.tenant_context) if input_data.tenant_context else None,
        granted_at=datetime.utcnow(),
        granted_by=granted_by,
        expires_at=datetime.fromisoformat(input_data.expires_at) if input_data.expires_at else None,
        status="ACTIVE",
    )

    db.add(user_role)
    await db.flush()
    await db.refresh(user_role)

    return user_role_to_graphql(user_role)


async def update_manager_user_role(
    db: AsyncSession,
    user_role_id: UUID,
    input_data: ManagerUserRoleUpdateInput,
) -> ManagerUserRole | None:
    """Manager 사용자-역할 매핑 수정"""
    # expires_at 문자열을 datetime으로 변환
    prepared_data = {}
    for key, value in input_data.__dict__.items():
        if value is not None:
            if key == "expires_at" and value:
                prepared_data[key] = datetime.fromisoformat(value)
            elif key == "tenant_context" and value:
                prepared_data[key] = UUID(value)
            else:
                prepared_data[key] = value

    return await update_entity(
        db=db,
        model_class=UserRoleModel,
        entity_id=user_role_id,
        input_data=type("UpdateData", (), prepared_data)(),
        to_graphql=user_role_to_graphql,
    )


async def revoke_manager_user_role(
    db: AsyncSession,
    input_data: ManagerUserRoleRevokeInput,
) -> bool:
    """Manager 사용자에서 역할 해제 (상태를 INACTIVE로 변경)"""
    user_id = UUID(input_data.user_id)
    role_id = UUID(input_data.role_id)

    # ACTIVE 상태의 매핑 찾기
    stmt = select(UserRoleModel).where(
        UserRoleModel.user_id == user_id,
        UserRoleModel.role_id == role_id,
        UserRoleModel.status == "ACTIVE",
    )

    result = await db.execute(stmt)
    user_role = result.scalar_one_or_none()

    if user_role:
        user_role.status = "INACTIVE"
        await db.flush()
        return True

    return False


async def delete_manager_user_role(
    db: AsyncSession,
    input_data: ManagerUserRoleRevokeInput,
) -> bool:
    """Manager 사용자에서 역할 완전 삭제 (물리적 삭제)"""
    user_id = UUID(input_data.user_id)
    role_id = UUID(input_data.role_id)

    stmt = delete(UserRoleModel).where(
        UserRoleModel.user_id == user_id,
        UserRoleModel.role_id == role_id,
    )

    result = await db.execute(stmt)
    await db.flush()

    # rowcount는 삭제된 행의 수를 반환
    return result.rowcount > 0 if result.rowcount else False  # type: ignore[attr-defined]


async def bulk_assign_roles_to_user(
    db: AsyncSession,
    user_id: UUID,
    role_ids: list[UUID],
    scope: str = "GLOBAL",
    granted_by: UUID | None = None,
) -> list[ManagerUserRole]:
    """사용자에게 여러 역할을 한번에 할당"""
    result = []

    for role_id in role_ids:
        input_data = ManagerUserRoleCreateInput(
            user_id=strawberry.ID(str(user_id)),
            role_id=strawberry.ID(str(role_id)),
            scope=scope,
        )
        user_role = await create_manager_user_role(db, input_data, granted_by)
        result.append(user_role)

    return result


async def bulk_revoke_roles_from_user(
    db: AsyncSession,
    user_id: UUID,
    role_ids: list[UUID],
) -> int:
    """사용자에서 여러 역할을 한번에 해제"""
    count = 0

    for role_id in role_ids:
        input_data = ManagerUserRoleRevokeInput(
            user_id=strawberry.ID(str(user_id)),
            role_id=strawberry.ID(str(role_id)),
        )
        if await revoke_manager_user_role(db, input_data):
            count += 1

    return count


@strawberry.type
class ManagerUserRoleMutations:
    """Manager IDAM User Roles Mutation"""

    @strawberry.mutation(description="Manager 사용자에게 역할 할당")
    async def assign_role_to_user(
        self,
        info,
        input: ManagerUserRoleCreateInput,
    ) -> ManagerUserRole:
        """Manager 사용자에게 역할 할당"""
        db = info.context.manager_db_session
        # TODO: info.context에서 현재 사용자 ID 가져오기
        granted_by = None  # info.context.current_user.id
        return await create_manager_user_role(db, input, granted_by)

    @strawberry.mutation(description="Manager 사용자-역할 매핑 수정")
    async def update_user_role(
        self,
        info,
        id: strawberry.ID,
        input: ManagerUserRoleUpdateInput,
    ) -> ManagerUserRole | None:
        """Manager 사용자-역할 매핑 수정"""
        db = info.context.manager_db_session
        return await update_manager_user_role(db, UUID(id), input)

    @strawberry.mutation(description="Manager 사용자에서 역할 해제")
    async def revoke_role_from_user(
        self,
        info,
        input: ManagerUserRoleRevokeInput,
    ) -> bool:
        """Manager 사용자에서 역할 해제 (상태 변경)"""
        db = info.context.manager_db_session
        return await revoke_manager_user_role(db, input)

    @strawberry.mutation(description="Manager 사용자에서 역할 삭제")
    async def delete_user_role(
        self,
        info,
        input: ManagerUserRoleRevokeInput,
    ) -> bool:
        """Manager 사용자에서 역할 완전 삭제"""
        db = info.context.manager_db_session
        return await delete_manager_user_role(db, input)

    @strawberry.mutation(description="Manager 사용자에게 여러 역할 일괄 할당")
    async def bulk_assign_roles_to_user(
        self,
        info,
        user_id: strawberry.ID,
        role_ids: list[strawberry.ID],
        scope: str = "GLOBAL",
    ) -> list[ManagerUserRole]:
        """사용자에게 여러 역할을 한번에 할당"""
        db = info.context.manager_db_session
        granted_by = None  # info.context.current_user.id
        return await bulk_assign_roles_to_user(
            db,
            UUID(user_id),
            [UUID(rid) for rid in role_ids],
            scope,
            granted_by,
        )

    @strawberry.mutation(description="Manager 사용자에서 여러 역할 일괄 해제")
    async def bulk_revoke_roles_from_user(
        self,
        info,
        user_id: strawberry.ID,
        role_ids: list[strawberry.ID],
    ) -> int:
        """사용자에서 여러 역할을 한번에 해제"""
        db = info.context.manager_db_session
        return await bulk_revoke_roles_from_user(
            db,
            UUID(user_id),
            [UUID(rid) for rid in role_ids],
        )
