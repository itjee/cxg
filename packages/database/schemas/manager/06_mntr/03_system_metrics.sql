CREATE TABLE IF NOT EXISTS mntr.system_metrics
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    	-- 메트릭 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 메트릭 수집 일시
    created_by                  UUID,                                 								-- 메트릭 수집 시스템 UUID
    updated_at                  TIMESTAMP WITH TIME ZONE,                   						-- 메트릭 수정 일시
    updated_by                  UUID,                                 								-- 메트릭 수정자 UUID

	-- 메트릭 분류 및 정보
    metric_category             VARCHAR(50)              NOT NULL,                                 	-- 메트릭 분류 (PERFORMANCE/RESOURCE/BUSINESS/SECURITY)
    metric_name                 VARCHAR(100)             NOT NULL,                                 	-- 메트릭 이름 (CPU_USAGE/RESPONSE_TIME/ACTIVE_USERS 등)
    metric_value                NUMERIC(18,4)            NOT NULL,                                 	-- 측정된 메트릭 값
    metric_unit                 VARCHAR(20)              NOT NULL,                                 	-- 메트릭 단위 (PERCENT/MILLISECONDS/COUNT/BYTES)

	-- 측정 대상 정보
    service_name                VARCHAR(100),                                                      	-- 측정 대상 서비스명
    instance_id                 VARCHAR(100),                                                      	-- 인스턴스 식별자
    tenant_id                   UUID,                                                              	-- 테넌트별 메트릭인 경우 테넌트 ID

	-- 시간 정보
    measure_time            	TIMESTAMP WITH TIME ZONE NOT NULL,                                 	-- 실제 측정 시점
    summary_period          	VARCHAR(20)              DEFAULT 'MINUTE',                        	-- 집계 주기 (MINUTE/HOUR/DAY)

	-- 임계값 및 알림 정보
    warning_threshold           NUMERIC(18,4),                                                     	-- 경고 임계값
    critical_threshold          NUMERIC(18,4),                                                     	-- 위험 임계값
    alert_triggered             BOOLEAN                  DEFAULT FALSE,                           	-- 알림 발생 여부

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 메트릭 상태 (ACTIVE/INACTIVE/ARCHIVED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_system_metrics__tenant_id 			FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id)	ON DELETE CASCADE,

    CONSTRAINT ck_system_metrics__metric_category 		CHECK (metric_category IN ('PERFORMANCE', 'RESOURCE', 'BUSINESS', 'SECURITY')),
    CONSTRAINT ck_system_metrics__summary_period 		CHECK (summary_period IN ('MINUTE', 'HOUR', 'DAY')),
    CONSTRAINT ck_system_metrics__metric_unit 			CHECK (metric_unit IN ('PERCENT', 'MILLISECONDS', 'COUNT', 'BYTES', 'MBPS', 'REQUESTS_PER_SECOND')),
    CONSTRAINT ck_system_metrics__status 				CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    CONSTRAINT ck_system_metrics__metric_value 			CHECK (metric_value >= 0),
    CONSTRAINT ck_system_metrics__warning_threshold 	CHECK (warning_threshold IS NULL OR warning_threshold >= 0),
    CONSTRAINT ck_system_metrics__critical_threshold 	CHECK (critical_threshold IS NULL OR critical_threshold >= 0),
    CONSTRAINT ck_system_metrics__threshold_order 		CHECK (critical_threshold IS NULL OR warning_threshold IS NULL OR critical_threshold >= warning_threshold)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  mntr.system_metrics						IS '시스템 성능 메트릭 - 각종 시스템 지표의 시계열 데이터를 수집하여 성능 모니터링, 용량 계획, 알림 처리를 지원';
