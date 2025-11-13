"""
FixedAssets module
"""

from .router import router
from .service import FixedAssetsService
from .schemas import (
    FixedAssetsBase,
    FixedAssetsCreate,
    FixedAssetsUpdate,
    FixedAssetsResponse,
    FixedAssetsListResponse,
)

__all__ = [
    "router",
    "FixedAssetsService",
    "FixedAssetsBase",
    "FixedAssetsCreate",
    "FixedAssetsUpdate",
    "FixedAssetsResponse",
    "FixedAssetsListResponse",
]
