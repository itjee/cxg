CREATE TABLE IF NOT EXISTS tnnt.subscriptions
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 구독 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 구독 등록 일시
    created_by          UUID,                                                              	-- 구독 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                          	-- 구독 수정 일시
    updated_by          UUID,                                                              	-- 구독 수정자 UUID

	-- 테넌트 연결
    tenant_id           UUID                     NOT NULL,                                 	-- 구독 대상 테넌트 ID

	-- 구독 계획 정보
    plan_id             UUID                     NOT NULL,                                 	-- 구독 계획 ID (plans 테이블 참조)
    start_date          DATE                     NOT NULL,                                 	-- 구독 시작일
    close_date          DATE,                                                             	-- 구독 종료일 (NULL: 무기한)
    billing_cycle       VARCHAR(20)              NOT NULL DEFAULT 'MONTHLY',              	-- 청구 주기 (MONTHLY/QUARTERLY/YEARLY)

	-- 사용량 제한 설정
    max_users           INTEGER                  DEFAULT 50,                              	-- 최대 허용 사용자 수
    max_storage         INTEGER                  DEFAULT 100,                             	-- 최대 스토리지 용량 (GB 단위)
    max_api_calls       INTEGER                  DEFAULT 10000,                           	-- 월간 최대 API 호출 횟수

	-- 요금 정보
    base_amount         NUMERIC(18,4)            NOT NULL,                                	-- 기본 요금 (고정 비용)
    user_amount         NUMERIC(18,4)            DEFAULT 0,                               	-- 사용자당 추가 요금
    currency            CHAR(3)                  NOT NULL DEFAULT 'KRW',                 	-- 통화 단위 (ISO 4217)

	-- 갱신 설정
    auto_renewal        BOOLEAN                  DEFAULT TRUE,                            	-- 자동 갱신 여부
    noti_renewal        BOOLEAN                  DEFAULT FALSE,                           	-- 갱신 알림 발송 여부

	-- 상태 관리
    status              VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 구독 상태 (ACTIVE/SUSPENDED/EXPIRED/CANCELED)
    is_deleted         	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_subscriptions__tenant_id		FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id),

    CONSTRAINT ck_subscriptions__status			CHECK (status IN ('ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELED')),
    CONSTRAINT ck_subscriptions__billing_cycle	CHECK (billing_cycle IN ('MONTHLY', 'QUARTERLY', 'YEARLY')),
    CONSTRAINT ck_subscriptions__max_users		CHECK (max_users IS NULL OR max_users > 0),
    CONSTRAINT ck_subscriptions__max_storage	CHECK (max_storage IS NULL OR max_storage > 0),
    CONSTRAINT ck_subscriptions__max_api_calls	CHECK (max_api_calls IS NULL OR max_api_calls > 0),
    CONSTRAINT ck_subscriptions__base_amount	CHECK (base_amount >= 0),
    CONSTRAINT ck_subscriptions__user_amount	CHECK (user_amount >= 0),
    CONSTRAINT ck_subscriptions__date_valid		CHECK (close_date IS NULL OR close_date >= start_date)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  tnnt.subscriptions					IS '테넌트 구독 및 요금제 관리 - 각 테넌트의 구독 계획, 사용량 제한, 청구 정보, 갱신 설정을 관리하는 테이블';
