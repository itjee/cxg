CREATE TABLE IF NOT EXISTS auto.executions
(
   id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 워크플로우 실행 고유 식별자
   created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,       -- 실행 기록 생성 일시
   created_by                  UUID,                                                              -- 실행 기록 생성자 UUID
   updated_at                  TIMESTAMP WITH TIME ZONE,                                          -- 실행 기록 수정 일시
   updated_by                  UUID,                                                              -- 실행 기록 수정자 UUID
   workflow_id                 UUID                     NOT NULL,                                 -- 실행된 워크플로우 ID
   tenant_id                   UUID,                                                              -- 테넌트별 실행 대상 ID

   -- 실행 식별 정보
   execution_id                VARCHAR(100)             UNIQUE NOT NULL,                          -- 워크플로우 실행 고유 식별자
   trigger_source              VARCHAR(100),                                                      -- 트리거 소스 (스케줄, 이벤트, 수동 등)
   triggered_by                VARCHAR(100),                                                      -- 트리거 실행자 (사용자/시스템)

   -- 입출력 데이터
   input_data                  JSONB                    DEFAULT '{}',                             -- 워크플로우 입력 데이터 (JSON)
   output_data                 JSONB                    DEFAULT '{}',                             -- 워크플로우 출력 데이터 (JSON)

   -- 실행 상태 추적
   status                      VARCHAR(20)              NOT NULL DEFAULT 'PENDING',               -- 워크플로우 실행 상태
   current_step                VARCHAR(100),                                                      -- 현재 실행 중인 워크플로우 단계
   completed_steps             TEXT[],                                                            -- 완료된 워크플로우 단계 목록
   failed_step                 VARCHAR(100),                                                      -- 실패한 워크플로우 단계명

   -- 실행 시간 정보
   started_at                  TIMESTAMP WITH TIME ZONE,                                          -- 워크플로우 실행 시작 시각
   completed_at                TIMESTAMP WITH TIME ZONE,                                          -- 워크플로우 실행 완료 시각
   duration                    INTEGER,                                                           -- 총 실행 시간 (초)

   -- 오류 및 재시도 정보
   error_message               TEXT,                                                              -- 실행 오류 메시지
   error_details               JSONB                    DEFAULT '{}',                             -- 상세 오류 정보 (JSON)
   retry_count                 INTEGER                  DEFAULT 0,                                -- 재시도 횟수

   -- 실행 로그
   execution_logs              JSONB                    DEFAULT '[]',                             -- 워크플로우 실행 로그 (JSON 배열)

   -- 리소스 사용량 통계
   cpu_usage           		   NUMERIC(18,4),                                                     -- CPU 사용 시간 (초)
   memory_usage                NUMERIC(18,4),                                                     -- 메모리 사용량 (MB)

   -- 상태 관리
   deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,                   -- 논리적 삭제 여부

   CONSTRAINT fk_executions__workflow_id       	FOREIGN KEY (workflow_id) 	REFERENCES auto.workflows(id)	ON DELETE CASCADE,
   CONSTRAINT fk_executions__tenant_id         	FOREIGN KEY (tenant_id) 	REFERENCES tnnt.tenants(id)		ON DELETE CASCADE,

   CONSTRAINT ck_executions__status       		CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED', 'TIMEOUT'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  auto.executions					IS '워크플로우 실행 이력 - 각 워크플로우 실행의 상세 기록 및 결과';
COMMENT ON COLUMN auto.executions.id                IS '워크플로우 실행 고유 식별자';
COMMENT ON COLUMN auto.executions.created_at        IS '실행 기록 생성 일시';
COMMENT ON COLUMN auto.executions.created_by        IS '실행 기록 생성자 UUID';
COMMENT ON COLUMN auto.executions.updated_at        IS '실행 기록 수정 일시';
COMMENT ON COLUMN auto.executions.updated_by        IS '실행 기록 수정자 UUID';
COMMENT ON COLUMN auto.executions.workflow_id       IS '실행된 워크플로우 ID';
COMMENT ON COLUMN auto.executions.tenant_id         IS '테넌트별 실행 대상 ID';
COMMENT ON COLUMN auto.executions.execution_id      IS '워크플로우 실행 고유 식별자 (외부 참조용)';
COMMENT ON COLUMN auto.executions.trigger_source    IS '트리거 소스 (SCHEDULED, EVENT, MANUAL, WEBHOOK)';
COMMENT ON COLUMN auto.executions.triggered_by      IS '트리거 실행자 (사용자 ID 또는 시스템명)';
COMMENT ON COLUMN auto.executions.input_data        IS '워크플로우 입력 데이터 (JSON 형태)';
COMMENT ON COLUMN auto.executions.output_data       IS '워크플로우 출력 데이터 (JSON 형태)';
COMMENT ON COLUMN auto.executions.status            IS '워크플로우 실행 상태 (PENDING, RUNNING, COMPLETED, FAILED, CANCELED, TIMEOUT)';
COMMENT ON COLUMN auto.executions.current_step      IS '현재 실행 중인 워크플로우 단계';
COMMENT ON COLUMN auto.executions.completed_steps   IS '완료된 워크플로우 단계 목록';
COMMENT ON COLUMN auto.executions.failed_step       IS '실패한 워크플로우 단계명';
COMMENT ON COLUMN auto.executions.started_at        IS '워크플로우 실행 시작 시각';
COMMENT ON COLUMN auto.executions.completed_at      IS '워크플로우 실행 완료 시각';
COMMENT ON COLUMN auto.executions.duration          IS '총 실행 시간 (초 단위)';
COMMENT ON COLUMN auto.executions.error_message     IS '실행 오류 메시지';
COMMENT ON COLUMN auto.executions.error_details     IS '상세 오류 정보 (스택 트레이스, 컨텍스트 등)';
COMMENT ON COLUMN auto.executions.retry_count       IS '재시도 횟수';
COMMENT ON COLUMN auto.executions.execution_logs    IS '워크플로우 실행 과정의 상세 로그 (JSON 배열)';
COMMENT ON COLUMN auto.executions.cpu_usage 		IS 'CPU 사용 시간 (초 단위)';
COMMENT ON COLUMN auto.executions.memory_usage   	IS '메모리 사용량 (MB 단위)';
COMMENT ON COLUMN auto.executions.deleted           IS '논리적 삭제 여부';

-- 워크플로우별 실행 이력 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__workflow_id
	ON auto.executions (workflow_id)
 WHERE deleted = FALSE;

-- 테넌트별 실행 이력 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__tenant_id
	ON auto.executions (tenant_id)
 WHERE deleted = FALSE;

-- 실행 상태별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__status
	ON auto.executions (status)
 WHERE deleted = FALSE;

-- 실행 시작 시각 기준 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__started_at
	ON auto.executions (started_at)
 WHERE deleted = FALSE;

-- 실행 완료 시각 기준 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__completed_at
	ON auto.executions (completed_at)
 WHERE deleted = FALSE;

-- 트리거 소스별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__trigger_source
	ON auto.executions (trigger_source)
 WHERE deleted = FALSE;

-- 실행 ID 검색용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__execution_id
	ON auto.executions (execution_id)
 WHERE deleted = FALSE;

-- 실패한 실행 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__failed_step
	ON auto.executions (failed_step)
 WHERE deleted = FALSE
   AND failed_step IS NOT NULL;

-- 복합 조회용 인덱스 (워크플로우 + 상태)
CREATE INDEX IF NOT EXISTS ix_executions__workflow_status
	ON auto.executions (workflow_id, status)
 WHERE deleted = FALSE;

-- 복합 조회용 인덱스 (워크플로우 + 시작시각)
CREATE INDEX IF NOT EXISTS ix_executions__workflow_started
	ON auto.executions (workflow_id, started_at)
 WHERE deleted = FALSE;

-- 재시도 횟수 기준 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__retry_count
	ON auto.executions (retry_count)
 WHERE deleted = FALSE
   AND retry_count > 0;

-- 실행 시간 통계용 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__duration
	ON auto.executions (duration)
 WHERE deleted = FALSE
   AND duration IS NOT NULL;

-- 실행 로그 검색용 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_executions__execution_logs
	ON auto.executions USING GIN (execution_logs)
 WHERE deleted = FALSE;
