-- =====================================================================================
-- 테이블: wms.inventory
-- 설명: 재고 현황 관리 테이블 (실시간 재고)
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS wms.inventory 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 재고 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 재고 기본 정보
    warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자
    location_id             UUID,                                                            -- 로케이션 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                    -- 로트 번호
    serial_number           VARCHAR(100),                                                    -- 시리얼 번호
    
    -- 수량 정보
    quantity_on_hand        NUMERIC(18,2)            DEFAULT 0,                              -- 재고 수량
    quantity_allocated      NUMERIC(18,2)            DEFAULT 0,                              -- 할당 수량 (예약)
    quantity_available      NUMERIC(18,2)            GENERATED ALWAYS AS (quantity_on_hand - quantity_allocated) STORED, -- 가용 수량
    
    -- 품질 정보
    quality_status          VARCHAR(20)              DEFAULT 'GOOD',                         -- 품질 상태
    
    -- 날짜 정보
    manufactured_date       DATE,                                                            -- 제조 일자
    expiry_date             DATE,                                                            -- 유효 기한
    received_date           DATE,                                                            -- 입고 일자
    
    -- 원가 정보
    unit_cost               NUMERIC(18,4),                                                   -- 단가
    
    -- 추가 정보
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 재고 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_inventory__quantity_on_hand       CHECK (quantity_on_hand >= 0),
    
    -- 할당 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_inventory__quantity_allocated     CHECK (quantity_allocated >= 0),
    
    -- 할당 수량이 재고 수량을 초과하지 않도록 체크
    CONSTRAINT ck_inventory__allocation_valid       CHECK (quantity_allocated <= quantity_on_hand),
    
    -- 품질 상태 체크 (GOOD: 양품, DAMAGED: 불량, QUARANTINE: 격리, HOLD: 보류, RETURNED: 반품)
    CONSTRAINT ck_inventory__quality_status         CHECK (quality_status IN ('GOOD', 'DAMAGED', 'QUARANTINE', 'HOLD', 'RETURNED')),
    
    -- 유효기한 체크 (제조일보다 이후여야 함)
    CONSTRAINT ck_inventory__expiry_date            CHECK (expiry_date IS NULL OR manufactured_date IS NULL OR expiry_date > manufactured_date),
    
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_inventory__unit_cost              CHECK (unit_cost IS NULL OR unit_cost >= 0),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, LOCKED: 잠금)
    CONSTRAINT ck_inventory__status                 CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOCKED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  wms.inventory                       IS '재고 현황 관리 테이블 (실시간 재고)';
COMMENT ON COLUMN wms.inventory.id                    IS '재고 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.inventory.created_at            IS '등록 일시';
COMMENT ON COLUMN wms.inventory.created_by            IS '등록자 UUID';
COMMENT ON COLUMN wms.inventory.updated_at            IS '수정 일시';
COMMENT ON COLUMN wms.inventory.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN wms.inventory.warehouse_id          IS '창고 식별자';
COMMENT ON COLUMN wms.inventory.location_id           IS '로케이션 식별자';
COMMENT ON COLUMN wms.inventory.product_id            IS '제품 식별자';
COMMENT ON COLUMN wms.inventory.lot_number            IS '로트 번호';
COMMENT ON COLUMN wms.inventory.serial_number         IS '시리얼 번호';
COMMENT ON COLUMN wms.inventory.quantity_on_hand      IS '재고 수량';
COMMENT ON COLUMN wms.inventory.quantity_allocated    IS '할당 수량 (예약)';
COMMENT ON COLUMN wms.inventory.quantity_available    IS '가용 수량 (재고 - 할당)';
COMMENT ON COLUMN wms.inventory.quality_status        IS '품질 상태 (GOOD/DAMAGED/QUARANTINE/HOLD/RETURNED)';
COMMENT ON COLUMN wms.inventory.manufactured_date     IS '제조 일자';
COMMENT ON COLUMN wms.inventory.expiry_date           IS '유효 기한';
COMMENT ON COLUMN wms.inventory.received_date         IS '입고 일자';
COMMENT ON COLUMN wms.inventory.unit_cost             IS '단가';
COMMENT ON COLUMN wms.inventory.description           IS '설명';
COMMENT ON COLUMN wms.inventory.notes                 IS '비고';
COMMENT ON COLUMN wms.inventory.status                IS '상태 (ACTIVE/INACTIVE/LOCKED)';
COMMENT ON COLUMN wms.inventory.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_inventory__warehouse_location_product_lot
    ON wms.inventory (warehouse_id, COALESCE(location_id, '00000000-0000-0000-0000-000000000000'::UUID), product_id, COALESCE(lot_number, ''), COALESCE(serial_number, ''))
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ux_inventory__warehouse_location_product_lot IS '창고/로케이션/제품/로트/시리얼 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_inventory__warehouse_id
    ON wms.inventory (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_inventory__warehouse_id IS '창고별 재고 조회 인덱스';

CREATE INDEX ix_inventory__product_id
    ON wms.inventory (product_id, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_inventory__product_id IS '제품별 재고 조회 인덱스';

CREATE INDEX ix_inventory__location_id
    ON wms.inventory (location_id)
 WHERE location_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_inventory__location_id IS '로케이션별 재고 조회 인덱스';

CREATE INDEX ix_inventory__lot_number
    ON wms.inventory (lot_number, product_id)
 WHERE lot_number IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_inventory__lot_number IS '로트 번호별 재고 조회 인덱스';

CREATE INDEX ix_inventory__serial_number
    ON wms.inventory (serial_number)
 WHERE serial_number IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_inventory__serial_number IS '시리얼 번호별 재고 조회 인덱스';

CREATE INDEX ix_inventory__quality_status
    ON wms.inventory (quality_status, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_inventory__quality_status IS '품질 상태별 재고 조회 인덱스';

CREATE INDEX ix_inventory__expiry_date
    ON wms.inventory (expiry_date)
 WHERE expiry_date IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_inventory__expiry_date IS '유효기한별 재고 조회 인덱스';

CREATE INDEX ix_inventory__available
    ON wms.inventory (product_id, warehouse_id)
 WHERE quantity_available > 0 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_inventory__available IS '가용 재고 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 창고 참조 외래키 (창고 삭제 시 재고도 함께 삭제)
ALTER TABLE wms.inventory
  ADD CONSTRAINT fk_inventory__warehouse_id
    FOREIGN KEY (warehouse_id)     
    REFERENCES wms.warehouses(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_inventory__warehouse_id ON wms.inventory IS '창고 참조 외래키 (CASCADE 삭제)';

-- 로케이션 참조 외래키 (로케이션 삭제 시 NULL 설정)
ALTER TABLE wms.inventory
  ADD CONSTRAINT fk_inventory__location_id
    FOREIGN KEY (location_id)     
    REFERENCES wms.warehouse_locations(id)
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_inventory__location_id ON wms.inventory IS '로케이션 참조 외래키 (SET NULL 삭제)';

-- 제품 참조 외래키 (제품 삭제 시 재고 삭제 불가)
ALTER TABLE wms.inventory
  ADD CONSTRAINT fk_inventory__product_id
    FOREIGN KEY (product_id)     
    REFERENCES pim.products(id)
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_inventory__product_id ON wms.inventory IS '제품 참조 외래키 (RESTRICT 삭제)';
