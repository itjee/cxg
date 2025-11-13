-- =====================================================================================
-- 테이블: psm.purchase_order_receipts
-- 설명: 구매발주 입고 헤더 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS psm.purchase_order_receipts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 입고 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 입고 기본 정보
    receipt_no              VARCHAR(50)              NOT NULL,                               -- 입고 번호
    receipt_date            DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 입고 일자
    po_id                   UUID                     NOT NULL,                               -- 구매발주 식별자
    
    -- 창고 정보
    warehouse_id            UUID                     NOT NULL,                               -- 입고 창고 식별자
    location_id             UUID,                                                            -- 입고 로케이션 식별자
    
    -- 배송 정보
    delivery_note_no        VARCHAR(50),                                                     -- 배송 전표 번호
    carrier                 VARCHAR(100),                                                    -- 배송 업체
    tracking_no             VARCHAR(100),                                                    -- 송장 번호
    
    -- 입고 상태
    status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 입고 상태
    
    -- 검수 정보
    inspected_by            UUID,                                                            -- 검수자 UUID
    inspected_at            TIMESTAMP WITH TIME ZONE,                                        -- 검수 일시
    inspection_result       VARCHAR(20),                                                     -- 검수 결과
    inspection_notes        TEXT,                                                            -- 검수 비고
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 외래키 제약조건
    -- 구매발주 참조 외래키 (발주 삭제 불가)
    CONSTRAINT fk_purchase_order_receipts__po_id        FOREIGN KEY (po_id) 
                                                        REFERENCES psm.purchase_orders(id) 
                                                        ON DELETE RESTRICT,
    
    -- 창고 참조 외래키 (창고 삭제 불가)
    CONSTRAINT fk_purchase_order_receipts__warehouse_id FOREIGN KEY (warehouse_id) 
                                                        REFERENCES wms.warehouses(id) 
                                                        ON DELETE RESTRICT,
    
    -- 로케이션 참조 외래키 (로케이션 삭제 불가)
    CONSTRAINT fk_purchase_order_receipts__location_id  FOREIGN KEY (location_id) 
                                                        REFERENCES wms.warehouse_locations(id) 
                                                        ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 입고 상태 체크
    CONSTRAINT ck_purchase_order_receipts__status       CHECK (status IN ('DRAFT', 'IN_PROGRESS', 'INSPECTING', 'COMPLETED', 'REJECTED')),
    
    -- 검수 결과 체크
    CONSTRAINT ck_purchase_order_receipts__inspection_result CHECK (inspection_result IS NULL OR inspection_result IN ('PASS', 'PARTIAL', 'FAIL'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  psm.purchase_order_receipts                       IS '구매발주 입고 헤더 관리 테이블';
COMMENT ON COLUMN psm.purchase_order_receipts.id                    IS '입고 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_order_receipts.created_at            IS '등록 일시';
COMMENT ON COLUMN psm.purchase_order_receipts.created_by            IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_order_receipts.updated_at            IS '수정 일시';
COMMENT ON COLUMN psm.purchase_order_receipts.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_order_receipts.receipt_no            IS '입고 번호';
COMMENT ON COLUMN psm.purchase_order_receipts.receipt_date          IS '입고 일자';
COMMENT ON COLUMN psm.purchase_order_receipts.po_id                 IS '구매발주 식별자';
COMMENT ON COLUMN psm.purchase_order_receipts.warehouse_id          IS '입고 창고 식별자';
COMMENT ON COLUMN psm.purchase_order_receipts.location_id           IS '입고 로케이션 식별자';
COMMENT ON COLUMN psm.purchase_order_receipts.delivery_note_no      IS '배송 전표 번호';
COMMENT ON COLUMN psm.purchase_order_receipts.carrier               IS '배송 업체명';
COMMENT ON COLUMN psm.purchase_order_receipts.tracking_no           IS '송장 번호';
COMMENT ON COLUMN psm.purchase_order_receipts.status                IS '입고 상태 (DRAFT/IN_PROGRESS/INSPECTING/COMPLETED/REJECTED)';
COMMENT ON COLUMN psm.purchase_order_receipts.inspected_by          IS '검수자 UUID';
COMMENT ON COLUMN psm.purchase_order_receipts.inspected_at          IS '검수 일시';
COMMENT ON COLUMN psm.purchase_order_receipts.inspection_result     IS '검수 결과 (PASS/PARTIAL/FAIL)';
COMMENT ON COLUMN psm.purchase_order_receipts.inspection_notes      IS '검수 비고 (불량 사유 등)';
COMMENT ON COLUMN psm.purchase_order_receipts.notes                 IS '비고';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_order_receipts__receipt_no
    ON psm.purchase_order_receipts (receipt_no);
COMMENT ON INDEX psm.ux_purchase_order_receipts__receipt_no IS '입고 번호 유니크 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipts__po_id
    ON psm.purchase_order_receipts (po_id, receipt_date DESC);
COMMENT ON INDEX psm.ix_purchase_order_receipts__po_id IS '발주별 입고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipts__warehouse_id
    ON psm.purchase_order_receipts (warehouse_id, receipt_date DESC);
COMMENT ON INDEX psm.ix_purchase_order_receipts__warehouse_id IS '창고별 입고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipts__status
    ON psm.purchase_order_receipts (status, receipt_date DESC);
COMMENT ON INDEX psm.ix_purchase_order_receipts__status IS '상태별 입고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipts__receipt_date
    ON psm.purchase_order_receipts (receipt_date DESC);
COMMENT ON INDEX psm.ix_purchase_order_receipts__receipt_date IS '입고일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipts__tracking_no
    ON psm.purchase_order_receipts (tracking_no)
 WHERE tracking_no IS NOT NULL;
COMMENT ON INDEX psm.ix_purchase_order_receipts__tracking_no IS '송장번호 조회 인덱스';
