"""인증 모듈 스키마"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator


# 로그인 요청
class LoginRequest(BaseModel):
    """로그인 요청"""

    username: str = Field(..., min_length=3, max_length=50, description="사용자명")
    password: str = Field(..., min_length=8, description="비밀번호")

    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v: str) -> str:
        """비밀번호 바이트 길이 검증 (bcrypt 72바이트 제한)"""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('비밀번호는 72바이트를 초과할 수 없습니다')
        return v


# 토큰 응답
class TokenResponse(BaseModel):
    """토큰 응답"""

    access_token: str = Field(..., description="Access Token")
    refresh_token: str = Field(..., description="Refresh Token")
    token_type: str = Field(default="bearer", description="토큰 타입")
    expires_in: int = Field(..., description="만료 시간 (초)")


# 토큰 갱신 요청
class RefreshTokenRequest(BaseModel):
    """토큰 갱신 요청"""

    refresh_token: str = Field(..., description="Refresh Token")


# 회원가입 요청
class RegisterRequest(BaseModel):
    """회원가입 요청"""

    username: str = Field(..., min_length=3, max_length=50, description="사용자명")
    email: EmailStr = Field(..., description="이메일")
    password: str = Field(..., min_length=8, description="비밀번호")
    full_name: str | None = Field(None, min_length=2, max_length=100, description="전체 이름 (선택)")

    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v: str) -> str:
        """비밀번호 바이트 길이 검증 (bcrypt 72바이트 제한)"""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('비밀번호는 72바이트를 초과할 수 없습니다')
        return v


# 비밀번호 변경 요청
class ChangePasswordRequest(BaseModel):
    """비밀번호 변경 요청"""

    current_password: str = Field(..., max_length=72, description="현재 비밀번호")
    new_password: str = Field(..., min_length=8, max_length=72, description="새 비밀번호")


# 비밀번호 재설정 요청
class ResetPasswordRequest(BaseModel):
    """비밀번호 재설정 요청"""

    email: EmailStr = Field(..., description="이메일")


# 비밀번호 재설정 확인
class ResetPasswordConfirmRequest(BaseModel):
    """비밀번호 재설정 확인"""

    token: str | None = Field(None, description="재설정 토큰 (admin 테스트 시 불필요)")
    new_password: str = Field(..., min_length=8, max_length=72, description="새 비밀번호")
    username: str | None = Field(None, description="사용자명 (테스트용)")



# 사용자 정보 응답
class UserResponse(BaseModel):
    """사용자 정보 응답"""

    id: UUID
    username: str
    email: str
    full_name: str
    user_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# 현재 사용자 정보 (토큰에서 추출)
class CurrentUser(BaseModel):
    """현재 사용자 정보"""

    user_id: UUID
    username: str
    email: str
    roles: list[str] = []
    permissions: list[str] = []
