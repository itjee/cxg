-- =====================================================================================
-- 테이블: hrm.appointments
-- 설명: 인사 발령 이력 테이블 - 사원 인사 변경 이력 관리 (부서이동, 직급변경, 직책변경 등)
-- 작성일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS hrm.appointments 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이력 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 사원 정보
    employee_id             UUID                     NOT NULL,                               -- 사원 식별자
    
    -- 발령 정보
    appointment_type        VARCHAR(20)              NOT NULL,                               -- 발령 유형
    appointment_date        DATE                     NOT NULL,                               -- 발령일
    effective_date          DATE                     NOT NULL,                               -- 시행일
    appointment_reason      TEXT,                                                            -- 발령 사유
    
    -- 변경 전후 데이터 - 조직
    old_department_id       UUID,                                                            -- 변경 전 부서
    new_department_id       UUID,                                                            -- 변경 후 부서
    
    -- 변경 전후 데이터 - 직급/직책
    old_job_level           VARCHAR(20),                                                     -- 변경 전 직급
    new_job_level           VARCHAR(20),                                                     -- 변경 후 직급
    old_job_title           VARCHAR(100),                                                    -- 변경 전 직책
    new_job_title           VARCHAR(100),                                                    -- 변경 후 직책
    
    -- 변경 전후 데이터 - 근무
    old_work_location       VARCHAR(100),                                                    -- 변경 전 근무지
    new_work_location       VARCHAR(100),                                                    -- 변경 후 근무지
    old_work_type           VARCHAR(20),                                                     -- 변경 전 근무 형태
    new_work_type           VARCHAR(20),                                                     -- 변경 후 근무 형태
    old_employment_type     VARCHAR(20),                                                     -- 변경 전 고용 형태
    new_employment_type     VARCHAR(20),                                                     -- 변경 후 고용 형태
    
    -- 변경 전후 데이터 - 급여
    old_salary_type         VARCHAR(20),                                                     -- 변경 전 급여 유형
    new_salary_type         VARCHAR(20),                                                     -- 변경 후 급여 유형
    old_base_salary         NUMERIC(18,2),                                                   -- 변경 전 기본급
    new_base_salary         NUMERIC(18,2),                                                   -- 변경 후 기본급
    
    -- 변경 전후 데이터 - 상태
    old_status              VARCHAR(20),                                                     -- 변경 전 재직 상태
    new_status              VARCHAR(20),                                                     -- 변경 후 재직 상태
    
    -- 문서 정보
    document_no             VARCHAR(50),                                                     -- 발령 번호
    document_content        TEXT,                                                            -- 발령 문서 내용
    attachment_url          VARCHAR(500),                                                    -- 첨부 문서 URL
    
    -- 승인 정보
    approved_by             UUID,                                                            -- 승인자 UUID
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 발령 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 발령 유형 체크
    CONSTRAINT ck_appointments__type         CHECK (appointment_type IN ('HIRE', 'TRANSFER', 'PROMOTION', 'DEMOTION', 'POSITION_CHANGE', 'LOCATION_CHANGE', 'WORK_TYPE_CHANGE', 'EMPLOYMENT_TYPE_CHANGE', 'SALARY_CHANGE', 'LEAVE', 'RETURN', 'TERMINATE', 'RETIRE')),
    
    -- 발령 상태 체크
    CONSTRAINT ck_appointments__status       CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  hrm.appointments                         IS '인사 발령 이력 테이블 - 사원 인사 변경 이력 관리 (부서이동, 직급변경, 직책변경 등)';
