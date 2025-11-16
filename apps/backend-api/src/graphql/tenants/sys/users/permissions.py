"""Tenants SYS Users - Permissions"""

from typing import Any

from strawberry.permission import BasePermission
from strawberry.types import Info


class CanViewTenantsUsers(BasePermission):
    """사용자 목록 조회 권한"""

    message = "사용자 목록을 조회할 권한이 없습니다"

    async def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
        """권한 검증"""
        # TODO: 실제 권한 체크 로직 구현
        # context에서 현재 사용자 정보 및 권한 확인
        return True


class CanManageTenantsUsers(BasePermission):
    """사용자 관리(생성/수정/삭제) 권한"""

    message = "사용자를 관리할 권한이 없습니다"

    async def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
        """권한 검증"""
        # TODO: 실제 권한 체크 로직 구현
        return True


class CanDeleteTenantsUsers(BasePermission):
    """사용자 삭제 권한"""

    message = "사용자를 삭제할 권한이 없습니다"

    async def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
        """권한 검증"""
        # TODO: 실제 권한 체크 로직 구현
        return True


class IsTenantsOwnerOrAdmin(BasePermission):
    """본인 또는 관리자 권한"""

    message = "본인 정보만 조회/수정할 수 있습니다"

    async def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
        """권한 검증 - 본인 또는 관리자만 허용"""
        current_user_id = info.context.user_id
        target_user_id = kwargs.get("id")

        # 본인이거나 관리자인 경우 허용
        if current_user_id == target_user_id:
            return True

        # TODO: 관리자 권한 체크
        return True
