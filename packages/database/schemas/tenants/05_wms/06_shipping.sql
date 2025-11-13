-- =====================================================================================
-- 테이블: wms.shipping
-- 설명: 출고 헤더 정보 관리 테이블
-- 작성일: 2025-10-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE wms.shipping 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 출고 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,                 -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gi_code                 VARCHAR(50)              NOT NULL,                                  -- 출고 코드
    doc_date                DATE                     NOT NULL,                                  -- 전표 일자
    
    -- 참조 정보
    so_id                   UUID,                                                               -- 판매주문 식별자
    customer_id             UUID,                                                               -- 고객 식별자
    warehouse_id            UUID                     NOT NULL,                                  -- 창고 식별자
    picker_id               UUID,                                                               -- 피킹 담당자 식별자
    
    -- 수량 정보
    total_qty               INTEGER                  DEFAULT 0,                                 -- 총 수량
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                           -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- CHECK 제약조건
    -- 상태 체크 (DRAFT: 임시저장, CONFIRMED: 확정, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_shipping__status                   CHECK (status IN ('DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    
    -- 총 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_shipping__total_qty                CHECK (total_qty >= 0)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  wms.shipping                IS '자재/제품 출고 헤더 관리 테이블';
COMMENT ON COLUMN wms.shipping.id             IS '출고 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.shipping.created_at     IS '등록 일시';
COMMENT ON COLUMN wms.shipping.created_by     IS '등록자 UUID';
COMMENT ON COLUMN wms.shipping.updated_at     IS '수정 일시';
COMMENT ON COLUMN wms.shipping.updated_by     IS '수정자 UUID';
COMMENT ON COLUMN wms.shipping.gi_code        IS '출고 코드 (출고번호)';
COMMENT ON COLUMN wms.shipping.doc_date       IS '전표 일자';
COMMENT ON COLUMN wms.shipping.so_id          IS '판매주문 식별자';
COMMENT ON COLUMN wms.shipping.customer_id    IS '고객 식별자';
COMMENT ON COLUMN wms.shipping.warehouse_id   IS '창고 식별자';
COMMENT ON COLUMN wms.shipping.picker_id      IS '피킹 담당자 식별자';
COMMENT ON COLUMN wms.shipping.total_qty      IS '총 수량';
COMMENT ON COLUMN wms.shipping.status         IS '상태 (DRAFT/CONFIRMED/COMPLETED/CANCELLED)';
COMMENT ON COLUMN wms.shipping.is_deleted     IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_shipping__gi_code
    ON wms.shipping (gi_code)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_shipping__gi_code IS '출고 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_shipping__warehouse_id
    ON wms.shipping (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_shipping__warehouse_id IS '창고별 출고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_shipping__doc_date
    ON wms.shipping (doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_shipping__doc_date IS '전표 일자별 출고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_shipping__customer_id
    ON wms.shipping (customer_id)
 WHERE customer_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_shipping__customer_id IS '고객별 출고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_shipping__status
    ON wms.shipping (status, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_shipping__status IS '상태별 출고 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_shipping__gi_code
    ON wms.shipping (gi_code)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ux_shipping__gi_code IS '출고 코드 유니크 제약';