COMMENT ON COLUMN hrm.appointments.id                      IS '이력 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.appointments.created_at              IS '등록 일시';
COMMENT ON COLUMN hrm.appointments.created_by              IS '등록자 UUID';
COMMENT ON COLUMN hrm.appointments.updated_at              IS '수정 일시';
COMMENT ON COLUMN hrm.appointments.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN hrm.appointments.employee_id             IS '사원 식별자';
COMMENT ON COLUMN hrm.appointments.appointment_type        IS '발령 유형 (HIRE: 입사, TRANSFER: 전보, PROMOTION: 승진, DEMOTION: 강등, POSITION_CHANGE: 직책변경, LOCATION_CHANGE: 근무지변경, WORK_TYPE_CHANGE: 근무형태변경, EMPLOYMENT_TYPE_CHANGE: 고용형태변경, SALARY_CHANGE: 급여변경, LEAVE: 휴직, RETURN: 복직, TERMINATE: 해고, RETIRE: 퇴직)';
COMMENT ON COLUMN hrm.appointments.appointment_date        IS '발령일';
COMMENT ON COLUMN hrm.appointments.effective_date          IS '시행일 (실제 적용일)';
COMMENT ON COLUMN hrm.appointments.appointment_reason      IS '발령 사유';
COMMENT ON COLUMN hrm.appointments.old_department_id       IS '변경 전 부서 식별자';
COMMENT ON COLUMN hrm.appointments.new_department_id       IS '변경 후 부서 식별자';
COMMENT ON COLUMN hrm.appointments.old_job_level           IS '변경 전 직급';
COMMENT ON COLUMN hrm.appointments.new_job_level           IS '변경 후 직급';
COMMENT ON COLUMN hrm.appointments.old_job_title           IS '변경 전 직책';
COMMENT ON COLUMN hrm.appointments.new_job_title           IS '변경 후 직책';
COMMENT ON COLUMN hrm.appointments.old_work_location       IS '변경 전 근무지';
COMMENT ON COLUMN hrm.appointments.new_work_location       IS '변경 후 근무지';
COMMENT ON COLUMN hrm.appointments.old_work_type           IS '변경 전 근무 형태';
COMMENT ON COLUMN hrm.appointments.new_work_type           IS '변경 후 근무 형태';
COMMENT ON COLUMN hrm.appointments.old_employment_type     IS '변경 전 고용 형태';
COMMENT ON COLUMN hrm.appointments.new_employment_type     IS '변경 후 고용 형태';
COMMENT ON COLUMN hrm.appointments.old_salary_type         IS '변경 전 급여 유형';
COMMENT ON COLUMN hrm.appointments.new_salary_type         IS '변경 후 급여 유형';
COMMENT ON COLUMN hrm.appointments.old_base_salary         IS '변경 전 기본급';
COMMENT ON COLUMN hrm.appointments.new_base_salary         IS '변경 후 기본급';
COMMENT ON COLUMN hrm.appointments.old_status              IS '변경 전 재직 상태';
COMMENT ON COLUMN hrm.appointments.new_status              IS '변경 후 재직 상태';
COMMENT ON COLUMN hrm.appointments.document_no             IS '발령 번호';
COMMENT ON COLUMN hrm.appointments.document_content        IS '발령 문서 내용';
COMMENT ON COLUMN hrm.appointments.attachment_url          IS '첨부 문서 URL';
COMMENT ON COLUMN hrm.appointments.approved_by             IS '승인자 UUID';
COMMENT ON COLUMN hrm.appointments.approved_at             IS '승인 일시';
COMMENT ON COLUMN hrm.appointments.status                  IS '발령 상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)';
COMMENT ON COLUMN hrm.appointments.is_deleted              IS '논리 삭제 플래그';

-- 일반 인덱스
CREATE INDEX ix_appointments__employee_id 
    ON hrm.appointments (employee_id)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_appointments__employee_id IS '사원별 이력 조회 인덱스';

CREATE INDEX ix_appointments__appointment_date 
    ON hrm.appointments (appointment_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_appointments__appointment_date IS '발령일 조회 인덱스 (최신순)';

CREATE INDEX ix_appointments__effective_date 
    ON hrm.appointments (effective_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_appointments__effective_date IS '시행일 조회 인덱스 (최신순)';

CREATE INDEX ix_appointments__appointment_type 
    ON hrm.appointments (appointment_type)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_appointments__appointment_type IS '발령 유형별 조회 인덱스';

CREATE INDEX ix_appointments__status 
    ON hrm.appointments (status)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_appointments__status IS '발령 상태별 조회 인덱스';

CREATE INDEX ix_appointments__document_no 
    ON hrm.appointments (document_no)
 WHERE document_no IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_appointments__document_no IS '발령 번호별 조회 인덱스';

CREATE INDEX ix_appointments__old_department_id 
    ON hrm.appointments (old_department_id)
 WHERE old_department_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_appointments__old_department_id IS '이전 부서별 조회 인덱스';

CREATE INDEX ix_appointments__new_department_id 
    ON hrm.appointments (new_department_id)
 WHERE new_department_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_appointments__new_department_id IS '신규 부서별 조회 인덱스';

-- 외래키 제약조건
-- 사원 참조
ALTER TABLE hrm.appointments 
  ADD CONSTRAINT fk_appointments__employee_id
    FOREIGN KEY (employee_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_appointments__employee_id ON hrm.appointments IS '사원 참조 외래키 (CASCADE 삭제)';

-- 변경 전 부서 참조
ALTER TABLE hrm.appointments 
  ADD CONSTRAINT fk_appointments__old_department_id
    FOREIGN KEY (old_department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_appointments__old_department_id ON hrm.appointments IS '변경 전 부서 참조 외래키 (SET NULL 삭제)';

-- 변경 후 부서 참조
ALTER TABLE hrm.appointments 
  ADD CONSTRAINT fk_appointments__new_department_id
    FOREIGN KEY (new_department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_appointments__new_department_id ON hrm.appointments IS '변경 후 부서 참조 외래키 (SET NULL 삭제)';
