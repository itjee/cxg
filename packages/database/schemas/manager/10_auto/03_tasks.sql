CREATE TABLE IF NOT EXISTS auto.tasks
(
   id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 스케줄된 작업 고유 식별자
   created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,       -- 작업 생성 일시
   created_by                  UUID,                                                              -- 작업 생성자 UUID
   updated_at                  TIMESTAMP WITH TIME ZONE,                                          -- 작업 수정 일시
   updated_by                  UUID,                                                              -- 작업 수정자 UUID

   -- 작업 기본 정보
   task_name                   VARCHAR(200)             NOT NULL,                                 -- 스케줄된 작업 이름
   task_type                   VARCHAR(50)              NOT NULL,                                 -- 작업 유형
   description                 TEXT,                                                              -- 작업 설명

   -- 스케줄 설정
   schedule_expression         VARCHAR(100)             NOT NULL,                                 -- CRON 표현식
   timezone                    VARCHAR(50)              DEFAULT 'Asia/Seoul',                     -- 실행 시간대

   -- 실행 설정
   command                     VARCHAR(1000),                                                     -- 실행할 명령어
   parameters                  JSONB                    DEFAULT '{}',                             -- 작업 실행 매개변수 (JSON)
   working_directory           VARCHAR(500),                                                      -- 작업 실행 디렉터리 경로
   environment_variables       JSONB                    DEFAULT '{}',                             -- 환경 변수 설정 (JSON)

   -- 실행 제한 설정
   max_execution_time          INTEGER                  DEFAULT 60,                               -- 최대 실행 시간 (분)
   max_instances    		   INTEGER                  DEFAULT 1,                                -- 최대 동시 실행 인스턴스 수

   -- 알림 설정
   notify_success              BOOLEAN                  DEFAULT FALSE,                            -- 성공 시 알림 여부
   notify_failure              BOOLEAN                  DEFAULT TRUE,                             -- 실패 시 알림 여부
   notify_emails               TEXT[],                                                            -- 알림 이메일 주소 목록

   -- 실행 스케줄 정보
   next_run_at                 TIMESTAMP WITH TIME ZONE,                                          -- 다음 실행 예정 시각
   last_run_at                 TIMESTAMP WITH TIME ZONE,                                          -- 마지막 실행 시각
   last_run_status             VARCHAR(20),                                                       -- 마지막 실행 상태
   last_run_duration           INTEGER,                                                           -- 마지막 실행 시간 (초)

   -- 실행 통계
   total_runs                  INTEGER                  DEFAULT 0,                                -- 총 실행 횟수
   successful_runs             INTEGER                  DEFAULT 0,                                -- 성공 실행 횟수
   failed_runs                 INTEGER                  DEFAULT 0,                                -- 실패 실행 횟수

   -- 상태 관리
   enabled                     BOOLEAN                  DEFAULT TRUE,                             -- 작업 활성화 여부
   deleted                     BOOLEAN                  DEFAULT FALSE NOT NULL,                   -- 논리적 삭제 여부

   CONSTRAINT ck_tasks__task_type       	CHECK (task_type IN ('SYSTEM_CLEANUP', 'DATA_SYNC', 'REPORT_GENERATION', 'BACKUP', 'MAINTENANCE', 'MONITORING')),
   CONSTRAINT ck_tasks__last_run_status     CHECK (last_run_status IN ('SUCCESS', 'FAILED', 'TIMEOUT', 'CANCELED'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  auto.tasks 						IS '스케줄된 작업 - 정기적으로 실행되는 시스템 작업 및 유지보수 스케줄';
COMMENT ON COLUMN auto.tasks.id                    	IS '스케줄된 작업 고유 식별자';
COMMENT ON COLUMN auto.tasks.created_at            	IS '작업 생성 일시';
COMMENT ON COLUMN auto.tasks.created_by            	IS '작업 생성자 UUID';
COMMENT ON COLUMN auto.tasks.updated_at            	IS '작업 수정 일시';
COMMENT ON COLUMN auto.tasks.updated_by            	IS '작업 수정자 UUID';
COMMENT ON COLUMN auto.tasks.task_name             	IS '스케줄된 작업 이름';
COMMENT ON COLUMN auto.tasks.task_type             	IS '작업 유형 (SYSTEM_CLEANUP, DATA_SYNC, REPORT_GENERATION, BACKUP, MAINTENANCE, MONITORING)';
COMMENT ON COLUMN auto.tasks.description           	IS '작업 설명';
COMMENT ON COLUMN auto.tasks.schedule_expression   	IS 'CRON 표현식 (예: 0 2 * * * = 매일 오전 2시)';
COMMENT ON COLUMN auto.tasks.timezone              	IS '실행 시간대 (예: Asia/Seoul)';
COMMENT ON COLUMN auto.tasks.command               	IS '실행할 명령어 또는 스크립트';
COMMENT ON COLUMN auto.tasks.parameters            	IS '작업 실행 매개변수 (JSON 형태)';
COMMENT ON COLUMN auto.tasks.working_directory     	IS '작업 실행 디렉터리 경로';
COMMENT ON COLUMN auto.tasks.environment_variables 	IS '작업 실행 시 필요한 환경 변수 (JSON 형태)';
COMMENT ON COLUMN auto.tasks.max_execution_time    	IS '최대 실행 시간 (분 단위)';
COMMENT ON COLUMN auto.tasks.max_instances 			IS '최대 동시 실행 인스턴스 수';
COMMENT ON COLUMN auto.tasks.notify_success     	IS '성공 시 알림 발송 여부';
COMMENT ON COLUMN auto.tasks.notify_failure     	IS '실패 시 알림 발송 여부';
COMMENT ON COLUMN auto.tasks.notify_emails   		IS '알림 이메일 주소 목록';
COMMENT ON COLUMN auto.tasks.next_run_at           	IS '다음 실행 예정 시각';
COMMENT ON COLUMN auto.tasks.last_run_at           	IS '마지막 실행 시각';
COMMENT ON COLUMN auto.tasks.last_run_status       	IS '마지막 실행 상태 (SUCCESS, FAILED, TIMEOUT, CANCELED)';
COMMENT ON COLUMN auto.tasks.last_run_duration     	IS '마지막 실행 시간 (초 단위)';
COMMENT ON COLUMN auto.tasks.total_runs            	IS '총 실행 횟수 (누적 통계)';
COMMENT ON COLUMN auto.tasks.successful_runs       	IS '성공 실행 횟수 (누적 통계)';
COMMENT ON COLUMN auto.tasks.failed_runs           	IS '실패 실행 횟수 (누적 통계)';
COMMENT ON COLUMN auto.tasks.enabled               	IS '작업 활성화 여부';
COMMENT ON COLUMN auto.tasks.deleted               	IS '논리적 삭제 여부';

-- 작업 이름 검색용 인덱스
CREATE INDEX ix_tasks__task_name
	ON auto.tasks (task_name)
 WHERE deleted = FALSE;

-- 작업 유형별 조회용 인덱스
CREATE INDEX ix_tasks__task_type
	ON auto.tasks (task_type)
 WHERE deleted = FALSE;

-- 활성화된 작업 조회용 인덱스
CREATE INDEX ix_tasks__enabled_deleted
	ON auto.tasks (enabled, deleted);

-- 다음 실행 시각 기준 조회용 인덱스 (스케줄러 실행 최적화)
CREATE INDEX ix_tasks__next_run_at
	ON auto.tasks (next_run_at)
 WHERE deleted = FALSE AND enabled = TRUE;

-- 마지막 실행 시각 기준 조회용 인덱스
CREATE INDEX ix_tasks__last_run_at
	ON auto.tasks (last_run_at)
 WHERE deleted = FALSE;

-- 마지막 실행 상태별 조회용 인덱스
CREATE INDEX ix_tasks__last_run_status
	ON auto.tasks (last_run_status)
 WHERE deleted = FALSE;

-- 실행 통계 조회용 인덱스 (실패율 분석)
CREATE INDEX ix_tasks__failed_runs
	ON auto.tasks (failed_runs)
 WHERE deleted = FALSE AND failed_runs > 0;

-- 스케줄 표현식 검색용 인덱스
CREATE INDEX ix_tasks__schedule_expression
	ON auto.tasks (schedule_expression)
 WHERE deleted = FALSE;

-- 시간대별 조회용 인덱스
CREATE INDEX ix_tasks__timezone
	ON auto.tasks (timezone)
 WHERE deleted = FALSE;

-- 복합 조회용 인덱스 (작업 유형 + 활성화 상태)
CREATE INDEX ix_tasks__type_enabled
	ON auto.tasks (task_type, enabled)
 WHERE deleted = FALSE;

-- 알림 설정 기준 조회용 인덱스
CREATE INDEX ix_tasks__notify_failure
	ON auto.tasks (notify_failure)
 WHERE deleted = FALSE AND notify_failure = TRUE;

-- 매개변수 검색용 GIN 인덱스
CREATE INDEX ix_tasks__parameters
	ON auto.tasks USING GIN (parameters)
 WHERE deleted = FALSE;

-- 환경변수 검색용 GIN 인덱스
CREATE INDEX ix_tasks__environment_variables
	ON auto.tasks USING GIN (environment_variables)
 WHERE deleted = FALSE;
