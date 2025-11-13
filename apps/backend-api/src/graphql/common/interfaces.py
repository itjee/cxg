"""GraphQL 공통 인터페이스 (Relay 스펙)

Relay 스펙을 따르는 GraphQL 인터페이스를 정의합니다.
모든 엔티티가 구현해야 하는 기본 인터페이스를 제공합니다.
"""

import strawberry


@strawberry.interface(description="Relay Node 인터페이스")
class Node:
    """
    Relay Node 인터페이스

    Relay 스펙에 따른 전역 객체 식별(Global Object Identification)을 위한 인터페이스입니다.
    모든 엔티티가 이 인터페이스를 구현하여 전역적으로 고유한 ID를 제공합니다.

    특징:
        - 모든 타입에 걸쳐 전역적으로 고유한 ID 제공
        - ID만으로 객체 타입을 식별하고 조회 가능
        - Relay 클라이언트 라이브러리와 호환

    사용 예:
        @strawberry.type
        class User(Node):
            id: strawberry.ID
            name: str
            email: str

        @strawberry.type
        class Product(Node):
            id: strawberry.ID
            name: str
            price: Decimal

    Note:
        - id 필드는 strawberry.ID 타입이어야 합니다
        - 일반적으로 "Type:UUID" 형식으로 인코딩합니다 (예: "User:123e4567-e89b-12d3-a456-426614174000")
        - 이를 통해 타입과 ID를 동시에 식별할 수 있습니다
    """

    id: strawberry.ID
