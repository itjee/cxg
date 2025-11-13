"""
Products module
"""

from .router import router
from .service import ProductsService
from .schemas import (
    ProductsBase,
    ProductsCreate,
    ProductsUpdate,
    ProductsResponse,
    ProductsListResponse,
)

__all__ = [
    "router",
    "ProductsService",
    "ProductsBase",
    "ProductsCreate",
    "ProductsUpdate",
    "ProductsResponse",
    "ProductsListResponse",
]
