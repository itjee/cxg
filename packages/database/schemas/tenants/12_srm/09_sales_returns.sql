-- =====================================================================================
-- 테이블: srm.sales_returns
-- 설명: 판매 반품 헤더 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.sales_returns 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 반품 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    return_code             VARCHAR(50)              NOT NULL,                               -- 반품 코드
    return_type             VARCHAR(20)              NOT NULL DEFAULT 'RETURN',              -- 반품 유형
    so_id                   UUID,                                                            -- 판매주문 식별자
    delivery_id             UUID,                                                            -- 출고 식별자
    invoice_id              UUID,                                                            -- 송장 식별자
    customer_id             UUID                     NOT NULL,                               -- 고객 식별자
    request_date            DATE                     NOT NULL,                               -- 전표 일자
    return_date             DATE,                                                            -- 실제 반품일
    warehouse_id            UUID                     NOT NULL,                               -- 입고 창고 식별자
    
    -- 반품 사유
    reason_code             VARCHAR(20),                                                     -- 반품 사유 코드
    reason_desc             TEXT,                                                            -- 반품 사유 설명
    
    -- 금액 정보
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 반품 유형 체크 (RETURN: 일반 반품, EXCHANGE: 교환, DEFECT: 불량 반품)
    CONSTRAINT ck_sales_returns__return_type        CHECK (return_type IN ('RETURN', 'EXCHANGE', 'DEFECT')),
    
    -- 상태 체크 (DRAFT: 임시저장, CONFIRMED: 확정, RECEIVED: 입고완료, REFUNDED: 환불완료, CANCELLED: 취소)
    CONSTRAINT ck_sales_returns__status             CHECK (status IN ('DRAFT', 'CONFIRMED', 'RECEIVED', 'REFUNDED', 'CANCELLED')),
    
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_returns__total_amount       CHECK (total_amount >= 0),
    
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_sales_returns__currency           CHECK (currency ~ '^[A-Z]{3}$')
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  srm.sales_returns                          IS '판매 반품 헤더 관리 테이블';
COMMENT ON COLUMN srm.sales_returns.id                       IS '반품 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.sales_returns.created_at               IS '등록 일시';
COMMENT ON COLUMN srm.sales_returns.created_by               IS '등록자 UUID';
COMMENT ON COLUMN srm.sales_returns.updated_at               IS '수정 일시';
COMMENT ON COLUMN srm.sales_returns.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN srm.sales_returns.return_code              IS '반품 코드 (반품번호)';
COMMENT ON COLUMN srm.sales_returns.return_type              IS '반품 유형 (RETURN/EXCHANGE/DEFECT)';
COMMENT ON COLUMN srm.sales_returns.so_id                    IS '판매주문 식별자';
COMMENT ON COLUMN srm.sales_returns.delivery_id              IS '출고 식별자';
COMMENT ON COLUMN srm.sales_returns.invoice_id               IS '송장 식별자';
COMMENT ON COLUMN srm.sales_returns.customer_id              IS '고객 식별자';
COMMENT ON COLUMN srm.sales_returns.request_date                 IS '전표 일자';
COMMENT ON COLUMN srm.sales_returns.return_date              IS '실제 반품일';
COMMENT ON COLUMN srm.sales_returns.warehouse_id             IS '입고 창고 식별자';
COMMENT ON COLUMN srm.sales_returns.reason_code              IS '반품 사유 코드';
COMMENT ON COLUMN srm.sales_returns.reason_desc              IS '반품 사유 설명';
COMMENT ON COLUMN srm.sales_returns.total_amount             IS '총 금액';
COMMENT ON COLUMN srm.sales_returns.currency                 IS '통화 (ISO 4217)';
COMMENT ON COLUMN srm.sales_returns.status                   IS '상태 (DRAFT/CONFIRMED/RECEIVED/REFUNDED/CANCELLED)';
COMMENT ON COLUMN srm.sales_returns.is_deleted               IS '논리 삭제 플래그';
COMMENT ON COLUMN srm.sales_returns.notes                    IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_sales_returns__return_code 
    ON srm.sales_returns (return_code)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ux_sales_returns__return_code IS '반품 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_sales_returns__return_code 
    ON srm.sales_returns (return_code)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__return_code IS '반품 코드별 조회 인덱스';

