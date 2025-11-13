"""Manager IDAM Role Permissions - Permissions

역할-권한 매핑 접근 제어를 위한 권한 클래스 정의

공통 모듈의 권한 클래스를 상속받아 리소스별 권한을 정의합니다.
각 권한 클래스는 resource와 message 속성을 통해 권한 검증 로직을 커스터마이징합니다.
"""

from src.graphql.common import CanDelete, CanManage, CanView


class CanViewManagerRolePermissions(CanView):
    """Manager 역할-권한 매핑 조회 권한

    Query 작업에 필요한 읽기 권한
    """

    resource = "manager_role_permissions"
    message = "Manager 역할-권한 매핑을 조회할 권한이 없습니다"


class CanManageManagerRolePermissions(CanManage):
    """Manager 역할-권한 할당/해제 권한

    Mutation 작업(생성/수정)에 필요한 관리 권한
    """

    resource = "manager_role_permissions"
    message = "Manager 역할-권한을 관리할 권한이 없습니다"


class CanDeleteManagerRolePermissions(CanDelete):
    """Manager 역할-권한 매핑 삭제 권한

    Mutation 삭제 작업에 필요한 권한
    """

    resource = "manager_role_permissions"
    message = "Manager 역할-권한 매핑을 삭제할 권한이 없습니다"
