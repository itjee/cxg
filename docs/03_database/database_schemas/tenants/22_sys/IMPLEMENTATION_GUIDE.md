# SYS Schema 개선 사항 - Python 구현 가이드

**작성일**: 2024-10-26
**버전**: 1.0
**상태**: 준비 완료 (배포 대기)

---

## 개요

이 문서는 새로 추가된 3개의 테이블에 대한 Python 백엔드 구현 가이드입니다.

### 추가된 테이블 및 모델

| 테이블 | Python 모델 | 파일 경로 | 목적 |
|-------|-----------|---------|------|
| `sys.sessions` | `Sessions` | `models/tenants/sys/sessions.py` | 사용자 세션 추적 |
| `sys.user_roles` | `UserRoles` | `models/tenants/sys/user_roles.py` | 사용자-역할 매핑 (임시 역할 지원) |
| `sys.role_permissions_history` | `RolePermissionsHistory` | `models/tenants/sys/role_permissions_history.py` | 권한 변경 이력 감시 |

---

## 1. Sessions 모델 사용 가이드

### 모델 정의

```python
from uuid import UUID
from datetime import datetime, timedelta, timezone
from models.tenants.sys import Sessions

# Sessions 모델의 주요 필드
# - id: UUID (PK)
# - tenant_id: UUID (FK → tenants)
# - user_id: UUID (FK → sys.users)
# - session_id: str (UNIQUE, 세션 토큰)
# - session_token_hash: str (토큰 해시값)
# - device_type: str (WEB, MOBILE, API, DESKTOP)
# - device_name: str
# - browser: str
# - user_agent: str
# - ip_address: str (INET type)
# - country_code: str (2-char, e.g., 'KR')
# - city: str
# - expires_at: datetime (세션 만료 시간)
# - last_activity_at: datetime (마지막 활동)
# - status: str (ACTIVE, EXPIRED, REVOKED)
# - revoked_at: datetime
# - revoke_reason: str
```

### 사용 예시

#### 1.1 로그인 시 세션 생성

```python
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
import secrets
from datetime import datetime, timedelta, timezone

async def create_session_on_login(
    db: AsyncSession,
    user_id: UUID,
    tenant_id: UUID,
    request: Request
) -> str:
    """로그인 후 새 세션 생성"""

    session_id = secrets.token_urlsafe(32)
    session_token_hash = hash_token(session_id)  # bcrypt 또는 similar

    # User-Agent 파싱
    user_agent = request.headers.get("User-Agent", "")
    device_info = parse_user_agent(user_agent)  # user_agents 라이브러리 사용

    # IP 지리 정보 조회
    ip_address = request.client.host if request.client else "127.0.0.1"
    geo_info = get_geolocation(ip_address)  # maxmind 또는 similar

    # 세션 만료 시간 (기본 24시간)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

    # 세션 생성
    session = Sessions(
        tenant_id=tenant_id,
        user_id=user_id,
        session_id=session_id,
        session_token_hash=session_token_hash,
        device_type=device_info.get("device_type", "WEB"),
        device_name=device_info.get("device_name", ""),
        browser=device_info.get("browser_name", ""),
        user_agent=user_agent,
        ip_address=ip_address,
        country_code=geo_info.get("country_code"),
        city=geo_info.get("city"),
        expires_at=expires_at,
        status="ACTIVE"
    )

    db.add(session)
    await db.commit()

    return session_id
```

#### 1.2 세션 검증

```python
from sqlalchemy import select

async def validate_session(
    db: AsyncSession,
    session_id: str,
    tenant_id: UUID
) -> tuple[UUID, UUID] | None:
    """세션 유효성 검증 및 마지막 활동 시간 업데이트"""

    now = datetime.now(timezone.utc)

    stmt = select(Sessions).where(
        Sessions.session_id == session_id,
        Sessions.tenant_id == tenant_id,
        Sessions.status == "ACTIVE",
        Sessions.expires_at > now
    )

    session = await db.scalar(stmt)

    if not session:
        return None

    # 마지막 활동 시간 업데이트
    session.last_activity_at = now
    await db.commit()

    return session.user_id, session.tenant_id
```

#### 1.3 로그아웃 시 세션 종료

