"""Manager IDAM Permissions"""

from .mutations import ManagerPermissionMutations
from .queries import ManagerPermissionQueries
from .resolvers import resolve_manager_permission_roles
from .types import ManagerPermission


__all__ = [
    "ManagerPermission",
    "ManagerPermissionQueries",
    "ManagerPermissionMutations",
    "resolve_manager_permission_roles",
]
