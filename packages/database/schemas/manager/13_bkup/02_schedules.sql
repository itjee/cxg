-- ============================================================================
-- BKUP Schema - Schedules Table
-- ============================================================================
-- Purpose: Define backup schedules for automated periodic backup execution
-- Created: 2024-10-26
-- ============================================================================

CREATE TABLE IF NOT EXISTS bkup.schedules
(
    -- Basic identifier and audit fields
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- Schedule basic information
    schedule_name               VARCHAR(200)             NOT NULL,
    backup_type                 VARCHAR(50)              NOT NULL,

    -- Backup target settings
    target_scope                VARCHAR(50)              NOT NULL DEFAULT 'ALL_TENANTS',
    target_tenants              UUID[],
    target_databases            TEXT[],

    -- Schedule execution settings
    frequency                   VARCHAR(20)              NOT NULL,
    schedule_time               TIME                     NOT NULL,
    schedule_days               INTEGER[],
    timezone                    VARCHAR(50)              NOT NULL DEFAULT 'Asia/Seoul',

    -- Backup option settings
    backup_format               VARCHAR(20)              NOT NULL DEFAULT 'COMPRESSED',
    retention_days              INTEGER                  NOT NULL DEFAULT 30,
    max_parallel_jobs           INTEGER                  NOT NULL DEFAULT 1,

    -- Notification settings
    notify_success              BOOLEAN                  NOT NULL DEFAULT FALSE,
    notify_failure              BOOLEAN                  NOT NULL DEFAULT TRUE,
    notify_emails               TEXT[],

    -- Execution history information
    next_run_at                 TIMESTAMP WITH TIME ZONE,
    last_run_at                 TIMESTAMP WITH TIME ZONE,

    -- Schedule status management
    enabled                     BOOLEAN                  NOT NULL DEFAULT TRUE,

    -- Logical deletion flag
    deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,

    -- Constraints
    CONSTRAINT ck_schedules__backup_type
        CHECK (backup_type IN ('FULL_SYSTEM', 'TENANT_DATA', 'DATABASE', 'FILES', 'CONFIGURATION')),
    CONSTRAINT ck_schedules__frequency
        CHECK (frequency IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY')),
    CONSTRAINT ck_schedules__target_scope
        CHECK (target_scope IN ('ALL_TENANTS', 'SPECIFIC_TENANTS', 'SYSTEM_ONLY')),
    CONSTRAINT ck_schedules__retention_days
        CHECK (retention_days > 0),
    CONSTRAINT ck_schedules__max_parallel_jobs
        CHECK (max_parallel_jobs > 0),
    CONSTRAINT ck_schedules__backup_format
        CHECK (backup_format IN ('COMPRESSED', 'UNCOMPRESSED', 'ENCRYPTED'))
);

-- Table comment
COMMENT ON TABLE  bkup.schedules
IS '백업 스케줄 정의 - 자동 백업 작업의 주기적 실행 설정 및 관리';

-- Column comments
COMMENT ON COLUMN bkup.schedules.id
IS '백업 스케줄 고유 식별자 (UUID)';
COMMENT ON COLUMN bkup.schedules.created_at
IS '스케줄 생성 일시';
COMMENT ON COLUMN bkup.schedules.created_by
IS '스케줄 생성자 UUID (관리자 또는 시스템)';
COMMENT ON COLUMN bkup.schedules.updated_at
IS '스케줄 수정 일시';
COMMENT ON COLUMN bkup.schedules.updated_by
IS '스케줄 수정자 UUID';
COMMENT ON COLUMN bkup.schedules.schedule_name
IS '스케줄 이름 - 관리자가 식별하기 위한 친숙한 이름';
COMMENT ON COLUMN bkup.schedules.backup_type
IS '백업 유형 - 전체 시스템, 테넌트 데이터, 데이터베이스, 파일 중 선택';
COMMENT ON COLUMN bkup.schedules.target_scope
IS '백업 대상 범위 - 모든 테넌트, 특정 테넌트, 시스템만 중 선택';
COMMENT ON COLUMN bkup.schedules.target_tenants
IS '특정 테넌트 대상 ID 배열 - target_scope가 SPECIFIC_TENANTS인 경우 사용';
COMMENT ON COLUMN bkup.schedules.target_databases
IS '대상 데이터베이스 목록 - 백업할 데이터베이스명 배열';
COMMENT ON COLUMN bkup.schedules.frequency
IS '실행 주기 - 일간, 주간, 월간, 분기별 중 선택';
COMMENT ON COLUMN bkup.schedules.schedule_time
IS '실행 시각 - 백업이 실행될 시간 (HH:MM 형식)';
COMMENT ON COLUMN bkup.schedules.schedule_days
IS '실행 요일 또는 날짜 배열 - 주간(1-7), 월간(1-31) 실행 날짜';
COMMENT ON COLUMN bkup.schedules.timezone
IS '시간대 설정 - 스케줄 실행 시 적용할 시간대';
COMMENT ON COLUMN bkup.schedules.backup_format
IS '백업 형식 - 압축, 비압축, 암호화 중 선택';
COMMENT ON COLUMN bkup.schedules.retention_days
IS '백업 보관 기간 (일) - 백업 파일을 보관할 일수';
COMMENT ON COLUMN bkup.schedules.max_parallel_jobs
IS '동시 실행 가능한 백업 작업 수 - 병렬 처리 제한';
COMMENT ON COLUMN bkup.schedules.notify_success
IS '성공 시 알림 여부 - 백업 성공 시 이메일 알림 발송';
COMMENT ON COLUMN bkup.schedules.notify_failure
IS '실패 시 알림 여부 - 백업 실패 시 이메일 알림 발송';
COMMENT ON COLUMN bkup.schedules.notify_emails
IS '알림 받을 이메일 목록 - 백업 결과 통지를 받을 이메일 주소들';
COMMENT ON COLUMN bkup.schedules.next_run_at
IS '다음 실행 예정 시각 - 스케줄에 따른 다음 백업 실행 시간';
COMMENT ON COLUMN bkup.schedules.last_run_at
IS '마지막 실행 시각 - 가장 최근에 스케줄이 실행된 시간';
COMMENT ON COLUMN bkup.schedules.enabled
IS '스케줄 활성화 여부 - 스케줄의 활성/비활성 상태';
COMMENT ON COLUMN bkup.schedules.deleted
IS '논리적 삭제 플래그 - 실제 삭제 대신 사용하는 소프트 딜리트';

-- ============================================================================
-- Indexes for bkup.schedules
-- Purpose: Optimize scheduler-related queries and monitoring
-- ============================================================================

-- Index for active schedule queries
CREATE INDEX IF NOT EXISTS ix_schedules__active_schedules
    ON bkup.schedules (enabled, next_run_at)
 WHERE deleted = FALSE
   AND enabled = TRUE;

-- Index for next execution time queries
CREATE INDEX IF NOT EXISTS ix_schedules__next_execution
    ON bkup.schedules (next_run_at ASC, backup_type)
 WHERE deleted = FALSE
   AND enabled = TRUE
   AND next_run_at IS NOT NULL;

-- Index for backup type management
CREATE INDEX IF NOT EXISTS ix_schedules__type_management
    ON bkup.schedules (backup_type, frequency, enabled)
 WHERE deleted = FALSE;

-- Index for frequency-based analysis
CREATE INDEX IF NOT EXISTS ix_schedules__frequency_analysis
    ON bkup.schedules (frequency, schedule_time, timezone)
 WHERE deleted = FALSE
   AND enabled = TRUE;

-- Index for target scope management
CREATE INDEX IF NOT EXISTS ix_schedules__target_scope
    ON bkup.schedules (target_scope, backup_type)
 WHERE deleted = FALSE;

-- Index for execution history queries
CREATE INDEX IF NOT EXISTS ix_schedules__execution_history
    ON bkup.schedules (last_run_at DESC, backup_type)
 WHERE deleted = FALSE;

-- Index for notification management
CREATE INDEX IF NOT EXISTS ix_schedules__notification_management
    ON bkup.schedules (notify_failure, notify_success)
 WHERE deleted = FALSE
   AND (notify_failure = TRUE OR notify_success = TRUE);

-- Index for creation date queries
CREATE INDEX IF NOT EXISTS ix_schedules__created_at
    ON bkup.schedules (created_at DESC)
 WHERE deleted = FALSE;

-- Index for schedule name search
CREATE INDEX IF NOT EXISTS ix_schedules__schedule_name
    ON bkup.schedules (schedule_name)
 WHERE deleted = FALSE;

-- GIN Index for specific tenant targets
CREATE INDEX IF NOT EXISTS ix_schedules__target_tenants_gin
    ON bkup.schedules USING GIN (target_tenants)
 WHERE deleted = FALSE
   AND target_scope = 'SPECIFIC_TENANTS';

-- GIN Index for target databases search
CREATE INDEX IF NOT EXISTS ix_schedules__target_databases_gin
    ON bkup.schedules USING GIN (target_databases)
 WHERE deleted = FALSE
   AND target_databases IS NOT NULL;

-- GIN Index for notification emails search
CREATE INDEX IF NOT EXISTS ix_schedules__notify_emails_gin
    ON bkup.schedules USING GIN (notify_emails)
 WHERE deleted = FALSE
   AND notify_emails IS NOT NULL;

-- ============================================================================
-- End of Schedules Table
-- ============================================================================
