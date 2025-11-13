"""Manager IDAM Users - Permissions

공통 모듈을 사용한 Permission 구현
"""

from src.graphql.common import CanDelete, CanManage, CanView, IsMaster


class CanViewManagerUsers(CanView):
    """Manager 사용자 목록 조회 권한"""

    resource = "manager_users"
    message = "Manager 사용자 목록을 조회할 권한이 없습니다"


class CanManageManagerUsers(CanManage):
    """Manager 사용자 관리(생성/수정) 권한"""

    resource = "manager_users"
    message = "Manager 사용자를 관리할 권한이 없습니다"


class CanDeleteManagerUsers(CanDelete):
    """Manager 사용자 삭제 권한"""

    resource = "manager_users"
    message = "Manager 사용자를 삭제할 권한이 없습니다"


class IsMasterUser(IsMaster):
    """MASTER 사용자 권한"""

    message = "MASTER 권한이 필요합니다"
