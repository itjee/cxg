"""Manager IDAM Roles

역할(Role) 관련 GraphQL 컴포넌트 모듈

이 모듈은 Manager 시스템의 역할 관리 기능을 제공합니다.
역할은 권한(Permission)을 그룹화하여 사용자에게 할당됩니다.
"""

from .mutations import ManagerRoleMutations
from .queries import ManagerRoleQueries
from .resolvers import resolve_role_permissions
from .types import ManagerRole, ManagerRoleCreateInput, ManagerRoleUpdateInput


__all__ = [
    "ManagerRole",
    "ManagerRoleCreateInput",
    "ManagerRoleUpdateInput",
    "ManagerRoleQueries",
    "ManagerRoleMutations",
    "resolve_role_permissions",
]
