"""Tenants SYS Users GraphQL Module"""

from .loaders import TenantUserLoader, TenantUserByUsernameLoader, TenantUserByEmailLoader
from .mutations import TenantUserMutations
from .permissions import CanViewUsers, CanManageUsers, CanDeleteUsers, IsOwnerOrAdmin
from .queries import TenantUserQueries
from .types import TenantUser, TenantUserCreateInput, TenantUserUpdateInput

__all__ = [
    # Types
    "TenantUser",
    "TenantUserCreateInput",
    "TenantUserUpdateInput",
    # Queries & Mutations
    "TenantUserQueries",
    "TenantUserMutations",
    # DataLoaders
    "TenantUserLoader",
    "TenantUserByUsernameLoader",
    "TenantUserByEmailLoader",
    # Permissions
    "CanViewUsers",
    "CanManageUsers",
    "CanDeleteUsers",
    "IsOwnerOrAdmin",
]
