"""
Menus module for managing system menu structure.
"""

from .router import router
from .schemas import MenusResponse, MenusCreate, MenusUpdate
from .service import MenusService

__all__ = [
    "router",
    "MenusResponse",
    "MenusCreate",
    "MenusUpdate",
    "MenusService",
]
