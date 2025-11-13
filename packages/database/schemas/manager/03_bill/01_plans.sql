CREATE TABLE IF NOT EXISTS bill.plans
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 요금제 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                   	-- 요금제 생성 일시
    created_by                  UUID,                                                              	-- 요금제 생성자 UUID (관리자)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 요금제 수정 일시
    updated_by                  UUID,                                                              	-- 요금제 수정자 UUID

	-- 요금제 기본 정보
    code                        VARCHAR(50)              NOT NULL,		                          	-- 요금제 식별 코드 (PLAN_TRIAL, PLAN_STD 등)
    name                        VARCHAR(100)             NOT NULL,                                 	-- 요금제 이름 (체험판, 스탠다드, 프리미엄 등)
    type                        VARCHAR(20)              NOT NULL DEFAULT 'STANDARD',             	-- 요금제 유형 (TRIAL/STANDARD/PREMIUM/ENTERPRISE)
    description                 TEXT,                                                              	-- 요금제 상세 설명

	-- 가격 정보
    base_price                  NUMERIC(18,4)            NOT NULL,                                 	-- 기본 요금 (월/분기/년 단위)
    user_price                  NUMERIC(18,4)            DEFAULT 0,                               	-- 사용자당 추가 요금
    currency                    CHAR(3)                  NOT NULL DEFAULT 'KRW',                  	-- 통화 단위 (ISO 4217)
    billing_cycle               VARCHAR(20)              NOT NULL DEFAULT 'MONTHLY',              	-- 청구 주기 (MONTHLY/QUARTERLY/YEARLY)

	-- 사용량 제한 정보
    max_users                   INTEGER                  DEFAULT 50,                              	-- 최대 사용자 수 제한
    max_storage                 INTEGER                  DEFAULT 100,                             	-- 최대 스토리지 용량 (GB)
    max_api_calls               INTEGER                  DEFAULT 10000,                           	-- 월간 최대 API 호출 수

	-- 기능 제한 정보
    features                    JSONB                    DEFAULT '{}',                            	-- 포함된 기능 목록 (JSON 형태)

	-- 유효 기간 관리
	start_time                  DATE                     NOT NULL,                                 	-- 요금제 적용 시작일
    close_time                    DATE,                                                             -- 요금제 적용 종료일 (NULL: 무기한)

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 요금제 상태 (ACTIVE/INACTIVE/ARCHIVED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
	CONSTRAINT uk_plans__code			UNIQUE (code),

    CONSTRAINT ck_plans__type 			CHECK (type IN ('TRIAL', 'STANDARD', 'PREMIUM', 'ENTERPRISE')),
    CONSTRAINT ck_plans__billing_cycle 		CHECK (billing_cycle IN ('MONTHLY', 'QUARTERLY', 'YEARLY')),
    CONSTRAINT ck_plans__status 			CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    CONSTRAINT ck_plans__base_price 		CHECK (base_price >= 0),
    CONSTRAINT ck_plans__user_price 		CHECK (user_price >= 0),
    CONSTRAINT ck_plans__max_users 			CHECK (max_users IS NULL OR max_users > 0),
    CONSTRAINT ck_plans__max_storage 		CHECK (max_storage IS NULL OR max_storage > 0),
    CONSTRAINT ck_plans__max_api_calls 		CHECK (max_api_calls IS NULL OR max_api_calls > 0),
    CONSTRAINT ck_plans__valid_period 		CHECK (close_time IS NULL OR close_time >= start_time)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  bill.plans					IS '요금제 마스터 - 서비스 요금제의 가격 정책, 사용량 제한, 포함 기능을 정의하는 핵심 테이블';
COMMENT ON COLUMN bill.plans.id 				IS '요금제 고유 식별자 - UUID 형태의 기본키, 시스템 내에서 각 요금제를 구분하는 고유값';
COMMENT ON COLUMN bill.plans.created_at 		IS '요금제 생성 일시 - 요금제가 시스템에 등록된 시점의 타임스탬프';
COMMENT ON COLUMN bill.plans.created_by 		IS '요금제 생성자 UUID - 요금제를 생성한 관리자 또는 시스템의 식별자';
COMMENT ON COLUMN bill.plans.updated_at 		IS '요금제 수정 일시 - 요금제 정보가 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN bill.plans.updated_by 		IS '요금제 수정자 UUID - 요금제를 최종 수정한 관리자 또는 시스템의 식별자';
COMMENT ON COLUMN bill.plans.code 			IS '요금제 식별 코드 - 시스템에서 사용하는 고유한 요금제 코드 (예: PLAN_TRIAL, PLAN_STD, PLAN_PRO)';
COMMENT ON COLUMN bill.plans.name 			IS '요금제 이름 - 사용자에게 표시되는 요금제명 (예: 체험판, 스탠다드, 프리미엄, 엔터프라이즈)';
COMMENT ON COLUMN bill.plans.type 			IS '요금제 유형 - TRIAL(체험판), STANDARD(표준), PREMIUM(프리미엄), ENTERPRISE(기업용) 분류';
COMMENT ON COLUMN bill.plans.description 		IS '요금제 상세 설명 - 요금제의 특징, 대상 고객, 주요 기능 등에 대한 마케팅 문구';
COMMENT ON COLUMN bill.plans.base_price 		IS '기본 요금 - 요금제의 월/분기/연 단위 기본 구독료 (최소 청구 금액)';
COMMENT ON COLUMN bill.plans.user_price 		IS '사용자당 추가 요금 - 기본 사용자 수를 초과하는 각 사용자에 대한 추가 과금액';
COMMENT ON COLUMN bill.plans.currency 			IS '통화 단위 - 요금 표시 및 청구에 사용할 통화 (ISO 4217 코드, 예: KRW, USD, EUR)';
COMMENT ON COLUMN bill.plans.billing_cycle 		IS '청구 주기 - MONTHLY(월별), QUARTERLY(분기별), YEARLY(연별) 청구 주기 설정';
COMMENT ON COLUMN bill.plans.max_users 			IS '최대 사용자 수 제한 - 이 요금제에서 허용하는 최대 활성 사용자 수 (라이선스 한도)';
COMMENT ON COLUMN bill.plans.max_storage 		IS '최대 스토리지 용량 - 이 요금제에서 허용하는 최대 저장공간 크기 (GB 단위)';
COMMENT ON COLUMN bill.plans.max_api_calls 		IS '월간 최대 API 호출 수 - 이 요금제에서 허용하는 월간 API 요청 한도';
COMMENT ON COLUMN bill.plans.features 			IS '포함된 기능 목록 - 이 요금제에서 사용 가능한 기능들의 상세 설정 (JSON 형태, 기능별 on/off 및 제한값 포함)';
COMMENT ON COLUMN bill.plans.start_time 		IS '요금제 적용 시작일 - 이 요금제가 유효해지는 날짜 (신규 가입 시 적용 기준일)';
COMMENT ON COLUMN bill.plans.close_time 		IS '요금제 적용 종료일 - 이 요금제의 유효 기간 만료일 (NULL인 경우 무기한 유효)';
COMMENT ON COLUMN bill.plans.status 			IS '요금제 상태 - ACTIVE(활성, 신규가입가능), INACTIVE(비활성, 신규가입불가), ARCHIVED(보관, 기존가입자만유지)';
COMMENT ON COLUMN bill.plans.deleted 			IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 요금제 코드 고유성 보장
CREATE UNIQUE INDEX IF NOT EXISTS ux_plans__code
    ON bill.plans (code)
 WHERE deleted = FALSE;

-- 요금제 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_plans__type
    ON bill.plans (type)
 WHERE deleted = FALSE;

-- 상태별 요금제 조회 최적화
CREATE INDEX IF NOT EXISTS ix_plans__status_active
    ON bill.plans (status)
 WHERE deleted = FALSE;

-- 청구 주기별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_plans__billing_cycle
    ON bill.plans (billing_cycle)
 WHERE deleted = FALSE;

-- 가격 범위별 요금제 분석 최적화
CREATE INDEX IF NOT EXISTS ix_plans__price_range
    ON bill.plans (base_price, user_price)
 WHERE deleted = FALSE;

-- 유효 기간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_plans__valid_period
    ON bill.plans (start_time, close_time)
 WHERE deleted = FALSE;

-- 현재 활성 요금제 조회 최적화
CREATE INDEX IF NOT EXISTS ix_plans__active_valid
    ON bill.plans (status, start_time, close_time)
 WHERE status = 'ACTIVE' AND deleted = FALSE;

-- 유형별 가격 비교 최적화
CREATE INDEX IF NOT EXISTS ix_plans__type_price
    ON bill.plans (type, base_price)
 WHERE deleted = FALSE;

-- 기능 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_plans__features
    ON bill.plans USING GIN (features)
 WHERE deleted = FALSE;

-- 최신 생성 요금제 조회 최적화
CREATE INDEX IF NOT EXISTS ix_plans__created_at
    ON bill.plans (created_at DESC);

-- 사용량 제한별 요금제 분석 최적화
CREATE INDEX IF NOT EXISTS ix_plans__usage_limits
    ON bill.plans (max_users, max_storage, max_api_calls)
 WHERE deleted = FALSE;

-- 통화별 청구 주기 조회 최적화
CREATE INDEX IF NOT EXISTS ix_plans__currency_cycle
    ON bill.plans (currency, billing_cycle)
 WHERE deleted = FALSE;
