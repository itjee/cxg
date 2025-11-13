CREATE TABLE IF NOT EXISTS tnnt.tenant_users
(
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 연결 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,                                           -- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

    -- 연결 정보
    tenant_id                   UUID                        NOT NULL,                               -- 테넌트 ID (tnnt.tenants 참조)
    user_id                     UUID                        NOT NULL,                               -- 사용자 ID (idam.users 참조)

    -- 테넌트 내 역할 정보
    role                        VARCHAR(50),                                                        -- 테넌트 내 역할/직책
    department                  VARCHAR(100),                                                       -- 테넌트 내 부서
    position                    VARCHAR(100),                                                       -- 테넌트 내 직급
    employee_id                 VARCHAR(50),                                                        -- 테넌트 내 사번

    -- 연결 상태 및 기간
    start_date                  DATE    NOT NULL DEFAULT CURRENT_DATE,                              -- 테넌트 가입일
    close_date                  DATE,                                                               -- 테넌트 탈퇴일
    status                      VARCHAR(20)                 NOT NULL DEFAULT 'ACTIVE',              -- 테넌트 내 상태

    -- 권한 설정
    is_primary                  BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- 주 테넌트 여부 (사용자가 여러 테넌트에 속할 경우)
    is_admin                    BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- 테넌트 관리자 여부

    -- 외래 키 제약 조건
    CONSTRAINT fk_tenant_users__tenant_id       FOREIGN KEY (tenant_id)    REFERENCES tnnt.tenants(id)    ON DELETE CASCADE,
    CONSTRAINT fk_tenant_users__user_id         FOREIGN KEY (user_id)      REFERENCES idam.users(id)      ON DELETE CASCADE,

    -- 고유 제약 조건
    CONSTRAINT uk_tenant_users__tenant_user     UNIQUE (tenant_id, user_id),

    -- 체크 제약 조건
    CONSTRAINT ck_tenant_users__status          CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'LEFT')),
    CONSTRAINT ck_tenant_users__dates           CHECK (close_date IS NULL OR close_date > start_date),
    CONSTRAINT ck_tenant_users__primary_admin   CHECK (NOT (is_primary = true AND is_admin = false))  -- 주 테넌트면서 관리자가 아닐 수 없음
);

COMMENT ON TABLE  tnnt.tenant_users                         IS '테넌트-사용자 연결 관리 (관계와 테넌트별 정보만 담당)';
COMMENT ON COLUMN tnnt.tenant_users.id                      IS '연결 고유 식별자';
COMMENT ON COLUMN tnnt.tenant_users.created_at              IS '생성일시';
COMMENT ON COLUMN tnnt.tenant_users.created_by              IS '생성자 ID';
COMMENT ON COLUMN tnnt.tenant_users.updated_at              IS '수정일시';
COMMENT ON COLUMN tnnt.tenant_users.updated_by              IS '수정자 ID';
COMMENT ON COLUMN tnnt.tenant_users.tenant_id               IS '테넌트 ID (tnnt.tenants 참조)';
COMMENT ON COLUMN tnnt.tenant_users.user_id                 IS '사용자 ID (idam.users 참조)';
COMMENT ON COLUMN tnnt.tenant_users.role                    IS '테넌트 내 역할/직책';
COMMENT ON COLUMN tnnt.tenant_users.department              IS '테넌트 내 부서';
COMMENT ON COLUMN tnnt.tenant_users.position                IS '테넌트 내 직급';
COMMENT ON COLUMN tnnt.tenant_users.employee_id             IS '테넌트 내 사번';
COMMENT ON COLUMN tnnt.tenant_users.start_date              IS '테넌트 가입일';
COMMENT ON COLUMN tnnt.tenant_users.close_date              IS '테넌트 탈퇴일';
COMMENT ON COLUMN tnnt.tenant_users.status                  IS '테넌트 내 상태 (ACTIVE, INACTIVE, SUSPENDED, LEFT)';
COMMENT ON COLUMN tnnt.tenant_users.is_primary              IS '주 테넌트 여부 (사용자가 여러 테넌트에 속할 경우)';
COMMENT ON COLUMN tnnt.tenant_users.is_admin                IS '테넌트 관리자 여부';

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS ix_tenant_users__tenant_id ON tnnt.tenant_users (tenant_id);
CREATE INDEX IF NOT EXISTS ix_tenant_users__user_id ON tnnt.tenant_users (user_id);
CREATE INDEX IF NOT EXISTS ix_tenant_users__status ON tnnt.tenant_users (status);
CREATE INDEX IF NOT EXISTS ix_tenant_users__is_primary ON tnnt.tenant_users (is_primary) WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS ix_tenant_users__is_admin ON tnnt.tenant_users (is_admin) WHERE is_admin = TRUE;
CREATE INDEX IF NOT EXISTS ix_tenant_users__start_date ON tnnt.tenant_users (start_date);
CREATE INDEX IF NOT EXISTS ix_tenant_users__close_date ON tnnt.tenant_users (close_date) WHERE close_date IS NOT NULL;
