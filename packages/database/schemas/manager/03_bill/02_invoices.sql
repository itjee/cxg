CREATE TABLE IF NOT EXISTS bill.invoices
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 청구서 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                   	-- 청구서 생성 일시
    created_by                  UUID,                                                              	-- 청구서 생성자 UUID (시스템 또는 관리자)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 청구서 수정 일시
    updated_by                  UUID,                                                              	-- 청구서 수정자 UUID

	-- 관련 테이블 연결
    tenant_id                   UUID                     NOT NULL,                                 	-- 청구 대상 테넌트 ID
    subscription_id             UUID                     NOT NULL,                                 	-- 구독 계약 ID

	-- 청구서 기본 정보
    invoice_no                  VARCHAR(50)              NOT NULL,		                          	-- 청구서 번호 (시스템 내 고유)
    invoice_date                DATE                     NOT NULL,                                 	-- 청구서 발행일
    due_date                    DATE                     NOT NULL,                                 	-- 결제 만료일
    start_date                  DATE                     NOT NULL,                                 	-- 청구 기간 시작일
    close_date                  DATE                     NOT NULL,                                 	-- 청구 기간 종료일

	-- 청구 금액 정보
    base_amount                 NUMERIC(18,4)            NOT NULL,                                 	-- 기본 구독 요금
    usage_amount                NUMERIC(18,4)            DEFAULT 0,                               	-- 사용량 기반 추가 요금 (초과 사용자, API 호출 등)
    discount_amount             NUMERIC(18,4)            DEFAULT 0,                               	-- 할인 금액 (프로모션, 쿠폰 등)
    tax_amount                  NUMERIC(18,4)            DEFAULT 0,                               	-- 세금 (VAT, 부가세 등)
    total_amount                NUMERIC(18,4)            NOT NULL,                                	-- 총 청구 금액 (최종 결제 금액)
    currency                    CHAR(3)                  NOT NULL DEFAULT 'KRW',                  	-- 통화 단위 (ISO 4217)

	-- 사용량 상세 정보
    user_count                  INTEGER                  NOT NULL,                                	-- 청구 기간 중 평균/최대 사용자 수
    used_storage                NUMERIC(18,4)            DEFAULT 0,                               	-- 스토리지 사용량 (GB)
    api_calls                   INTEGER                  DEFAULT 0,                               	-- 총 API 호출 횟수

	-- 결제 정보
    paid_at                     TIMESTAMP WITH TIME ZONE,                                          	-- 결제 완료 일시
    payment_method              VARCHAR(50),                                                       	-- 결제 수단 (CREDIT_CARD/BANK_TRANSFER/PAYPAL 등)

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'PENDING',              	-- 청구서 상태 (PENDING/SENT/PAID/OVERDUE/CANCELED)
    deleted                 	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_invoices__tenant_id 			FOREIGN KEY (tenant_id) 		REFERENCES tnnt.tenants(id)			ON DELETE CASCADE,
    CONSTRAINT fk_invoices__subscription_id 	FOREIGN KEY (subscription_id) 	REFERENCES tnnt.subscriptions(id)	ON DELETE CASCADE,

	CONSTRAINT uk_invoices__invoice_no			UNIQUE (invoice_no),

    CONSTRAINT ck_invoices__status 				CHECK (status IN ('PENDING', 'SENT', 'PAID', 'OVERDUE', 'CANCELED')),
    CONSTRAINT ck_invoices__payment_method 		CHECK (payment_method IN ('CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'WIRE_TRANSFER', 'CHECK')),
    CONSTRAINT ck_invoices__base_amount 		CHECK (base_amount >= 0),
    CONSTRAINT ck_invoices__usage_amount 		CHECK (usage_amount >= 0),
    CONSTRAINT ck_invoices__discount_amount 	CHECK (discount_amount >= 0),
    CONSTRAINT ck_invoices__tax_amount 			CHECK (tax_amount >= 0),
    CONSTRAINT ck_invoices__total_amount 		CHECK (total_amount >= 0),
    CONSTRAINT ck_invoices__user_count 			CHECK (user_count > 0),
    CONSTRAINT ck_invoices__used_storage 		CHECK (used_storage >= 0),
    CONSTRAINT ck_invoices__api_calls 			CHECK (api_calls >= 0),
    CONSTRAINT ck_invoices__date_sequence 		CHECK (due_date >= invoice_date AND close_date >= start_date)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  bill.invoices					IS '청구서 관리 - 테넌트별 월간/주기별 청구서 생성, 발송, 결제 추적을 관리하는 핵심 과금 테이블';
COMMENT ON COLUMN bill.invoices.id 				IS '청구서 고유 식별자 - UUID 형태의 기본키, 시스템 내에서 각 청구서를 구분하는 고유값';
COMMENT ON COLUMN bill.invoices.created_at 		IS '청구서 생성 일시 - 청구서가 시스템에서 생성된 시점의 타임스탬프';
COMMENT ON COLUMN bill.invoices.created_by 		IS '청구서 생성자 UUID - 청구서를 생성한 시스템 프로세스 또는 관리자의 식별자';
COMMENT ON COLUMN bill.invoices.updated_at 		IS '청구서 수정 일시 - 청구서 정보가 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN bill.invoices.updated_by 		IS '청구서 수정자 UUID - 청구서를 최종 수정한 시스템 또는 관리자의 식별자';
COMMENT ON COLUMN bill.invoices.tenant_id 		IS '청구 대상 테넌트 ID - 이 청구서의 수신자인 테넌트의 고유 식별자 (tenants 테이블 참조)';
COMMENT ON COLUMN bill.invoices.subscription_id IS '구독 계약 ID - 이 청구서의 근거가 되는 구독 계약의 고유 식별자 (subscriptions 테이블 참조)';
COMMENT ON COLUMN bill.invoices.invoice_no 		IS '청구서 번호 - 시스템에서 발급하는 고유한 청구서 식별번호 (예: INV-2024-001, 2024120001)';
COMMENT ON COLUMN bill.invoices.invoice_date 	IS '청구서 발행일 - 청구서가 공식적으로 발행된 날짜 (회계 기준일)';
COMMENT ON COLUMN bill.invoices.due_date 		IS '결제 만료일 - 고객이 결제를 완료해야 하는 최종 기한 (연체 판단 기준)';
COMMENT ON COLUMN bill.invoices.start_date 		IS '청구 기간 시작일 - 이 청구서가 적용되는 서비스 이용 기간의 시작날짜';
COMMENT ON COLUMN bill.invoices.close_date 		IS '청구 기간 종료일 - 이 청구서가 적용되는 서비스 이용 기간의 종료날짜';
COMMENT ON COLUMN bill.invoices.base_amount 	IS '기본 구독 요금 - 구독 계획에 따른 고정 월/분기/연 요금';
COMMENT ON COLUMN bill.invoices.usage_amount 	IS '사용량 기반 추가 요금 - 초과 사용자, 추가 스토리지, API 호출 등에 따른 변동 요금';
COMMENT ON COLUMN bill.invoices.discount_amount IS '할인 금액 - 프로모션, 쿠폰, 계약 할인 등으로 감액된 금액';
COMMENT ON COLUMN bill.invoices.tax_amount 		IS '세금 - 부가세, VAT 등 법정 세금 (지역별 세율 적용)';
COMMENT ON COLUMN bill.invoices.total_amount 	IS '총 청구 금액 - 고객이 실제로 결제해야 하는 최종 금액 (base + usage - discount + tax)';
COMMENT ON COLUMN bill.invoices.currency 		IS '통화 단위 - 청구서에 표시되는 통화 (ISO 4217 코드, 예: KRW, USD, EUR)';
COMMENT ON COLUMN bill.invoices.user_count 		IS '청구 기간 중 사용자 수 - 해당 기간 동안의 평균 또는 최대 활성 사용자 수 (과금 기준)';
COMMENT ON COLUMN bill.invoices.used_storage 	IS '스토리지 사용량 - 청구 기간 중 실제 사용한 저장공간 크기 (GB 단위)';
COMMENT ON COLUMN bill.invoices.api_calls 		IS '총 API 호출 횟수 - 청구 기간 중 발생한 누적 API 요청 수';
COMMENT ON COLUMN bill.invoices.paid_at 		IS '결제 완료 일시 - 고객이 실제로 결제를 완료한 시점의 타임스탬프';
COMMENT ON COLUMN bill.invoices.payment_method 	IS '결제 수단 - CREDIT_CARD(신용카드), BANK_TRANSFER(계좌이체), PAYPAL, WIRE_TRANSFER(전신송금), CHECK(수표)';
COMMENT ON COLUMN bill.invoices.status 			IS '청구서 상태 - PENDING(대기), SENT(발송완료), PAID(결제완료), OVERDUE(연체), CANCELED(취소)';
COMMENT ON COLUMN bill.invoices.deleted 		IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 청구서 번호 고유성 보장
CREATE UNIQUE INDEX IF NOT EXISTS ux_invoices__invoice_no
    ON bill.invoices (invoice_no)
 WHERE deleted = FALSE;

-- 테넌트별 청구서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__tenant_id
    ON bill.invoices (tenant_id)
 WHERE deleted = FALSE;

-- 구독별 청구서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__subscription_id
    ON bill.invoices (subscription_id)
 WHERE deleted = FALSE;

-- 상태별 청구서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__status
    ON bill.invoices (status)
 WHERE deleted = FALSE;

-- 발행일 기준 정렬 조회 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__invoice_date
    ON bill.invoices (invoice_date DESC);

-- 결제 만료일 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__due_date
    ON bill.invoices (due_date)
 WHERE deleted = FALSE;

-- 결제 완료 청구서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__paid_status
    ON bill.invoices (status, paid_at DESC)
 WHERE status = 'PAID' AND deleted = FALSE;

-- 연체 청구서 관리 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__overdue
    ON bill.invoices (status, due_date)
 WHERE status = 'OVERDUE' AND deleted = FALSE;

-- 테넌트별 기간 조회 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__tenant_period
    ON bill.invoices (tenant_id, start_date, close_date)
 WHERE deleted = FALSE;

-- 청구 금액별 분석 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__amount_range
    ON bill.invoices (total_amount DESC)
 WHERE deleted = FALSE;

-- 청구 기간별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__billing_period
    ON bill.invoices (start_date, close_date)
 WHERE deleted = FALSE;

-- 결제 수단별 통계 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__payment_method
    ON bill.invoices (payment_method, paid_at DESC)
 WHERE payment_method IS NOT NULL AND deleted = FALSE;

-- 최신 생성 청구서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_invoices__created_at
    ON bill.invoices (created_at DESC);
