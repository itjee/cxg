-- ============================================================================
-- BKUP Schema - Executions Table
-- ============================================================================
-- Purpose: Manage backup job executions and track backup status
-- Created: 2024-10-26
-- ============================================================================

CREATE TABLE IF NOT EXISTS bkup.executions
(
    -- Basic identifier and audit fields
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- Backup target information
    backup_type                 VARCHAR(50)              NOT NULL,
    backup_tenant_id            UUID,
    backup_database             VARCHAR(100),
    backup_schema               VARCHAR(100),

    -- Backup basic information
    backup_name                 VARCHAR(200)             NOT NULL,
    backup_method               VARCHAR(50)              NOT NULL DEFAULT 'AUTOMATED',
    backup_format               VARCHAR(20)              NOT NULL DEFAULT 'COMPRESSED',

    -- Schedule related information
    schedule_id                 UUID,
    scheduled_at                TIMESTAMP WITH TIME ZONE,

    -- Execution related information
    started_at                  TIMESTAMP WITH TIME ZONE,
    completed_at                TIMESTAMP WITH TIME ZONE,
    duration                    INTEGER,

    -- Backup result information
    backup_size                 BIGINT,
    backup_file                 VARCHAR(500),
    backup_checksum             VARCHAR(255),

    -- Compression related information
    original_size               BIGINT,
    compression_rate            NUMERIC(5,2),

    -- Status and error information
    status                      VARCHAR(20)              NOT NULL DEFAULT 'PENDING',
    error_message               TEXT,
    retry_count                 INTEGER                  NOT NULL DEFAULT 0,

    -- Retention management information
    retention_days              INTEGER                  NOT NULL DEFAULT 30,
    expires_at                  TIMESTAMP WITH TIME ZONE,

    -- Logical deletion flag
    deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,

    -- Constraints
    CONSTRAINT fk_executions__backup_tenant_id
        FOREIGN KEY (backup_tenant_id) REFERENCES tnnt.tenants(id) ON DELETE CASCADE,

    CONSTRAINT ck_executions__backup_type
        CHECK (backup_type IN ('FULL_SYSTEM', 'TENANT_DATA', 'DATABASE', 'FILES', 'CONFIGURATION')),
    CONSTRAINT ck_executions__backup_method
        CHECK (backup_method IN ('AUTOMATED', 'MANUAL', 'SCHEDULED')),
    CONSTRAINT ck_executions__backup_format
        CHECK (backup_format IN ('COMPRESSED', 'UNCOMPRESSED', 'ENCRYPTED')),
    CONSTRAINT ck_executions__status
        CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED')),
    CONSTRAINT ck_executions__retry_count
        CHECK (retry_count >= 0),
    CONSTRAINT ck_executions__retention_days
        CHECK (retention_days > 0),
    CONSTRAINT ck_executions__size_consistency
        CHECK (backup_size IS NULL OR backup_size >= 0),
    CONSTRAINT ck_executions__original_size_consistency
        CHECK (original_size IS NULL OR original_size >= 0),
    CONSTRAINT ck_executions__compression_rate_range
        CHECK (compression_rate IS NULL OR (compression_rate >= 0 AND compression_rate <= 100)),
    CONSTRAINT ck_executions__execution_time_logic
        CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at)
);

-- Table comment
COMMENT ON TABLE bkup.executions
IS '백업 작업 관리 - 시스템 및 테넌트 데이터 백업 작업 실행 이력 및 상태 관리';

