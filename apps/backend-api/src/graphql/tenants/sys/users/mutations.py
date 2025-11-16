"""Tenants SYS Users - Mutations"""

from uuid import UUID

import strawberry
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import hash_password
from src.models.tenants.sys.users import Users as UserModel

from .types import TenantsUser, TenantsUserCreateInput, TenantsUserUpdateInput


async def create_tenants_user(
    db: AsyncSession, input_data: TenantsUserCreateInput, created_by: UUID
) -> TenantsUser:
    """Tenant 사용자 생성"""

    # 비밀번호 해시화
    password_hash = hash_password(input_data.password)

    # 사용자 생성
    user = UserModel(
        user_code=input_data.user_code,
        username=input_data.username,
        email=input_data.email,
        password_hash=password_hash,
        first_name=input_data.first_name,
        last_name=input_data.last_name,
        phone=input_data.phone,
        department_id=UUID(input_data.department_id) if input_data.department_id else None,
        position=input_data.position,
        role_id=UUID(input_data.role_id) if input_data.role_id else None,
        created_by=created_by,
        updated_by=created_by,
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return TenantsUser(
        id=strawberry.ID(str(user.id)),
        user_code=user.user_code,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        department_id=strawberry.ID(str(user.department_id)) if user.department_id else None,
        position=user.position,
        role_id=strawberry.ID(str(user.role_id)) if user.role_id else None,
        failed_login_attempts=user.failed_login_attempts,
        locked_until=user.locked_until,
        last_login_at=user.last_login_at,
        last_login_ip=user.last_login_ip,
        is_system_user=user.is_system_user,
        is_active=user.is_active,
        is_deleted=user.is_deleted,
        created_at=user.created_at,
        updated_at=user.updated_at,
        created_by=strawberry.ID(str(user.created_by)) if user.created_by else None,
        updated_by=strawberry.ID(str(user.updated_by)) if user.updated_by else None,
    )


async def update_tenants_user(
    db: AsyncSession, user_id: UUID, input_data: TenantsUserUpdateInput, updated_by: UUID
) -> TenantsUser | None:
    """Tenant 사용자 수정"""

    stmt = select(UserModel).where(UserModel.id == user_id, UserModel.is_active)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        return None

    # 입력된 필드만 업데이트
    if input_data.email is not None:
        user.email = input_data.email
    if input_data.first_name is not None:
        user.first_name = input_data.first_name
    if input_data.last_name is not None:
        user.last_name = input_data.last_name
    if input_data.phone is not None:
        user.phone = input_data.phone
    if input_data.department_id is not None:
        user.department_id = UUID(input_data.department_id)
    if input_data.position is not None:
        user.position = input_data.position
    if input_data.role_id is not None:
        user.role_id = UUID(input_data.role_id)
    if input_data.is_active is not None:
        user.is_active = input_data.is_active

    user.updated_by = updated_by

    await db.commit()
    await db.refresh(user)

    return TenantsUser(
        id=strawberry.ID(str(user.id)),
        user_code=user.user_code,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        department_id=strawberry.ID(str(user.department_id)) if user.department_id else None,
        position=user.position,
        role_id=strawberry.ID(str(user.role_id)) if user.role_id else None,
        failed_login_attempts=user.failed_login_attempts,
        locked_until=user.locked_until,
        last_login_at=user.last_login_at,
        last_login_ip=user.last_login_ip,
        is_system_user=user.is_system_user,
        is_active=user.is_active,
        is_deleted=user.is_deleted,
        created_at=user.created_at,
        updated_at=user.updated_at,
        created_by=strawberry.ID(str(user.created_by)) if user.created_by else None,
        updated_by=strawberry.ID(str(user.updated_by)) if user.updated_by else None,
    )


@strawberry.type
class TenantsUserMutations:
    """Tenants SYS Users Mutation"""

    @strawberry.mutation(description="Tenant 사용자 생성")
    async def create_user(self, info, input: TenantsUserCreateInput) -> TenantsUser:
        """Tenant 사용자 생성"""
        db = info.context.tenant_db_session
        if not db:
            raise Exception("Tenant database session not available")

        current_user_id = UUID(info.context.user_id)
        return await create_tenants_user(db, input, current_user_id)

    @strawberry.mutation(description="Tenant 사용자 수정")
    async def update_user(
        self, info, id: strawberry.ID, input: TenantsUserUpdateInput
    ) -> TenantsUser | None:
        """Tenant 사용자 수정"""
        db = info.context.tenant_db_session
        if not db:
            raise Exception("Tenant database session not available")

        current_user_id = UUID(info.context.user_id)
        return await update_tenants_user(db, UUID(id), input, current_user_id)
