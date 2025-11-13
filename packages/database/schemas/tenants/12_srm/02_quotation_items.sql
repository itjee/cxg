-- =====================================================================================
-- 테이블: srm.quotation_items
-- 설명: 판매 견적서 품목 관리 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-24 - 테이블명 변경 (quotation_lines → quotation_items)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.quotation_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적서 품목 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    quote_id                UUID                     NOT NULL,                               -- 견적서 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    description             TEXT,                                                            -- 품목 설명
    
    -- 수량 및 금액
    qty                     INTEGER                  NOT NULL,                               -- 견적 수량
    unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가
    discount_rate           NUMERIC(5,2)             DEFAULT 0,                              -- 할인율
    total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액
    
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_quotation_items__line_no          CHECK (line_no > 0),
    
    -- 견적 수량 양수 체크 (1 이상)
    CONSTRAINT ck_quotation_items__qty              CHECK (qty > 0),
    
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_quotation_items__unit_price       CHECK (unit_price >= 0),
    
    -- 할인율 범위 체크 (0~100%)
    CONSTRAINT ck_quotation_items__discount_rate    CHECK (discount_rate >= 0 AND discount_rate <= 100),
    
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_quotation_items__total_amount     CHECK (total_amount >= 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  srm.quotation_items                    IS '판매 견적서 품목 관리 테이블';
COMMENT ON COLUMN srm.quotation_items.id                 IS '견적서 품목 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.quotation_items.created_at         IS '등록 일시';
COMMENT ON COLUMN srm.quotation_items.created_by         IS '등록자 UUID';
COMMENT ON COLUMN srm.quotation_items.updated_at         IS '수정 일시';
COMMENT ON COLUMN srm.quotation_items.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN srm.quotation_items.quote_id           IS '견적서 헤더 식별자';
COMMENT ON COLUMN srm.quotation_items.line_no            IS '라인 번호';
COMMENT ON COLUMN srm.quotation_items.product_id         IS '제품 식별자';
COMMENT ON COLUMN srm.quotation_items.description        IS '품목 설명';
COMMENT ON COLUMN srm.quotation_items.qty                IS '견적 수량';
COMMENT ON COLUMN srm.quotation_items.unit_price         IS '단가';
COMMENT ON COLUMN srm.quotation_items.discount_rate      IS '할인율 (%)';
COMMENT ON COLUMN srm.quotation_items.total_amount       IS '총 금액 (수량 × 단가 × (1 - 할인율))';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_quotation_items__quote_line 
    ON srm.quotation_items (quote_id, line_no);
COMMENT ON INDEX srm.ux_quotation_items__quote_line IS '견적서별 라인번호 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_quotation_items__quote_id 
    ON srm.quotation_items (quote_id, line_no);
COMMENT ON INDEX srm.ix_quotation_items__quote_id IS '견적서별 품목 조회 인덱스';

CREATE INDEX ix_quotation_items__product_id 
    ON srm.quotation_items (product_id);
COMMENT ON INDEX srm.ix_quotation_items__product_id IS '제품별 견적 조회 인덱스';

-- 외래키 제약조건
-- 견적서 헤더 참조 (CASCADE 삭제)
ALTER TABLE srm.quotation_items 
  ADD CONSTRAINT fk_quotation_items__quote_id
    FOREIGN KEY (quote_id) 
    REFERENCES srm.quotations(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_quotation_items__quote_id ON srm.quotation_items IS '견적서 헤더 참조 외래키 (헤더 삭제 시 품목도 함께 삭제)';

-- 제품 참조 (RESTRICT 삭제)
ALTER TABLE srm.quotation_items 
  ADD CONSTRAINT fk_quotation_items__product_id
    FOREIGN KEY (product_id) 
    REFERENCES pim.products(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_quotation_items__product_id ON srm.quotation_items IS '제품 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 완료: srm.quotation_items 테이블 정의
-- =====================================================================================