COMMENT ON COLUMN mntr.system_metrics.id 					IS '메트릭 고유 식별자 - UUID 형태의 기본키, 각 메트릭 측정 데이터를 구분하는 고유값';
COMMENT ON COLUMN mntr.system_metrics.created_at 			IS '메트릭 수집 일시 - 메트릭이 시스템에 저장된 시점의 타임스탬프';
COMMENT ON COLUMN mntr.system_metrics.created_by 			IS '메트릭 수집 시스템 UUID - 메트릭을 수집한 모니터링 시스템 또는 에이전트의 식별자';
COMMENT ON COLUMN mntr.system_metrics.updated_at 			IS '메트릭 수정 일시 - 메트릭 데이터가 수정된 시점의 타임스탬프 (재계산 시 갱신)';
COMMENT ON COLUMN mntr.system_metrics.updated_by 			IS '메트릭 수정자 UUID - 메트릭을 수정한 시스템 또는 프로세스의 식별자';
COMMENT ON COLUMN mntr.system_metrics.metric_category 		IS '메트릭 분류 - PERFORMANCE(성능), RESOURCE(리소스), BUSINESS(비즈니스), SECURITY(보안) 용도별 분류';
COMMENT ON COLUMN mntr.system_metrics.metric_name 			IS '메트릭 이름 - CPU_USAGE(CPU 사용률), RESPONSE_TIME(응답시간), ACTIVE_USERS(활성사용자), MEMORY_USAGE(메모리사용량) 등';
COMMENT ON COLUMN mntr.system_metrics.metric_value 			IS '측정된 메트릭 값 - 실제 측정된 수치 (음수 불가, 소수점 4자리까지 지원)';
COMMENT ON COLUMN mntr.system_metrics.metric_unit 			IS '메트릭 단위 - PERCENT(백분율), MILLISECONDS(밀리초), COUNT(개수), BYTES(바이트), MBPS(메가비트/초), REQUESTS_PER_SECOND(초당요청수)';
COMMENT ON COLUMN mntr.system_metrics.service_name 			IS '측정 대상 서비스명 - API(웹서비스), DATABASE(데이터베이스), REDIS(캐시), QUEUE(메시지큐) 등 서비스 구분';
COMMENT ON COLUMN mntr.system_metrics.instance_id 			IS '인스턴스 식별자 - 클러스터 환경에서 특정 인스턴스를 구분하는 식별자 (서버명, 컨테이너ID 등)';
COMMENT ON COLUMN mntr.system_metrics.tenant_id 			IS '테넌트별 메트릭인 경우 테넌트 ID - 특정 테넌트와 관련된 메트릭의 경우 해당 테넌트 식별자 (tenants 테이블 참조)';
COMMENT ON COLUMN mntr.system_metrics.measure_time 			IS '실제 측정 시점 - 메트릭이 실제로 측정된 정확한 시간 (집계 데이터의 경우 집계 기간 종료 시점)';
COMMENT ON COLUMN mntr.system_metrics.summary_period 		IS '집계 주기 - MINUTE(분별), HOUR(시간별), DAY(일별) 집계 단위 구분';
COMMENT ON COLUMN mntr.system_metrics.warning_threshold 	IS '경고 임계값 - 이 값을 초과하면 경고 알림을 발생시키는 기준값';
COMMENT ON COLUMN mntr.system_metrics.critical_threshold 	IS '위험 임계값 - 이 값을 초과하면 긴급 알림을 발생시키는 기준값 (warning_threshold보다 높음)';
COMMENT ON COLUMN mntr.system_metrics.alert_triggered 		IS '알림 발생 여부 - TRUE(임계값 초과로 알림 발생), FALSE(정상 범위), 알림 중복 방지용';
COMMENT ON COLUMN mntr.system_metrics.status 				IS '메트릭 상태 - ACTIVE(활성수집), INACTIVE(수집중단), ARCHIVED(보관용) 메트릭 수집 상태';
COMMENT ON COLUMN mntr.system_metrics.deleted 				IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 시간 기준 메트릭 조회 최적화 (가장 중요)
CREATE INDEX IF NOT EXISTS ix_system_metrics__measure_time
    ON mntr.system_metrics (measure_time DESC);

-- 분류별 메트릭 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__metric_category
    ON mntr.system_metrics (metric_category, measure_time DESC)
 WHERE deleted = FALSE;

-- 메트릭명별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__metric_name
    ON mntr.system_metrics (metric_name, measure_time DESC)
 WHERE deleted = FALSE;

-- 서비스별 메트릭 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__service_name
    ON mntr.system_metrics (service_name, measure_time DESC)
 WHERE service_name IS NOT NULL
   AND deleted = FALSE;

-- 테넌트별 메트릭 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__tenant_id
    ON mntr.system_metrics (tenant_id, measure_time DESC)
 WHERE tenant_id IS NOT NULL
   AND deleted = FALSE;

-- 인스턴스별 메트릭 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__instance_id
    ON mntr.system_metrics (instance_id, measure_time DESC)
 WHERE instance_id IS NOT NULL
   AND deleted = FALSE;

-- 집계 주기별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__summary_period
    ON mntr.system_metrics (summary_period, measure_time DESC)
 WHERE deleted = FALSE;

-- 알림 분석 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__alert_analysis
    ON mntr.system_metrics (alert_triggered, critical_threshold, warning_threshold, measure_time DESC)
 WHERE deleted = FALSE;

-- 높은 값 메트릭 분석 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__high_values
    ON mntr.system_metrics (metric_name, metric_value DESC, measure_time DESC)
 WHERE deleted = FALSE;

-- 서비스별 특정 메트릭 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__service_metric
    ON mntr.system_metrics (service_name, metric_name, measure_time DESC)
 WHERE service_name IS NOT NULL
   AND deleted = FALSE;

-- 테넌트별 분류 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__tenant_category
    ON mntr.system_metrics (tenant_id, metric_category, measure_time DESC)
 WHERE tenant_id IS NOT NULL
   AND deleted = FALSE;

-- 수집 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__created_at
    ON mntr.system_metrics (created_at DESC);

-- 일별 집계 데이터 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__daily_aggregation
    ON mntr.system_metrics (summary_period, measure_time DESC)
 WHERE summary_period = 'DAY'
   AND deleted = FALSE;

-- 성능 메트릭 조회 최적화
CREATE INDEX IF NOT EXISTS ix_system_metrics__performance_category
    ON mntr.system_metrics (metric_category, metric_name, measure_time DESC)
 WHERE metric_category = 'PERFORMANCE'
