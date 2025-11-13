"""
CustomerSegments module
"""

from .router import router
from .service import CustomerSegmentsService
from .schemas import (
    CustomerSegmentsBase,
    CustomerSegmentsCreate,
    CustomerSegmentsUpdate,
    CustomerSegmentsResponse,
    CustomerSegmentsListResponse,
)

__all__ = [
    "router",
    "CustomerSegmentsService",
    "CustomerSegmentsBase",
    "CustomerSegmentsCreate",
    "CustomerSegmentsUpdate",
    "CustomerSegmentsResponse",
    "CustomerSegmentsListResponse",
]
