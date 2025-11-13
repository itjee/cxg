CREATE TABLE IF NOT EXISTS hrm.payroll_structures 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 급여 구조 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 급여 구조 기본 정보
    code                    VARCHAR(50)              NOT NULL,                               -- 급여 구조 코드
    name                    VARCHAR(200)             NOT NULL,                               -- 급여 구조명
    description             TEXT,                                                            -- 설명
    
    -- 적용 대상
    position_id             UUID,                                                            -- 직위 (선택)
    department_id           UUID,                                                            -- 부서 (선택)
    employment_type         VARCHAR(20),                                                     -- 고용 형태
    
    -- 급여 기본 정보
    base_pay                NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 기본급
    currency_code           VARCHAR(3)               NOT NULL DEFAULT 'KRW',                 -- 통화
    payment_cycle           VARCHAR(20)              NOT NULL DEFAULT 'MONTHLY',             -- 지급 주기
    
    -- 유효 기간
    valid_from              DATE                     NOT NULL,                               -- 시작일
    valid_to                DATE,                                                            -- 종료일
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부
    
    -- 제약조건: 고용 형태
    CONSTRAINT ck_payroll_structures__employment_type 
        CHECK (employment_type IS NULL OR employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
    
    -- 제약조건: 지급 주기
    CONSTRAINT ck_payroll_structures__payment_cycle 
        CHECK (payment_cycle IN ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'ANNUAL')),
    
    -- 제약조건: 기본급 양수
    CONSTRAINT ck_payroll_structures__base_pay CHECK (base_pay >= 0),
    
    -- 제약조건: 유효기간
    CONSTRAINT ck_payroll_structures__effective_dates 
        CHECK (valid_to IS NULL OR valid_to >= valid_from)
);

-- ============================================================================
-- 인덱스
-- ============================================================================

-- 급여 구조 코드 조회 (유니크)
CREATE UNIQUE INDEX ux_payroll_structures__code 
    ON hrm.payroll_structures (code)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ux_payroll_structures__code IS '급여 구조 코드 유니크 인덱스';

-- 직위별 조회
CREATE INDEX ix_payroll_structures__position_id 
    ON hrm.payroll_structures (position_id, is_active)
 WHERE position_id IS NOT NULL
   AND is_deleted = false;

COMMENT ON INDEX hrm.ix_payroll_structures__position_id IS '직위별 급여 구조 조회 인덱스';

-- 부서별 조회
CREATE INDEX ix_payroll_structures__department_id 
    ON hrm.payroll_structures (department_id, is_active)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;

COMMENT ON INDEX hrm.ix_payroll_structures__department_id IS '부서별 급여 구조 조회 인덱스';

-- 유효기간 조회
CREATE INDEX ix_payroll_structures__effective_dates 
    ON hrm.payroll_structures (valid_from, valid_to)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ix_payroll_structures__effective_dates IS '유효기간 조회 인덱스';

-- ============================================================================
-- 외래키
-- ============================================================================

-- 직위
-- ALTER TABLE hrm.payroll_structures 
--   ADD CONSTRAINT fk_payroll_structures__position_id
--     FOREIGN KEY (position_id) 
--     REFERENCES hrm.positions(id) 
--     ON DELETE SET NULL;

-- COMMENT ON CONSTRAINT fk_payroll_structures__position_id 
--     ON hrm.payroll_structures IS '직위 외래키';

-- 부서
ALTER TABLE hrm.payroll_structures 
  ADD CONSTRAINT fk_payroll_structures__department_id
    FOREIGN KEY (department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;

COMMENT ON CONSTRAINT fk_payroll_structures__department_id 
    ON hrm.payroll_structures IS '부서 외래키';

-- 통화
ALTER TABLE hrm.payroll_structures 
  ADD CONSTRAINT fk_payroll_structures__currency_code
    FOREIGN KEY (currency_code) 
    REFERENCES adm.currencies(code) 
    ON DELETE RESTRICT;

COMMENT ON CONSTRAINT fk_payroll_structures__currency_code 
    ON hrm.payroll_structures IS '통화 외래키';

-- ============================================================================
-- 테이블 및 컬럼 주석
-- ============================================================================

COMMENT ON TABLE hrm.payroll_structures IS '급여 구조: 직위/부서별 급여 체계 정의';

COMMENT ON COLUMN hrm.payroll_structures.id IS '급여 구조 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.payroll_structures.created_at IS '등록 일시';
COMMENT ON COLUMN hrm.payroll_structures.created_by IS '등록자 UUID';
COMMENT ON COLUMN hrm.payroll_structures.updated_at IS '수정 일시';
COMMENT ON COLUMN hrm.payroll_structures.updated_by IS '수정자 UUID';

COMMENT ON COLUMN hrm.payroll_structures.code IS '급여 구조 코드';
COMMENT ON COLUMN hrm.payroll_structures.name IS '급여 구조명';
COMMENT ON COLUMN hrm.payroll_structures.description IS '설명';

COMMENT ON COLUMN hrm.payroll_structures.position_id IS '적용 직위 (선택)';
COMMENT ON COLUMN hrm.payroll_structures.department_id IS '적용 부서 (선택)';
COMMENT ON COLUMN hrm.payroll_structures.employment_type IS '고용 형태 (FULL_TIME/PART_TIME/CONTRACT/INTERN)';

COMMENT ON COLUMN hrm.payroll_structures.base_pay IS '기본급';
COMMENT ON COLUMN hrm.payroll_structures.currency_code IS '통화 코드';
COMMENT ON COLUMN hrm.payroll_structures.payment_cycle IS '지급 주기 (DAILY/WEEKLY/BIWEEKLY/MONTHLY/ANNUAL)';

COMMENT ON COLUMN hrm.payroll_structures.valid_from IS '유효 시작일';
COMMENT ON COLUMN hrm.payroll_structures.valid_to IS '유효 종료일';

COMMENT ON COLUMN hrm.payroll_structures.notes IS '비고';

COMMENT ON COLUMN hrm.payroll_structures.is_active IS '활성 여부';
COMMENT ON COLUMN hrm.payroll_structures.is_deleted IS '삭제 여부';
