-- =====================================================================================
-- 테이블: ivm.inventory_lots
-- 설명: 로트 마스터 관리 테이블 (로트별 메타데이터 및 유통기한 관리)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_lots 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 로트 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 로트 기본 정보
    lot_no                  VARCHAR(100)             NOT NULL,                               -- 로트 번호
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    
    -- 제조 정보
    manufactured_date       DATE,                                                            -- 제조 일자
    manufacturer_id         UUID,                                                            -- 제조사 식별자
    supplier_id             UUID,                                                            -- 공급사 식별자
    
    -- 유통기한 정보
    expiry_date             DATE,                                                            -- 유통기한
    warranty_date           DATE,                                                            -- 품질 보증 기한
    
    -- 품질 정보
    quality_grade           VARCHAR(20),                                                     -- 품질 등급
    quality_certificate_no  VARCHAR(100),                                                    -- 품질 인증서 번호
    quality_test_date       DATE,                                                            -- 품질 검사 일자
    quality_test_result     VARCHAR(20),                                                     -- 품질 검사 결과
    quality_notes           TEXT,                                                            -- 품질 관련 비고
    
    -- 원산지 정보
    origin_country          VARCHAR(3),                                                      -- 원산지 국가 코드 (ISO 3166-1)
    origin_region           VARCHAR(100),                                                    -- 원산지 지역
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    quarantine_reason       TEXT,                                                            -- 격리 사유
    recall_date             DATE,                                                            -- 리콜 일자
    recall_reason           TEXT,                                                            -- 리콜 사유
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 외래키 제약조건
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_inventory_lots__product_id            FOREIGN KEY (product_id) 
                                                        REFERENCES pim.products(id) 
                                                        ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 상태 체크 (ACTIVE: 활성, QUARANTINE: 격리, EXPIRED: 만료, RECALLED: 리콜)
    CONSTRAINT ck_inventory_lots__status                CHECK (status IN ('ACTIVE', 'QUARANTINE', 'EXPIRED', 'RECALLED')),
    
    -- 품질 검사 결과 체크 (PASS: 합격, FAIL: 불합격, PENDING: 대기)
    CONSTRAINT ck_inventory_lots__quality_test_result   CHECK (quality_test_result IS NULL OR 
                                                               quality_test_result IN ('PASS', 'FAIL', 'PENDING')),
    
    -- 유통기한 논리 체크 (warranty_date <= expiry_date)
    CONSTRAINT ck_inventory_lots__dates                 CHECK (warranty_date IS NULL OR 
                                                               expiry_date IS NULL OR 
                                                               warranty_date <= expiry_date)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  ivm.inventory_lots                         IS '로트 마스터 관리 테이블';
COMMENT ON COLUMN ivm.inventory_lots.id                      IS '로트 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_lots.created_at              IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_lots.created_by              IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_lots.updated_at              IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_lots.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_lots.lot_no                  IS '로트 번호';
COMMENT ON COLUMN ivm.inventory_lots.product_id              IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_lots.manufactured_date       IS '제조 일자';
COMMENT ON COLUMN ivm.inventory_lots.manufacturer_id         IS '제조사 식별자';
COMMENT ON COLUMN ivm.inventory_lots.supplier_id             IS '공급사 식별자';
COMMENT ON COLUMN ivm.inventory_lots.expiry_date             IS '유통기한';
COMMENT ON COLUMN ivm.inventory_lots.warranty_date           IS '품질 보증 기한';
COMMENT ON COLUMN ivm.inventory_lots.quality_grade           IS '품질 등급 (A/B/C 등)';
COMMENT ON COLUMN ivm.inventory_lots.quality_certificate_no  IS '품질 인증서 번호';
COMMENT ON COLUMN ivm.inventory_lots.quality_test_date       IS '품질 검사 일자';
COMMENT ON COLUMN ivm.inventory_lots.quality_test_result     IS '품질 검사 결과 (PASS/FAIL/PENDING)';
COMMENT ON COLUMN ivm.inventory_lots.quality_notes           IS '품질 관련 비고';
COMMENT ON COLUMN ivm.inventory_lots.origin_country          IS '원산지 국가 코드 (ISO 3166-1 alpha-3)';
COMMENT ON COLUMN ivm.inventory_lots.origin_region           IS '원산지 지역';
COMMENT ON COLUMN ivm.inventory_lots.status                  IS '상태 (ACTIVE/QUARANTINE/EXPIRED/RECALLED)';
COMMENT ON COLUMN ivm.inventory_lots.quarantine_reason       IS '격리 사유';
COMMENT ON COLUMN ivm.inventory_lots.recall_date             IS '리콜 일자';
COMMENT ON COLUMN ivm.inventory_lots.recall_reason           IS '리콜 사유';
COMMENT ON COLUMN ivm.inventory_lots.notes                   IS '비고';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_inventory_lots__lot_no
    ON ivm.inventory_lots (lot_no);
COMMENT ON INDEX ivm.ix_inventory_lots__lot_no IS '로트 번호별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_lots__product_id
    ON ivm.inventory_lots (product_id, status);
COMMENT ON INDEX ivm.ix_inventory_lots__product_id IS '제품별 로트 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_lots__expiry_date
    ON ivm.inventory_lots (expiry_date)
 WHERE expiry_date IS NOT NULL 
   AND status = 'ACTIVE';
COMMENT ON INDEX ivm.ix_inventory_lots__expiry_date IS '유통기한별 로트 조회 인덱스 (FIFO/FEFO용)';

CREATE INDEX IF NOT EXISTS ix_inventory_lots__manufactured_date
    ON ivm.inventory_lots (manufactured_date)
 WHERE manufactured_date IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_lots__manufactured_date IS '제조일자별 로트 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_lots__status
    ON ivm.inventory_lots (status, product_id);
COMMENT ON INDEX ivm.ix_inventory_lots__status IS '상태 및 제품별 로트 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_lots__supplier_id
    ON ivm.inventory_lots (supplier_id)
 WHERE supplier_id IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_lots__supplier_id IS '공급사별 로트 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_lots__quality_test
    ON ivm.inventory_lots (quality_test_result, quality_test_date)
 WHERE quality_test_result IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_lots__quality_test IS '품질 검사 결과별 로트 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_lots__product_lot 
    ON ivm.inventory_lots (product_id, lot_no);
COMMENT ON INDEX ivm.ux_inventory_lots__product_lot IS '제품별 로트 번호 유니크 제약';
