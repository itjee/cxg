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
COMMENT ON INDEX hrm.ux_departments__code IS '부서 코드 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_departments__name 
    ON hrm.departments (name)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ux_departments__name IS '부서명 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_departments__parent_id 
    ON hrm.departments (parent_id)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_departments__parent_id IS '상위 부서별 조회 인덱스 (계층구조)';

CREATE INDEX ix_departments__manager_id 
    ON hrm.departments (manager_id)
 WHERE manager_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_departments__manager_id IS '부서장별 조회 인덱스';

CREATE INDEX ix_departments__dept_type 
    ON hrm.departments (dept_type)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_departments__dept_type IS '부서 유형별 조회 인덱스';

CREATE INDEX ix_departments__sort_order 
    ON hrm.departments (parent_id, sort_order)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_departments__sort_order IS '정렬 순서 인덱스';

CREATE INDEX ix_departments__status 
    ON hrm.departments (status)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_departments__status IS '상태별 조회 인덱스';

CREATE INDEX ix_departments__level 
    ON hrm.departments (level)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_departments__level IS '부서 레벨별 조회 인덱스';

CREATE INDEX ix_departments__cost_center_code 
    ON hrm.departments (cost_center_code)
 WHERE cost_center_code IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_departments__cost_center_code IS '원가센터 코드별 조회 인덱스';

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
