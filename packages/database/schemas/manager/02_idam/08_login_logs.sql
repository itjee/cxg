CREATE TABLE IF NOT EXISTS idam.login_logs
(
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 로그인 이력 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,     										-- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

    user_id                     UUID,                                                               -- 사용자 ID (존재하지 않는 사용자의 경우 NULL)
	user_type                   VARCHAR(20),                                                        -- 사용자 타입 (로그 보존용)
    tenant_context              UUID,                                                               -- 로그인 시 테넌트 컨텍스트

	username                    VARCHAR(100),                                                       -- 사용자명 (삭제된 사용자 이력 보존용)

    -- 로그인 시도 정보
    attempt_type                VARCHAR(20)                 NOT NULL,                               -- 시도 타입 (LOGIN, LOGOUT, FAILED_LOGIN, LOCKED)
    success                     BOOLEAN                     NOT NULL,                               -- 성공 여부
    failure_reason              VARCHAR(100),                                                       -- 실패 사유 (INVALID_PASSWORD, ACCOUNT_LOCKED, MFA_FAILED)

    -- 세션 정보
    session_id                  VARCHAR(255),                                                       -- 세션 ID
    ip_address                  INET                        NOT NULL,                               -- IP 주소
    user_agent                  TEXT,                                                               -- 사용자 에이전트
    country_code                CHAR(2),                                                            -- 국가 코드
    city                        VARCHAR(100),                                                       -- 도시명

    -- MFA 정보
    mfa_used                    BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- MFA 사용 여부
    mfa_method                  VARCHAR(50),                                                        -- MFA 방법 (TOTP, SMS, EMAIL)

    CONSTRAINT fk_login_logs__user_id 			FOREIGN KEY (user_id) 		REFERENCES idam.users(id) 		ON DELETE SET NULL,

	CONSTRAINT ck_idam_login_logs__attempt_type CHECK (
        attempt_type IN ('LOGIN', 'LOGOUT', 'FAILED_LOGIN', 'LOCKED', 'PASSWORD_RESET')
    ),
	CONSTRAINT ck_login_logs__user_type         CHECK (user_type IN ('MASTER', 'TENANT', 'SYSTEM'))
);

COMMENT ON TABLE idam.login_logs                         IS '로그인 이력 관리 (보안 감사용)';
COMMENT ON COLUMN idam.login_logs.id                     IS '로그인 이력 고유 식별자';
COMMENT ON COLUMN idam.login_logs.created_at             IS '생성일시';
COMMENT ON COLUMN idam.login_logs.created_by             IS '생성자 ID';
COMMENT ON COLUMN idam.login_logs.updated_at             IS '수정일시';
COMMENT ON COLUMN idam.login_logs.updated_by             IS '수정자 ID';
COMMENT ON COLUMN idam.login_logs.user_id                IS '사용자 ID';
COMMENT ON COLUMN idam.login_logs.username               IS '사용자명 (삭제된 사용자 이력 보존용)';
COMMENT ON COLUMN idam.login_logs.user_type              IS '사용자 타입 (로그 분석용)';
COMMENT ON COLUMN idam.login_logs.tenant_context         IS '로그인 시 테넌트 컨텍스트';
COMMENT ON COLUMN idam.login_logs.attempt_type           IS '시도 타입 (LOGIN, LOGOUT, FAILED_LOGIN, LOCKED, PASSWORD_RESET)';
COMMENT ON COLUMN idam.login_logs.success                IS '성공 여부';
COMMENT ON COLUMN idam.login_logs.failure_reason         IS '실패 사유 (INVALID_PASSWORD, ACCOUNT_LOCKED, MFA_FAILED)';
COMMENT ON COLUMN idam.login_logs.session_id             IS '세션 ID';
COMMENT ON COLUMN idam.login_logs.ip_address             IS 'IP 주소';
COMMENT ON COLUMN idam.login_logs.user_agent             IS '사용자 에이전트';
COMMENT ON COLUMN idam.login_logs.country_code           IS '국가 코드';
COMMENT ON COLUMN idam.login_logs.city                   IS '도시명';
COMMENT ON COLUMN idam.login_logs.mfa_used               IS 'MFA 사용 여부';
COMMENT ON COLUMN idam.login_logs.mfa_method             IS 'MFA 방법 (TOTP, SMS, EMAIL)';

-- 사용자 ID 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_login_logs__user_id
    ON idam.login_logs (user_id)
 WHERE user_id IS NOT NULL;

-- 생성일시 조회용 인덱스 (시간 순 조회)
CREATE INDEX IF NOT EXISTS ix_login_logs__created_at
    ON idam.login_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS ix_login_logs__user_type
	ON idam.login_logs (user_type);

CREATE INDEX IF NOT EXISTS ix_login_logs__tenant_context
	ON idam.login_logs (tenant_context)
 WHERE tenant_context IS NOT NULL;

-- 시도 타입별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_login_logs__attempt_type
    ON idam.login_logs (attempt_type);

-- 성공 여부별 조회용 인덱스 (실패 로그인 추적용)
CREATE INDEX IF NOT EXISTS ix_login_logs__success
    ON idam.login_logs (success, created_at DESC)
 WHERE success = FALSE;

-- IP 주소 조회용 인덱스 (보안 모니터링용)
CREATE INDEX IF NOT EXISTS ix_login_logs__ip_address
    ON idam.login_logs (ip_address, created_at DESC);

-- 사용자명 조회용 인덱스 (삭제된 사용자 추적용)
CREATE INDEX IF NOT EXISTS ix_login_logs__username
    ON idam.login_logs (username)
 WHERE username IS NOT NULL;

-- 실패 사유별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_login_logs__failure_reason
    ON idam.login_logs (failure_reason, created_at DESC)
 WHERE failure_reason IS NOT NULL;

-- MFA 사용 현황 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_login_logs__mfa_used
    ON idam.login_logs (mfa_used, created_at DESC)
 WHERE mfa_used = TRUE;

-- 복합 조회용 인덱스 (사용자 + 시간)
CREATE INDEX IF NOT EXISTS ix_login_logs__user_created
    ON idam.login_logs (user_id, created_at DESC)
 WHERE user_id IS NOT NULL;
