-- =====================================================================================
-- 테이블: idam.roles
-- 설명: 운영자 역할 정의 - Manager 시스템 역할 관리
-- 작성일: 2024-01-15
-- 수정일: 2025-10-27
-- =====================================================================================

CREATE TABLE IF NOT EXISTS idam.roles
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 역할 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,                                           -- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

    -- 역할 정보
    code                        VARCHAR(100)                NOT NULL,                               -- 역할 코드 (super_admin, tenant_admin, support)
    name                        VARCHAR(100)                NOT NULL,                               -- 역할 명칭
    description                 TEXT,                                                               -- 역할 설명

    -- 역할 속성
    category                    VARCHAR(50)                 NOT NULL DEFAULT 'TENANT_USER',        -- 역할 카테고리 (MANAGER_ADMIN: 운영자, PLATFORM_SUPPORT: 플랫폼지원, TENANT_ADMIN: 테넌트관리자, TENANT_USER: 테넌트사용자)
    level                       INTEGER                     NOT NULL DEFAULT 100,                   -- 역할 레벨 (1-10: 최상위 관리자, 11-50: 플랫폼, 51-100: 테넌트 관리자, 101+: 사용자)
    scope                       VARCHAR(20)                 NOT NULL DEFAULT 'GLOBAL',              -- 적용 범위 (GLOBAL: 전역, TENANT: 테넌트별)

    is_default                  BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- 기본 역할 여부
    priority                    INTEGER                     NOT NULL DEFAULT 100,                   -- 역할 우선순위 (낮을수록 높은 권한)

    -- 상태 관리
    status                      VARCHAR(20)                 NOT NULL DEFAULT 'ACTIVE',              -- 역할 상태
    is_deleted                  BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- 논리적 삭제 플래그

    -- 제약조건
    CONSTRAINT uk_roles__code              UNIQUE (code),
    CONSTRAINT ck_roles__status            CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT ck_roles__category          CHECK (category IN ('MANAGER_ADMIN', 'PLATFORM_SUPPORT', 'TENANT_ADMIN', 'TENANT_USER')),
    CONSTRAINT ck_roles__level             CHECK (level >= 1 AND level <= 200),
    CONSTRAINT ck_roles__scope             CHECK (scope IN ('GLOBAL', 'TENANT')),
    CONSTRAINT ck_roles__category_scope    CHECK (
        (category = 'MANAGER_ADMIN' AND scope = 'GLOBAL') OR
        (category = 'PLATFORM_SUPPORT' AND scope = 'GLOBAL') OR
        (category = 'TENANT_ADMIN' AND scope IN ('GLOBAL', 'TENANT')) OR
        (category = 'TENANT_USER' AND scope = 'TENANT')
    )
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  idam.roles                    IS 'Manager DB 역할 정의 - 운영자/플랫폼/테넌트 관리자 역할만 관리, 테넌트 사용자 역할은 sys.roles에서 관리';
COMMENT ON COLUMN idam.roles.id                 IS '역할 고유 식별자';
COMMENT ON COLUMN idam.roles.created_at         IS '생성일시';
COMMENT ON COLUMN idam.roles.created_by         IS '생성자 ID';
COMMENT ON COLUMN idam.roles.updated_at         IS '수정일시';
COMMENT ON COLUMN idam.roles.updated_by         IS '수정자 ID';
COMMENT ON COLUMN idam.roles.code               IS '역할 코드 (super_admin, tenant_admin, support, platform_support)';
COMMENT ON COLUMN idam.roles.name               IS '역할 명칭';
COMMENT ON COLUMN idam.roles.description        IS '역할 설명';
COMMENT ON COLUMN idam.roles.category           IS '역할 카테고리 - MANAGER_ADMIN(운영자), PLATFORM_SUPPORT(플랫폼지원), TENANT_ADMIN(테넌트관리자), TENANT_USER(테넌트사용자)';
COMMENT ON COLUMN idam.roles.level              IS '역할 레벨 (1-10: 최상위, 11-50: 플랫폼, 51-100: 테넌트 관리자, 101+: 사용자) - 낮을수록 높은 권한';
COMMENT ON COLUMN idam.roles.scope              IS '역할 적용 범위 (GLOBAL: 전역, TENANT: 테넌트별)';
COMMENT ON COLUMN idam.roles.is_default         IS '기본 역할 여부';
COMMENT ON COLUMN idam.roles.priority           IS '역할 우선순위 (낮을수록 높은 권한)';
COMMENT ON COLUMN idam.roles.status             IS '역할 상태 (ACTIVE, INACTIVE)';
COMMENT ON COLUMN idam.roles.is_deleted         IS '논리적 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

-- 역할 코드 조회용 인덱스 (부분 인덱스)
CREATE INDEX IF NOT EXISTS ix_roles__code
    ON idam.roles (code)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_roles__code IS '역할 코드 조회 인덱스 (활성/미삭제)';

-- 역할 카테고리별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_roles__category
    ON idam.roles (category)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_roles__category IS '역할 카테고리별 조회 인덱스';

-- 스코프별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_roles__scope
    ON idam.roles (scope)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_roles__scope IS '스코프별 조회 인덱스';

-- 기본 역할 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_roles__is_default
    ON idam.roles (is_default)
 WHERE is_default = TRUE
   AND is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_roles__is_default IS '기본 역할 조회 인덱스';

-- 레벨별 조회용 인덱스 (권한 계층 구분용)
CREATE INDEX IF NOT EXISTS ix_roles__level
    ON idam.roles (level ASC)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_roles__level IS '역할 레벨별 조회 인덱스 (권한 계층)';

-- 우선순위별 조회용 인덱스 (권한 충돌 해결용)
CREATE INDEX IF NOT EXISTS ix_roles__priority
    ON idam.roles (priority ASC)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_roles__priority IS '우선순위별 조회 인덱스 (권한 충돌 해결용)';

-- 복합 인덱스 (카테고리 + 레벨)
CREATE INDEX IF NOT EXISTS ix_roles__category_level
    ON idam.roles (category, level ASC)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_roles__category_level IS '카테고리별 레벨 조회 인덱스';
