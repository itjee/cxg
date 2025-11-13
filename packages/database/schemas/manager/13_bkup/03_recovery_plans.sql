-- ============================================================================
-- BKUP Schema - Recovery Plans Table
-- ============================================================================
-- Purpose: Define disaster recovery plans with RTO/RPO objectives and procedures
-- Created: 2024-10-26
-- ============================================================================

CREATE TABLE IF NOT EXISTS bkup.recovery_plans
(
    -- Basic identifier and audit fields
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- Plan basic information
    plan_name                   VARCHAR(200)             NOT NULL,
    plan_type                   VARCHAR(50)              NOT NULL,
    description                 TEXT,

    -- Recovery target settings
    recovery_scope              VARCHAR(50)              NOT NULL,
    target_services             TEXT[],
    target_tenants              UUID[],

    -- Recovery objectives
    recovery_time               INTEGER                  NOT NULL,
    recovery_point              INTEGER                  NOT NULL,

    -- Recovery procedure definition
    recovery_steps              JSONB                    NOT NULL,
    automated_steps             JSONB                    NOT NULL DEFAULT '[]',
    manual_steps                JSONB                    NOT NULL DEFAULT '[]',

    -- Backup requirements
    required_backup_types       TEXT[],
    minimum_backup_age          INTEGER                  NOT NULL DEFAULT 24,

    -- Test management information
    last_tested_at              TIMESTAMP WITH TIME ZONE,
    test_frequency_days         INTEGER                  NOT NULL DEFAULT 90,
    test_results                JSONB                    NOT NULL DEFAULT '{}',

    -- Contact information
    primary_contact             VARCHAR(100),
    secondary_contact           VARCHAR(100),
    escalation_contacts         TEXT[],

    -- Approval management information
    approved_by                 VARCHAR(100),
    approved_at                 TIMESTAMP WITH TIME ZONE,

    -- Status management
    status                      VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',

    -- Logical deletion flag
    deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,

    -- Constraints
    CONSTRAINT ck_recovery_plans__plan_type
        CHECK (plan_type IN ('FULL_RECOVERY', 'PARTIAL_RECOVERY', 'TENANT_RECOVERY')),
    CONSTRAINT ck_recovery_plans__recovery_scope
        CHECK (recovery_scope IN ('ALL_SYSTEMS', 'SPECIFIC_SERVICES', 'TENANT_DATA')),
    CONSTRAINT ck_recovery_plans__status
        CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ARCHIVED')),
    CONSTRAINT ck_recovery_plans__recovery_time_positive
        CHECK (recovery_time > 0),
    CONSTRAINT ck_recovery_plans__recovery_point_positive
        CHECK (recovery_point >= 0),
    CONSTRAINT ck_recovery_plans__test_frequency_positive
        CHECK (test_frequency_days > 0),
    CONSTRAINT ck_recovery_plans__backup_age_positive
        CHECK (minimum_backup_age > 0),
    CONSTRAINT ck_recovery_plans__rto_rpo_logic
        CHECK (recovery_time >= recovery_point)
);

-- Table comment
COMMENT ON TABLE  bkup.recovery_plans
IS '재해복구 계획 - 시스템 장애 및 재해 상황에서의 복구 절차와 목표 정의';

