"""GraphQL 공통 Mutation 헬퍼 함수

엔티티의 생성(Create), 수정(Update), 삭제(Delete) 작업을 위한
재사용 가능한 헬퍼 함수들을 제공합니다.
"""

from collections.abc import Callable
from typing import Any, TypeVar
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


ModelType = TypeVar("ModelType")  # SQLAlchemy Model Type
GraphQLType = TypeVar("GraphQLType")  # GraphQL Type


async def create_entity(
    db: AsyncSession,
    model_class: type[ModelType],
    input_data: Any,
    to_graphql: Callable[[ModelType], GraphQLType],  # type: ignore[type-var]
    prepare_data: Callable[[Any], dict] | None = None,
    before_commit: Callable[[ModelType], None] | None = None,  # type: ignore[type-var]
) -> GraphQLType:
    """
    엔티티 생성 (Create)

    GraphQL Input 데이터를 받아 데이터베이스에 새 엔티티를 생성합니다.

    Args:
        db: 데이터베이스 세션
        model_class: SQLAlchemy 모델 클래스
        input_data: 입력 데이터 (Strawberry Input 타입)
        to_graphql: 모델을 GraphQL 타입으로 변환하는 함수
        prepare_data: 입력 데이터를 모델 생성용으로 변환하는 함수 (선택)
        before_commit: 커밋 전 실행할 후킹 함수 (선택)

    Returns:
        생성된 GraphQL 타입 객체

    사용 예:
        user = await create_entity(
            db=db,
            model_class=User,
            input_data=input,
            to_graphql=user_to_graphql,
            before_commit=lambda u: setattr(u, 'password', hash_password(u.password))
        )
    """
    # 1. 입력 데이터 준비
    if prepare_data:
        # 커스텀 데이터 변환 함수가 제공된 경우
        data = prepare_data(input_data)
    else:
        # 기본: 입력 객체의 모든 공개 필드를 dict로 변환
        data = {k: v for k, v in input_data.__dict__.items() if not k.startswith("_")}

    # 2. 엔티티 생성
    entity = model_class(**data)  # type: ignore[call-arg]

    # 3. 커밋 전 후킹 (예: 비밀번호 해싱, 기본값 설정 등)
    if before_commit:
        before_commit(entity)

    # 4. 데이터베이스에 저장
    db.add(entity)
    await db.commit()
    await db.refresh(entity)  # DB에서 생성된 값(ID, 타임스탬프 등) 갱신

    # 5. GraphQL 타입으로 변환하여 반환
    return to_graphql(entity)


async def update_entity(
    db: AsyncSession,
    model_class: type[ModelType],
    entity_id: UUID,
    input_data: Any,
    to_graphql: Callable[[ModelType], GraphQLType],  # type: ignore[type-var]
    update_fields: list[str] | None = None,
    before_commit: Callable[[ModelType], None] | None = None,  # type: ignore[type-var]
    **filters: Any,
) -> GraphQLType | None:
    """
    엔티티 수정 (Update)

    ID로 엔티티를 조회한 후 입력 데이터로 필드를 업데이트합니다.

    Args:
        db: 데이터베이스 세션
        model_class: SQLAlchemy 모델 클래스
        entity_id: 수정할 엔티티 ID
        input_data: 입력 데이터 (Strawberry Input 타입)
        to_graphql: 모델을 GraphQL 타입으로 변환하는 함수
        update_fields: 업데이트할 필드 목록 (None이면 모든 non-None 필드)
        before_commit: 커밋 전 실행할 후킹 함수 (선택)
        **filters: 추가 필터 조건 (예: tenant_id=current_tenant_id)

    Returns:
        수정된 GraphQL 타입 객체 또는 None (엔티티를 찾을 수 없는 경우)

    사용 예:
        user = await update_entity(
            db=db,
            model_class=User,
            entity_id=user_id,
            input_data=input,
            to_graphql=user_to_graphql,
            tenant_id=current_tenant_id  # 추가 필터
        )
    """
    # 1. 기본 조회 쿼리 구성
    stmt = select(model_class).where(
        model_class.id == entity_id  # type: ignore[attr-defined]
    )

    # 2. 추가 필터 적용 (예: 테넌트 격리, soft delete 체크 등)
    for field, value in filters.items():
        if hasattr(model_class, field):
            stmt = stmt.where(getattr(model_class, field) == value)

    # 3. 엔티티 조회
    result = await db.execute(stmt)
    entity = result.scalar_one_or_none()

    if not entity:
        return None

    # 4. 입력 데이터를 딕셔너리로 변환
    input_dict = {k: v for k, v in input_data.__dict__.items() if not k.startswith("_")}

    # 5. 필드 업데이트
    if update_fields:
        # 지정된 필드만 업데이트
        for field in update_fields:
            if field in input_dict:
                value = input_dict[field]
                if value is not None:
                    setattr(entity, field, value)
    else:
        # 모든 non-None 필드 업데이트 (부분 업데이트 지원)
        for field, value in input_dict.items():
            if value is not None and hasattr(entity, field):
                setattr(entity, field, value)

    # 6. 커밋 전 후킹
    if before_commit:
        before_commit(entity)

    # 7. 데이터베이스에 저장
    await db.commit()
    await db.refresh(entity)

    # 8. GraphQL 타입으로 변환하여 반환
    return to_graphql(entity)


async def delete_entity(
    db: AsyncSession,
    model_class: type[ModelType],
    entity_id: UUID,
    soft_delete: bool = False,
    **filters: Any,
) -> bool:
    """
    엔티티 삭제 (Delete)

    ID로 엔티티를 조회한 후 삭제합니다.
    Soft Delete 또는 Hard Delete를 선택할 수 있습니다.

    Args:
        db: 데이터베이스 세션
        model_class: SQLAlchemy 모델 클래스
        entity_id: 삭제할 엔티티 ID
        soft_delete: True면 is_deleted=True로 설정, False면 실제 삭제
        **filters: 추가 필터 조건

    Returns:
        성공 여부 (True: 삭제 성공, False: 엔티티를 찾을 수 없음)

    사용 예:
        # Soft Delete
        success = await delete_entity(
            db=db,
            model_class=User,
            entity_id=user_id,
            soft_delete=True
        )

        # Hard Delete
        success = await delete_entity(
            db=db,
            model_class=User,
            entity_id=user_id,
            soft_delete=False
        )
    """
    # 1. 기본 조회 쿼리 구성
    stmt = select(model_class).where(
        model_class.id == entity_id  # type: ignore[attr-defined]
    )

    # 2. 추가 필터 적용
    for field, value in filters.items():
        if hasattr(model_class, field):
            stmt = stmt.where(getattr(model_class, field) == value)

    # 3. 엔티티 조회
    result = await db.execute(stmt)
    entity = result.scalar_one_or_none()

    if not entity:
        return False

    # 4. Soft Delete 또는 Hard Delete
    if soft_delete and hasattr(entity, "is_deleted"):
        # Soft Delete: is_deleted 플래그만 True로 설정
        entity.is_deleted = True  # type: ignore[attr-defined]
        await db.commit()
    else:
        # Hard Delete: 데이터베이스에서 실제로 삭제
        await db.delete(entity)
        await db.commit()

    return True
