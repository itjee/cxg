-- =====================================================================================
-- 테이블: crm.rfq_items
-- 설명: 견적 요청서 품목 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.rfq_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적 요청 품목 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    rfq_id                  UUID                     NOT NULL,                               -- 견적 요청서 헤더 ID
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    
    -- 제품 정보
    product_id              UUID,                                                            -- 제품 ID
    product_name            VARCHAR(200),                                                    -- 제품명 (제품 미등록 시)
    product_code            VARCHAR(100),                                                    -- 제품 코드 (제품 미등록 시)
    description             TEXT,                                                            -- 상세 설명
    specifications          TEXT,                                                            -- 사양
    
    -- 수량 정보
    qty                     INTEGER                  NOT NULL,                               -- 요청 수량
    unit                    VARCHAR(20),                                                     -- 단위
    
    -- 희망 정보
    target_price            NUMERIC(18,4),                                                   -- 희망 단가
    target_delivery_date    DATE,                                                            -- 희망 납기일
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_rfq_items__line_no                CHECK (line_no > 0),
    
    -- 수량 양수 체크 (1 이상)
    CONSTRAINT ck_rfq_items__qty                    CHECK (qty > 0),
    
    -- 희망 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_rfq_items__target_price           CHECK (target_price IS NULL OR target_price >= 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.rfq_items                          IS '견적 요청서 품목 관리 테이블';
COMMENT ON COLUMN crm.rfq_items.id                       IS '견적 요청 품목 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.rfq_items.created_at               IS '등록 일시';
COMMENT ON COLUMN crm.rfq_items.created_by               IS '등록자 UUID';
COMMENT ON COLUMN crm.rfq_items.updated_at               IS '수정 일시';
COMMENT ON COLUMN crm.rfq_items.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN crm.rfq_items.rfq_id                   IS '견적 요청서 헤더 ID';
COMMENT ON COLUMN crm.rfq_items.line_no                  IS '라인 번호';
COMMENT ON COLUMN crm.rfq_items.product_id               IS '제품 ID (등록된 제품인 경우)';
COMMENT ON COLUMN crm.rfq_items.product_name             IS '제품명 (제품 미등록 시 직접 입력)';
COMMENT ON COLUMN crm.rfq_items.product_code             IS '제품 코드 (제품 미등록 시 직접 입력)';
COMMENT ON COLUMN crm.rfq_items.description              IS '상세 설명';
COMMENT ON COLUMN crm.rfq_items.specifications           IS '사양 (크기, 색상, 재질 등)';
COMMENT ON COLUMN crm.rfq_items.qty                      IS '요청 수량';
COMMENT ON COLUMN crm.rfq_items.unit                     IS '단위 (개, EA, BOX 등)';
COMMENT ON COLUMN crm.rfq_items.target_price             IS '희망 단가';
COMMENT ON COLUMN crm.rfq_items.target_delivery_date     IS '희망 납기일';
COMMENT ON COLUMN crm.rfq_items.notes                    IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_rfq_items__rfq_line 
    ON crm.rfq_items (rfq_id, line_no);
COMMENT ON INDEX crm.ux_rfq_items__rfq_line IS '견적 요청서별 라인번호 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_rfq_items__rfq_id 
    ON crm.rfq_items (rfq_id, line_no);
COMMENT ON INDEX crm.ix_rfq_items__rfq_id IS '견적 요청서별 품목 조회 인덱스';

CREATE INDEX ix_rfq_items__product_id 
    ON crm.rfq_items (product_id)
 WHERE product_id IS NOT NULL;
COMMENT ON INDEX crm.ix_rfq_items__product_id IS '제품별 견적 요청 조회 인덱스';

-- 외래키 제약조건
-- 견적 요청서 헤더 참조 (CASCADE 삭제)
ALTER TABLE crm.rfq_items 
  ADD CONSTRAINT fk_rfq_items__rfq_id
    FOREIGN KEY (rfq_id) 
    REFERENCES crm.rfqs(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_rfq_items__rfq_id ON crm.rfq_items IS '견적 요청서 헤더 참조 외래키 (헤더 삭제 시 품목도 함께 삭제)';

-- 제품 참조 (SET NULL 삭제)
-- ALTER TABLE crm.rfq_items 
--   ADD CONSTRAINT fk_rfq_items__product_id
--     FOREIGN KEY (product_id) 
--     REFERENCES pim.products(id) 
--     ON DELETE SET NULL;
-- COMMENT ON CONSTRAINT fk_rfq_items__product_id ON crm.rfq_items IS '제품 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.rfq_items 테이블 정의
-- =====================================================================================
