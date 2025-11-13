# Tenants DB - SYS Schema 개선안 (세부 SQL)

**목표**: 현재 sys 스키마에 부족한 기능 추가
**작성일**: 2024-10-26
**상태**: 제안 단계 (검토 대기)

---

## 개선 항목 요약

| 항목 | 현황 | 개선안 | 우선순위 |
|------|------|--------|---------|
| 세션 관리 | ❌ 없음 | sys.sessions 추가 | P0 |
| 사용자-역할 매핑 | ⚠️ users.role_id만 있음 | sys.user_roles 테이블 추가 | P1 |
| 권한 변경 이력 | ❌ 없음 | sys.role_permissions_history 추가 | P1 |
| 로그인 이력 | ❌ 없음 | sys.login_logs 확장 | P1 |
| 임시 권한 | ❌ 불가능 | sys.user_roles.expires_at 추가 | P1 |

---

## 1. sys.sessions 추가 (P0 - 긴급)

### 목적
- 테넌트 사용자 로그인 세션 추적
- 동시 세션 제한
- 보안 모니터링 (IP, 위치 등)
- Manager DB의 idam.sessions과 동일한 기능 제공

### SQL 스키마

```sql
-- =====================================================================================
-- 테넌트 사용자 세션 관리
-- =====================================================================================
CREATE TABLE IF NOT EXISTS sys.sessions (
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- 테넌트 및 사용자 정보
    tenant_id                   UUID                     NOT NULL,  -- 테넌트 격리
    user_id                     UUID                     NOT NULL,  -- 사용자

    -- 세션 정보
    session_id                  VARCHAR(255)             NOT NULL,  -- 세션 고유 식별자
    session_token_hash          VARCHAR(255),                        -- 토큰 해시 (보안)

    -- 디바이스/클라이언트 정보
    device_type                 VARCHAR(50),                         -- WEB, MOBILE, API, DESKTOP
    device_name                 VARCHAR(255),                        -- 예: "iPhone 13", "Windows 10"
    browser                     VARCHAR(100),                        -- 예: "Chrome", "Safari"
    user_agent                  TEXT,                               -- 전체 User-Agent 헤더

    -- 네트워크 정보
    ip_address                  INET                     NOT NULL,  -- IPv4 또는 IPv6
    country_code                CHAR(2),                             -- 국가 코드 (예: KR)
    city                        VARCHAR(100),                        -- 도시명

    -- 세션 라이프사이클
    expires_at                  TIMESTAMP WITH TIME ZONE NOT NULL,  -- 세션 만료 시각
    last_activity_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 마지막 활동

    -- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, EXPIRED, REVOKED
    revoked_at                  TIMESTAMP WITH TIME ZONE,                          -- 수동 로그아웃 시각
    revoke_reason               VARCHAR(255),                        -- 로그아웃 사유

    -- 제약조건
    CONSTRAINT fk_sessions__tenant_id    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_sessions__user_id      FOREIGN KEY (user_id) REFERENCES sys.users(id) ON DELETE CASCADE,
    CONSTRAINT uk_sessions__session_id   UNIQUE (session_id),
    CONSTRAINT ck_sessions__status       CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED')),
    CONSTRAINT ck_sessions__device_type  CHECK (device_type IN ('WEB', 'MOBILE', 'API', 'DESKTOP')),
    CONSTRAINT ck_sessions__expires      CHECK (expires_at > created_at)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.sessions                         IS '테넌트 사용자 세션 관리 - 로그인 상태 추적 및 보안 모니터링';
COMMENT ON COLUMN sys.sessions.id                      IS '세션 고유 식별자';
COMMENT ON COLUMN sys.sessions.tenant_id               IS '테넌트 ID (격리)';
COMMENT ON COLUMN sys.sessions.user_id                 IS '사용자 ID';
COMMENT ON COLUMN sys.sessions.session_id              IS '세션 고유 식별자 (토큰 형태)';
COMMENT ON COLUMN sys.sessions.session_token_hash      IS '보안상 토큰의 해시값 저장';
COMMENT ON COLUMN sys.sessions.device_type             IS '디바이스 타입 (WEB, MOBILE, API, DESKTOP)';
COMMENT ON COLUMN sys.sessions.device_name             IS '디바이스 이름 (사용자 식별용)';
COMMENT ON COLUMN sys.sessions.browser                 IS '브라우저 이름';
COMMENT ON COLUMN sys.sessions.ip_address              IS '클라이언트 IP 주소';
COMMENT ON COLUMN sys.sessions.country_code            IS '지리적 위치 - 국가 코드';
COMMENT ON COLUMN sys.sessions.city                    IS '지리적 위치 - 도시명';
COMMENT ON COLUMN sys.sessions.expires_at              IS '세션 만료 시각 (보통 로그인 후 24시간)';
COMMENT ON COLUMN sys.sessions.last_activity_at        IS '마지막 API 호출 시각 (타임아웃 추적)';
COMMENT ON COLUMN sys.sessions.status                  IS '세션 상태 (ACTIVE: 활성, EXPIRED: 만료됨, REVOKED: 수동 종료)';
COMMENT ON COLUMN sys.sessions.revoked_at              IS '사용자 수동 로그아웃 시각';

-- 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS ux_sessions__session_id
    ON sys.sessions (session_id)
 WHERE status IN ('ACTIVE', 'REVOKED');

CREATE INDEX IF NOT EXISTS ix_sessions__user_id
    ON sys.sessions (user_id, created_at DESC)
 WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_sessions__tenant_user
    ON sys.sessions (tenant_id, user_id)
 WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_sessions__expires_at
    ON sys.sessions (expires_at)
 WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_sessions__last_activity_at
    ON sys.sessions (last_activity_at DESC)
 WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_sessions__ip_address
    ON sys.sessions (ip_address)
 WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_sessions__status
    ON sys.sessions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS ix_sessions__country_code
    ON sys.sessions (country_code)
 WHERE status = 'ACTIVE';
```

