CREATE TABLE IF NOT EXISTS idam.user_roles
(
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 사용자-역할 매핑 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,     										-- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

    user_id                     UUID                        NOT NULL,         						-- 사용자 ID
    role_id                     UUID                        NOT NULL,         						-- 역할 ID

    -- 권한 컨텍스트 (통합 시스템의 핵심)
    scope                       VARCHAR(20)                 NOT NULL DEFAULT 'GLOBAL',             	-- 권한 범위 (GLOBAL, TENANT)
	tenant_context              UUID,                                                               -- 권한 적용 테넌트 (NULL=글로벌)

    -- 역할 부여 정보
    granted_at                  TIMESTAMP WITH TIME ZONE,     										-- 역할 부여일시
	granted_by                  UUID,              													-- 역할 부여자 ID

    expires_at                  TIMESTAMP WITH TIME ZONE,                                           -- 역할 만료일 (NULL이면 무기한)

    -- 상태
    status                      VARCHAR(20)                 NOT NULL DEFAULT 'ACTIVE',             	-- 역할 상태

    CONSTRAINT fk_user_roles__user_id 			FOREIGN KEY (user_id) 		REFERENCES idam.users(id) 		ON DELETE CASCADE,
	CONSTRAINT fk_user_roles__role_id 			FOREIGN KEY (role_id) 		REFERENCES idam.roles(id) 		ON DELETE CASCADE,

	CONSTRAINT uk_user_roles__user_role_context 	UNIQUE 	(user_id, role_id, tenant_context),
    CONSTRAINT ck_user_roles__status               	CHECK 	(status IN ('ACTIVE', 'INACTIVE', 'EXPIRED')),
    CONSTRAINT ck_user_roles__scope             	CHECK 	(scope IN ('GLOBAL', 'TENANT'))
);

COMMENT ON TABLE  idam.user_roles                           IS '사용자-역할 매핑 관리';
COMMENT ON COLUMN idam.user_roles.id                        IS '사용자-역할 매핑 고유 식별자';
COMMENT ON COLUMN idam.user_roles.created_at                IS '생성일시';
COMMENT ON COLUMN idam.user_roles.created_by                IS '생성자 ID';
COMMENT ON COLUMN idam.user_roles.updated_at                IS '수정일시';
COMMENT ON COLUMN idam.user_roles.updated_by                IS '수정자 ID';
COMMENT ON COLUMN idam.user_roles.user_id                   IS '사용자 ID';
COMMENT ON COLUMN idam.user_roles.role_id                   IS '역할 ID';
COMMENT ON COLUMN idam.user_roles.tenant_context            IS '권한 적용 테넌트 (NULL=글로벌, 값=특정 테넌트)';
COMMENT ON COLUMN idam.user_roles.scope                     IS '권한 범위 (GLOBAL: 전역, TENANT: 테넌트별)';
COMMENT ON COLUMN idam.user_roles.granted_by                IS '역할 부여자 ID';
COMMENT ON COLUMN idam.user_roles.granted_at                IS '역할 부여일시';
COMMENT ON COLUMN idam.user_roles.expires_at                IS '역할 만료일 (NULL이면 무기한)';
COMMENT ON COLUMN idam.user_roles.status                    IS '역할 상태 (ACTIVE, INACTIVE, EXPIRED)';

-- 사용자 ID 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_user_roles__user_id
    ON idam.user_roles (user_id)
 WHERE status = 'ACTIVE';

-- 역할 ID 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_user_roles__role_id
    ON idam.user_roles (role_id)
 WHERE status = 'ACTIVE';

-- 스코프 타입별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_user_roles__tenant_context
	ON idam.user_roles (tenant_context)
 WHERE tenant_context IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_user_roles__scope
	ON idam.user_roles (scope)
 WHERE status = 'ACTIVE';

-- 역할 만료일 조회용 인덱스 (만료 처리용)
CREATE INDEX IF NOT EXISTS ix_user_roles__expires_at
    ON idam.user_roles (expires_at)
 WHERE expires_at IS NOT NULL AND status = 'ACTIVE';

-- 역할 부여자 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_user_roles__granted_by
    ON idam.user_roles (granted_by)
 WHERE granted_by IS NOT NULL;

-- 역할 상태별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_user_roles__status
    ON idam.user_roles (status);

-- 복합 조회용 인덱스 (사용자 + 역할)
CREATE INDEX IF NOT EXISTS ix_user_roles__user_role
    ON idam.user_roles (user_id, role_id)
 WHERE status = 'ACTIVE';
