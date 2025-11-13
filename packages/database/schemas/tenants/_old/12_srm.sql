-- ============================================================================
-- Sales & Revenue Management Schema (srm)
-- ============================================================================
-- Description: 판매/영업 관리 스키마 (견적서, 판매주문)
-- Database: tnnt_db (Tenant Database)
-- Schema: srm
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS srm;

COMMENT ON SCHEMA srm IS 'SRM: 판매/영업 관리 스키마 (견적서, 판매주문)';

-- ============================================================================
-- SALES & REVENUE MANAGEMENT
-- ============================================================================

-- =====================================================================================
-- 테이블: srm.quotations
-- 설명: 판매 견적서 헤더 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE IF NOT EXISTS srm.quotations 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적서 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    quote_code              VARCHAR(50)              NOT NULL,                               -- 견적서 코드
    customer_id             UUID                     NOT NULL,                               -- 고객 식별자
    doc_date                DATE                     NOT NULL,                               -- 전표 일자
    valid_until             DATE,                                                            -- 유효기간 만료일
    sales_person_id         UUID,                                                            -- 영업 담당자 식별자
    
    -- 금액 정보
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 외래키 제약 조건
    -- 고객 참조 외래키
    CONSTRAINT fk_quotations__customer_id           FOREIGN KEY (customer_id) REFERENCES crm.customers(id) ON DELETE RESTRICT,
    -- 영업 담당자 참조 외래키
    CONSTRAINT fk_quotations__sales_person_id       FOREIGN KEY (sales_person_id) REFERENCES hrm.employees(id) ON DELETE SET NULL,
    
    -- 제약조건
    -- 상태 체크 (DRAFT: 임시저장, SENT: 발송, ACCEPTED: 수락, REJECTED: 거절, EXPIRED: 만료)
    CONSTRAINT ck_quotations__status                CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_quotations__total_amount          CHECK (total_amount >= 0),
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_quotations__currency              CHECK (currency ~ '^[A-Z]{3}$'),
    -- 유효기간 체크 (전표일자보다 이후여야 함)
    CONSTRAINT ck_quotations__valid_until           CHECK (valid_until IS NULL OR valid_until >= doc_date)
);

