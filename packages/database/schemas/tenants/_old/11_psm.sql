-- ============================================================================
-- Procurement & Supply Management Schema (psm)
-- ============================================================================
-- Description: 구매/조달 관리 스키마 (구매요청, 구매발주)
-- Database: tnnt_db (Tenant Database)
-- Schema: psm
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS psm;

COMMENT ON SCHEMA psm IS 'PSM: 구매/조달 관리 스키마 (구매요청, 구매발주)';

-- ============================================================================
-- PROCUREMENT & SUPPLY MANAGEMENT
-- ============================================================================

-- =====================================================================================
-- 테이블: psm.purchase_requisitions
-- 설명: 구매요청 헤더 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE IF NOT EXISTS psm.purchase_requisitions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매요청 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    pr_code                 VARCHAR(50)              NOT NULL,                               -- 구매요청 코드
    doc_date                DATE                     NOT NULL,                               -- 전표 일자
    requester_id            UUID                     NOT NULL,                               -- 요청자 식별자
    department_id           UUID,                                                            -- 부서 식별자
    required_date           DATE,                                                            -- 필요 일자
    purpose                 TEXT,                                                            -- 구매 목적
    
    -- 금액 정보
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    approved_by             UUID,                                                            -- 승인자 UUID
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 외래키 제약 조건
    -- 요청자 참조 외래키
    CONSTRAINT fk_purchase_requisitions__requester_id   FOREIGN KEY (requester_id) REFERENCES hrm.employees(id) ON DELETE RESTRICT,
    -- 부서 참조 외래키
    CONSTRAINT fk_purchase_requisitions__department_id  FOREIGN KEY (department_id) REFERENCES hrm.departments(id) ON DELETE SET NULL,
    -- 승인자 참조 외래키
    CONSTRAINT fk_purchase_requisitions__approved_by    FOREIGN KEY (approved_by) REFERENCES hrm.employees(id) ON DELETE SET NULL,
    
    -- 제약조건
    -- 상태 체크 (DRAFT: 임시저장, SUBMITTED: 제출, APPROVED: 승인, REJECTED: 반려, ORDERED: 발주완료)
    CONSTRAINT ck_purchase_requisitions__status         CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'ORDERED')),
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_purchase_requisitions__total_amount   CHECK (total_amount >= 0),
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_purchase_requisitions__currency       CHECK (currency ~ '^[A-Z]{3}$')
);

