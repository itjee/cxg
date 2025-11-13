-- ============================================================================
-- Financial Management Schema (fim)
-- ============================================================================
-- Description: 재무/관리회계 스키마 (계정과목, 분개, 채권/채무, 결제, 예산)
-- Database: tnnt_db (Tenant Database)
-- Schema: fim
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS fim;

COMMENT ON SCHEMA fim IS 'FIM: 재무/관리회계 스키마 (계정과목, 분개, 채권/채무, 결제, 예산)';

-- =====================================================================================
-- 테이블: fim.accounts
-- 설명: 회계 계정과목 정보를 관리하는 테이블 (자산, 부채, 자본, 수익, 비용)
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.accounts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 계정과목 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 계정과목 기본 정보
    account_code            VARCHAR(50)              NOT NULL,                                           -- 계정과목 코드
    account_name            VARCHAR(200)             NOT NULL,                                           -- 계정과목 명칭
    account_name_en         VARCHAR(200),                                                                -- 계정과목 영문명 -- 추가
    
    -- 계정 분류
    account_type            VARCHAR(20)              NOT NULL,                                           -- 계정 유형 (ASSET/LIABILITY/EQUITY/REVENUE/EXPENSE)
    account_group           VARCHAR(50),                                                                 -- 계정 그룹 (유동자산/비유동자산/영업수익/영업외수익 등)
    account_class           VARCHAR(50),                                                                 -- 계정 분류 (현금성자산/매출채권/재고자산 등) -- 추가
    
    -- 계층 구조
    parent_account_id       UUID,                                                                        -- 상위 계정과목 식별자
    level_depth             INTEGER                  DEFAULT 1,                                          -- 계층 깊이 (1=대분류, 2=중분류, 3=소분류) -- 추가
    full_path               VARCHAR(500),                                                                -- 전체 경로 -- 추가
    
    -- 계정 속성
    is_control_account      BOOLEAN                  DEFAULT false,                                      -- 통제계정 여부 (하위계정 관리)
    is_posting_allowed      BOOLEAN                  DEFAULT true,                                       -- 전기 허용 여부
    is_bank_account         BOOLEAN                  DEFAULT false,                                      -- 은행계정 여부 -- 추가
    is_cash_account         BOOLEAN                  DEFAULT false,                                      -- 현금계정 여부 -- 추가
    
    -- 통화 및 재무제표
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 기본 통화 (ISO 4217)
    fs_position             VARCHAR(50),                                                                 -- 재무제표 표시 위치 -- 추가
    statement_order         INTEGER                  DEFAULT 0,                                          -- 재무제표 표시 순서 -- 추가
    
    -- 세무 정보
    tax_category            VARCHAR(20),                                                                 -- 세금 분류 -- 추가
    tax_code                VARCHAR(20),                                                                 -- 세금 코드 -- 추가
    
    -- 추가 정보
    description             TEXT,                                                                        -- 계정 설명
    notes                   TEXT,                                                                        -- 비고
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 사용 여부
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 계정 유형 체크 (ASSET: 자산, LIABILITY: 부채, EQUITY: 자본, REVENUE: 수익, EXPENSE: 비용)
    CONSTRAINT ck_fim_accounts__account_type        CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_fim_accounts__currency            CHECK (currency ~ '^[A-Z]{3}$'),
    -- 계층 깊이 범위 체크 (1~10단계)
    CONSTRAINT ck_fim_accounts__level_depth         CHECK (level_depth BETWEEN 1 AND 10),
    -- 표시 순서 양수 체크
    CONSTRAINT ck_fim_accounts__statement_order     CHECK (statement_order >= 0),
    -- 자기 참조 방지 체크
    CONSTRAINT ck_fim_accounts__parent_not_self     CHECK (parent_account_id != id)
);

