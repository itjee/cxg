"""
AssetDepreciation module
"""

from .router import router
from .service import AssetDepreciationService
from .schemas import (
    AssetDepreciationBase,
    AssetDepreciationCreate,
    AssetDepreciationUpdate,
    AssetDepreciationResponse,
    AssetDepreciationListResponse,
)

__all__ = [
    "router",
    "AssetDepreciationService",
    "AssetDepreciationBase",
    "AssetDepreciationCreate",
    "AssetDepreciationUpdate",
    "AssetDepreciationResponse",
    "AssetDepreciationListResponse",
]
