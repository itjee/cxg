"""
EmailTemplates module
"""

from .router import router
from .service import EmailTemplatesService
from .schemas import (
    EmailTemplatesBase,
    EmailTemplatesCreate,
    EmailTemplatesUpdate,
    EmailTemplatesResponse,
    EmailTemplatesListResponse,
)

__all__ = [
    "router",
    "EmailTemplatesService",
    "EmailTemplatesBase",
    "EmailTemplatesCreate",
    "EmailTemplatesUpdate",
    "EmailTemplatesResponse",
    "EmailTemplatesListResponse",
]
