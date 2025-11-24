"""Manager - Tenants GraphQL Module"""

from .mutations import ManagerTenantMutations
from .permissions import (
    CanDeleteManagerTenants,
    CanManageManagerTenants,
    CanViewManagerTenants,
    IsManagerMasterUser,
)
from .queries import ManagerTenantQueries
from .types import ManagerTenant, DeleteResult

__all__ = [
    "ManagerTenant",
    "DeleteResult",
    "ManagerTenantQueries",
    "ManagerTenantMutations",
    "CanViewManagerTenants",
    "CanManageManagerTenants",
    "CanDeleteManagerTenants",
    "IsManagerMasterUser",
]
