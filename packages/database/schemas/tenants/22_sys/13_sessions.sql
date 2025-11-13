-- =====================================================================================
-- 테넌트 사용자 세션 관리
-- =====================================================================================
-- 목적: 테넌트 사용자 로그인 세션 추적, 동시 세션 제한, 보안 모니터링
-- 생성일: 2024-10-26
-- 우선순위: P0 (긴급)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.sessions (
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- 테넌트 및 사용자 정보
    user_id                     UUID                     NOT NULL,  -- 사용자

    -- 세션 정보
    session_id                  VARCHAR(255)             NOT NULL,  -- 세션 고유 식별자
    session_token               VARCHAR(255),                        -- 토큰 해시 (보안)

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
    CONSTRAINT fk_sessions__user_id      FOREIGN KEY (user_id) REFERENCES sys.users(id) ON DELETE CASCADE,
    CONSTRAINT uk_sessions__session_id   UNIQUE (session_id),
    CONSTRAINT ck_sessions__status       CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED')),
    CONSTRAINT ck_sessions__device_type  CHECK (device_type IN ('WEB', 'MOBILE', 'API', 'DESKTOP')),
    CONSTRAINT ck_sessions__expires      CHECK (expires_at > created_at)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.sessions                         IS '테넌트 사용자 세션 관리 - 로그인 상태 추적 및 보안 모니터링';
COMMENT ON COLUMN sys.sessions.id                      IS '세션 고유 식별자';
COMMENT ON COLUMN sys.sessions.created_at              IS '세션 생성 시각';
COMMENT ON COLUMN sys.sessions.created_by              IS '세션을 생성한 사용자 ID';
COMMENT ON COLUMN sys.sessions.updated_at              IS '마지막 수정 시각';
COMMENT ON COLUMN sys.sessions.updated_by              IS '마지막 수정한 사용자 ID';
COMMENT ON COLUMN sys.sessions.user_id                 IS '사용자 ID';
COMMENT ON COLUMN sys.sessions.session_id              IS '세션 고유 식별자 (토큰 형태)';
COMMENT ON COLUMN sys.sessions.session_token           IS '보안상 토큰의 해시값 저장';
COMMENT ON COLUMN sys.sessions.device_type             IS '디바이스 타입 (WEB, MOBILE, API, DESKTOP)';
COMMENT ON COLUMN sys.sessions.device_name             IS '디바이스 이름 (사용자 식별용)';
COMMENT ON COLUMN sys.sessions.browser                 IS '브라우저 이름';
COMMENT ON COLUMN sys.sessions.user_agent              IS '클라이언트 User-Agent 헤더';
COMMENT ON COLUMN sys.sessions.ip_address              IS '클라이언트 IP 주소';
COMMENT ON COLUMN sys.sessions.country_code            IS '지리적 위치 - 국가 코드';
COMMENT ON COLUMN sys.sessions.city                    IS '지리적 위치 - 도시명';
COMMENT ON COLUMN sys.sessions.expires_at              IS '세션 만료 시각 (보통 로그인 후 24시간)';
COMMENT ON COLUMN sys.sessions.last_activity_at        IS '마지막 API 호출 시각 (타임아웃 추적)';
COMMENT ON COLUMN sys.sessions.status                  IS '세션 상태 (ACTIVE: 활성, EXPIRED: 만료됨, REVOKED: 수동 종료)';
COMMENT ON COLUMN sys.sessions.revoked_at              IS '사용자 수동 로그아웃 시각';
COMMENT ON COLUMN sys.sessions.revoke_reason           IS '세션 종료 사유';

-- 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS ux_sessions__session_id
    ON sys.sessions (session_id)
 WHERE status IN ('ACTIVE', 'REVOKED');

CREATE INDEX IF NOT EXISTS ix_sessions__user_id
    ON sys.sessions (user_id, created_at DESC)
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
