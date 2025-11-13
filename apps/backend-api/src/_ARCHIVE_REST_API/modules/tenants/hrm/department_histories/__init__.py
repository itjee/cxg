"""
DepartmentHistories module
"""

from .router import router
from .service import DepartmentHistoriesService
from .schemas import (
    DepartmentHistoriesBase,
    DepartmentHistoriesCreate,
    DepartmentHistoriesUpdate,
    DepartmentHistoriesResponse,
    DepartmentHistoriesListResponse,
)

__all__ = [
    "router",
    "DepartmentHistoriesService",
    "DepartmentHistoriesBase",
    "DepartmentHistoriesCreate",
    "DepartmentHistoriesUpdate",
    "DepartmentHistoriesResponse",
    "DepartmentHistoriesListResponse",
]
