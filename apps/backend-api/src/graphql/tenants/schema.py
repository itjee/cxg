"""Tenants 시스템 스키마"""

import strawberry

from .sys.users import TenantUserMutations, TenantUserQueries


@strawberry.type(description="Tenants Query")
class TenantsQuery:
    """Tenants 시스템 Query"""

    # SYS - Users
    tenant_user = TenantUserQueries.tenant_user
    tenant_users = TenantUserQueries.tenant_users


@strawberry.type(description="Tenants Mutation")
class TenantsMutation:
    """Tenants 시스템 Mutation"""

    # SYS - Users
    create_tenant_user = TenantUserMutations.create_tenant_user
    update_tenant_user = TenantUserMutations.update_tenant_user


__all__ = ["TenantsQuery", "TenantsMutation"]
