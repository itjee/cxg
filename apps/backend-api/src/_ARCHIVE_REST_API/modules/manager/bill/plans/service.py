"""Service layer for Plans."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.bill import Plans

from .schemas import PlansCreate, PlansListResponse, PlansResponse, PlansUpdate


class PlansService:
    """요금제 관리 서비스."""

    @staticmethod
    async def create(
        db: AsyncSession, data: PlansCreate, created_by: UUID | None = None
    ) -> PlansResponse:
        """새로운 요금제를 생성합니다."""
        # 중복 코드 확인
        stmt = select(Plans).where(
            and_(Plans.code == data.code, Plans.deleted == False)
        )
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"코드 '{data.code}'는 이미 존재합니다",
            )

        obj = Plans(**data.model_dump(), created_by=created_by)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return PlansResponse.model_validate(obj)

    @staticmethod
    async def get_by_id(db: AsyncSession, obj_id: UUID) -> PlansResponse:
        """ID로 요금제를 조회합니다."""
        stmt = select(Plans).where(
            and_(Plans.id == obj_id, Plans.deleted == False)
        )
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="요금제를 찾을 수 없습니다",
            )

        return PlansResponse.model_validate(obj)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        search: str | None = None,
        status_filter: str | None = None,
        type_filter: str | None = None,
        billing_cycle_filter: str | None = None,
        sort_by: str | None = None,
        sort_order: str = "desc",
    ) -> PlansListResponse:
        """페이지네이션, 필터링, 정렬을 포함한 요금제 목록을 조회합니다."""
        stmt = select(Plans).where(Plans.deleted == False)

        # 검색 필터 적용
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    Plans.code.ilike(search_pattern),
                    Plans.name.ilike(search_pattern),
                    Plans.description.ilike(search_pattern),
                )
            )

        # 상태 필터 적용
        if status_filter:
            stmt = stmt.where(Plans.status == status_filter)

        # 유형 필터 적용
        if type_filter:
            stmt = stmt.where(Plans.type == type_filter)

        # 청구 주기 필터 적용
        if billing_cycle_filter:
            stmt = stmt.where(Plans.billing_cycle == billing_cycle_filter)

        # 전체 개수 조회
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # 정렬 적용 (기본값: created_at desc)
        if sort_by == "name":
            sort_column = Plans.name
        elif sort_by == "base_price":
            sort_column = Plans.base_price
        elif sort_by == "type":
            sort_column = Plans.type
        elif sort_by == "status":
            sort_column = Plans.status
        elif sort_by == "start_time":
            sort_column = Plans.start_time
        else:  # created_at
            sort_column = Plans.created_at

        if sort_order.lower() == "asc":
            stmt = stmt.order_by(sort_column.asc())
        else:
            stmt = stmt.order_by(sort_column.desc())

        # 페이지네이션 적용
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await db.execute(stmt)
        items = result.scalars().all()

        total_pages = (total + page_size - 1) // page_size

        return PlansListResponse(
            items=[PlansResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, obj_id: UUID, data: PlansUpdate, updated_by: UUID | None = None
    ) -> PlansResponse:
        """요금제 정보를 수정합니다."""
        stmt = select(Plans).where(
            and_(Plans.id == obj_id, Plans.deleted == False)
        )
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="요금제를 찾을 수 없습니다",
            )

        # 코드 중복 검사 (코드가 변경되는 경우)
        if data.code and data.code != obj.code:
            stmt = select(Plans).where(
                and_(Plans.code == data.code, Plans.deleted == False)
            )
            result = await db.execute(stmt)
            if result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"코드 '{data.code}'는 이미 존재합니다",
                )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(obj, field, value)

        obj.updated_by = updated_by
        obj.updated_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(obj)

        return PlansResponse.model_validate(obj)

    @staticmethod
    async def delete(db: AsyncSession, obj_id: UUID, deleted_by: UUID | None = None) -> None:
        """요금제를 소프트 삭제합니다."""
        stmt = select(Plans).where(
            and_(Plans.id == obj_id, Plans.deleted == False)
        )
        result = await db.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="요금제를 찾을 수 없습니다",
            )

        obj.deleted = True
        obj.updated_by = deleted_by
        obj.updated_at = datetime.now(timezone.utc)

        await db.commit()