```python
async def revoke_session(
    db: AsyncSession,
    session_id: str,
    reason: str = None
) -> bool:
    """사용자 로그아웃 - 세션 종료"""

    stmt = select(Sessions).where(
        Sessions.session_id == session_id,
        Sessions.status == "ACTIVE"
    )

    session = await db.scalar(stmt)

    if not session:
        return False

    session.status = "REVOKED"
    session.revoked_at = datetime.now(timezone.utc)
    session.revoke_reason = reason or "User logout"

    await db.commit()
    return True
```

#### 1.4 만료된 세션 정리

```python
async def cleanup_expired_sessions(db: AsyncSession) -> int:
    """만료된 세션을 EXPIRED 상태로 변경"""

    from sqlalchemy import update

    now = datetime.now(timezone.utc)

    stmt = (
        update(Sessions)
        .where(
            Sessions.status == "ACTIVE",
            Sessions.expires_at <= now
        )
        .values(status="EXPIRED")
    )

    result = await db.execute(stmt)
    await db.commit()

    return result.rowcount
```

---

## 2. UserRoles 모델 사용 가이드

### 모델 정의

```python
from models.tenants.sys import UserRoles

# UserRoles 모델의 주요 필드
# - id: UUID (PK)
# - tenant_id: UUID (FK → tenants)
# - user_id: UUID (FK → sys.users)
# - role_id: UUID (FK → sys.roles)
# - granted_at: datetime (역할 할당 시간)
# - granted_by: UUID (할당자)
# - expires_at: datetime | None (임시 역할 만료 시간, NULL: 무기한)
# - revoked_at: datetime | None (역할 해제 시간)
# - revoked_by: UUID | None (해제자)
# - revoke_reason: str | None (해제 사유)
# - is_active: bool (활성 여부)
```

### 사용 예시

#### 2.1 역할 할당

```python
async def assign_role(
    db: AsyncSession,
    user_id: UUID,
    role_id: UUID,
    tenant_id: UUID,
    granted_by: UUID,
    expires_at: datetime = None
) -> UserRoles:
    """사용자에게 역할 할당"""

    user_role = UserRoles(
        tenant_id=tenant_id,
        user_id=user_id,
        role_id=role_id,
        granted_by=granted_by,
        expires_at=expires_at,
        is_active=True
    )

    db.add(user_role)
    await db.commit()
    await db.refresh(user_role)

    return user_role
```

#### 2.2 임시 역할 할당 (3개월)

```python
from datetime import timedelta

async def assign_temporary_role(
    db: AsyncSession,
    user_id: UUID,
    role_id: UUID,
    tenant_id: UUID,
    granted_by: UUID,
    days: int = 90
) -> UserRoles:
    """일시적 역할 할당 (지정된 기간 후 자동 만료)"""

    expires_at = datetime.now(timezone.utc) + timedelta(days=days)

    return await assign_role(
        db, user_id, role_id, tenant_id, granted_by, expires_at
    )
```

#### 2.3 역할 해제

```python
async def revoke_role(
    db: AsyncSession,
    user_id: UUID,
    role_id: UUID,
    tenant_id: UUID,
    revoked_by: UUID,
    reason: str = None
) -> bool:
    """사용자 역할 해제"""

    stmt = select(UserRoles).where(
        UserRoles.user_id == user_id,
        UserRoles.role_id == role_id,
        UserRoles.tenant_id == tenant_id,
        UserRoles.is_active == True
    )

    user_role = await db.scalar(stmt)

    if not user_role:
        return False

    user_role.is_active = False
    user_role.revoked_at = datetime.now(timezone.utc)
    user_role.revoked_by = revoked_by
    user_role.revoke_reason = reason

    await db.commit()
    return True
```

#### 2.4 사용자의 활성 역할 조회

```python
async def get_user_active_roles(
    db: AsyncSession,
    user_id: UUID,
    tenant_id: UUID
) -> list[UserRoles]:
    """사용자의 현재 활성 역할 조회"""

    now = datetime.now(timezone.utc)

    stmt = select(UserRoles).where(
        UserRoles.user_id == user_id,
        UserRoles.tenant_id == tenant_id,
        UserRoles.is_active == True,
        (UserRoles.expires_at.is_(None) | (UserRoles.expires_at > now))
    )

    return await db.scalars(stmt)
```

#### 2.5 만료된 역할 자동 비활성화