-- Column comments
COMMENT ON COLUMN bkup.executions.id
IS '백업 작업 고유 식별자 (UUID)';
COMMENT ON COLUMN bkup.executions.created_at
IS '백업 작업 생성 일시';
COMMENT ON COLUMN bkup.executions.created_by
IS '백업 작업 생성자 UUID (관리자 또는 시스템)';
COMMENT ON COLUMN bkup.executions.updated_at
IS '백업 작업 수정 일시';
COMMENT ON COLUMN bkup.executions.updated_by
IS '백업 작업 수정자 UUID';
COMMENT ON COLUMN bkup.executions.backup_type
IS '백업 유형 - 전체 시스템, 테넌트 데이터, 데이터베이스, 파일, 설정 중 선택';
COMMENT ON COLUMN bkup.executions.backup_tenant_id
IS '특정 테넌트 백업 대상 ID - 테넌트별 백업인 경우에만 설정';
COMMENT ON COLUMN bkup.executions.backup_database
IS '대상 데이터베이스명 - 데이터베이스 백업인 경우 대상 DB';
COMMENT ON COLUMN bkup.executions.backup_schema
IS '대상 스키마명 - 스키마 단위 백업인 경우 대상 스키마';
COMMENT ON COLUMN bkup.executions.backup_name
IS '백업 작업명 - 백업을 식별하기 위한 사용자 친화적 이름';
COMMENT ON COLUMN bkup.executions.backup_method
IS '백업 방식 - 자동, 수동, 예약 백업 중 선택';
COMMENT ON COLUMN bkup.executions.backup_format
IS '백업 형식 - 압축, 비압축, 암호화 중 선택';
COMMENT ON COLUMN bkup.executions.schedule_id
IS '백업 스케줄 참조 ID - 예약된 백업인 경우 스케줄 테이블 참조';
COMMENT ON COLUMN bkup.executions.scheduled_at
IS '예약 실행 시각 - 백업이 실행되도록 예약된 시간';
COMMENT ON COLUMN bkup.executions.started_at
IS '백업 시작 일시 - 실제 백업 작업이 시작된 시간';
COMMENT ON COLUMN bkup.executions.completed_at
IS '백업 완료 일시 - 백업 작업이 완료된 시간';
COMMENT ON COLUMN bkup.executions.duration
IS '백업 소요 시간 (초) - 시작부터 완료까지의 총 소요 시간';
COMMENT ON COLUMN bkup.executions.backup_size
IS '백업 파일 크기 (바이트) - 생성된 백업 파일의 크기';
COMMENT ON COLUMN bkup.executions.backup_file
IS '백업 파일 저장 경로 - 백업 파일이 저장된 물리적 경로';
COMMENT ON COLUMN bkup.executions.backup_checksum
IS '백업 파일 무결성 체크섬 - 파일 손상 여부 확인용 해시값';
COMMENT ON COLUMN bkup.executions.original_size
IS '원본 데이터 크기 (바이트) - 압축 전 원본 데이터의 크기';
COMMENT ON COLUMN bkup.executions.compression_rate
IS '압축률 (백분율) - 원본 대비 압축 후 크기 비율';
COMMENT ON COLUMN bkup.executions.status
IS '백업 작업 상태 - 대기, 실행중, 완료, 실패, 취소 중 하나';
COMMENT ON COLUMN bkup.executions.error_message
IS '실패 시 오류 메시지 - 백업 실패 원인에 대한 상세 설명';
COMMENT ON COLUMN bkup.executions.retry_count
IS '재시도 횟수 - 실패 후 재시도한 횟수';
COMMENT ON COLUMN bkup.executions.retention_days
IS '백업 보관 기간 (일) - 백업 파일을 보관할 일수';
COMMENT ON COLUMN bkup.executions.expires_at
IS '백업 만료 일시 - 백업이 자동 삭제될 예정 시간';
COMMENT ON COLUMN bkup.executions.deleted
IS '논리적 삭제 플래그 - 실제 삭제 대신 사용하는 소프트 딜리트';

-- ============================================================================
-- Indexes for bkup.executions
-- Purpose: Optimize backup job execution queries and monitoring
-- ============================================================================

-- Index for status-based backup job monitoring
CREATE INDEX IF NOT EXISTS ix_executions__status_monitoring
    ON bkup.executions (status, created_at DESC)
 WHERE deleted = FALSE;

-- Index for backup type analysis
CREATE INDEX IF NOT EXISTS ix_executions__type_analysis
    ON bkup.executions (backup_type, completed_at DESC, status)
 WHERE deleted = FALSE;

-- Index for tenant-based backup history
CREATE INDEX IF NOT EXISTS ix_executions__tenant_history
    ON bkup.executions (backup_tenant_id, created_at DESC)
 WHERE deleted = FALSE
   AND backup_tenant_id IS NOT NULL;

-- Index for schedule-based backup tracking
CREATE INDEX IF NOT EXISTS ix_executions__schedule_tracking
    ON bkup.executions (schedule_id, scheduled_at DESC, status)
 WHERE deleted = FALSE
   AND schedule_id IS NOT NULL;

-- Index for expiration management
CREATE INDEX IF NOT EXISTS ix_executions__expiration_management
    ON bkup.executions (expires_at, status)
 WHERE deleted = FALSE
   AND expires_at IS NOT NULL;

-- Index for performance analysis
CREATE INDEX IF NOT EXISTS ix_executions__performance_analysis
    ON bkup.executions (backup_type, duration, backup_size)
 WHERE deleted = FALSE
   AND status = 'COMPLETED';

-- Index for failure analysis
CREATE INDEX IF NOT EXISTS ix_executions__failure_analysis
    ON bkup.executions (status, retry_count, created_at DESC)
 WHERE deleted = FALSE
   AND status IN ('FAILED', 'CANCELED');

-- Index for backup method tracking
CREATE INDEX IF NOT EXISTS ix_executions__method_tracking
    ON bkup.executions (backup_method, created_at DESC, status)
 WHERE deleted = FALSE;

-- Index for creation date queries
CREATE INDEX IF NOT EXISTS ix_executions__created_at
    ON bkup.executions (created_at DESC)
 WHERE deleted = FALSE;

-- Index for currently running backups
CREATE INDEX IF NOT EXISTS ix_executions__currently_running
    ON bkup.executions (started_at DESC, backup_type)
 WHERE deleted = FALSE
   AND status = 'RUNNING';

-- ============================================================================
-- End of Executions Table
-- ============================================================================
