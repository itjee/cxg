"""SYS 모듈 - 모든 테이블 모델 정의

10개의 테이블 모델을 포함합니다:
- CodeRules: 코드 규칙
- Permissions: 권한 카탈로그
- RolePermissions: 역할-권한 매핑
- Roles: 역할 정의
- Users: 사용자 계정
- Sessions: 사용자 세션 추적 (신규)
- UserRoles: 사용자-역할 매핑 이력 (신규)
- RolePermissionsHistory: 권한 변경 이력 (신규)
- PermissionConflictResolution: 권한 충돌 해결 정책 (신규)
- Menus: 메뉴 구조 (신규)
"""


from .code_rules import CodeRules
from .permissions import Permissions
from .role_permissions import RolePermissions
from .roles import Roles
from .users import Users
from .sessions import Sessions
from .user_roles import UserRoles
from .role_permissions_history import RolePermissionsHistory
from .permission_conflict_resolution import PermissionConflictResolution
from .menus import Menus

__all__ = [
    "CodeRules",
    "Permissions",
    "RolePermissions",
    "Roles",
    "Users",
    "Sessions",
    "UserRoles",
    "RolePermissionsHistory",
    "PermissionConflictResolution",
    "Menus",
]