### 사용 예시

```python
# 로그인 시 세션 생성
async def create_session(user_id: UUID, tenant_id: UUID, request: Request) -> str:
    """로그인 후 세션 생성"""

    import secrets
    from datetime import timedelta

    session_id = secrets.token_urlsafe(32)
    session_token_hash = hash_token(session_id)

    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

    await sys.sessions.create(
        tenant_id=tenant_id,
        user_id=user_id,
        session_id=session_id,
        session_token_hash=session_token_hash,
        device_type=detect_device_type(request),
        device_name=detect_device_name(request),
        browser=parse_user_agent(request.headers['User-Agent']),
        user_agent=request.headers['User-Agent'],
        ip_address=request.client.host,
        country_code=get_country_from_ip(request.client.host),
        expires_at=expires_at,
        status='ACTIVE'
    )

    return session_id

# 로그아웃 시 세션 종료
async def revoke_session(session_id: str, reason: str = None):
    """로그아웃 - 세션 종료"""

    await sys.sessions.update(
        {'session_id': session_id},
        {
            'status': 'REVOKED',
            'revoked_at': datetime.now(timezone.utc),
            'revoke_reason': reason
        }
    )

# 세션 검증
async def validate_session(session_id: str) -> (UUID, UUID):
    """세션 유효성 검증 (활성 세션인지 확인)"""

    session = await sys.sessions.get_one({
        'session_id': session_id,
        'status': 'ACTIVE',
        'expires_at': {'>': datetime.now(timezone.utc)}
    })

    if not session:
        raise UnauthorizedError("Invalid or expired session")

    # 마지막 활동 시간 업데이트
    await sys.sessions.update(
        {'id': session.id},
        {'last_activity_at': datetime.now(timezone.utc)}
    )

    return session.user_id, session.tenant_id

# 동시 세션 제한 (선택사항)
async def enforce_single_session(user_id: UUID, tenant_id: UUID, current_session_id: str):
    """사용자당 단 1개 세션만 활성화 (이전 세션 종료)"""

    previous_sessions = await sys.sessions.find({
        'user_id': user_id,
        'tenant_id': tenant_id,
        'status': 'ACTIVE',
        'session_id': {'!=': current_session_id}
    })

    for session in previous_sessions:
        await revoke_session(session.session_id, "New login detected")
```

