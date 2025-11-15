"""Manager IDAM Role Permissions"""

from .mutations import RolePermissionMutations
from .queries import RolePermissionQueries
from .resolvers import resolve_role_permission_permission, resolve_role_permission_role
from .types import (
    RolePermission,
    RolePermissionCreateInput,
    RolePermissionDeleteInput,
)


__all__ = [
    "RolePermission",
    "RolePermissionCreateInput",
    "RolePermissionDeleteInput",
    "RolePermissionQueries",
    "RolePermissionMutations",
    "resolve_role_permission_role",
    "resolve_role_permission_permission",
]
