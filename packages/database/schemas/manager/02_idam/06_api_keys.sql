CREATE TABLE IF NOT EXISTS idam.api_keys
(
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- API 키 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,     -- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

    -- API 키 정보
    key_id                      VARCHAR(100)                NOT NULL,                               -- 공개 키 ID (ak_xxxxxxxxxx)
    key_hash                    VARCHAR(255)                NOT NULL,                               -- 해시된 실제 키
    key_name                    VARCHAR(100)                NOT NULL,                               -- 키 이름/설명

    -- 소유자 정보
    user_id                     UUID                        NOT NULL,    							-- 사용자 ID
	tenant_context              UUID,                                                               -- 테넌트 컨텍스트
    service_account             VARCHAR(100),                                                       -- 서비스 계정명

    -- 권한 및 스코프
    scopes                      TEXT[],                                                             -- API 키 권한 스코프 배열
    allowed_ips                 INET[],                                                             -- 허용 IP 주소 배열

    -- 사용 제한
    rate_limit_per_minute       INTEGER                     DEFAULT 1000,                          	-- 분당 요청 제한
    rate_limit_per_hour         INTEGER                     DEFAULT 10000,                         	-- 시간당 요청 제한
    rate_limit_per_day          INTEGER                     DEFAULT 100000,                        	-- 일당 요청 제한

    -- 상태 및 만료
    status                      VARCHAR(20)                 NOT NULL DEFAULT 'ACTIVE',             	-- API 키 상태
    expires_at                  TIMESTAMP WITH TIME ZONE,                                           -- 만료일시

    -- 사용 통계
    last_used_at                TIMESTAMP WITH TIME ZONE,                                           -- 마지막 사용일시
    last_used_ip                INET,                                                               -- 마지막 사용 IP
    usage_count                 BIGINT                      NOT NULL DEFAULT 0,                     -- 사용 횟수

	CONSTRAINT fk_api_keys__user_id 		FOREIGN KEY (user_id) 		REFERENCES idam.users(id) 		ON DELETE CASCADE,

    CONSTRAINT uk_api_keys__key_id         	UNIQUE (key_id),
    CONSTRAINT ck_api_keys__status         	CHECK (status IN ('ACTIVE', 'INACTIVE', 'REVOKED'))
);

COMMENT ON TABLE  idam.api_keys                             IS 'API 키 관리';
COMMENT ON COLUMN idam.api_keys.id                          IS 'API 키 고유 식별자';
COMMENT ON COLUMN idam.api_keys.created_at                  IS '생성일시';
COMMENT ON COLUMN idam.api_keys.created_by                  IS '생성자 ID';
COMMENT ON COLUMN idam.api_keys.updated_at                  IS '수정일시';
COMMENT ON COLUMN idam.api_keys.updated_by                  IS '수정자 ID';
COMMENT ON COLUMN idam.api_keys.key_id                      IS '공개 키 ID (ak_xxxxxxxxxx)';
COMMENT ON COLUMN idam.api_keys.key_hash                    IS '해시된 실제 키';
COMMENT ON COLUMN idam.api_keys.key_name                    IS '키 이름/설명';
COMMENT ON COLUMN idam.api_keys.user_id                     IS '사용자 ID';
COMMENT ON COLUMN idam.api_keys.tenant_context              IS '테넌트 컨텍스트 (키가 적용되는 테넌트)';
COMMENT ON COLUMN idam.api_keys.service_account             IS '서비스 계정명';
COMMENT ON COLUMN idam.api_keys.scopes                      IS 'API 키 권한 스코프 배열';
COMMENT ON COLUMN idam.api_keys.allowed_ips                 IS '허용 IP 주소 배열';
COMMENT ON COLUMN idam.api_keys.rate_limit_per_minute       IS '분당 요청 제한';
COMMENT ON COLUMN idam.api_keys.rate_limit_per_hour         IS '시간당 요청 제한';
COMMENT ON COLUMN idam.api_keys.rate_limit_per_day          IS '일당 요청 제한';
COMMENT ON COLUMN idam.api_keys.status                      IS 'API 키 상태 (ACTIVE, INACTIVE, REVOKED)';
COMMENT ON COLUMN idam.api_keys.expires_at                  IS '만료일시';
COMMENT ON COLUMN idam.api_keys.last_used_at                IS '마지막 사용일시';
COMMENT ON COLUMN idam.api_keys.last_used_ip                IS '마지막 사용 IP';
COMMENT ON COLUMN idam.api_keys.usage_count                 IS '사용 횟수';

-- 키 ID 조회용 인덱스 (API 인증용)
CREATE INDEX IF NOT EXISTS ix_api_keys__key_id
    ON idam.api_keys (key_id)
 WHERE status = 'ACTIVE';

-- 사용자 ID 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_api_keys__user_id
    ON idam.api_keys (user_id)
 WHERE status = 'ACTIVE' AND user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_api_keys__tenant_context
	ON idam.api_keys (tenant_context)
 WHERE tenant_context IS NOT NULL;

-- 서비스 계정 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_api_keys__service_account
    ON idam.api_keys (service_account)
 WHERE status = 'ACTIVE' AND service_account IS NOT NULL;

-- API 키 상태별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_api_keys__status
    ON idam.api_keys (status);

-- 만료일시 조회용 인덱스 (만료 처리용)
CREATE INDEX IF NOT EXISTS ix_api_keys__expires_at
    ON idam.api_keys (expires_at)
 WHERE expires_at IS NOT NULL AND status = 'ACTIVE';

-- 마지막 사용일시 조회용 인덱스 (비활성 키 식별용)
CREATE INDEX IF NOT EXISTS ix_api_keys__last_used_at
    ON idam.api_keys (last_used_at)
 WHERE status = 'ACTIVE';

-- 사용 통계 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_api_keys__usage_count
    ON idam.api_keys (usage_count DESC)
 WHERE status = 'ACTIVE';
