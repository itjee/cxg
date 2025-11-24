"""Manager TNNT Tenants - Permissions

공통 모듈을 사용한 Permission 구현
"""

from src.graphql.common import CanDelete, CanManage, CanView, IsMaster


class CanViewManagerTenants(CanView):
    """Manager 테넌트 목록 조회 권한"""

    resource = "manager_tenants"
    message = "Manager 테넌트 목록을 조회할 권한이 없습니다"


class CanManageManagerTenants(CanManage):
    """Manager 테넌트 관리(생성/수정) 권한"""

    resource = "manager_tenants"
    message = "Manager 테넌트를 관리할 권한이 없습니다"


class CanDeleteManagerTenants(CanDelete):
    """Manager 테넌트 삭제 권한"""

    resource = "manager_tenants"
    message = "Manager 테넌트를 삭제할 권한이 없습니다"


class IsManagerMasterUser(IsMaster):
    """MASTER 사용자 권한"""

    message = "MASTER 권한이 필요합니다"
