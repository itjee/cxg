"""GraphQL 공통 Base Types

재사용 가능한 기본 GraphQL 타입들을 정의합니다.
페이지네이션, 성공/에러 응답 등 공통적으로 사용되는 타입들을 제공합니다.
"""

import strawberry


@strawberry.type(description="페이지네이션 정보 (Relay 스펙)")
class PageInfo:
    """
    페이지네이션 메타 정보

    Relay Cursor Connections 스펙을 따르는 페이지네이션 정보입니다.
    목록 조회 시 페이징 상태를 클라이언트에 전달할 때 사용합니다.

    사용 예:
        @strawberry.type
        class UserConnection:
            edges: list[UserEdge]
            page_info: PageInfo
    """

    has_next_page: bool = strawberry.field(
        description="다음 페이지 존재 여부 (True: 다음 페이지 있음)"
    )
    has_previous_page: bool = strawberry.field(
        description="이전 페이지 존재 여부 (True: 이전 페이지 있음)"
    )
    start_cursor: str | None = strawberry.field(
        default=None, description="첫 번째 아이템의 커서 (페이징 재개 시 사용)"
    )
    end_cursor: str | None = strawberry.field(
        default=None, description="마지막 아이템의 커서 (다음 페이지 요청 시 사용)"
    )
    total_count: int = strawberry.field(description="전체 아이템 수 (필터 적용 후)")


@strawberry.type(description="성공 응답")
class SuccessResponse:
    """
    성공 응답 타입

    단순 성공/실패 결과와 메시지를 반환할 때 사용합니다.
    Mutation의 반환 타입으로 많이 사용됩니다.

    사용 예:
        @strawberry.mutation
        async def delete_user(self, id: ID) -> SuccessResponse:
            # ... 삭제 로직 ...
            return SuccessResponse(
                success=True,
                message="사용자가 삭제되었습니다."
            )
    """

    success: bool = strawberry.field(description="성공 여부 (True: 성공, False: 실패)")
    message: str | None = strawberry.field(default=None, description="결과 메시지 (선택)")


@strawberry.type(description="에러 응답")
class ErrorResponse:
    """
    에러 응답 타입

    구조화된 에러 정보를 클라이언트에 전달할 때 사용합니다.
    필드 레벨 에러를 표현할 수 있어 폼 유효성 검증 등에 유용합니다.

    사용 예:
        errors = [
            ErrorResponse(
                code="INVALID_EMAIL",
                message="이메일 형식이 올바르지 않습니다.",
                field="email"
            ),
            ErrorResponse(
                code="PASSWORD_TOO_SHORT",
                message="비밀번호는 8자 이상이어야 합니다.",
                field="password"
            )
        ]
    """

    code: str = strawberry.field(description="에러 코드 (예: INVALID_EMAIL, NOT_FOUND)")
    message: str = strawberry.field(description="사용자에게 표시할 에러 메시지")
    field: str | None = strawberry.field(
        default=None, description="에러가 발생한 필드명 (필드 레벨 에러인 경우)"
    )