COMMENT ON TABLE  fim.accounts                   IS '회계 계정과목 정보 관리 테이블 (자산, 부채, 자본, 수익, 비용)';
COMMENT ON COLUMN fim.accounts.id                IS '계정과목 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.accounts.created_at        IS '등록 일시';
COMMENT ON COLUMN fim.accounts.created_by        IS '등록자 UUID';
COMMENT ON COLUMN fim.accounts.updated_at        IS '수정 일시';
COMMENT ON COLUMN fim.accounts.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN fim.accounts.account_code      IS '계정과목 코드';
COMMENT ON COLUMN fim.accounts.account_name      IS '계정과목 명칭';
COMMENT ON COLUMN fim.accounts.account_name_en   IS '계정과목 영문명';
COMMENT ON COLUMN fim.accounts.account_type      IS '계정 유형 (ASSET: 자산/LIABILITY: 부채/EQUITY: 자본/REVENUE: 수익/EXPENSE: 비용)';
COMMENT ON COLUMN fim.accounts.account_group     IS '계정 그룹 (유동자산/비유동자산/영업수익/영업외수익 등)';
COMMENT ON COLUMN fim.accounts.account_class     IS '계정 분류 (현금성자산/매출채권/재고자산 등)';
COMMENT ON COLUMN fim.accounts.parent_account_id IS '상위 계정과목 식별자 (계층구조)';
COMMENT ON COLUMN fim.accounts.level_depth       IS '계층 깊이 (1=대분류, 2=중분류, 3=소분류)';
COMMENT ON COLUMN fim.accounts.full_path         IS '전체 경로';
COMMENT ON COLUMN fim.accounts.is_control_account IS '통제계정 여부 (하위계정 관리)';
COMMENT ON COLUMN fim.accounts.is_posting_allowed IS '전기 허용 여부';
COMMENT ON COLUMN fim.accounts.is_bank_account   IS '은행계정 여부';
COMMENT ON COLUMN fim.accounts.is_cash_account   IS '현금계정 여부';
COMMENT ON COLUMN fim.accounts.currency          IS '기본 통화 (ISO 4217)';
COMMENT ON COLUMN fim.accounts.fs_position       IS '재무제표 표시 위치';
COMMENT ON COLUMN fim.accounts.statement_order   IS '재무제표 표시 순서';
COMMENT ON COLUMN fim.accounts.tax_category      IS '세금 분류';
COMMENT ON COLUMN fim.accounts.tax_code          IS '세금 코드';
COMMENT ON COLUMN fim.accounts.description       IS '계정 설명';
COMMENT ON COLUMN fim.accounts.notes             IS '비고';
COMMENT ON COLUMN fim.accounts.is_active         IS '사용 여부';
COMMENT ON COLUMN fim.accounts.is_deleted        IS '논리 삭제 플래그';
-- =====================================================================================
-- 테이블: fim.journal_entries
-- 설명: 회계 분개 전표 헤더 정보를 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.journal_entries 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 분개 전표 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 전표 기본 정보
    je_code                 VARCHAR(50)              NOT NULL,                                           -- 분개 전표 코드
    je_type                 VARCHAR(20)              DEFAULT 'GENERAL',                                  -- 전표 유형 (GENERAL/PURCHASE/SALES/PAYROLL/ADJUSTMENT) -- 추가
    doc_date                DATE                     NOT NULL,                                           -- 전표 일자 (문서 일자)
    posting_date            DATE                     NOT NULL,                                           -- 전기 일자
    period                  VARCHAR(7)               NOT NULL,                                           -- 회계 기간 (YYYY-MM)
    fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 -- 추가
    
    -- 참조 정보
    reference_doc_type      VARCHAR(50),                                                                 -- 참조 문서 유형 (구매전표/판매전표/급여전표 등)
    reference_doc_id        UUID,                                                                        -- 참조 문서 식별자
    reference_number        VARCHAR(100),                                                                -- 참조 번호 -- 추가
    
    -- 금액 정보
    total_debit             NUMERIC(18,4)            DEFAULT 0,                                          -- 총 차변 금액
    total_credit            NUMERIC(18,4)            DEFAULT 0,                                          -- 총 대변 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)
    exchange_rate           NUMERIC(15,6)            DEFAULT 1,                                          -- 환율 -- 추가
    
    -- 전표 내용
    description             TEXT,                                                                        -- 적요 (전표 설명)
    memo                    TEXT,                                                                        -- 메모 -- 추가
    
    -- 상태 및 승인
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                                    -- 상태 (DRAFT/POSTED/REVERSED/CANCELLED)
    posted_at               TIMESTAMP                WITH TIME ZONE,                                     -- 전기 일시
    posted_by               UUID,                                                                        -- 전기자 UUID
    approved_by             UUID,                                                                        -- 승인자 UUID -- 추가
    approved_at             TIMESTAMP                WITH TIME ZONE,                                     -- 승인 일시 -- 추가
    reversed_je_id          UUID,                                                                        -- 역분개 전표 ID -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 전표 유형 체크 (GENERAL: 일반, PURCHASE: 매입, SALES: 매출, PAYROLL: 급여, ADJUSTMENT: 조정)
    CONSTRAINT ck_fim_journal_entries__je_type      CHECK (je_type IN ('GENERAL', 'PURCHASE', 'SALES', 'PAYROLL', 'ADJUSTMENT', 'CLOSING')),
    -- 상태 체크 (DRAFT: 임시저장, POSTED: 전기완료, REVERSED: 역분개, CANCELLED: 취소)
    CONSTRAINT ck_fim_journal_entries__status       CHECK (status IN ('DRAFT', 'POSTED', 'REVERSED', 'CANCELLED')),
    -- 회계기간 형식 체크 (YYYY-MM)
    CONSTRAINT ck_fim_journal_entries__period       CHECK (period ~ '^\d{4}-\d{2}$'),
    -- 차대평균 체크 (차변과 대변 합계 일치)
    CONSTRAINT ck_fim_journal_entries__balance      CHECK (total_debit = total_credit),
    -- 통화 코드 형식 체크
    CONSTRAINT ck_fim_journal_entries__currency     CHECK (currency ~ '^[A-Z]{3}$'),
    -- 환율 양수 체크
    CONSTRAINT ck_fim_journal_entries__exchange_rate CHECK (exchange_rate > 0)
);

