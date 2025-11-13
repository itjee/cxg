-- =====================================================================================
-- 테이블: sys.permission_conflict_resolution
-- 설명: 권한 충돌 해결 전략 정의 - 사용자가 여러 역할을 가질 때 권한 병합 규칙 설정
-- 작성일: 2025-10-27
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.permission_conflict_resolution
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 정책 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                -- 생성 일시
    created_by                  UUID,                                                                        -- 생성자 UUID
    updated_at                  TIMESTAMP WITH TIME ZONE,                                                    -- 수정 일시
    updated_by                  UUID,                                                                        -- 수정자 UUID

    -- 권한 충돌 해결 정책
    code                        VARCHAR(100)             NOT NULL,                                           -- 정책 코드 (예: DENY_OVERRIDE, ALLOW_UNION)
    name                        VARCHAR(200)             NOT NULL,                                           -- 정책명
    description                 TEXT,                                                                        -- 정책 설명

    -- 충돌 해결 전략
    conflict_strategy           VARCHAR(50)              NOT NULL,                                           -- 충돌 해결 전략
                                                                                                                -- DENY_OVERRIDE: 하나의 역할이라도 거부하면 거부 (AND 연산)
                                                                                                                -- ALLOW_UNION: 하나의 역할이라도 허용하면 허용 (OR 연산)
                                                                                                                -- PRIORITY_BASED: 우선순위가 높은 역할의 권한 사용
                                                                                                                -- MOST_RESTRICTIVE: 가장 제한적인 권한 사용

    -- 권한 병합 규칙
    merge_rule                  VARCHAR(50)              NOT NULL DEFAULT 'DENY_OVERRIDE',                   -- 권한 병합 규칙

    -- 다중 역할 최대 수 (성능 최적화)
    max_concurrent_roles        INTEGER,                                                                     -- 동시에 활성화될 수 있는 최대 역할 수 (NULL: 무제한)

    -- 우선순위 설정
    use_role_priority           BOOLEAN                  NOT NULL DEFAULT FALSE,                             -- 역할 우선순위 사용 여부
    priority_direction          VARCHAR(20),                                                                 -- 우선순위 방향 (ASC: 낮은 숫자 우선, DESC: 높은 숫자 우선)

    -- 예외 사항
    apply_global_rules          BOOLEAN                  NOT NULL DEFAULT TRUE,                              -- 글로벌 권한 규칙 적용 여부
    apply_to_admins             BOOLEAN                  NOT NULL DEFAULT FALSE,                             -- 관리자에게도 적용할지 여부

    -- 상태
    is_active                   BOOLEAN                  NOT NULL DEFAULT TRUE,                              -- 활성 여부
    is_system                   BOOLEAN                  NOT NULL DEFAULT FALSE,                             -- 시스템 기본 정책 여부 (수정 불가)
    is_deleted                  BOOLEAN                  NOT NULL DEFAULT FALSE,                             -- 논리 삭제 플래그

    -- 제약조건
    CONSTRAINT uk_permission_conflict_resolution__code    UNIQUE (code),
    CONSTRAINT ck_permission_conflict_resolution__strategy CHECK (
        conflict_strategy IN ('DENY_OVERRIDE', 'ALLOW_UNION', 'PRIORITY_BASED', 'MOST_RESTRICTIVE')
    ),
    CONSTRAINT ck_permission_conflict_resolution__max_roles CHECK (
        max_concurrent_roles IS NULL OR max_concurrent_roles > 0
    )
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  sys.permission_conflict_resolution
    IS '권한 충돌 해결 전략 정의 - 사용자가 여러 역할을 가질 때 권한 병합 규칙 설정';

COMMENT ON COLUMN sys.permission_conflict_resolution.id
    IS '정책 고유 식별자 (UUID)';

COMMENT ON COLUMN sys.permission_conflict_resolution.created_at
    IS '생성 일시';

COMMENT ON COLUMN sys.permission_conflict_resolution.created_by
    IS '생성자 UUID';

COMMENT ON COLUMN sys.permission_conflict_resolution.updated_at
    IS '수정 일시';

COMMENT ON COLUMN sys.permission_conflict_resolution.updated_by
    IS '수정자 UUID';

COMMENT ON COLUMN sys.permission_conflict_resolution.code
    IS '정책 코드 (예: DENY_OVERRIDE, ALLOW_UNION, PRIORITY_BASED)';

COMMENT ON COLUMN sys.permission_conflict_resolution.name
    IS '정책명';

COMMENT ON COLUMN sys.permission_conflict_resolution.description
    IS '정책 설명 및 사용 예시';

COMMENT ON COLUMN sys.permission_conflict_resolution.conflict_strategy
    IS '충돌 해결 전략 - DENY_OVERRIDE: 하나라도 거부면 거부 / ALLOW_UNION: 하나라도 허용면 허용 / PRIORITY_BASED: 우선순위 기반 / MOST_RESTRICTIVE: 가장 제한적';

COMMENT ON COLUMN sys.permission_conflict_resolution.merge_rule
    IS '권한 병합 규칙';

COMMENT ON COLUMN sys.permission_conflict_resolution.max_concurrent_roles
    IS '동시에 활성화될 수 있는 최대 역할 수 (NULL: 무제한)';

COMMENT ON COLUMN sys.permission_conflict_resolution.use_role_priority
    IS '역할 우선순위를 사용할지 여부';

COMMENT ON COLUMN sys.permission_conflict_resolution.priority_direction
    IS '우선순위 방향 (ASC: 낮은 숫자 우선, DESC: 높은 숫자 우선)';

COMMENT ON COLUMN sys.permission_conflict_resolution.apply_global_rules
    IS '글로벌 권한 규칙 적용 여부';

COMMENT ON COLUMN sys.permission_conflict_resolution.apply_to_admins
    IS '관리자에게도 규칙을 적용할지 여부';

COMMENT ON COLUMN sys.permission_conflict_resolution.is_active
    IS '활성 여부';

COMMENT ON COLUMN sys.permission_conflict_resolution.is_system
    IS '시스템 기본 정책 여부 (TRUE: 수정 불가, FALSE: 수정 가능)';

COMMENT ON COLUMN sys.permission_conflict_resolution.is_deleted
    IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

-- 정책 코드 유니크 조회
CREATE UNIQUE INDEX IF NOT EXISTS ux_permission_conflict_resolution__code
    ON sys.permission_conflict_resolution (code)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX sys.ux_permission_conflict_resolution__code IS '정책 코드 유니크 제약';

-- 활성 정책 조회
CREATE INDEX IF NOT EXISTS ix_permission_conflict_resolution__is_active
    ON sys.permission_conflict_resolution (is_active)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX sys.ix_permission_conflict_resolution__is_active IS '활성 정책 조회 인덱스';

-- 시스템 정책 조회
CREATE INDEX IF NOT EXISTS ix_permission_conflict_resolution__is_system
    ON sys.permission_conflict_resolution (is_system)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX sys.ix_permission_conflict_resolution__is_system IS '시스템 정책 조회 인덱스';

-- 전략별 조회
CREATE INDEX IF NOT EXISTS ix_permission_conflict_resolution__strategy
    ON sys.permission_conflict_resolution (conflict_strategy)
 WHERE is_active = TRUE AND is_deleted = FALSE;
COMMENT ON INDEX sys.ix_permission_conflict_resolution__strategy IS '전략별 정책 조회 인덱스';
