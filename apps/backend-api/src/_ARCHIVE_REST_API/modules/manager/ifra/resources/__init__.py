"""Module for Resources management."""

from .router import router
from .schemas import (
    ResourcesCreate,
    ResourcesListResponse,
    ResourcesResponse,
    ResourcesUpdate,
)
from .service import ResourcesService

__all__ = [
    "router",
    "ResourcesCreate",
    "ResourcesResponse",
    "ResourcesUpdate",
    "ResourcesListResponse",
    "ResourcesService",
]