COMMENT ON COLUMN tnnt.subscriptions.id 				IS '구독 고유 식별자 - UUID 형태의 기본키, 구독 계약을 구분하는 고유값';
COMMENT ON COLUMN tnnt.subscriptions.created_at 		IS '구독 등록 일시 - 레코드 생성 시점의 타임스탬프, 구독 계약 시작 추적용';
COMMENT ON COLUMN tnnt.subscriptions.created_by 		IS '구독 등록자 - 구독을 등록한 관리자 또는 시스템의 UUID';
COMMENT ON COLUMN tnnt.subscriptions.updated_at 		IS '구독 수정 일시 - 레코드 최종 수정 시점의 타임스탬프, 변경 이력 추적용';
COMMENT ON COLUMN tnnt.subscriptions.updated_by 		IS '구독 수정자 - 구독 정보를 최종 수정한 관리자 또는 시스템의 UUID';
COMMENT ON COLUMN tnnt.subscriptions.tenant_id 			IS '구독 대상 테넌트 ID - 구독을 보유한 테넌트의 고유 식별자 (tenants 테이블 참조)';
COMMENT ON COLUMN tnnt.subscriptions.plan_id 			IS '구독 계획 ID - 선택된 요금제의 고유 식별자 (plans 테이블 참조)';
COMMENT ON COLUMN tnnt.subscriptions.start_date 		IS '구독 시작일 - 구독 서비스 이용 시작 날짜, 청구 기준일';
COMMENT ON COLUMN tnnt.subscriptions.close_date 		IS '구독 종료일 - 구독 서비스 이용 종료 날짜 (NULL인 경우 무기한 구독)';
COMMENT ON COLUMN tnnt.subscriptions.billing_cycle 		IS '청구 주기 - MONTHLY(월별), QUARTERLY(분기별), YEARLY(연별) 청구 주기 설정';
COMMENT ON COLUMN tnnt.subscriptions.max_users 			IS '최대 허용 사용자 수 - 구독 계획에서 허용하는 최대 활성 사용자 수 (라이선스 제한)';
COMMENT ON COLUMN tnnt.subscriptions.max_storage 		IS '최대 스토리지 용량 - 구독 계획에서 허용하는 최대 저장공간 크기 (GB 단위)';
COMMENT ON COLUMN tnnt.subscriptions.max_api_calls 		IS '월간 최대 API 호출 횟수 - 구독 계획에서 허용하는 월간 API 요청 한도';
COMMENT ON COLUMN tnnt.subscriptions.base_amount 		IS '기본 요금 - 구독 계획의 고정 월/분기/연 요금 (최소 청구 금액)';
COMMENT ON COLUMN tnnt.subscriptions.user_amount 		IS '사용자당 추가 요금 - 기본 사용자 수를 초과하는 각 사용자에 대한 추가 과금액';
COMMENT ON COLUMN tnnt.subscriptions.currency 			IS '통화 단위 - 요금 표시 및 청구에 사용할 통화 (ISO 4217 코드, 예: KRW, USD)';
COMMENT ON COLUMN tnnt.subscriptions.auto_renewal 		IS '자동 갱신 여부 - TRUE(자동 갱신), FALSE(수동 갱신), 구독 만료 시 자동 연장 설정';
COMMENT ON COLUMN tnnt.subscriptions.noti_renewal 		IS '갱신 알림 발송 여부 - TRUE(알림 발송), FALSE(알림 미발송), 갱신 전 사전 알림 설정';
COMMENT ON COLUMN tnnt.subscriptions.status 			IS '구독 상태 - ACTIVE(활성), SUSPENDED(일시중단), EXPIRED(만료), CANCELED(해지)';
COMMENT ON COLUMN tnnt.subscriptions.is_deleted 		IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성 상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 테넌트별 구독 정보 조회 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__tenant_id
    ON tnnt.subscriptions (tenant_id);

-- 요금제별 구독 현황 조회 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__plan_id
    ON tnnt.subscriptions (plan_id);

-- 활성 구독 상태별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__status_active
    ON tnnt.subscriptions (status)
 WHERE is_deleted = FALSE;

-- 청구 주기별 구독 관리 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__billing_cycle
    ON tnnt.subscriptions (billing_cycle)
 WHERE is_deleted = FALSE;

-- 구독 시작일 기준 정렬 조회 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__start_date
    ON tnnt.subscriptions (start_date DESC);

-- 구독 만료 예정 조회 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__close_date
    ON tnnt.subscriptions (close_date)
 WHERE close_date IS NOT NULL AND is_deleted = FALSE;

-- 자동 갱신 대상 구독 조회 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__auto_renewal
    ON tnnt.subscriptions (auto_renewal, close_date)
 WHERE status = 'ACTIVE' AND is_deleted = FALSE;

-- 테넌트별 구독 상태 복합 조회 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__tenant_status
    ON tnnt.subscriptions (tenant_id, status)
 WHERE is_deleted = FALSE;

-- 요금 범위별 구독 분석 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__amount_range
    ON tnnt.subscriptions (base_amount DESC)
 WHERE is_deleted = FALSE;

-- 최신 구독 가입 조회 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__created_at
    ON tnnt.subscriptions (created_at DESC);

-- 갱신 알림 대상 구독 조회 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__renewal_noti
    ON tnnt.subscriptions (noti_renewal, close_date)
 WHERE status = 'ACTIVE' AND is_deleted = FALSE;

-- 사용량 제한별 구독 분석 최적화
CREATE INDEX IF NOT EXISTS ix_subscriptions__usage_limits
    ON tnnt.subscriptions (max_users, max_storage, max_api_calls)
 WHERE is_deleted = FALSE;
