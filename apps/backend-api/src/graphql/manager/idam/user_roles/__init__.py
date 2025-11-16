"""Manager IDAM User Roles

사용자-역할 매핑(User-Role Mapping) 관련 GraphQL 컴포넌트 모듈

이 모듈은 Manager 시스템의 사용자-역할 할당 기능을 제공합니다.
사용자에게 역할을 할당하여 권한을 부여하고, 필요시 해제할 수 있습니다.
"""

from .mutations import ManagerUserRoleMutations
from .queries import ManagerUserRoleQueries
from .resolvers import (
    resolve_manager_granted_by_user,
    resolve_manager_user_role_role,
    resolve_manager_user_role_user,
)
from .types import (
    ManagerUserRole,
    ManagerUserRoleCreateInput,
    ManagerUserRoleRevokeInput,
    ManagerUserRoleUpdateInput,
)


__all__ = [
    "ManagerUserRole",
    "ManagerUserRoleCreateInput",
    "ManagerUserRoleUpdateInput",
    "ManagerUserRoleRevokeInput",
    "ManagerUserRoleQueries",
    "ManagerUserRoleMutations",
    "resolve_manager_user_role_user",
    "resolve_manager_user_role_role",
    "resolve_manager_granted_by_user",
]
