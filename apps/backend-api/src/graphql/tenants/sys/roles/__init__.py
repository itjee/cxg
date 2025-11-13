"""Tenants SYS Roles"""

from .mutations import TenantRoleMutations
from .queries import TenantRoleQueries
from .types import TenantRole, TenantRoleCreateInput, TenantRoleUpdateInput

__all__ = [
    "TenantRole",
    "TenantRoleCreateInput",
    "TenantRoleUpdateInput",
    "TenantRoleQueries",
    "TenantRoleMutations",
]
