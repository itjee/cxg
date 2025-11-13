-- =====================================================================================
-- 테이블: idam.permissions
-- 설명: 통합 권한 카탈로그 (글로벌 + 테넌트)
-- 작성일: 2024-01-15
-- 수정일: 2025-10-27
-- =====================================================================================

CREATE TABLE IF NOT EXISTS idam.permissions
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 권한 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,                                           -- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

    -- 권한 정보
    code                        VARCHAR(100)                NOT NULL,                               -- 권한 코드 (tenant:read, system:config:write)
    name                        VARCHAR(100)                NOT NULL,                               -- 권한 명칭
    description                 TEXT,                                                               -- 권한 설명
    category                    VARCHAR(50)                 NOT NULL,                               -- 권한 카테고리 (tenant, system, billing, monitoring)

    -- 권한 레벨
    resource                    VARCHAR(50)                 NOT NULL,                               -- 리소스 타입 (tenant, system, billing)
    action                      VARCHAR(50)                 NOT NULL,                               -- 액션 (CREATE, READ, UPDATE, DELETE, LIST, MANAGE)

    -- 권한 스코프 (통합 관리의 핵심)
    scope                       VARCHAR(20)                 NOT NULL DEFAULT 'GLOBAL',              -- 권한 적용 범위 (GLOBAL, TENANT)
    applies_to                  VARCHAR(20)                 NOT NULL DEFAULT 'ALL',                 -- 적용 대상 (ALL, MASTER, TENANT, SYSTEM)

    -- 메타데이터
    is_system                   BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- 시스템 기본 권한 여부
    is_hidden                   BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- UI 표시 숨김 여부

    -- 상태 관리
    status                      VARCHAR(20)                 NOT NULL DEFAULT 'ACTIVE',              -- 권한 상태
    is_deleted                  BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- 논리적 삭제 플래그

    -- 제약조건
    CONSTRAINT uk_permissions__code        UNIQUE (code),
    CONSTRAINT ck_permissions__status      CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT ck_permissions__action      CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LIST', 'MANAGE')),
    CONSTRAINT ck_permissions__scope       CHECK (scope IN ('GLOBAL', 'TENANT')),
    CONSTRAINT ck_permissions__applies_to  CHECK (applies_to IN ('ALL', 'MASTER', 'TENANT', 'SYSTEM'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  idam.permissions                          IS '통합 권한 카탈로그 (글로벌 + 테넌트)';
COMMENT ON COLUMN idam.permissions.id                       IS '권한 고유 식별자';
COMMENT ON COLUMN idam.permissions.created_at               IS '생성일시';
COMMENT ON COLUMN idam.permissions.created_by               IS '생성자 ID';
COMMENT ON COLUMN idam.permissions.updated_at               IS '수정일시';
COMMENT ON COLUMN idam.permissions.updated_by               IS '수정자 ID';
COMMENT ON COLUMN idam.permissions.code                     IS '권한 코드 (tenant:read, system:config:write 등)';
COMMENT ON COLUMN idam.permissions.name                     IS '권한 명칭';
COMMENT ON COLUMN idam.permissions.description              IS '권한 설명';
COMMENT ON COLUMN idam.permissions.category                 IS '권한 카테고리 (tenant, system, billing, monitoring)';
COMMENT ON COLUMN idam.permissions.resource                 IS '리소스 타입 (tenant, system, billing)';
COMMENT ON COLUMN idam.permissions.action                   IS '액션 (CREATE, READ, UPDATE, DELETE, LIST, MANAGE)';
COMMENT ON COLUMN idam.permissions.scope                    IS '권한 적용 범위 (GLOBAL: 전역, TENANT: 테넌트별)';
COMMENT ON COLUMN idam.permissions.applies_to               IS '적용 대상 (ALL: 모든 사용자, MASTER: 관리자만, TENANT: 사용자만, SYSTEM: 시스템만)';
COMMENT ON COLUMN idam.permissions.is_system                IS '시스템 기본 권한 여부';
COMMENT ON COLUMN idam.permissions.is_hidden                IS 'UI 표시 숨김 여부 (내부 권한용)';
COMMENT ON COLUMN idam.permissions.status                   IS '권한 상태 (ACTIVE, INACTIVE)';
COMMENT ON COLUMN idam.permissions.is_deleted               IS '논리적 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

-- 권한 코드 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_permissions__code
    ON idam.permissions (code)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_permissions__code IS '권한 코드 조회 인덱스';

-- 카테고리별 권한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_permissions__category
    ON idam.permissions (category)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_permissions__category IS '카테고리별 권한 조회 인덱스';

-- 리소스 타입별 권한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_permissions__resource
    ON idam.permissions (resource)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_permissions__resource IS '리소스 타입별 권한 조회 인덱스';

-- 액션별 권한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_permissions__action
    ON idam.permissions (action)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_permissions__action IS '액션별 권한 조회 인덱스';

-- 스코프별 권한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_permissions__scope
    ON idam.permissions (scope)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_permissions__scope IS '스코프별 권한 조회 인덱스';

-- 적용 대상별 권한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_permissions__applies_to
    ON idam.permissions (applies_to)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_permissions__applies_to IS '적용 대상별 권한 조회 인덱스';

-- 시스템 권한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_permissions__is_system
    ON idam.permissions (is_system)
 WHERE is_system = TRUE
   AND is_deleted = FALSE;
COMMENT ON INDEX idam.ix_permissions__is_system IS '시스템 권한 조회 인덱스';

-- UI 표시용 권한 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_permissions__is_hidden
    ON idam.permissions (is_hidden)
 WHERE is_hidden = FALSE
   AND is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_permissions__is_hidden IS 'UI 표시용 권한 조회 인덱스';

-- 복합 조회용 인덱스 (카테고리 + 액션)
CREATE INDEX IF NOT EXISTS ix_permissions__category_action
    ON idam.permissions (category, action)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_permissions__category_action IS '카테고리-액션 복합 조회 인덱스';

-- 복합 조회용 인덱스 (리소스 + 액션)
CREATE INDEX IF NOT EXISTS ix_permissions__resource_action
    ON idam.permissions (resource, action)
 WHERE is_deleted = FALSE
   AND status = 'ACTIVE';
COMMENT ON INDEX idam.ix_permissions__resource_action IS '리소스-액션 복합 조회 인덱스';
