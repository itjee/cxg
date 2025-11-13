-- ============================================================================
-- Human Resources Management Schema (hrm)
-- ============================================================================
-- Description: 인사 관리 (조직, 사원, 직위, 급여, 근태)
-- Database: tnnt_db (Tenant Database)
-- Schema: hrm
-- Created: 2025-01-20
-- Modified: 2025-01-22 - 표준 형식 적용
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS hrm;

COMMENT ON SCHEMA hrm IS 'HRM: 인사관리 스키마 (조직, 사원, 직위, 급여, 근태)';

-- ============================================================================
-- HRM: 인사 관리 (Human Resources Management)
-- ============================================================================

-- =====================================================================================
-- 테이블: hrm.departments
-- 설명: 조직/부서 정보 관리 테이블 - 회사 조직도 및 부서 계층 구조 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS hrm.departments 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 부서 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 부서 기본 정보
    code                    VARCHAR(50)              NOT NULL,                               -- 부서 코드 (영대문자, 숫자, 언더스코어)
    name                    VARCHAR(100)             NOT NULL,                               -- 부서명
    name_en                 VARCHAR(100),                                                    -- 부서명 (영문) (추가 - 다국어 지원)
    description             TEXT,                                                            -- 부서 설명 (추가)
    
    -- 계층 구조
    parent_id               UUID,                                                            -- 상위 부서 식별자
    level                   INTEGER                  DEFAULT 1,                              -- 부서 레벨 (추가 - 1: 회사, 2: 본부, 3: 부서, 4: 팀)
    dept_type               VARCHAR(20)              NOT NULL DEFAULT 'DEPARTMENT',          -- 부서 유형
    
    -- 부서 관리
    manager_id              UUID,                                                            -- 부서장 식별자
    cost_center_code        VARCHAR(50),                                                     -- 원가센터 코드 (추가 - 회계 연계)
    
    -- 연락처 정보
    phone                   VARCHAR(50),                                                     -- 부서 전화번호
    email                   VARCHAR(255),                                                    -- 부서 이메일
    fax                     VARCHAR(50),                                                     -- 팩스번호 (추가)
    
    -- 위치 정보 (추가)
    location                VARCHAR(200),                                                    -- 근무지/사무실 위치 (추가)
    floor                   VARCHAR(20),                                                     -- 층 정보 (추가)
    
    -- 정렬
    sort_order              INTEGER                  DEFAULT 0,                              -- 정렬 순서
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 부서 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 부서 코드 형식 체크 (영대문자, 숫자, 언더스코어 2-50자)
    CONSTRAINT ck_departments__code                 CHECK (code ~ '^[A-Z0-9_]{2,50}$'),
    
    -- 부서 유형 체크
    CONSTRAINT ck_departments__dept_type            CHECK (dept_type IN ('COMPANY', 'DIVISION', 'DEPARTMENT', 'TEAM')),
    
    -- 이메일 형식 체크
    CONSTRAINT ck_departments__email                CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 전화번호 형식 체크
    CONSTRAINT ck_departments__phone                CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 정렬순서 양수 체크
    CONSTRAINT ck_departments__sort_order           CHECK (sort_order >= 0),
    
    -- 레벨 체크 (1 이상)
    CONSTRAINT ck_departments__level                CHECK (level >= 1),
    
    -- 상태 체크
    CONSTRAINT ck_departments__status               CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  hrm.departments                        IS '조직/부서 정보 관리 테이블 - 회사 조직도 및 부서 계층 구조 관리';
