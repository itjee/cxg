"""
KpiTargets module
"""

from .router import router
from .service import KpiTargetsService
from .schemas import (
    KpiTargetsBase,
    KpiTargetsCreate,
    KpiTargetsUpdate,
    KpiTargetsResponse,
    KpiTargetsListResponse,
)

__all__ = [
    "router",
    "KpiTargetsService",
    "KpiTargetsBase",
    "KpiTargetsCreate",
    "KpiTargetsUpdate",
    "KpiTargetsResponse",
    "KpiTargetsListResponse",
]
