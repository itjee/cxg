"""GraphQL 공통 Query 헬퍼 함수

엔티티 조회를 위한 재사용 가능한 헬퍼 함수들을 제공합니다.
단일 조회, 목록 조회, 개수 조회 등 기본적인 Read 작업을 지원합니다.
"""

from collections.abc import Callable
from typing import Any, TypeVar
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


ModelType = TypeVar("ModelType")  # SQLAlchemy Model Type
GraphQLType = TypeVar("GraphQLType")  # GraphQL Type


async def get_by_id(
    db: AsyncSession,
    model_class: type[ModelType],
    id_: UUID,
    to_graphql: Callable[[ModelType], GraphQLType],  # type: ignore[type-var]
    **filters: Any,
) -> GraphQLType | None:
    """
    ID로 단일 엔티티 조회

    UUID를 사용하여 데이터베이스에서 단일 엔티티를 조회합니다.
    추가 필터를 적용하여 조건부 조회가 가능합니다.

    Args:
        db: 데이터베이스 세션
        model_class: SQLAlchemy 모델 클래스
        id_: 조회할 엔티티의 UUID
        to_graphql: 모델을 GraphQL 타입으로 변환하는 함수
        **filters: 추가 필터 조건 (예: is_deleted=False, tenant_id=xxx)

    Returns:
        GraphQL 타입 객체 또는 None (엔티티를 찾을 수 없는 경우)

    사용 예:
        user = await get_by_id(
            db=db,
            model_class=User,
            id_=user_id,
            to_graphql=user_to_graphql,
            is_deleted=False  # Soft delete 필터
        )
    """
    # 1. 기본 ID 조회 쿼리 생성
    stmt = select(model_class).where(
        model_class.id == id_  # type: ignore[attr-defined]
    )

    # 2. 추가 필터 적용 (예: is_deleted=False, status='ACTIVE' 등)
    for field, value in filters.items():
        if hasattr(model_class, field):
            stmt = stmt.where(getattr(model_class, field) == value)

    # 3. 쿼리 실행
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()

    # 4. 결과가 없으면 None 반환
    if not item:
        return None

    # 5. DB 모델을 GraphQL 타입으로 변환
    return to_graphql(item)


async def get_list(
    db: AsyncSession,
    model_class: type[ModelType],
    to_graphql: Callable[[ModelType], GraphQLType],  # type: ignore[type-var]
    limit: int = 20,
    offset: int = 0,
    order_by: Any = None,
    extra_conditions: list[Any] | None = None,
    **filters: Any,
) -> list[GraphQLType]:
    """
    엔티티 목록 조회 (페이징, 필터링, 정렬 지원)

    다양한 조건으로 엔티티 목록을 조회합니다.
    페이징, 필터링, 정렬을 모두 지원합니다.

    Args:
        db: 데이터베이스 세션
        model_class: SQLAlchemy 모델 클래스
        to_graphql: 모델을 GraphQL 타입으로 변환하는 함수
        limit: 조회 개수 제한 (기본값: 20)
        offset: 조회 시작 위치 (페이징용, 기본값: 0)
        order_by: 정렬 기준 (예: User.created_at.desc())
                  기본값은 created_at 내림차순
        extra_conditions: 추가 WHERE 조건 리스트 (복잡한 조건용)
        **filters: 단순 필터 조건 (예: status='ACTIVE', is_deleted=False)

    Returns:
        GraphQL 타입 객체 리스트

    사용 예:
        # 기본 조회
        users = await get_list(
            db=db,
            model_class=User,
            to_graphql=user_to_graphql,
            limit=10,
            offset=0
        )

        # 필터 및 정렬 적용
        active_users = await get_list(
            db=db,
            model_class=User,
            to_graphql=user_to_graphql,
            order_by=User.created_at.desc(),
            status='ACTIVE',
            is_deleted=False
        )

        # 복잡한 조건 사용
        from sqlalchemy import or_
        users = await get_list(
            db=db,
            model_class=User,
            to_graphql=user_to_graphql,
            extra_conditions=[or_(User.email.like('%@example.com'), User.username.like('admin%'))]
        )
    """
    # 1. 기본 쿼리 생성 (limit, offset 적용)
    stmt = select(model_class).limit(limit).offset(offset)

    # 2. 단순 필터 적용 (AND 조건)
    for field, value in filters.items():
        if hasattr(model_class, field) and value is not None:
            stmt = stmt.where(getattr(model_class, field) == value)

    # 3. 추가 조건 적용 (복잡한 WHERE 조건)
    if extra_conditions:
        for condition in extra_conditions:
            stmt = stmt.where(condition)

    # 4. 정렬 적용
    if order_by is not None:
        # 명시적으로 정렬 기준이 제공된 경우 (리스트면 unpacking, 아니면 단일 값)
        stmt = stmt.order_by(*order_by) if isinstance(order_by, list) else stmt.order_by(order_by)
    elif hasattr(model_class, "created_at"):
        # 기본 정렬: created_at 내림차순 (최신 데이터 우선)
        stmt = stmt.order_by(
            model_class.created_at.desc()  # type: ignore[attr-defined]
        )

    # 5. 쿼리 실행
    result = await db.execute(stmt)
    items = result.scalars().all()

    # 6. 모든 아이템을 GraphQL 타입으로 변환
    return [to_graphql(item) for item in items]


async def get_count(db: AsyncSession, model_class: type[ModelType], **filters: Any) -> int:
    """
    엔티티 개수 조회

    필터 조건에 맞는 엔티티의 총 개수를 반환합니다.
    페이징 UI 구현 시 전체 페이지 수 계산에 사용됩니다.

    Args:
        db: 데이터베이스 세션
        model_class: SQLAlchemy 모델 클래스
        **filters: 필터 조건 (예: status='ACTIVE')

    Returns:
        필터 조건에 맞는 엔티티의 개수

    사용 예:
        # 전체 사용자 수
        total_users = await get_count(db, User)

        # 활성 사용자 수
        active_users = await get_count(
            db,
            User,
            status='ACTIVE',
            is_deleted=False
        )

        # 페이지 수 계산
        page_size = 20
        total_count = await get_count(db, User, status='ACTIVE')
        total_pages = (total_count + page_size - 1) // page_size
    """
    # 1. COUNT 쿼리 생성
    stmt = select(func.count()).select_from(model_class)

    # 2. 필터 적용
    for field, value in filters.items():
        if hasattr(model_class, field) and value is not None:
            stmt = stmt.where(getattr(model_class, field) == value)

    # 3. 쿼리 실행 및 결과 반환
    result = await db.execute(stmt)
    return result.scalar_one()
