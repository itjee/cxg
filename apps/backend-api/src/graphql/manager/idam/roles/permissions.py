"""Manager IDAM Roles - Permissions

공통 모듈을 사용한 Permission 구현
"""

from src.graphql.common import CanDelete, CanManage, CanView


class CanViewManagerRoles(CanView):
    """Manager 역할 목록 조회 권한"""

    resource = "manager_roles"
    message = "Manager 역할 목록을 조회할 권한이 없습니다"


class CanManageManagerRoles(CanManage):
    """Manager 역할 관리(생성/수정) 권한"""

    resource = "manager_roles"
    message = "Manager 역할을 관리할 권한이 없습니다"


class CanDeleteManagerRoles(CanDelete):
    """Manager 역할 삭제 권한"""

    resource = "manager_roles"
    message = "Manager 역할을 삭제할 권한이 없습니다"
