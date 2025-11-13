"""인증 및 보안 관련 유틸리티"""

from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings


# 비밀번호 해싱 컨텍스트
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__default_rounds=12)

# OAuth2 스킴
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/mgmt/auth/login")


def _truncate_password(password: str) -> bytes:
    """비밀번호를 bcrypt 제한(72바이트)에 맞게 자르기"""
    password_bytes = password.encode("utf-8")
    if len(password_bytes) > 72:
        return password_bytes[:72]
    return password_bytes


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """비밀번호 검증"""
    # bcrypt는 최대 72바이트만 사용
    password_bytes = _truncate_password(plain_password)
    return pwd_context.verify(password_bytes, hashed_password)


def get_password_hash(password: str) -> str:
    """비밀번호 해싱"""
    # bcrypt는 최대 72바이트만 사용
    password_bytes = _truncate_password(password)
    return pwd_context.hash(password_bytes)


# Alias for GraphQL compatibility
hash_password = get_password_hash


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """Access Token 생성"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)

    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    return encoded_jwt


def create_refresh_token(data: dict[str, Any]) -> str:
    """Refresh Token 생성"""
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict[str, Any]:
    """현재 사용자 정보 가져오기"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="인증 정보를 확인할 수 없습니다",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")

        if user_id is None or token_type != "access":
            raise credentials_exception

        return {"user_id": user_id, "payload": payload}

    except JWTError as e:
        raise credentials_exception from e


def require_permission(permission: str):
    """권한 체크 데코레이터"""

    async def permission_checker(current_user: dict = Depends(get_current_user)):
        # TODO: 권한 체크 로직 구현
        # 현재는 인증된 사용자만 체크
        return current_user

    return permission_checker


def decode_access_token(token: str) -> dict[str, Any]:
    """
    Access Token 디코드 (GraphQL용)

    Returns:
        dict: 토큰 페이로드

    Raises:
        Exception: 토큰이 유효하지 않은 경우
    """
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        token_type: str | None = payload.get("type")

        if token_type != "access":
            raise Exception("Invalid token type")

        return payload
    except JWTError as e:
        raise Exception(f"Invalid token: {str(e)}") from e


def generate_api_key(key_type: str = "usr") -> tuple[str, str]:
    """
    API 키 생성

    Args:
        key_type: 키 타입 (usr=사용자, svc=서비스 등)

    Returns:
        tuple: (full_api_key, secret_hash)
        - full_api_key: 클라이언트에게 제공할 전체 키 (cxg_<type>_<secret>)
        - secret_hash: DB에 저장할 해시값

    Example:
        >>> api_key, key_hash = generate_api_key("usr")
        >>> print(api_key)
        cxg_usr_XyZ789AbC123...
        >>> # key_hash는 DB의 key_hash 필드에 저장
    """
    import secrets

    # 안전한 랜덤 시크릿 생성 (32바이트 = 64자 hex)
    secret = secrets.token_urlsafe(32)

    # 전체 API 키 생성
    full_api_key = f"cxg_{key_type}_{secret}"

    # 시크릿 해시 (DB 저장용)
    secret_hash = get_password_hash(secret)

    return full_api_key, secret_hash


def generate_verification_code(length: int = 6) -> str:
    """
    검증 코드 생성 (이메일 인증, MFA 등)

    Args:
        length: 코드 길이 (기본값: 6)

    Returns:
        str: 숫자로 구성된 검증 코드

    Example:
        >>> code = generate_verification_code()
        >>> print(code)
        '384726'
        >>> code = generate_verification_code(8)
        >>> print(code)
        '91827364'
    """
    import secrets

    return "".join([str(secrets.randbelow(10)) for _ in range(length)])
