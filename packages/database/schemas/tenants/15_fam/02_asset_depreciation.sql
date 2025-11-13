-- =====================================================================================
-- 테이블: fam.asset_depreciation
-- 설명: 감가상각 - 고정자산 월별 감가상각 이력
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fam.asset_depreciation 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 감가상각 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 자산 정보
    asset_id                UUID                     NOT NULL,                               -- 고정자산 ID
    asset_code              VARCHAR(50),                                                     -- 자산 코드 (스냅샷)
    asset_name              VARCHAR(200),                                                    -- 자산명 (스냅샷)
    
    -- 상각 기간
    depreciation_year       INTEGER                  NOT NULL,                               -- 상각 연도
    depreciation_month      INTEGER                  NOT NULL,                               -- 상각 월
    depreciation_date       DATE                     NOT NULL,                               -- 상각 일자
    
    -- 상각 정보
    depreciation_method     VARCHAR(20)              NOT NULL,                               -- 상각 방법
    depreciation_amount     NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 당월 상각액
    accumulated_depreciation NUMERIC(18,2)           NOT NULL DEFAULT 0,                     -- 누계액
    book_value              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 장부가액
    
    -- 분개 연결
    journal_entry_id        UUID,                                                            -- 분개 ID
    biz_doc_id              UUID,                                                            -- 업무전표 ID
    
    -- 상태
    is_posted               BOOLEAN                  NOT NULL DEFAULT false,                 -- 전기 여부
    posted_at               TIMESTAMP WITH TIME ZONE,                                        -- 전기 일시
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 삭제 관리
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부
    
    -- 상각 방법 체크
    CONSTRAINT ck_asset_depreciation__method 
        CHECK (depreciation_method IN ('STRAIGHT_LINE', 'DECLINING_BALANCE', 'SUM_OF_YEARS', 'UNITS_OF_PRODUCTION')),
    
    -- 상각 월 체크 (1~12월)
    CONSTRAINT ck_asset_depreciation__month 
        CHECK (depreciation_month BETWEEN 1 AND 12),
    
    -- 고정자산 참조 외래키 (CASCADE 삭제)
    CONSTRAINT fk_asset_depreciation__asset_id
        FOREIGN KEY (asset_id) REFERENCES fam.fixed_assets(id) ON DELETE CASCADE,
    
    -- 분개 참조 외래키 (SET NULL)
    CONSTRAINT fk_asset_depreciation__journal_entry_id
        FOREIGN KEY (journal_entry_id) REFERENCES fim.journal_entries(id) ON DELETE SET NULL,
    
    -- 업무전표 참조 외래키 (SET NULL)
    CONSTRAINT fk_asset_depreciation__biz_doc_id
        FOREIGN KEY (biz_doc_id) REFERENCES fim.business_documents(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fam.asset_depreciation IS '감가상각: 고정자산 월별 감가상각 이력';
COMMENT ON COLUMN fam.asset_depreciation.id IS '감가상각 고유 식별자 (UUID)';
COMMENT ON COLUMN fam.asset_depreciation.created_at IS '등록 일시';
COMMENT ON COLUMN fam.asset_depreciation.created_by IS '등록자 UUID';
COMMENT ON COLUMN fam.asset_depreciation.updated_at IS '수정 일시';
COMMENT ON COLUMN fam.asset_depreciation.updated_by IS '수정자 UUID';
COMMENT ON COLUMN fam.asset_depreciation.asset_id IS '고정자산 ID';
COMMENT ON COLUMN fam.asset_depreciation.asset_code IS '자산 코드 (스냅샷)';
COMMENT ON COLUMN fam.asset_depreciation.asset_name IS '자산명 (스냅샷)';
COMMENT ON COLUMN fam.asset_depreciation.depreciation_year IS '상각 연도';
COMMENT ON COLUMN fam.asset_depreciation.depreciation_month IS '상각 월 (1-12)';
COMMENT ON COLUMN fam.asset_depreciation.depreciation_date IS '상각 일자';
COMMENT ON COLUMN fam.asset_depreciation.depreciation_method IS '상각 방법';
COMMENT ON COLUMN fam.asset_depreciation.depreciation_amount IS '당월 상각액';
COMMENT ON COLUMN fam.asset_depreciation.accumulated_depreciation IS '감가상각누계액';
COMMENT ON COLUMN fam.asset_depreciation.book_value IS '장부가액';
COMMENT ON COLUMN fam.asset_depreciation.journal_entry_id IS '분개 ID';
COMMENT ON COLUMN fam.asset_depreciation.biz_doc_id IS '업무전표 ID';
COMMENT ON COLUMN fam.asset_depreciation.is_posted IS '전기 여부';
COMMENT ON COLUMN fam.asset_depreciation.posted_at IS '전기 일시';
COMMENT ON COLUMN fam.asset_depreciation.notes IS '비고';
COMMENT ON COLUMN fam.asset_depreciation.is_deleted IS '삭제 여부';

COMMENT ON CONSTRAINT fk_asset_depreciation__asset_id ON fam.asset_depreciation IS '고정자산 참조 외래키 (CASCADE 삭제)';
COMMENT ON CONSTRAINT fk_asset_depreciation__journal_entry_id ON fam.asset_depreciation IS '분개 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_asset_depreciation__biz_doc_id ON fam.asset_depreciation IS '업무전표 참조 외래키 (SET NULL)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_asset_depreciation__asset_period 
    ON fam.asset_depreciation (asset_id, depreciation_year, depreciation_month)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ux_asset_depreciation__asset_period IS '자산별 기간 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_asset_depreciation__asset_id 
    ON fam.asset_depreciation (asset_id, depreciation_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_asset_depreciation__asset_id IS '자산별 상각 이력 조회 인덱스';

CREATE INDEX ix_asset_depreciation__period 
    ON fam.asset_depreciation (depreciation_year, depreciation_month)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_asset_depreciation__period IS '기간별 상각 조회 인덱스';

CREATE INDEX ix_asset_depreciation__is_posted 
    ON fam.asset_depreciation (is_posted, depreciation_date)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_asset_depreciation__is_posted IS '전기 여부 조회 인덱스';
