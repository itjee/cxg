"""GraphQL 공통 Permission 베이스 클래스

권한 검증을 위한 재사용 가능한 Permission 클래스들을 제공합니다.
Strawberry의 Permission 시스템을 확장하여 리소스 기반 권한 관리를 지원합니다.
"""

from collections.abc import Callable
from typing import Any

from strawberry.permission import BasePermission
from strawberry.types import Info


class BaseResourcePermission(BasePermission):
    """
    리소스 기반 권한 검증 베이스 클래스

    리소스(Resource)와 액션(Action)을 조합하여 세밀한 권한 제어를 구현합니다.

    속성:
        resource: 보호할 리소스 이름 (예: "users", "roles", "products")
        action: 수행할 액션 (예: "view", "create", "update", "delete")
        message: 권한이 없을 때 표시할 에러 메시지

    사용 예:
        class CanViewUsers(BaseResourcePermission):
            resource = "users"
            action = "view"

        @strawberry.field(permission_classes=[CanViewUsers])
        async def users(self, info) -> list[User]:
            ...
    """

    resource: str = ""  # 리소스 이름 (예: "users", "roles")
    action: str = ""  # 액션 (예: "view", "create", "update", "delete")
    message: str = "권한이 없습니다"

    async def has_permission(self, source: Any, info: Info, **kwargs: Any) -> bool:
        """
        권한 검증 로직

        Args:
            source: GraphQL 소스 객체
            info: GraphQL 실행 컨텍스트 (사용자 정보 포함)
            **kwargs: 추가 인자

        Returns:
            권한이 있으면 True, 없으면 False

        Note:
            실제 프로젝트에서는 info.context에서 사용자 정보 및 권한을 확인하여
            구현해야 합니다.
        """
        # TODO: 실제 권한 체크 로직 구현
        # 예시:
        # user = info.context.user
        # return user.has_permission(self.resource, self.action)
        return True


class CanView(BaseResourcePermission):
    """
    조회(View) 권한

    리소스를 읽기/조회할 수 있는 권한입니다.
    """

    action = "view"


class CanCreate(BaseResourcePermission):
    """
    생성(Create) 권한

    새로운 리소스를 생성할 수 있는 권한입니다.
    """

    action = "create"


class CanUpdate(BaseResourcePermission):
    """
    수정(Update) 권한

    기존 리소스를 수정할 수 있는 권한입니다.
    """

    action = "update"


class CanDelete(BaseResourcePermission):
    """
    삭제(Delete) 권한

    리소스를 삭제할 수 있는 권한입니다.
    """

    action = "delete"


class CanManage(BaseResourcePermission):
    """
    관리(Manage) 권한

    리소스를 완전히 관리(생성/수정/삭제)할 수 있는 권한입니다.
    """

    action = "manage"


class IsAuthenticated(BasePermission):
    """
    인증된 사용자만 허용

    로그인한 사용자만 접근할 수 있는 권한입니다.

    사용 예:
        @strawberry.field(permission_classes=[IsAuthenticated])
        async def my_profile(self, info) -> User:
            ...
    """

    message = "인증이 필요합니다"

    async def has_permission(self, source: Any, info: Info, **kwargs: Any) -> bool:
        """
        인증 여부 확인

        Returns:
            인증되었으면 True, 아니면 False
        """
        # TODO: 실제 인증 체크 로직 구현
        # 예시:
        # user = info.context.user
        # return user is not None and user.is_authenticated
        return True


class IsMaster(BasePermission):
    """
    MASTER 사용자만 허용

    최고 권한을 가진 MASTER 사용자만 접근할 수 있는 권한입니다.

    사용 예:
        @strawberry.mutation(permission_classes=[IsMaster])
        async def delete_tenant(self, info, id: ID) -> bool:
            ...
    """

    message = "MASTER 권한이 필요합니다"

    async def has_permission(self, source: Any, info: Info, **kwargs: Any) -> bool:
        """
        MASTER 권한 확인

        Returns:
            MASTER 사용자이면 True, 아니면 False
        """
        # TODO: 실제 MASTER 권한 체크 로직 구현
        # 예시:
        # user = info.context.user
        # return user is not None and user.user_type == "MASTER"
        return True


def create_permission_class(
    resource: str,
    action: str,
    message: str | None = None,
    check_fn: Callable[[Info], bool] | None = None,
) -> type[BasePermission]:
    """
    동적으로 Permission 클래스 생성

    런타임에 리소스와 액션을 조합하여 새로운 Permission 클래스를 생성합니다.

    Args:
        resource: 리소스 이름 (예: "users", "products")
        action: 액션 (예: "view", "create")
        message: 에러 메시지 (선택, 기본값은 자동 생성)
        check_fn: 커스텀 권한 검증 함수 (선택)

    Returns:
        생성된 Permission 클래스

    사용 예:
        # 기본 사용
        CanViewUsers = create_permission_class("users", "view")

        # 커스텀 체크 함수 사용
        def check_admin(info: Info) -> bool:
            return info.context.user.is_admin

        CanManageSystem = create_permission_class(
            "system",
            "manage",
            message="시스템 관리자 권한이 필요합니다",
            check_fn=check_admin
        )
    """
    # 클래스 이름 생성 (예: CanViewUsers)
    class_name = f"Can{action.capitalize()}{resource.capitalize()}"

    # 동적 Permission 클래스 생성
    class DynamicPermission(BaseResourcePermission):
        pass

    # 속성 설정
    DynamicPermission.resource = resource
    DynamicPermission.action = action
    DynamicPermission.message = message or f"{resource}에 대한 {action} 권한이 없습니다"
    DynamicPermission.__name__ = class_name

    # 커스텀 체크 함수가 제공된 경우 오버라이드
    if check_fn:

        async def has_permission(self: Any, source: Any, info: Info, **kwargs: Any) -> bool:
            """커스텀 권한 검증"""
            return check_fn(info)

        DynamicPermission.has_permission = has_permission  # type: ignore[assignment]

    return DynamicPermission
