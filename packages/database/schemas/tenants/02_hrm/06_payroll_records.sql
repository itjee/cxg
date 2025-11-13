CREATE TABLE IF NOT EXISTS hrm.payroll_records 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 급여 내역 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 급여 기본 정보
    payroll_no              VARCHAR(50)              NOT NULL,                               -- 급여 번호
    payroll_date            DATE                     NOT NULL,                               -- 급여 지급일
    payment_month           VARCHAR(7)               NOT NULL,                               -- 귀속월 (YYYY-MM)
    
    -- 사원 정보
    employee_id             UUID                     NOT NULL,                               -- 사원 ID
    employee_code           VARCHAR(50),                                                     -- 사원 코드 (스냅샷)
    employee_name           VARCHAR(100),                                                    -- 사원명 (스냅샷)
    department_id           UUID,                                                            -- 부서 ID
    position_id             UUID,                                                            -- 직위 ID
    
    -- 근무 정보
    work_days               INTEGER                  NOT NULL DEFAULT 0,                     -- 근무 일수
    work_hours              NUMERIC(10,2)            NOT NULL DEFAULT 0,                     -- 근무 시간
    overtime_hours          NUMERIC(10,2)            NOT NULL DEFAULT 0,                     -- 초과 근무 시간
    night_hours             NUMERIC(10,2)            NOT NULL DEFAULT 0,                     -- 야간 근무 시간
    holiday_hours           NUMERIC(10,2)            NOT NULL DEFAULT 0,                     -- 휴일 근무 시간
    
    -- 급여 항목
    base_pay                NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 기본급
    overtime_pay            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 초과근무수당
    night_pay               NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 야간근무수당
    holiday_pay             NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 휴일근무수당
    meal_allowance          NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 식대
    transport_allowance     NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 교통비
    position_allowance      NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 직책수당
    other_allowances        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 기타수당
    
    -- 합계
    total_allowances        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 총 수당
    gross_salary            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 총 급여 (지급액)
    
    -- 공제 항목
    income_tax              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 소득세
    resident_tax            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 주민세
    national_pension        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 국민연금
    health_insurance        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 건강보험
    long_term_care          NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 장기요양보험
    employment_insurance    NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 고용보험
    other_deductions        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 기타공제
    
    -- 합계
    total_deductions        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 총 공제액
    net_salary              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 실 지급액
    
    -- 지급 정보
    payment_method          VARCHAR(20),                                                     -- 지급 방법
    bank_name               VARCHAR(100),                                                    -- 은행명
    account_number          VARCHAR(100),                                                    -- 계좌번호
    payment_status          VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 지급 상태
    paid_at                 TIMESTAMP WITH TIME ZONE,                                        -- 지급 일시
    
    -- 분개 연결
    journal_entry_id        UUID,                                                            -- 분개 ID
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부
    
    -- 제약조건: 지급 상태
    CONSTRAINT ck_payroll_records__payment_status 
        CHECK (payment_status IN ('PENDING', 'APPROVED', 'PAID', 'CANCELLED')),
    
    -- 제약조건: 지급 방법
    CONSTRAINT ck_payroll_records__payment_method 
        CHECK (payment_method IS NULL OR payment_method IN ('BANK_TRANSFER', 'CASH', 'CHECK'))
);

-- ============================================================================
-- 인덱스
-- ============================================================================

-- 급여 번호 조회 (유니크)
CREATE UNIQUE INDEX ux_payroll_records__payroll_no 
    ON hrm.payroll_records (payroll_no)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ux_payroll_records__payroll_no IS '급여 번호 유니크 인덱스';

-- 사원별 조회
CREATE INDEX ix_payroll_records__employee_id 
    ON hrm.payroll_records (employee_id, payment_month DESC)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ix_payroll_records__employee_id IS '사원별 급여 내역 조회 인덱스';

-- 귀속월별 조회
CREATE INDEX ix_payroll_records__payment_month 
    ON hrm.payroll_records (payment_month DESC)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ix_payroll_records__payment_month IS '귀속월별 급여 조회 인덱스';

-- 지급일별 조회
CREATE INDEX ix_payroll_records__payroll_date 
    ON hrm.payroll_records (payroll_date DESC)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ix_payroll_records__payroll_date IS '지급일별 급여 조회 인덱스';

-- 지급 상태별 조회
CREATE INDEX ix_payroll_records__payment_status 
    ON hrm.payroll_records (payment_status, payroll_date)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ix_payroll_records__payment_status IS '지급 상태별 급여 조회 인덱스';

-- 부서별 조회
CREATE INDEX ix_payroll_records__department_id 
    ON hrm.payroll_records (department_id, payment_month)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;

COMMENT ON INDEX hrm.ix_payroll_records__department_id IS '부서별 급여 조회 인덱스';

-- ============================================================================
-- 외래키
-- ============================================================================

