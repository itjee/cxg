-- =====================================================================================
-- 테이블: psm.purchase_price_agreements
-- 설명: 구매 가격 계약 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS psm.purchase_price_agreements 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 가격 계약 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 계약 기본 정보
    agreement_no            VARCHAR(50)              NOT NULL,                               -- 계약 번호
    agreement_date          DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 계약 일자
    supplier_id             UUID                     NOT NULL,                               -- 공급업체 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    
    -- 가격 정보
    unit_price              NUMERIC(18,4)            NOT NULL,                               -- 계약 단가
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    min_order_qty           INTEGER,                                                         -- 최소 주문 수량
    
    -- 계약 기간
    valid_from              DATE                     NOT NULL,                               -- 유효 시작일
    valid_to                DATE                     NOT NULL,                               -- 유효 종료일
    
    -- 계약 상태
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 계약 상태
    
    -- 결제 조건
    payment_terms           TEXT,                                                            -- 결제 조건
    delivery_terms          TEXT,                                                            -- 배송 조건
    notes                   TEXT,                                                            -- 비고
    
    -- 외래키 제약조건
    -- 공급업체 참조 외래키 (삭제 불가)
    CONSTRAINT fk_purchase_price_agreements__supplier_id    FOREIGN KEY (supplier_id) 
                                                            REFERENCES crm.partners(id) 
                                                            ON DELETE RESTRICT,
    
    -- 제품 참조 외래키 (삭제 불가)
    CONSTRAINT fk_purchase_price_agreements__product_id     FOREIGN KEY (product_id) 
                                                            REFERENCES pim.products(id) 
                                                            ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 계약 상태 체크
    CONSTRAINT ck_purchase_price_agreements__status         CHECK (status IN ('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED')),
    
    -- 계약 단가 양수 체크
    CONSTRAINT ck_purchase_price_agreements__unit_price     CHECK (unit_price > 0),
    
    -- 통화 코드 체크
    CONSTRAINT ck_purchase_price_agreements__currency       CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 최소 주문 수량 양수 체크
    CONSTRAINT ck_purchase_price_agreements__min_order_qty  CHECK (min_order_qty IS NULL OR min_order_qty > 0),
    
    -- 유효 기간 체크
    CONSTRAINT ck_purchase_price_agreements__valid_dates    CHECK (valid_to >= valid_from)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  psm.purchase_price_agreements                     IS '구매 가격 계약 관리 테이블';
COMMENT ON COLUMN psm.purchase_price_agreements.id                  IS '가격 계약 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_price_agreements.created_at          IS '등록 일시';
COMMENT ON COLUMN psm.purchase_price_agreements.created_by          IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_price_agreements.updated_at          IS '수정 일시';
COMMENT ON COLUMN psm.purchase_price_agreements.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_price_agreements.agreement_no        IS '계약 번호';
COMMENT ON COLUMN psm.purchase_price_agreements.agreement_date      IS '계약 일자';
COMMENT ON COLUMN psm.purchase_price_agreements.supplier_id         IS '공급업체 식별자';
COMMENT ON COLUMN psm.purchase_price_agreements.product_id          IS '제품 식별자';
COMMENT ON COLUMN psm.purchase_price_agreements.unit_price          IS '계약 단가';
COMMENT ON COLUMN psm.purchase_price_agreements.currency            IS '통화 코드 (KRW, USD 등)';
COMMENT ON COLUMN psm.purchase_price_agreements.min_order_qty       IS '최소 주문 수량';
COMMENT ON COLUMN psm.purchase_price_agreements.valid_from          IS '계약 유효 시작일';
COMMENT ON COLUMN psm.purchase_price_agreements.valid_to            IS '계약 유효 종료일';
COMMENT ON COLUMN psm.purchase_price_agreements.status              IS '계약 상태 (DRAFT/ACTIVE/EXPIRED/TERMINATED)';
COMMENT ON COLUMN psm.purchase_price_agreements.payment_terms       IS '결제 조건';
COMMENT ON COLUMN psm.purchase_price_agreements.delivery_terms      IS '배송 조건';
COMMENT ON COLUMN psm.purchase_price_agreements.notes               IS '비고';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_price_agreements__agreement_no
    ON psm.purchase_price_agreements (agreement_no);
COMMENT ON INDEX psm.ux_purchase_price_agreements__agreement_no IS '계약 번호 유니크 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_price_agreements__supplier_product
    ON psm.purchase_price_agreements (supplier_id, product_id, valid_from DESC);
COMMENT ON INDEX psm.ix_purchase_price_agreements__supplier_product IS '공급업체-제품별 계약 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_price_agreements__product_id
    ON psm.purchase_price_agreements (product_id, valid_from DESC);
COMMENT ON INDEX psm.ix_purchase_price_agreements__product_id IS '제품별 계약 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_price_agreements__status
    ON psm.purchase_price_agreements (status, valid_from DESC);
COMMENT ON INDEX psm.ix_purchase_price_agreements__status IS '상태별 계약 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_price_agreements__valid_dates
    ON psm.purchase_price_agreements (valid_from, valid_to)
 WHERE status = 'ACTIVE';
COMMENT ON INDEX psm.ix_purchase_price_agreements__valid_dates IS '활성 계약 유효기간 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_price_agreements__supplier_product_dates
    ON psm.purchase_price_agreements (supplier_id, product_id, valid_from, valid_to)
 WHERE status IN ('DRAFT', 'ACTIVE');
COMMENT ON INDEX psm.ux_purchase_price_agreements__supplier_product_dates IS '공급업체-제품-기간별 중복 방지 (활성 계약만)';
