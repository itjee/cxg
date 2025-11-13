-- =====================================================================================
-- 테이블: psm.purchase_orders
-- 설명: 구매발주 헤더 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS psm.purchase_orders 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매발주 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 구매발주 기본 정보
    po_code                 VARCHAR(50)              NOT NULL,                               -- 구매발주 코드
    vendor_id               UUID                     NOT NULL,                               -- 공급업체 식별자
    order_date              DATE                     NOT NULL,                               -- 전표 일자
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
    
    -- 외래키 제약조건
    -- 공급업체 참조 외래키 (삭제 불가)
    CONSTRAINT fk_purchase_orders__vendor_id        FOREIGN KEY (vendor_id) 
                                                    REFERENCES crm.partners(id) 
                                                    ON DELETE RESTRICT,
    
    -- 입고 창고 참조 외래키 (창고 삭제 시 NULL)
    CONSTRAINT fk_purchase_orders__warehouse_id     FOREIGN KEY (warehouse_id) 
                                                    REFERENCES wms.warehouses(id) 
                                                    ON DELETE SET NULL,
    
    -- 승인자 참조 외래키 (승인자 삭제 시 NULL)
    CONSTRAINT fk_purchase_orders__approved_by      FOREIGN KEY (approved_by) 
                                                    REFERENCES hrm.employees(id) 
                                                    ON DELETE SET NULL,
    
    -- CHECK 제약조건
    -- 상태 체크 (DRAFT: 임시저장, APPROVED: 승인, ORDERED: 발주완료, RECEIVING: 입고중, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_purchase_orders__status           CHECK (status IN ('DRAFT', 'APPROVED', 'ORDERED', 'RECEIVING', 'COMPLETED', 'CANCELLED')),
    
    -- 총 금액 음수 불가
    CONSTRAINT ck_purchase_orders__total_amount     CHECK (total_amount >= 0),
    
    -- 통화 코드 형식 체크 (ISO 4217 - 3자리 영대문자)
    CONSTRAINT ck_purchase_orders__currency         CHECK (currency ~ '^[A-Z]{3}$')
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================


COMMENT ON TABLE  psm.purchase_orders                    IS '구매발주 헤더 관리 테이블';
COMMENT ON COLUMN psm.purchase_orders.id                 IS '구매발주 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_orders.created_at         IS '등록 일시';
COMMENT ON COLUMN psm.purchase_orders.created_by         IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_orders.updated_at         IS '수정 일시';
COMMENT ON COLUMN psm.purchase_orders.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_orders.po_code            IS '구매발주 코드 (PO-YYYYMMDD-001)';
COMMENT ON COLUMN psm.purchase_orders.vendor_id          IS '공급업체 식별자';
COMMENT ON COLUMN psm.purchase_orders.order_date         IS '전표 일자';
COMMENT ON COLUMN psm.purchase_orders.delivery_date      IS '납품 희망일';
COMMENT ON COLUMN psm.purchase_orders.warehouse_id       IS '입고 창고 식별자';
COMMENT ON COLUMN psm.purchase_orders.payment_terms      IS '결제 조건 (COD/NET30/NET60/NET90 등)';
COMMENT ON COLUMN psm.purchase_orders.total_amount       IS '총 금액 (모든 라인의 합계)';
COMMENT ON COLUMN psm.purchase_orders.currency           IS '통화 (ISO 4217 - KRW/USD/JPY 등)';
COMMENT ON COLUMN psm.purchase_orders.status             IS '상태 (DRAFT/APPROVED/ORDERED/RECEIVING/COMPLETED/CANCELLED)';
COMMENT ON COLUMN psm.purchase_orders.approved_at        IS '승인 일시';
COMMENT ON COLUMN psm.purchase_orders.approved_by        IS '승인자 UUID';
COMMENT ON COLUMN psm.purchase_orders.is_deleted         IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_purchase_orders__po_code
    ON psm.purchase_orders (po_code)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_orders__po_code IS '구매발주 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__vendor_id
    ON psm.purchase_orders (vendor_id)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_orders__vendor_id IS '공급업체별 구매발주 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__warehouse_id
    ON psm.purchase_orders (warehouse_id)
 WHERE warehouse_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_orders__warehouse_id IS '창고별 구매발주 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__status
    ON psm.purchase_orders (status)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_orders__status IS '상태별 구매발주 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__order_date
    ON psm.purchase_orders (order_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_orders__order_date IS '전표 일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_orders__delivery_date
    ON psm.purchase_orders (delivery_date)
 WHERE delivery_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_orders__delivery_date IS '납품 희망일별 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_orders__po_code
    ON psm.purchase_orders (po_code)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ux_purchase_orders__po_code IS '구매발주 코드 유니크 제약 (논리 삭제 제외)';