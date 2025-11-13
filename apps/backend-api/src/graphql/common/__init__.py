"""GraphQL 공통 모듈"""

from .base_loader import BaseDataLoader, BaseFieldLoader
from .base_mutations import create_entity, delete_entity, update_entity
from .base_permissions import (
    BaseResourcePermission,
    CanCreate,
    CanDelete,
    CanManage,
    CanUpdate,
    CanView,
    IsAuthenticated,
    IsMaster,
    create_permission_class,
)
from .base_queries import get_by_id, get_count, get_list
from .base_types import ErrorResponse, PageInfo, SuccessResponse
from .converters import (
    model_to_graphql_converter,
    safe_id_to_uuid,
    safe_uuid_to_id,
)
from .interfaces import Node
from .scalars import DateTimeScalar, DecimalScalar, UUIDScalar


__all__ = [
    # Scalars
    "UUIDScalar",
    "DateTimeScalar",
    "DecimalScalar",
    # Interfaces
    "Node",
    # Base Types
    "PageInfo",
    "SuccessResponse",
    "ErrorResponse",
    # Loaders
    "BaseDataLoader",
    "BaseFieldLoader",
    # Queries
    "get_by_id",
    "get_list",
    "get_count",
    # Mutations
    "create_entity",
    "update_entity",
    "delete_entity",
    # Permissions
    "BaseResourcePermission",
    "CanView",
    "CanCreate",
    "CanUpdate",
    "CanDelete",
    "CanManage",
    "IsAuthenticated",
    "IsMaster",
    "create_permission_class",
    # Converters
    "model_to_graphql_converter",
    "safe_uuid_to_id",
    "safe_id_to_uuid",
]
