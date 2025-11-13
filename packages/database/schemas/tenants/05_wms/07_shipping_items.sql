-- =====================================================================================
-- 테이블: wms.shipping_items
-- 설명: 출고 라인 (상세) 정보 관리 테이블
-- 작성일: 2025-10-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE wms.shipping_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 출고 라인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,                 -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gi_id                   UUID                     NOT NULL,                                  -- 출고 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                                  -- 라인 번호
    so_line_id              UUID,                                                               -- 판매주문 라인 식별자
    item_id                 UUID                     NOT NULL,                                  -- 제품 식별자
    location_id             UUID,                                                               -- 로케이션 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                       -- 로트 번호
    serial_number           VARCHAR(100),                                                       -- 시리얼 번호
    
    -- 수량 정보
    requested_qty           INTEGER                  DEFAULT 0,                                 -- 요청 수량
    picked_qty              INTEGER                  NOT NULL,                                  -- 피킹 수량
    
    -- 외래키 제약조건
    -- 출고 헤더 참조 외래키
    CONSTRAINT fk_shipping_items__gi_id                 FOREIGN KEY (gi_id) 
                                                        REFERENCES wms.shipping(id) 
                                                        ON DELETE CASCADE,
    
    -- CHECK 제약조건
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_shipping_items__line_no               CHECK (line_no > 0),
    
    -- 요청 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_shipping_items__requested_qty         CHECK (requested_qty >= 0),
    
    -- 피킹 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_shipping_items__picked_qty            CHECK (picked_qty >= 0)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  wms.shipping_items                IS '출고 라인(상세) 관리 테이블';
COMMENT ON COLUMN wms.shipping_items.id             IS '출고 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.shipping_items.created_at     IS '등록 일시';
COMMENT ON COLUMN wms.shipping_items.created_by     IS '등록자 UUID';
COMMENT ON COLUMN wms.shipping_items.updated_at     IS '수정 일시';
COMMENT ON COLUMN wms.shipping_items.updated_by     IS '수정자 UUID';
COMMENT ON COLUMN wms.shipping_items.gi_id          IS '출고 헤더 식별자';
COMMENT ON COLUMN wms.shipping_items.line_no        IS '라인 번호';
COMMENT ON COLUMN wms.shipping_items.so_line_id     IS '판매주문 라인 식별자';
COMMENT ON COLUMN wms.shipping_items.item_id        IS '제품 식별자';
COMMENT ON COLUMN wms.shipping_items.location_id    IS '로케이션 식별자';
COMMENT ON COLUMN wms.shipping_items.lot_number     IS '로트 번호';
COMMENT ON COLUMN wms.shipping_items.serial_number  IS '시리얼 번호';
COMMENT ON COLUMN wms.shipping_items.requested_qty  IS '요청 수량';
COMMENT ON COLUMN wms.shipping_items.picked_qty     IS '피킹 수량';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_shipping_items__gi_id
    ON wms.shipping_items (gi_id, line_no);
COMMENT ON INDEX wms.ix_shipping_items__gi_id IS '출고 헤더별 라인 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_shipping_items__item_id
    ON wms.shipping_items (item_id);
COMMENT ON INDEX wms.ix_shipping_items__item_id IS '제품별 출고 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_shipping_items__location_id
    ON wms.shipping_items (location_id)
 WHERE location_id IS NOT NULL;

COMMENT ON INDEX wms.ix_shipping_items__location_id IS '로케이션별 출고 내역 조회 인덱스';
CREATE INDEX IF NOT EXISTS ix_shipping_items__serial_number
    ON wms.shipping_items (serial_number)
 WHERE serial_number IS NOT NULL;
COMMENT ON INDEX wms.ix_shipping_items__serial_number IS '시리얼 번호별 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_shipping_items__gi_line
    ON wms.shipping_items (gi_id, line_no);
COMMENT ON INDEX wms.ux_shipping_items__gi_line IS '출고 헤더별 라인번호 유니크 제약';
