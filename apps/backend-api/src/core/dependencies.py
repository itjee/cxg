"""Core dependencies for the application."""

from collections.abc import AsyncGenerator
from typing import Any
from uuid import UUID

from fastapi import Depends, Header, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db, get_tenant_db
from src.core.security import decode_access_token, get_current_user


# ==================== HTTP Header Dependencies ====================


async def get_tenant_key(
    x_tenant_key: str | None = Header(None, alias="X-Tenant-Key"),
) -> str | None:
    """
    테넌트 키 가져오기 (선택적)

    GraphQL은 JWT 토큰에서 tenant_key를 추출하므로,
    REST API 엔드포인트에서만 사용
    """
    return x_tenant_key


async def require_tenant_key(tenant_key: str | None = Depends(get_tenant_key)) -> str:
    """
    테넌트 키 필수 검증

    테넌트 컨텍스트가 필수인 API에서 사용
    """
    if not tenant_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="X-Tenant-Key 헤더가 필요합니다",
        )
    return tenant_key


async def get_api_key(x_api_key: str | None = Header(None, alias="X-API-Key")) -> str | None:
    """API 키 추출"""
    return x_api_key


async def verify_api_key(
    api_key: str | None = Depends(get_api_key),
    db: AsyncSession = Depends(get_manager_db),
    request: Request | None = None,
) -> dict[str, Any] | None:
    """
    API 키 검증 및 정보 반환

    Args:
        api_key: X-API-Key 헤더에서 추출한 API 키
        db: 데이터베이스 세션
        request: FastAPI Request 객체 (optional)

    Returns:
        API 키 정보 dict 또는 None (검증 실패 시)

    Raises:
        HTTPException: API 키가 유효하지 않거나 만료된 경우
    """
    if not api_key:
        return None

    try:
        from datetime import UTC, datetime

        from sqlalchemy import select

        from src.core.security import verify_password
        from src.models.manager.idam.api_key import ApiKey

        # API 키 형식: "cxg_<key_id>_<secret>"
        # 예: "cxg_usr_abc123_XyZ789..."
        if not api_key.startswith("cxg_"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key format",
            )

        parts = api_key.split("_", 2)
        if len(parts) != 3:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key format",
            )

        key_id = f"{parts[0]}_{parts[1]}"  # cxg_<type>
        secret = parts[2]

        # DB에서 API 키 조회
        stmt = select(ApiKey).where(
            ApiKey.key_id == key_id,
            ApiKey.status == "ACTIVE",
        )
        result = await db.execute(stmt)
        api_key_record = result.scalar_one_or_none()

        if not api_key_record:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="API key not found or inactive",
            )

        # 시크릿 검증 (해시 비교)
        if not verify_password(secret, api_key_record.key_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key",
            )

        # 만료 확인
        if api_key_record.expires_at and datetime.now(UTC) > api_key_record.expires_at.replace(tzinfo=UTC):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="API key has expired",
            )

        # IP 화이트리스트 확인
        if api_key_record.allowed_ips and request and request.client:
            client_ip = request.client.host
            if client_ip not in api_key_record.allowed_ips:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="IP address not allowed",
                )

        # Rate Limit 확인 (TODO: Redis 사용 권장)
        # 현재는 DB 사용량 카운트만 확인

        # 사용 통계 업데이트
        api_key_record.usage_count += 1
        api_key_record.last_used_at = datetime.now(UTC)
        if request and request.client:
            api_key_record.last_used_ip = request.client.host

        await db.commit()

        # API 키 정보 반환
        return {
            "api_key_id": str(api_key_record.id),
            "key_id": api_key_record.key_id,
            "user_id": str(api_key_record.user_id),
            "tenant_context": str(api_key_record.tenant_context)
            if api_key_record.tenant_context
            else None,
            "scopes": api_key_record.scopes or [],
            "service_account": api_key_record.service_account,
        }

    except HTTPException:
        raise
    except ImportError:
        # API Key model not available
        return None
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"API key verification failed: {str(e)}",
        ) from e


async def require_api_key(
    api_key_info: dict[str, Any] | None = Depends(verify_api_key),
) -> dict[str, Any]:
    """
    API 키 필수 검증

    API 키가 없거나 유효하지 않으면 401 에러 발생
    """
    if not api_key_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Valid API key required",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    return api_key_info


