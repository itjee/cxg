"""
Code Help GraphQL Queries

코드헬프 검색 GraphQL 쿼리 정의
"""

import strawberry
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from .types import CodeHelpResponse, CodeHelpType
from .resolvers import CodeHelpResolver


@strawberry.type(name="Query")
class CodeHelpQueries:
    """공통 코드 헬프 쿼리"""

    @strawberry.field(description="코드 헬프 검색")
    async def code_help(
        self,
        search_type: CodeHelpType,
        search_query: str = "",
        limit: int = 20,
        offset: int = 0,
        filters: Optional[strawberry.JSON] = None,
        info: Optional[strawberry.types.Info] = None,
    ) -> CodeHelpResponse:
        """
        코드 헬프 검색

        Args:
            search_type: 검색 유형
                - CUSTOMER: 거래처
                - PRODUCT: 제품
                - USER: 사용자
                - EMPLOYEE: 사원
                - COMMON_CODE: 공통코드
                - PARENT_CODE: 상위코드
            search_query: 검색 텍스트 (코드 또는 이름)
            limit: 페이지 크기 (기본값: 20, 최대: 100)
            offset: 오프셋 (기본값: 0)
            filters: 추가 필터 옵션 (JSON)
                - CUSTOMER: { status: "ACTIVE", category: "VIP" }
                - EMPLOYEE: { department: "IT", status: "ACTIVE" }
                - COMMON_CODE: { parent_code: "DEPT_TYPE" }
                - USER: { status: "ACTIVE", user_type: "MASTER" }

        Returns:
            CodeHelpResponse: 검색 결과

        Raises:
            ValueError: 잘못된 search_type 또는 filters
        """
        # 데이터베이스 세션 가져오기 (context에서)
        db = info.context.get("db") if info and hasattr(info, "context") else None

        if not db:
            raise ValueError("데이터베이스 세션을 가져올 수 없습니다")

        # 리소버 실행
        resolver = CodeHelpResolver()
        return await resolver.search(
            search_type=search_type.value,
            search_query=search_query,
            limit=limit,
            offset=offset,
            filters=filters,
            db=db,
        )
