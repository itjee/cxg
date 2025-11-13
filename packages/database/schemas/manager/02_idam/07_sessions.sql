CREATE TABLE IF NOT EXISTS idam.sessions
(
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 세션 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,     										-- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

    -- 세션 정보
    session_id                  VARCHAR(255)                NOT NULL,                               -- 세션 토큰 해시
    user_id                     UUID                        NOT NULL,    							-- 사용자 ID

	-- 세션 컨텍스트 (통합 시스템)
    tenant_context              UUID,                                                               -- 현재 세션의 테넌트 컨텍스트
    session_type                VARCHAR(20)                 NOT NULL DEFAULT 'WEB',                	-- 세션 타입 (WEB, API, MOBILE)

    -- 세션 메타데이터
    fingerprint          		VARCHAR(255),                                                       -- 디바이스 핑거프린트
    user_agent                  TEXT,                                                               -- 사용자 에이전트
    ip_address                  INET                        NOT NULL,                               -- IP 주소
    country_code                CHAR(2),                                                            -- 국가 코드
    city                        VARCHAR(100),                                                       -- 도시명

    -- 세션 상태
    status                      VARCHAR(20)                 NOT NULL DEFAULT 'ACTIVE',             	-- 세션 상태
    expires_at                  TIMESTAMP WITH TIME ZONE    NOT NULL,                               -- 만료일시
    last_activity_at            TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 마지막 활동일시

    -- MFA 정보
    mfa_verified                BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- MFA 인증 여부
    mfa_verified_at             TIMESTAMP WITH TIME ZONE,                                           -- MFA 인증일시

	CONSTRAINT fk_sessions__user_id 			FOREIGN KEY (user_id) 		REFERENCES idam.users(id) 		ON DELETE CASCADE,

    CONSTRAINT uk_sessions__session_id         	UNIQUE (session_id),
    CONSTRAINT ck_sessions__status             	CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED')),
	CONSTRAINT ck_sessions__session_type        CHECK (session_type IN ('WEB', 'API', 'MOBILE'))
);

COMMENT ON TABLE  idam.sessions                             IS '사용자 세션 관리';
COMMENT ON COLUMN idam.sessions.id                          IS '세션 고유 식별자';
COMMENT ON COLUMN idam.sessions.created_at                  IS '생성일시';
COMMENT ON COLUMN idam.sessions.created_by                  IS '생성자 ID';
COMMENT ON COLUMN idam.sessions.updated_at                  IS '수정일시';
COMMENT ON COLUMN idam.sessions.updated_by                  IS '수정자 ID';
COMMENT ON COLUMN idam.sessions.session_id                  IS '세션 토큰 해시';
COMMENT ON COLUMN idam.sessions.user_id                     IS '사용자 ID';
COMMENT ON COLUMN idam.sessions.tenant_context              IS '현재 세션의 테넌트 컨텍스트';
COMMENT ON COLUMN idam.sessions.session_type                IS '세션 타입 (WEB, API, MOBILE)';
COMMENT ON COLUMN idam.sessions.fingerprint          		IS '디바이스 핑거프린트';
COMMENT ON COLUMN idam.sessions.user_agent                  IS '사용자 에이전트';
COMMENT ON COLUMN idam.sessions.ip_address                  IS 'IP 주소';
COMMENT ON COLUMN idam.sessions.country_code                IS '국가 코드';
COMMENT ON COLUMN idam.sessions.city                        IS '도시명';
COMMENT ON COLUMN idam.sessions.status                      IS '세션 상태 (ACTIVE, EXPIRED, REVOKED)';
COMMENT ON COLUMN idam.sessions.expires_at                  IS '만료일시';
COMMENT ON COLUMN idam.sessions.last_activity_at            IS '마지막 활동일시';
COMMENT ON COLUMN idam.sessions.mfa_verified                IS 'MFA 인증 여부';
COMMENT ON COLUMN idam.sessions.mfa_verified_at             IS 'MFA 인증일시';

-- 세션 ID 조회용 인덱스 (세션 인증용)
CREATE INDEX IF NOT EXISTS ix_sessions__session_id
    ON idam.sessions (session_id)
 WHERE status = 'ACTIVE';

-- 사용자 ID 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_sessions__user_id
    ON idam.sessions (user_id)
 WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_sessions__tenant_context
	ON idam.sessions (tenant_context)
 WHERE tenant_context IS NOT NULL;

-- 세션 상태별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_sessions__status
    ON idam.sessions (status);

-- 만료일시 조회용 인덱스 (만료 세션 정리용)
CREATE INDEX IF NOT EXISTS ix_sessions__expires_at
    ON idam.sessions (expires_at)
 WHERE status = 'ACTIVE';

-- 마지막 활동일시 조회용 인덱스 (비활성 세션 식별용)
CREATE INDEX IF NOT EXISTS ix_sessions__last_activity_at
    ON idam.sessions (last_activity_at)
 WHERE status = 'ACTIVE';

-- IP 주소 조회용 인덱스 (보안 모니터링용)
CREATE INDEX IF NOT EXISTS ix_sessions__ip_address
    ON idam.sessions (ip_address)
 WHERE status = 'ACTIVE';

-- 디바이스 핑거프린트 조회용 인덱스 (디바이스 추적용)
CREATE INDEX IF NOT EXISTS ix_sessions__fingerprint
    ON idam.sessions (fingerprint)
 WHERE fingerprint IS NOT NULL AND status = 'ACTIVE';

-- MFA 인증 여부 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_sessions__mfa_verified
    ON idam.sessions (mfa_verified)
 WHERE status = 'ACTIVE';
