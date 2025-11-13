CREATE TABLE IF NOT EXISTS auto.workflows
(
   id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 워크플로우 고유 식별자
   created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,         -- 워크플로우 생성 일시
   created_by                  UUID,                                                              	-- 워크플로우 생성자 UUID
   updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 워크플로우 수정 일시
   updated_by                  UUID,                                                              	-- 워크플로우 수정자 UUID

   -- 워크플로우 기본 정보
   workflow_name               VARCHAR(200)             NOT NULL,                                 	-- 워크플로우 이름
   workflow_type               VARCHAR(50)              NOT NULL,                                 	-- 워크플로우 유형
   description                 TEXT,                                                              	-- 워크플로우 설명
   category                    VARCHAR(50)              NOT NULL,                                 	-- 워크플로우 카테고리

   -- 트리거 설정
   trigger_type                VARCHAR(50)              NOT NULL,                                 	-- 트리거 유형
   trigger_config              JSONB                    NOT NULL,                                 	-- 트리거 상세 설정 (JSON)

   -- 워크플로우 정의
   workflow_definition         JSONB                    NOT NULL,                                 	-- 워크플로우 단계별 작업 정의 (JSON)
   input_schema                JSONB                    DEFAULT '{}',                             	-- 입력 데이터 스키마 (JSON)
   output_schema               JSONB                    DEFAULT '{}',                             	-- 출력 데이터 스키마 (JSON)

   -- 실행 설정
   max_concurrent_executions   INTEGER                  DEFAULT 1,                                	-- 최대 동시 실행 수
   execution_timeout           INTEGER                  DEFAULT 60,                               	-- 실행 타임아웃 (분)
   retry_policy                JSONB                    DEFAULT '{}',                             	-- 재시도 정책 (JSON)

   -- 권한 설정
   required_permissions        TEXT[],                                                            	-- 필요한 권한 목록 (배열)
   execution_context           VARCHAR(50)              DEFAULT 'SYSTEM',                         	-- 실행 컨텍스트

   -- 알림 설정
   notify_success              BOOLEAN                  DEFAULT FALSE,                            	-- 성공 시 알림 여부
   notify_failure              BOOLEAN                  DEFAULT TRUE,                             	-- 실패 시 알림 여부
   notification_channels       TEXT[],                                                            	-- 알림 채널 목록 (배열)

   -- 실행 통계
   total_executions            INTEGER                  DEFAULT 0,                                	-- 총 실행 횟수
   successful_executions       INTEGER                  DEFAULT 0,                                	-- 성공 실행 횟수
   failed_executions           INTEGER                  DEFAULT 0,                                	-- 실패 실행 횟수
   last_execution_at           TIMESTAMP WITH TIME ZONE,                                          	-- 마지막 실행 시각

   -- 버전 관리
   version                     VARCHAR(20)              DEFAULT '1.0',                            	-- 워크플로우 버전
   previous_version_id         UUID,                                                              	-- 이전 버전 워크플로우 ID

   -- 상태 관리
   enabled                     BOOLEAN                  DEFAULT TRUE,                             	-- 워크플로우 활성화 여부
   deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,                   	-- 논리적 삭제 여부

   CONSTRAINT fk_workflows__previous_version_id			FOREIGN KEY (previous_version_id) REFERENCES auto.workflows(id)	ON DELETE CASCADE,

   CONSTRAINT ck_workflows__trigger_type        		CHECK (trigger_type IN ('SCHEDULED', 'EVENT_DRIVEN', 'MANUAL', 'WEBHOOK')),
   CONSTRAINT ck_workflows__workflow_type       		CHECK (workflow_type IN ('SYSTEM_MAINTENANCE', 'TENANT_PROVISIONING', 'BILLING_AUTOMATION', 'MONITORING_ALERT')),
   CONSTRAINT ck_workflows__category        			CHECK (category IN ('OPERATIONAL', 'BUSINESS', 'SECURITY', 'MAINTENANCE')),
   CONSTRAINT ck_workflows__execution_context   		CHECK (execution_context IN ('SYSTEM', 'TENANT', 'USER'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  auto.workflows 							IS '자동화 워크플로우 - 시스템 운영, 테넌트 관리 등의 자동화 프로세스 정의';
COMMENT ON COLUMN auto.workflows.id                         IS '워크플로우 고유 식별자';
COMMENT ON COLUMN auto.workflows.created_at                 IS '워크플로우 생성 일시';
COMMENT ON COLUMN auto.workflows.created_by                 IS '워크플로우 생성자 UUID';
COMMENT ON COLUMN auto.workflows.updated_at                 IS '워크플로우 수정 일시';
COMMENT ON COLUMN auto.workflows.updated_by                 IS '워크플로우 수정자 UUID';
COMMENT ON COLUMN auto.workflows.workflow_name              IS '워크플로우 이름';
COMMENT ON COLUMN auto.workflows.description                IS '워크플로우 설명';
COMMENT ON COLUMN auto.workflows.workflow_type              IS '워크플로우 유형 (SYSTEM_MAINTENANCE, TENANT_PROVISIONING, BILLING_AUTOMATION, MONITORING_ALERT)';
COMMENT ON COLUMN auto.workflows.category                   IS '워크플로우 카테고리 (OPERATIONAL, BUSINESS, SECURITY, MAINTENANCE)';
COMMENT ON COLUMN auto.workflows.trigger_type               IS '트리거 유형 (SCHEDULED, EVENT_DRIVEN, MANUAL, WEBHOOK)';
COMMENT ON COLUMN auto.workflows.trigger_config             IS '트리거 상세 설정 (스케줄, 이벤트 조건 등)';
COMMENT ON COLUMN auto.workflows.workflow_definition        IS '워크플로우 단계별 작업 정의 (JSON 형태)';
COMMENT ON COLUMN auto.workflows.input_schema               IS '입력 데이터 스키마 (JSON 형태)';
COMMENT ON COLUMN auto.workflows.output_schema              IS '출력 데이터 스키마 (JSON 형태)';
COMMENT ON COLUMN auto.workflows.max_concurrent_executions  IS '최대 동시 실행 수';
COMMENT ON COLUMN auto.workflows.execution_timeout          IS '실행 타임아웃 (분 단위)';
COMMENT ON COLUMN auto.workflows.retry_policy               IS '재시도 정책 (횟수, 간격 등)';
COMMENT ON COLUMN auto.workflows.required_permissions       IS '실행에 필요한 권한 목록';
COMMENT ON COLUMN auto.workflows.execution_context          IS '실행 컨텍스트 (SYSTEM, TENANT, USER)';
COMMENT ON COLUMN auto.workflows.notify_success           	IS '성공 시 알림 발송 여부';
COMMENT ON COLUMN auto.workflows.notify_failure           	IS '실패 시 알림 발송 여부';
COMMENT ON COLUMN auto.workflows.notification_channels      IS '알림 채널 목록 (이메일, 슬랙 등)';
COMMENT ON COLUMN auto.workflows.total_executions           IS '총 실행 횟수 (누적 통계)';
COMMENT ON COLUMN auto.workflows.successful_executions      IS '성공 실행 횟수 (누적 통계)';
COMMENT ON COLUMN auto.workflows.failed_executions          IS '실패 실행 횟수 (누적 통계)';
COMMENT ON COLUMN auto.workflows.last_execution_at          IS '마지막 실행 시각';
COMMENT ON COLUMN auto.workflows.version                    IS '워크플로우 버전';
COMMENT ON COLUMN auto.workflows.previous_version_id        IS '이전 버전 워크플로우 참조 ID';
COMMENT ON COLUMN auto.workflows.enabled                    IS '워크플로우 활성화 여부';
COMMENT ON COLUMN auto.workflows.deleted                    IS '논리적 삭제 여부';

-- 워크플로우 이름 검색용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__workflow_name
	ON auto.workflows (workflow_name)
 WHERE deleted = FALSE;

-- 워크플로우 유형별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__workflow_type
	ON auto.workflows (workflow_type)
 WHERE deleted = FALSE;

-- 워크플로우 카테고리별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__category
	ON auto.workflows (category)
 WHERE deleted = FALSE;

-- 트리거 유형별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__trigger_type
	ON auto.workflows (trigger_type)
 WHERE deleted = FALSE;

-- 활성화된 워크플로우 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__enabled_deleted
	ON auto.workflows (enabled, deleted);

-- 실행 컨텍스트별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__execution_context
	ON auto.workflows (execution_context)
 WHERE deleted = FALSE;

-- 마지막 실행 시각 기준 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__last_execution_at
	ON auto.workflows (last_execution_at)
 WHERE deleted = FALSE;

-- 버전 관리용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__version
	ON auto.workflows (version)
 WHERE deleted = FALSE;

-- 이전 버전 참조용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__previous_version_id
	ON auto.workflows (previous_version_id)
 WHERE deleted = FALSE;

-- 복합 조회용 인덱스 (카테고리 + 트리거 유형)
CREATE INDEX IF NOT EXISTS ix_workflows__category_trigger_type
	ON auto.workflows (category, trigger_type)
 WHERE deleted = FALSE;

-- 알림 설정 기준 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__notify_failure
	ON auto.workflows (notify_failure)
 WHERE deleted = FALSE
   AND notify_failure = TRUE;

-- 트리거 설정 검색용 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_workflows__trigger_config
	ON auto.workflows USING GIN (trigger_config)
 WHERE deleted = FALSE;