---

## 2. sys.user_roles 추가 (P1 - 높음)

### 목적
- 사용자-역할 매핑의 이력 추적
- Manager DB의 idam.user_roles과 동일한 구조
- 역할 할당 시간, 할당자, 만료일 기록
- 향후 다중 역할 지원 가능성

### 현재 상태 vs 개선안

```
현재:
sys.users.role_id → FK (단수 역할만 가능)

개선:
sys.users (role_id 제거 또는 deprecated)
    ↓
sys.user_roles (신규)
    ├─ user_id
    ├─ role_id
    ├─ expires_at (임시 역할)
    ├─ granted_at, granted_by (할당 이력)
    └─ revoked_at, revoked_by (해제 이력)
```

### SQL 스키마

```sql
-- =====================================================================================
-- 테넌트 사용자-역할 매핑 (감시 포함)
-- =====================================================================================
CREATE TABLE IF NOT EXISTS sys.user_roles (
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- 테넌트, 사용자, 역할
    tenant_id                   UUID                     NOT NULL,  -- 테넌트 격리
    user_id                     UUID                     NOT NULL,  -- FK: sys.users
    role_id                     UUID                     NOT NULL,  -- FK: sys.roles

    -- 역할 할당 정보
    granted_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 할당 시각
    granted_by                  UUID,                               -- 누가 할당했나

    -- 역할 만료 (임시 역할 지원)
    expires_at                  TIMESTAMP WITH TIME ZONE,           -- NULL: 무기한, 값: 임시 역할

    -- 역할 해제 정보
    revoked_at                  TIMESTAMP WITH TIME ZONE,           -- 역할 해제 시각
    revoked_by                  UUID,                               -- 누가 해제했나
    revoke_reason               TEXT,                               -- 해제 사유

    -- 상태
    is_active                   BOOLEAN                  NOT NULL DEFAULT TRUE,  -- 활성 여부

    -- 제약조건
    CONSTRAINT fk_user_roles__tenant_id  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles__user_id    FOREIGN KEY (user_id) REFERENCES sys.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles__role_id    FOREIGN KEY (role_id) REFERENCES sys.roles(id) ON DELETE CASCADE,

    -- 유니크 제약 (사용자당 역할은 1개, 만료된 것 제외)
    CONSTRAINT uk_user_roles__tenant_user_role
        UNIQUE (tenant_id, user_id, role_id)
        WHERE is_active = TRUE,

    -- 체크 제약
    CONSTRAINT ck_user_roles__expires   CHECK (expires_at IS NULL OR expires_at > granted_at),
    CONSTRAINT ck_user_roles__revoke    CHECK (revoked_at IS NULL OR revoked_at >= granted_at)
);

-- 주석
COMMENT ON TABLE  sys.user_roles                       IS '테넌트 사용자-역할 매핑 (할당 이력 포함)';
COMMENT ON COLUMN sys.user_roles.tenant_id             IS '테넌트 ID (격리)';
COMMENT ON COLUMN sys.user_roles.user_id               IS '사용자 ID';
COMMENT ON COLUMN sys.user_roles.role_id               IS '역할 ID';
COMMENT ON COLUMN sys.user_roles.granted_at            IS '역할 할당 시각';
COMMENT ON COLUMN sys.user_roles.granted_by            IS '역할을 할당한 사용자 ID';
COMMENT ON COLUMN sys.user_roles.expires_at            IS '역할 만료 시각 (NULL: 무기한, 값: 임시 역할)';
COMMENT ON COLUMN sys.user_roles.revoked_at            IS '역할 해제 시각';
COMMENT ON COLUMN sys.user_roles.revoked_by            IS '역할을 해제한 사용자 ID';
COMMENT ON COLUMN sys.user_roles.revoke_reason         IS '역할 해제 사유 (예: 휴가 종료)';
COMMENT ON COLUMN sys.user_roles.is_active             IS '활성 여부 (TRUE: 활성, FALSE: 비활성/해제됨)';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_user_roles__user_id
    ON sys.user_roles (user_id)
 WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS ix_user_roles__role_id
    ON sys.user_roles (role_id)
 WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS ix_user_roles__tenant_user
    ON sys.user_roles (tenant_id, user_id)
 WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS ix_user_roles__expires_at
    ON sys.user_roles (expires_at)
 WHERE expires_at IS NOT NULL AND is_active = TRUE;

CREATE INDEX IF NOT EXISTS ix_user_roles__granted_by
    ON sys.user_roles (granted_by)
 WHERE granted_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_user_roles__revoked_by
    ON sys.user_roles (revoked_by)
 WHERE revoked_by IS NOT NULL;
```

