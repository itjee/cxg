-- =====================================================================================
-- 테이블: srm.sales_invoice_items
-- 설명: 판매 송장/세금계산서 품목 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.sales_invoice_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 송장 품목 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    invoice_id              UUID                     NOT NULL,                               -- 송장 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    delivery_item_id        UUID,                                                            -- 출고 품목 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    description             TEXT,                                                            -- 품목 설명
    
    -- 수량 및 금액
    qty                     INTEGER                  NOT NULL,                               -- 청구 수량
    unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가
    discount_rate           NUMERIC(5,2)             DEFAULT 0,                              -- 할인율
    subtotal                NUMERIC(18,4)            NOT NULL,                               -- 공급가액
    tax_rate                NUMERIC(5,2)             DEFAULT 10,                             -- 세율
    tax_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 세액
    total_amount            NUMERIC(18,4)            NOT NULL,                               -- 합계 금액
    
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_sales_invoice_items__line_no      CHECK (line_no > 0),
    
    -- 청구 수량 양수 체크 (1 이상)
    CONSTRAINT ck_sales_invoice_items__qty          CHECK (qty > 0),
    
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_invoice_items__unit_price   CHECK (unit_price >= 0),
    
    -- 할인율 범위 체크 (0~100%)
    CONSTRAINT ck_sales_invoice_items__discount_rate CHECK (discount_rate >= 0 AND discount_rate <= 100),
    
    -- 공급가액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_invoice_items__subtotal     CHECK (subtotal >= 0),
    
    -- 세율 범위 체크 (0~100%)
    CONSTRAINT ck_sales_invoice_items__tax_rate     CHECK (tax_rate >= 0 AND tax_rate <= 100),
    
    -- 세액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_invoice_items__tax_amount   CHECK (tax_amount >= 0),
    
    -- 합계 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_invoice_items__total_amount CHECK (total_amount >= 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  srm.sales_invoice_items                    IS '판매 송장/세금계산서 품목 관리 테이블';
COMMENT ON COLUMN srm.sales_invoice_items.id                 IS '송장 품목 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.sales_invoice_items.created_at         IS '등록 일시';
COMMENT ON COLUMN srm.sales_invoice_items.created_by         IS '등록자 UUID';
COMMENT ON COLUMN srm.sales_invoice_items.updated_at         IS '수정 일시';
COMMENT ON COLUMN srm.sales_invoice_items.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN srm.sales_invoice_items.invoice_id         IS '송장 헤더 식별자';
COMMENT ON COLUMN srm.sales_invoice_items.line_no            IS '라인 번호';
COMMENT ON COLUMN srm.sales_invoice_items.delivery_item_id   IS '출고 품목 식별자';
COMMENT ON COLUMN srm.sales_invoice_items.product_id         IS '제품 식별자';
COMMENT ON COLUMN srm.sales_invoice_items.description        IS '품목 설명';
COMMENT ON COLUMN srm.sales_invoice_items.qty                IS '청구 수량';
COMMENT ON COLUMN srm.sales_invoice_items.unit_price         IS '단가';
COMMENT ON COLUMN srm.sales_invoice_items.discount_rate      IS '할인율 (%)';
COMMENT ON COLUMN srm.sales_invoice_items.subtotal           IS '공급가액 (수량 × 단가 × (1 - 할인율))';
COMMENT ON COLUMN srm.sales_invoice_items.tax_rate           IS '세율 (%)';
COMMENT ON COLUMN srm.sales_invoice_items.tax_amount         IS '세액 (공급가액 × 세율)';
COMMENT ON COLUMN srm.sales_invoice_items.total_amount       IS '합계 금액 (공급가액 + 세액)';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_sales_invoice_items__invoice_line 
    ON srm.sales_invoice_items (invoice_id, line_no);
COMMENT ON INDEX srm.ux_sales_invoice_items__invoice_line IS '송장별 라인번호 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_sales_invoice_items__invoice_id 
    ON srm.sales_invoice_items (invoice_id, line_no);
COMMENT ON INDEX srm.ix_sales_invoice_items__invoice_id IS '송장별 품목 조회 인덱스';

CREATE INDEX ix_sales_invoice_items__delivery_item_id 
    ON srm.sales_invoice_items (delivery_item_id)
 WHERE delivery_item_id IS NOT NULL;
COMMENT ON INDEX srm.ix_sales_invoice_items__delivery_item_id IS '출고 품목별 송장 조회 인덱스';

CREATE INDEX ix_sales_invoice_items__product_id 
    ON srm.sales_invoice_items (product_id);
COMMENT ON INDEX srm.ix_sales_invoice_items__product_id IS '제품별 송장 조회 인덱스';

-- 외래키 제약조건
-- 송장 헤더 참조 (CASCADE 삭제)
ALTER TABLE srm.sales_invoice_items 
  ADD CONSTRAINT fk_sales_invoice_items__invoice_id
    FOREIGN KEY (invoice_id) 
    REFERENCES srm.sales_invoices(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_sales_invoice_items__invoice_id ON srm.sales_invoice_items IS '송장 헤더 참조 외래키 (헤더 삭제 시 품목도 함께 삭제)';

-- 출고 품목 참조 (SET NULL 삭제)
ALTER TABLE srm.sales_invoice_items 
  ADD CONSTRAINT fk_sales_invoice_items__delivery_item_id
    FOREIGN KEY (delivery_item_id) 
    REFERENCES srm.sales_delivery_items(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_sales_invoice_items__delivery_item_id ON srm.sales_invoice_items IS '출고 품목 참조 외래키 (SET NULL 삭제)';

-- 제품 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_invoice_items 
  ADD CONSTRAINT fk_sales_invoice_items__product_id
    FOREIGN KEY (product_id) 
    REFERENCES pim.products(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_invoice_items__product_id ON srm.sales_invoice_items IS '제품 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 완료: srm.sales_invoice_items 테이블 정의
-- =====================================================================================