```python
async def deactivate_expired_roles(db: AsyncSession) -> int:
    """만료된 역할을 비활성 상태로 변경"""

    from sqlalchemy import update

    now = datetime.now(timezone.utc)

    stmt = (
        update(UserRoles)
        .where(
            UserRoles.is_active == True,
            UserRoles.expires_at <= now
        )
        .values(is_active=False)
    )

    result = await db.execute(stmt)
    await db.commit()

    return result.rowcount
```

---

## 3. RolePermissionsHistory 모델 사용 가이드

### 모델 정의

```python
from models.tenants.sys import RolePermissionsHistory

# RolePermissionsHistory 모델의 주요 필드
# - id: UUID (PK)
# - tenant_id: UUID (FK → tenants)
# - role_id: UUID (FK → sys.roles)
# - permission_id: UUID (FK → sys.permissions)
# - action: str (GRANTED, REVOKED)
# - changed_at: datetime (변경 시간)
# - changed_by: UUID | None (변경자)
# - reason: str | None (변경 사유)
```

### 사용 예시

#### 3.1 권한 변경 이력 조회 (자동 기록)

권한 변경 이력은 **자동으로 기록**됩니다. PostgreSQL 트리거가 `sys.role_permissions` 테이블의 INSERT/DELETE를 감지하여 자동으로 이력을 기록합니다.

```python
# sys.role_permissions에 권한 추가 시 자동으로 이력 기록됨
role_permission = RolePermissions(
    tenant_id=tenant_id,
    role_id=role_id,
    permission_id=permission_id
)
db.add(role_permission)
await db.commit()
# → RolePermissionsHistory에 자동으로 GRANTED 레코드 생성
```

#### 3.2 역할의 권한 변경 이력 조회

```python
async def get_role_permission_history(
    db: AsyncSession,
    role_id: UUID,
    tenant_id: UUID,
    days: int = 30
) -> list[RolePermissionsHistory]:
    """역할의 최근 권한 변경 이력 조회"""

    cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)

    stmt = select(RolePermissionsHistory).where(
        RolePermissionsHistory.role_id == role_id,
        RolePermissionsHistory.tenant_id == tenant_id,
        RolePermissionsHistory.changed_at >= cutoff_date
    ).order_by(RolePermissionsHistory.changed_at.desc())

    return await db.scalars(stmt)
```

#### 3.3 특정 권한의 변경 이력 조회

```python
async def get_permission_history(
    db: AsyncSession,
    permission_id: UUID,
    tenant_id: UUID
) -> list[RolePermissionsHistory]:
    """특정 권한이 어떤 역할에서 부여/제거되었는지 추적"""

    stmt = select(RolePermissionsHistory).where(
        RolePermissionsHistory.permission_id == permission_id,
        RolePermissionsHistory.tenant_id == tenant_id
    ).order_by(RolePermissionsHistory.changed_at.desc())

    return await db.scalars(stmt)
```

#### 3.4 감사(Audit) 리포트 생성

```python
async def generate_audit_report(
    db: AsyncSession,
    tenant_id: UUID,
    start_date: datetime,
    end_date: datetime
) -> dict:
    """권한 변경 감시 리포트"""

    stmt = select(RolePermissionsHistory).where(
        RolePermissionsHistory.tenant_id == tenant_id,
        RolePermissionsHistory.changed_at.between(start_date, end_date)
    )

    history_records = await db.scalars(stmt)

    # 통계 계산
    granted_count = sum(1 for r in history_records if r.action == "GRANTED")
    revoked_count = sum(1 for r in history_records if r.action == "REVOKED")

    # 변경자별 통계
    changes_by_user = {}
    for record in history_records:
        user_id = record.changed_by
        if user_id not in changes_by_user:
            changes_by_user[user_id] = {"granted": 0, "revoked": 0}

        if record.action == "GRANTED":
            changes_by_user[user_id]["granted"] += 1
        else:
            changes_by_user[user_id]["revoked"] += 1

    return {
        "period": {
            "start": start_date,
            "end": end_date
        },
        "summary": {
            "total_changes": len(history_records),
            "granted_count": granted_count,
            "revoked_count": revoked_count
        },
        "changes_by_user": changes_by_user,
        "details": [
            {
                "role_id": r.role_id,
                "permission_id": r.permission_id,
                "action": r.action,
                "changed_at": r.changed_at,
                "changed_by": r.changed_by,
                "reason": r.reason
            }
            for r in history_records
        ]
    }
```

---

## 4. 마이그레이션 가이드

### 4.1 기존 sys.users.role_id 데이터 마이그레이션

