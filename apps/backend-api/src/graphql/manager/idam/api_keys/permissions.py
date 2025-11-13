"""Manager IDAM API Keys - Permissions

공통 모듈을 사용한 Permission 구현
"""

from src.graphql.common import CanManage, CanView, IsMaster


class CanViewManagerApiKeys(CanView):
    """Manager API 키 목록 조회 권한"""

    resource = "manager_api_keys"
    message = "Manager API 키 목록을 조회할 권한이 없습니다"

    # TODO: 추가 구현 필요
    # - 자신의 API 키는 누구나 조회 가능
    # - 다른 사용자의 API 키는 관리자만 조회 가능


class CanManageManagerApiKeys(CanManage):
    """Manager API 키 관리(생성/수정) 권한"""

    resource = "manager_api_keys"
    message = "Manager API 키를 관리할 권한이 없습니다"

    # TODO: 추가 구현 필요
    # - 자신의 API 키는 생성/수정 가능
    # - 다른 사용자의 API 키는 MASTER만 관리 가능


class CanRevokeManagerApiKeys(CanManage):
    """Manager API 키 폐기 권한"""

    resource = "manager_api_keys"
    message = "Manager API 키를 폐기할 권한이 없습니다"

    # TODO: 추가 구현 필요
    # - MASTER 또는 본인만 폐기 가능


class IsMasterUser(IsMaster):
    """MASTER 사용자 권한"""

    message = "MASTER 권한이 필요합니다"