COMMENT ON TABLE  psm.purchase_requisitions                  IS '구매요청 헤더 관리 테이블';
COMMENT ON COLUMN psm.purchase_requisitions.id               IS '구매요청 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_requisitions.created_at       IS '등록 일시';
COMMENT ON COLUMN psm.purchase_requisitions.created_by       IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_requisitions.updated_at       IS '수정 일시';
COMMENT ON COLUMN psm.purchase_requisitions.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_requisitions.pr_code          IS '구매요청 코드 (PR 번호)';
COMMENT ON COLUMN psm.purchase_requisitions.doc_date         IS '전표 일자';
COMMENT ON COLUMN psm.purchase_requisitions.requester_id     IS '요청자 식별자';
COMMENT ON COLUMN psm.purchase_requisitions.department_id    IS '부서 식별자';
COMMENT ON COLUMN psm.purchase_requisitions.required_date    IS '필요 일자';
COMMENT ON COLUMN psm.purchase_requisitions.purpose          IS '구매 목적';
COMMENT ON COLUMN psm.purchase_requisitions.total_amount     IS '총 금액';
COMMENT ON COLUMN psm.purchase_requisitions.currency         IS '통화 (ISO 4217)';
COMMENT ON COLUMN psm.purchase_requisitions.status           IS '상태 (DRAFT/SUBMITTED/APPROVED/REJECTED/ORDERED)';
COMMENT ON COLUMN psm.purchase_requisitions.approved_at      IS '승인 일시';
COMMENT ON COLUMN psm.purchase_requisitions.approved_by      IS '승인자 UUID';
COMMENT ON COLUMN psm.purchase_requisitions.is_deleted       IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__pr_code
    ON psm.purchase_requisitions (pr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_purchase_requisitions__pr_code IS '구매요청 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__requester_id
    ON psm.purchase_requisitions (requester_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_purchase_requisitions__requester_id IS '요청자별 구매요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__department_id
    ON psm.purchase_requisitions (department_id)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_purchase_requisitions__department_id IS '부서별 구매요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__status
    ON psm.purchase_requisitions (status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_purchase_requisitions__status IS '상태별 구매요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__doc_date
    ON psm.purchase_requisitions (doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_purchase_requisitions__doc_date IS '전표 일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__required_date
    ON psm.purchase_requisitions (required_date)
 WHERE required_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_purchase_requisitions__required_date IS '필요 일자별 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 구매요청 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_requisitions__pr_code
    ON psm.purchase_requisitions (pr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_purchase_requisitions__pr_code IS '구매요청 코드 유니크 제약';


-- =====================================================================================
-- 테이블: psm.purchase_requisition_lines
-- 설명: 구매요청 라인 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE IF NOT EXISTS psm.purchase_requisition_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매요청 라인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    pr_id                   UUID                     NOT NULL,                               -- 구매요청 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    description             TEXT,                                                            -- 품목 설명
    
    -- 수량 및 금액
    qty                     INTEGER                  NOT NULL,                               -- 요청 수량
    unit_price              NUMERIC(18,4)            DEFAULT 0,                              -- 단가
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    required_date           DATE,                                                            -- 필요 일자
    
    -- 외래키 제약 조건
    -- 구매요청 헤더 참조 외래키 (헤더 삭제 시 라인도 함께 삭제)
    CONSTRAINT fk_purchase_requisition_lines__pr_id     FOREIGN KEY (pr_id) REFERENCES psm.purchase_requisitions(id) ON DELETE CASCADE,
    -- 제품 참조 외래키
    CONSTRAINT fk_purchase_requisition_lines__product_id FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE RESTRICT,
    
    -- 제약조건
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_purchase_requisition_lines__line_no   CHECK (line_no > 0),
    -- 요청 수량 양수 체크 (1 이상)
    CONSTRAINT ck_purchase_requisition_lines__qty       CHECK (qty > 0),
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_purchase_requisition_lines__unit_price CHECK (unit_price >= 0),
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_purchase_requisition_lines__total_amount CHECK (total_amount >= 0)
);

COMMENT ON TABLE  psm.purchase_requisition_lines                 IS '구매요청 라인 관리 테이블';
COMMENT ON COLUMN psm.purchase_requisition_lines.id              IS '구매요청 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_requisition_lines.created_at      IS '등록 일시';
COMMENT ON COLUMN psm.purchase_requisition_lines.created_by      IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_requisition_lines.updated_at      IS '수정 일시';
COMMENT ON COLUMN psm.purchase_requisition_lines.updated_by      IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_requisition_lines.pr_id           IS '구매요청 헤더 식별자';
COMMENT ON COLUMN psm.purchase_requisition_lines.line_no         IS '라인 번호';
COMMENT ON COLUMN psm.purchase_requisition_lines.product_id      IS '제품 식별자';
COMMENT ON COLUMN psm.purchase_requisition_lines.description     IS '품목 설명';
COMMENT ON COLUMN psm.purchase_requisition_lines.qty             IS '요청 수량';
COMMENT ON COLUMN psm.purchase_requisition_lines.unit_price      IS '단가';
COMMENT ON COLUMN psm.purchase_requisition_lines.total_amount    IS '총 금액 (수량 × 단가)';
COMMENT ON COLUMN psm.purchase_requisition_lines.required_date   IS '필요 일자';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_purchase_requisition_lines__pr_id
    ON psm.purchase_requisition_lines (pr_id, line_no);
COMMENT ON INDEX ix_purchase_requisition_lines__pr_id IS '구매요청별 라인 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisition_lines__product_id
    ON psm.purchase_requisition_lines (product_id);
COMMENT ON INDEX ix_purchase_requisition_lines__product_id IS '제품별 구매요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisition_lines__required_date
    ON psm.purchase_requisition_lines (required_date)
 WHERE required_date IS NOT NULL;
COMMENT ON INDEX ix_purchase_requisition_lines__required_date IS '필요 일자별 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 구매요청별 라인번호 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_requisition_lines__pr_line
    ON psm.purchase_requisition_lines (pr_id, line_no);
COMMENT ON INDEX ux_purchase_requisition_lines__pr_line IS '구매요청별 라인번호 유니크 제약';


-- =====================================================================================
-- 테이블: psm.purchase_orders
-- 설명: 구매발주 헤더 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE IF NOT EXISTS psm.purchase_orders 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매발주 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    po_code                 VARCHAR(50)              NOT NULL,                               -- 구매발주 코드
    vendor_id               UUID                     NOT NULL,                               -- 공급업체 식별자
    doc_date                DATE                     NOT NULL,                               -- 전표 일자
    delivery_date           DATE,                                                            -- 납품 희망일
    warehouse_id            UUID,                                                            -- 입고 창고 식별자
    
    -- 결제 조건
    payment_terms           VARCHAR(20),                                                     -- 결제 조건
    
    -- 금액 정보
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    approved_by             UUID,                                                            -- 승인자 UUID
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 외래키 제약 조건
    -- 공급업체 참조 외래키
    CONSTRAINT fk_purchase_orders__vendor_id        FOREIGN KEY (vendor_id) REFERENCES crm.customers(id) ON DELETE RESTRICT,
    -- 창고 참조 외래키
    CONSTRAINT fk_purchase_orders__warehouse_id     FOREIGN KEY (warehouse_id) REFERENCES wms.warehouses(id) ON DELETE SET NULL,
    -- 승인자 참조 외래키
    CONSTRAINT fk_purchase_orders__approved_by      FOREIGN KEY (approved_by) REFERENCES hrm.employees(id) ON DELETE SET NULL,
    
    -- 제약조건
    -- 상태 체크 (DRAFT: 임시저장, APPROVED: 승인, ORDERED: 발주완료, RECEIVING: 입고중, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_purchase_orders__status           CHECK (status IN ('DRAFT', 'APPROVED', 'ORDERED', 'RECEIVING', 'COMPLETED', 'CANCELLED')),
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_purchase_orders__total_amount     CHECK (total_amount >= 0),
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_purchase_orders__currency         CHECK (currency ~ '^[A-Z]{3}$')
);

COMMENT ON TABLE  psm.purchase_orders                    IS '구매발주 헤더 관리 테이블';
COMMENT ON COLUMN psm.purchase_orders.id                 IS '구매발주 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_orders.created_at         IS '등록 일시';
COMMENT ON COLUMN psm.purchase_orders.created_by         IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_orders.updated_at         IS '수정 일시';
COMMENT ON COLUMN psm.purchase_orders.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_orders.po_code            IS '구매발주 코드 (PO 번호)';
COMMENT ON COLUMN psm.purchase_orders.vendor_id          IS '공급업체 식별자';
COMMENT ON COLUMN psm.purchase_orders.doc_date           IS '전표 일자';
COMMENT ON COLUMN psm.purchase_orders.delivery_date      IS '납품 희망일';
COMMENT ON COLUMN psm.purchase_orders.warehouse_id       IS '입고 창고 식별자';
COMMENT ON COLUMN psm.purchase_orders.payment_terms      IS '결제 조건 (COD/NET30/NET60 등)';
COMMENT ON COLUMN psm.purchase_orders.total_amount       IS '총 금액';
COMMENT ON COLUMN psm.purchase_orders.currency           IS '통화 (ISO 4217)';
COMMENT ON COLUMN psm.purchase_orders.status             IS '상태 (DRAFT/APPROVED/ORDERED/RECEIVING/COMPLETED/CANCELLED)';
COMMENT ON COLUMN psm.purchase_orders.approved_at        IS '승인 일시';
COMMENT ON COLUMN psm.purchase_orders.approved_by        IS '승인자 UUID';
COMMENT ON COLUMN psm.purchase_orders.is_deleted         IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_purchase_orders__po_code
    ON psm.purchase_orders (po_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_purchase_orders__po_code IS '구매발주 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__vendor_id
    ON psm.purchase_orders (vendor_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_purchase_orders__vendor_id IS '공급업체별 구매발주 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__warehouse_id
    ON psm.purchase_orders (warehouse_id)
 WHERE warehouse_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_purchase_orders__warehouse_id IS '창고별 구매발주 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__status
    ON psm.purchase_orders (status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_purchase_orders__status IS '상태별 구매발주 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__doc_date
    ON psm.purchase_orders (doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_purchase_orders__doc_date IS '전표 일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__delivery_date
    ON psm.purchase_orders (delivery_date)
 WHERE delivery_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_purchase_orders__delivery_date IS '납품 희망일별 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 구매발주 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_orders__po_code
    ON psm.purchase_orders (po_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_purchase_orders__po_code IS '구매발주 코드 유니크 제약';


-- =====================================================================================
-- 테이블: psm.purchase_order_lines
-- 설명: 구매발주 라인 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE IF NOT EXISTS psm.purchase_order_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매발주 라인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    po_id                   UUID                     NOT NULL,                               -- 구매발주 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    description             TEXT,                                                            -- 품목 설명
    
    -- 수량 및 금액
    qty                     INTEGER                  NOT NULL,                               -- 발주 수량
    unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가
    total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액
    received_qty            INTEGER                  DEFAULT 0,                              -- 입고 완료 수량
    
    -- 외래키 제약 조건
    -- 구매발주 헤더 참조 외래키 (헤더 삭제 시 라인도 함께 삭제)
    CONSTRAINT fk_purchase_order_lines__po_id       FOREIGN KEY (po_id) REFERENCES psm.purchase_orders(id) ON DELETE CASCADE,
    -- 제품 참조 외래키
    CONSTRAINT fk_purchase_order_lines__product_id  FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE RESTRICT,
    
    -- 제약조건
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_purchase_order_lines__line_no     CHECK (line_no > 0),
    -- 발주 수량 양수 체크 (1 이상)
    CONSTRAINT ck_purchase_order_lines__qty         CHECK (qty > 0),
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_purchase_order_lines__unit_price  CHECK (unit_price >= 0),
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_purchase_order_lines__total_amount CHECK (total_amount >= 0),
    -- 입고 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_purchase_order_lines__received_qty CHECK (received_qty >= 0),
    -- 입고 수량이 발주 수량을 초과할 수 없음
    CONSTRAINT ck_purchase_order_lines__received_qty_limit CHECK (received_qty <= qty)
);

COMMENT ON TABLE  psm.purchase_order_lines                   IS '구매발주 라인 관리 테이블';
COMMENT ON COLUMN psm.purchase_order_lines.id                IS '구매발주 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_order_lines.created_at        IS '등록 일시';
COMMENT ON COLUMN psm.purchase_order_lines.created_by        IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_order_lines.updated_at        IS '수정 일시';
COMMENT ON COLUMN psm.purchase_order_lines.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_order_lines.po_id             IS '구매발주 헤더 식별자';
COMMENT ON COLUMN psm.purchase_order_lines.line_no           IS '라인 번호';
COMMENT ON COLUMN psm.purchase_order_lines.product_id        IS '제품 식별자';
COMMENT ON COLUMN psm.purchase_order_lines.description       IS '품목 설명';
COMMENT ON COLUMN psm.purchase_order_lines.qty               IS '발주 수량';
COMMENT ON COLUMN psm.purchase_order_lines.unit_price        IS '단가';
COMMENT ON COLUMN psm.purchase_order_lines.total_amount      IS '총 금액 (수량 × 단가)';
COMMENT ON COLUMN psm.purchase_order_lines.received_qty      IS '입고 완료 수량';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_purchase_order_lines__po_id
    ON psm.purchase_order_lines (po_id, line_no);
COMMENT ON INDEX ix_purchase_order_lines__po_id IS '구매발주별 라인 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_lines__product_id
    ON psm.purchase_order_lines (product_id);
COMMENT ON INDEX ix_purchase_order_lines__product_id IS '제품별 구매발주 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_lines__received_qty
    ON psm.purchase_order_lines (po_id)
 WHERE received_qty < qty;
COMMENT ON INDEX ix_purchase_order_lines__received_qty IS '미입고 발주라인 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 구매발주별 라인번호 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_order_lines__po_line
    ON psm.purchase_order_lines (po_id, line_no);
COMMENT ON INDEX ux_purchase_order_lines__po_line IS '구매발주별 라인번호 유니크 제약';

