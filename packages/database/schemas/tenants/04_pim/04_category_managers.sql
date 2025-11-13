-- =====================================================================================
-- 테이블: pim.category_managers
-- 설명: 카테고리 담당자 이력 관리 테이블
-- 작성일: 2024-12-19
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.category_managers 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 담당자 이력 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 담당자 이력 기본 정보
    category_id             UUID                     NOT NULL,                               -- 카테고리 식별자
    employee_id             UUID                     NOT NULL,                               -- 담당자 식별자

    -- 담당 기간
    start_date              DATE                     NOT NULL,                               -- 담당 시작일
    end_date                DATE,                                                            -- 담당 종료일
    
    -- 담당자 역할 및 유형
    manager_type            VARCHAR(20)              DEFAULT 'PRIMARY',                      -- 담당자 유형
    description             TEXT,                                                            -- 담당 업무/역할
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 담당자 유형 체크 (PRIMARY: 주담당, SECONDARY: 부담당, SALES: 영업, TECHNICAL: 기술, PURCHASE: 구매, MARKETING: 마케팅, ANALYST: 분석)
    CONSTRAINT ck_category_managers__manager_type   CHECK (manager_type IN ('PRIMARY', 'SECONDARY', 'SALES', 'TECHNICAL', 'PURCHASE', 'MARKETING', 'ANALYST')),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료, TERMINATED: 해지)
    CONSTRAINT ck_category_managers__status         CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED', 'TERMINATED')),
    
    -- 날짜 범위 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_category_managers__date_range     CHECK (end_date IS NULL OR end_date >= start_date)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.category_managers                  IS '카테고리 담당자 이력 관리 테이블';
COMMENT ON COLUMN pim.category_managers.id              IS '담당자 이력 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.category_managers.created_at      IS '등록 일시';
COMMENT ON COLUMN pim.category_managers.created_by      IS '등록자 UUID';
COMMENT ON COLUMN pim.category_managers.updated_at      IS '수정 일시';
COMMENT ON COLUMN pim.category_managers.updated_by      IS '수정자 UUID';
COMMENT ON COLUMN pim.category_managers.category_id     IS '카테고리 식별자';
COMMENT ON COLUMN pim.category_managers.employee_id     IS '담당자 식별자';
COMMENT ON COLUMN pim.category_managers.start_date      IS '담당 시작일';
COMMENT ON COLUMN pim.category_managers.end_date        IS '담당 종료일';
COMMENT ON COLUMN pim.category_managers.manager_type    IS '담당자 유형 (PRIMARY/SECONDARY/SALES/TECHNICAL/PURCHASE/MARKETING/ANALYST)';
COMMENT ON COLUMN pim.category_managers.description     IS '담당 업무/역할';
COMMENT ON COLUMN pim.category_managers.notes           IS '비고';
COMMENT ON COLUMN pim.category_managers.status          IS '상태 (ACTIVE/INACTIVE/EXPIRED/TERMINATED)';
COMMENT ON COLUMN pim.category_managers.is_deleted    IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_category_managers__category_type_period
    ON pim.category_managers (category_id, manager_type, start_date, end_date)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_category_managers__category_type_period IS '카테고리별 담당자 유형 및 기간 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_category_managers__category_id
    ON pim.category_managers (category_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_category_managers__category_id IS '카테고리별 담당자 조회 인덱스';

CREATE INDEX ix_category_managers__employee_id
    ON pim.category_managers (employee_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_category_managers__employee_id IS '사원별 담당 카테고리 조회 인덱스';

CREATE INDEX ix_category_managers__date_range
    ON pim.category_managers (start_date, end_date)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_category_managers__date_range IS '담당 기간별 조회 인덱스';

CREATE INDEX ix_category_managers__manager_type
    ON pim.category_managers (manager_type, category_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_category_managers__manager_type IS '담당자 유형별 조회 인덱스';

CREATE INDEX ix_category_managers__employee_categories
    ON pim.category_managers (employee_id, start_date DESC, end_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_category_managers__employee_categories IS '사원별 담당 카테고리 목록 조회 인덱스';

CREATE INDEX ix_category_managers__category_history
    ON pim.category_managers (category_id, start_date DESC, end_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_category_managers__category_history IS '카테고리별 담당자 변경 이력 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 카테고리 참조 외래키 (카테고리 삭제 시 담당자 이력도 함께 삭제)
ALTER TABLE pim.category_managers
  ADD CONSTRAINT fk_category_managers__category_id
    FOREIGN KEY (category_id)     
    REFERENCES pim.categories(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_category_managers__category_id ON pim.category_managers IS '카테고리 참조 외래키 (CASCADE 삭제)';
