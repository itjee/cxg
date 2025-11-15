"""Manager IDAM Roles

역할(Role) 관련 GraphQL 컴포넌트 모듈

이 모듈은 Manager 시스템의 역할 관리 기능을 제공합니다.
역할은 권한(Permission)을 그룹화하여 사용자에게 할당됩니다.
"""

from .mutations import RoleMutations
from .queries import RoleQueries
from .resolvers import resolve_role_permissions
from .types import Role, RoleCreateInput, RoleUpdateInput


__all__ = [
    "Role",
    "RoleCreateInput",
    "RoleUpdateInput",
    "RoleQueries",
    "RoleMutations",
    "resolve_role_permissions",
]
