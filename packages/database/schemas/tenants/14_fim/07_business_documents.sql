-- =====================================================================================
-- 테이블: fim.business_documents
-- 설명: 업무전표 - 업무 문서와 회계 분개를 연결하는 전표
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.business_documents 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 업무전표 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 전표 기본 정보
    biz_doc_no              VARCHAR(50)              NOT NULL,                               -- 전표 번호
    biz_doc_date            DATE                     NOT NULL,                               -- 전표 일자
    biz_doc_type            VARCHAR(30)              NOT NULL,                               -- 전표 유형
    
    -- 원천 문서 정보
    source_module           VARCHAR(20)              NOT NULL,                               -- 원천 모듈
    source_type             VARCHAR(30)              NOT NULL,                               -- 원천 유형
    source_id               UUID                     NOT NULL,                               -- 원천 문서 ID
    source_no               VARCHAR(50),                                                     -- 원천 문서 번호
    source_line_id          UUID,                                                            -- 원천 문서 라인 ID (선택)
    
    -- 회계 정보
    fiscal_year             INTEGER                  NOT NULL,                               -- 회계연도
    fiscal_period           INTEGER                  NOT NULL,                               -- 회계기간(월)
    account_date            DATE                     NOT NULL,                               -- 회계처리일
    
    -- 금액 정보
    total_amount            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 전표 금액
    tax_amount              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 세액
    currency_code           VARCHAR(3)               NOT NULL,                               -- 통화
    exchange_rate           NUMERIC(18,6)            DEFAULT 1,                              -- 환율
    
    -- 거래처 정보
    partner_id              UUID,                                                            -- 거래처 ID
    partner_name            VARCHAR(200),                                                    -- 거래처명 (스냅샷)
    
    -- 부서/프로젝트 정보
    department_id           UUID,                                                            -- 부서
    cost_center_code        VARCHAR(20),                                                     -- 원가센터
    project_code            VARCHAR(50),                                                     -- 프로젝트 코드
    
    -- 분개 연결
    journal_entry_id        UUID,                                                            -- 분개 ID
    
    -- 전기 정보
    is_posted               BOOLEAN                  NOT NULL DEFAULT false,                 -- 전기 여부
    posted_at               TIMESTAMP WITH TIME ZONE,                                        -- 전기 일시
    posted_by               UUID,                                                            -- 전기자
    
    -- 취소/역분개 정보
    is_cancelled            BOOLEAN                  NOT NULL DEFAULT false,                 -- 취소 여부
    cancelled_at            TIMESTAMP WITH TIME ZONE,                                        -- 취소 일시
    cancelled_by            UUID,                                                            -- 취소자
    cancelled_reason        TEXT,                                                            -- 취소 사유
    reversed_document_id    UUID,                                                            -- 역분개 전표 ID
    
    -- 승인 정보
    approval_status         VARCHAR(20),                                                     -- 승인 상태
    approved_by             UUID,                                                            -- 승인자
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    
    -- 세무 정보
    tax_invoice_no          VARCHAR(50),                                                     -- 세금계산서 번호
    tax_invoice_date        DATE,                                                            -- 세금계산서 발행일
    
    -- 비고
    description             TEXT,                                                            -- 적요
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부
    
    -- 전표 유형 체크
    CONSTRAINT ck_business_documents__type
        CHECK (biz_doc_type IN (
            'PURCHASE_ORDER', 'PURCHASE_RECEIPT', 'PURCHASE_RETURN', 'PURCHASE_TAX_INVOICE',
            'SALES_ORDER', 'SALES_SHIPMENT', 'SALES_RETURN', 'SALES_TAX_INVOICE', 'COST_OF_SALES',
            'INVENTORY_IN', 'INVENTORY_OUT', 'INVENTORY_ADJUSTMENT', 'INVENTORY_TRANSFER', 'INVENTORY_VALUATION',
            'RECEIPT', 'PAYMENT', 'TRANSFER', 'NOTE_RECEIPT', 'NOTE_PAYMENT',
            'PAYROLL', 'PAYROLL_PAYMENT', 'SOCIAL_INSURANCE',
            'ASSET_ACQUISITION', 'DEPRECIATION', 'ASSET_DISPOSAL',
            'JOURNAL_TRANSFER', 'JOURNAL_CORRECTION', 'PERIOD_CLOSING', 'OPENING_ENTRY'
        )),
    
    -- 원천 모듈 체크
    CONSTRAINT ck_business_documents__source_module
        CHECK (source_module IN ('PSM', 'SRM', 'WMS', 'IVM', 'HRM', 'FIM', 'ASM', 'MANUAL')),
    
    -- 상태 체크
    CONSTRAINT ck_business_documents__status
        CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'POSTED', 'CANCELLED')),
    
    -- 승인 상태 체크
    CONSTRAINT ck_business_documents__approval_status
        CHECK (approval_status IS NULL OR approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    
    -- 회계기간 체크 (1~12월)
    CONSTRAINT ck_business_documents__fiscal_period
        CHECK (fiscal_period BETWEEN 1 AND 12),
    
    -- 분개 연결 외래키 (SET NULL)
    CONSTRAINT fk_business_documents__journal_entry_id
        FOREIGN KEY (journal_entry_id) REFERENCES fim.journal_entries(id) ON DELETE SET NULL,
    
    -- 통화 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_business_documents__currency_code
        FOREIGN KEY (currency_code) REFERENCES adm.currencies(code) ON DELETE RESTRICT,
    
    -- 거래처 외래키 (SET NULL)
    CONSTRAINT fk_business_documents__partner_id
        FOREIGN KEY (partner_id) REFERENCES crm.partners(id) ON DELETE SET NULL,
    
    -- 부서 외래키 (SET NULL)
    CONSTRAINT fk_business_documents__department_id
        FOREIGN KEY (department_id) REFERENCES hrm.departments(id) ON DELETE SET NULL,
    
    -- 역분개 전표 자기참조 외래키 (SET NULL)
    CONSTRAINT fk_business_documents__reversed_document_id
        FOREIGN KEY (reversed_document_id) REFERENCES fim.business_documents(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fim.business_documents IS '업무전표: 업무 문서와 회계 분개를 연결하는 전표 (입고/출고/입금/출금 등)';
COMMENT ON COLUMN fim.business_documents.id IS '업무전표 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.business_documents.created_at IS '등록 일시';
COMMENT ON COLUMN fim.business_documents.created_by IS '등록자 UUID';
COMMENT ON COLUMN fim.business_documents.updated_at IS '수정 일시';
COMMENT ON COLUMN fim.business_documents.updated_by IS '수정자 UUID';
COMMENT ON COLUMN fim.business_documents.biz_doc_no IS '전표 번호 (자동 채번)';
COMMENT ON COLUMN fim.business_documents.biz_doc_date IS '전표 일자';
COMMENT ON COLUMN fim.business_documents.biz_doc_type IS '전표 유형 (PURCHASE_RECEIPT/SALES_SHIPMENT/RECEIPT/PAYMENT 등)';
COMMENT ON COLUMN fim.business_documents.source_module IS '원천 모듈 (PSM/SRM/WMS/IVM/HRM/FIM/MANUAL)';
COMMENT ON COLUMN fim.business_documents.source_type IS '원천 유형 (RECEIVING/SHIPPING/PAYMENT_TRANSACTION 등)';
COMMENT ON COLUMN fim.business_documents.source_id IS '원천 문서 ID';
COMMENT ON COLUMN fim.business_documents.source_no IS '원천 문서 번호';
COMMENT ON COLUMN fim.business_documents.source_line_id IS '원천 문서 라인 ID (선택)';
COMMENT ON COLUMN fim.business_documents.fiscal_year IS '회계연도';
COMMENT ON COLUMN fim.business_documents.fiscal_period IS '회계기간 (월: 1~12)';
COMMENT ON COLUMN fim.business_documents.account_date IS '회계처리일';
COMMENT ON COLUMN fim.business_documents.total_amount IS '전표 금액';
COMMENT ON COLUMN fim.business_documents.tax_amount IS '세액';
COMMENT ON COLUMN fim.business_documents.currency_code IS '통화 코드';
COMMENT ON COLUMN fim.business_documents.exchange_rate IS '환율';
COMMENT ON COLUMN fim.business_documents.partner_id IS '거래처 ID';
COMMENT ON COLUMN fim.business_documents.partner_name IS '거래처명 (스냅샷)';
COMMENT ON COLUMN fim.business_documents.department_id IS '부서 ID';
COMMENT ON COLUMN fim.business_documents.cost_center_code IS '원가센터 코드';
COMMENT ON COLUMN fim.business_documents.project_code IS '프로젝트 코드';
COMMENT ON COLUMN fim.business_documents.journal_entry_id IS '분개 ID (연결)';
COMMENT ON COLUMN fim.business_documents.is_posted IS '전기 여부';
COMMENT ON COLUMN fim.business_documents.posted_at IS '전기 일시';
COMMENT ON COLUMN fim.business_documents.posted_by IS '전기자 UUID';
COMMENT ON COLUMN fim.business_documents.is_cancelled IS '취소 여부';
COMMENT ON COLUMN fim.business_documents.cancelled_at IS '취소 일시';
COMMENT ON COLUMN fim.business_documents.cancelled_by IS '취소자 UUID';
COMMENT ON COLUMN fim.business_documents.cancelled_reason IS '취소 사유';
COMMENT ON COLUMN fim.business_documents.reversed_document_id IS '역분개 전표 ID';
COMMENT ON COLUMN fim.business_documents.approval_status IS '승인 상태 (PENDING/APPROVED/REJECTED)';
COMMENT ON COLUMN fim.business_documents.approved_by IS '승인자 UUID';
COMMENT ON COLUMN fim.business_documents.approved_at IS '승인 일시';
COMMENT ON COLUMN fim.business_documents.tax_invoice_no IS '세금계산서 번호';
COMMENT ON COLUMN fim.business_documents.tax_invoice_date IS '세금계산서 발행일';
COMMENT ON COLUMN fim.business_documents.description IS '적요';
COMMENT ON COLUMN fim.business_documents.notes IS '비고';
COMMENT ON COLUMN fim.business_documents.status IS '상태 (DRAFT/PENDING/APPROVED/REJECTED/POSTED/CANCELLED)';
COMMENT ON COLUMN fim.business_documents.is_deleted IS '삭제 여부';

COMMENT ON CONSTRAINT fk_business_documents__journal_entry_id ON fim.business_documents IS '분개 연결 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_business_documents__currency_code ON fim.business_documents IS '통화 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_business_documents__partner_id ON fim.business_documents IS '거래처 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_business_documents__department_id ON fim.business_documents IS '부서 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_business_documents__reversed_document_id ON fim.business_documents IS '역분개 전표 자기참조 외래키 (SET NULL)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_business_documents__biz_doc_no 
    ON fim.business_documents (biz_doc_no)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ux_business_documents__biz_doc_no IS '전표 번호 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_business_documents__biz_doc_date 
    ON fim.business_documents (biz_doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_business_documents__biz_doc_date IS '전표 일자 인덱스 (최신순)';

CREATE INDEX ix_business_documents__biz_doc_type
    ON fim.business_documents (biz_doc_type, biz_doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_business_documents__biz_doc_type IS '전표 유형별 조회 인덱스';

CREATE INDEX ix_business_documents__source 
    ON fim.business_documents (source_module, source_type, source_id)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_business_documents__source IS '원천 문서 추적 인덱스';

CREATE INDEX ix_business_documents__journal_entry_id 
    ON fim.business_documents (journal_entry_id)
 WHERE journal_entry_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_business_documents__journal_entry_id IS '분개 연결 조회 인덱스';

CREATE INDEX ix_business_documents__fiscal_period 
    ON fim.business_documents (fiscal_year, fiscal_period)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_business_documents__fiscal_period IS '회계기간별 조회 인덱스';

CREATE INDEX ix_business_documents__partner_id 
    ON fim.business_documents (partner_id, biz_doc_date DESC)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_business_documents__partner_id IS '거래처별 전표 조회 인덱스';

CREATE INDEX ix_business_documents__department_id 
    ON fim.business_documents (department_id, biz_doc_date DESC)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_business_documents__department_id IS '부서별 전표 조회 인덱스';

CREATE INDEX ix_business_documents__is_posted 
    ON fim.business_documents (is_posted, biz_doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_business_documents__is_posted IS '전기 여부 조회 인덱스';

CREATE INDEX ix_business_documents__status 
    ON fim.business_documents (status, biz_doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_business_documents__status IS '상태별 전표 조회 인덱스';
