-- =====================================================================================
-- 테이블: ivm.inventory_serials
-- 설명: 시리얼 번호 마스터 관리 테이블 (개별 제품 추적)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_serials 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 시리얼 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 시리얼 기본 정보
    serial_no               VARCHAR(100)             NOT NULL,                               -- 시리얼 번호
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    lot_no                  VARCHAR(100),                                                    -- 로트 번호
    
    -- 제조 정보
    manufactured_date       DATE,                                                            -- 제조 일자
    manufacturer_id         UUID,                                                            -- 제조사 식별자
    
    -- 현재 위치 정보
    warehouse_id            UUID,                                                            -- 현재 창고 식별자
    location_id             UUID,                                                            -- 현재 로케이션 식별자
    
    -- 소유 정보
    owner_type              VARCHAR(20),                                                     -- 소유 타입
    owner_id                UUID,                                                            -- 소유자 식별자
    ownership_date          DATE,                                                            -- 소유권 이전 일자
    
    -- 워런티 정보
    warranty_start_date     DATE,                                                            -- 워런티 시작일
    warranty_end_date       DATE,                                                            -- 워런티 종료일
    warranty_months         INTEGER,                                                         -- 워런티 기간 (개월)
    
    -- 상태 정보
    status                  VARCHAR(20)              DEFAULT 'AVAILABLE',                    -- 상태
    condition_grade         VARCHAR(20),                                                     -- 상태 등급
    
    -- 판매/배송 정보
    sold_date               DATE,                                                            -- 판매 일자
    shipped_date            DATE,                                                            -- 배송 일자
    delivered_date          DATE,                                                            -- 배송 완료 일자
    
    -- 반품/수리 정보
    return_date             DATE,                                                            -- 반품 일자
    return_reason           TEXT,                                                            -- 반품 사유
    last_service_date       DATE,                                                            -- 최종 A/S 일자
    service_count           INTEGER                  DEFAULT 0,                              -- A/S 횟수
    
    -- 폐기 정보
    scrapped_date           DATE,                                                            -- 폐기 일자
    scrapped_reason         TEXT,                                                            -- 폐기 사유
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 외래키 제약조건
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_inventory_serials__product_id          FOREIGN KEY (product_id) 
                                                                REFERENCES pim.products(id) 
                                                                ON DELETE RESTRICT,
    
    -- 현재 창고 참조 외래키 (창고 삭제 시 NULL)
    CONSTRAINT fk_inventory_serials__current_warehouse   FOREIGN KEY (warehouse_id) 
                                                                REFERENCES wms.warehouses(id) 
                                                                ON DELETE SET NULL,
    
    -- 현재 로케이션 참조 외래키 (로케이션 삭제 시 NULL)
    CONSTRAINT fk_inventory_serials__current_location    FOREIGN KEY (location_id) 
                                                                REFERENCES wms.warehouse_locations(id) 
                                                                ON DELETE SET NULL,
    
    -- CHECK 제약조건
    -- 상태 체크 (AVAILABLE: 가용, RESERVED: 예약, SHIPPED: 출하, SOLD: 판매, RETURNED: 반품, IN_SERVICE: 수리중, SCRAPPED: 폐기)
    CONSTRAINT ck_inventory_serials__status              CHECK (status IN ('AVAILABLE', 'RESERVED', 'SHIPPED', 'SOLD', 'RETURNED', 'IN_SERVICE', 'SCRAPPED')),
    
    -- 소유 타입 체크 (COMPANY: 회사, CUSTOMER: 고객, SUPPLIER: 공급사)
    CONSTRAINT ck_inventory_serials__owner_type          CHECK (owner_type IS NULL OR 
                                                                       owner_type IN ('COMPANY', 'CUSTOMER', 'SUPPLIER')),
    
    -- 상태 등급 체크 (NEW: 신품, GOOD: 양호, FAIR: 보통, POOR: 불량, REFURBISHED: 리퍼)
    CONSTRAINT ck_inventory_serials__condition_grade     CHECK (condition_grade IS NULL OR 
                                                                       condition_grade IN ('NEW', 'GOOD', 'FAIR', 'POOR', 'REFURBISHED')),
    
    -- A/S 횟수 음수 불가
    CONSTRAINT ck_inventory_serials__service_count       CHECK (service_count >= 0),
    
    -- 워런티 논리 체크 (warranty_start_date < warranty_end_date)
    CONSTRAINT ck_inventory_serials__warranty_dates      CHECK (warranty_start_date IS NULL OR 
                                                                       warranty_end_date IS NULL OR 
                                                                       warranty_start_date < warranty_end_date)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  ivm.inventory_serials                       IS '시리얼 번호 마스터 관리 테이블';
