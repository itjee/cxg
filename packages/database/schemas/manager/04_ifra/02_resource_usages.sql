CREATE TABLE IF NOT EXISTS ifra.resource_usages
(
    -- 기본 식별자 및 감사 필드
    id                  		UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    	-- 메트릭 고유 식별자 (UUID)
    created_at          		TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                   	-- 메트릭 등록 일시
    created_by          		UUID,                                 								-- 메트릭 수집 시스템 UUID
    updated_at          		TIMESTAMP WITH TIME ZONE,                   						-- 메트릭 수정 일시
    updated_by          		UUID,                                 								-- 메트릭 수정 시스템 UUID

	-- 리소스 연결
    resource_id         		UUID                     NOT NULL,                                 	-- 대상 리소스 ID (resources 참조)
    tenant_id           		UUID,                                                              	-- 테넌트 ID (공통 리소스의 경우 NULL)

	-- 메트릭 정보
    metric_name         		VARCHAR(50)              NOT NULL,                                 	-- 메트릭 이름 (CPU_UTILIZATION/MEMORY_USAGE/DISK_USAGE/NETWORK_IN/NETWORK_OUT)
    metric_value        		NUMERIC(18,4)            NOT NULL,                                 	-- 메트릭 측정값
    metric_unit        	 		VARCHAR(20)              NOT NULL,                                 	-- 메트릭 단위 (PERCENT/BYTES/COUNT/MBPS)

	-- 시간 정보
    measure_time    			TIMESTAMP WITH TIME ZONE NOT NULL,                                 	-- 실제 측정 시점
    summary_period  			VARCHAR(20)              NOT NULL DEFAULT 'HOURLY',              	-- 집계 주기 (MINUTE/HOURLY/DAILY/MONTHLY)

	-- 제약조건
    CONSTRAINT fk_resource_usages__resource_id 			FOREIGN KEY (resource_id) 	REFERENCES ifra.resources(id)	ON DELETE CASCADE,
    CONSTRAINT fk_resource_usages__tenant_id 			FOREIGN KEY (tenant_id) 	REFERENCES tnnt.tenants(id)		ON DELETE CASCADE,

    CONSTRAINT ck_resource_usages__summary_period 		CHECK (summary_period IN ('MINUTE', 'HOURLY', 'DAILY', 'MONTHLY')),
    CONSTRAINT ck_resource_usages__metric_name 			CHECK (metric_name IN ('CPU_UTILIZATION', 'MEMORY_USAGE', 'DISK_USAGE', 'NETWORK_IN', 'NETWORK_OUT', 'IOPS', 'LATENCY')),
    CONSTRAINT ck_resource_usages__metric_unit 			CHECK (metric_unit IN ('PERCENT', 'BYTES', 'COUNT', 'MBPS', 'MILLISECONDS')),
    CONSTRAINT ck_resource_usages__metric_value 		CHECK (metric_value >= 0)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  ifra.resource_usages					IS '리소스 사용량 메트릭 - 인프라 리소스의 실시간 및 집계된 사용량 데이터를 저장하여 모니터링, 알람, 용량 계획에 활용';
COMMENT ON COLUMN ifra.resource_usages.id 				IS '메트릭 고유 식별자 - UUID 형태의 기본키, 각 메트릭 데이터 포인트를 구분하는 고유값';
COMMENT ON COLUMN ifra.resource_usages.created_at 		IS '메트릭 등록 일시 - 메트릭 데이터가 시스템에 저장된 시점의 타임스탬프';
COMMENT ON COLUMN ifra.resource_usages.created_by 		IS '메트릭 수집 시스템 UUID - 메트릭을 수집한 모니터링 시스템 또는 에이전트의 식별자';
COMMENT ON COLUMN ifra.resource_usages.updated_at 		IS '메트릭 수정 일시 - 메트릭 데이터가 최종 수정된 시점의 타임스탬프 (재계산 시 갱신)';
COMMENT ON COLUMN ifra.resource_usages.updated_by 		IS '메트릭 수정 시스템 UUID - 메트릭을 최종 수정한 시스템 또는 프로세스의 식별자';
COMMENT ON COLUMN ifra.resource_usages.resource_id 		IS '대상 리소스 ID - 메트릭이 수집된 인프라 리소스의 고유 식별자 (resources 테이블 참조)';
COMMENT ON COLUMN ifra.resource_usages.tenant_id 		IS '테넌트 ID - 리소스를 사용하는 테넌트의 식별자 (공통 리소스의 경우 NULL, tenants 테이블 참조)';
COMMENT ON COLUMN ifra.resource_usages.metric_name 		IS '메트릭 이름 - CPU_UTILIZATION(CPU 사용률), MEMORY_USAGE(메모리 사용량), DISK_USAGE(디스크 사용량), NETWORK_IN/OUT(네트워크 입출력), IOPS, LATENCY';
COMMENT ON COLUMN ifra.resource_usages.metric_value 	IS '메트릭 측정값 - 실제 측정된 수치 (음수 불가, 소수점 4자리까지 지원)';
COMMENT ON COLUMN ifra.resource_usages.metric_unit 		IS '메트릭 단위 - PERCENT(백분율), BYTES(바이트), COUNT(개수), MBPS(메가비트/초), MILLISECONDS(밀리초)';
COMMENT ON COLUMN ifra.resource_usages.measure_time 	IS '실제 측정 시점 - 메트릭이 실제로 측정된 정확한 시간 (집계 데이터의 경우 집계 기간 종료 시점)';
COMMENT ON COLUMN ifra.resource_usages.summary_period 	IS '집계 주기 - MINUTE(분별), HOURLY(시간별), DAILY(일별), MONTHLY(월별) 집계 단위';

-- 인덱스 생성
-- 리소스별 메트릭 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__resource_id
    ON ifra.resource_usages (resource_id);

-- 테넌트별 사용량 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__tenant_id
    ON ifra.resource_usages (tenant_id)
 WHERE tenant_id IS NOT NULL;

-- 메트릭 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__metric_name
    ON ifra.resource_usages (metric_name);

-- 시계열 데이터 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__measure_time
    ON ifra.resource_usages (measure_time DESC);

-- 집계 주기별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__summary_period
    ON ifra.resource_usages (summary_period);

-- 리소스별 특정 메트릭 시계열 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__resource_metric_time
    ON ifra.resource_usages (resource_id, metric_name, measure_time DESC);

-- 테넌트별 메트릭 시계열 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__tenant_metric_time
    ON ifra.resource_usages (tenant_id, metric_name, measure_time DESC)
 WHERE tenant_id IS NOT NULL;

-- 높은 사용률 메트릭 조회 최적화 (알람용)
CREATE INDEX IF NOT EXISTS ix_resource_usages__high_usage
    ON ifra.resource_usages (metric_name, metric_value DESC, measure_time DESC);

-- 일별 집계 데이터 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__daily_aggregation
    ON ifra.resource_usages (summary_period, measure_time DESC)
 WHERE summary_period = 'DAILY';

-- 시간별 집계 데이터 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__hourly_aggregation
    ON ifra.resource_usages (summary_period, measure_time DESC)
 WHERE summary_period = 'HOURLY';

-- 최신 수집 메트릭 조회 최적화
CREATE INDEX IF NOT EXISTS ix_resource_usages__created_at
    ON ifra.resource_usages (created_at DESC);
