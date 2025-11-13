-- =====================================================================================
-- 테이블: srm.sales_deliveries
-- 설명: 판매 출고/배송 헤더 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.sales_deliveries 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 출고 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    delivery_code           VARCHAR(50)              NOT NULL,                               -- 출고 코드
    so_id                   UUID                     NOT NULL,                               -- 판매주문 식별자
    customer_id             UUID                     NOT NULL,                               -- 고객 식별자
    request_date            DATE                     NOT NULL,                               -- 요청 일자
    delivery_date           DATE,                                                            -- 실제 배송일
    warehouse_id            UUID                     NOT NULL,                               -- 출고 창고 식별자
    
    -- 배송 정보
    tracking_no             VARCHAR(100),                                                    -- 송장 번호
    carrier                 VARCHAR(100),                                                    -- 배송업체
    shipping_address        TEXT,                                                            -- 배송 주소
    shipping_contact        VARCHAR(100),                                                    -- 배송 연락처
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 체크 (DRAFT: 임시저장, CONFIRMED: 확정, PACKED: 포장완료, SHIPPED: 출고완료, DELIVERED: 배송완료, CANCELLED: 취소)
    CONSTRAINT ck_sales_deliveries__status          CHECK (status IN ('DRAFT', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  srm.sales_deliveries                       IS '판매 출고/배송 헤더 관리 테이블';
COMMENT ON COLUMN srm.sales_deliveries.id                    IS '출고 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.sales_deliveries.created_at            IS '등록 일시';
COMMENT ON COLUMN srm.sales_deliveries.created_by            IS '등록자 UUID';
COMMENT ON COLUMN srm.sales_deliveries.updated_at            IS '수정 일시';
COMMENT ON COLUMN srm.sales_deliveries.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN srm.sales_deliveries.delivery_code         IS '출고 코드 (출고번호)';
COMMENT ON COLUMN srm.sales_deliveries.so_id                 IS '판매주문 식별자';
COMMENT ON COLUMN srm.sales_deliveries.customer_id           IS '고객 식별자';
COMMENT ON COLUMN srm.sales_deliveries.request_date          IS '요청 일자';
COMMENT ON COLUMN srm.sales_deliveries.delivery_date         IS '실제 배송일';
COMMENT ON COLUMN srm.sales_deliveries.warehouse_id          IS '출고 창고 식별자';
COMMENT ON COLUMN srm.sales_deliveries.tracking_no           IS '송장 번호';
COMMENT ON COLUMN srm.sales_deliveries.carrier               IS '배송업체';
COMMENT ON COLUMN srm.sales_deliveries.shipping_address      IS '배송 주소';
COMMENT ON COLUMN srm.sales_deliveries.shipping_contact      IS '배송 연락처';
COMMENT ON COLUMN srm.sales_deliveries.status                IS '상태 (DRAFT/CONFIRMED/PACKED/SHIPPED/DELIVERED/CANCELLED)';
COMMENT ON COLUMN srm.sales_deliveries.is_deleted            IS '논리 삭제 플래그';
COMMENT ON COLUMN srm.sales_deliveries.notes                 IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_sales_deliveries__delivery_code 
    ON srm.sales_deliveries (delivery_code)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ux_sales_deliveries__delivery_code IS '출고 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_sales_deliveries__delivery_code 
    ON srm.sales_deliveries (delivery_code)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_deliveries__delivery_code IS '출고 코드별 조회 인덱스';

CREATE INDEX ix_sales_deliveries__so_id 
    ON srm.sales_deliveries (so_id)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_deliveries__so_id IS '판매주문별 출고 조회 인덱스';

CREATE INDEX ix_sales_deliveries__customer_id 
    ON srm.sales_deliveries (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_deliveries__customer_id IS '고객별 출고 조회 인덱스';

CREATE INDEX ix_sales_deliveries__warehouse_id 
    ON srm.sales_deliveries (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_deliveries__warehouse_id IS '창고별 출고 조회 인덱스';

CREATE INDEX ix_sales_deliveries__status 
    ON srm.sales_deliveries (status)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_deliveries__status IS '상태별 출고 조회 인덱스';

CREATE INDEX ix_sales_deliveries__request_date 
    ON srm.sales_deliveries (request_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_sales_deliveries__request_date IS '전표 일자별 조회 인덱스';

CREATE INDEX ix_sales_deliveries__delivery_date 
    ON srm.sales_deliveries (delivery_date DESC)
 WHERE delivery_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_deliveries__delivery_date IS '배송일별 조회 인덱스';

CREATE INDEX ix_sales_deliveries__tracking_no 
    ON srm.sales_deliveries (tracking_no)
 WHERE tracking_no IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_sales_deliveries__tracking_no IS '송장번호별 조회 인덱스';

-- 외래키 제약조건
-- 판매주문 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_deliveries 
  ADD CONSTRAINT fk_sales_deliveries__so_id
    FOREIGN KEY (so_id) 
    REFERENCES srm.sales_orders(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_deliveries__so_id ON srm.sales_deliveries IS '판매주문 참조 외래키 (RESTRICT 삭제)';

-- 고객 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_deliveries 
  ADD CONSTRAINT fk_sales_deliveries__customer_id
    FOREIGN KEY (customer_id) 
    REFERENCES crm.partners(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_deliveries__customer_id ON srm.sales_deliveries IS '고객 참조 외래키 (RESTRICT 삭제)';

-- 창고 참조 (RESTRICT 삭제)
ALTER TABLE srm.sales_deliveries 
  ADD CONSTRAINT fk_sales_deliveries__warehouse_id
    FOREIGN KEY (warehouse_id) 
    REFERENCES wms.warehouses(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_sales_deliveries__warehouse_id ON srm.sales_deliveries IS '창고 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 완료: srm.sales_deliveries 테이블 정의
-- =====================================================================================
