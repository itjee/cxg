"""
Code Help Resolvers

코드헬프 검색 리소버
"""

from typing import Optional, Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from .types import CodeHelpResponse, CodeHelpType
from .constants import CODE_HELP_HANDLERS


class CodeHelpResolver:
    """코드 헬프 검색 리소버"""

    async def search(
        self,
        search_type: str,
        search_query: str = "",
        limit: int = 20,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
        db: Optional[AsyncSession] = None,
    ) -> CodeHelpResponse:
        """
        코드 헬프 검색 메인 메서드

        Args:
            search_type: 검색 유형 (customer, product, user, employee, common_code, parent_code)
            search_query: 검색 텍스트
            limit: 페이지 크기
            offset: 오프셋
            filters: 추가 필터 (JSON)
            db: 데이터베이스 세션

        Returns:
            CodeHelpResponse: 검색 결과

        Raises:
            ValueError: 지원하지 않는 검색 유형
            Exception: 데이터베이스 오류
        """
        # 검색 유형 검증
        if search_type not in CODE_HELP_HANDLERS:
            raise ValueError(
                f"지원하지 않는 검색 유형: {search_type}. "
                f"지원 유형: {', '.join(CODE_HELP_HANDLERS.keys())}"
            )

        # 페이지네이션 검증
        if limit < 1 or limit > 100:
            limit = 20
        if offset < 0:
            offset = 0

        # 해당 검색 유형의 핸들러 가져오기
        handler = CODE_HELP_HANDLERS[search_type]

        # 검색 실행
        total_count, items = await handler.execute(
            db=db,
            search_query=search_query,
            limit=limit,
            offset=offset,
            filters=filters or {},
        )

        # 응답 반환
        return CodeHelpResponse(
            total_count=total_count,
            items=items,
            has_more=(offset + limit) < total_count,
        )