async def require_api_key_scope(required_scope: str):
    """
    API 키 스코프 검증

    Usage:
        @app.get("/admin", dependencies=[Depends(require_api_key_scope("admin:read"))])
    """

    async def scope_checker(api_key_info: dict = Depends(require_api_key)) -> dict:
        scopes = api_key_info.get("scopes", [])

        if required_scope not in scopes and "*" not in scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"API key does not have required scope: {required_scope}",
            )

        return api_key_info

    return scope_checker


# ==================== Authentication Dependencies ====================


async def get_current_user_optional(
    authorization: str | None = Header(None, alias="Authorization"),
) -> dict[str, Any] | None:
    """
    현재 사용자 정보 가져오기 (선택적)

    인증이 선택적인 엔드포인트에서 사용
    """
    if not authorization:
        return None

    try:
        token = authorization.split(" ")[1] if " " in authorization else authorization
        payload = decode_access_token(token)
        return {"user_id": payload.get("sub"), "payload": payload}
    except Exception:
        return None


async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """
    활성 사용자 검증

    TODO: 사용자 활성 상태 확인 (비활성화/차단 여부)
    """
    # TODO: Check user is_active status from database
    return current_user


# ==================== Database Session Dependencies ====================


async def get_db_by_tenant(
    tenant_key: str | None = Depends(get_tenant_key),
) -> AsyncGenerator[AsyncSession, None]:
    """
    테넌트 키에 따라 적절한 DB 세션 반환

    - tenant_key가 있으면: Tenant DB
    - tenant_key가 없으면: Manager DB
    """
    if tenant_key:
        async for session in get_tenant_db():
            yield session
    else:
        async for session in get_manager_db():
            yield session


# ==================== Audit Logging Dependencies ====================


async def log_audit(
    request: Request,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] | None = Depends(get_current_user_optional),
) -> None:
    """
    감사 로그 기록

    REST API 엔드포인트의 write 작업에 사용
    GraphQL은 resolver 레벨에서 별도 처리
    """
    # Skip if no user (public endpoints)
    if not current_user:
        return

    try:
        from src.models.manager.audt.audit_logs import AuditLogs

        user_id = UUID(current_user["user_id"])
        payload = current_user.get("payload", {})
        tenant_id = payload.get("tenant_id")

        # Create audit log entry
        audit_log = AuditLogs(
            user_id=user_id,
            tenant_id=UUID(tenant_id) if tenant_id else None,
            action=request.url.path,
            request_path=str(request.url.path),
            request_method=request.method,
            ip_address=request.client.host if request.client else "0.0.0.0",
            user_agent=request.headers.get("user-agent"),
            risk_level="LOW",
            status="ACTIVE",
        )

        db.add(audit_log)
        await db.commit()

    except ImportError:
        # Audit model not available, skip logging
        pass
    except Exception as e:
        # Don't break the request if audit logging fails
        await db.rollback()
        print(f"Audit logging failed: {e}")


# ==================== Permission Dependencies ====================


def require_role(*allowed_roles: str):
    """
    역할 기반 접근 제어

    Usage:
        @app.get("/admin", dependencies=[Depends(require_role("admin", "superadmin"))])
    """

    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("payload", {}).get("role", "")

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"이 작업을 수행할 권한이 없습니다. 필요한 역할: {', '.join(allowed_roles)}",
            )

        return current_user

    return role_checker


def require_permission(permission: str):
    """
    권한 기반 접근 제어

    Usage:
        @app.delete("/users/{id}", dependencies=[Depends(require_permission("users.delete"))])
    """

    async def permission_checker(
        current_user: dict = Depends(get_current_user),
        db: AsyncSession = Depends(get_manager_db),
    ) -> dict:
        # TODO: Check permission from database
        # 1. Get user's roles
        # 2. Get permissions for those roles
        # 3. Check if required permission exists

        # For now, just check if user is authenticated
        return current_user

    return permission_checker


# ==================== Tenant Context Dependencies ====================


async def get_tenant_context(
    current_user: dict = Depends(get_current_user),
    tenant_key: str = Depends(require_tenant_key),
) -> dict[str, Any]:
    """
    테넌트 컨텍스트 정보 반환

    사용자와 테넌트 정보를 결합하여 반환
    """
    user_tenant_key = current_user.get("payload", {}).get("tenant_key")

    # Verify user belongs to the tenant
    if user_tenant_key and user_tenant_key != tenant_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="다른 테넌트의 리소스에 접근할 수 없습니다",
        )

    return {
        "user_id": current_user["user_id"],
        "tenant_key": tenant_key,
        "payload": current_user.get("payload", {}),
    }
