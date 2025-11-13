CREATE TABLE IF NOT EXISTS cnfg.service_quotas
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 서비스 할당량 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 할당량 설정 생성 일시
    created_by                  UUID,                                                              	-- 할당량 설정 생성자 UUID (관리자)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 할당량 설정 수정 일시
    updated_by                  UUID,                                                              	-- 할당량 설정 수정자 UUID
    -- 테넌트 연결
    tenant_id                   UUID                     NOT NULL,                                 	-- 할당량 적용 대상 테넌트 ID
    -- 할당량 기본 정보
    quota_type                  VARCHAR(50)              NOT NULL,                                 	-- 할당량 유형 (USERS/STORAGE/API_CALLS/AI_REQUESTS/WORKFLOWS/DOCUMENTS)
    quota_limit                 INTEGER                  NOT NULL,                                 	-- 할당량 한도 (최대 허용량)
    quota_used                  INTEGER                  DEFAULT 0,                               	-- 현재 사용량
    quota_period                VARCHAR(20)              NOT NULL DEFAULT 'MONTHLY',              	-- 할당량 적용 기간 (DAILY/WEEKLY/MONTHLY/YEARLY)
    -- 할당량 적용 기간
    start_date           		DATE                     NOT NULL,                                 	-- 할당량 적용 시작일
    close_date            	 	DATE                     NOT NULL,                                 	-- 할당량 적용 종료일
    -- 알림 임계값 설정
    warning_threshold_rate   	INTEGER                  DEFAULT 80,                              	-- 경고 알림 임계값 (사용률 %)
    critical_threshold_rate  	INTEGER                  DEFAULT 95,                              	-- 위험 알림 임계값 (사용률 %)
    warning_alert_sent          BOOLEAN                  DEFAULT FALSE,                           	-- 경고 알림 발송 여부
    critical_alert_sent         BOOLEAN                  DEFAULT FALSE,                           	-- 위험 알림 발송 여부
    -- 초과 사용 정책
    allow_overage               BOOLEAN                  DEFAULT FALSE,                           	-- 할당량 초과 허용 여부
    overage_unit_charge         NUMERIC(18,4)            DEFAULT 0,                               	-- 초과 사용 시 단위당 추가 요금
    max_overage_rate         	INTEGER                  DEFAULT 0,                               	-- 최대 초과 허용률 (기본 할당량 대비 %)
    -- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 할당량 상태 (ACTIVE/SUSPENDED/EXPIRED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_service_quotas__tenant_id 				FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id)	ON DELETE CASCADE,

    CONSTRAINT ck_service_quotas__quota_type 				CHECK (quota_type IN ('USERS', 'STORAGE', 'API_CALLS', 'AI_REQUESTS', 'WORKFLOWS', 'DOCUMENTS', 'BANDWIDTH')),
    CONSTRAINT ck_service_quotas__quota_period 				CHECK (quota_period IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')),
    CONSTRAINT ck_service_quotas__status 					CHECK (status IN ('ACTIVE', 'SUSPENDED', 'EXPIRED')),
    CONSTRAINT ck_service_quotas__quota_limit 				CHECK (quota_limit > 0),
    CONSTRAINT ck_service_quotas__quota_used 				CHECK (quota_used >= 0),
    CONSTRAINT ck_service_quotas__warning_threshold_rate 	CHECK (warning_threshold_rate >= 0 AND warning_threshold_rate <= 100),
    CONSTRAINT ck_service_quotas__critical_threshold_rate 	CHECK (critical_threshold_rate >= 0 AND critical_threshold_rate <= 100),
    CONSTRAINT ck_service_quotas__threshold_order 			CHECK (critical_threshold_rate >= warning_threshold_rate),
    CONSTRAINT ck_service_quotas__overage_unit_charge 		CHECK (overage_unit_charge >= 0),
    CONSTRAINT ck_service_quotas__max_overage_rate 			CHECK (max_overage_rate >= 0 AND max_overage_rate <= 500),
    CONSTRAINT ck_service_quotas__period_dates 				CHECK (close_date >= start_date)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  cnfg.service_quotas							IS '서비스 할당량 관리 - 테넌트별 리소스 사용 한도 설정, 모니터링, 초과 사용 제어를 통한 공정한 자원 분배';
COMMENT ON COLUMN cnfg.service_quotas.id 						IS '서비스 할당량 고유 식별자 - UUID 형태의 기본키, 각 할당량 설정을 구분하는 고유값';
COMMENT ON COLUMN cnfg.service_quotas.created_at 				IS '할당량 설정 생성 일시 - 할당량이 시스템에 등록된 시점의 타임스탬프';
COMMENT ON COLUMN cnfg.service_quotas.created_by 				IS '할당량 설정 생성자 UUID - 할당량을 설정한 관리자 또는 시스템의 식별자';
COMMENT ON COLUMN cnfg.service_quotas.updated_at 				IS '할당량 설정 수정 일시 - 할당량 정보가 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN cnfg.service_quotas.updated_by 				IS '할당량 설정 수정자 UUID - 할당량을 최종 수정한 관리자 또는 시스템의 식별자';
COMMENT ON COLUMN cnfg.service_quotas.tenant_id 				IS '할당량 적용 대상 테넌트 ID - 이 할당량이 적용되는 테넌트의 고유 식별자 (tenants 테이블 참조)';
COMMENT ON COLUMN cnfg.service_quotas.quota_type 				IS '할당량 유형 - USERS(사용자수), STORAGE(스토리지), API_CALLS(API호출), AI_REQUESTS(AI요청), WORKFLOWS(워크플로우), DOCUMENTS(문서수), BANDWIDTH(대역폭)';
COMMENT ON COLUMN cnfg.service_quotas.quota_limit 				IS '할당량 한도 - 해당 기간 동안 허용되는 최대 사용량 (단위는 quota_type에 따라 다름)';
COMMENT ON COLUMN cnfg.service_quotas.quota_used 				IS '현재 사용량 - 현재까지 사용된 리소스의 양 (실시간 또는 주기적 업데이트)';
COMMENT ON COLUMN cnfg.service_quotas.quota_period 				IS '할당량 적용 기간 - DAILY(일별), WEEKLY(주별), MONTHLY(월별), YEARLY(연별) 할당량 초기화 주기';
COMMENT ON COLUMN cnfg.service_quotas.start_date 				IS '할당량 적용 시작일 - 현재 할당량 기간의 시작 날짜';
COMMENT ON COLUMN cnfg.service_quotas.close_date 				IS '할당량 적용 종료일 - 현재 할당량 기간의 종료 날짜 (이후 사용량 초기화)';
COMMENT ON COLUMN cnfg.service_quotas.warning_threshold_rate 	IS '경고 알림 임계값 - 할당량 대비 사용률이 이 비율을 초과하면 경고 알림 발송 (0-100%)';
COMMENT ON COLUMN cnfg.service_quotas.critical_threshold_rate 	IS '위험 알림 임계값 - 할당량 대비 사용률이 이 비율을 초과하면 긴급 알림 발송 (0-100%)';
COMMENT ON COLUMN cnfg.service_quotas.warning_alert_sent 		IS '경고 알림 발송 여부 - TRUE(경고 알림 발송됨), FALSE(미발송), 중복 알림 방지용';
COMMENT ON COLUMN cnfg.service_quotas.critical_alert_sent 		IS '위험 알림 발송 여부 - TRUE(위험 알림 발송됨), FALSE(미발송), 중복 알림 방지용';
COMMENT ON COLUMN cnfg.service_quotas.allow_overage 			IS '할당량 초과 허용 여부 - TRUE(초과 사용 허용), FALSE(할당량 도달 시 차단), 서비스 정책에 따른 설정';
COMMENT ON COLUMN cnfg.service_quotas.overage_unit_charge 		IS '초과 사용 시 단위당 추가 요금 - 할당량 초과 시 추가로 부과되는 단위별 요금 (통화: 테넌트 기본 통화)';
COMMENT ON COLUMN cnfg.service_quotas.max_overage_rate 			IS '최대 초과 허용률 - 기본 할당량 대비 최대 몇 퍼센트까지 초과 사용을 허용할지 설정 (0-500%)';
COMMENT ON COLUMN cnfg.service_quotas.status 					IS '할당량 상태 - ACTIVE(활성), SUSPENDED(일시중단), EXPIRED(만료) 할당량 적용 상태';
COMMENT ON COLUMN cnfg.service_quotas.deleted 					IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 테넌트별 할당량 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__tenant_id
	ON cnfg.service_quotas (tenant_id)
 WHERE deleted = FALSE;

-- 할당량 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__quota_type
	ON cnfg.service_quotas (quota_type, created_at DESC)
 WHERE deleted = FALSE;

-- 상태별 할당량 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__status
	ON cnfg.service_quotas (status, created_at DESC)
 WHERE deleted = FALSE;

-- 테넌트별 할당량 유형 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__tenant_type
	ON cnfg.service_quotas (tenant_id, quota_type)
 WHERE deleted = FALSE;

-- 사용량 기준 할당량 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__quota_usage
	ON cnfg.service_quotas (quota_used, quota_limit, created_at DESC)
 WHERE deleted = FALSE;

-- 기간별 할당량 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__period_dates
	ON cnfg.service_quotas (start_date, close_date)
 WHERE deleted = FALSE;

-- 경고 알림 대상 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__warning_alerts
	ON cnfg.service_quotas (warning_threshold_rate, quota_used, quota_limit)
 WHERE warning_alert_sent = FALSE
   AND status = 'ACTIVE'
   AND deleted = FALSE;

-- 위험 알림 대상 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__critical_alerts
	ON cnfg.service_quotas (critical_threshold_rate, quota_used, quota_limit)
 WHERE critical_alert_sent = FALSE
   AND status = 'ACTIVE'
   AND deleted = FALSE;

-- 초과 허용 할당량 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__overage_enabled
	ON cnfg.service_quotas (allow_overage, max_overage_rate)
 WHERE allow_overage = TRUE
   AND deleted = FALSE;

-- 할당량 초과 상황 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__quota_exceeded
	ON cnfg.service_quotas (tenant_id, quota_type, quota_used, quota_limit)
 WHERE quota_used >= quota_limit
   AND deleted = FALSE;

-- 만료 예정 할당량 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__expiring_service_quotas
	ON cnfg.service_quotas (close_date, status)
 WHERE status = 'ACTIVE'
   AND deleted = FALSE;

-- 할당량 기간별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__quota_period
	ON cnfg.service_quotas (quota_period, start_date DESC)
 WHERE deleted = FALSE;

-- 생성 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_service_quotas__created_at
	ON cnfg.service_quotas (created_at DESC);
