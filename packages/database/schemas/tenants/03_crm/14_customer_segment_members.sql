-- =====================================================================================
-- 테이블: crm.customer_segment_members
-- 설명: 고객 세그먼트 회원 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.customer_segment_members 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 회원 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 세그먼트 정보
    segment_id              UUID                     NOT NULL,                               -- 세그먼트 ID
    
    -- 회원 정보
    partner_id              UUID                     NOT NULL,                               -- 거래처 ID
    
    -- 할당 정보
    assigned_date           DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 할당일
    assigned_by             UUID,                                                            -- 할당자
    assignment_type         VARCHAR(20)              DEFAULT 'MANUAL',                       -- 할당 유형
    
    -- 상태
    is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 할당 유형 체크 (MANUAL: 수동, AUTO: 자동, IMPORT: 가져오기)
    CONSTRAINT ck_segment_members__assignment_type  CHECK (assignment_type IN ('MANUAL', 'AUTO', 'IMPORT'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.customer_segment_members               IS '고객 세그먼트 회원 관리 테이블';
COMMENT ON COLUMN crm.customer_segment_members.id            IS '회원 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.customer_segment_members.created_at    IS '등록 일시';
COMMENT ON COLUMN crm.customer_segment_members.created_by    IS '등록자 UUID';
COMMENT ON COLUMN crm.customer_segment_members.updated_at    IS '수정 일시';
COMMENT ON COLUMN crm.customer_segment_members.updated_by    IS '수정자 UUID';
COMMENT ON COLUMN crm.customer_segment_members.segment_id    IS '세그먼트 ID';
COMMENT ON COLUMN crm.customer_segment_members.partner_id    IS '거래처 ID';
COMMENT ON COLUMN crm.customer_segment_members.assigned_date IS '할당일';
COMMENT ON COLUMN crm.customer_segment_members.assigned_by   IS '할당자 UUID';
COMMENT ON COLUMN crm.customer_segment_members.assignment_type IS '할당 유형 (MANUAL: 수동, AUTO: 자동, IMPORT: 가져오기)';
COMMENT ON COLUMN crm.customer_segment_members.is_active     IS '활성 여부';
COMMENT ON COLUMN crm.customer_segment_members.notes         IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_segment_members__segment_partner 
    ON crm.customer_segment_members (segment_id, partner_id);
COMMENT ON INDEX crm.ux_segment_members__segment_partner IS '세그먼트별 거래처 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_segment_members__segment_id 
    ON crm.customer_segment_members (segment_id);
COMMENT ON INDEX crm.ix_segment_members__segment_id IS '세그먼트별 조회 인덱스';

CREATE INDEX ix_segment_members__partner_id 
    ON crm.customer_segment_members (partner_id);
COMMENT ON INDEX crm.ix_segment_members__partner_id IS '거래처별 조회 인덱스';

CREATE INDEX ix_segment_members__is_active 
    ON crm.customer_segment_members (is_active);
COMMENT ON INDEX crm.ix_segment_members__is_active IS '활성 여부별 조회 인덱스';

CREATE INDEX ix_segment_members__assignment_type 
    ON crm.customer_segment_members (assignment_type);
COMMENT ON INDEX crm.ix_segment_members__assignment_type IS '할당 유형별 조회 인덱스';

-- 외래키 제약조건
-- 세그먼트 참조 (CASCADE 삭제)
ALTER TABLE crm.customer_segment_members 
  ADD CONSTRAINT fk_segment_members__segment_id
    FOREIGN KEY (segment_id) 
    REFERENCES crm.customer_segments(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_segment_members__segment_id ON crm.customer_segment_members IS '세그먼트 참조 외래키 (CASCADE 삭제)';

-- 거래처 참조 (CASCADE 삭제)
ALTER TABLE crm.customer_segment_members 
  ADD CONSTRAINT fk_segment_members__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_segment_members__partner_id ON crm.customer_segment_members IS '거래처 참조 외래키 (CASCADE 삭제)';

-- 할당자 참조 (SET NULL 삭제)
ALTER TABLE crm.customer_segment_members 
  ADD CONSTRAINT fk_segment_members__assigned_by
    FOREIGN KEY (assigned_by) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_segment_members__assigned_by ON crm.customer_segment_members IS '할당자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.customer_segment_members 테이블 정의
-- =====================================================================================
