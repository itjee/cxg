"""
PurchaseAnalytics module
"""

from .router import router
from .service import PurchaseAnalyticsService
from .schemas import (
    PurchaseAnalyticsBase,
    PurchaseAnalyticsCreate,
    PurchaseAnalyticsUpdate,
    PurchaseAnalyticsResponse,
    PurchaseAnalyticsListResponse,
)

__all__ = [
    "router",
    "PurchaseAnalyticsService",
    "PurchaseAnalyticsBase",
    "PurchaseAnalyticsCreate",
    "PurchaseAnalyticsUpdate",
    "PurchaseAnalyticsResponse",
    "PurchaseAnalyticsListResponse",
]
