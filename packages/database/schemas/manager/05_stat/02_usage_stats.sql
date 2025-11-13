CREATE TABLE IF NOT EXISTS stat.usage_stats
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 사용량 요약 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 사용량 요약 생성 일시
    created_by                  UUID,                                                              	-- 사용량 요약 생성자 UUID (시스템 또는 분석 엔진)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 사용량 요약 수정 일시
    updated_by                  UUID,                                                              	-- 사용량 요약 수정자 UUID

	-- 요약 대상
    tenant_id                   UUID,                                                              	-- 테넌트 ID (NULL인 경우 전체 플랫폼 통계)

	-- 요약 기간 정보
    summary_date                DATE                     NOT NULL,                                 	-- 요약 기준일
    summary_type                VARCHAR(20)              NOT NULL,                                 	-- 요약 주기 (DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY)

	-- 사용자 통계
    total_users                 INTEGER                  DEFAULT 0,                               	-- 총 사용자 수
    active_users                INTEGER                  DEFAULT 0,                               	-- 활성 사용자 수
    new_users                   INTEGER                  DEFAULT 0,                               	-- 신규 사용자 수
    churned_users               INTEGER                  DEFAULT 0,                               	-- 이탈 사용자 수

	-- 활동 통계
    total_logins                INTEGER                  DEFAULT 0,                               	-- 총 로그인 횟수
    total_api_calls             INTEGER                  DEFAULT 0,                               	-- 총 API 호출 횟수
    total_ai_requests           INTEGER                  DEFAULT 0,                               	-- 총 AI 요청 횟수
    total_storage_used       	NUMERIC(18,4)            DEFAULT 0,                               	-- 총 스토리지 사용량 (GB)

	-- 비즈니스 통계
    revenue              		NUMERIC(18,4)            DEFAULT 0,                               	-- 매출액
    churn_rate          		NUMERIC(5,2)             DEFAULT 0,                               	-- 고객 이탈률 (%)
    acquisition_cost   			NUMERIC(18,4)            DEFAULT 0,                               	-- 고객 획득 비용 (CAC)
    lifetime_value              NUMERIC(18,4)            DEFAULT 0,                               	-- 고객 생애 가치 (CLV)

	-- 성능 통계
    avg_response_time        	NUMERIC(18,4)            DEFAULT 0,                               	-- 평균 응답 시간 (밀리초)
    error_count                 INTEGER                  DEFAULT 0,                               	-- 오류 발생 횟수
    uptime_minutes              INTEGER                  DEFAULT 0,                               	-- 정상 가동 시간 (분)
    downtime_minutes            INTEGER                  DEFAULT 0,                               	-- 장애 시간 (분)

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 요약 데이터 상태 (ACTIVE/ARCHIVED/RECALCULATING)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_usage_stats__tenant_id 				FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id)	ON DELETE CASCADE,

    CONSTRAINT ck_usage_stats__summary_type 			CHECK (summary_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY')),
    CONSTRAINT ck_usage_stats__status 					CHECK (status IN ('ACTIVE', 'ARCHIVED', 'RECALCULATING')),
    CONSTRAINT ck_usage_stats__total_users 				CHECK (total_users >= 0),
    CONSTRAINT ck_usage_stats__active_users 			CHECK (active_users >= 0),
    CONSTRAINT ck_usage_stats__new_users 				CHECK (new_users >= 0),
    CONSTRAINT ck_usage_stats__churned_users 			CHECK (churned_users >= 0),
    CONSTRAINT ck_usage_stats__total_logins 			CHECK (total_logins >= 0),
    CONSTRAINT ck_usage_stats__total_api_calls 			CHECK (total_api_calls >= 0),
    CONSTRAINT ck_usage_stats__total_ai_requests 		CHECK (total_ai_requests >= 0),
    CONSTRAINT ck_usage_stats__total_storage_used 		CHECK (total_storage_used >= 0),
    CONSTRAINT ck_usage_stats__revenue 					CHECK (revenue >= 0),
    CONSTRAINT ck_usage_stats__churn_rate 				CHECK (churn_rate >= 0 AND churn_rate <= 100),
    CONSTRAINT ck_usage_stats__acquisition_cost 		CHECK (acquisition_cost >= 0),
    CONSTRAINT ck_usage_stats__lifetime_value 			CHECK (lifetime_value >= 0),
    CONSTRAINT ck_usage_stats__avg_response_time 		CHECK (avg_response_time >= 0),
    CONSTRAINT ck_usage_stats__error_count 				CHECK (error_count >= 0),
    CONSTRAINT ck_usage_stats__uptime_minutes 			CHECK (uptime_minutes >= 0),
    CONSTRAINT ck_usage_stats__downtime_minutes 		CHECK (downtime_minutes >= 0),
    CONSTRAINT ck_usage_stats__user_logic 				CHECK (active_users <= total_users)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  stat.usage_stats						IS '사용량 요약 통계 - 주기별로 집계된 사용량, 비즈니스 지표, 성능 데이터를 통한 종합적인 서비스 운영 분석';
COMMENT ON COLUMN stat.usage_stats.id 					IS '사용량 요약 고유 식별자 - UUID 형태의 기본키, 각 요약 통계를 구분하는 고유값';
COMMENT ON COLUMN stat.usage_stats.created_at 			IS '사용량 요약 생성 일시 - 요약 데이터가 계산되고 저장된 시점의 타임스탬프';
COMMENT ON COLUMN stat.usage_stats.created_by 			IS '사용량 요약 생성자 UUID - 요약 통계를 생성한 시스템 또는 분석 엔진의 식별자';
COMMENT ON COLUMN stat.usage_stats.updated_at 			IS '사용량 요약 수정 일시 - 요약 데이터가 재계산되거나 수정된 시점의 타임스탬프';
COMMENT ON COLUMN stat.usage_stats.updated_by 			IS '사용량 요약 수정자 UUID - 요약 통계를 수정한 시스템 또는 관리자의 식별자';
COMMENT ON COLUMN stat.usage_stats.tenant_id 			IS '테넌트 ID - 요약 대상 테넌트의 고유 식별자 (NULL인 경우 전체 플랫폼 통계, tenants 테이블 참조)';
COMMENT ON COLUMN stat.usage_stats.summary_date 		IS '요약 기준일 - 통계 데이터의 기준 날짜 (일별은 해당일, 주별은 주 시작일, 월별은 월 시작일)';
COMMENT ON COLUMN stat.usage_stats.summary_type 		IS '요약 주기 - DAILY(일별), WEEKLY(주별), MONTHLY(월별), QUARTERLY(분기별), YEARLY(연별) 집계 단위';
COMMENT ON COLUMN stat.usage_stats.total_users 			IS '총 사용자 수 - 해당 기간 기준 누적된 전체 사용자 수 (탈퇴 사용자 제외)';
COMMENT ON COLUMN stat.usage_stats.active_users 		IS '활성 사용자 수 - 해당 기간 중 실제로 시스템을 사용한 사용자 수';
COMMENT ON COLUMN stat.usage_stats.new_users 			IS '신규 사용자 수 - 해당 기간 중 새로 가입한 사용자 수';
COMMENT ON COLUMN stat.usage_stats.churned_users 		IS '이탈 사용자 수 - 해당 기간 중 서비스를 중단하거나 탈퇴한 사용자 수';
COMMENT ON COLUMN stat.usage_stats.total_logins 		IS '총 로그인 횟수 - 해당 기간 중 발생한 모든 로그인 시도의 총 횟수';
COMMENT ON COLUMN stat.usage_stats.total_api_calls 		IS '총 API 호출 횟수 - 해당 기간 중 수행된 모든 API 요청의 총 횟수';
COMMENT ON COLUMN stat.usage_stats.total_ai_requests 	IS '총 AI 요청 횟수 - 해당 기간 중 AI 서비스에 대한 모든 요청의 총 횟수';
COMMENT ON COLUMN stat.usage_stats.total_storage_used 	IS '총 스토리지 사용량 - 해당 기간 말 기준 사용 중인 총 저장공간 크기 (GB 단위)';
COMMENT ON COLUMN stat.usage_stats.revenue 				IS '매출액 - 해당 기간 중 발생한 총 매출 (구독료, 사용량 기반 요금, 추가 서비스 등 포함)';
COMMENT ON COLUMN stat.usage_stats.churn_rate 			IS '고객 이탈률 - 해당 기간 중 이탈한 고객의 비율 (0-100%, 이탈고객수/전체고객수*100)';
COMMENT ON COLUMN stat.usage_stats.acquisition_cost 	IS '고객 획득 비용 - 신규 고객 한 명을 획득하는 데 소요된 평균 마케팅 비용 (CAC)';
COMMENT ON COLUMN stat.usage_stats.lifetime_value 		IS '고객 생애 가치 - 고객 한 명이 생애주기 동안 가져다줄 것으로 예상되는 총 수익 (CLV)';
COMMENT ON COLUMN stat.usage_stats.avg_response_time 	IS '평균 응답 시간 - 해당 기간 중 API 요청에 대한 평균 응답 시간 (밀리초 단위)';
COMMENT ON COLUMN stat.usage_stats.error_count 			IS '오류 발생 횟수 - 해당 기간 중 발생한 시스템 오류, API 오류 등의 총 횟수';
COMMENT ON COLUMN stat.usage_stats.uptime_minutes 		IS '정상 가동 시간 - 해당 기간 중 시스템이 정상적으로 작동한 총 시간 (분 단위)';
COMMENT ON COLUMN stat.usage_stats.downtime_minutes 	IS '장애 시간 - 해당 기간 중 시스템 장애나 점검으로 인한 서비스 중단 시간 (분 단위)';
COMMENT ON COLUMN stat.usage_stats.status 				IS '요약 데이터 상태 - ACTIVE(현재 유효), ARCHIVED(보관), RECALCULATING(재계산 중) 데이터 생명주기 관리';
COMMENT ON COLUMN stat.usage_stats.deleted 				IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 요약 기준일 조회 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__summary_date
    ON stat.usage_stats (summary_date DESC);

-- 테넌트별 요약 조회 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__tenant_id
    ON stat.usage_stats (tenant_id, summary_date DESC)
 WHERE tenant_id IS NOT NULL AND deleted = FALSE;

-- 요약 주기별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__summary_type
    ON stat.usage_stats (summary_type, summary_date DESC)
 WHERE deleted = FALSE;

-- 전체 플랫폼 통계 조회 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__platform_stats
    ON stat.usage_stats (summary_type, summary_date DESC)
 WHERE tenant_id IS NULL AND deleted = FALSE;

-- 매출 분석 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__revenue_analysis
    ON stat.usage_stats (revenue DESC, summary_date DESC)
 WHERE deleted = FALSE;

-- 사용자 성장 분석 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__user_growth
    ON stat.usage_stats (new_users DESC, active_users DESC, summary_date DESC)
 WHERE deleted = FALSE;

-- 이탈률 분석 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__churn_analysis
    ON stat.usage_stats (churn_rate DESC, churned_users DESC, summary_date DESC)
 WHERE deleted = FALSE;

-- 활동 지표 분석 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__activity_metrics
    ON stat.usage_stats (total_api_calls DESC, total_ai_requests DESC, summary_date DESC)
 WHERE deleted = FALSE;

-- 성능 지표 분석 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__performance_metrics
    ON stat.usage_stats (avg_response_time DESC, error_count DESC, summary_date DESC)
 WHERE deleted = FALSE;

-- 월별 보고서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__monthly_reports
    ON stat.usage_stats (summary_type, summary_date DESC)
 WHERE summary_type = 'MONTHLY' AND deleted = FALSE;

-- 비즈니스 지표 분석 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__business_metrics
    ON stat.usage_stats (acquisition_cost, lifetime_value, summary_date DESC)
 WHERE deleted = FALSE;

-- 테넌트별 주기 조회 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__tenant_summary_type
    ON stat.usage_stats (tenant_id, summary_type, summary_date DESC)
 WHERE deleted = FALSE;

-- 생성 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_usage_stats__created_at
    ON stat.usage_stats (created_at DESC);
