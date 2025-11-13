CREATE TABLE IF NOT EXISTS bill.transactions
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 결제 거래 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                   	-- 거래 생성 일시
    created_by                  UUID,                                                              	-- 거래 생성자 UUID (시스템 또는 관리자)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 거래 수정 일시
    updated_by                  UUID,                                                              	-- 거래 수정자 UUID

	-- 관련 테이블 연결
    tenant_id                   UUID                     NOT NULL,                                 	-- 결제 주체 테넌트 ID
    invoice_id                  UUID,                                                              	-- 연관 청구서 ID (청구서 결제인 경우)

    -- 거래 식별 정보 및 유형
    transaction_no              VARCHAR(100)             NOT NULL,                          		-- 거래 번호 (시스템 내 고유)
    transaction_type            VARCHAR(20)              NOT NULL DEFAULT 'PAYMENT',              	-- 거래 유형 (PAYMENT/REFUND/CHARGEBACK)

    payment_gateway             VARCHAR(50),                                                       	-- 결제 게이트웨이 (STRIPE/PAYPAL/TOSS/KAKAOPAY 등)
    payment_gateway_id      	VARCHAR(255),                                                      	-- 결제 게이트웨이에서 생성한 거래 ID

	-- 결제 금액 정보
    amount                      NUMERIC(18,4)            NOT NULL,                                 	-- 결제 금액
    currency                    CHAR(3)                  NOT NULL DEFAULT 'KRW',                  	-- 통화 단위 (ISO 4217)
    exchange_rate               NUMERIC(18,6),                                                     	-- 환율 (외화 결제 시 적용)

	-- 결제 수단 정보
    payment_method              VARCHAR(50)              NOT NULL,                                 	-- 결제 수단 (CREDIT_CARD/BANK_TRANSFER/VIRTUAL_ACCOUNT 등)
    card_digits            		VARCHAR(4),                                                        	-- 카드 마지막 4자리 (보안상 부분 정보만)

    -- 처리 시간 정보
    processed_at                TIMESTAMP WITH TIME ZONE,                                          	-- 결제 처리 완료 일시
    failed_at                   TIMESTAMP WITH TIME ZONE,                                          	-- 결제 실패 일시
    failure_reason              TEXT,                                                              	-- 결제 실패 사유

	-- 상태 관리
	status                      VARCHAR(20)              NOT NULL DEFAULT 'PENDING',              	-- 거래 상태 (PENDING/SUCCESS/FAILED/CANCELED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그
    -- 제약조건
    CONSTRAINT fk_transactions__tenant_id 				FOREIGN KEY (tenant_id) 	REFERENCES tnnt.tenants(id)		ON DELETE CASCADE,
    CONSTRAINT fk_transactions__invoice_id 				FOREIGN KEY (invoice_id) 	REFERENCES bill.invoices(id)	ON DELETE CASCADE,

	CONSTRAINT uk_transactions__transaction_no 			UNIQUE (transaction_no),

    CONSTRAINT ck_transactions__transaction_type 		CHECK (transaction_type IN ('PAYMENT', 'REFUND', 'CHARGEBACK')),
    CONSTRAINT ck_transactions__status 					CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELED')),
    CONSTRAINT ck_transactions__payment_method 			CHECK (payment_method IN ('CREDIT_CARD', 'BANK_TRANSFER', 'VIRTUAL_ACCOUNT', 'PAYPAL', 'KAKAOPAY', 'NAVERPAY')),
    CONSTRAINT ck_transactions__amount 					CHECK (amount > 0),
    CONSTRAINT ck_transactions__exchange_rate 			CHECK (exchange_rate IS NULL OR exchange_rate > 0),
    CONSTRAINT ck_transactions__failure_logic 			CHECK ((status = 'FAILED' AND failed_at IS NOT NULL) OR (status != 'FAILED')),
    CONSTRAINT ck_transactions__success_logic 			CHECK ((status = 'SUCCESS' AND processed_at IS NOT NULL) OR (status != 'SUCCESS'))
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  bill.transactions						IS '결제 거래 내역 - 모든 결제, 환불, 지불거절 거래의 상세 기록과 결제 게이트웨이 연동 정보를 관리';
COMMENT ON COLUMN bill.transactions.id 					IS '결제 거래 고유 식별자 - UUID 형태의 기본키, 시스템 내에서 각 거래를 구분하는 고유값';
COMMENT ON COLUMN bill.transactions.created_at 			IS '거래 생성 일시 - 거래가 시스템에 등록된 시점의 타임스탬프';
COMMENT ON COLUMN bill.transactions.created_by 			IS '거래 생성자 UUID - 거래를 생성한 시스템 프로세스 또는 관리자의 식별자';
COMMENT ON COLUMN bill.transactions.updated_at 			IS '거래 수정 일시 - 거래 정보가 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN bill.transactions.updated_by 			IS '거래 수정자 UUID - 거래 정보를 최종 수정한 시스템 또는 관리자의 식별자';
COMMENT ON COLUMN bill.transactions.tenant_id 			IS '결제 주체 테넌트 ID - 이 거래를 수행한 테넌트의 고유 식별자 (tenants 테이블 참조)';
COMMENT ON COLUMN bill.transactions.invoice_id 			IS '연관 청구서 ID - 이 거래와 연결된 청구서의 고유 식별자 (invoices 테이블 참조, 수동결제시 NULL)';
COMMENT ON COLUMN bill.transactions.transaction_no 		IS '거래 번호 - 시스템에서 발급하는 고유한 거래 식별번호 (예: TXN-2024-001, PAY20241201001)';
COMMENT ON COLUMN bill.transactions.transaction_type 	IS '거래 유형 - PAYMENT(결제), REFUND(환불), CHARGEBACK(지불거절/차지백)';
COMMENT ON COLUMN bill.transactions.payment_gateway 	IS '결제 게이트웨이 - STRIPE(스트라이프), PAYPAL(페이팔), TOSS(토스페이먼츠), KAKAOPAY(카카오페이) 등';
COMMENT ON COLUMN bill.transactions.payment_gateway_id 	IS '결제 게이트웨이에서 생성한 거래 ID - 외부 결제 서비스에서 발급한 고유 거래 식별자 (reconciliation 용)';
COMMENT ON COLUMN bill.transactions.amount 				IS '결제 금액 - 실제 거래된 금액 (양수만 허용, 환불의 경우 별도 거래로 처리)';
COMMENT ON COLUMN bill.transactions.currency 			IS '통화 단위 - 거래에 사용된 통화 (ISO 4217 코드, 예: KRW, USD, EUR)';
COMMENT ON COLUMN bill.transactions.exchange_rate 		IS '환율 - 외화 결제 시 적용된 환율 (기준통화 대비, 예: 1 USD = 1300 KRW)';
COMMENT ON COLUMN bill.transactions.payment_method 		IS '결제 수단 - CREDIT_CARD(신용카드), BANK_TRANSFER(계좌이체), VIRTUAL_ACCOUNT(가상계좌), PAYPAL, KAKAOPAY, NAVERPAY';
COMMENT ON COLUMN bill.transactions.card_digits 		IS '카드 마지막 4자리 - 보안상 카드번호의 마지막 4자리만 저장 (예: 1234)';
COMMENT ON COLUMN bill.transactions.processed_at 		IS '결제 처리 완료 일시 - 결제가 성공적으로 완료된 시점의 타임스탬프';
COMMENT ON COLUMN bill.transactions.failed_at 			IS '결제 실패 일시 - 결제가 실패로 처리된 시점의 타임스탬프';
COMMENT ON COLUMN bill.transactions.failure_reason 		IS '결제 실패 사유 - 결제 실패 시 게이트웨이에서 제공하는 상세 오류 메시지';
COMMENT ON COLUMN bill.transactions.status 				IS '거래 상태 - PENDING(처리중), SUCCESS(성공), FAILED(실패), CANCELED(취소)';
COMMENT ON COLUMN bill.transactions.deleted 			IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 거래 번호 고유성 보장
CREATE UNIQUE INDEX IF NOT EXISTS ux_transactions__transaction_no
    ON bill.transactions (transaction_no)
 WHERE deleted = FALSE;

-- 테넌트별 거래 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__tenant_id
    ON bill.transactions (tenant_id)
 WHERE deleted = FALSE;

-- 청구서별 거래 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__invoice_id
    ON bill.transactions (invoice_id)
 WHERE invoice_id IS NOT NULL AND deleted = FALSE;

-- 상태별 거래 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__status
    ON bill.transactions (status)
 WHERE deleted = FALSE;

-- 게이트웨이별 거래 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__payment_gateway
    ON bill.transactions (payment_gateway)
 WHERE payment_gateway IS NOT NULL AND deleted = FALSE;

-- 외부 거래 ID 검색 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__payment_gateway_id
    ON bill.transactions (payment_gateway_id)
 WHERE payment_gateway_id IS NOT NULL AND deleted = FALSE;

-- 거래 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__transaction_type
    ON bill.transactions (transaction_type)
 WHERE deleted = FALSE;

-- 결제 수단별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__payment_method
    ON bill.transactions (payment_method)
 WHERE deleted = FALSE;

-- 처리 완료 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__processed_at
    ON bill.transactions (processed_at DESC NULLS LAST)
 WHERE deleted = FALSE;

-- 실패 거래 분석 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__failed
    ON bill.transactions (status, failed_at DESC)
 WHERE status = 'FAILED' AND deleted = FALSE;

-- 성공 거래 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__success
    ON bill.transactions (status, processed_at DESC)
 WHERE status = 'SUCCESS' AND deleted = FALSE;

-- 금액별 거래 분석 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__amount_range
    ON bill.transactions (amount DESC)
 WHERE deleted = FALSE;

-- 최신 거래 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__created_at
    ON bill.transactions (created_at DESC);

-- 테넌트별 상태 복합 조회 최적화
CREATE INDEX IF NOT EXISTS ix_transactions__tenant_status
    ON bill.transactions (tenant_id, status, created_at DESC)
 WHERE deleted = FALSE;
