-- =====================================================================================
-- 테이블: fim.payment_transactions
-- 설명: 입출금 거래 내역 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.payment_transactions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 거래 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 거래 기본 정보
    transaction_code        VARCHAR(50)              NOT NULL,                               -- 거래 코드
    transaction_date        DATE                     NOT NULL,                               -- 거래 일자
    transaction_type        VARCHAR(20)              NOT NULL,                               -- 거래 유형
    
    -- 결제 수단
    payment_method          VARCHAR(20)              NOT NULL,                               -- 결제 수단
    payment_status          VARCHAR(20)              DEFAULT 'COMPLETED',                    -- 결제 상태 (추가)
    
    -- 거래처 및 계정
    partner_id              UUID                     NOT NULL,                               -- 거래처 식별자
    partner_type            VARCHAR(20),                                                     -- 거래처 유형 (추가)
    account_id              UUID                     NOT NULL,                               -- 계정과목 식별자
    
    -- 금액 정보
    amount                  NUMERIC(18,4)            NOT NULL,                               -- 거래 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 (ISO 4217)
    exchange_rate           NUMERIC(15,6)            DEFAULT 1,                              -- 환율 (추가)
    fee_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 수수료 금액 (추가)
    
    -- 참조 정보
    ref_doc_type            VARCHAR(50),                                                     -- 참조 문서 유형
    ref_doc_id              UUID,                                                            -- 참조 문서 식별자
    ref_doc_no              VARCHAR(100),                                                    -- 참조 번호 (추가)
    
    -- 은행 및 계좌 정보
    bank_name               VARCHAR(100),                                                    -- 은행명 (추가)
    bank_account            VARCHAR(50),                                                     -- 은행 계좌 번호
    bank_account_holder     VARCHAR(100),                                                    -- 예금주명 (추가)
    check_no                VARCHAR(50),                                                     -- 수표 번호
    card_no                 VARCHAR(20),                                                     -- 카드 번호 (마스킹) (추가)
    
    -- 거래 내용
    description             TEXT,                                                            -- 거래 설명
    memo                    TEXT,                                                            -- 메모 (추가)
    
    -- 승인 정보
    approval_code           VARCHAR(50),                                                     -- 승인 코드 (카드 거래) (추가)
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시 (추가)
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'COMPLETED',                    -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 거래 유형 체크
    CONSTRAINT ck_payment_transactions__type    CHECK (transaction_type IN ('RECEIPT', 'PAYMENT')),
    
    -- 결제 수단 체크
    CONSTRAINT ck_payment_transactions__method  CHECK (payment_method IN ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'VIRTUAL_ACCOUNT', 'MOBILE_PAYMENT')),
    
    -- 결제 상태 체크
    CONSTRAINT ck_payment_transactions__payment_status CHECK (payment_status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED')),
    
    -- 상태 체크
    CONSTRAINT ck_payment_transactions__status  CHECK (status IN ('COMPLETED', 'CANCELLED', 'PENDING', 'FAILED')),
    
    -- 통화 코드 형식 체크
    CONSTRAINT ck_payment_transactions__currency CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 금액 양수 체크
    CONSTRAINT ck_payment_transactions__amount  CHECK (amount > 0),
    
    -- 환율 양수 체크
    CONSTRAINT ck_payment_transactions__exchange_rate CHECK (exchange_rate > 0),
    
    -- 거래처 유형 체크
    CONSTRAINT ck_payment_transactions__partner_type CHECK (partner_type IS NULL OR partner_type IN ('CUSTOMER', 'VENDOR', 'EMPLOYEE', 'OTHER')),
    
    -- 거래처 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_payment_transactions__partner_id FOREIGN KEY (partner_id) REFERENCES crm.partners(id) ON DELETE RESTRICT,
    
    -- 계정과목 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_payment_transactions__account_id FOREIGN KEY (account_id) REFERENCES fim.accounts(id) ON DELETE RESTRICT,
    
    -- 통화 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_payment_transactions__currency FOREIGN KEY (currency) REFERENCES adm.currencies(code) ON DELETE RESTRICT
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fim.payment_transactions                        IS '입출금 거래 내역 관리 테이블';
COMMENT ON COLUMN fim.payment_transactions.id                     IS '거래 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.payment_transactions.created_at             IS '등록 일시';
COMMENT ON COLUMN fim.payment_transactions.created_by             IS '등록자 UUID';
COMMENT ON COLUMN fim.payment_transactions.updated_at             IS '수정 일시';
COMMENT ON COLUMN fim.payment_transactions.updated_by             IS '수정자 UUID';
COMMENT ON COLUMN fim.payment_transactions.transaction_code       IS '거래 코드';
COMMENT ON COLUMN fim.payment_transactions.transaction_date       IS '거래 일자';
COMMENT ON COLUMN fim.payment_transactions.transaction_type       IS '거래 유형 (RECEIPT: 입금/PAYMENT: 출금)';
COMMENT ON COLUMN fim.payment_transactions.payment_method         IS '결제 수단 (CASH: 현금/BANK_TRANSFER: 계좌이체/CREDIT_CARD: 신용카드/CHECK: 수표 등)';
COMMENT ON COLUMN fim.payment_transactions.payment_status         IS '결제 상태 (PENDING: 대기/COMPLETED: 완료/CANCELLED: 취소/FAILED: 실패)';
COMMENT ON COLUMN fim.payment_transactions.partner_id             IS '거래처 식별자';
COMMENT ON COLUMN fim.payment_transactions.partner_type           IS '거래처 유형 (CUSTOMER: 고객/VENDOR: 공급업체/EMPLOYEE: 임직원/OTHER: 기타)';
COMMENT ON COLUMN fim.payment_transactions.account_id             IS '계정과목 식별자';
COMMENT ON COLUMN fim.payment_transactions.amount                 IS '거래 금액';
COMMENT ON COLUMN fim.payment_transactions.currency               IS '통화 (ISO 4217)';
COMMENT ON COLUMN fim.payment_transactions.exchange_rate          IS '환율';
COMMENT ON COLUMN fim.payment_transactions.fee_amount             IS '수수료 금액';
COMMENT ON COLUMN fim.payment_transactions.ref_doc_type     IS '참조 문서 유형 (AR: 매출채권/AP: 매입채무/기타)';
COMMENT ON COLUMN fim.payment_transactions.ref_doc_id       IS '참조 문서 식별자';
COMMENT ON COLUMN fim.payment_transactions.ref_doc_no       IS '참조 번호';
COMMENT ON COLUMN fim.payment_transactions.bank_name              IS '은행명';
COMMENT ON COLUMN fim.payment_transactions.bank_account           IS '은행 계좌 번호';
COMMENT ON COLUMN fim.payment_transactions.bank_account_holder    IS '예금주명';
COMMENT ON COLUMN fim.payment_transactions.check_no           IS '수표 번호';
COMMENT ON COLUMN fim.payment_transactions.card_no            IS '카드 번호 (마스킹 처리)';
COMMENT ON COLUMN fim.payment_transactions.description            IS '거래 설명';
COMMENT ON COLUMN fim.payment_transactions.memo                   IS '메모';
COMMENT ON COLUMN fim.payment_transactions.approval_code          IS '승인 코드 (카드 거래)';
COMMENT ON COLUMN fim.payment_transactions.approved_at            IS '승인 일시';
COMMENT ON COLUMN fim.payment_transactions.status                 IS '상태 (COMPLETED: 완료/CANCELLED: 취소/PENDING: 대기/FAILED: 실패)';
COMMENT ON COLUMN fim.payment_transactions.is_deleted             IS '논리 삭제 플래그';

COMMENT ON CONSTRAINT fk_payment_transactions__partner_id ON fim.payment_transactions IS '거래처 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_payment_transactions__account_id ON fim.payment_transactions IS '계정과목 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_payment_transactions__currency ON fim.payment_transactions IS '통화 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_payment_transactions__code
    ON fim.payment_transactions (transaction_code)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ux_payment_transactions__code IS '거래 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_payment_transactions__transaction_date
    ON fim.payment_transactions (transaction_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_payment_transactions__transaction_date IS '거래일자 조회 인덱스';

CREATE INDEX ix_payment_transactions__partner_id
    ON fim.payment_transactions (partner_id, transaction_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_payment_transactions__partner_id IS '거래처별 거래 내역 조회 인덱스';

CREATE INDEX ix_payment_transactions__account_id
    ON fim.payment_transactions (account_id, transaction_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_payment_transactions__account_id IS '계정과목별 거래 내역 조회 인덱스';

CREATE INDEX ix_payment_transactions__payment_method
    ON fim.payment_transactions (payment_method, transaction_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_payment_transactions__payment_method IS '결제 수단별 조회 인덱스';

CREATE INDEX ix_payment_transactions__reference
    ON fim.payment_transactions (ref_doc_type, ref_doc_id)
 WHERE ref_doc_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_payment_transactions__reference IS '참조 문서별 조회 인덱스';
