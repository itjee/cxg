"""Manager IDAM Role Permissions"""

from .mutations import ManagerRolePermissionMutations
from .queries import ManagerRolePermissionQueries
from .resolvers import resolve_role_permission_permission, resolve_role_permission_role
from .types import (
    ManagerRolePermission,
    ManagerRolePermissionCreateInput,
    ManagerRolePermissionDeleteInput,
)


__all__ = [
    "ManagerRolePermission",
    "ManagerRolePermissionCreateInput",
    "ManagerRolePermissionDeleteInput",
    "ManagerRolePermissionQueries",
    "ManagerRolePermissionMutations",
    "resolve_role_permission_role",
    "resolve_role_permission_permission",
]
