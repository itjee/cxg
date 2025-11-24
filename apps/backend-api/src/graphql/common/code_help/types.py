"""
Code Help GraphQL Types

공통 코드헬프 기능의 GraphQL 타입 정의
"""

import strawberry
from typing import List, Optional
from datetime import datetime

from src.graphql.common.scalars import JSONScalar


@strawberry.type(name="CodeHelpResult", description="코드 헬프 검색 결과")
class CodeHelpResult:
    """단일 코드 헬프 검색 결과"""

    id: strawberry.ID                          # 코드 ID (거래처ID, 제품ID 등)
    code: str                                  # 코드 (거래처코드, 제품코드 등)
    name: str                                  # 이름 (거래처명, 제품명 등)
    description: Optional[str] = None          # 추가 설명
    metadata: Optional[JSONScalar] = None      # 추가 메타데이터 (JSON)
    status: str = "ACTIVE"                     # 상태 (ACTIVE, INACTIVE, DELETED)
    created_at: Optional[datetime] = None      # 생성일시
    updated_at: Optional[datetime] = None      # 수정일시


@strawberry.type(name="CodeHelpResponse", description="코드 헬프 검색 응답")
class CodeHelpResponse:
    """코드 헬프 검색 응답"""

    total_count: int                           # 전체 개수
    items: List[CodeHelpResult]                # 검색 결과 목록
    has_more: bool                             # 다음 페이지 여부


@strawberry.enum(description="코드 헬프 검색 유형")
class CodeHelpType:
    """검색 유형"""

    CUSTOMER = "customer"                      # 거래처
    PRODUCT = "product"                        # 제품
    USER = "user"                              # 사용자
    EMPLOYEE = "employee"                      # 사원
    COMMON_CODE = "common_code"                # 공통코드
    PARENT_CODE = "parent_code"                # 상위 코드 (부모 코드)
