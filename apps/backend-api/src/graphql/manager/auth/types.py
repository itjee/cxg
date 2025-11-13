"""Manager Auth - GraphQL Types

Manager 시스템 인증 관련 GraphQL 타입 정의
사용자, 토큰, 인증 요청/응답 타입들을 정의합니다.
"""

from datetime import datetime

import strawberry

from src.graphql.common import Node


@strawberry.type(description="Manager 인증 사용자")
class ManagerAuthUser(Node):
    """
    Manager 시스템 인증 사용자

    로그인한 사용자의 기본 정보를 나타냅니다.
    민감한 정보(비밀번호 등)는 포함하지 않습니다.
    """

    id: strawberry.ID
    username: str = strawberry.field(description="사용자명 (로그인 ID)")
    email: str = strawberry.field(description="이메일 주소")
    full_name: str = strawberry.field(description="전체 이름 (표시명)")
    user_type: str = strawberry.field(description="사용자 타입 (MASTER, TENANT, SYSTEM)")
    status: str = strawberry.field(description="계정 상태 (ACTIVE, INACTIVE, LOCKED)")
    created_at: datetime = strawberry.field(description="계정 생성일시")


@strawberry.type(description="토큰 응답")
class TokenResponse:
    """
    JWT 토큰 응답

    로그인 성공 시 발급되는 Access Token과 Refresh Token을 포함합니다.
    """

    access_token: str = strawberry.field(description="Access Token (짧은 유효기간, API 호출용)")
    refresh_token: str = strawberry.field(description="Refresh Token (긴 유효기간, 토큰 갱신용)")
    token_type: str = strawberry.field(description="토큰 타입 (일반적으로 'bearer')")
    expires_in: int = strawberry.field(description="Access Token 만료 시간 (초 단위)")


@strawberry.type(description="메시지 응답")
class MessageResponse:
    """
    일반 메시지 응답

    성공/실패 메시지를 클라이언트에 전달할 때 사용합니다.
    """

    message: str = strawberry.field(description="응답 메시지")
    reset_token: str | None = strawberry.field(
        default=None, description="비밀번호 재설정 토큰 (개발 환경 전용)"
    )


@strawberry.input(description="로그인 입력")
class LoginInput:
    """
    로그인 입력 타입

    사용자명과 비밀번호로 인증합니다.
    """

    username: str = strawberry.field(description="사용자명")
    password: str = strawberry.field(description="비밀번호")


@strawberry.input(description="회원가입 입력")
class RegisterInput:
    """
    회원가입 입력 타입

    새로운 계정을 생성하기 위한 정보입니다.
    """

    username: str = strawberry.field(description="사용자명 (4-20자, 영문/숫자/언더스코어)")
    email: str = strawberry.field(description="이메일 주소 (이메일 형식)")
    password: str = strawberry.field(
        description="비밀번호 (8자 이상, 영문/숫자/특수문자 조합 권장)"
    )
    full_name: str | None = strawberry.field(
        default=None, description="전체 이름 (선택, 미입력시 사용자명 사용)"
    )


@strawberry.input(description="토큰 갱신 입력")
class RefreshTokenInput:
    """
    토큰 갱신 입력 타입

    Refresh Token으로 새로운 Access Token을 발급받습니다.
    """

    refresh_token: str = strawberry.field(description="Refresh Token")


@strawberry.input(description="비밀번호 변경 입력")
class ChangePasswordInput:
    """
    비밀번호 변경 입력 타입

    로그인한 상태에서 비밀번호를 변경합니다.
    현재 비밀번호를 확인하여 보안을 강화합니다.
    """

    current_password: str = strawberry.field(description="현재 비밀번호 (확인용)")
    new_password: str = strawberry.field(description="새 비밀번호 (8자 이상 권장)")


@strawberry.input(description="비밀번호 찾기 입력")
class ResetPasswordInput:
    """
    비밀번호 재설정 요청 입력 타입

    이메일로 비밀번호 재설정 링크를 받습니다.
    """

    email: str = strawberry.field(description="등록된 이메일 주소")


@strawberry.input(description="비밀번호 재설정 확인 입력")
class ResetPasswordConfirmInput:
    """
    비밀번호 재설정 확인 입력 타입

    이메일로 받은 토큰과 새 비밀번호로 재설정합니다.
    """

    token: str | None = strawberry.field(
        default=None, description="재설정 토큰 (이메일로 받은 토큰, admin 계정은 생략 가능)"
    )
    new_password: str = strawberry.field(description="새 비밀번호")
    username: str | None = strawberry.field(
        default=None, description="사용자명 (테스트 환경의 admin 계정 전용)"
    )