-- Column comments
COMMENT ON COLUMN bkup.recovery_plans.id
IS '복구 계획 고유 식별자 (UUID)';
COMMENT ON COLUMN bkup.recovery_plans.created_at
IS '계획 생성 일시';
COMMENT ON COLUMN bkup.recovery_plans.created_by
IS '계획 생성자 UUID (IT 관리자 또는 시스템)';
COMMENT ON COLUMN bkup.recovery_plans.updated_at
IS '계획 수정 일시';
COMMENT ON COLUMN bkup.recovery_plans.updated_by
IS '계획 수정자 UUID';
COMMENT ON COLUMN bkup.recovery_plans.plan_name
IS '복구 계획명 - 계획을 식별하기 위한 이름';
COMMENT ON COLUMN bkup.recovery_plans.description
IS '계획 상세 설명 - 계획의 목적과 적용 범위에 대한 설명';
COMMENT ON COLUMN bkup.recovery_plans.plan_type
IS '계획 유형 - 전체 복구, 부분 복구, 테넌트 복구 중 선택';
COMMENT ON COLUMN bkup.recovery_plans.recovery_scope
IS '복구 범위 - 전체 시스템, 특정 서비스, 테넌트 데이터 중 선택';
COMMENT ON COLUMN bkup.recovery_plans.target_services
IS '복구 대상 서비스 목록 - 복구할 서비스명 배열';
COMMENT ON COLUMN bkup.recovery_plans.target_tenants
IS '복구 대상 테넌트 ID 목록 - 테넌트별 복구 시 대상 테넌트들';
COMMENT ON COLUMN bkup.recovery_plans.recovery_time
IS 'RTO (복구 목표 시간) - 서비스 복구까지 허용되는 최대 시간 (분)';
COMMENT ON COLUMN bkup.recovery_plans.recovery_point
IS 'RPO (복구 목표 시점) - 허용 가능한 최대 데이터 손실 시간 (분)';
COMMENT ON COLUMN bkup.recovery_plans.recovery_steps
IS '전체 복구 단계별 절차 - JSON 형태의 상세 복구 절차';
COMMENT ON COLUMN bkup.recovery_plans.automated_steps
IS '자동화된 복구 단계 - 시스템이 자동으로 수행할 복구 작업';
COMMENT ON COLUMN bkup.recovery_plans.manual_steps
IS '수동 복구 단계 - 담당자가 직접 수행해야 할 복구 작업';
COMMENT ON COLUMN bkup.recovery_plans.required_backup_types
IS '필요한 백업 유형 목록 - 복구에 필요한 백업의 종류들';
COMMENT ON COLUMN bkup.recovery_plans.minimum_backup_age
IS '최소 백업 보관 시간 (시간) - 복구에 필요한 백업의 최소 보관 기간';
COMMENT ON COLUMN bkup.recovery_plans.last_tested_at
IS '마지막 테스트 실행 일시 - 가장 최근에 DR 테스트를 수행한 시간';
COMMENT ON COLUMN bkup.recovery_plans.test_frequency_days
IS '테스트 주기 (일) - DR 계획을 테스트해야 하는 주기';
COMMENT ON COLUMN bkup.recovery_plans.test_results
IS '마지막 테스트 결과 - JSON 형태의 테스트 결과 및 개선사항';
COMMENT ON COLUMN bkup.recovery_plans.primary_contact
IS '1차 담당자 연락처 - 재해 상황 시 1차 연락할 담당자';
COMMENT ON COLUMN bkup.recovery_plans.secondary_contact
IS '2차 담당자 연락처 - 1차 담당자 연락 불가 시 연락할 담당자';
COMMENT ON COLUMN bkup.recovery_plans.escalation_contacts
IS '에스컬레이션 담당자 목록 - 심각한 상황 시 연락할 상급자들';
COMMENT ON COLUMN bkup.recovery_plans.approved_by
IS '계획 승인자 - DR 계획을 최종 승인한 관리자';
COMMENT ON COLUMN bkup.recovery_plans.approved_at
IS '계획 승인 일시 - DR 계획이 승인된 시간';
COMMENT ON COLUMN bkup.recovery_plans.status
IS '계획 상태 - 초안, 승인대기, 승인완료, 보관 중 하나';
COMMENT ON COLUMN bkup.recovery_plans.deleted
IS '논리적 삭제 플래그 - 실제 삭제 대신 사용하는 소프트 딜리트';

-- ============================================================================
-- Indexes for bkup.recovery_plans
-- Purpose: Optimize recovery plan queries and compliance management
-- ============================================================================

