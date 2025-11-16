"""Manager IDAM Users

사용자(User) 관련 GraphQL 컴포넌트 모듈

이 모듈은 Manager 시스템의 사용자 관리 기능을 제공합니다.
사용자는 플랫폼 관리자 및 테넌트 관리자를 포함하며,
역할과 권한을 통해 시스템 기능에 접근할 수 있습니다.
"""

from .mutations import ManagerUserMutations
from .queries import ManagerUserQueries
from .resolvers import (
    resolve_manager_user_permissions,
    resolve_manager_user_roles,
    resolve_manager_user_sessions,
)
from .types import ManagerUser, ManagerUserCreateInput, ManagerUserUpdateInput


__all__ = [
    "ManagerUser",
    "ManagerUserCreateInput",
    "ManagerUserUpdateInput",
    "ManagerUserQueries",
    "ManagerUserMutations",
    "resolve_manager_user_roles",
    "resolve_manager_user_sessions",
    "resolve_manager_user_permissions",
]
