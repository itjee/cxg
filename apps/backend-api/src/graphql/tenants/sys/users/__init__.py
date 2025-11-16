"""Tenants SYS Users GraphQL Module"""

from .loaders import TenantsUserByEmailLoader, TenantsUserByUsernameLoader, TenantsUserLoader
from .mutations import TenantsUserMutations
from .permissions import (
    CanDeleteTenantsUsers,
    CanManageTenantsUsers,
    CanViewTenantsUsers,
    IsTenantsOwnerOrAdmin,
)
from .queries import TenantsUserQueries
from .types import TenantsUser, TenantsUserCreateInput, TenantsUserUpdateInput


__all__ = [
    # Types
    "TenantsUser",
    "TenantsUserCreateInput",
    "TenantsUserUpdateInput",
    # Queries & Mutations
    "TenantsUserQueries",
    "TenantsUserMutations",
    # DataLoaders
    "TenantsUserLoader",
    "TenantsUserByUsernameLoader",
    "TenantsUserByEmailLoader",
    # Permissions
    "CanViewTenantsUsers",
    "CanManageTenantsUsers",
    "CanDeleteTenantsUsers",
    "IsTenantsOwnerOrAdmin",
]
