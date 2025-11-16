"""Tenants SYS Roles - Mutations"""

from uuid import UUID

import strawberry
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.sys.roles import Roles as RoleModel

from .types import TenantsRole, TenantsRoleCreateInput, TenantsRoleUpdateInput


async def create_tenants_role(
    db: AsyncSession, input_data: TenantsRoleCreateInput, created_by: UUID
) -> TenantsRole:
    """Tenant 역할 생성"""

    role = RoleModel(
        code=input_data.code,
        name=input_data.name,
        description=input_data.description,
        is_system_role=input_data.is_system_role,
        created_by=created_by,
        updated_by=created_by,
    )

    db.add(role)
    await db.commit()
    await db.refresh(role)

    return TenantsRole(
        id=strawberry.ID(str(role.id)),
        code=role.code,
        name=role.name,
        description=role.description,
        is_system_role=role.is_system_role or False,
        is_active=role.is_active or True,
        is_deleted=role.is_deleted or False,
        created_at=role.created_at,
        updated_at=role.updated_at,
        created_by=strawberry.ID(str(role.created_by)) if role.created_by else None,
        updated_by=strawberry.ID(str(role.updated_by)) if role.updated_by else None,
    )


async def update_tenants_role(
    db: AsyncSession, role_id: UUID, input_data: TenantsRoleUpdateInput, updated_by: UUID
) -> TenantsRole | None:
    """Tenant 역할 수정"""

    stmt = select(RoleModel).where(RoleModel.id == role_id, RoleModel.is_deleted == False)
    result = await db.execute(stmt)
    role = result.scalar_one_or_none()

    if not role:
        return None

    if input_data.name is not None:
        role.name = input_data.name
    if input_data.description is not None:
        role.description = input_data.description
    if input_data.is_active is not None:
        role.is_active = input_data.is_active

    role.updated_by = updated_by

    await db.commit()
    await db.refresh(role)

    return TenantsRole(
        id=strawberry.ID(str(role.id)),
        code=role.code,
        name=role.name,
        description=role.description,
        is_system_role=role.is_system_role or False,
        is_active=role.is_active or True,
        is_deleted=role.is_deleted or False,
        created_at=role.created_at,
        updated_at=role.updated_at,
        created_by=strawberry.ID(str(role.created_by)) if role.created_by else None,
        updated_by=strawberry.ID(str(role.updated_by)) if role.updated_by else None,
    )


@strawberry.type
class TenantsRoleMutations:
    """Tenants SYS Roles Mutation"""

    @strawberry.mutation(description="Tenant 역할 생성")
    async def create_tenants_role(self, info, input: TenantsRoleCreateInput) -> TenantsRole:
        """Tenant 역할 생성"""
        db = info.context.tenant_db_session
        if not db:
            raise Exception("Tenant database session not available")

        current_user_id = UUID(info.context.user_id)
        return await create_tenants_role(db, input, current_user_id)

    @strawberry.mutation(description="Tenant 역할 수정")
    async def update_tenants_role(
        self, info, id: strawberry.ID, input: TenantsRoleUpdateInput
    ) -> TenantsRole | None:
        """Tenant 역할 수정"""
        db = info.context.tenant_db_session
        if not db:
            raise Exception("Tenant database session not available")

        current_user_id = UUID(info.context.user_id)
        return await update_tenants_role(db, UUID(id), input, current_user_id)
