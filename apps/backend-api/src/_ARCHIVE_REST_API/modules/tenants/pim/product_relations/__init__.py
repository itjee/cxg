"""
ProductRelations module
"""

from .router import router
from .service import ProductRelationsService
from .schemas import (
    ProductRelationsBase,
    ProductRelationsCreate,
    ProductRelationsUpdate,
    ProductRelationsResponse,
    ProductRelationsListResponse,
)

__all__ = [
    "router",
    "ProductRelationsService",
    "ProductRelationsBase",
    "ProductRelationsCreate",
    "ProductRelationsUpdate",
    "ProductRelationsResponse",
    "ProductRelationsListResponse",
]
