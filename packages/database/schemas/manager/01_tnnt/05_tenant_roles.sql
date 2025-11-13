CREATE TABLE IF NOT EXISTS tnnt.tenant_roles
(
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 연결 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,                                           -- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

    -- 연결 정보
    tenant_id                   UUID                        NOT NULL,                               -- 테넌트 ID (tnnt.tenants 참조)
    role_id                     UUID                        NOT NULL,                               -- 역할 ID (idam.roles 참조)

    -- 테넌트별 역할 설정
    role_name                   VARCHAR(100),                                                       -- 테넌트별 역할명 재정의
    description                 TEXT,                                                               -- 테넌트별 역할 설명 재정의

    -- 테넌트별 역할 속성
    is_default                  BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- 테넌트 내 기본 역할 여부
    priority                    INTEGER,                                                            -- 테넌트 내 우선순위 (글로벌 우선순위와 별도)

    -- 활성화 상태
    is_enabled                  BOOLEAN                     NOT NULL DEFAULT TRUE,                  -- 테넌트 내 역할 활성화 여부
    enabled_at                  TIMESTAMP WITH TIME ZONE    DEFAULT CURRENT_TIMESTAMP,              -- 활성화 일시
    disabled_at                 TIMESTAMP WITH TIME ZONE,                                           -- 비활성화 일시

    -- 테넌트별 역할 제한
    max_users                   INTEGER,                                                            -- 이 역할을 가질 수 있는 최대 사용자 수
    current_users               INTEGER                     NOT NULL DEFAULT 0,                     -- 현재 이 역할을 가진 사용자 수

    -- 외래 키 제약 조건
    CONSTRAINT fk_tenant_roles__tenant_id       FOREIGN KEY (tenant_id)    REFERENCES tnnt.tenants(id)    ON DELETE CASCADE,
    CONSTRAINT fk_tenant_roles__role_id         FOREIGN KEY (role_id)      REFERENCES idam.roles(id)      ON DELETE CASCADE,

    -- 고유 제약 조건
    CONSTRAINT uk_tenant_roles__tenant_role     UNIQUE (tenant_id, role_id),

    -- 체크 제약 조건
    CONSTRAINT ck_tenant_roles__users_count     CHECK (current_users >= 0 AND (max_users IS NULL OR current_users <= max_users)),
    CONSTRAINT ck_tenant_roles__dates           CHECK (disabled_at IS NULL OR disabled_at > enabled_at)
);

COMMENT ON TABLE  tnnt.tenant_roles                         IS '테넌트-역할 연결 관리 (테넌트별 역할 커스터마이징)';
COMMENT ON COLUMN tnnt.tenant_roles.id                      IS '연결 고유 식별자';
COMMENT ON COLUMN tnnt.tenant_roles.created_at              IS '생성일시';
COMMENT ON COLUMN tnnt.tenant_roles.created_by              IS '생성자 ID';
COMMENT ON COLUMN tnnt.tenant_roles.updated_at              IS '수정일시';
COMMENT ON COLUMN tnnt.tenant_roles.updated_by              IS '수정자 ID';
COMMENT ON COLUMN tnnt.tenant_roles.tenant_id               IS '테넌트 ID (tnnt.tenants 참조)';
COMMENT ON COLUMN tnnt.tenant_roles.role_id                 IS '역할 ID (idam.roles 참조)';
COMMENT ON COLUMN tnnt.tenant_roles.role_name               IS '테넌트별 역할명 재정의';
COMMENT ON COLUMN tnnt.tenant_roles.description             IS '테넌트별 역할 설명 재정의';
COMMENT ON COLUMN tnnt.tenant_roles.is_default              IS '테넌트 내 기본 역할 여부';
COMMENT ON COLUMN tnnt.tenant_roles.priority                IS '테넌트 내 우선순위 (글로벌 우선순위와 별도)';
COMMENT ON COLUMN tnnt.tenant_roles.is_enabled                 IS '테넌트 내 역할 활성화 여부';
COMMENT ON COLUMN tnnt.tenant_roles.max_users               IS '이 역할을 가질 수 있는 최대 사용자 수';
COMMENT ON COLUMN tnnt.tenant_roles.current_users           IS '현재 이 역할을 가진 사용자 수';

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS ix_tenant_roles__tenant_id   ON tnnt.tenant_roles (tenant_id);
CREATE INDEX IF NOT EXISTS ix_tenant_roles__role_id     ON tnnt.tenant_roles (role_id);
CREATE INDEX IF NOT EXISTS ix_tenant_roles__is_is_enabled  ON tnnt.tenant_roles (is_enabled);
CREATE INDEX IF NOT EXISTS ix_tenant_roles__is_default  ON tnnt.tenant_roles (is_default) WHERE is_default = TRUE;
CREATE INDEX IF NOT EXISTS ix_tenant_roles__priority    ON tnnt.tenant_roles (tenant_id, priority) WHERE priority IS NOT NULL;
