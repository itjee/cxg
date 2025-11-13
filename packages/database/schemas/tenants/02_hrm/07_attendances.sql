CREATE TABLE IF NOT EXISTS hrm.attendances 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 근태 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 사원 정보
    employee_id             UUID                     NOT NULL,                               -- 사원 ID
    
    -- 근태 정보
    attendance_date         DATE                     NOT NULL,                               -- 근태 일자
    attendance_type         VARCHAR(20)              NOT NULL DEFAULT 'WORK',                -- 근태 유형
    
    -- 출퇴근 시간
    check_in_time           TIMESTAMP WITH TIME ZONE,                                        -- 출근 시간
    check_out_time          TIMESTAMP WITH TIME ZONE,                                        -- 퇴근 시간
    
    -- 계산된 시간
    work_hours              NUMERIC(10,2)            DEFAULT 0,                              -- 근무 시간
    overtime_hours          NUMERIC(10,2)            DEFAULT 0,                              -- 초과 근무 시간
    night_hours             NUMERIC(10,2)            DEFAULT 0,                              -- 야간 근무 시간
    
    -- 지각/조퇴
    late_minutes            INTEGER                  DEFAULT 0,                              -- 지각 시간 (분)
    early_leave_minutes     INTEGER                  DEFAULT 0,                              -- 조퇴 시간 (분)
    
    -- 휴게 시간
    break_minutes           INTEGER                  DEFAULT 0,                              -- 휴게 시간 (분)
    
    -- 상태
    status                  VARCHAR(20)              NOT NULL DEFAULT 'NORMAL',              -- 상태
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 삭제 관리
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부
    
    -- 제약조건: 근태 유형
    CONSTRAINT ck_attendances__attendance_type 
        CHECK (attendance_type IN ('WORK', 'LEAVE', 'HOLIDAY', 'SICK_LEAVE', 'VACATION', 'BUSINESS_TRIP', 'ABSENT')),
    
    -- 제약조건: 상태
    CONSTRAINT ck_attendances__status 
        CHECK (status IN ('NORMAL', 'LATE', 'EARLY_LEAVE', 'ABSENT', 'APPROVED')),
    
    -- 제약조건: 출퇴근 시간
    CONSTRAINT ck_attendances__check_times 
        CHECK (check_out_time IS NULL OR check_out_time > check_in_time)
);

-- ============================================================================
-- 인덱스
-- ============================================================================

-- 사원별 일자 조회 (유니크)
CREATE UNIQUE INDEX ux_attendances__employee_date 
    ON hrm.attendances (employee_id, attendance_date)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ux_attendances__employee_date IS '사원별 일자 유니크 인덱스';

-- 일자별 조회
CREATE INDEX ix_attendances__attendance_date 
    ON hrm.attendances (attendance_date DESC)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ix_attendances__attendance_date IS '일자별 근태 조회 인덱스';

-- 근태 유형별 조회
CREATE INDEX ix_attendances__attendance_type 
    ON hrm.attendances (attendance_type, attendance_date)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ix_attendances__attendance_type IS '근태 유형별 조회 인덱스';

-- 상태별 조회
CREATE INDEX ix_attendances__status 
    ON hrm.attendances (status, attendance_date)
 WHERE is_deleted = false;

COMMENT ON INDEX hrm.ix_attendances__status IS '상태별 근태 조회 인덱스';

-- ============================================================================
-- 외래키
-- ============================================================================

-- 사원
ALTER TABLE hrm.attendances 
  ADD CONSTRAINT fk_attendances__employee_id
    FOREIGN KEY (employee_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE CASCADE;

COMMENT ON CONSTRAINT fk_attendances__employee_id 
    ON hrm.attendances IS '사원 외래키';

-- ============================================================================
-- 테이블 및 컬럼 주석
-- ============================================================================

COMMENT ON TABLE hrm.attendances IS '근태: 사원별 출퇴근 및 근무 시간 관리';

COMMENT ON COLUMN hrm.attendances.id IS '근태 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.attendances.created_at IS '등록 일시';
COMMENT ON COLUMN hrm.attendances.created_by IS '등록자 UUID';
COMMENT ON COLUMN hrm.attendances.updated_at IS '수정 일시';
COMMENT ON COLUMN hrm.attendances.updated_by IS '수정자 UUID';

COMMENT ON COLUMN hrm.attendances.employee_id IS '사원 ID';

COMMENT ON COLUMN hrm.attendances.attendance_date IS '근태 일자';
COMMENT ON COLUMN hrm.attendances.attendance_type IS '근태 유형 (WORK/LEAVE/HOLIDAY/SICK_LEAVE/VACATION/BUSINESS_TRIP/ABSENT)';

COMMENT ON COLUMN hrm.attendances.check_in_time IS '출근 시간';
COMMENT ON COLUMN hrm.attendances.check_out_time IS '퇴근 시간';

COMMENT ON COLUMN hrm.attendances.work_hours IS '근무 시간';
COMMENT ON COLUMN hrm.attendances.overtime_hours IS '초과 근무 시간';
COMMENT ON COLUMN hrm.attendances.night_hours IS '야간 근무 시간';

COMMENT ON COLUMN hrm.attendances.late_minutes IS '지각 시간 (분)';
COMMENT ON COLUMN hrm.attendances.early_leave_minutes IS '조퇴 시간 (분)';

COMMENT ON COLUMN hrm.attendances.break_minutes IS '휴게 시간 (분)';

COMMENT ON COLUMN hrm.attendances.status IS '상태 (NORMAL/LATE/EARLY_LEAVE/ABSENT/APPROVED)';

COMMENT ON COLUMN hrm.attendances.notes IS '비고';

COMMENT ON COLUMN hrm.attendances.is_deleted IS '삭제 여부';
