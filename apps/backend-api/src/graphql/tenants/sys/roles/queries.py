"""Tenants SYS Roles - Queries"""

from typing import Optional
from uuid import UUID

import strawberry
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.sys.roles import Roles as RoleModel
from .types import TenantRole


async def get_tenant_role_by_id(db: AsyncSession, role_id: UUID) -> Optional[TenantRole]:
    """ID로 Tenant 역할 조회"""
    stmt = select(RoleModel).where(RoleModel.id == role_id, RoleModel.is_deleted == False)
    result = await db.execute(stmt)
    role = result.scalar_one_or_none()
    
    if not role:
        return None
    
    return TenantRole(
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


async def get_tenant_roles(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    is_active: Optional[bool] = None
) -> list[TenantRole]:
    """Tenant 역할 목록 조회"""
    stmt = select(RoleModel).where(RoleModel.is_deleted == False).limit(limit).offset(offset).order_by(RoleModel.code)
    
    if is_active is not None:
        stmt = stmt.where(RoleModel.is_active == is_active)
    
    result = await db.execute(stmt)
    roles = result.scalars().all()
    
    return [
        TenantRole(
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
        for role in roles
    ]


@strawberry.type
class TenantRoleQueries:
    """Tenants SYS Roles Query"""
    
    @strawberry.field(description="Tenant 역할 조회 (ID)")
    async def tenant_role(self, info, id: strawberry.ID) -> Optional[TenantRole]:
        """Tenant 역할 단건 조회"""
        db = info.context.tenant_db_session
        if not db:
            raise Exception("Tenant database session not available")
        return await get_tenant_role_by_id(db, UUID(id))
    
    @strawberry.field(description="Tenant 역할 목록")
    async def tenant_roles(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        is_active: Optional[bool] = None
    ) -> list[TenantRole]:
        """Tenant 역할 목록 조회"""
        db = info.context.tenant_db_session
        if not db:
            raise Exception("Tenant database session not available")
        return await get_tenant_roles(db, limit, offset, is_active)