`sys.user_roles` 테이블 생성 후, 기존 데이터를 마이그레이션하려면:

```bash
# 1. 마이그레이션 스크립트 실행
cd /home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/
psql -U postgres -d tenants_db -f 16_user_roles_migration.sql

# 2. 마이그레이션 검증 (SQL 실행 결과 확인)
# - migrated_count 확인
# - 데이터 비교 결과 확인
# - 고아 레코드 확인

# 3. sys.users.role_id 처리 (선택사항)
# - 옵션 A: 컬럼 삭제 (권장하지 않음 - 기존 API 호환성 문제)
# - 옵션 B: deprecated 마크 (권장 - 단계적 마이그레이션)
```

### 4.2 백엔드 코드 마이그레이션

기존 코드에서 `sys.users.role_id`를 사용하는 부분을 업데이트:

```python
# 변경 전
def get_user_role(db: AsyncSession, user_id: UUID) -> UUID | None:
    stmt = select(Users.role_id).where(Users.id == user_id)
    return await db.scalar(stmt)

# 변경 후
async def get_user_role(db: AsyncSession, user_id: UUID, tenant_id: UUID) -> UUID | None:
    """사용자의 활성 역할 ID 조회"""
    now = datetime.now(timezone.utc)

    stmt = select(UserRoles.role_id).where(
        UserRoles.user_id == user_id,
        UserRoles.tenant_id == tenant_id,
        UserRoles.is_active == True,
        (UserRoles.expires_at.is_(None) | (UserRoles.expires_at > now))
    )

    return await db.scalar(stmt)
```

---

## 5. 데이터베이스 초기화

### 5.1 새 테이블 생성 및 트리거 설정

```bash
# 통합 초기화 스크립트 실행
cd /home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/
psql -U postgres -d tenants_db -f 00_init_sys_improvements.sql
```

이 스크립트는 다음을 자동으로 수행합니다:
1. `sys.sessions` 테이블 생성 (8개 인덱스 포함)
2. `sys.user_roles` 테이블 생성 (6개 인덱스 포함)
3. `sys.role_permissions_history` 테이블 생성 (5개 인덱스 포함)
4. 트리거 `trigger_record_role_permissions_change` 생성

### 5.2 개별 스크립트 실행

필요시 개별 테이블만 생성 가능:

```bash
# 세션 테이블만
psql -U postgres -d tenants_db -f 13_sessions.sql

# 사용자-역할 테이블만
psql -U postgres -d tenants_db -f 14_user_roles.sql

# 권한 변경 이력 테이블만
psql -U postgres -d tenants_db -f 15_role_permissions_history.sql
```

---

## 6. 체크리스트

배포 전 다음을 확인하세요:

- [ ] 모든 SQL 스크립트 실행 완료
- [ ] 테이블 3개 생성 확인
- [ ] 인덱스 19개 생성 확인
- [ ] 트리거 생성 확인
- [ ] Python 모델 파일 3개 생성 확인
- [ ] `__init__.py` 업데이트 확인
- [ ] 기존 데이터 마이그레이션 완료 (sys.user_roles)
- [ ] 마이그레이션 검증 쿼리 실행
- [ ] 백엔드 코드 테스트
- [ ] 통합 테스트 완료

---

## 7. 다음 단계

1. **API 엔드포인트 구현**
   - POST /api/tenants/{tenant_id}/auth/login (세션 생성)
   - POST /api/tenants/{tenant_id}/auth/logout (세션 종료)
   - GET /api/tenants/{tenant_id}/auth/validate (세션 검증)
   - POST /api/tenants/{tenant_id}/users/{user_id}/roles (역할 할당)
   - DELETE /api/tenants/{tenant_id}/users/{user_id}/roles (역할 해제)
   - GET /api/tenants/{tenant_id}/audit/permissions-history (감사 이력)

2. **미들웨어 구현**
   - 세션 검증 미들웨어
   - 역할 기반 접근 제어 (RBAC) 미들웨어

3. **백그라운드 작업**
   - 만료된 세션 정리 (매일 1회)
   - 만료된 역할 비활성화 (매일 1회)

4. **모니터링**
   - 세션 활성 상태 모니터링
   - 권한 변경 이력 리포트
   - 비정상 로그인 감지

---

**문의**: 데이터베이스 설계팀
**최종 업데이트**: 2024-10-26
