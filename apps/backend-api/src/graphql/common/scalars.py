"""GraphQL 공통 스칼라 타입

GraphQL에서 사용할 커스텀 스칼라 타입들을 정의합니다.
UUID, DateTime, Decimal 등 Python 타입을 GraphQL 스칼라로 변환합니다.
"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

import strawberry


@strawberry.scalar(
    serialize=lambda v: str(v),
    parse_value=lambda v: UUID(v) if isinstance(v, str) else v,
    description="UUID 스칼라 타입",
)
class UUIDScalar:
    """
    UUID 스칼라 타입

    Python의 UUID를 GraphQL 스칼라로 사용합니다.
    직렬화 시 문자열로 변환되고, 파싱 시 UUID 객체로 변환됩니다.

    특징:
        - 직렬화: UUID -> 문자열 ("550e8400-e29b-41d4-a716-446655440000")
        - 파싱: 문자열 -> UUID 객체
        - 유효하지 않은 UUID 문자열은 ValueError 발생

    사용 예:
        @strawberry.type
        class User:
            id: UUIDScalar
            tenant_id: UUIDScalar | None

    Note:
        일반적으로는 strawberry.ID를 사용하지만,
        타입 안정성이 중요한 경우 UUIDScalar를 사용할 수 있습니다.
    """

    __annotations__ = {"__origin__": UUID}


@strawberry.scalar(
    serialize=lambda v: v.isoformat() if v else None,
    parse_value=lambda v: datetime.fromisoformat(v) if isinstance(v, str) else v,
    description="DateTime 스칼라 (ISO 8601 형식)",
)
class DateTimeScalar:
    """
    DateTime 스칼라 타입

    Python의 datetime을 GraphQL 스칼라로 사용합니다.
    ISO 8601 형식의 문자열로 직렬화됩니다.

    특징:
        - 직렬화: datetime -> ISO 8601 문자열 ("2024-01-15T10:30:00+09:00")
        - 파싱: ISO 8601 문자열 -> datetime 객체
        - 타임존 정보 포함 가능
        - None 값 처리 지원

    사용 예:
        @strawberry.type
        class Event:
            start_at: DateTimeScalar
            end_at: DateTimeScalar | None
            created_at: DateTimeScalar

    Note:
        - ISO 8601 형식: YYYY-MM-DDTHH:MM:SS[.mmmmmm][+HH:MM]
        - 타임존이 없는 datetime은 naive datetime으로 처리됩니다
    """

    __annotations__ = {"__origin__": datetime}


@strawberry.scalar(
    serialize=lambda v: str(v),
    parse_value=lambda v: Decimal(v) if isinstance(v, (str, int, float)) else v,
    description="Decimal 스칼라 (정확한 소수점 계산)",
)
class DecimalScalar:
    """
    Decimal 스칼라 타입

    Python의 Decimal을 GraphQL 스칼라로 사용합니다.
    부동소수점 오차 없이 정확한 소수점 계산이 필요한 경우 사용합니다.

    특징:
        - 직렬화: Decimal -> 문자열 ("123.45")
        - 파싱: 문자열/숫자 -> Decimal 객체
        - 부동소수점 오차 없는 정확한 계산
        - 금융 계산에 필수

    사용 예:
        @strawberry.type
        class Product:
            price: DecimalScalar
            discount_rate: DecimalScalar | None

        @strawberry.input
        class PaymentInput:
            amount: DecimalScalar
            tax: DecimalScalar

    Note:
        - float 대신 Decimal 사용으로 금융 계산의 정확성 보장
        - 예: 0.1 + 0.2 = 0.30000000000000004 (float) vs 0.3 (Decimal)
        - 문자열로 초기화: Decimal("123.45")
    """

    __annotations__ = {"__origin__": Decimal}
