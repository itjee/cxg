"""GraphQL 공통 DataLoader 베이스 클래스

DataLoader 패턴을 구현하여 N+1 쿼리 문제를 해결합니다.
여러 개의 단일 조회를 하나의 배치 쿼리로 최적화합니다.
"""

from typing import Any, Generic, TypeVar
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


ModelType = TypeVar("ModelType")


class BaseDataLoader(Generic[ModelType]):
    """
    기본 DataLoader 클래스 (N+1 쿼리 최적화)

    여러 ID를 한 번의 쿼리로 조회하여 데이터베이스 호출을 최소화합니다.
    GraphQL에서 연관 데이터를 효율적으로 로드할 때 사용합니다.

    사용 예:
        loader = BaseDataLoader(db, User)
        users = await loader.load_many(["id1", "id2", "id3"])
        user = await loader.load("id1")
    """

    def __init__(self, db: AsyncSession, model_class: type[ModelType]):
        """
        DataLoader 초기화

        Args:
            db: SQLAlchemy 비동기 세션
            model_class: 조회할 SQLAlchemy 모델 클래스
        """
        self.db = db
        self.model_class = model_class

    async def load_many(self, ids: list[str]) -> list[ModelType | None]:
        """
        여러 ID를 한 번의 쿼리로 조회 (배치 로딩)

        Args:
            ids: 조회할 ID 목록 (문자열 형식)

        Returns:
            조회된 모델 목록 (입력 순서 보장)
            - 존재하는 ID: 모델 객체 반환
            - 존재하지 않는 ID: None 반환

        Note:
            반환되는 리스트의 순서는 입력된 ids 순서와 동일하게 유지됩니다.
        """
        if not ids:
            return []

        # 문자열 ID를 UUID로 변환
        uuids = [UUID(id_) for id_ in ids]

        # SQLAlchemy 모델 클래스는 런타임에 id 속성을 가지지만
        # 타입 체커는 이를 알 수 없으므로 type: ignore 사용
        stmt = select(self.model_class).where(
            self.model_class.id.in_(uuids)  # type: ignore[attr-defined]
        )
        result = await self.db.execute(stmt)
        items = result.scalars().all()

        # ID를 키로 하는 딕셔너리 생성 (빠른 조회)
        item_map = {str(item.id): item for item in items}  # type: ignore[attr-defined]

        # 입력 순서대로 결과 반환 (없는 ID는 None)
        return [item_map.get(id_) for id_ in ids]

    async def load(self, id_: str) -> ModelType | None:
        """
        단일 ID 조회

        Args:
            id_: 조회할 ID (문자열 형식)

        Returns:
            조회된 모델 객체 또는 None
        """
        result = await self.load_many([id_])
        return result[0] if result else None


class BaseFieldLoader(Generic[ModelType]):
    """
    특정 필드로 조회하는 DataLoader

    ID가 아닌 다른 필드(예: username, email)로 엔티티를 조회할 때 사용합니다.

    사용 예:
        loader = BaseFieldLoader(db, User, "email")
        users = await loader.load_many(["user1@example.com", "user2@example.com"])
        user = await loader.load("user1@example.com")
    """

    def __init__(self, db: AsyncSession, model_class: type[ModelType], field_name: str):
        """
        필드 기반 DataLoader 초기화

        Args:
            db: SQLAlchemy 비동기 세션
            model_class: 조회할 SQLAlchemy 모델 클래스
            field_name: 조회에 사용할 필드명 (예: "email", "username")
        """
        self.db = db
        self.model_class = model_class
        self.field_name = field_name

    async def load_many(self, values: list[Any]) -> list[ModelType | None]:
        """
        여러 필드 값을 한 번의 쿼리로 조회

        Args:
            values: 조회할 필드 값 목록

        Returns:
            조회된 모델 목록 (입력 순서 보장)
            - 존재하는 값: 모델 객체 반환
            - 존재하지 않는 값: None 반환
        """
        if not values:
            return []

        # 지정된 필드로 조회
        field = getattr(self.model_class, self.field_name)
        stmt = select(self.model_class).where(field.in_(values))
        result = await self.db.execute(stmt)
        items = result.scalars().all()

        # 필드 값으로 매핑 (getattr는 런타임에 동작)
        item_map = {
            getattr(item, self.field_name): item
            for item in items  # type: ignore[attr-defined]
        }

        # 입력 순서대로 결과 반환
        return [item_map.get(value) for value in values]

    async def load(self, value: Any) -> ModelType | None:
        """
        단일 필드 값으로 조회

        Args:
            value: 조회할 필드 값

        Returns:
            조회된 모델 객체 또는 None
        """
        result = await self.load_many([value])
        return result[0] if result else None
