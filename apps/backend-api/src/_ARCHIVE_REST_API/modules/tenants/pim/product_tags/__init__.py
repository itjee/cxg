"""
ProductTags module
"""

from .router import router
from .service import ProductTagsService
from .schemas import (
    ProductTagsBase,
    ProductTagsCreate,
    ProductTagsUpdate,
    ProductTagsResponse,
    ProductTagsListResponse,
)

__all__ = [
    "router",
    "ProductTagsService",
    "ProductTagsBase",
    "ProductTagsCreate",
    "ProductTagsUpdate",
    "ProductTagsResponse",
    "ProductTagsListResponse",
]
