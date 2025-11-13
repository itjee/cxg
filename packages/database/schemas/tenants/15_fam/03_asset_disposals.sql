-- =====================================================================================
-- 테이블: fam.asset_disposals
-- 설명: 자산 처분 - 고정자산 매각/폐기 이력
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fam.asset_disposals 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 자산 처분 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 자산 정보
    asset_id                UUID                     NOT NULL,                               -- 고정자산 ID
    asset_code              VARCHAR(50),                                                     -- 자산 코드 (스냅샷)
    asset_name              VARCHAR(200),                                                    -- 자산명 (스냅샷)
    
    -- 처분 정보
    disposal_no             VARCHAR(50)              NOT NULL,                               -- 처분 번호
    disposal_date           DATE                     NOT NULL,                               -- 처분일
    disposal_method         VARCHAR(20)              NOT NULL,                               -- 처분 방법
    disposal_reason         TEXT,                                                            -- 처분 사유
    
    -- 금액 정보
    acquisition_cost        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 취득가액 (스냅샷)
    accumulated_depreciation NUMERIC(18,2)           NOT NULL DEFAULT 0,                     -- 감가상각누계액 (스냅샷)
    book_value              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 장부가액 (스냅샷)
    disposal_amount         NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 처분가액
    disposal_gain_loss      NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 처분손익
    
    -- 매입자 정보
    buyer_partner_id        UUID,                                                            -- 매입자 (거래처)
    buyer_name              VARCHAR(200),                                                    -- 매입자명
    buyer_contact           VARCHAR(100),                                                    -- 매입자 연락처
    
    -- 분개 연결
    journal_entry_id        UUID,                                                            -- 분개 ID
    biz_doc_id              UUID,                                                            -- 업무전표 ID
    
    -- 승인 정보
    approval_status         VARCHAR(20),                                                     -- 승인 상태
    approved_by             UUID,                                                            -- 승인자
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 삭제 관리
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부
    
    -- 처분 방법 체크
    CONSTRAINT ck_asset_disposals__disposal_method 
        CHECK (disposal_method IN ('SALE', 'DISCARD', 'DONATION', 'EXCHANGE', 'LOSS')),
    
    -- 승인 상태 체크
    CONSTRAINT ck_asset_disposals__approval_status 
        CHECK (approval_status IS NULL OR approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    
    -- 고정자산 참조 외래키 (CASCADE 삭제)
    CONSTRAINT fk_asset_disposals__asset_id
        FOREIGN KEY (asset_id) REFERENCES fam.fixed_assets(id) ON DELETE CASCADE,
    
    -- 매입자 참조 외래키 (SET NULL)
    CONSTRAINT fk_asset_disposals__buyer_partner_id
        FOREIGN KEY (buyer_partner_id) REFERENCES crm.partners(id) ON DELETE SET NULL,
    
    -- 분개 참조 외래키 (SET NULL)
    CONSTRAINT fk_asset_disposals__journal_entry_id
        FOREIGN KEY (journal_entry_id) REFERENCES fim.journal_entries(id) ON DELETE SET NULL,
    
    -- 업무전표 참조 외래키 (SET NULL)
    CONSTRAINT fk_asset_disposals__biz_doc_id
        FOREIGN KEY (biz_doc_id) REFERENCES fim.business_documents(id) ON DELETE SET NULL,
    
    -- 승인자 참조 외래키 (SET NULL)
    CONSTRAINT fk_asset_disposals__approved_by
        FOREIGN KEY (approved_by) REFERENCES sys.users(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fam.asset_disposals IS '자산 처분: 고정자산 매각/폐기 이력';
COMMENT ON COLUMN fam.asset_disposals.id IS '자산 처분 고유 식별자 (UUID)';
COMMENT ON COLUMN fam.asset_disposals.created_at IS '등록 일시';
COMMENT ON COLUMN fam.asset_disposals.created_by IS '등록자 UUID';
COMMENT ON COLUMN fam.asset_disposals.updated_at IS '수정 일시';
COMMENT ON COLUMN fam.asset_disposals.updated_by IS '수정자 UUID';
COMMENT ON COLUMN fam.asset_disposals.asset_id IS '고정자산 ID';
COMMENT ON COLUMN fam.asset_disposals.asset_code IS '자산 코드 (스냅샷)';
COMMENT ON COLUMN fam.asset_disposals.asset_name IS '자산명 (스냅샷)';
COMMENT ON COLUMN fam.asset_disposals.disposal_no IS '처분 번호';
COMMENT ON COLUMN fam.asset_disposals.disposal_date IS '처분일';
COMMENT ON COLUMN fam.asset_disposals.disposal_method IS '처분 방법 (SALE/DISCARD/DONATION/EXCHANGE/LOSS)';
COMMENT ON COLUMN fam.asset_disposals.disposal_reason IS '처분 사유';
COMMENT ON COLUMN fam.asset_disposals.acquisition_cost IS '취득가액 (스냅샷)';
COMMENT ON COLUMN fam.asset_disposals.accumulated_depreciation IS '감가상각누계액 (스냅샷)';
COMMENT ON COLUMN fam.asset_disposals.book_value IS '장부가액 (스냅샷)';
COMMENT ON COLUMN fam.asset_disposals.disposal_amount IS '처분가액';
COMMENT ON COLUMN fam.asset_disposals.disposal_gain_loss IS '처분손익 (처분가액 - 장부가액)';
COMMENT ON COLUMN fam.asset_disposals.buyer_partner_id IS '매입자 ID (거래처)';
COMMENT ON COLUMN fam.asset_disposals.buyer_name IS '매입자명';
COMMENT ON COLUMN fam.asset_disposals.buyer_contact IS '매입자 연락처';
COMMENT ON COLUMN fam.asset_disposals.journal_entry_id IS '분개 ID';
COMMENT ON COLUMN fam.asset_disposals.biz_doc_id IS '업무전표 ID';
COMMENT ON COLUMN fam.asset_disposals.approval_status IS '승인 상태 (PENDING/APPROVED/REJECTED)';
COMMENT ON COLUMN fam.asset_disposals.approved_by IS '승인자 UUID';
COMMENT ON COLUMN fam.asset_disposals.approved_at IS '승인 일시';
COMMENT ON COLUMN fam.asset_disposals.notes IS '비고';
COMMENT ON COLUMN fam.asset_disposals.is_deleted IS '삭제 여부';

COMMENT ON CONSTRAINT fk_asset_disposals__asset_id ON fam.asset_disposals IS '고정자산 참조 외래키 (CASCADE 삭제)';
COMMENT ON CONSTRAINT fk_asset_disposals__buyer_partner_id ON fam.asset_disposals IS '매입자 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_asset_disposals__journal_entry_id ON fam.asset_disposals IS '분개 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_asset_disposals__biz_doc_id ON fam.asset_disposals IS '업무전표 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_asset_disposals__approved_by ON fam.asset_disposals IS '승인자 참조 외래키 (SET NULL)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_asset_disposals__disposal_no 
    ON fam.asset_disposals (disposal_no)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ux_asset_disposals__disposal_no IS '처분 번호 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_asset_disposals__asset_id 
    ON fam.asset_disposals (asset_id, disposal_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_asset_disposals__asset_id IS '자산별 처분 이력 조회 인덱스';

CREATE INDEX ix_asset_disposals__disposal_date 
    ON fam.asset_disposals (disposal_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_asset_disposals__disposal_date IS '처분일자 조회 인덱스';

CREATE INDEX ix_asset_disposals__disposal_method 
    ON fam.asset_disposals (disposal_method, disposal_date)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_asset_disposals__disposal_method IS '처분 방법별 조회 인덱스';