COMMENT ON TABLE  fim.journal_entries                    IS '회계 분개 전표 헤더 정보 관리 테이블';
COMMENT ON COLUMN fim.journal_entries.id                 IS '분개 전표 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.journal_entries.created_at         IS '등록 일시';
COMMENT ON COLUMN fim.journal_entries.created_by         IS '등록자 UUID';
COMMENT ON COLUMN fim.journal_entries.updated_at         IS '수정 일시';
COMMENT ON COLUMN fim.journal_entries.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN fim.journal_entries.je_code            IS '분개 전표 코드';
COMMENT ON COLUMN fim.journal_entries.je_type            IS '전표 유형 (GENERAL: 일반/PURCHASE: 매입/SALES: 매출/PAYROLL: 급여/ADJUSTMENT: 조정/CLOSING: 결산)';
COMMENT ON COLUMN fim.journal_entries.doc_date           IS '전표 일자 (문서 일자)';
COMMENT ON COLUMN fim.journal_entries.posting_date       IS '전기 일자';
COMMENT ON COLUMN fim.journal_entries.period             IS '회계 기간 (YYYY-MM)';
COMMENT ON COLUMN fim.journal_entries.fiscal_year        IS '회계 연도';
COMMENT ON COLUMN fim.journal_entries.reference_doc_type IS '참조 문서 유형 (구매전표/판매전표/급여전표 등)';
COMMENT ON COLUMN fim.journal_entries.reference_doc_id   IS '참조 문서 식별자';
COMMENT ON COLUMN fim.journal_entries.reference_number   IS '참조 번호';
COMMENT ON COLUMN fim.journal_entries.total_debit        IS '총 차변 금액';
COMMENT ON COLUMN fim.journal_entries.total_credit       IS '총 대변 금액';
COMMENT ON COLUMN fim.journal_entries.currency           IS '통화 (ISO 4217)';
COMMENT ON COLUMN fim.journal_entries.exchange_rate      IS '환율';
COMMENT ON COLUMN fim.journal_entries.description        IS '적요 (전표 설명)';
COMMENT ON COLUMN fim.journal_entries.memo               IS '메모';
COMMENT ON COLUMN fim.journal_entries.status             IS '상태 (DRAFT: 임시저장/POSTED: 전기완료/REVERSED: 역분개/CANCELLED: 취소)';
COMMENT ON COLUMN fim.journal_entries.posted_at          IS '전기 일시';
COMMENT ON COLUMN fim.journal_entries.posted_by          IS '전기자 UUID';
COMMENT ON COLUMN fim.journal_entries.approved_by        IS '승인자 UUID';
COMMENT ON COLUMN fim.journal_entries.approved_at        IS '승인 일시';
COMMENT ON COLUMN fim.journal_entries.reversed_je_id     IS '역분개 전표 ID';
COMMENT ON COLUMN fim.journal_entries.is_deleted         IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: fim.journal_entry_lines
-- 설명: 회계 분개 전표 상세 라인 정보를 관리하는 테이블 (차변/대변)
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.journal_entry_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 분개 라인 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 분개 전표 참조
    je_id                   UUID                     NOT NULL,                                           -- 분개 전표 식별자
    line_no                 INTEGER                  NOT NULL,                                           -- 라인 번호 (순서)
    
    -- 계정 정보
    account_id              UUID                     NOT NULL,                                           -- 계정과목 식별자
    
    -- 금액 정보
    debit_amount            NUMERIC(18,4)            DEFAULT 0,                                          -- 차변 금액
    credit_amount           NUMERIC(18,4)            DEFAULT 0,                                          -- 대변 금액
    
    -- 상세 정보
    description             TEXT,                                                                        -- 적요 (라인별 설명)
    
    -- 원가 및 관리 정보
    cost_center             VARCHAR(50),                                                                 -- 원가센터 코드
    cost_center_id          UUID,                                                                        -- 원가센터 식별자 -- 추가
    project_code            VARCHAR(50),                                                                 -- 프로젝트 코드
    project_id              UUID,                                                                        -- 프로젝트 식별자 -- 추가
    department_id           UUID,                                                                        -- 부서 식별자 -- 추가
    
    -- 거래처 정보
    partner_id              UUID,                                                                        -- 거래처 식별자
    partner_type            VARCHAR(20),                                                                 -- 거래처 유형 (CUSTOMER/VENDOR/EMPLOYEE) -- 추가
    
    -- 세무 정보
    tax_code                VARCHAR(20),                                                                 -- 세금 코드 -- 추가
    tax_amount              NUMERIC(18,4)            DEFAULT 0,                                          -- 세액 -- 추가
    
    -- 수량 정보 (재고 관련)
    quantity                NUMERIC(15,3),                                                               -- 수량 -- 추가
    unit_price              NUMERIC(18,4),                                                               -- 단가 -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 차변 또는 대변 중 하나만 입력 (둘 다 0이거나 둘 다 값이 있으면 안됨)
    CONSTRAINT ck_fim_je_lines__debit_or_credit     CHECK ((debit_amount > 0 AND credit_amount = 0) OR (debit_amount = 0 AND credit_amount > 0)),
    -- 라인 번호 양수 체크
    CONSTRAINT ck_fim_je_lines__line_no             CHECK (line_no > 0),
    -- 거래처 유형 체크
    CONSTRAINT ck_fim_je_lines__partner_type        CHECK (partner_type IS NULL OR partner_type IN ('CUSTOMER', 'VENDOR', 'EMPLOYEE', 'OTHER'))
);

