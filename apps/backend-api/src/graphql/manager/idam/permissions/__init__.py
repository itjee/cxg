"""Manager IDAM Permissions"""

from .mutations import PermissionMutations
from .queries import PermissionQueries
from .resolvers import resolve_permission_roles
from .types import Permission


__all__ = [
    "Permission",
    "PermissionQueries",
    "PermissionMutations",
    "resolve_permission_roles",
]
