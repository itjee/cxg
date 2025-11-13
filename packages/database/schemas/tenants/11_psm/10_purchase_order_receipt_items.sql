-- =====================================================================================
-- 테이블: psm.purchase_order_receipt_items
-- 설명: 구매발주 입고 품목 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS psm.purchase_order_receipt_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 입고 품목 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 품목 기본 정보
    receipt_id              UUID                     NOT NULL,                               -- 입고 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    po_item_id              UUID                     NOT NULL,                               -- 구매발주 품목 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    
    -- 수량 정보
    ordered_qty             INTEGER                  NOT NULL,                               -- 발주 수량
    received_qty            INTEGER                  NOT NULL,                               -- 입고 수량
    accepted_qty            INTEGER                  DEFAULT 0,                              -- 합격 수량
    rejected_qty            INTEGER                  DEFAULT 0,                              -- 불합격 수량
    
    -- 검수 정보
    inspection_status       VARCHAR(20)              DEFAULT 'PENDING',                      -- 검수 상태
    rejection_reason        TEXT,                                                            -- 불합격 사유
    
    -- 로케이션 정보
    location_id             UUID,                                                            -- 입고 로케이션
    lot_no                  VARCHAR(100),                                                    -- LOT 번호
    
    -- 외래키 제약조건
    -- 입고 헤더 참조 외래키 (헤더 삭제 시 품목도 함께 삭제)
    CONSTRAINT fk_purchase_order_receipt_items__receipt_id      FOREIGN KEY (receipt_id) 
                                                                REFERENCES psm.purchase_order_receipts(id) 
                                                                ON DELETE CASCADE,
    
    -- 구매발주 품목 참조 외래키 (발주품목 삭제 불가)
    CONSTRAINT fk_purchase_order_receipt_items__po_item_id      FOREIGN KEY (po_item_id) 
                                                                REFERENCES psm.purchase_order_items(id) 
                                                                ON DELETE RESTRICT,
    
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_purchase_order_receipt_items__product_id      FOREIGN KEY (product_id) 
                                                                REFERENCES pim.products(id) 
                                                                ON DELETE RESTRICT,
    
    -- 로케이션 참조 외래키 (로케이션 삭제 불가)
    CONSTRAINT fk_purchase_order_receipt_items__location_id     FOREIGN KEY (location_id) 
                                                                REFERENCES wms.warehouse_locations(id) 
                                                                ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 라인 번호 양수 체크
    CONSTRAINT ck_purchase_order_receipt_items__line_no         CHECK (line_no > 0),
    
    -- 발주 수량 양수 체크
    CONSTRAINT ck_purchase_order_receipt_items__ordered_qty     CHECK (ordered_qty > 0),
    
    -- 입고 수량 양수 체크
    CONSTRAINT ck_purchase_order_receipt_items__received_qty    CHECK (received_qty > 0),
    
    -- 합격 수량 음수 불가
    CONSTRAINT ck_purchase_order_receipt_items__accepted_qty    CHECK (accepted_qty >= 0),
    
    -- 불합격 수량 음수 불가
    CONSTRAINT ck_purchase_order_receipt_items__rejected_qty    CHECK (rejected_qty >= 0),
    
    -- 합격+불합격 수량이 입고 수량과 일치
    CONSTRAINT ck_purchase_order_receipt_items__qty_match       CHECK (accepted_qty + rejected_qty = received_qty),
    
    -- 검수 상태 체크
    CONSTRAINT ck_purchase_order_receipt_items__inspection_status CHECK (inspection_status IN ('PENDING', 'IN_PROGRESS', 'PASS', 'PARTIAL', 'FAIL'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  psm.purchase_order_receipt_items                      IS '구매발주 입고 품목 관리 테이블';
COMMENT ON COLUMN psm.purchase_order_receipt_items.id                   IS '입고 품목 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_order_receipt_items.created_at           IS '등록 일시';
COMMENT ON COLUMN psm.purchase_order_receipt_items.created_by           IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_order_receipt_items.updated_at           IS '수정 일시';
COMMENT ON COLUMN psm.purchase_order_receipt_items.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_order_receipt_items.receipt_id           IS '입고 헤더 식별자';
COMMENT ON COLUMN psm.purchase_order_receipt_items.line_no              IS '라인 번호 (1부터 시작)';
COMMENT ON COLUMN psm.purchase_order_receipt_items.po_item_id           IS '구매발주 품목 식별자';
COMMENT ON COLUMN psm.purchase_order_receipt_items.product_id           IS '제품 식별자';
COMMENT ON COLUMN psm.purchase_order_receipt_items.ordered_qty          IS '발주 수량';
COMMENT ON COLUMN psm.purchase_order_receipt_items.received_qty         IS '입고 수량';
COMMENT ON COLUMN psm.purchase_order_receipt_items.accepted_qty         IS '합격 수량 (검수 통과)';
COMMENT ON COLUMN psm.purchase_order_receipt_items.rejected_qty         IS '불합격 수량 (검수 불통과)';
COMMENT ON COLUMN psm.purchase_order_receipt_items.inspection_status    IS '검수 상태 (PENDING/IN_PROGRESS/PASS/PARTIAL/FAIL)';
COMMENT ON COLUMN psm.purchase_order_receipt_items.rejection_reason     IS '불합격 사유';
COMMENT ON COLUMN psm.purchase_order_receipt_items.location_id          IS '입고 로케이션 식별자';
COMMENT ON COLUMN psm.purchase_order_receipt_items.lot_no               IS 'LOT 번호';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipt_items__receipt_id
    ON psm.purchase_order_receipt_items (receipt_id, line_no);
COMMENT ON INDEX psm.ix_purchase_order_receipt_items__receipt_id IS '입고별 품목 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipt_items__po_item_id
    ON psm.purchase_order_receipt_items (po_item_id);
COMMENT ON INDEX psm.ix_purchase_order_receipt_items__po_item_id IS '발주품목별 입고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipt_items__product_id
    ON psm.purchase_order_receipt_items (product_id);
COMMENT ON INDEX psm.ix_purchase_order_receipt_items__product_id IS '제품별 입고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipt_items__location_id
    ON psm.purchase_order_receipt_items (location_id)
 WHERE location_id IS NOT NULL;
COMMENT ON INDEX psm.ix_purchase_order_receipt_items__location_id IS '로케이션별 입고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipt_items__lot_no
    ON psm.purchase_order_receipt_items (lot_no)
 WHERE lot_no IS NOT NULL;
COMMENT ON INDEX psm.ix_purchase_order_receipt_items__lot_no IS 'LOT 번호별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_receipt_items__inspection_status
    ON psm.purchase_order_receipt_items (inspection_status, created_at DESC)
 WHERE inspection_status IN ('PENDING', 'IN_PROGRESS');
COMMENT ON INDEX psm.ix_purchase_order_receipt_items__inspection_status IS '미검수 품목 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_order_receipt_items__receipt_line
    ON psm.purchase_order_receipt_items (receipt_id, line_no);
COMMENT ON INDEX psm.ux_purchase_order_receipt_items__receipt_line IS '입고별 라인번호 유니크 제약';