### 마이그레이션 (sys.users.role_id → sys.user_roles)

```sql
-- 1단계: 기존 데이터 마이그레이션
INSERT INTO sys.user_roles (
    tenant_id, user_id, role_id,
    granted_at, is_active
)
SELECT
    tenant_id, id, role_id,
    created_at, TRUE
FROM sys.users
WHERE role_id IS NOT NULL;

-- 2단계: sys.users.role_id 제거 (또는 deprecated 컬럼으로 유지)
-- 옵션 A: 컬럼 삭제
ALTER TABLE sys.users DROP COLUMN role_id;

-- 옵션 B: deprecated 마크 (호환성 유지)
ALTER TABLE sys.users
RENAME COLUMN role_id TO _deprecated_role_id;

ALTER TABLE sys.users
ADD CONSTRAINT ck_users__deprecated_role_id
    CHECK (_deprecated_role_id IS NULL);
```

### 사용 예시

```python
# 역할 할당
async def assign_role(
    user_id: UUID,
    role_id: UUID,
    tenant_id: UUID,
    granted_by: UUID,
    expires_at: datetime = None,
    reason: str = None
):
    """사용자에게 역할 할당"""

    return await sys.user_roles.create(
        tenant_id=tenant_id,
        user_id=user_id,
        role_id=role_id,
        granted_by=granted_by,
        expires_at=expires_at,
        is_active=True
    )

# 임시 역할 할당 (3개월)
await assign_role(
    user_id='550e8400-e29b-41d4-a716-446655440001',
    role_id='550e8400-e29b-41d4-a716-446655440002',
    tenant_id='550e8400-e29b-41d4-a716-446655440000',
    granted_by='550e8400-e29b-41d4-a716-446655440999',
    expires_at=datetime.now(timezone.utc) + timedelta(days=90),
    reason='Temporary permission for Q4 audit'
)

# 역할 해제
async def revoke_role(
    user_id: UUID,
    role_id: UUID,
    tenant_id: UUID,
    revoked_by: UUID,
    reason: str = None
):
    """사용자 역할 해제"""

    await sys.user_roles.update(
        {
            'tenant_id': tenant_id,
            'user_id': user_id,
            'role_id': role_id,
            'is_active': True
        },
        {
            'is_active': False,
            'revoked_at': datetime.now(timezone.utc),
            'revoked_by': revoked_by,
            'revoke_reason': reason
        }
    )

# 사용자의 활성 역할 조회
async def get_user_active_roles(user_id: UUID, tenant_id: UUID):
    """사용자의 현재 활성 역할 조회"""

    return await sys.user_roles.find({
        'user_id': user_id,
        'tenant_id': tenant_id,
        'is_active': True,
        'expires_at': {
            'OR': [
                {'IS': None},
                {'>': datetime.now(timezone.utc)}
            ]
        }
    })
```

---

## 3. sys.role_permissions_history 추가 (P1 - 높음)

### 목적
- 역할의 권한 변경 이력 추적
- 언제 어떤 권한이 추가/제거되었는지 기록
- 규정 준수 감시/감사 리포트 작성 가능

### SQL 스키마

