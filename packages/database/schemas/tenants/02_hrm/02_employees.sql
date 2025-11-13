-- =====================================================================================
-- 테이블: hrm.employees
-- 설명: 사원 기본 정보 관리 테이블 - 임직원 인사정보 및 재직 이력 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS hrm.employees 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 사원 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 사원 기본 정보
    code                    VARCHAR(20)              NOT NULL,                               -- 사원번호 (영대문자, 숫자, 언더스코어)
    name                    VARCHAR(100)             NOT NULL,                               -- 사원명 (한글명)
    name_en                 VARCHAR(100),                                                    -- 사원명 (영문명) (추가 - 다국어 지원)
    name_cn                 VARCHAR(100),                                                    -- 사원명 (한자명) (추가 - 다국어 지원)
    
    -- 개인 정보 (추가)
    birth_date              DATE,                                                            -- 생년월일 (추가)
    gender                  VARCHAR(10),                                                     -- 성별 (추가 - MALE/FEMALE/OTHER)
    nationality             VARCHAR(3),                                                      -- 국적 (추가 - ISO 3166-1 alpha-3)
    id_number               VARCHAR(50),                                                     -- 주민등록번호/여권번호 (추가 - 암호화 필요)
    
    -- 연락처 정보
    phone                   VARCHAR(50),                                                     -- 전화번호
    mobile                  VARCHAR(50),                                                     -- 휴대폰 번호
    email                   VARCHAR(255),                                                    -- 이메일 주소
    emergency_contact       VARCHAR(50),                                                     -- 비상연락처 (추가)
    emergency_contact_name  VARCHAR(100),                                                    -- 비상연락처 이름 (추가)
    
    -- 주소 정보
    postcode                VARCHAR(10),                                                     -- 우편번호
    address1                VARCHAR(200),                                                    -- 기본 주소
    address2                VARCHAR(200),                                                    -- 상세 주소
    
    -- 시스템 사용자 정보
    user_id                 UUID,                                                            -- 시스템 사용자 ID (sys.users 참조, nullable)

    -- 조직/직무 정보
    department_id           UUID,                                                            -- 소속 부서 식별자
    job_title               VARCHAR(100),                                                    -- 직책/직위
    job_level               VARCHAR(20),                                                     -- 직급
    job_description         TEXT,                                                            -- 직무내용
    
    -- 근무 정보
    work_location           VARCHAR(100),                                                    -- 근무지
    work_type               VARCHAR(20)              NOT NULL DEFAULT 'OFFICE',              -- 근무 형태
    employment_type         VARCHAR(20)              DEFAULT 'REGULAR',                      -- 고용 형태 (추가 - REGULAR/CONTRACT/PART_TIME)
    
    -- 입퇴사 정보
    hire_date               DATE,                                                            -- 입사일
    probation_end_date      DATE,                                                            -- 수습 종료일 (추가)
    leave_date              DATE,                                                            -- 퇴사일
    leave_reason            TEXT,                                                            -- 퇴사 사유 (추가)
    
    -- 급여 정보 (추가)
    salary_type             VARCHAR(20),                                                     -- 급여 유형 (추가 - MONTHLY/HOURLY/ANNUAL)
    base_salary             NUMERIC(18,2),                                                   -- 기본급 (추가)
    currency_code           VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 코드 (추가)
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 재직 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 사원번호 형식 체크 (영대문자, 숫자, 언더스코어 2-20자)
    CONSTRAINT ck_employees__code                   CHECK (code ~ '^[A-Z0-9_]{2,20}$'),
    
    -- 성별 체크
    CONSTRAINT ck_employees__gender                 CHECK (gender IS NULL OR gender IN ('MALE', 'FEMALE', 'OTHER')),
    
    -- 근무 형태 체크
    CONSTRAINT ck_employees__work_type              CHECK (work_type IN ('OFFICE', 'REMOTE', 'HYBRID', 'FIELD')),
    
    -- 고용 형태 체크
    CONSTRAINT ck_employees__employment_type        CHECK (employment_type IN ('REGULAR', 'CONTRACT', 'PART_TIME', 'INTERN', 'TEMPORARY')),
    
    -- 재직 상태 체크
    CONSTRAINT ck_employees__status                 CHECK (status IN ('ACTIVE', 'PROBATION', 'LEAVE', 'TERMINATED', 'RETIRED')),
    
    -- 직급 체크
    CONSTRAINT ck_employees__job_level              CHECK (job_level IS NULL OR job_level IN ('STAFF', 'SENIOR', 'ASSISTANT_MANAGER', 'MANAGER', 'SENIOR_MANAGER', 'DIRECTOR', 'VP', 'CEO')),
    
    -- 전화번호 형식 체크
    CONSTRAINT ck_employees__phone                  CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 휴대폰 형식 체크
    CONSTRAINT ck_employees__mobile                 CHECK (mobile IS NULL OR mobile ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 이메일 형식 체크
    CONSTRAINT ck_employees__email                  CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 급여 유형 체크
    CONSTRAINT ck_employees__salary_type            CHECK (salary_type IS NULL OR salary_type IN ('MONTHLY', 'HOURLY', 'ANNUAL', 'DAILY')),
    
    -- 기본급 양수 체크
    CONSTRAINT ck_employees__base_salary            CHECK (base_salary IS NULL OR base_salary >= 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  hrm.employees                          IS '사원 기본 정보 관리 테이블 - 임직원 인사정보 및 재직 이력 관리';
COMMENT ON COLUMN hrm.employees.id                       IS '사원 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.employees.created_at               IS '등록 일시';
COMMENT ON COLUMN hrm.employees.created_by               IS '등록자 UUID';
COMMENT ON COLUMN hrm.employees.updated_at               IS '수정 일시';
COMMENT ON COLUMN hrm.employees.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN hrm.employees.code                     IS '사원번호 (영대문자, 숫자, 언더스코어 2-20자)';
COMMENT ON COLUMN hrm.employees.name                     IS '사원명 (한글명)';
COMMENT ON COLUMN hrm.employees.name_en                  IS '사원명 (영문명, 다국어 지원)';
COMMENT ON COLUMN hrm.employees.name_cn                  IS '사원명 (한자명, 다국어 지원)';
COMMENT ON COLUMN hrm.employees.birth_date               IS '생년월일';
COMMENT ON COLUMN hrm.employees.gender                   IS '성별 (MALE: 남성, FEMALE: 여성, OTHER: 기타)';
COMMENT ON COLUMN hrm.employees.nationality              IS '국적 (ISO 3166-1 alpha-3, 예: KOR, USA, CHN)';
COMMENT ON COLUMN hrm.employees.id_number                IS '주민등록번호/여권번호 (암호화 필요)';
COMMENT ON COLUMN hrm.employees.phone                    IS '전화번호';
COMMENT ON COLUMN hrm.employees.mobile                   IS '휴대폰 번호';
COMMENT ON COLUMN hrm.employees.email                    IS '이메일 주소';
COMMENT ON COLUMN hrm.employees.emergency_contact        IS '비상연락처';
COMMENT ON COLUMN hrm.employees.emergency_contact_name   IS '비상연락처 이름';
COMMENT ON COLUMN hrm.employees.postcode                 IS '우편번호';
COMMENT ON COLUMN hrm.employees.address1                 IS '기본 주소';
COMMENT ON COLUMN hrm.employees.address2                 IS '상세 주소';
COMMENT ON COLUMN hrm.employees.user_id                  IS '시스템 사용자 ID (sys.users 참조, nullable - 계약자/외부인력용)';
COMMENT ON COLUMN hrm.employees.department_id            IS '소속 부서 식별자';
COMMENT ON COLUMN hrm.employees.job_title                IS '직책/직위';
COMMENT ON COLUMN hrm.employees.job_level                IS '직급 (STAFF/SENIOR/ASSISTANT_MANAGER/MANAGER/SENIOR_MANAGER/DIRECTOR/VP/CEO)';
COMMENT ON COLUMN hrm.employees.job_description          IS '직무내용';
COMMENT ON COLUMN hrm.employees.work_location            IS '근무지';
COMMENT ON COLUMN hrm.employees.work_type                IS '근무 형태 (OFFICE: 사무실, REMOTE: 재택, HYBRID: 혼합, FIELD: 현장)';
COMMENT ON COLUMN hrm.employees.employment_type          IS '고용 형태 (REGULAR: 정규직, CONTRACT: 계약직, PART_TIME: 파트타임, INTERN: 인턴, TEMPORARY: 임시직)';
COMMENT ON COLUMN hrm.employees.hire_date                IS '입사일';
COMMENT ON COLUMN hrm.employees.probation_end_date       IS '수습 종료일';
COMMENT ON COLUMN hrm.employees.leave_date               IS '퇴사일';
COMMENT ON COLUMN hrm.employees.leave_reason             IS '퇴사 사유';
COMMENT ON COLUMN hrm.employees.salary_type              IS '급여 유형 (MONTHLY: 월급, HOURLY: 시급, ANNUAL: 연봉, DAILY: 일급)';
COMMENT ON COLUMN hrm.employees.base_salary              IS '기본급';
COMMENT ON COLUMN hrm.employees.currency_code            IS '통화 코드 (ISO 4217, 예: KRW, USD)';
COMMENT ON COLUMN hrm.employees.status                   IS '재직 상태 (ACTIVE: 재직, PROBATION: 수습, LEAVE: 휴직, TERMINATED: 해고, RETIRED: 퇴직)';
COMMENT ON COLUMN hrm.employees.is_deleted               IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_employees__code
    ON hrm.employees (code)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ux_employees__code IS '사원번호 유니크 제약 (삭제되지 않은 레코드만)';

-- user_id 유니크 인덱스 (한 사용자는 최대 1명의 직원)
CREATE UNIQUE INDEX ux_employees__user_id
    ON hrm.employees (user_id)
 WHERE user_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX hrm.ux_employees__user_id IS '사용자 ID 유니크 제약 (1:1 관계 강제, 삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_employees__email 
    ON hrm.employees (email)
 WHERE email IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ux_employees__email IS '이메일 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_employees__mobile 
    ON hrm.employees (mobile)
 WHERE mobile IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ux_employees__mobile IS '휴대폰 번호 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_employees__user_id
    ON hrm.employees (user_id)
 WHERE user_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__user_id IS '사용자 ID 기반 사원 조회 인덱스';

CREATE INDEX ix_employees__department_id
    ON hrm.employees (department_id)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__department_id IS '부서별 사원 조회 인덱스';

CREATE INDEX ix_employees__name 
    ON hrm.employees (name)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__name IS '사원명 조회 인덱스';

CREATE INDEX ix_employees__work_type 
    ON hrm.employees (work_type)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__work_type IS '근무 형태별 조회 인덱스';

CREATE INDEX ix_employees__employment_type 
    ON hrm.employees (employment_type)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__employment_type IS '고용 형태별 조회 인덱스';

CREATE INDEX ix_employees__work_location 
    ON hrm.employees (work_location)
 WHERE work_location IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__work_location IS '근무지별 조회 인덱스';

CREATE INDEX ix_employees__job_level 
    ON hrm.employees (job_level)
 WHERE job_level IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__job_level IS '직급별 조회 인덱스';

CREATE INDEX ix_employees__status 
    ON hrm.employees (status)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__status IS '재직 상태별 조회 인덱스';

CREATE INDEX ix_employees__hire_date 
    ON hrm.employees (hire_date)
 WHERE hire_date IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__hire_date IS '입사일 조회 인덱스';

CREATE INDEX ix_employees__birth_date 
    ON hrm.employees (birth_date)
 WHERE birth_date IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__birth_date IS '생년월일 조회 인덱스';

CREATE INDEX ix_employees__gender 
    ON hrm.employees (gender)
 WHERE gender IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__gender IS '성별 조회 인덱스';

-- 외래키 제약조건
-- 시스템 사용자 참조 (SET NULL 삭제)
ALTER TABLE hrm.employees
  ADD CONSTRAINT fk_employees__user_id
    FOREIGN KEY (user_id)
    REFERENCES sys.users(id)
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_employees__user_id ON hrm.employees IS '시스템 사용자 참조 외래키 (SET NULL 삭제, nullable - 계약자용)';

-- 소속 부서 참조 (SET NULL 삭제)
ALTER TABLE hrm.employees
  ADD CONSTRAINT fk_employees__department_id
    FOREIGN KEY (department_id)
    REFERENCES hrm.departments(id)
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_employees__department_id ON hrm.employees IS '소속 부서 참조 외래키 (SET NULL 삭제)';

-- 통화 코드 참조 (RESTRICT 삭제)
ALTER TABLE hrm.employees 
  ADD CONSTRAINT fk_employees__currency_code
    FOREIGN KEY (currency_code) 
    REFERENCES adm.currencies(code) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_employees__currency_code ON hrm.employees IS '통화 코드 참조 외래키 (RESTRICT 삭제)';
