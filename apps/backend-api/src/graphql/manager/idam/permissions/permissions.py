"""Manager IDAM Permissions - Permissions

공통 모듈을 사용한 Permission 구현
"""

from src.graphql.common import CanManage, CanView, IsMaster


class CanViewManagerPermissions(CanView):
    """Manager 권한 목록 조회 권한"""

    resource = "permissions"
    message = "Manager 권한 목록을 조회할 권한이 없습니다"


class CanManageManagerPermissions(CanManage):
    """Manager 권한 관리(생성/수정) 권한"""

    resource = "permissions"
    message = "Manager 권한을 관리할 권한이 없습니다"


class IsManagerMasterUser(IsMaster):
    """MASTER 사용자 권한"""

    message = "MASTER 권한이 필요합니다"
