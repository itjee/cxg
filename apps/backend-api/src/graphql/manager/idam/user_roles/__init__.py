"""Manager IDAM User Roles

사용자-역할 매핑(User-Role Mapping) 관련 GraphQL 컴포넌트 모듈

이 모듈은 Manager 시스템의 사용자-역할 할당 기능을 제공합니다.
사용자에게 역할을 할당하여 권한을 부여하고, 필요시 해제할 수 있습니다.
"""

from .mutations import UserRoleMutations
from .queries import UserRoleQueries
from .resolvers import resolve_granted_by_user, resolve_user_role_role, resolve_user_role_user
from .types import (
    UserRole,
    UserRoleCreateInput,
    UserRoleRevokeInput,
    UserRoleUpdateInput,
)


__all__ = [
    "UserRole",
    "UserRoleCreateInput",
    "UserRoleUpdateInput",
    "UserRoleRevokeInput",
    "UserRoleQueries",
    "UserRoleMutations",
    "resolve_user_role_user",
    "resolve_user_role_role",
    "resolve_granted_by_user",
]
