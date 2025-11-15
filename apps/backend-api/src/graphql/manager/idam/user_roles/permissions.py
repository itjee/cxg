"""Manager IDAM User Roles - Permissions

공통 모듈을 사용한 Permission 구현
"""

from src.graphql.common import CanDelete, CanManage, CanView


class CanViewUserRoles(CanView):
    """Manager 사용자-역할 매핑 조회 권한"""

    resource = "manager_user_roles"
    message = "Manager 사용자-역할 매핑을 조회할 권한이 없습니다"


class CanManageUserRoles(CanManage):
    """Manager 사용자-역할 할당/해제 권한"""

    resource = "manager_user_roles"
    message = "Manager 사용자-역할을 관리할 권한이 없습니다"


class CanDeleteUserRoles(CanDelete):
    """Manager 사용자-역할 매핑 삭제 권한"""

    resource = "manager_user_roles"
    message = "Manager 사용자-역할 매핑을 삭제할 권한이 없습니다"
