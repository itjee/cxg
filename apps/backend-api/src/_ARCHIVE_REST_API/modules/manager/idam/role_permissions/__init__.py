"""Module for RolePermission management."""

from .router import router
from .schemas import (
    RolePermissionCreate,
    RolePermissionListResponse,
    RolePermissionResponse,
    RolePermissionUpdate,
)
from .service import RolePermissionService

__all__ = [
    "router",
    "RolePermissionCreate",
    "RolePermissionResponse",
    "RolePermissionUpdate",
    "RolePermissionListResponse",
    "RolePermissionService",
]
