-- =====================================================================================
-- 테이블: ivm.inventory_transfers
-- 설명: 재고 이동 요청 관리 테이블 (창고간/로케이션간 이동)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_transfers 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이동 요청 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    transfer_code           VARCHAR(50)              NOT NULL,                               -- 이동 요청 코드
    transfer_date           DATE                     NOT NULL,                               -- 이동 요청 일자
    
    -- 출발지 정보
    from_warehouse_id       UUID                     NOT NULL,                               -- 출발 창고 식별자
    from_location_id        UUID,                                                            -- 출발 로케이션 식별자
    
    -- 도착지 정보
    to_warehouse_id         UUID                     NOT NULL,                               -- 도착 창고 식별자
    to_location_id          UUID,                                                            -- 도착 로케이션 식별자
    
    -- 제품 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    lot_no                  VARCHAR(100),                                                    -- 로트 번호
    serial_no               VARCHAR(100),                                                    -- 시리얼 번호
    
    -- 수량 정보
    qty                     INTEGER                  NOT NULL,                               -- 이동 수량
    
    -- 실제 이동 일시
    started_at              TIMESTAMP WITH TIME ZONE,                                        -- 이동 시작 일시
    completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 이동 완료 일시
    
    -- 사유 및 비고
    reason                  TEXT,                                                            -- 이동 사유
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'PENDING',                      -- 상태
    
    -- 외래키 제약조건
    -- 출발 창고 참조 외래키 (창고 삭제 불가)
    CONSTRAINT fk_inventory_transfers__from_warehouse   FOREIGN KEY (from_warehouse_id) 
                                                        REFERENCES wms.warehouses(id) 
                                                        ON DELETE RESTRICT,
    
    -- 출발 로케이션 참조 외래키 (로케이션 삭제 시 NULL)
    CONSTRAINT fk_inventory_transfers__from_location    FOREIGN KEY (from_location_id) 
                                                        REFERENCES wms.warehouse_locations(id) 
                                                        ON DELETE SET NULL,
    
    -- 도착 창고 참조 외래키 (창고 삭제 불가)
    CONSTRAINT fk_inventory_transfers__to_warehouse     FOREIGN KEY (to_warehouse_id) 
                                                        REFERENCES wms.warehouses(id) 
                                                        ON DELETE RESTRICT,
    
    -- 도착 로케이션 참조 외래키 (로케이션 삭제 시 NULL)
    CONSTRAINT fk_inventory_transfers__to_location      FOREIGN KEY (to_location_id) 
                                                        REFERENCES wms.warehouse_locations(id) 
                                                        ON DELETE SET NULL,
    
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_inventory_transfers__product_id       FOREIGN KEY (product_id) 
                                                        REFERENCES pim.products(id) 
                                                        ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 이동 수량 양수 체크 (1 이상)
    CONSTRAINT ck_inventory_transfers__qty              CHECK (qty > 0),
    
    -- 출발지와 도착지가 같으면 안됨
    CONSTRAINT ck_inventory_transfers__different_location CHECK (
        from_warehouse_id != to_warehouse_id OR 
        COALESCE(from_location_id, '00000000-0000-0000-0000-000000000000'::UUID) != 
        COALESCE(to_location_id, '00000000-0000-0000-0000-000000000000'::UUID)
    ),
    
    -- 상태 체크 (PENDING: 대기, IN_TRANSIT: 이동중, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_inventory_transfers__status           CHECK (status IN ('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  ivm.inventory_transfers                    IS '재고 이동 요청 관리 테이블';
COMMENT ON COLUMN ivm.inventory_transfers.id                 IS '이동 요청 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_transfers.created_at         IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_transfers.created_by         IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_transfers.updated_at         IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_transfers.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_transfers.transfer_code      IS '이동 요청 코드';
COMMENT ON COLUMN ivm.inventory_transfers.transfer_date      IS '이동 요청 일자';
COMMENT ON COLUMN ivm.inventory_transfers.from_warehouse_id  IS '출발 창고 식별자';
COMMENT ON COLUMN ivm.inventory_transfers.from_location_id   IS '출발 로케이션 식별자';
COMMENT ON COLUMN ivm.inventory_transfers.to_warehouse_id    IS '도착 창고 식별자';
COMMENT ON COLUMN ivm.inventory_transfers.to_location_id     IS '도착 로케이션 식별자';
COMMENT ON COLUMN ivm.inventory_transfers.product_id         IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_transfers.lot_no         IS '로트 번호';
COMMENT ON COLUMN ivm.inventory_transfers.serial_no      IS '시리얼 번호';
COMMENT ON COLUMN ivm.inventory_transfers.qty                IS '이동 수량';
COMMENT ON COLUMN ivm.inventory_transfers.started_at         IS '이동 시작 일시';
COMMENT ON COLUMN ivm.inventory_transfers.completed_at       IS '이동 완료 일시';
COMMENT ON COLUMN ivm.inventory_transfers.reason             IS '이동 사유';
COMMENT ON COLUMN ivm.inventory_transfers.notes              IS '비고';
COMMENT ON COLUMN ivm.inventory_transfers.status             IS '상태 (PENDING/IN_TRANSIT/COMPLETED/CANCELLED)';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_inventory_transfers__transfer_code
    ON ivm.inventory_transfers (transfer_code);
COMMENT ON INDEX ivm.ix_inventory_transfers__transfer_code IS '이동 요청 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_transfers__from_warehouse
    ON ivm.inventory_transfers (from_warehouse_id);
COMMENT ON INDEX ivm.ix_inventory_transfers__from_warehouse IS '출발 창고별 이동 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_transfers__to_warehouse
    ON ivm.inventory_transfers (to_warehouse_id);
COMMENT ON INDEX ivm.ix_inventory_transfers__to_warehouse IS '도착 창고별 이동 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_transfers__product_id
    ON ivm.inventory_transfers (product_id);
COMMENT ON INDEX ivm.ix_inventory_transfers__product_id IS '제품별 이동 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_transfers__status
    ON ivm.inventory_transfers (status, transfer_date DESC);
COMMENT ON INDEX ivm.ix_inventory_transfers__status IS '상태 및 일자별 이동 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_transfers__transfer_date
    ON ivm.inventory_transfers (transfer_date DESC);
COMMENT ON INDEX ivm.ix_inventory_transfers__transfer_date IS '이동 요청 일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_transfers__lot_no
    ON ivm.inventory_transfers (lot_no)
 WHERE lot_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_transfers__lot_no IS '로트 번호별 이동 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_transfers__serial_no
    ON ivm.inventory_transfers (serial_no)
 WHERE serial_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_transfers__serial_no IS '시리얼 번호별 이동 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_transfers__code 
    ON ivm.inventory_transfers (transfer_code);
COMMENT ON INDEX ivm.ux_inventory_transfers__code IS '이동 요청 코드 유니크 제약';