COMMENT ON COLUMN hrm.departments.id                     IS '부서 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.departments.created_at             IS '등록 일시';
COMMENT ON COLUMN hrm.departments.created_by             IS '등록자 UUID';
COMMENT ON COLUMN hrm.departments.updated_at             IS '수정 일시';
COMMENT ON COLUMN hrm.departments.updated_by             IS '수정자 UUID';
COMMENT ON COLUMN hrm.departments.code                   IS '부서 코드 (영대문자, 숫자, 언더스코어 2-50자)';
COMMENT ON COLUMN hrm.departments.name                   IS '부서명';
COMMENT ON COLUMN hrm.departments.name_en                IS '부서명 (영문, 다국어 지원)';
COMMENT ON COLUMN hrm.departments.description            IS '부서 설명';
COMMENT ON COLUMN hrm.departments.parent_id              IS '상위 부서 식별자 (계층구조)';
COMMENT ON COLUMN hrm.departments.level                  IS '부서 레벨 (1: 회사, 2: 본부, 3: 부서, 4: 팀)';
COMMENT ON COLUMN hrm.departments.dept_type              IS '부서 유형 (COMPANY: 회사, DIVISION: 본부, DEPARTMENT: 부서, TEAM: 팀)';
COMMENT ON COLUMN hrm.departments.manager_id             IS '부서장 식별자 (사원 참조)';
COMMENT ON COLUMN hrm.departments.cost_center_code       IS '원가센터 코드 (회계 연계용)';
COMMENT ON COLUMN hrm.departments.phone                  IS '부서 전화번호';
COMMENT ON COLUMN hrm.departments.email                  IS '부서 이메일';
COMMENT ON COLUMN hrm.departments.fax                    IS '팩스번호';
COMMENT ON COLUMN hrm.departments.location               IS '근무지/사무실 위치';
COMMENT ON COLUMN hrm.departments.floor                  IS '층 정보';
COMMENT ON COLUMN hrm.departments.sort_order             IS '정렬 순서';
COMMENT ON COLUMN hrm.departments.status                 IS '부서 상태 (ACTIVE: 활성, INACTIVE: 비활성, CLOSED: 폐쇄)';
COMMENT ON COLUMN hrm.departments.is_deleted             IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_departments__code 
    ON hrm.departments (code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_departments__code IS '부서 코드 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_departments__name 
    ON hrm.departments (name)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_departments__name IS '부서명 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_departments__parent_id 
    ON hrm.departments (parent_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_departments__parent_id IS '상위 부서별 조회 인덱스 (계층구조)';

CREATE INDEX ix_departments__manager_id 
    ON hrm.departments (manager_id)
 WHERE manager_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_departments__manager_id IS '부서장별 조회 인덱스';

CREATE INDEX ix_departments__dept_type 
    ON hrm.departments (dept_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_departments__dept_type IS '부서 유형별 조회 인덱스';

CREATE INDEX ix_departments__sort_order 
    ON hrm.departments (parent_id, sort_order)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_departments__sort_order IS '정렬 순서 인덱스';

CREATE INDEX ix_departments__status 
    ON hrm.departments (status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_departments__status IS '상태별 조회 인덱스';

CREATE INDEX ix_departments__level 
    ON hrm.departments (level)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_departments__level IS '부서 레벨별 조회 인덱스';

CREATE INDEX ix_departments__cost_center_code 
    ON hrm.departments (cost_center_code)
 WHERE cost_center_code IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_departments__cost_center_code IS '원가센터 코드별 조회 인덱스';

-- 외래키 제약조건
-- 상위 부서 참조 (자기 참조, CASCADE 삭제)
ALTER TABLE hrm.departments 
  ADD CONSTRAINT fk_departments__parent_id
    FOREIGN KEY (parent_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_departments__parent_id ON hrm.departments IS '상위 부서 참조 외래키 (자기 참조, CASCADE 삭제)';

-- 부서장 참조 (사원 참조, SET NULL 삭제)
ALTER TABLE hrm.departments 
  ADD CONSTRAINT fk_departments__manager_id
    FOREIGN KEY (manager_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_departments__manager_id ON hrm.departments IS '부서장 참조 외래키 (사원 참조, SET NULL 삭제)';

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
COMMENT ON INDEX ux_employees__code IS '사원번호 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_employees__email 
    ON hrm.employees (email)
 WHERE email IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ux_employees__email IS '이메일 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_employees__mobile 
    ON hrm.employees (mobile)
 WHERE mobile IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ux_employees__mobile IS '휴대폰 번호 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_employees__department_id 
    ON hrm.employees (department_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_employees__department_id IS '부서별 사원 조회 인덱스';

CREATE INDEX ix_employees__name 
    ON hrm.employees (name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_employees__name IS '사원명 조회 인덱스';

CREATE INDEX ix_employees__work_type 
    ON hrm.employees (work_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_employees__work_type IS '근무 형태별 조회 인덱스';

CREATE INDEX ix_employees__employment_type 
    ON hrm.employees (employment_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_employees__employment_type IS '고용 형태별 조회 인덱스';

CREATE INDEX ix_employees__work_location 
    ON hrm.employees (work_location)
 WHERE work_location IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_employees__work_location IS '근무지별 조회 인덱스';

CREATE INDEX ix_employees__job_level 
    ON hrm.employees (job_level)
 WHERE job_level IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_employees__job_level IS '직급별 조회 인덱스';

CREATE INDEX ix_employees__status 
    ON hrm.employees (status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_employees__status IS '재직 상태별 조회 인덱스';

CREATE INDEX ix_employees__hire_date 
    ON hrm.employees (hire_date)
 WHERE hire_date IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_employees__hire_date IS '입사일 조회 인덱스';

CREATE INDEX ix_employees__birth_date 
    ON hrm.employees (birth_date)
 WHERE birth_date IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_employees__birth_date IS '생년월일 조회 인덱스';

CREATE INDEX ix_employees__gender 
    ON hrm.employees (gender)
 WHERE gender IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_employees__gender IS '성별 조회 인덱스';

-- 외래키 제약조건
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

-- =====================================================================================
-- 테이블: hrm.department_histories
-- 설명: 조직 개편 이력 테이블 - 부서 변경 이력 관리 (부서명, 부서장, 조직개편 등)
-- 작성일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS hrm.department_histories 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이력 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 부서 정보
    department_id           UUID                     NOT NULL,                               -- 부서 식별자
    
    -- 변경 정보
    change_type             VARCHAR(20)              NOT NULL,                               -- 변경 유형
    change_date             DATE                     NOT NULL,                               -- 변경 발령일
    effective_date          DATE                     NOT NULL,                               -- 변경 시행일
    change_reason           TEXT,                                                            -- 변경 사유
    
    -- 변경 전후 데이터
    old_code                VARCHAR(50),                                                     -- 변경 전 부서 코드
    new_code                VARCHAR(50),                                                     -- 변경 후 부서 코드
    old_name                VARCHAR(100),                                                    -- 변경 전 부서명
    new_name                VARCHAR(100),                                                    -- 변경 후 부서명
    old_dept_type           VARCHAR(20),                                                     -- 변경 전 부서 유형
    new_dept_type           VARCHAR(20),                                                     -- 변경 후 부서 유형
    old_parent_id           UUID,                                                            -- 변경 전 상위 부서
    new_parent_id           UUID,                                                            -- 변경 후 상위 부서
    old_manager_id          UUID,                                                            -- 변경 전 부서장
    new_manager_id          UUID,                                                            -- 변경 후 부서장
    
    -- 문서 정보
    order_number            VARCHAR(50),                                                     -- 발령 번호 (추가)
    order_document          TEXT,                                                            -- 발령 문서 내용 (추가)
    attachment_url          VARCHAR(500),                                                    -- 첨부 문서 URL (추가)
    
    -- 승인 정보
    approved_by             UUID,                                                            -- 승인자 UUID (추가)
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시 (추가)
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 상태 (추가)
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 변경 유형 체크
    CONSTRAINT ck_dept_histories__change_type       CHECK (change_type IN ('RENAME', 'REORGANIZE', 'MANAGER_CHANGE', 'TYPE_CHANGE', 'PARENT_CHANGE', 'MERGE', 'SPLIT', 'CLOSE', 'REOPEN')),
    
    -- 상태 체크
    CONSTRAINT ck_dept_histories__status            CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  hrm.department_histories                       IS '조직 개편 이력 테이블 - 부서 변경 이력 관리 (부서명, 부서장, 조직개편 등)';
COMMENT ON COLUMN hrm.department_histories.id                    IS '이력 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.department_histories.created_at            IS '등록 일시';
COMMENT ON COLUMN hrm.department_histories.created_by            IS '등록자 UUID';
COMMENT ON COLUMN hrm.department_histories.updated_at            IS '수정 일시';
COMMENT ON COLUMN hrm.department_histories.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN hrm.department_histories.department_id         IS '부서 식별자';
COMMENT ON COLUMN hrm.department_histories.change_type           IS '변경 유형 (RENAME: 명칭변경, REORGANIZE: 조직개편, MANAGER_CHANGE: 부서장변경, TYPE_CHANGE: 유형변경, PARENT_CHANGE: 상위부서변경, MERGE: 통합, SPLIT: 분할, CLOSE: 폐쇄, REOPEN: 재개)';
COMMENT ON COLUMN hrm.department_histories.change_date           IS '변경 발령일';
COMMENT ON COLUMN hrm.department_histories.effective_date        IS '변경 시행일 (실제 적용일)';
COMMENT ON COLUMN hrm.department_histories.change_reason         IS '변경 사유';
COMMENT ON COLUMN hrm.department_histories.old_code              IS '변경 전 부서 코드';
COMMENT ON COLUMN hrm.department_histories.new_code              IS '변경 후 부서 코드';
COMMENT ON COLUMN hrm.department_histories.old_name              IS '변경 전 부서명';
COMMENT ON COLUMN hrm.department_histories.new_name              IS '변경 후 부서명';
COMMENT ON COLUMN hrm.department_histories.old_dept_type         IS '변경 전 부서 유형';
COMMENT ON COLUMN hrm.department_histories.new_dept_type         IS '변경 후 부서 유형';
COMMENT ON COLUMN hrm.department_histories.old_parent_id         IS '변경 전 상위 부서 식별자';
COMMENT ON COLUMN hrm.department_histories.new_parent_id         IS '변경 후 상위 부서 식별자';
COMMENT ON COLUMN hrm.department_histories.old_manager_id        IS '변경 전 부서장 식별자';
COMMENT ON COLUMN hrm.department_histories.new_manager_id        IS '변경 후 부서장 식별자';
COMMENT ON COLUMN hrm.department_histories.order_number          IS '발령 번호';
COMMENT ON COLUMN hrm.department_histories.order_document        IS '발령 문서 내용';
COMMENT ON COLUMN hrm.department_histories.attachment_url        IS '첨부 문서 URL';
COMMENT ON COLUMN hrm.department_histories.approved_by           IS '승인자 UUID';
COMMENT ON COLUMN hrm.department_histories.approved_at           IS '승인 일시';
COMMENT ON COLUMN hrm.department_histories.status                IS '상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)';
COMMENT ON COLUMN hrm.department_histories.is_deleted            IS '논리 삭제 플래그';

-- 일반 인덱스
CREATE INDEX ix_dept_histories__department_id 
    ON hrm.department_histories (department_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_dept_histories__department_id IS '부서별 이력 조회 인덱스';

CREATE INDEX ix_dept_histories__change_date 
    ON hrm.department_histories (change_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_dept_histories__change_date IS '변경 발령일 조회 인덱스 (최신순)';

CREATE INDEX ix_dept_histories__effective_date 
    ON hrm.department_histories (effective_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_dept_histories__effective_date IS '변경 시행일 조회 인덱스 (최신순)';

CREATE INDEX ix_dept_histories__change_type 
    ON hrm.department_histories (change_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_dept_histories__change_type IS '변경 유형별 조회 인덱스';

CREATE INDEX ix_dept_histories__status 
    ON hrm.department_histories (status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_dept_histories__status IS '상태별 조회 인덱스';

CREATE INDEX ix_dept_histories__order_number 
    ON hrm.department_histories (order_number)
 WHERE order_number IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_dept_histories__order_number IS '발령 번호별 조회 인덱스';

-- 외래키 제약조건
-- 부서 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__department_id
    FOREIGN KEY (department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_dept_histories__department_id ON hrm.department_histories IS '부서 참조 외래키 (CASCADE 삭제)';

-- 변경 전 상위 부서 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__old_parent_id
    FOREIGN KEY (old_parent_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_dept_histories__old_parent_id ON hrm.department_histories IS '변경 전 상위 부서 참조 외래키 (SET NULL 삭제)';

-- 변경 후 상위 부서 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__new_parent_id
    FOREIGN KEY (new_parent_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_dept_histories__new_parent_id ON hrm.department_histories IS '변경 후 상위 부서 참조 외래키 (SET NULL 삭제)';

-- 변경 전 부서장 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__old_manager_id
    FOREIGN KEY (old_manager_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_dept_histories__old_manager_id ON hrm.department_histories IS '변경 전 부서장 참조 외래키 (SET NULL 삭제)';

-- 변경 후 부서장 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__new_manager_id
    FOREIGN KEY (new_manager_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_dept_histories__new_manager_id ON hrm.department_histories IS '변경 후 부서장 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 테이블: hrm.employee_histories
-- 설명: 인사 발령 이력 테이블 - 사원 인사 변경 이력 관리 (부서이동, 직급변경, 직책변경 등)
-- 작성일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS hrm.employee_histories 
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
    order_type              VARCHAR(20)              NOT NULL,                               -- 발령 유형
    order_date              DATE                     NOT NULL,                               -- 발령일
    effective_date          DATE                     NOT NULL,                               -- 시행일
    order_reason            TEXT,                                                            -- 발령 사유
    
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
    order_number            VARCHAR(50),                                                     -- 발령 번호
    order_document          TEXT,                                                            -- 발령 문서 내용
    attachment_url          VARCHAR(500),                                                    -- 첨부 문서 URL
    
    -- 승인 정보
    approved_by             UUID,                                                            -- 승인자 UUID
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 발령 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 발령 유형 체크
    CONSTRAINT ck_emp_histories__order_type         CHECK (order_type IN ('HIRE', 'TRANSFER', 'PROMOTION', 'DEMOTION', 'POSITION_CHANGE', 'LOCATION_CHANGE', 'WORK_TYPE_CHANGE', 'EMPLOYMENT_TYPE_CHANGE', 'SALARY_CHANGE', 'LEAVE', 'RETURN', 'TERMINATE', 'RETIRE')),
    
    -- 발령 상태 체크
    CONSTRAINT ck_emp_histories__status             CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  hrm.employee_histories                         IS '인사 발령 이력 테이블 - 사원 인사 변경 이력 관리 (부서이동, 직급변경, 직책변경 등)';
COMMENT ON COLUMN hrm.employee_histories.id                      IS '이력 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.employee_histories.created_at              IS '등록 일시';
COMMENT ON COLUMN hrm.employee_histories.created_by              IS '등록자 UUID';
COMMENT ON COLUMN hrm.employee_histories.updated_at              IS '수정 일시';
COMMENT ON COLUMN hrm.employee_histories.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN hrm.employee_histories.employee_id             IS '사원 식별자';
COMMENT ON COLUMN hrm.employee_histories.order_type              IS '발령 유형 (HIRE: 입사, TRANSFER: 전보, PROMOTION: 승진, DEMOTION: 강등, POSITION_CHANGE: 직책변경, LOCATION_CHANGE: 근무지변경, WORK_TYPE_CHANGE: 근무형태변경, EMPLOYMENT_TYPE_CHANGE: 고용형태변경, SALARY_CHANGE: 급여변경, LEAVE: 휴직, RETURN: 복직, TERMINATE: 해고, RETIRE: 퇴직)';
COMMENT ON COLUMN hrm.employee_histories.order_date              IS '발령일';
COMMENT ON COLUMN hrm.employee_histories.effective_date          IS '시행일 (실제 적용일)';
COMMENT ON COLUMN hrm.employee_histories.order_reason            IS '발령 사유';
COMMENT ON COLUMN hrm.employee_histories.old_department_id       IS '변경 전 부서 식별자';
COMMENT ON COLUMN hrm.employee_histories.new_department_id       IS '변경 후 부서 식별자';
COMMENT ON COLUMN hrm.employee_histories.old_job_level           IS '변경 전 직급';
COMMENT ON COLUMN hrm.employee_histories.new_job_level           IS '변경 후 직급';
COMMENT ON COLUMN hrm.employee_histories.old_job_title           IS '변경 전 직책';
COMMENT ON COLUMN hrm.employee_histories.new_job_title           IS '변경 후 직책';
COMMENT ON COLUMN hrm.employee_histories.old_work_location       IS '변경 전 근무지';
COMMENT ON COLUMN hrm.employee_histories.new_work_location       IS '변경 후 근무지';
COMMENT ON COLUMN hrm.employee_histories.old_work_type           IS '변경 전 근무 형태';
COMMENT ON COLUMN hrm.employee_histories.new_work_type           IS '변경 후 근무 형태';
COMMENT ON COLUMN hrm.employee_histories.old_employment_type     IS '변경 전 고용 형태';
COMMENT ON COLUMN hrm.employee_histories.new_employment_type     IS '변경 후 고용 형태';
COMMENT ON COLUMN hrm.employee_histories.old_salary_type         IS '변경 전 급여 유형';
COMMENT ON COLUMN hrm.employee_histories.new_salary_type         IS '변경 후 급여 유형';
COMMENT ON COLUMN hrm.employee_histories.old_base_salary         IS '변경 전 기본급';
COMMENT ON COLUMN hrm.employee_histories.new_base_salary         IS '변경 후 기본급';
COMMENT ON COLUMN hrm.employee_histories.old_status              IS '변경 전 재직 상태';
COMMENT ON COLUMN hrm.employee_histories.new_status              IS '변경 후 재직 상태';
COMMENT ON COLUMN hrm.employee_histories.order_number            IS '발령 번호';
COMMENT ON COLUMN hrm.employee_histories.order_document          IS '발령 문서 내용';
COMMENT ON COLUMN hrm.employee_histories.attachment_url          IS '첨부 문서 URL';
COMMENT ON COLUMN hrm.employee_histories.approved_by             IS '승인자 UUID';
COMMENT ON COLUMN hrm.employee_histories.approved_at             IS '승인 일시';
COMMENT ON COLUMN hrm.employee_histories.status                  IS '발령 상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)';
COMMENT ON COLUMN hrm.employee_histories.is_deleted              IS '논리 삭제 플래그';

-- 일반 인덱스
CREATE INDEX ix_emp_histories__employee_id 
    ON hrm.employee_histories (employee_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_emp_histories__employee_id IS '사원별 이력 조회 인덱스';

CREATE INDEX ix_emp_histories__order_date 
    ON hrm.employee_histories (order_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_emp_histories__order_date IS '발령일 조회 인덱스 (최신순)';

CREATE INDEX ix_emp_histories__effective_date 
    ON hrm.employee_histories (effective_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_emp_histories__effective_date IS '시행일 조회 인덱스 (최신순)';

CREATE INDEX ix_emp_histories__order_type 
    ON hrm.employee_histories (order_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_emp_histories__order_type IS '발령 유형별 조회 인덱스';

CREATE INDEX ix_emp_histories__status 
    ON hrm.employee_histories (status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_emp_histories__status IS '발령 상태별 조회 인덱스';

CREATE INDEX ix_emp_histories__order_number 
    ON hrm.employee_histories (order_number)
 WHERE order_number IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_emp_histories__order_number IS '발령 번호별 조회 인덱스';

CREATE INDEX ix_emp_histories__old_department_id 
    ON hrm.employee_histories (old_department_id)
 WHERE old_department_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_emp_histories__old_department_id IS '이전 부서별 조회 인덱스';

CREATE INDEX ix_emp_histories__new_department_id 
    ON hrm.employee_histories (new_department_id)
 WHERE new_department_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_emp_histories__new_department_id IS '신규 부서별 조회 인덱스';

-- 외래키 제약조건
-- 사원 참조
ALTER TABLE hrm.employee_histories 
  ADD CONSTRAINT fk_emp_histories__employee_id
    FOREIGN KEY (employee_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_emp_histories__employee_id ON hrm.employee_histories IS '사원 참조 외래키 (CASCADE 삭제)';

-- 변경 전 부서 참조
ALTER TABLE hrm.employee_histories 
  ADD CONSTRAINT fk_emp_histories__old_department_id
    FOREIGN KEY (old_department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_emp_histories__old_department_id ON hrm.employee_histories IS '변경 전 부서 참조 외래키 (SET NULL 삭제)';

-- 변경 후 부서 참조
ALTER TABLE hrm.employee_histories 
  ADD CONSTRAINT fk_emp_histories__new_department_id
    FOREIGN KEY (new_department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_emp_histories__new_department_id ON hrm.employee_histories IS '변경 후 부서 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: hrm 스키마의 모든 테이블 정의
-- =====================================================================================
