"""Manager IDAM Login Logs - Permissions

공통 모듈을 사용한 Permission 구현
"""

from src.graphql.common import CanView, IsMaster


class CanViewManagerLoginLogs(CanView):
    """Manager 로그인 이력 조회 권한"""

    resource = "manager_login_logs"
    message = "Manager 로그인 이력을 조회할 권한이 없습니다"


class CanViewAllManagerLoginLogs(CanView):
    """Manager 전체 로그인 이력 조회 권한"""

    resource = "manager_login_logs_all"
    message = "전체 로그인 이력을 조회할 권한이 없습니다"


class IsMasterUser(IsMaster):
    """MASTER 사용자 권한"""

    message = "MASTER 권한이 필요합니다"
