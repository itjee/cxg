"""GraphQL 공통 Converter 유틸리티

SQLAlchemy 모델과 GraphQL 타입 간의 변환을 돕는 유틸리티 함수들을 제공합니다.
타입 변환, ID 변환 등의 공통 변환 로직을 캡슐화합니다.
"""

from collections.abc import Callable
from typing import Any, TypeVar
from uuid import UUID

import strawberry


ModelType = TypeVar("ModelType")  # SQLAlchemy Model Type
GraphQLType = TypeVar("GraphQLType")  # GraphQL Type


def model_to_graphql_converter(
    graphql_type: type[GraphQLType],
) -> Callable[[ModelType], GraphQLType]:  # type: ignore[type-var]
    """
    SQLAlchemy 모델을 GraphQL 타입으로 변환하는 함수 생성

    자동으로 필드를 매핑하여 변환 함수를 생성합니다.
    수동으로 변환 함수를 작성하는 번거로움을 줄여줍니다.

    Args:
        graphql_type: 변환할 대상 GraphQL 타입 클래스

    Returns:
        변환 함수 (model -> GraphQL type)

    사용 예:
        # 변환 함수 생성
        to_graphql_user = model_to_graphql_converter(ManagerUser)

        # 사용
        user_model = await db.get(User, user_id)
        user_graphql = to_graphql_user(user_model)

    Note:
        - UUID는 자동으로 strawberry.ID로 변환됩니다
        - None 값은 그대로 유지됩니다
        - Strawberry 필드 정의를 기반으로 매핑합니다
    """

    def converter(model: ModelType) -> GraphQLType:  # type: ignore[type-var]
        """
        모델을 GraphQL 타입으로 변환

        Args:
            model: SQLAlchemy 모델 인스턴스

        Returns:
            GraphQL 타입 인스턴스
        """
        # GraphQL 타입의 필드 정의 가져오기
        field_definitions = getattr(graphql_type, "__strawberry_definition__", None)

        if not field_definitions:
            # fallback: Strawberry 정의가 없는 경우 모든 필드를 자동 매핑
            kwargs: dict[str, Any] = {}
            for field_name in dir(model):
                if not field_name.startswith("_"):
                    value = getattr(model, field_name, None)
                    if value is not None and not callable(value):
                        # UUID를 strawberry.ID로 변환
                        if isinstance(value, UUID):
                            kwargs[field_name] = strawberry.ID(str(value))
                        else:
                            kwargs[field_name] = value
            return graphql_type(**kwargs)  # type: ignore[call-arg]

        # Strawberry 필드 정의를 기반으로 매핑
        kwargs = {}
        for field in field_definitions.fields:
            field_name = field.python_name
            if hasattr(model, field_name):
                value = getattr(model, field_name)

                # 타입별 특별 처리
                if value is None:
                    # None 값은 그대로 유지
                    kwargs[field_name] = None
                elif isinstance(value, UUID):
                    # UUID -> strawberry.ID 변환
                    kwargs[field_name] = strawberry.ID(str(value))
                else:
                    # 그 외는 그대로 전달
                    kwargs[field_name] = value

        return graphql_type(**kwargs)  # type: ignore[call-arg]

    return converter


def safe_uuid_to_id(value: UUID | None) -> strawberry.ID | None:
    """
    UUID를 Strawberry ID로 안전하게 변환

    None 값을 처리하여 안전한 변환을 보장합니다.

    Args:
        value: 변환할 UUID 또는 None

    Returns:
        변환된 strawberry.ID 또는 None

    사용 예:
        user_id = safe_uuid_to_id(user.id)  # UUID -> strawberry.ID
        tenant_id = safe_uuid_to_id(None)   # None -> None
    """
    return strawberry.ID(str(value)) if value else None


def safe_id_to_uuid(value: strawberry.ID | str | None) -> UUID | None:
    """
    Strawberry ID를 UUID로 안전하게 변환

    None 값과 다양한 입력 타입을 처리합니다.

    Args:
        value: 변환할 strawberry.ID, 문자열 또는 None

    Returns:
        변환된 UUID 또는 None

    사용 예:
        # GraphQL에서 받은 ID를 UUID로 변환
        user_uuid = safe_id_to_uuid(input.user_id)  # strawberry.ID -> UUID

        # None 처리
        optional_uuid = safe_id_to_uuid(None)  # None -> None

    Raises:
        ValueError: UUID 형식이 올바르지 않은 경우
    """
    if value is None:
        return None
    return UUID(str(value))