-- 사원
ALTER TABLE hrm.payroll_records 
  ADD CONSTRAINT fk_payroll_records__employee_id
    FOREIGN KEY (employee_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE RESTRICT;

COMMENT ON CONSTRAINT fk_payroll_records__employee_id 
    ON hrm.payroll_records IS '사원 외래키';

-- 부서
ALTER TABLE hrm.payroll_records 
  ADD CONSTRAINT fk_payroll_records__department_id
    FOREIGN KEY (department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;

COMMENT ON CONSTRAINT fk_payroll_records__department_id 
    ON hrm.payroll_records IS '부서 외래키';

-- 직위
-- ALTER TABLE hrm.payroll_records 
--   ADD CONSTRAINT fk_payroll_records__position_id
--     FOREIGN KEY (position_id) 
--     REFERENCES hrm.positions(id) 
--     ON DELETE SET NULL;

-- COMMENT ON CONSTRAINT fk_payroll_records__position_id 
--     ON hrm.payroll_records IS '직위 외래키';

-- 분개
-- ALTER TABLE hrm.payroll_records 
--   ADD CONSTRAINT fk_payroll_records__journal_entry_id
--     FOREIGN KEY (journal_entry_id) 
--     REFERENCES fim.journal_entries(id) 
--     ON DELETE SET NULL;

-- COMMENT ON CONSTRAINT fk_payroll_records__journal_entry_id 
--     ON hrm.payroll_records IS '분개 외래키';

-- ============================================================================
-- 테이블 및 컬럼 주석
-- ============================================================================

COMMENT ON TABLE hrm.payroll_records IS '급여 내역: 사원별 월별 급여 계산 및 지급 내역';

COMMENT ON COLUMN hrm.payroll_records.id IS '급여 내역 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.payroll_records.created_at IS '등록 일시';
COMMENT ON COLUMN hrm.payroll_records.created_by IS '등록자 UUID';
COMMENT ON COLUMN hrm.payroll_records.updated_at IS '수정 일시';
COMMENT ON COLUMN hrm.payroll_records.updated_by IS '수정자 UUID';

COMMENT ON COLUMN hrm.payroll_records.payroll_no IS '급여 번호 (자동 채번)';
COMMENT ON COLUMN hrm.payroll_records.payroll_date IS '급여 지급일';
COMMENT ON COLUMN hrm.payroll_records.payment_month IS '귀속월 (YYYY-MM)';

COMMENT ON COLUMN hrm.payroll_records.employee_id IS '사원 ID';
COMMENT ON COLUMN hrm.payroll_records.employee_code IS '사원 코드 (스냅샷)';
COMMENT ON COLUMN hrm.payroll_records.employee_name IS '사원명 (스냅샷)';
COMMENT ON COLUMN hrm.payroll_records.department_id IS '부서 ID';
COMMENT ON COLUMN hrm.payroll_records.position_id IS '직위 ID';

COMMENT ON COLUMN hrm.payroll_records.work_days IS '근무 일수';
COMMENT ON COLUMN hrm.payroll_records.work_hours IS '근무 시간';
COMMENT ON COLUMN hrm.payroll_records.overtime_hours IS '초과 근무 시간';
COMMENT ON COLUMN hrm.payroll_records.night_hours IS '야간 근무 시간';
COMMENT ON COLUMN hrm.payroll_records.holiday_hours IS '휴일 근무 시간';

COMMENT ON COLUMN hrm.payroll_records.base_pay IS '기본급';
COMMENT ON COLUMN hrm.payroll_records.overtime_pay IS '초과근무수당';
COMMENT ON COLUMN hrm.payroll_records.night_pay IS '야간근무수당';
COMMENT ON COLUMN hrm.payroll_records.holiday_pay IS '휴일근무수당';
COMMENT ON COLUMN hrm.payroll_records.meal_allowance IS '식대';
COMMENT ON COLUMN hrm.payroll_records.transport_allowance IS '교통비';
COMMENT ON COLUMN hrm.payroll_records.position_allowance IS '직책수당';
COMMENT ON COLUMN hrm.payroll_records.other_allowances IS '기타수당';

COMMENT ON COLUMN hrm.payroll_records.total_allowances IS '총 수당';
COMMENT ON COLUMN hrm.payroll_records.gross_salary IS '총 급여 (지급액)';

COMMENT ON COLUMN hrm.payroll_records.income_tax IS '소득세';
COMMENT ON COLUMN hrm.payroll_records.resident_tax IS '주민세';
COMMENT ON COLUMN hrm.payroll_records.national_pension IS '국민연금';
COMMENT ON COLUMN hrm.payroll_records.health_insurance IS '건강보험';
COMMENT ON COLUMN hrm.payroll_records.long_term_care IS '장기요양보험';
COMMENT ON COLUMN hrm.payroll_records.employment_insurance IS '고용보험';
COMMENT ON COLUMN hrm.payroll_records.other_deductions IS '기타공제';

COMMENT ON COLUMN hrm.payroll_records.total_deductions IS '총 공제액';
COMMENT ON COLUMN hrm.payroll_records.net_salary IS '실 지급액';

COMMENT ON COLUMN hrm.payroll_records.payment_method IS '지급 방법 (BANK_TRANSFER/CASH/CHECK)';
COMMENT ON COLUMN hrm.payroll_records.bank_name IS '은행명';
COMMENT ON COLUMN hrm.payroll_records.account_number IS '계좌번호';
COMMENT ON COLUMN hrm.payroll_records.payment_status IS '지급 상태 (PENDING/APPROVED/PAID/CANCELLED)';
COMMENT ON COLUMN hrm.payroll_records.paid_at IS '지급 일시';

COMMENT ON COLUMN hrm.payroll_records.journal_entry_id IS '분개 ID (연결)';

COMMENT ON COLUMN hrm.payroll_records.notes IS '비고';

COMMENT ON COLUMN hrm.payroll_records.is_deleted IS '삭제 여부';
