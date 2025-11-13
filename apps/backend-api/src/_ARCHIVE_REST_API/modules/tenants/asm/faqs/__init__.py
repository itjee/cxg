"""
Faqs module
"""

from .router import router
from .service import FaqsService
from .schemas import (
    FaqsBase,
    FaqsCreate,
    FaqsUpdate,
    FaqsResponse,
    FaqsListResponse,
)

__all__ = [
    "router",
    "FaqsService",
    "FaqsBase",
    "FaqsCreate",
    "FaqsUpdate",
    "FaqsResponse",
    "FaqsListResponse",
]
