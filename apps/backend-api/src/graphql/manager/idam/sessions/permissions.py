"""Manager IDAM Sessions - Permissions

공통 모듈을 사용한 Permission 구현
"""

from src.graphql.common import CanDelete, CanManage, CanView


class CanViewManagerSessions(CanView):
    """Manager 세션 목록 조회 권한"""

    resource = "manager_sessions"
    message = "Manager 세션 목록을 조회할 권한이 없습니다"


class CanManageManagerSessions(CanManage):
    """Manager 세션 관리(폐기) 권한"""

    resource = "manager_sessions"
    message = "Manager 세션을 관리할 권한이 없습니다"


class CanDeleteManagerSessions(CanDelete):
    """Manager 세션 삭제 권한"""

    resource = "manager_sessions"
    message = "Manager 세션을 삭제할 권한이 없습니다"
