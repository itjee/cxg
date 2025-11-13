-- =====================================================================================
-- 테이블: psm.purchase_order_items
-- 설명: 구매발주 품목 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS psm.purchase_order_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매발주 라인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 라인 기본 정보
    po_id                   UUID                     NOT NULL,                               -- 구매발주 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    description             TEXT,                                                            -- 품목 설명
    
    -- 수량 및 금액
    qty                     INTEGER                  NOT NULL,                               -- 발주 수량
    unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가
    total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액
    received_qty            INTEGER                  DEFAULT 0,                              -- 입고 완료 수량
    
    -- 외래키 제약조건
    -- 구매발주 헤더 참조 외래키 (헤더 삭제 시 품목도 함께 삭제)
    CONSTRAINT fk_purchase_order_items__po_id       FOREIGN KEY (po_id) 
                                                    REFERENCES psm.purchase_orders(id) 
                                                    ON DELETE CASCADE,
    
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_purchase_order_items__product_id  FOREIGN KEY (product_id) 
                                                    REFERENCES pim.products(id) 
                                                    ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 라인 번호 양수 체크
    CONSTRAINT ck_purchase_order_items__line_no     CHECK (line_no > 0),
    
    -- 발주 수량 양수 체크
    CONSTRAINT ck_purchase_order_items__qty         CHECK (qty > 0),
    
    -- 단가 음수 불가
    CONSTRAINT ck_purchase_order_items__unit_price  CHECK (unit_price >= 0),
    
    -- 총 금액 음수 불가
    CONSTRAINT ck_purchase_order_items__total_amount CHECK (total_amount >= 0),
    
    -- 입고 수량 음수 불가
    CONSTRAINT ck_purchase_order_items__received_qty CHECK (received_qty >= 0),
    
    -- 입고 수량이 발주 수량을 초과할 수 없음
    CONSTRAINT ck_purchase_order_items__received_qty_limit CHECK (received_qty <= qty)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================


COMMENT ON TABLE  psm.purchase_order_items                   IS '구매발주 품목 관리 테이블';
COMMENT ON COLUMN psm.purchase_order_items.id                IS '구매발주 품목 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_order_items.created_at        IS '등록 일시';
COMMENT ON COLUMN psm.purchase_order_items.created_by        IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_order_items.updated_at        IS '수정 일시';
COMMENT ON COLUMN psm.purchase_order_items.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_order_items.po_id             IS '구매발주 헤더 식별자';
COMMENT ON COLUMN psm.purchase_order_items.line_no           IS '라인 번호 (1부터 시작)';
COMMENT ON COLUMN psm.purchase_order_items.product_id        IS '제품 식별자';
COMMENT ON COLUMN psm.purchase_order_items.description       IS '품목 설명 (특이사항 등)';
COMMENT ON COLUMN psm.purchase_order_items.qty               IS '발주 수량';
COMMENT ON COLUMN psm.purchase_order_items.unit_price        IS '단가';
COMMENT ON COLUMN psm.purchase_order_items.total_amount      IS '총 금액 (qty × unit_price)';
COMMENT ON COLUMN psm.purchase_order_items.received_qty      IS '입고 완료 수량 (누적)';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_purchase_order_items__po_id
    ON psm.purchase_order_items (po_id, line_no);
COMMENT ON INDEX psm.ix_purchase_order_items__po_id IS '구매발주별 품목 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_items__product_id
    ON psm.purchase_order_items (product_id);
COMMENT ON INDEX psm.ix_purchase_order_items__product_id IS '제품별 구매발주 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_items__received_qty
    ON psm.purchase_order_items (po_id, received_qty)
 WHERE received_qty < qty;
COMMENT ON INDEX psm.ix_purchase_order_items__received_qty IS '미입고 발주품목 조회 인덱스 (received_qty < qty)';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_order_items__po_line
    ON psm.purchase_order_items (po_id, line_no);
COMMENT ON INDEX psm.ux_purchase_order_items__po_line IS '구매발주별 라인번호 유니크 제약';