COMMENT ON COLUMN ivm.inventory_serials.id                    IS '시리얼 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_serials.created_at            IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_serials.created_by            IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_serials.updated_at            IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_serials.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_serials.serial_no         IS '시리얼 번호';
COMMENT ON COLUMN ivm.inventory_serials.product_id            IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_serials.lot_no            IS '로트 번호';
COMMENT ON COLUMN ivm.inventory_serials.manufactured_date     IS '제조 일자';
COMMENT ON COLUMN ivm.inventory_serials.manufacturer_id       IS '제조사 식별자';
COMMENT ON COLUMN ivm.inventory_serials.warehouse_id  IS '현재 창고 식별자';
COMMENT ON COLUMN ivm.inventory_serials.location_id   IS '현재 로케이션 식별자';
COMMENT ON COLUMN ivm.inventory_serials.owner_type            IS '소유 타입 (COMPANY/CUSTOMER/SUPPLIER)';
COMMENT ON COLUMN ivm.inventory_serials.owner_id              IS '소유자 식별자';
COMMENT ON COLUMN ivm.inventory_serials.ownership_date        IS '소유권 이전 일자';
COMMENT ON COLUMN ivm.inventory_serials.warranty_start_date   IS '워런티 시작일';
COMMENT ON COLUMN ivm.inventory_serials.warranty_end_date     IS '워런티 종료일';
COMMENT ON COLUMN ivm.inventory_serials.warranty_months       IS '워런티 기간 (개월)';
COMMENT ON COLUMN ivm.inventory_serials.status                IS '상태 (AVAILABLE/RESERVED/SHIPPED/SOLD/RETURNED/IN_SERVICE/SCRAPPED)';
COMMENT ON COLUMN ivm.inventory_serials.condition_grade       IS '상태 등급 (NEW/GOOD/FAIR/POOR/REFURBISHED)';
COMMENT ON COLUMN ivm.inventory_serials.sold_date             IS '판매 일자';
COMMENT ON COLUMN ivm.inventory_serials.shipped_date          IS '배송 일자';
COMMENT ON COLUMN ivm.inventory_serials.delivered_date        IS '배송 완료 일자';
COMMENT ON COLUMN ivm.inventory_serials.return_date           IS '반품 일자';
COMMENT ON COLUMN ivm.inventory_serials.return_reason         IS '반품 사유';
COMMENT ON COLUMN ivm.inventory_serials.last_service_date     IS '최종 A/S 일자';
COMMENT ON COLUMN ivm.inventory_serials.service_count         IS 'A/S 횟수';
COMMENT ON COLUMN ivm.inventory_serials.scrapped_date         IS '폐기 일자';
COMMENT ON COLUMN ivm.inventory_serials.scrapped_reason       IS '폐기 사유';
COMMENT ON COLUMN ivm.inventory_serials.notes                 IS '비고';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_inventory_serials__serial_no
    ON ivm.inventory_serials (serial_no);
COMMENT ON INDEX ivm.ix_inventory_serials__serial_no IS '시리얼 번호별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_serials__product_id
    ON ivm.inventory_serials (product_id, status);
COMMENT ON INDEX ivm.ix_inventory_serials__product_id IS '제품별 시리얼 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_serials__current_warehouse
    ON ivm.inventory_serials (warehouse_id)
 WHERE warehouse_id IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_serials__current_warehouse IS '현재 창고별 시리얼 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_serials__status
    ON ivm.inventory_serials (status, product_id);
COMMENT ON INDEX ivm.ix_inventory_serials__status IS '상태 및 제품별 시리얼 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_serials__lot_no
    ON ivm.inventory_serials (lot_no)
 WHERE lot_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_serials__lot_no IS '로트 번호별 시리얼 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_serials__owner
    ON ivm.inventory_serials (owner_type, owner_id)
 WHERE owner_id IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_serials__owner IS '소유자별 시리얼 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_serials__warranty_end
    ON ivm.inventory_serials (warranty_end_date)
 WHERE warranty_end_date IS NOT NULL 
   AND status IN ('SOLD', 'SHIPPED');
COMMENT ON INDEX ivm.ix_inventory_serials__warranty_end IS '워런티 종료일별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_serials__sold_date
    ON ivm.inventory_serials (sold_date DESC)
 WHERE sold_date IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_serials__sold_date IS '판매일별 시리얼 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_serials__serial 
    ON ivm.inventory_serials (serial_no);
COMMENT ON INDEX ivm.ux_inventory_serials__serial IS '시리얼 번호 유니크 제약';
