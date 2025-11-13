"""
RolePermissions module
"""

from .router import router
from .service import RolePermissionsService
from .schemas import (
    RolePermissionsBase,
    RolePermissionsCreate,
    RolePermissionsUpdate,
    RolePermissionsResponse,
    RolePermissionsListResponse,
)

__all__ = [
    "router",
    "RolePermissionsService",
    "RolePermissionsBase",
    "RolePermissionsCreate",
    "RolePermissionsUpdate",
    "RolePermissionsResponse",
    "RolePermissionsListResponse",
]
