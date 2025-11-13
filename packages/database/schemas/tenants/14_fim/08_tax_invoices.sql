-- =====================================================================================
-- 테이블: fim.tax_invoices
-- 설명: 세금계산서 - 전자세금계산서 발행 및 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.tax_invoices 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 세금계산서 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 세금계산서 기본 정보
    invoice_no              VARCHAR(50)              NOT NULL,                               -- 세금계산서 번호
    invoice_type            VARCHAR(20)              NOT NULL,                               -- 세금계산서 유형
    issue_type              VARCHAR(20)              NOT NULL DEFAULT 'NORMAL',              -- 발행 유형
    invoice_date            DATE                     NOT NULL,                               -- 작성일자
    issue_date              DATE                     NOT NULL,                               -- 발행일자
    
    -- 국세청 승인 정보
    approval_no             VARCHAR(50),                                                     -- 승인번호
    approval_datetime       TIMESTAMP WITH TIME ZONE,                                        -- 승인일시
    is_nts_confirmed        BOOLEAN                  NOT NULL DEFAULT false,                 -- 국세청 전송 확인
    nts_confirmed_at        TIMESTAMP WITH TIME ZONE,                                        -- 국세청 확인일시
    
    -- 공급자 정보
    supplier_biz_no         VARCHAR(20)              NOT NULL,                               -- 공급자 사업자등록번호
    supplier_biz_name       VARCHAR(200)             NOT NULL,                               -- 공급자 상호
    supplier_ceo_name       VARCHAR(50),                                                     -- 공급자 대표자
    supplier_biz_kind       VARCHAR(100),                                                    -- 공급자 업태
    supplier_biz_item       VARCHAR(100),                                                    -- 공급자 종목
    supplier_postcode       VARCHAR(10),                                                     -- 우편번호
    supplier_address1       VARCHAR(200),                                                    -- 주소1 (기본주소)
    supplier_address2       VARCHAR(200),                                                    -- 주소2 (상세주소)    
    supplier_contact        VARCHAR(50),                                                     -- 공급자 담당자
    supplier_email          VARCHAR(255),                                                    -- 공급자 이메일    
    supplier_phone          VARCHAR(50),                                                     -- 공급자 전화번호
    
    -- 공급받는자 정보
    buyer_biz_no            VARCHAR(20)              NOT NULL,                               -- 공급받는자 사업자등록번호
    buyer_biz_name          VARCHAR(200)             NOT NULL,                               -- 공급받는자 상호
    buyer_ceo_name          VARCHAR(50),                                                     -- 공급받는자 대표자
    buyer_biz_kind          VARCHAR(100),                                                    -- 공급받는자 업태
    buyer_biz_item          VARCHAR(100),                                                    -- 공급받는자 종목
    buyer_postcode          VARCHAR(10),                                                     -- 우편번호
    buyer_address1          VARCHAR(200),                                                    -- 주소1 (기본주소)
    buyer_address2          VARCHAR(200),                                                    -- 주소2 (상세주소)    
    buyer_contact           VARCHAR(50),                                                     -- 공급받는자 담당자
    buyer_email             VARCHAR(255),                                                    -- 공급받는자 이메일    
    buyer_phone             VARCHAR(50),                                                     -- 공급받는자 전화번호
    
    -- 거래처 연결
    partner_id              UUID,                                                            -- 거래처 ID (구매/판매 공용)

    -- 판매 트랜잭션 링크 (SRM 통합)
    sales_order_id          UUID,                                                            -- 판매주문 식별자
    sales_delivery_id       UUID,                                                            -- 출고 식별자
    customer_id             UUID,                                                            -- 고객 식별자 (판매 시)

    -- 금액 정보
    supply_amount           NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 공급가액
    tax_amount              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 세액
    total_amount            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 합계금액
    currency_code           VARCHAR(3)               NOT NULL DEFAULT 'KRW',                 -- 통화
    due_date                DATE,                                                            -- 지급 기한일 (판매 시)
    
    -- 원천 문서 정보
    source_type             VARCHAR(30),                                                     -- 원천 유형
    source_id               UUID,                                                            -- 원천 문서 ID
    source_no               VARCHAR(50),                                                     -- 원천 문서 번호
    
    -- 업무전표 연결
    biz_doc_id              UUID,                                                            -- 업무전표 ID
    
    -- 비고
    remark                  TEXT,                                                            -- 비고
    notes                   TEXT,                                                            -- 메모
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부
    
    -- 세금계산서 유형 체크
    CONSTRAINT ck_tax_invoices__invoice_type 
        CHECK (invoice_type IN ('TAX', 'CREDIT_NOTE', 'DEBIT_NOTE', 'MODIFIED')),
    
    -- 발행 유형 체크
    CONSTRAINT ck_tax_invoices__issue_type 
        CHECK (issue_type IN ('NORMAL', 'REVERSE', 'IMPORT', 'ZERO_RATE')),
    
    -- 상태 체크
    CONSTRAINT ck_tax_invoices__status 
        CHECK (status IN ('DRAFT', 'ISSUED', 'SENT', 'CONFIRMED', 'CANCELLED')),
    
    -- 금액 계산 체크 (합계금액 = 공급가액 + 세액)
    CONSTRAINT ck_tax_invoices__total_amount 
        CHECK (total_amount = supply_amount + tax_amount),
    
    -- 거래처 참조 외래키 (SET NULL)
    CONSTRAINT fk_tax_invoices__partner_id
        FOREIGN KEY (partner_id) REFERENCES crm.partners(id) ON DELETE SET NULL,
    
    -- 통화 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_tax_invoices__currency_code
        FOREIGN KEY (currency_code) REFERENCES adm.currencies(code) ON DELETE RESTRICT,
    
    -- 업무전표 참조 외래키 (SET NULL)
    CONSTRAINT fk_tax_invoices__biz_doc_id
        FOREIGN KEY (biz_doc_id) REFERENCES fim.business_documents(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fim.tax_invoices IS '세금계산서: 전자세금계산서 발행 및 관리';
COMMENT ON COLUMN fim.tax_invoices.id IS '세금계산서 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.tax_invoices.created_at IS '등록 일시';
COMMENT ON COLUMN fim.tax_invoices.created_by IS '등록자 UUID';
COMMENT ON COLUMN fim.tax_invoices.updated_at IS '수정 일시';
COMMENT ON COLUMN fim.tax_invoices.updated_by IS '수정자 UUID';
COMMENT ON COLUMN fim.tax_invoices.invoice_no IS '세금계산서 번호';
COMMENT ON COLUMN fim.tax_invoices.invoice_type IS '세금계산서 유형 (TAX/CREDIT_NOTE/DEBIT_NOTE/MODIFIED)';
COMMENT ON COLUMN fim.tax_invoices.issue_type IS '발행 유형 (NORMAL/REVERSE/IMPORT/ZERO_RATE)';
COMMENT ON COLUMN fim.tax_invoices.invoice_date IS '작성일자';
COMMENT ON COLUMN fim.tax_invoices.issue_date IS '발행일자';
COMMENT ON COLUMN fim.tax_invoices.approval_no IS '승인번호 (국세청)';
COMMENT ON COLUMN fim.tax_invoices.approval_datetime IS '승인일시';
COMMENT ON COLUMN fim.tax_invoices.is_nts_confirmed IS '국세청 전송 확인';
COMMENT ON COLUMN fim.tax_invoices.nts_confirmed_at IS '국세청 확인일시';
COMMENT ON COLUMN fim.tax_invoices.supplier_biz_no IS '공급자 사업자등록번호';
COMMENT ON COLUMN fim.tax_invoices.supplier_biz_name IS '공급자 상호';
COMMENT ON COLUMN fim.tax_invoices.supplier_ceo_name IS '공급자 대표자';
COMMENT ON COLUMN fim.tax_invoices.supplier_postcode IS '공급자 우편번호';
COMMENT ON COLUMN fim.tax_invoices.supplier_address1 IS '공급자 주소(1)';
COMMENT ON COLUMN fim.tax_invoices.supplier_address2 IS '공급자 주소(2)';
COMMENT ON COLUMN fim.tax_invoices.supplier_biz_kind IS '공급자 업태';
COMMENT ON COLUMN fim.tax_invoices.supplier_biz_item IS '공급자 종목';
COMMENT ON COLUMN fim.tax_invoices.supplier_contact IS '공급자 담당자';
COMMENT ON COLUMN fim.tax_invoices.supplier_email IS '공급자 이메일';
COMMENT ON COLUMN fim.tax_invoices.supplier_phone IS '공급자 전화번호';
COMMENT ON COLUMN fim.tax_invoices.buyer_biz_no IS '공급받는자 사업자등록번호';
COMMENT ON COLUMN fim.tax_invoices.buyer_biz_name IS '공급받는자 상호';
COMMENT ON COLUMN fim.tax_invoices.buyer_ceo_name IS '공급받는자 대표자';
COMMENT ON COLUMN fim.tax_invoices.buyer_postcode IS '공급받는자 주소';
COMMENT ON COLUMN fim.tax_invoices.buyer_address1 IS '공급받는자 주소';
COMMENT ON COLUMN fim.tax_invoices.buyer_address2 IS '공급받는자 주소';
COMMENT ON COLUMN fim.tax_invoices.buyer_biz_kind IS '공급받는자 업태';
COMMENT ON COLUMN fim.tax_invoices.buyer_biz_item IS '공급받는자 종목';
COMMENT ON COLUMN fim.tax_invoices.buyer_contact IS '공급받는자 담당자';
COMMENT ON COLUMN fim.tax_invoices.buyer_email IS '공급받는자 이메일';
COMMENT ON COLUMN fim.tax_invoices.buyer_phone IS '공급받는자 전화번호';
COMMENT ON COLUMN fim.tax_invoices.partner_id IS '거래처 ID (구매/판매 모두 참조)';
COMMENT ON COLUMN fim.tax_invoices.sales_order_id IS '판매주문 식별자 (판매 세금계산서용)';
COMMENT ON COLUMN fim.tax_invoices.sales_delivery_id IS '출고 식별자 (판매 세금계산서용)';
COMMENT ON COLUMN fim.tax_invoices.customer_id IS '고객 식별자 (판매 세금계산서용, deprecated - partner_id 사용 권장)';
COMMENT ON COLUMN fim.tax_invoices.supply_amount IS '공급가액';
COMMENT ON COLUMN fim.tax_invoices.tax_amount IS '세액';
COMMENT ON COLUMN fim.tax_invoices.total_amount IS '합계금액';
COMMENT ON COLUMN fim.tax_invoices.currency_code IS '통화 코드';
COMMENT ON COLUMN fim.tax_invoices.due_date IS '지급 기한일 (판매 세금계산서용)';
COMMENT ON COLUMN fim.tax_invoices.source_type IS '원천 유형';
COMMENT ON COLUMN fim.tax_invoices.source_id IS '원천 문서 ID';
COMMENT ON COLUMN fim.tax_invoices.source_no IS '원천 문서 번호';
COMMENT ON COLUMN fim.tax_invoices.biz_doc_id IS '업무전표 ID';
COMMENT ON COLUMN fim.tax_invoices.remark IS '비고 (계산서 출력용)';
COMMENT ON COLUMN fim.tax_invoices.notes IS '메모 (내부용)';
COMMENT ON COLUMN fim.tax_invoices.status IS '상태 (DRAFT/ISSUED/SENT/CONFIRMED/CANCELLED)';
COMMENT ON COLUMN fim.tax_invoices.is_deleted IS '삭제 여부';

-- =====================================================================================
-- 외래키 제약조건 추가 (SRM 통합용)
-- =====================================================================================

-- 판매주문 참조 외래키 (SET NULL) - SRM 통합용
ALTER TABLE fim.tax_invoices
  ADD CONSTRAINT fk_tax_invoices__sales_order_id
    FOREIGN KEY (sales_order_id) REFERENCES srm.sales_orders(id) ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_tax_invoices__sales_order_id ON fim.tax_invoices IS '판매주문 참조 외래키 (SET NULL 삭제)';

-- 출고 참조 외래키 (SET NULL) - SRM 통합용
ALTER TABLE fim.tax_invoices
  ADD CONSTRAINT fk_tax_invoices__sales_delivery_id
    FOREIGN KEY (sales_delivery_id) REFERENCES srm.sales_deliveries(id) ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_tax_invoices__sales_delivery_id ON fim.tax_invoices IS '출고 참조 외래키 (SET NULL 삭제)';

-- 고객 참조 외래키 (RESTRICT 삭제) - 하위호환성용, 향후 제거 권장
ALTER TABLE fim.tax_invoices
  ADD CONSTRAINT fk_tax_invoices__customer_id
    FOREIGN KEY (customer_id) REFERENCES crm.partners(id) ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_tax_invoices__customer_id ON fim.tax_invoices IS '고객 참조 외래키 (RESTRICT 삭제) - deprecated, partner_id 사용 권장';

-- =====================================================================================
-- 기존 외래키
-- =====================================================================================

COMMENT ON CONSTRAINT fk_tax_invoices__partner_id ON fim.tax_invoices IS '거래처 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_tax_invoices__currency_code ON fim.tax_invoices IS '통화 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_tax_invoices__biz_doc_id ON fim.tax_invoices IS '업무전표 참조 외래키 (SET NULL)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_tax_invoices__invoice_no 
    ON fim.tax_invoices (invoice_no)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ux_tax_invoices__invoice_no IS '세금계산서 번호 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_tax_invoices__approval_no 
    ON fim.tax_invoices (approval_no)
 WHERE approval_no IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__approval_no IS '승인번호 조회 인덱스';

CREATE INDEX ix_tax_invoices__issue_date 
    ON fim.tax_invoices (issue_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__issue_date IS '발행일자 조회 인덱스';

CREATE INDEX ix_tax_invoices__partner_id 
    ON fim.tax_invoices (partner_id, issue_date DESC)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__partner_id IS '거래처별 세금계산서 조회 인덱스';

CREATE INDEX ix_tax_invoices__supplier_biz_no 
    ON fim.tax_invoices (supplier_biz_no, issue_date)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__supplier_biz_no IS '공급자 사업자등록번호 조회 인덱스';

CREATE INDEX ix_tax_invoices__buyer_biz_no 
    ON fim.tax_invoices (buyer_biz_no, issue_date)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__buyer_biz_no IS '공급받는자 사업자등록번호 조회 인덱스';

CREATE INDEX ix_tax_invoices__status 
    ON fim.tax_invoices (status, issue_date)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__status IS '상태별 세금계산서 조회 인덱스';

CREATE INDEX ix_tax_invoices__source
    ON fim.tax_invoices (source_type, source_id)
 WHERE source_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__source IS '원천 문서 조회 인덱스';

-- =====================================================================================
-- SRM 통합용 인덱스
-- =====================================================================================

-- 판매주문별 세금계산서 조회 인덱스
CREATE INDEX ix_tax_invoices__sales_order_id
    ON fim.tax_invoices (sales_order_id, issue_date DESC)
 WHERE sales_order_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__sales_order_id IS '판매주문별 세금계산서 조회 인덱스';

-- 출고별 세금계산서 조회 인덱스
CREATE INDEX ix_tax_invoices__sales_delivery_id
    ON fim.tax_invoices (sales_delivery_id, issue_date DESC)
 WHERE sales_delivery_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__sales_delivery_id IS '출고별 세금계산서 조회 인덱스';

-- 고객별 세금계산서 조회 인덱스 (customer_id용, deprecated)
CREATE INDEX ix_tax_invoices__customer_id
    ON fim.tax_invoices (customer_id, issue_date DESC)
 WHERE customer_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoices__customer_id IS '고객별 세금계산서 조회 인덱스 (deprecated)';

-- =====================================================================================
-- 완료: fim.tax_invoices 테이블 수정 (SRM 통합)
-- 수정일: 2025-10-24
-- 변경사항: sales_order_id, sales_delivery_id, customer_id, due_date 필드 추가
-- 목적: srm.sales_invoices 테이블 통합
-- =====================================================================================