COMMENT ON TABLE  fim.journal_entry_lines                    IS '회계 분개 전표 상세 라인 정보 관리 테이블 (차변/대변)';
COMMENT ON COLUMN fim.journal_entry_lines.id                 IS '분개 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.journal_entry_lines.created_at         IS '등록 일시';
COMMENT ON COLUMN fim.journal_entry_lines.created_by         IS '등록자 UUID';
COMMENT ON COLUMN fim.journal_entry_lines.updated_at         IS '수정 일시';
COMMENT ON COLUMN fim.journal_entry_lines.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN fim.journal_entry_lines.je_id              IS '분개 전표 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.line_no            IS '라인 번호 (순서)';
COMMENT ON COLUMN fim.journal_entry_lines.account_id         IS '계정과목 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.debit_amount       IS '차변 금액';
COMMENT ON COLUMN fim.journal_entry_lines.credit_amount      IS '대변 금액';
COMMENT ON COLUMN fim.journal_entry_lines.description        IS '적요 (라인별 설명)';
COMMENT ON COLUMN fim.journal_entry_lines.cost_center        IS '원가센터 코드';
COMMENT ON COLUMN fim.journal_entry_lines.cost_center_id     IS '원가센터 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.project_code       IS '프로젝트 코드';
COMMENT ON COLUMN fim.journal_entry_lines.project_id         IS '프로젝트 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.department_id      IS '부서 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.partner_id         IS '거래처 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.partner_type       IS '거래처 유형 (CUSTOMER: 고객/VENDOR: 공급업체/EMPLOYEE: 임직원/OTHER: 기타)';
COMMENT ON COLUMN fim.journal_entry_lines.tax_code           IS '세금 코드';
COMMENT ON COLUMN fim.journal_entry_lines.tax_amount         IS '세액';
COMMENT ON COLUMN fim.journal_entry_lines.quantity           IS '수량 (재고 관련)';
COMMENT ON COLUMN fim.journal_entry_lines.unit_price         IS '단가';
COMMENT ON COLUMN fim.journal_entry_lines.is_deleted         IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: fim.accounts_receivable
-- 설명: 매출채권 정보를 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.accounts_receivable 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 매출채권 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 채권 기본 정보
    ar_code                 VARCHAR(50)              NOT NULL,                                           -- 매출채권 코드
    customer_id             UUID                     NOT NULL,                                           -- 고객 식별자
    
    -- 일자 정보
    doc_date                DATE                     NOT NULL,                                           -- 채권 발생 일자
    due_date                DATE                     NOT NULL,                                           -- 결제 예정일
    payment_terms           VARCHAR(50),                                                                 -- 결제 조건 (NET30/NET60/COD 등) -- 추가
    
    -- 금액 정보
    invoice_amount          NUMERIC(18,4)            NOT NULL,                                           -- 채권 발생 금액 (세금 포함)
    tax_amount              NUMERIC(18,4)            DEFAULT 0,                                          -- 세액 -- 추가
    paid_amount             NUMERIC(18,4)            DEFAULT 0,                                          -- 입금된 금액
    outstanding_amount      NUMERIC(18,4)            NOT NULL,                                           -- 미수금 잔액
    discount_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 할인 금액 -- 추가
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)
    
    -- 참조 정보
    reference_doc_type      VARCHAR(50),                                                                 -- 참조 문서 유형 (판매전표/세금계산서 등)
    reference_doc_id        UUID,                                                                        -- 참조 문서 식별자
    invoice_number          VARCHAR(100),                                                                -- 송장 번호 -- 추가
    
    -- 상태 정보
    status                  VARCHAR(20)              DEFAULT 'OPEN',                                     -- 상태 (OPEN/PARTIAL/PAID/OVERDUE/CANCELLED)
    last_payment_date       DATE,                                                                        -- 최근 입금 일자 -- 추가
    overdue_days            INTEGER                  DEFAULT 0,                                          -- 연체 일수 -- 추가
    
    -- 추심 정보
    collection_status       VARCHAR(20),                                                                 -- 추심 상태 (NORMAL/WARNING/LEGAL) -- 추가
    collection_notes        TEXT,                                                                        -- 추심 메모 -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 상태 체크 (OPEN: 미수, PARTIAL: 부분입금, PAID: 완료, OVERDUE: 연체, CANCELLED: 취소)
    CONSTRAINT ck_fim_accounts_receivable__status   CHECK (status IN ('OPEN', 'PARTIAL', 'PAID', 'overdue', 'CANCELLED')),
    -- 통화 코드 형식 체크
    CONSTRAINT ck_fim_accounts_receivable__currency CHECK (currency ~ '^[A-Z]{3}$'),
    -- 금액 유효성 체크
    CONSTRAINT ck_fim_accounts_receivable__amounts  CHECK (invoice_amount >= 0 AND paid_amount >= 0 AND outstanding_amount >= 0),
    -- 미수금 잔액 계산 체크
    CONSTRAINT ck_fim_accounts_receivable__balance  CHECK (outstanding_amount = invoice_amount - paid_amount - discount_amount),
    -- 추심 상태 체크
    CONSTRAINT ck_fim_accounts_receivable__collection CHECK (collection_status IS NULL OR collection_status IN ('NORMAL', 'WARNING', 'LEGAL'))
);

