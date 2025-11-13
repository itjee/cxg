"""Manager IDAM Role Permissions - Permissions

공통 모듈을 사용한 Permission 구현
"""

from src.graphql.common import CanDelete, CanManage, CanView


class CanViewManagerRolePermissions(CanView):
    """Manager 역할-권한 매핑 조회 권한"""

    resource = "manager_role_permissions"
    message = "Manager 역할-권한 매핑을 조회할 권한이 없습니다"


class CanManageManagerRolePermissions(CanManage):
    """Manager 역할-권한 할당/해제 권한"""

    resource = "manager_role_permissions"
    message = "Manager 역할-권한을 관리할 권한이 없습니다"


class CanDeleteManagerRolePermissions(CanDelete):
    """Manager 역할-권한 매핑 삭제 권한"""

    resource = "manager_role_permissions"
    message = "Manager 역할-권한 매핑을 삭제할 권한이 없습니다"
