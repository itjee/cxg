"""GraphQL 데코레이터 - 인증 및 권한 검증"""

from collections.abc import Callable
from functools import wraps

from strawberry.types import Info

from src.core.exceptions import UnauthorizedError


def require_auth(func: Callable) -> Callable:
    """
    GraphQL 리졸버 인증 필수 데코레이터

    사용 예시:
    ```python
    @strawberry.mutation(description="사용자 정보 수정")
    @require_auth
    async def update_user(self, info: Info, id: str, input: UserUpdateInput) -> User:
        # 인증된 사용자만 실행
        ...
    ```
    """

    @wraps(func)
    async def wrapper(*args, **kwargs):
        # strawberry mutation/query에서 첫 번째 인자는 self, 두 번째는 info (Info 객체)
        if len(args) >= 2:
            info = args[1]
            if isinstance(info, Info):
                user_id = info.context.user_id
                if not user_id:
                    raise UnauthorizedError(message="인증이 필요합니다")

        return await func(*args, **kwargs)

    return wrapper


def require_role(required_role: str) -> Callable:
    """
    GraphQL 리졸버 역할 검증 데코레이터

    사용 예시:
    ```python
    @strawberry.mutation(description="모든 사용자 조회")
    @require_role("ADMIN")
    async def get_all_users(self, info: Info) -> List[User]:
        # ADMIN 역할만 실행
        ...
    ```
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if len(args) >= 2:
                info = args[1]
                if isinstance(info, Info):
                    user_id = info.context.user_id
                    user_role = info.context.role

                    if not user_id:
                        raise UnauthorizedError(message="인증이 필요합니다")

                    if user_role != required_role:
                        raise UnauthorizedError(
                            message=f"필수 역할: {required_role}",
                            detail={"required_role": required_role, "user_role": user_role},
                        )

            return await func(*args, **kwargs)

        return wrapper

    return decorator
