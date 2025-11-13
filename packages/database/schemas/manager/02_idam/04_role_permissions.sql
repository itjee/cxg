CREATE TABLE IF NOT EXISTS idam.role_permissions
(
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 역할-권한 매핑 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,     -- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

    role_id                     UUID                        NOT NULL,         						-- 역할 ID
    permission_id               UUID                        NOT NULL,   							-- 권한 ID

    -- 권한 부여 조건
    granted_at                  TIMESTAMP WITH TIME ZONE,     										-- 권한 부여일시
	granted_by                  UUID,              													-- 권한 부여자 ID

	CONSTRAINT fk_role_permissions__role_id 			FOREIGN KEY (role_id) 		REFERENCES idam.roles(id) 		ON DELETE CASCADE,
	CONSTRAINT fk_role_permissions__permission_id 		FOREIGN KEY (permission_id) REFERENCES idam.permissions(id) ON DELETE CASCADE
);

COMMENT ON TABLE  idam.role_permissions                     IS '역할-권한 매핑 관리';
COMMENT ON COLUMN idam.role_permissions.id                  IS '역할-권한 매핑 고유 식별자';
COMMENT ON COLUMN idam.role_permissions.created_at          IS '생성일시';
COMMENT ON COLUMN idam.role_permissions.created_by          IS '생성자 ID';
COMMENT ON COLUMN idam.role_permissions.updated_at          IS '수정일시';
COMMENT ON COLUMN idam.role_permissions.updated_by          IS '수정자 ID';
COMMENT ON COLUMN idam.role_permissions.role_id             IS '역할 ID';
COMMENT ON COLUMN idam.role_permissions.permission_id       IS '권한 ID';
COMMENT ON COLUMN idam.role_permissions.granted_by          IS '권한 부여자 ID';
COMMENT ON COLUMN idam.role_permissions.granted_at          IS '권한 부여일시';

--역할, 권한 매핑
CREATE UNIQUE INDEX IF NOT EXISTS ux_role_permissions
	ON idam.role_permissions (role_id, permission_id);

-- 역할 ID 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_role_permissions__role_id
    ON idam.role_permissions (role_id);

-- 권한 ID 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_role_permissions__permission_id
    ON idam.role_permissions (permission_id);

-- 권한 부여자 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_role_permissions__granted_by
    ON idam.role_permissions (granted_by)
 WHERE granted_by IS NOT NULL;

-- 권한 부여일시 조회용 인덱스 (감사 추적용)
CREATE INDEX IF NOT EXISTS ix_role_permissions__granted_at
    ON idam.role_permissions (granted_at);
