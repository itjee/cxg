-- =====================================================================================
-- 테이블: ivm.inventory_adjustments
-- 설명: 재고 조정 관리 테이블 (실사, 손망실, 품질불량 등)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_adjustments 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 조정 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    adjustment_code         VARCHAR(50)              NOT NULL,                               -- 조정 코드
    adjustment_date         DATE                     NOT NULL,                               -- 조정 일자
    adjustment_type         VARCHAR(20)              NOT NULL,                               -- 조정 유형
    
    -- 위치 및 제품 정보
    warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자
    location_id             UUID,                                                            -- 로케이션 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    
    -- 로트/시리얼 정보
    lot_no                  VARCHAR(100),                                                    -- 로트 번호
    serial_no               VARCHAR(100),                                                    -- 시리얼 번호
    
    -- 수량 정보
    before_qty              INTEGER                  NOT NULL,                               -- 조정 전 수량
    after_qty               INTEGER                  NOT NULL,                               -- 조정 후 수량
    adjustment_qty          INTEGER                  NOT NULL,                               -- 조정 수량 (after - before)
    
    -- 사유 정보
    reason_code             VARCHAR(50),                                                     -- 사유 코드
    reason                  TEXT                     NOT NULL,                               -- 조정 사유 (필수)
    
    -- 승인 정보
    approved_by             UUID,                                                            -- 승인자 UUID
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    
    -- 실제 조정 일시
    completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 조정 완료 일시
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'PENDING',                      -- 상태
    
    -- 외래키 제약조건
    -- 창고 참조 외래키 (창고 삭제 불가)
    CONSTRAINT fk_inventory_adjustments__warehouse_id   FOREIGN KEY (warehouse_id) 
                                                        REFERENCES wms.warehouses(id) 
                                                        ON DELETE RESTRICT,
    
    -- 로케이션 참조 외래키 (로케이션 삭제 시 NULL)
    CONSTRAINT fk_inventory_adjustments__location_id    FOREIGN KEY (location_id) 
                                                        REFERENCES wms.warehouse_locations(id) 
                                                        ON DELETE SET NULL,
    
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_inventory_adjustments__product_id     FOREIGN KEY (product_id) 
                                                        REFERENCES pim.products(id) 
                                                        ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 조정 유형 체크 (COUNT: 실사, DAMAGE: 손상, LOSS: 분실, QUALITY: 품질불량, FOUND: 발견, OTHER: 기타)
    CONSTRAINT ck_inventory_adjustments__type           CHECK (adjustment_type IN ('COUNT', 'DAMAGE', 'LOSS', 'QUALITY', 'FOUND', 'OTHER')),
    
    -- 조정 수량 일치 체크 (adjustment_qty = after_qty - before_qty)
    CONSTRAINT ck_inventory_adjustments__qty_match      CHECK (adjustment_qty = after_qty - before_qty),
    
    -- 조정 수량 0 불가 체크 (반드시 변경 발생)
    CONSTRAINT ck_inventory_adjustments__qty_not_zero   CHECK (adjustment_qty != 0),
    
    -- 조정 전/후 수량 음수 불가 체크
    CONSTRAINT ck_inventory_adjustments__qty_positive   CHECK (before_qty >= 0 AND after_qty >= 0),
    
    -- 상태 체크 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, COMPLETED: 완료)
    CONSTRAINT ck_inventory_adjustments__status         CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  ivm.inventory_adjustments                      IS '재고 조정 관리 테이블';
COMMENT ON COLUMN ivm.inventory_adjustments.id                   IS '조정 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_adjustments.created_at           IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_adjustments.created_by           IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_adjustments.updated_at           IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_adjustments.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_adjustments.adjustment_code      IS '조정 코드';
COMMENT ON COLUMN ivm.inventory_adjustments.adjustment_date      IS '조정 일자';
COMMENT ON COLUMN ivm.inventory_adjustments.adjustment_type      IS '조정 유형 (COUNT/DAMAGE/LOSS/QUALITY/FOUND/OTHER)';
COMMENT ON COLUMN ivm.inventory_adjustments.warehouse_id         IS '창고 식별자';
COMMENT ON COLUMN ivm.inventory_adjustments.location_id          IS '로케이션 식별자';
COMMENT ON COLUMN ivm.inventory_adjustments.product_id           IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_adjustments.lot_no           IS '로트 번호';
COMMENT ON COLUMN ivm.inventory_adjustments.serial_no        IS '시리얼 번호';
COMMENT ON COLUMN ivm.inventory_adjustments.before_qty           IS '조정 전 수량';
COMMENT ON COLUMN ivm.inventory_adjustments.after_qty            IS '조정 후 수량';
COMMENT ON COLUMN ivm.inventory_adjustments.adjustment_qty       IS '조정 수량 (after_qty - before_qty)';
COMMENT ON COLUMN ivm.inventory_adjustments.reason_code          IS '사유 코드 (표준 코드)';
COMMENT ON COLUMN ivm.inventory_adjustments.reason               IS '조정 사유 (필수)';
COMMENT ON COLUMN ivm.inventory_adjustments.approved_by          IS '승인자 UUID';
COMMENT ON COLUMN ivm.inventory_adjustments.approved_at          IS '승인 일시';
COMMENT ON COLUMN ivm.inventory_adjustments.completed_at         IS '조정 완료 일시';
COMMENT ON COLUMN ivm.inventory_adjustments.notes                IS '비고';
COMMENT ON COLUMN ivm.inventory_adjustments.status               IS '상태 (PENDING/APPROVED/REJECTED/COMPLETED)';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__adjustment_code
    ON ivm.inventory_adjustments (adjustment_code);
COMMENT ON INDEX ivm.ix_inventory_adjustments__adjustment_code IS '조정 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__warehouse_id
    ON ivm.inventory_adjustments (warehouse_id);
COMMENT ON INDEX ivm.ix_inventory_adjustments__warehouse_id IS '창고별 조정 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__product_id
    ON ivm.inventory_adjustments (product_id);
COMMENT ON INDEX ivm.ix_inventory_adjustments__product_id IS '제품별 조정 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__location_id
    ON ivm.inventory_adjustments (location_id)
 WHERE location_id IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_adjustments__location_id IS '로케이션별 조정 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__type
    ON ivm.inventory_adjustments (adjustment_type, warehouse_id);
COMMENT ON INDEX ivm.ix_inventory_adjustments__type IS '조정 유형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__status
    ON ivm.inventory_adjustments (status, adjustment_date DESC);
COMMENT ON INDEX ivm.ix_inventory_adjustments__status IS '상태 및 일자별 조정 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__adjustment_date
    ON ivm.inventory_adjustments (adjustment_date DESC);
COMMENT ON INDEX ivm.ix_inventory_adjustments__adjustment_date IS '조정 일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__approved_by
    ON ivm.inventory_adjustments (approved_by)
 WHERE approved_by IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_adjustments__approved_by IS '승인자별 조정 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__lot_no
    ON ivm.inventory_adjustments (lot_no)
 WHERE lot_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_adjustments__lot_no IS '로트 번호별 조정 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_adjustments__serial_no
    ON ivm.inventory_adjustments (serial_no)
 WHERE serial_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_adjustments__serial_no IS '시리얼 번호별 조정 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_adjustments__code 
    ON ivm.inventory_adjustments (adjustment_code);
COMMENT ON INDEX ivm.ux_inventory_adjustments__code IS '조정 코드 유니크 제약';
