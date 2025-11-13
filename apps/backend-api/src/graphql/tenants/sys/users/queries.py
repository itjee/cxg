"""Tenants SYS Users - Queries"""

from typing import Optional
from uuid import UUID

import strawberry
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.sys.users import Users as UserModel
from .types import TenantUser


async def get_tenant_user_by_id(db: AsyncSession, user_id: UUID) -> Optional[TenantUser]:
    """ID로 Tenant 사용자 조회"""
    stmt = select(UserModel).where(UserModel.id == user_id, UserModel.is_deleted == False)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        return None
    
    return TenantUser(
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


async def get_tenant_users(db: AsyncSession, limit: int = 20, offset: int = 0) -> list[TenantUser]:
    """Tenant 사용자 목록 조회"""
    stmt = (
        select(UserModel)
        .where(UserModel.is_deleted == False)
        .limit(limit)
        .offset(offset)
        .order_by(UserModel.created_at.desc())
    )
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    return [
        TenantUser(
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
        for user in users
    ]


@strawberry.type
class TenantUserQueries:
    """Tenants SYS Users Query"""
    
    @strawberry.field(description="Tenant 사용자 조회 (ID)")
    async def tenant_user(self, info, id: strawberry.ID) -> Optional[TenantUser]:
        """Tenant 사용자 단건 조회"""
        db = info.context.tenant_db_session
        if not db:
            raise Exception("Tenant database session not available")
        return await get_tenant_user_by_id(db, UUID(id))
    
    @strawberry.field(description="Tenant 사용자 목록")
    async def tenant_users(
        self,
        info,
        limit: int = 20,
        offset: int = 0
    ) -> list[TenantUser]:
        """Tenant 사용자 목록 조회"""
        db = info.context.tenant_db_session
        if not db:
            raise Exception("Tenant database session not available")
        return await get_tenant_users(db, limit, offset)
