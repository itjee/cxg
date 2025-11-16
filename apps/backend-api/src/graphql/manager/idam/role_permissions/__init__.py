"""Manager IDAM Role Permissions"""

from .mutations import ManagerRolePermissionMutations
from .queries import ManagerRolePermissionQueries
from .resolvers import (
    resolve_manager_role_permission_permission,
    resolve_manager_role_permission_role,
)
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
    "resolve_manager_role_permission_role",
    "resolve_manager_role_permission_permission",
]