COMMENT ON TABLE  fim.accounts_receivable                         IS '매출채권 정보 관리 테이블';
COMMENT ON COLUMN fim.accounts_receivable.id                      IS '매출채권 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.accounts_receivable.created_at              IS '등록 일시';
COMMENT ON COLUMN fim.accounts_receivable.created_by              IS '등록자 UUID';
COMMENT ON COLUMN fim.accounts_receivable.updated_at              IS '수정 일시';
COMMENT ON COLUMN fim.accounts_receivable.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN fim.accounts_receivable.ar_code                 IS '매출채권 코드';
COMMENT ON COLUMN fim.accounts_receivable.customer_id             IS '고객 식별자';
COMMENT ON COLUMN fim.accounts_receivable.doc_date                IS '채권 발생 일자';
COMMENT ON COLUMN fim.accounts_receivable.due_date                IS '결제 예정일';
COMMENT ON COLUMN fim.accounts_receivable.payment_terms           IS '결제 조건 (NET30/NET60/COD 등)';
COMMENT ON COLUMN fim.accounts_receivable.invoice_amount          IS '채권 발생 금액 (세금 포함)';
COMMENT ON COLUMN fim.accounts_receivable.tax_amount              IS '세액';
COMMENT ON COLUMN fim.accounts_receivable.paid_amount             IS '입금된 금액';
COMMENT ON COLUMN fim.accounts_receivable.outstanding_amount      IS '미수금 잔액';
COMMENT ON COLUMN fim.accounts_receivable.discount_amount         IS '할인 금액';
COMMENT ON COLUMN fim.accounts_receivable.currency                IS '통화 (ISO 4217)';
COMMENT ON COLUMN fim.accounts_receivable.reference_doc_type      IS '참조 문서 유형 (판매전표/세금계산서 등)';
COMMENT ON COLUMN fim.accounts_receivable.reference_doc_id        IS '참조 문서 식별자';
COMMENT ON COLUMN fim.accounts_receivable.invoice_number          IS '송장 번호';
COMMENT ON COLUMN fim.accounts_receivable.status                  IS '상태 (OPEN: 미수/PARTIAL: 부분입금/PAID: 완료/OVERDUE: 연체/CANCELLED: 취소)';
COMMENT ON COLUMN fim.accounts_receivable.last_payment_date       IS '최근 입금 일자';
COMMENT ON COLUMN fim.accounts_receivable.overdue_days            IS '연체 일수';
COMMENT ON COLUMN fim.accounts_receivable.collection_status       IS '추심 상태 (NORMAL: 정상/WARNING: 경고/LEGAL: 법적조치)';
COMMENT ON COLUMN fim.accounts_receivable.collection_notes        IS '추심 메모';
COMMENT ON COLUMN fim.accounts_receivable.is_deleted              IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: fim.accounts_payable
-- 설명: 매입채무 정보를 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.accounts_payable 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 매입채무 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 채무 기본 정보
    ap_code                 VARCHAR(50)              NOT NULL,                                           -- 매입채무 코드
    vendor_id               UUID                     NOT NULL,                                           -- 공급업체 식별자
    
    -- 일자 정보
    doc_date                DATE                     NOT NULL,                                           -- 채무 발생 일자
    due_date                DATE                     NOT NULL,                                           -- 지급 예정일
    payment_terms           VARCHAR(50),                                                                 -- 지급 조건 (NET30/NET60/COD 등) -- 추가
    
    -- 금액 정보
    invoice_amount          NUMERIC(18,4)            NOT NULL,                                           -- 채무 발생 금액 (세금 포함)
    tax_amount              NUMERIC(18,4)            DEFAULT 0,                                          -- 세액 -- 추가
    paid_amount             NUMERIC(18,4)            DEFAULT 0,                                          -- 지급된 금액
    outstanding_amount      NUMERIC(18,4)            NOT NULL,                                           -- 미지급금 잔액
    discount_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 할인 금액 -- 추가
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)
    
    -- 참조 정보
    reference_doc_type      VARCHAR(50),                                                                 -- 참조 문서 유형 (구매전표/세금계산서 등)
    reference_doc_id        UUID,                                                                        -- 참조 문서 식별자
    invoice_number          VARCHAR(100),                                                                -- 송장 번호 -- 추가
    
    -- 상태 정보
    status                  VARCHAR(20)              DEFAULT 'OPEN',                                     -- 상태 (OPEN/PARTIAL/PAID/OVERDUE/CANCELLED)
    last_payment_date       DATE,                                                                        -- 최근 지급 일자 -- 추가
    overdue_days            INTEGER                  DEFAULT 0,                                          -- 연체 일수 -- 추가
    
    -- 승인 정보
    approval_status         VARCHAR(20)              DEFAULT 'PENDING',                                  -- 승인 상태 (PENDING/APPROVED/REJECTED) -- 추가
    approved_by             UUID,                                                                        -- 승인자 UUID -- 추가
    approved_at             TIMESTAMP                WITH TIME ZONE,                                     -- 승인 일시 -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 상태 체크 (OPEN: 미지급, PARTIAL: 부분지급, PAID: 완료, OVERDUE: 연체, CANCELLED: 취소)
    CONSTRAINT ck_fim_accounts_payable__status      CHECK (status IN ('OPEN', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED')),
    -- 통화 코드 형식 체크
    CONSTRAINT ck_fim_accounts_payable__currency    CHECK (currency ~ '^[A-Z]{3}$'),
    -- 금액 유효성 체크
    CONSTRAINT ck_fim_accounts_payable__amounts     CHECK (invoice_amount >= 0 AND paid_amount >= 0 AND outstanding_amount >= 0),
    -- 미지급금 잔액 계산 체크
    CONSTRAINT ck_fim_accounts_payable__balance     CHECK (outstanding_amount = invoice_amount - paid_amount - discount_amount),
    -- 승인 상태 체크
    CONSTRAINT ck_fim_accounts_payable__approval    CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

COMMENT ON TABLE  fim.accounts_payable                            IS '매입채무 정보 관리 테이블';
COMMENT ON COLUMN fim.accounts_payable.id                         IS '매입채무 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.accounts_payable.created_at                 IS '등록 일시';
COMMENT ON COLUMN fim.accounts_payable.created_by                 IS '등록자 UUID';
COMMENT ON COLUMN fim.accounts_payable.updated_at                 IS '수정 일시';
COMMENT ON COLUMN fim.accounts_payable.updated_by                 IS '수정자 UUID';
COMMENT ON COLUMN fim.accounts_payable.ap_code                    IS '매입채무 코드';
COMMENT ON COLUMN fim.accounts_payable.vendor_id                  IS '공급업체 식별자';
COMMENT ON COLUMN fim.accounts_payable.doc_date                   IS '채무 발생 일자';
COMMENT ON COLUMN fim.accounts_payable.due_date                   IS '지급 예정일';
COMMENT ON COLUMN fim.accounts_payable.payment_terms              IS '지급 조건 (NET30/NET60/COD 등)';
COMMENT ON COLUMN fim.accounts_payable.invoice_amount             IS '채무 발생 금액 (세금 포함)';
COMMENT ON COLUMN fim.accounts_payable.tax_amount                 IS '세액';
COMMENT ON COLUMN fim.accounts_payable.paid_amount                IS '지급된 금액';
COMMENT ON COLUMN fim.accounts_payable.outstanding_amount         IS '미지급금 잔액';
COMMENT ON COLUMN fim.accounts_payable.discount_amount            IS '할인 금액';
COMMENT ON COLUMN fim.accounts_payable.currency                   IS '통화 (ISO 4217)';
COMMENT ON COLUMN fim.accounts_payable.reference_doc_type         IS '참조 문서 유형 (구매전표/세금계산서 등)';
COMMENT ON COLUMN fim.accounts_payable.reference_doc_id           IS '참조 문서 식별자';
COMMENT ON COLUMN fim.accounts_payable.invoice_number             IS '송장 번호';
COMMENT ON COLUMN fim.accounts_payable.status                     IS '상태 (OPEN: 미지급/PARTIAL: 부분지급/PAID: 완료/OVERDUE: 연체/CANCELLED: 취소)';
COMMENT ON COLUMN fim.accounts_payable.last_payment_date          IS '최근 지급 일자';
COMMENT ON COLUMN fim.accounts_payable.overdue_days               IS '연체 일수';
COMMENT ON COLUMN fim.accounts_payable.approval_status            IS '승인 상태 (PENDING: 대기/APPROVED: 승인/REJECTED: 반려)';
COMMENT ON COLUMN fim.accounts_payable.approved_by                IS '승인자 UUID';
COMMENT ON COLUMN fim.accounts_payable.approved_at                IS '승인 일시';
COMMENT ON COLUMN fim.accounts_payable.is_deleted                 IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: fim.payment_transactions
-- 설명: 입출금 거래 내역을 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.payment_transactions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 거래 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 거래 기본 정보
    transaction_code        VARCHAR(50)              NOT NULL,                                           -- 거래 코드
    transaction_date        DATE                     NOT NULL,                                           -- 거래 일자
    transaction_type        VARCHAR(20)              NOT NULL,                                           -- 거래 유형 (RECEIPT/PAYMENT)
    
    -- 결제 수단
    payment_method          VARCHAR(20)              NOT NULL,                                           -- 결제 수단 (CASH/BANK_TRANSFER/CREDIT_CARD/CHECK/VIRTUAL_ACCOUNT)
    payment_status          VARCHAR(20)              DEFAULT 'COMPLETED',                                -- 결제 상태 (PENDING/COMPLETED/CANCELLED/FAILED) -- 추가
    
    -- 거래처 및 계정
    partner_id              UUID                     NOT NULL,                                           -- 거래처 식별자
    partner_type            VARCHAR(20),                                                                 -- 거래처 유형 (CUSTOMER/VENDOR/EMPLOYEE) -- 추가
    account_id              UUID                     NOT NULL,                                           -- 계정과목 식별자
    
    -- 금액 정보
    amount                  NUMERIC(18,4)            NOT NULL,                                           -- 거래 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)
    exchange_rate           NUMERIC(15,6)            DEFAULT 1,                                          -- 환율 -- 추가
    fee_amount              NUMERIC(18,4)            DEFAULT 0,                                          -- 수수료 금액 -- 추가
    
    -- 참조 정보
    reference_doc_type      VARCHAR(50),                                                                 -- 참조 문서 유형 (AR/AP/기타)
    reference_doc_id        UUID,                                                                        -- 참조 문서 식별자
    reference_number        VARCHAR(100),                                                                -- 참조 번호 -- 추가
    
    -- 은행 및 계좌 정보
    bank_name               VARCHAR(100),                                                                -- 은행명 -- 추가
    bank_account            VARCHAR(50),                                                                 -- 은행 계좌 번호
    bank_account_holder     VARCHAR(100),                                                                -- 예금주명 -- 추가
    check_number            VARCHAR(50),                                                                 -- 수표 번호
    card_number             VARCHAR(20),                                                                 -- 카드 번호 (마스킹) -- 추가
    
    -- 거래 내용
    description             TEXT,                                                                        -- 거래 설명
    memo                    TEXT,                                                                        -- 메모 -- 추가
    
    -- 승인 정보
    approval_code           VARCHAR(50),                                                                 -- 승인 코드 (카드 거래) -- 추가
    approved_at             TIMESTAMP                WITH TIME ZONE,                                     -- 승인 일시 -- 추가
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'COMPLETED',                                -- 상태 (COMPLETED/CANCELLED/PENDING)
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 거래 유형 체크 (RECEIPT: 입금, PAYMENT: 출금)
    CONSTRAINT ck_fim_payment_transactions__type    CHECK (transaction_type IN ('RECEIPT', 'PAYMENT')),
    -- 결제 수단 체크
    CONSTRAINT ck_fim_payment_transactions__method  CHECK (payment_method IN ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'VIRTUAL_ACCOUNT', 'MOBILE_PAYMENT')),
    -- 결제 상태 체크
    CONSTRAINT ck_fim_payment_transactions__payment_status CHECK (payment_status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED')),
    -- 상태 체크
    CONSTRAINT ck_fim_payment_transactions__status  CHECK (status IN ('COMPLETED', 'CANCELLED', 'PENDING', 'FAILED')),
    -- 통화 코드 형식 체크
    CONSTRAINT ck_fim_payment_transactions__currency CHECK (currency ~ '^[A-Z]{3}$'),
    -- 금액 양수 체크
    CONSTRAINT ck_fim_payment_transactions__amount  CHECK (amount > 0),
    -- 환율 양수 체크
    CONSTRAINT ck_fim_payment_transactions__exchange_rate CHECK (exchange_rate > 0),
    -- 거래처 유형 체크
    CONSTRAINT ck_fim_payment_transactions__partner_type CHECK (partner_type IS NULL OR partner_type IN ('CUSTOMER', 'VENDOR', 'EMPLOYEE', 'OTHER'))
);
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
COMMENT ON COLUMN fim.payment_transactions.reference_doc_type     IS '참조 문서 유형 (AR: 매출채권/AP: 매입채무/기타)';
COMMENT ON COLUMN fim.payment_transactions.reference_doc_id       IS '참조 문서 식별자';
COMMENT ON COLUMN fim.payment_transactions.reference_number       IS '참조 번호';
COMMENT ON COLUMN fim.payment_transactions.bank_name              IS '은행명';
COMMENT ON COLUMN fim.payment_transactions.bank_account           IS '은행 계좌 번호';
COMMENT ON COLUMN fim.payment_transactions.bank_account_holder    IS '예금주명';
COMMENT ON COLUMN fim.payment_transactions.check_number           IS '수표 번호';
COMMENT ON COLUMN fim.payment_transactions.card_number            IS '카드 번호 (마스킹 처리)';
COMMENT ON COLUMN fim.payment_transactions.description            IS '거래 설명';
COMMENT ON COLUMN fim.payment_transactions.memo                   IS '메모';
COMMENT ON COLUMN fim.payment_transactions.approval_code          IS '승인 코드 (카드 거래)';
COMMENT ON COLUMN fim.payment_transactions.approved_at            IS '승인 일시';
COMMENT ON COLUMN fim.payment_transactions.status                 IS '상태 (COMPLETED: 완료/CANCELLED: 취소/PENDING: 대기/FAILED: 실패)';
COMMENT ON COLUMN fim.payment_transactions.is_deleted             IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- accounts 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_fim_accounts__account_code
    ON fim.accounts (account_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts__account_code IS '계정과목 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts__account_name
    ON fim.accounts (account_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts__account_name IS '계정과목명 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts__account_type
    ON fim.accounts (account_type, account_group)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts__account_type IS '계정 유형 및 그룹별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts__parent_account_id
    ON fim.accounts (parent_account_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts__parent_account_id IS '상위 계정과목별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts__is_active
    ON fim.accounts (is_active, account_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts__is_active IS '사용 여부 및 계정 유형별 조회 인덱스';

-- journal_entries 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_fim_journal_entries__je_code
    ON fim.journal_entries (je_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entries__je_code IS '전표 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_journal_entries__posting_date
    ON fim.journal_entries (posting_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entries__posting_date IS '전기일자 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_journal_entries__period
    ON fim.journal_entries (period, status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entries__period IS '회계기간 및 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_journal_entries__status
    ON fim.journal_entries (status, posting_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entries__status IS '상태 및 전기일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_journal_entries__reference
    ON fim.journal_entries (reference_doc_type, reference_doc_id)
 WHERE reference_doc_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entries__reference IS '참조 문서별 조회 인덱스';

-- journal_entry_lines 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_fim_journal_entry_lines__je_id
    ON fim.journal_entry_lines (je_id, line_no)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entry_lines__je_id IS '전표별 라인 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_journal_entry_lines__account_id
    ON fim.journal_entry_lines (account_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entry_lines__account_id IS '계정과목별 분개 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_journal_entry_lines__partner_id
    ON fim.journal_entry_lines (partner_id)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entry_lines__partner_id IS '거래처별 분개 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_journal_entry_lines__cost_center_id
    ON fim.journal_entry_lines (cost_center_id)
 WHERE cost_center_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entry_lines__cost_center_id IS '원가센터별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_journal_entry_lines__project_id
    ON fim.journal_entry_lines (project_id)
 WHERE project_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_fim_journal_entry_lines__project_id IS '프로젝트별 조회 인덱스';

-- accounts_receivable 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_fim_accounts_receivable__ar_code
    ON fim.accounts_receivable (ar_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts_receivable__ar_code IS '매출채권 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts_receivable__customer_id
    ON fim.accounts_receivable (customer_id, status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts_receivable__customer_id IS '고객별 채권 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts_receivable__due_date
    ON fim.accounts_receivable (due_date, status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts_receivable__due_date IS '만기일 및 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts_receivable__status
    ON fim.accounts_receivable (status, doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts_receivable__status IS '상태별 채권 조회 인덱스';

-- accounts_payable 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_fim_accounts_payable__ap_code
    ON fim.accounts_payable (ap_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts_payable__ap_code IS '매입채무 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts_payable__vendor_id
    ON fim.accounts_payable (vendor_id, status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts_payable__vendor_id IS '공급업체별 채무 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts_payable__due_date
    ON fim.accounts_payable (due_date, status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts_payable__due_date IS '만기일 및 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_accounts_payable__status
    ON fim.accounts_payable (status, doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_accounts_payable__status IS '상태별 채무 조회 인덱스';

-- payment_transactions 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_fim_payment_transactions__transaction_code
    ON fim.payment_transactions (transaction_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_payment_transactions__transaction_code IS '거래 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_payment_transactions__transaction_date
    ON fim.payment_transactions (transaction_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_payment_transactions__transaction_date IS '거래일자 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_payment_transactions__partner_id
    ON fim.payment_transactions (partner_id, transaction_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_payment_transactions__partner_id IS '거래처별 거래 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_payment_transactions__account_id
    ON fim.payment_transactions (account_id, transaction_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_payment_transactions__account_id IS '계정과목별 거래 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_payment_transactions__payment_method
    ON fim.payment_transactions (payment_method, transaction_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_fim_payment_transactions__payment_method IS '결제 수단별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_fim_payment_transactions__reference
    ON fim.payment_transactions (reference_doc_type, reference_doc_id)
 WHERE reference_doc_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_fim_payment_transactions__reference IS '참조 문서별 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 계정과목 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_fim_accounts__code
    ON fim.accounts (account_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_fim_accounts__code IS '계정과목 코드 유니크 제약';

-- 분개 전표 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_fim_journal_entries__code
    ON fim.journal_entries (je_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_fim_journal_entries__code IS '분개 전표 코드 유니크 제약';

-- 분개 라인 번호 유니크 (전표별)
CREATE UNIQUE INDEX IF NOT EXISTS ux_fim_journal_entry_lines__je_line
    ON fim.journal_entry_lines (je_id, line_no)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_fim_journal_entry_lines__je_line IS '전표별 라인 번호 유니크 제약';

-- 매출채권 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_fim_accounts_receivable__code
    ON fim.accounts_receivable (ar_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_fim_accounts_receivable__code IS '매출채권 코드 유니크 제약';

-- 매입채무 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_fim_accounts_payable__code
    ON fim.accounts_payable (ap_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_fim_accounts_payable__code IS '매입채무 코드 유니크 제약';

-- 거래 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_fim_payment_transactions__code
    ON fim.payment_transactions (transaction_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_fim_payment_transactions__code IS '거래 코드 유니크 제약';

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

-- accounts 테이블 외래키
-- 상위 계정과목 참조 외래키
ALTER TABLE fim.accounts ADD CONSTRAINT fk_fim_accounts__parent_account_id
    FOREIGN KEY (parent_account_id) REFERENCES fim.accounts(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_fim_accounts__parent_account_id ON fim.accounts IS '상위 계정과목 참조 외래키 (CASCADE 삭제)';

-- journal_entries 테이블 외래키
-- 역분개 전표 참조 외래키
ALTER TABLE fim.journal_entries ADD CONSTRAINT fk_fim_journal_entries__reversed_je_id
    FOREIGN KEY (reversed_je_id) REFERENCES fim.journal_entries(id) ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_fim_journal_entries__reversed_je_id ON fim.journal_entries IS '역분개 전표 참조 외래키 (SET NULL)';

-- journal_entry_lines 테이블 외래키
-- 분개 전표 참조 외래키
ALTER TABLE fim.journal_entry_lines ADD CONSTRAINT fk_fim_journal_entry_lines__je_id
    FOREIGN KEY (je_id) REFERENCES fim.journal_entries(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_fim_journal_entry_lines__je_id ON fim.journal_entry_lines IS '분개 전표 참조 외래키 (CASCADE 삭제)';

-- 계정과목 참조 외래키
ALTER TABLE fim.journal_entry_lines ADD CONSTRAINT fk_fim_journal_entry_lines__account_id
    FOREIGN KEY (account_id) REFERENCES fim.accounts(id) ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_fim_journal_entry_lines__account_id ON fim.journal_entry_lines IS '계정과목 참조 외래키 (RESTRICT 삭제)';

