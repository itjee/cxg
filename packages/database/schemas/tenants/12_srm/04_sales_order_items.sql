-- =====================================================================================
-- 테이블: srm.sales_order_items
-- 설명: 판매주문 품목 관리 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-24 - 테이블명 변경 (sales_order_lines → sales_order_items)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.sales_order_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 판매주문 품목 고유 식별자
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
    
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_sales_order_items__line_no        CHECK (line_no > 0),
    
    -- 주문 수량 양수 체크 (1 이상)
    CONSTRAINT ck_sales_order_items__qty            CHECK (qty > 0),
    
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_order_items__unit_price     CHECK (unit_price >= 0),
    
    -- 할인율 범위 체크 (0~100%)
    CONSTRAINT ck_sales_order_items__discount_rate  CHECK (discount_rate >= 0 AND discount_rate <= 100),
    
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_order_items__total_amount   CHECK (total_amount >= 0),
    
    -- 출고 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_order_items__shipped_qty    CHECK (shipped_qty >= 0),
    
    -- 출고 수량이 주문 수량을 초과할 수 없음
    CONSTRAINT ck_sales_order_items__shipped_qty_limit CHECK (shipped_qty <= qty)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  srm.sales_order_items                      IS '판매주문 품목 관리 테이블';
COMMENT ON COLUMN srm.sales_order_items.id                   IS '판매주문 품목 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.sales_order_items.created_at           IS '등록 일시';
COMMENT ON COLUMN srm.sales_order_items.created_by           IS '등록자 UUID';
COMMENT ON COLUMN srm.sales_order_items.updated_at           IS '수정 일시';
COMMENT ON COLUMN srm.sales_order_items.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN srm.sales_order_items.so_id                IS '판매주문 헤더 식별자';
COMMENT ON COLUMN srm.sales_order_items.line_no              IS '라인 번호';
COMMENT ON COLUMN srm.sales_order_items.product_id           IS '제품 식별자';
COMMENT ON COLUMN srm.sales_order_items.description          IS '품목 설명';
COMMENT ON COLUMN srm.sales_order_items.qty                  IS '주문 수량';
COMMENT ON COLUMN srm.sales_order_items.unit_price           IS '단가';
COMMENT ON COLUMN srm.sales_order_items.discount_rate        IS '할인율 (%)';
COMMENT ON COLUMN srm.sales_order_items.total_amount         IS '총 금액 (수량 × 단가 × (1 - 할인율))';
COMMENT ON COLUMN srm.sales_order_items.shipped_qty          IS '출고 완료 수량';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_sales_order_items__so_line 
    ON srm.sales_order_items (so_id, line_no);
COMMENT ON INDEX srm.ux_sales_order_items__so_line IS '판매주문별 라인번호 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_sales_order_items__so_id 
    ON srm.sales_order_items (so_id, line_no);
COMMENT ON INDEX srm.ix_sales_order_items__so_id IS '판매주문별 품목 조회 인덱스';

CREATE INDEX ix_sales_order_items__product_id 
    ON srm.sales_order_items (product_id);
COMMENT ON INDEX srm.ix_sales_order_items__product_id IS '제품별 판매주문 조회 인덱스';

CREATE INDEX ix_sales_order_items__shipped_qty 
    ON srm.sales_order_items (so_id)
 WHERE shipped_qty < qty;
COMMENT ON INDEX srm.ix_sales_order_items__shipped_qty IS '미출고 주문품목 조회 인덱스';

-- 외래키 제약조건
-- 판매주문 헤더 참조 (CASCADE 삭제)
ALTER TABLE srm.sales_order_items 
  ADD CONSTRAINT fk_sales_order_items__so_id
    FOREIGN KEY (so_id) 
    REFERENCES srm.sales_orders(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_sales_order_items__so_id ON srm.sales_order_items IS '판매주문 헤더 참조 외래키 (헤더 삭제 시 품목도 함께 삭제)';

-- 제품 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_order_items 
  ADD CONSTRAINT fk_sales_order_items__product_id
    FOREIGN KEY (product_id) 
    REFERENCES pim.products(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_order_items__product_id ON srm.sales_order_items IS '제품 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 완료: srm.sales_order_items 테이블 정의
-- =====================================================================================