```sql
-- =====================================================================================
-- 역할 권한 변경 이력 (감시/감사용)
-- =====================================================================================
CREATE TABLE IF NOT EXISTS sys.role_permissions_history (
    -- 기본 식별자
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 테넌트, 역할, 권한
    tenant_id                   UUID                     NOT NULL,  -- 테넌트 격리
    role_id                     UUID                     NOT NULL,  -- 역할
    permission_id               UUID                     NOT NULL,  -- 권한

    -- 변경 정보
    action                      VARCHAR(20)              NOT NULL,  -- GRANTED, REVOKED
    changed_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by                  UUID,                               -- 누가 변경했나

    -- 변경 사유
    reason                      TEXT,                               -- 예: "Audit compliance", "User request"

    -- 제약조건
    CONSTRAINT fk_rp_history__tenant_id     FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_history__role_id       FOREIGN KEY (role_id) REFERENCES sys.roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_history__permission_id FOREIGN KEY (permission_id) REFERENCES sys.permissions(id) ON DELETE CASCADE,

    CONSTRAINT ck_rp_history__action        CHECK (action IN ('GRANTED', 'REVOKED'))
);

-- 주석
COMMENT ON TABLE  sys.role_permissions_history         IS '역할 권한 변경 이력 (감시/감사용)';
COMMENT ON COLUMN sys.role_permissions_history.action  IS '변경 유형 (GRANTED: 권한 부여, REVOKED: 권한 제거)';
COMMENT ON COLUMN sys.role_permissions_history.reason  IS '변경 사유 및 설명';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_rp_history__role_id
    ON sys.role_permissions_history (role_id, changed_at DESC);

CREATE INDEX IF NOT EXISTS ix_rp_history__permission_id
    ON sys.role_permissions_history (permission_id, changed_at DESC);

CREATE INDEX IF NOT EXISTS ix_rp_history__changed_by
    ON sys.role_permissions_history (changed_by, changed_at DESC);

CREATE INDEX IF NOT EXISTS ix_rp_history__action
    ON sys.role_permissions_history (action, changed_at DESC);

CREATE INDEX IF NOT EXISTS ix_rp_history__changed_at
    ON sys.role_permissions_history (changed_at DESC);
```

### 트리거 (권한 변경 시 자동 기록)

```sql
-- 트리거 함수
CREATE OR REPLACE FUNCTION sys.record_role_permissions_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- 권한 추가
        INSERT INTO sys.role_permissions_history (
            tenant_id, role_id, permission_id,
            action, changed_by, changed_at
        ) VALUES (
            NEW.tenant_id,
            NEW.role_id,
            NEW.permission_id,
            'GRANTED',
            current_user_id(),  -- 현재 사용자 ID (애플리케이션 설정)
            CURRENT_TIMESTAMP
        );
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        -- 권한 제거
        INSERT INTO sys.role_permissions_history (
            tenant_id, role_id, permission_id,
            action, changed_by, changed_at
        ) VALUES (
            OLD.tenant_id,
            OLD.role_id,
            OLD.permission_id,
            'REVOKED',
            current_user_id(),
            CURRENT_TIMESTAMP
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_record_role_permissions_change
    AFTER INSERT OR DELETE ON sys.role_permissions
    FOR EACH ROW
    EXECUTE FUNCTION sys.record_role_permissions_change();
```

---

## 4. 개선 적용 순서

### Phase 1: Week 1-2
1. `sys.sessions` 테이블 생성
2. 로그인/로그아웃 로직 구현
3. 세션 검증 미들웨어 추가

### Phase 2: Week 3-4
1. `sys.user_roles` 테이블 생성
2. 기존 데이터 마이그레이션
3. 역할 관리 로직 업데이트

### Phase 3: Week 5-6
1. `sys.role_permissions_history` 테이블 생성
2. 트리거 생성
3. 감시/감사 대시보드 구현

---

## ✅ 검증 체크리스트

```sql
-- 테이블 생성 확인
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'sys'
AND table_name IN ('sessions', 'user_roles', 'role_permissions_history')
ORDER BY table_name;

-- 인덱스 확인
SELECT indexname FROM pg_indexes
WHERE schemaname = 'sys'
AND tablename IN ('sessions', 'user_roles', 'role_permissions_history');

-- 데이터 샘플 확인
SELECT COUNT(*) FROM sys.sessions WHERE status = 'ACTIVE';
SELECT COUNT(*) FROM sys.user_roles WHERE is_active = TRUE;
SELECT COUNT(*) FROM sys.role_permissions_history;
```

---

**작성자**: 데이터베이스 설계팀
**최종 업데이트**: 2024-10-26
**상태**: 📋 검토 대기 중

