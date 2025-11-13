-- =====================================================================================
-- 테이블: psm.purchase_requisition_items
-- 설명: 구매요청 품목 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS psm.purchase_requisition_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매요청 라인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 라인 기본 정보
    pr_id              UUID                     NOT NULL,                               -- 구매요청 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    description             TEXT,                                                            -- 품목 설명
    
    -- 수량 및 금액
    qty                     INTEGER                  NOT NULL,                               -- 요청 수량
    unit_price              NUMERIC(18,4)            DEFAULT 0,                              -- 단가
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    required_date           DATE,                                                            -- 필요 일자
    
    -- 외래키 제약조건
    -- 구매요청 헤더 참조 외래키 (헤더 삭제 시 품목도 함께 삭제)
    CONSTRAINT fk_purchase_requisition_items__pr_id     FOREIGN KEY (pr_id) 
                                                        REFERENCES psm.purchase_requisitions(id) 
                                                        ON DELETE CASCADE,
    
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_purchase_requisition_items__product_id FOREIGN KEY (product_id) 
                                                         REFERENCES pim.products(id) 
                                                         ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 라인 번호 양수 체크
    CONSTRAINT ck_purchase_requisition_items__line_no   CHECK (line_no > 0),
    
    -- 요청 수량 양수 체크
    CONSTRAINT ck_purchase_requisition_items__qty       CHECK (qty > 0),
    
    -- 단가 음수 불가
    CONSTRAINT ck_purchase_requisition_items__unit_price CHECK (unit_price >= 0),
    
    -- 총 금액 음수 불가
    CONSTRAINT ck_purchase_requisition_items__total_amount CHECK (total_amount >= 0)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================


COMMENT ON TABLE  psm.purchase_requisition_items                 IS '구매요청 품목 관리 테이블';
COMMENT ON COLUMN psm.purchase_requisition_items.id              IS '구매요청 품목 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_requisition_items.created_at      IS '등록 일시';
COMMENT ON COLUMN psm.purchase_requisition_items.created_by      IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_requisition_items.updated_at      IS '수정 일시';
COMMENT ON COLUMN psm.purchase_requisition_items.updated_by      IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_requisition_items.pr_id           IS '구매요청 헤더 식별자';
COMMENT ON COLUMN psm.purchase_requisition_items.line_no         IS '라인 번호 (1부터 시작)';
COMMENT ON COLUMN psm.purchase_requisition_items.product_id      IS '제품 식별자';
COMMENT ON COLUMN psm.purchase_requisition_items.description     IS '품목 설명 (특이사항 등)';
COMMENT ON COLUMN psm.purchase_requisition_items.qty             IS '요청 수량';
COMMENT ON COLUMN psm.purchase_requisition_items.unit_price      IS '단가';
COMMENT ON COLUMN psm.purchase_requisition_items.total_amount    IS '총 금액 (qty × unit_price)';
COMMENT ON COLUMN psm.purchase_requisition_items.required_date   IS '필요 일자 (납품 요청일)';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_purchase_requisition_items__pr_id
    ON psm.purchase_requisition_items (pr_id, line_no);
COMMENT ON INDEX psm.ix_purchase_requisition_items__pr_id IS '구매요청별 품목 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisition_items__product_id
    ON psm.purchase_requisition_items (product_id);
COMMENT ON INDEX psm.ix_purchase_requisition_items__product_id IS '제품별 구매요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisition_items__required_date
    ON psm.purchase_requisition_items (required_date)
 WHERE required_date IS NOT NULL;
COMMENT ON INDEX psm.ix_purchase_requisition_items__required_date IS '필요 일자별 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_requisition_items__pr_line
    ON psm.purchase_requisition_items (pr_id, line_no);
COMMENT ON INDEX psm.ux_purchase_requisition_items__pr_line IS '구매요청별 라인번호 유니크 제약';