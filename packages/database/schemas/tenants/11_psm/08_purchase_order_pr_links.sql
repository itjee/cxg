-- =====================================================================================
-- 테이블: psm.purchase_order_pr_links
-- 설명: 구매요청-발주 연결 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS psm.purchase_order_pr_links 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 연결 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    
    -- 연결 정보
    po_id                   UUID                     NOT NULL,                               -- 구매발주 식별자
    po_item_id              UUID                     NOT NULL,                               -- 구매발주 품목 식별자
    pr_id                   UUID                     NOT NULL,                               -- 구매요청 식별자
    pr_item_id              UUID                     NOT NULL,                               -- 구매요청 품목 식별자
    
    -- 수량 정보
    qty                     INTEGER                  NOT NULL,                               -- 연결된 수량
    
    -- 외래키 제약조건
    -- 구매발주 헤더 참조 외래키 (발주 삭제 시 연결 정보도 삭제)
    CONSTRAINT fk_purchase_order_pr_links__po_id        FOREIGN KEY (po_id) 
                                                        REFERENCES psm.purchase_orders(id) 
                                                        ON DELETE CASCADE,
    
    -- 구매발주 품목 참조 외래키 (품목 삭제 시 연결 정보도 삭제)
    CONSTRAINT fk_purchase_order_pr_links__po_item_id   FOREIGN KEY (po_item_id) 
                                                        REFERENCES psm.purchase_order_items(id) 
                                                        ON DELETE CASCADE,
    
    -- 구매요청 헤더 참조 외래키 (요청 삭제 시 연결 정보도 삭제)
    CONSTRAINT fk_purchase_order_pr_links__pr_id        FOREIGN KEY (pr_id) 
                                                        REFERENCES psm.purchase_requisitions(id) 
                                                        ON DELETE CASCADE,
    
    -- 구매요청 품목 참조 외래키 (품목 삭제 시 연결 정보도 삭제)
    CONSTRAINT fk_purchase_order_pr_links__pr_item_id   FOREIGN KEY (pr_item_id) 
                                                        REFERENCES psm.purchase_requisition_items(id) 
                                                        ON DELETE CASCADE,
    
    -- CHECK 제약조건
    -- 연결 수량 양수 체크
    CONSTRAINT ck_purchase_order_pr_links__qty          CHECK (qty > 0)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  psm.purchase_order_pr_links                   IS '구매요청-발주 연결 관리 테이블 (하나의 PR이 여러 PO로 분할 가능)';
COMMENT ON COLUMN psm.purchase_order_pr_links.id                IS '연결 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_order_pr_links.created_at        IS '등록 일시';
COMMENT ON COLUMN psm.purchase_order_pr_links.created_by        IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_order_pr_links.po_id             IS '구매발주 식별자';
COMMENT ON COLUMN psm.purchase_order_pr_links.po_item_id        IS '구매발주 품목 식별자';
COMMENT ON COLUMN psm.purchase_order_pr_links.pr_id             IS '구매요청 식별자';
COMMENT ON COLUMN psm.purchase_order_pr_links.pr_item_id        IS '구매요청 품목 식별자';
COMMENT ON COLUMN psm.purchase_order_pr_links.qty               IS '연결된 수량 (PR 품목 수량 중 해당 PO에 포함된 수량)';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_purchase_order_pr_links__po_id
    ON psm.purchase_order_pr_links (po_id, pr_id);
COMMENT ON INDEX psm.ix_purchase_order_pr_links__po_id IS '발주별 구매요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_pr_links__pr_id
    ON psm.purchase_order_pr_links (pr_id, po_id);
COMMENT ON INDEX psm.ix_purchase_order_pr_links__pr_id IS '구매요청별 발주 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_pr_links__po_item_id
    ON psm.purchase_order_pr_links (po_item_id);
COMMENT ON INDEX psm.ix_purchase_order_pr_links__po_item_id IS '발주 품목별 연결 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_order_pr_links__pr_item_id
    ON psm.purchase_order_pr_links (pr_item_id);
COMMENT ON INDEX psm.ix_purchase_order_pr_links__pr_item_id IS '구매요청 품목별 연결 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_order_pr_links__po_pr_items
    ON psm.purchase_order_pr_links (po_item_id, pr_item_id);
COMMENT ON INDEX psm.ux_purchase_order_pr_links__po_pr_items IS '발주품목-구매요청품목 중복 방지';
