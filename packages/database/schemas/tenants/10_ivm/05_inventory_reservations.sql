-- =====================================================================================
-- 테이블: ivm.inventory_reservations
-- 설명: 재고 예약 관리 테이블 (주문/생산 등에 대한 재고 예약)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_reservations 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 예약 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 예약 기본 정보
    reservation_code        VARCHAR(50)              NOT NULL,                               -- 예약 코드
    reservation_date        DATE                     NOT NULL,                               -- 예약 일자
    
    -- 참조 문서 정보
    ref_doc_type            VARCHAR(50)              NOT NULL,                               -- 참조 문서 유형
    ref_doc_id              UUID                     NOT NULL,                               -- 참조 문서 식별자
    ref_line_id             UUID,                                                            -- 참조 라인 식별자
    
    -- 위치 및 제품 정보
    warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자
    location_id             UUID,                                                            -- 로케이션 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    
    -- 로트/시리얼 정보
    lot_no                  VARCHAR(100),                                                    -- 로트 번호
    serial_no               VARCHAR(100),                                                    -- 시리얼 번호
    
    -- 수량 정보
    reserved_qty            INTEGER                  NOT NULL,                               -- 예약 수량
    fulfilled_qty           INTEGER                  DEFAULT 0,                              -- 이행 수량
    remaining_qty           INTEGER                  NOT NULL,                               -- 잔여 수량
    
    -- 예약 만료 정보
    expires_at              TIMESTAMP WITH TIME ZONE,                                        -- 예약 만료 일시
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    released_at             TIMESTAMP WITH TIME ZONE,                                        -- 해제 일시
    released_by             UUID,                                                            -- 해제자 UUID
    release_reason          TEXT,                                                            -- 해제 사유
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 외래키 제약조건
    -- 창고 참조 외래키 (창고 삭제 불가)
    CONSTRAINT fk_inventory_reservations__warehouse_id  FOREIGN KEY (warehouse_id) 
                                                        REFERENCES wms.warehouses(id) 
                                                        ON DELETE RESTRICT,
    
    -- 로케이션 참조 외래키 (로케이션 삭제 시 NULL)
    CONSTRAINT fk_inventory_reservations__location_id   FOREIGN KEY (location_id) 
                                                        REFERENCES wms.warehouse_locations(id) 
                                                        ON DELETE SET NULL,
    
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_inventory_reservations__product_id    FOREIGN KEY (product_id) 
                                                        REFERENCES pim.products(id) 
                                                        ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 예약 수량 양수 체크 (1 이상)
    CONSTRAINT ck_inventory_reservations__reserved_qty  CHECK (reserved_qty > 0),
    
    -- 이행 수량 범위 체크 (0 이상, 예약 수량 이하)
    CONSTRAINT ck_inventory_reservations__fulfilled_qty CHECK (fulfilled_qty >= 0 AND fulfilled_qty <= reserved_qty),
    
    -- 잔여 수량 일치 체크 (remaining_qty = reserved_qty - fulfilled_qty)
    CONSTRAINT ck_inventory_reservations__remaining_qty CHECK (remaining_qty = reserved_qty - fulfilled_qty),
    
    -- 상태 체크 (ACTIVE: 활성, FULFILLED: 이행완료, RELEASED: 해제, EXPIRED: 만료)
    CONSTRAINT ck_inventory_reservations__status        CHECK (status IN ('ACTIVE', 'FULFILLED', 'RELEASED', 'EXPIRED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  ivm.inventory_reservations                     IS '재고 예약 관리 테이블';
COMMENT ON COLUMN ivm.inventory_reservations.id                  IS '예약 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_reservations.created_at          IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_reservations.created_by          IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_reservations.updated_at          IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_reservations.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_reservations.reservation_code    IS '예약 코드';
COMMENT ON COLUMN ivm.inventory_reservations.reservation_date    IS '예약 일자';
COMMENT ON COLUMN ivm.inventory_reservations.ref_doc_type  IS '참조 문서 유형 (SO/WO/TRANSFER 등)';
COMMENT ON COLUMN ivm.inventory_reservations.ref_doc_id    IS '참조 문서 식별자';
COMMENT ON COLUMN ivm.inventory_reservations.ref_line_id   IS '참조 라인 식별자';
COMMENT ON COLUMN ivm.inventory_reservations.warehouse_id        IS '창고 식별자';
COMMENT ON COLUMN ivm.inventory_reservations.location_id         IS '로케이션 식별자';
COMMENT ON COLUMN ivm.inventory_reservations.product_id          IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_reservations.lot_no          IS '로트 번호';
COMMENT ON COLUMN ivm.inventory_reservations.serial_no       IS '시리얼 번호';
COMMENT ON COLUMN ivm.inventory_reservations.reserved_qty        IS '예약 수량';
COMMENT ON COLUMN ivm.inventory_reservations.fulfilled_qty       IS '이행 수량';
COMMENT ON COLUMN ivm.inventory_reservations.remaining_qty       IS '잔여 수량 (reserved_qty - fulfilled_qty)';
COMMENT ON COLUMN ivm.inventory_reservations.expires_at          IS '예약 만료 일시';
COMMENT ON COLUMN ivm.inventory_reservations.status              IS '상태 (ACTIVE/FULFILLED/RELEASED/EXPIRED)';
COMMENT ON COLUMN ivm.inventory_reservations.released_at         IS '해제 일시';
COMMENT ON COLUMN ivm.inventory_reservations.released_by         IS '해제자 UUID';
COMMENT ON COLUMN ivm.inventory_reservations.release_reason      IS '해제 사유';
COMMENT ON COLUMN ivm.inventory_reservations.notes               IS '비고';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_inventory_reservations__reservation_code
    ON ivm.inventory_reservations (reservation_code);
COMMENT ON INDEX ivm.ix_inventory_reservations__reservation_code IS '예약 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_reservations__warehouse_id
    ON ivm.inventory_reservations (warehouse_id);
COMMENT ON INDEX ivm.ix_inventory_reservations__warehouse_id IS '창고별 예약 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_reservations__product_id
    ON ivm.inventory_reservations (product_id, status);
COMMENT ON INDEX ivm.ix_inventory_reservations__product_id IS '제품별 예약 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_reservations__reference_doc
    ON ivm.inventory_reservations (ref_doc_type, ref_doc_id);
COMMENT ON INDEX ivm.ix_inventory_reservations__reference_doc IS '참조 문서별 예약 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_reservations__status
    ON ivm.inventory_reservations (status, reservation_date DESC);
COMMENT ON INDEX ivm.ix_inventory_reservations__status IS '상태 및 일자별 예약 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_reservations__expires_at
    ON ivm.inventory_reservations (expires_at)
 WHERE status = 'ACTIVE' 
   AND expires_at IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_reservations__expires_at IS '만료 예정 예약 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_reservations__lot_no
    ON ivm.inventory_reservations (lot_no)
 WHERE lot_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_reservations__lot_no IS '로트 번호별 예약 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_reservations__serial_no
    ON ivm.inventory_reservations (serial_no)
 WHERE serial_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_reservations__serial_no IS '시리얼 번호별 예약 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_reservations__code 
    ON ivm.inventory_reservations (reservation_code);
COMMENT ON INDEX ivm.ux_inventory_reservations__code IS '예약 코드 유니크 제약';