CREATE INDEX ix_sales_returns__so_id 
    ON srm.sales_returns (so_id)
 WHERE so_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__so_id IS '판매주문별 반품 조회 인덱스';

CREATE INDEX ix_sales_returns__delivery_id 
    ON srm.sales_returns (delivery_id)
 WHERE delivery_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__delivery_id IS '출고별 반품 조회 인덱스';

CREATE INDEX ix_sales_returns__invoice_id 
    ON srm.sales_returns (invoice_id)
 WHERE invoice_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__invoice_id IS '송장별 반품 조회 인덱스';

CREATE INDEX ix_sales_returns__customer_id 
    ON srm.sales_returns (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__customer_id IS '고객별 반품 조회 인덱스';

CREATE INDEX ix_sales_returns__warehouse_id 
    ON srm.sales_returns (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__warehouse_id IS '창고별 반품 조회 인덱스';

CREATE INDEX ix_sales_returns__return_type 
    ON srm.sales_returns (return_type)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__return_type IS '반품 유형별 조회 인덱스';

CREATE INDEX ix_sales_returns__status 
    ON srm.sales_returns (status)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__status IS '상태별 반품 조회 인덱스';

CREATE INDEX ix_sales_returns__request_date 
    ON srm.sales_returns (request_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__request_date IS '전표 일자별 조회 인덱스';

CREATE INDEX ix_sales_returns__return_date 
    ON srm.sales_returns (return_date DESC)
 WHERE return_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__return_date IS '반품일별 조회 인덱스';

CREATE INDEX ix_sales_returns__reason_code 
    ON srm.sales_returns (reason_code)
 WHERE reason_code IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_returns__reason_code IS '반품 사유별 조회 인덱스';

-- 외래키 제약조건
-- 판매주문 참조 (SET NULL 삭제)
ALTER TABLE srm.sales_returns 
  ADD CONSTRAINT fk_sales_returns__so_id
    FOREIGN KEY (so_id) 
    REFERENCES srm.sales_orders(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_sales_returns__so_id ON srm.sales_returns IS '판매주문 참조 외래키 (SET NULL 삭제)';

-- 출고 참조 (SET NULL 삭제)
ALTER TABLE srm.sales_returns 
  ADD CONSTRAINT fk_sales_returns__delivery_id
    FOREIGN KEY (delivery_id) 
    REFERENCES srm.sales_deliveries(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_sales_returns__delivery_id ON srm.sales_returns IS '출고 참조 외래키 (SET NULL 삭제)';

-- 송장 참조 (SET NULL 삭제)
-- ALTER TABLE srm.sales_returns 
--   ADD CONSTRAINT fk_sales_returns__invoice_id
--     FOREIGN KEY (invoice_id) 
--     REFERENCES srm.sales_invoices(id) 
--     ON DELETE SET NULL;
-- COMMENT ON CONSTRAINT fk_sales_returns__invoice_id ON srm.sales_returns IS '송장 참조 외래키 (SET NULL 삭제)';

-- 고객 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_returns 
  ADD CONSTRAINT fk_sales_returns__customer_id
    FOREIGN KEY (customer_id) 
    REFERENCES crm.partners(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_returns__customer_id ON srm.sales_returns IS '고객 참조 외래키 (RESTRICT 삭제)';

-- 창고 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_returns 
  ADD CONSTRAINT fk_sales_returns__warehouse_id
    FOREIGN KEY (warehouse_id) 
    REFERENCES wms.warehouses(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_returns__warehouse_id ON srm.sales_returns IS '창고 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 완료: srm.sales_returns 테이블 정의
-- =====================================================================================
