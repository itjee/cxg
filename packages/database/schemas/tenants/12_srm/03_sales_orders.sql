-- =====================================================================================
-- 테이블: srm.sales_orders
-- 설명: 판매주문 헤더 관리 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-24 - 표준 형식 적용
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.sales_orders 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 판매주문 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    so_code                 VARCHAR(50)              NOT NULL,                               -- 판매주문 코드
    customer_id             UUID                     NOT NULL,                               -- 고객 식별자
    order_date              DATE                     NOT NULL,                               -- 전표 일자
    delivery_date           DATE,                                                            -- 납품 희망일
    warehouse_id            UUID,                                                            -- 출고 창고 식별자
    sales_person_id         UUID,                                                            -- 영업 담당자 식별자
    
    -- 결제 조건
    payment_terms           VARCHAR(20),                                                     -- 결제 조건
    
    -- 금액 정보
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 상태 체크 (DRAFT: 임시저장, CONFIRMED: 확정, PROCESSING: 처리중, SHIPPED: 출하완료, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_sales_orders__status              CHECK (status IN ('DRAFT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
    
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_sales_orders__total_amount        CHECK (total_amount >= 0),
    
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_sales_orders__currency            CHECK (currency ~ '^[A-Z]{3}$')
);

COMMENT ON TABLE  srm.sales_orders                       IS '판매주문 헤더 관리 테이블';
COMMENT ON COLUMN srm.sales_orders.id                    IS '판매주문 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.sales_orders.created_at            IS '등록 일시';
COMMENT ON COLUMN srm.sales_orders.created_by            IS '등록자 UUID';
COMMENT ON COLUMN srm.sales_orders.updated_at            IS '수정 일시';
COMMENT ON COLUMN srm.sales_orders.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN srm.sales_orders.so_code               IS '판매주문 코드 (SO 번호)';
COMMENT ON COLUMN srm.sales_orders.customer_id           IS '고객 식별자';
COMMENT ON COLUMN srm.sales_orders.order_date              IS '전표 일자';
COMMENT ON COLUMN srm.sales_orders.delivery_date         IS '납품 희망일';
COMMENT ON COLUMN srm.sales_orders.warehouse_id          IS '출고 창고 식별자';
COMMENT ON COLUMN srm.sales_orders.sales_person_id       IS '영업 담당자 식별자';
COMMENT ON COLUMN srm.sales_orders.payment_terms         IS '결제 조건 (COD/NET30/NET60 등)';
COMMENT ON COLUMN srm.sales_orders.total_amount          IS '총 금액';
COMMENT ON COLUMN srm.sales_orders.currency              IS '통화 (ISO 4217)';
COMMENT ON COLUMN srm.sales_orders.status                IS '상태 (DRAFT/CONFIRMED/PROCESSING/SHIPPED/COMPLETED/CANCELLED)';
COMMENT ON COLUMN srm.sales_orders.is_deleted            IS '논리 삭제 플래그';

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  srm.sales_orders                       IS '판매주문 헤더 관리 테이블';
COMMENT ON COLUMN srm.sales_orders.id                    IS '판매주문 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.sales_orders.created_at            IS '등록 일시';
COMMENT ON COLUMN srm.sales_orders.created_by            IS '등록자 UUID';
COMMENT ON COLUMN srm.sales_orders.updated_at            IS '수정 일시';
COMMENT ON COLUMN srm.sales_orders.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN srm.sales_orders.so_code               IS '판매주문 코드 (SO 번호)';
COMMENT ON COLUMN srm.sales_orders.customer_id           IS '고객 식별자';
COMMENT ON COLUMN srm.sales_orders.order_date            IS '주문 일자';
COMMENT ON COLUMN srm.sales_orders.delivery_date         IS '납품 희망일';
COMMENT ON COLUMN srm.sales_orders.warehouse_id          IS '출고 창고 식별자';
COMMENT ON COLUMN srm.sales_orders.sales_person_id       IS '영업 담당자 식별자';
COMMENT ON COLUMN srm.sales_orders.payment_terms         IS '결제 조건 (COD/NET30/NET60 등)';
COMMENT ON COLUMN srm.sales_orders.total_amount          IS '총 금액';
COMMENT ON COLUMN srm.sales_orders.currency              IS '통화 (ISO 4217)';
COMMENT ON COLUMN srm.sales_orders.status                IS '상태 (DRAFT/CONFIRMED/PROCESSING/SHIPPED/COMPLETED/CANCELLED)';
COMMENT ON COLUMN srm.sales_orders.is_deleted            IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_sales_orders__so_code 
    ON srm.sales_orders (so_code)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ux_sales_orders__so_code IS '판매주문 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_sales_orders__so_code 
    ON srm.sales_orders (so_code)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_orders__so_code IS '판매주문 코드별 조회 인덱스';

CREATE INDEX ix_sales_orders__customer_id 
    ON srm.sales_orders (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_orders__customer_id IS '고객별 판매주문 조회 인덱스';

CREATE INDEX ix_sales_orders__warehouse_id 
    ON srm.sales_orders (warehouse_id)
 WHERE warehouse_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_orders__warehouse_id IS '창고별 판매주문 조회 인덱스';

CREATE INDEX ix_sales_orders__sales_person_id 
    ON srm.sales_orders (sales_person_id)
 WHERE sales_person_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_orders__sales_person_id IS '영업 담당자별 판매주문 조회 인덱스';

CREATE INDEX ix_sales_orders__status 
    ON srm.sales_orders (status)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_orders__status IS '상태별 판매주문 조회 인덱스';

CREATE INDEX ix_sales_orders__order_date 
    ON srm.sales_orders (order_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_orders__order_date IS '전표 일자별 조회 인덱스';

CREATE INDEX ix_sales_orders__delivery_date 
    ON srm.sales_orders (delivery_date)
 WHERE delivery_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_orders__delivery_date IS '납품 희망일별 조회 인덱스';

-- 외래키 제약조건
-- 고객 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_orders 
  ADD CONSTRAINT fk_sales_orders__customer_id
    FOREIGN KEY (customer_id) 
    REFERENCES crm.partners(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_orders__customer_id ON srm.sales_orders IS '고객 참조 외래키 (RESTRICT 삭제)';

-- 창고 참조 (SET NULL 삭제)
ALTER TABLE srm.sales_orders 
  ADD CONSTRAINT fk_sales_orders__warehouse_id
    FOREIGN KEY (warehouse_id) 
    REFERENCES wms.warehouses(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_sales_orders__warehouse_id ON srm.sales_orders IS '창고 참조 외래키 (SET NULL 삭제)';

-- 영업 담당자 참조 (SET NULL 삭제)
ALTER TABLE srm.sales_orders 
  ADD CONSTRAINT fk_sales_orders__sales_person_id
    FOREIGN KEY (sales_person_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_sales_orders__sales_person_id ON srm.sales_orders IS '영업 담당자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: srm.sales_orders 테이블 정의
-- =====================================================================================