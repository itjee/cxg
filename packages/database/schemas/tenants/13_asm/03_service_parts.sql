-- =====================================================================================
-- 테이블: asm.service_parts
-- 설명: A/S 작업시 사용된 부품 내역 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.service_parts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 부품 사용 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 부품 사용 기본 정보
    service_request_id      UUID                     NOT NULL,                               -- A/S 요청 식별자
    product_id              UUID                     NOT NULL,                               -- 부품(제품) 식별자
    
    -- 부품 정보
    part_name               VARCHAR(200),                                                    -- 부품명
    part_code               VARCHAR(50),                                                     -- 부품 코드
    serial_no               VARCHAR(100),                                                    -- 부품 시리얼 번호
    
    -- 수량 및 가격
    qty                     INTEGER                  NOT NULL,                               -- 사용 수량
    unit_cost               NUMERIC(18,4)            NOT NULL,                               -- 부품 단가
    total_cost              NUMERIC(18,4)            NOT NULL,                               -- 총 비용 (단가 × 수량)
    
    -- 부품 상태
    part_condition          VARCHAR(20),                                                     -- 부품 상태
    warranty_months         INTEGER,                                                         -- 부품 보증 개월수
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 수량 양수 체크
    CONSTRAINT ck_service_parts__qty                CHECK (qty > 0),
    
    -- 비용 양수 체크
    CONSTRAINT ck_service_parts__costs              CHECK (unit_cost >= 0 AND total_cost >= 0),
    
    -- 부품 상태 체크
    CONSTRAINT ck_service_parts__part_condition     CHECK (part_condition IS NULL OR part_condition IN ('NEW', 'REFURBISHED', 'USED')),
    
    -- 보증 개월수 양수 체크
    CONSTRAINT ck_service_parts__warranty_months    CHECK (warranty_months IS NULL OR warranty_months >= 0),
    
    -- A/S 요청 참조 외래키 (CASCADE 삭제)
    CONSTRAINT fk_service_parts__service_request_id FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE,
    
    -- 제품(부품) 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_service_parts__product_id         FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE RESTRICT
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  asm.service_parts                      IS 'A/S 작업시 사용된 부품 내역 관리 테이블';
COMMENT ON COLUMN asm.service_parts.id                   IS '부품 사용 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.service_parts.created_at           IS '등록 일시';
COMMENT ON COLUMN asm.service_parts.created_by           IS '등록자 UUID';
COMMENT ON COLUMN asm.service_parts.updated_at           IS '수정 일시';
COMMENT ON COLUMN asm.service_parts.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN asm.service_parts.service_request_id   IS 'A/S 요청 식별자';
COMMENT ON COLUMN asm.service_parts.product_id           IS '부품(제품) 식별자';
COMMENT ON COLUMN asm.service_parts.part_name            IS '부품명';
COMMENT ON COLUMN asm.service_parts.part_code            IS '부품 코드';
COMMENT ON COLUMN asm.service_parts.serial_no        IS '부품 시리얼 번호';
COMMENT ON COLUMN asm.service_parts.qty                  IS '사용 수량';
COMMENT ON COLUMN asm.service_parts.unit_cost            IS '부품 단가';
COMMENT ON COLUMN asm.service_parts.total_cost           IS '총 비용 (단가 × 수량)';
COMMENT ON COLUMN asm.service_parts.part_condition       IS '부품 상태 (NEW: 신품/REFURBISHED: 리퍼/USED: 중고)';
COMMENT ON COLUMN asm.service_parts.warranty_months      IS '부품 보증 개월수';
COMMENT ON COLUMN asm.service_parts.notes                IS '비고';
COMMENT ON COLUMN asm.service_parts.is_deleted           IS '논리 삭제 플래그';

COMMENT ON CONSTRAINT fk_service_parts__service_request_id ON asm.service_parts IS 'A/S 요청 참조 외래키 (CASCADE 삭제)';
COMMENT ON CONSTRAINT fk_service_parts__product_id ON asm.service_parts IS '제품(부품) 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

CREATE INDEX ix_service_parts__service_request_id
    ON asm.service_parts (service_request_id)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_parts__service_request_id IS 'A/S 요청별 사용 부품 조회 인덱스';

CREATE INDEX ix_service_parts__product_id
    ON asm.service_parts (product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_parts__product_id IS '부품별 사용 이력 조회 인덱스';

CREATE INDEX ix_service_parts__part_code
    ON asm.service_parts (part_code)
 WHERE part_code IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_service_parts__part_code IS '부품 코드별 사용 이력 조회 인덱스';

CREATE INDEX ix_service_parts__created_at
    ON asm.service_parts (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_parts__created_at IS '부품 사용 등록일시 조회 인덱스';