COMMENT ON TABLE  srm.quotations                     IS '판매 견적서 헤더 관리 테이블';
COMMENT ON COLUMN srm.quotations.id                  IS '견적서 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.quotations.created_at          IS '등록 일시';
COMMENT ON COLUMN srm.quotations.created_by          IS '등록자 UUID';
COMMENT ON COLUMN srm.quotations.updated_at          IS '수정 일시';
COMMENT ON COLUMN srm.quotations.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN srm.quotations.quote_code          IS '견적서 코드 (견적번호)';
COMMENT ON COLUMN srm.quotations.customer_id         IS '고객 식별자';
COMMENT ON COLUMN srm.quotations.doc_date            IS '전표 일자';
COMMENT ON COLUMN srm.quotations.valid_until         IS '유효기간 만료일';
COMMENT ON COLUMN srm.quotations.sales_person_id     IS '영업 담당자 식별자';
COMMENT ON COLUMN srm.quotations.total_amount        IS '총 금액';
COMMENT ON COLUMN srm.quotations.currency            IS '통화 (ISO 4217)';
COMMENT ON COLUMN srm.quotations.status              IS '상태 (DRAFT/SENT/ACCEPTED/REJECTED/EXPIRED)';
COMMENT ON COLUMN srm.quotations.is_deleted          IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_quotations__quote_code
    ON srm.quotations (quote_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_quotations__quote_code IS '견적서 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_quotations__customer_id
    ON srm.quotations (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_quotations__customer_id IS '고객별 견적서 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_quotations__sales_person_id
    ON srm.quotations (sales_person_id)
 WHERE sales_person_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_quotations__sales_person_id IS '영업 담당자별 견적서 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_quotations__status
    ON srm.quotations (status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_quotations__status IS '상태별 견적서 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_quotations__doc_date
    ON srm.quotations (doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_quotations__doc_date IS '전표 일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_quotations__valid_until
    ON srm.quotations (valid_until)
 WHERE valid_until IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_quotations__valid_until IS '유효기간별 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 견적서 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_quotations__quote_code
    ON srm.quotations (quote_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_quotations__quote_code IS '견적서 코드 유니크 제약';


-- =====================================================================================
-- 테이블: srm.quotation_lines
-- 설명: 판매 견적서 라인 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE IF NOT EXISTS srm.quotation_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적서 라인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    quote_id                UUID                     NOT NULL,                               -- 견적서 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    description             TEXT,                                                            -- 품목 설명
    
    -- 수량 및 금액
    qty                     INTEGER                  NOT NULL,                               -- 견적 수량
    unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가
    discount_rate           NUMERIC(5,2)             DEFAULT 0,                              -- 할인율
    total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액
    
    -- 외래키 제약 조건
    -- 견적서 헤더 참조 외래키 (헤더 삭제 시 라인도 함께 삭제)
    CONSTRAINT fk_quotation_lines__quote_id         FOREIGN KEY (quote_id) REFERENCES srm.quotations(id) ON DELETE CASCADE,
    -- 제품 참조 외래키
    CONSTRAINT fk_quotation_lines__product_id       FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE RESTRICT,
    
    -- 제약조건
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_quotation_lines__line_no          CHECK (line_no > 0),
    -- 견적 수량 양수 체크 (1 이상)
    CONSTRAINT ck_quotation_lines__qty              CHECK (qty > 0),
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_quotation_lines__unit_price       CHECK (unit_price >= 0),
    -- 할인율 범위 체크 (0~100%)
    CONSTRAINT ck_quotation_lines__discount_rate    CHECK (discount_rate >= 0 AND discount_rate <= 100),
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_quotation_lines__total_amount     CHECK (total_amount >= 0)
);

COMMENT ON TABLE  srm.quotation_lines                    IS '판매 견적서 라인 관리 테이블';
COMMENT ON COLUMN srm.quotation_lines.id                 IS '견적서 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.quotation_lines.created_at         IS '등록 일시';
COMMENT ON COLUMN srm.quotation_lines.created_by         IS '등록자 UUID';
COMMENT ON COLUMN srm.quotation_lines.updated_at         IS '수정 일시';
COMMENT ON COLUMN srm.quotation_lines.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN srm.quotation_lines.quote_id           IS '견적서 헤더 식별자';
COMMENT ON COLUMN srm.quotation_lines.line_no            IS '라인 번호';
COMMENT ON COLUMN srm.quotation_lines.product_id         IS '제품 식별자';
COMMENT ON COLUMN srm.quotation_lines.description        IS '품목 설명';
COMMENT ON COLUMN srm.quotation_lines.qty                IS '견적 수량';
COMMENT ON COLUMN srm.quotation_lines.unit_price         IS '단가';
COMMENT ON COLUMN srm.quotation_lines.discount_rate      IS '할인율 (%)';
COMMENT ON COLUMN srm.quotation_lines.total_amount       IS '총 금액 (수량 × 단가 × (1 - 할인율))';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_quotation_lines__quote_id
    ON srm.quotation_lines (quote_id, line_no);
COMMENT ON INDEX ix_quotation_lines__quote_id IS '견적서별 라인 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_quotation_lines__product_id
    ON srm.quotation_lines (product_id);
COMMENT ON INDEX ix_quotation_lines__product_id IS '제품별 견적 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 견적서별 라인번호 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_quotation_lines__quote_line
    ON srm.quotation_lines (quote_id, line_no);
COMMENT ON INDEX ux_quotation_lines__quote_line IS '견적서별 라인번호 유니크 제약';


-- =====================================================================================
-- 테이블: srm.sales_orders
-- 설명: 판매주문 헤더 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE IF NOT EXISTS srm.sales_orders 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 판매주문 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    so_code                 VARCHAR(50)              NOT NULL,                               -- 판매주문 코드
    customer_id             UUID                     NOT NULL,                               -- 고객 식별자
    doc_date                DATE                     NOT NULL,                               -- 전표 일자
    delivery_date           DATE,                                                            -- 납품 희망일
    warehouse_id            UUID,                                                            -- 출고 창고 식별자
    sales_person_id         UUID,                                                            -- 영업 담당자 식별자
    
    -- 결제 조건
    payment_terms           VARCHAR(20),                                                     -- 결제 조건
    
    -- 금액 정보
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 외래키 제약 조건
    -- 고객 참조 외래키
    CONSTRAINT fk_sales_orders__customer_id         FOREIGN KEY (customer_id) REFERENCES crm.customers(id) ON DELETE RESTRICT,
    -- 창고 참조 외래키
    CONSTRAINT fk_sales_orders__warehouse_id        FOREIGN KEY (warehouse_id) REFERENCES wms.warehouses(id) ON DELETE SET NULL,
    -- 영업 담당자 참조 외래키
    CONSTRAINT fk_sales_orders__sales_person_id     FOREIGN KEY (sales_person_id) REFERENCES hrm.employees(id) ON DELETE SET NULL,
    
    -- 제약조건
    -- 상태 체크 (DRAFT: 임시저장, CONFIRMED: 확정, PROCESSING: 처리중, SHIPPED: 출하완료, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_sales_orders__status              CHECK (status IN ('DRAFT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_orders__total_amount        CHECK (total_amount >= 0),
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_sales_orders__currency            CHECK (currency ~ '^[A-Z]{3}$')
);

COMMENT ON TABLE  srm.sales_orders                       IS '판매주문 헤더 관리 테이블';
COMMENT ON COLUMN srm.sales_orders.id                    IS '판매주문 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.sales_orders.created_at            IS '등록 일시';
COMMENT ON COLUMN srm.sales_orders.created_by            IS '등록자 UUID';
COMMENT ON COLUMN srm.sales_orders.updated_at            IS '수정 일시';
COMMENT ON COLUMN srm.sales_orders.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN srm.sales_orders.so_code               IS '판매주문 코드 (SO 번호)';
COMMENT ON COLUMN srm.sales_orders.customer_id           IS '고객 식별자';
COMMENT ON COLUMN srm.sales_orders.doc_date              IS '전표 일자';
COMMENT ON COLUMN srm.sales_orders.delivery_date         IS '납품 희망일';
COMMENT ON COLUMN srm.sales_orders.warehouse_id          IS '출고 창고 식별자';
COMMENT ON COLUMN srm.sales_orders.sales_person_id       IS '영업 담당자 식별자';
COMMENT ON COLUMN srm.sales_orders.payment_terms         IS '결제 조건 (COD/NET30/NET60 등)';
COMMENT ON COLUMN srm.sales_orders.total_amount          IS '총 금액';
COMMENT ON COLUMN srm.sales_orders.currency              IS '통화 (ISO 4217)';
COMMENT ON COLUMN srm.sales_orders.status                IS '상태 (DRAFT/CONFIRMED/PROCESSING/SHIPPED/COMPLETED/CANCELLED)';
COMMENT ON COLUMN srm.sales_orders.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_sales_orders__so_code
    ON srm.sales_orders (so_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_sales_orders__so_code IS '판매주문 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_orders__customer_id
    ON srm.sales_orders (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_sales_orders__customer_id IS '고객별 판매주문 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_orders__warehouse_id
    ON srm.sales_orders (warehouse_id)
 WHERE warehouse_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_sales_orders__warehouse_id IS '창고별 판매주문 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_orders__sales_person_id
    ON srm.sales_orders (sales_person_id)
 WHERE sales_person_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_sales_orders__sales_person_id IS '영업 담당자별 판매주문 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_orders__status
    ON srm.sales_orders (status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_sales_orders__status IS '상태별 판매주문 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_orders__doc_date
    ON srm.sales_orders (doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_sales_orders__doc_date IS '전표 일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_orders__delivery_date
    ON srm.sales_orders (delivery_date)
 WHERE delivery_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_sales_orders__delivery_date IS '납품 희망일별 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 판매주문 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_sales_orders__so_code
    ON srm.sales_orders (so_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_sales_orders__so_code IS '판매주문 코드 유니크 제약';


-- =====================================================================================
-- 테이블: srm.sales_order_lines
-- 설명: 판매주문 라인 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE IF NOT EXISTS srm.sales_order_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 판매주문 라인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    so_id                   UUID                     NOT NULL,                               -- 판매주문 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    description             TEXT,                                                            -- 품목 설명
    
    -- 수량 및 금액
    qty                     INTEGER                  NOT NULL,                               -- 주문 수량
    unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가
    discount_rate           NUMERIC(5,2)             DEFAULT 0,                              -- 할인율
    total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액
    shipped_qty             INTEGER                  DEFAULT 0,                              -- 출고 완료 수량
    
    -- 외래키 제약 조건
    -- 판매주문 헤더 참조 외래키 (헤더 삭제 시 라인도 함께 삭제)
    CONSTRAINT fk_sales_order_lines__so_id          FOREIGN KEY (so_id) REFERENCES srm.sales_orders(id) ON DELETE CASCADE,
    -- 제품 참조 외래키
    CONSTRAINT fk_sales_order_lines__product_id     FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE RESTRICT,
    
    -- 제약조건
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_sales_order_lines__line_no        CHECK (line_no > 0),
    -- 주문 수량 양수 체크 (1 이상)
    CONSTRAINT ck_sales_order_lines__qty            CHECK (qty > 0),
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_order_lines__unit_price     CHECK (unit_price >= 0),
    -- 할인율 범위 체크 (0~100%)
    CONSTRAINT ck_sales_order_lines__discount_rate  CHECK (discount_rate >= 0 AND discount_rate <= 100),
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_order_lines__total_amount   CHECK (total_amount >= 0),
    -- 출고 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_order_lines__shipped_qty    CHECK (shipped_qty >= 0),
    -- 출고 수량이 주문 수량을 초과할 수 없음
    CONSTRAINT ck_sales_order_lines__shipped_qty_limit CHECK (shipped_qty <= qty)
);

COMMENT ON TABLE  srm.sales_order_lines                      IS '판매주문 라인 관리 테이블';
COMMENT ON COLUMN srm.sales_order_lines.id                   IS '판매주문 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.sales_order_lines.created_at           IS '등록 일시';
COMMENT ON COLUMN srm.sales_order_lines.created_by           IS '등록자 UUID';
COMMENT ON COLUMN srm.sales_order_lines.updated_at           IS '수정 일시';
COMMENT ON COLUMN srm.sales_order_lines.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN srm.sales_order_lines.so_id                IS '판매주문 헤더 식별자';
COMMENT ON COLUMN srm.sales_order_lines.line_no              IS '라인 번호';
COMMENT ON COLUMN srm.sales_order_lines.product_id           IS '제품 식별자';
COMMENT ON COLUMN srm.sales_order_lines.description          IS '품목 설명';
COMMENT ON COLUMN srm.sales_order_lines.qty                  IS '주문 수량';
COMMENT ON COLUMN srm.sales_order_lines.unit_price           IS '단가';
COMMENT ON COLUMN srm.sales_order_lines.discount_rate        IS '할인율 (%)';
COMMENT ON COLUMN srm.sales_order_lines.total_amount         IS '총 금액 (수량 × 단가 × (1 - 할인율))';
COMMENT ON COLUMN srm.sales_order_lines.shipped_qty          IS '출고 완료 수량';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_sales_order_lines__so_id
    ON srm.sales_order_lines (so_id, line_no);
COMMENT ON INDEX ix_sales_order_lines__so_id IS '판매주문별 라인 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_order_lines__product_id
    ON srm.sales_order_lines (product_id);
COMMENT ON INDEX ix_sales_order_lines__product_id IS '제품별 판매주문 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_order_lines__shipped_qty
    ON srm.sales_order_lines (so_id)
 WHERE shipped_qty < qty;
COMMENT ON INDEX ix_sales_order_lines__shipped_qty IS '미출고 주문라인 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 판매주문별 라인번호 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_sales_order_lines__so_line
    ON srm.sales_order_lines (so_id, line_no);
COMMENT ON INDEX ux_sales_order_lines__so_line IS '판매주문별 라인번호 유니크 제약';

