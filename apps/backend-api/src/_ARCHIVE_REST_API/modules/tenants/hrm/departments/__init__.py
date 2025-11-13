"""
Departments module
"""

from .router import router
from .service import DepartmentsService
from .schemas import (
    DepartmentsBase,
    DepartmentsCreate,
    DepartmentsUpdate,
    DepartmentsResponse,
    DepartmentsListResponse,
)

__all__ = [
    "router",
    "DepartmentsService",
    "DepartmentsBase",
    "DepartmentsCreate",
    "DepartmentsUpdate",
    "DepartmentsResponse",
    "DepartmentsListResponse",
]
