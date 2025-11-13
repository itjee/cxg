"""Module for ServiceQuotas management."""

from .router import router
from .schemas import (
    ServiceQuotasCreate,
    ServiceQuotasListResponse,
    ServiceQuotasResponse,
    ServiceQuotasUpdate,
)
from .service import ServiceQuotasService

__all__ = [
    "router",
    "ServiceQuotasCreate",
    "ServiceQuotasResponse",
    "ServiceQuotasUpdate",
    "ServiceQuotasListResponse",
    "ServiceQuotasService",
]
