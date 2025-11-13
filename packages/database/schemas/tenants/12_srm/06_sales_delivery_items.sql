-- =====================================================================================
-- 테이블: srm.sales_delivery_items
-- 설명: 판매 출고/배송 품목 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.sales_delivery_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 출고 품목 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    delivery_id             UUID                     NOT NULL,                               -- 출고 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    so_item_id              UUID                     NOT NULL,                               -- 판매주문 품목 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    description             TEXT,                                                            -- 품목 설명
    
    -- 수량 정보
    qty                     INTEGER                  NOT NULL,                               -- 출고 수량
    
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_sales_delivery_items__line_no     CHECK (line_no > 0),
    
    -- 출고 수량 양수 체크 (1 이상)
    CONSTRAINT ck_sales_delivery_items__qty         CHECK (qty > 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  srm.sales_delivery_items                   IS '판매 출고/배송 품목 관리 테이블';
COMMENT ON COLUMN srm.sales_delivery_items.id                IS '출고 품목 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.sales_delivery_items.created_at        IS '등록 일시';
COMMENT ON COLUMN srm.sales_delivery_items.created_by        IS '등록자 UUID';
COMMENT ON COLUMN srm.sales_delivery_items.updated_at        IS '수정 일시';
COMMENT ON COLUMN srm.sales_delivery_items.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN srm.sales_delivery_items.delivery_id       IS '출고 헤더 식별자';
COMMENT ON COLUMN srm.sales_delivery_items.line_no           IS '라인 번호';
COMMENT ON COLUMN srm.sales_delivery_items.so_item_id        IS '판매주문 품목 식별자';
COMMENT ON COLUMN srm.sales_delivery_items.product_id        IS '제품 식별자';
COMMENT ON COLUMN srm.sales_delivery_items.description       IS '품목 설명';
COMMENT ON COLUMN srm.sales_delivery_items.qty               IS '출고 수량';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_sales_delivery_items__delivery_line 
    ON srm.sales_delivery_items (delivery_id, line_no);
COMMENT ON INDEX srm.ux_sales_delivery_items__delivery_line IS '출고별 라인번호 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_sales_delivery_items__delivery_id 
    ON srm.sales_delivery_items (delivery_id, line_no);
COMMENT ON INDEX srm.ix_sales_delivery_items__delivery_id IS '출고별 품목 조회 인덱스';

CREATE INDEX ix_sales_delivery_items__so_item_id 
    ON srm.sales_delivery_items (so_item_id);
COMMENT ON INDEX srm.ix_sales_delivery_items__so_item_id IS '판매주문 품목별 출고 조회 인덱스';

CREATE INDEX ix_sales_delivery_items__product_id 
    ON srm.sales_delivery_items (product_id);
COMMENT ON INDEX srm.ix_sales_delivery_items__product_id IS '제품별 출고 조회 인덱스';

-- 외래키 제약조건
-- 출고 헤더 참조 (CASCADE 삭제)
ALTER TABLE srm.sales_delivery_items 
  ADD CONSTRAINT fk_sales_delivery_items__delivery_id
    FOREIGN KEY (delivery_id) 
    REFERENCES srm.sales_deliveries(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_sales_delivery_items__delivery_id ON srm.sales_delivery_items IS '출고 헤더 참조 외래키 (헤더 삭제 시 품목도 함께 삭제)';

-- 판매주문 품목 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_delivery_items 
  ADD CONSTRAINT fk_sales_delivery_items__so_item_id
    FOREIGN KEY (so_item_id) 
    REFERENCES srm.sales_order_items(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_delivery_items__so_item_id ON srm.sales_delivery_items IS '판매주문 품목 참조 외래키 (RESTRICT 삭제)';

-- 제품 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_delivery_items 
  ADD CONSTRAINT fk_sales_delivery_items__product_id
    FOREIGN KEY (product_id) 
    REFERENCES pim.products(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_delivery_items__product_id ON srm.sales_delivery_items IS '제품 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 완료: srm.sales_delivery_items 테이블 정의
-- =====================================================================================
