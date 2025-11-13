-- =====================================================================================
-- 테이블: fim.tax_invoice_lines
-- 설명: 세금계산서 상세 - 품목별 공급가액 및 세액
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.tax_invoice_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 세금계산서 상세 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 세금계산서 참조
    tax_invoice_id          UUID                     NOT NULL,                               -- 세금계산서 ID
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호
    
    -- 품목 정보
    product_code            VARCHAR(50),                                                     -- 품목 코드
    product_name            VARCHAR(200)             NOT NULL,                               -- 품목명
    product_spec            VARCHAR(200),                                                    -- 규격
    unit                    VARCHAR(20),                                                     -- 단위
    
    -- 수량 및 단가
    quantity                NUMERIC(18,4)            NOT NULL DEFAULT 0,                     -- 수량
    unit_price              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 단가
    
    -- 금액
    supply_amount           NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 공급가액
    tax_amount              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 세액
    total_amount            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 합계금액
    
    -- 비고
    remark                  TEXT,                                                            -- 비고
    
    -- 삭제 관리
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부
    
    -- 금액 계산 체크 (공급가액 = 수량 × 단가, 합계금액 = 공급가액 + 세액)
    CONSTRAINT ck_tax_invoice_lines__amounts 
        CHECK (supply_amount = quantity * unit_price AND total_amount = supply_amount + tax_amount),
    
    -- 세금계산서 참조 외래키 (CASCADE 삭제)
    CONSTRAINT fk_tax_invoice_lines__tax_invoice_id
        FOREIGN KEY (tax_invoice_id) REFERENCES fim.tax_invoices(id) ON DELETE CASCADE
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fim.tax_invoice_lines IS '세금계산서 상세: 품목별 공급가액 및 세액';
COMMENT ON COLUMN fim.tax_invoice_lines.id IS '세금계산서 상세 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.tax_invoice_lines.created_at IS '등록 일시';
COMMENT ON COLUMN fim.tax_invoice_lines.created_by IS '등록자 UUID';
COMMENT ON COLUMN fim.tax_invoice_lines.updated_at IS '수정 일시';
COMMENT ON COLUMN fim.tax_invoice_lines.updated_by IS '수정자 UUID';
COMMENT ON COLUMN fim.tax_invoice_lines.tax_invoice_id IS '세금계산서 ID';
COMMENT ON COLUMN fim.tax_invoice_lines.line_no IS '라인 번호';
COMMENT ON COLUMN fim.tax_invoice_lines.product_code IS '품목 코드';
COMMENT ON COLUMN fim.tax_invoice_lines.product_name IS '품목명';
COMMENT ON COLUMN fim.tax_invoice_lines.product_spec IS '규격';
COMMENT ON COLUMN fim.tax_invoice_lines.unit IS '단위';
COMMENT ON COLUMN fim.tax_invoice_lines.quantity IS '수량';
COMMENT ON COLUMN fim.tax_invoice_lines.unit_price IS '단가';
COMMENT ON COLUMN fim.tax_invoice_lines.supply_amount IS '공급가액';
COMMENT ON COLUMN fim.tax_invoice_lines.tax_amount IS '세액';
COMMENT ON COLUMN fim.tax_invoice_lines.total_amount IS '합계금액';
COMMENT ON COLUMN fim.tax_invoice_lines.remark IS '비고';
COMMENT ON COLUMN fim.tax_invoice_lines.is_deleted IS '삭제 여부';

COMMENT ON CONSTRAINT fk_tax_invoice_lines__tax_invoice_id ON fim.tax_invoice_lines IS '세금계산서 참조 외래키 (CASCADE 삭제)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_tax_invoice_lines__invoice_line 
    ON fim.tax_invoice_lines (tax_invoice_id, line_no)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ux_tax_invoice_lines__invoice_line IS '세금계산서별 라인 번호 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_tax_invoice_lines__tax_invoice_id 
    ON fim.tax_invoice_lines (tax_invoice_id, line_no)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_tax_invoice_lines__tax_invoice_id IS '세금계산서별 상세 조회 인덱스';