-- Index for active approved plans
CREATE INDEX IF NOT EXISTS ix_recovery_plans__active_plans
    ON bkup.recovery_plans (status, plan_type)
 WHERE deleted = FALSE
   AND status = 'APPROVED';

-- Index for plan type management
CREATE INDEX IF NOT EXISTS ix_recovery_plans__plan_type_management
    ON bkup.recovery_plans (plan_type, recovery_scope, status)
 WHERE deleted = FALSE;

-- Index for RTO/RPO-based queries
CREATE INDEX IF NOT EXISTS ix_recovery_plans__recovery_objectives
    ON bkup.recovery_plans (recovery_time, recovery_point, plan_type)
 WHERE deleted = FALSE
   AND status = 'APPROVED';

-- Index for test management
CREATE INDEX IF NOT EXISTS ix_recovery_plans__test_management
    ON bkup.recovery_plans (last_tested_at, test_frequency_days)
 WHERE deleted = FALSE
   AND status = 'APPROVED';

-- Index for approval-pending plans
CREATE INDEX IF NOT EXISTS ix_recovery_plans__approval_pending
    ON bkup.recovery_plans (status, created_at DESC)
 WHERE deleted = FALSE
   AND status IN ('DRAFT', 'PENDING_APPROVAL');

-- Index for approval history
CREATE INDEX IF NOT EXISTS ix_recovery_plans__approval_history
    ON bkup.recovery_plans (approved_by, approved_at DESC)
 WHERE deleted = FALSE
   AND approved_by IS NOT NULL;

-- Index for recovery scope queries
CREATE INDEX IF NOT EXISTS ix_recovery_plans__recovery_scope
    ON bkup.recovery_plans (recovery_scope, status)
 WHERE deleted = FALSE;

-- Index for creation date queries
CREATE INDEX IF NOT EXISTS ix_recovery_plans__created_at
    ON bkup.recovery_plans (created_at DESC)
 WHERE deleted = FALSE;

-- Index for plan name search
CREATE INDEX IF NOT EXISTS ix_recovery_plans__plan_name
    ON bkup.recovery_plans (plan_name)
 WHERE deleted = FALSE;

-- GIN Index for target services search
CREATE INDEX IF NOT EXISTS ix_recovery_plans__target_services_gin
    ON bkup.recovery_plans USING GIN (target_services)
 WHERE deleted = FALSE
   AND target_services IS NOT NULL;

-- GIN Index for target tenants search
CREATE INDEX IF NOT EXISTS ix_recovery_plans__target_tenants_gin
    ON bkup.recovery_plans USING GIN (target_tenants)
 WHERE deleted = FALSE
   AND target_tenants IS NOT NULL;

-- GIN Index for required backup types search
CREATE INDEX IF NOT EXISTS ix_recovery_plans__backup_types_gin
    ON bkup.recovery_plans USING GIN (required_backup_types)
 WHERE deleted = FALSE
   AND required_backup_types IS NOT NULL;

-- GIN Index for escalation contacts search
CREATE INDEX IF NOT EXISTS ix_recovery_plans__escalation_contacts_gin
    ON bkup.recovery_plans USING GIN (escalation_contacts)
 WHERE deleted = FALSE
   AND escalation_contacts IS NOT NULL;

-- GIN Index for recovery steps search
CREATE INDEX IF NOT EXISTS ix_recovery_plans__recovery_steps_gin
    ON bkup.recovery_plans USING GIN (recovery_steps)
 WHERE deleted = FALSE;

-- GIN Index for test results search
CREATE INDEX IF NOT EXISTS ix_recovery_plans__test_results_gin
    ON bkup.recovery_plans USING GIN (test_results)
 WHERE deleted = FALSE
   AND test_results != '{}';

-- ============================================================================
-- End of Recovery Plans Table
-- ============================================================================
