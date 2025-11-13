-- =====================================================================================
-- 테이블: wms.warehouses
-- 설명: 창고 기본 정보 관리 테이블
-- 작성일: 2025-10-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE IF NOT EXISTS wms.warehouses 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(), -- 창고 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by              UUID,                                                           -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by              UUID,                                                           -- 수정자 UUID
    
    -- 창고 기본 정보
    code                    VARCHAR(20)              NOT NULL,                              -- 창고 코드
    name                    VARCHAR(100)             NOT NULL,                              -- 창고명
    type                    VARCHAR(20)              NOT NULL,                              -- 창고 유형
    
    -- 창고 관리 정보
    manager_id              UUID,                                                           -- 창고 관리자 식별자
    is_primary              BOOLEAN                  DEFAULT false,                         -- 본창고 여부
    is_external             BOOLEAN                  DEFAULT false,                         -- 외부창고 여부 (3PL 등)
    
    -- 연락처 정보
    phone                   VARCHAR(50),                                                    -- 전화번호
    fax                     VARCHAR(50),                                                    -- 팩스번호
    email                   VARCHAR(255),                                                   -- 이메일
    
    -- 주소 정보
    postcode                VARCHAR(20),                                                    -- 우편번호
    address1                VARCHAR(200),                                                   -- 기본 주소
    address2                VARCHAR(200),                                                   -- 상세 주소
    building_name           VARCHAR(200),                                                   -- 건물명
    city                    VARCHAR(100),                                                   -- 도시
    state_province          VARCHAR(100),                                                   -- 주/도
    country_code            VARCHAR(3)               DEFAULT 'KOR',                         -- 국가 코드
    
    -- 창고 운영 정보
    operating_hours         VARCHAR(100),                                                   -- 운영 시간
    capacity_sqm            NUMERIC(12,2),                                                  -- 면적 (제곱미터)
    capacity_volume         NUMERIC(12,2),                                                  -- 용적 (세제곱미터)
    max_weight              NUMERIC(12,2),                                                  -- 최대 중량 (kg)
    
    -- 시설 정보
    has_dock                BOOLEAN                  DEFAULT false,                         -- 도크 보유 여부
    has_crane               BOOLEAN                  DEFAULT false,                         -- 크레인 보유 여부
    has_cold_storage        BOOLEAN                  DEFAULT false,                         -- 냉장 시설 여부
    has_freezer             BOOLEAN                  DEFAULT false,                         -- 냉동 시설 여부
    
    -- 비용 정보
    monthly_rent            NUMERIC(18,4),                                                  -- 월 임대료
    storage_cost            NUMERIC(18,4),                                                  -- 단위당 보관비
    currency                VARCHAR(3)               DEFAULT 'KRW',                         -- 통화
    
    -- 외부 창고 정보
    external_provider       VARCHAR(100),                                                   -- 외부 업체명 (3PL 등)
    contract_start_date     DATE,                                                           -- 계약 시작일
    contract_close_date     DATE,                                                           -- 계약 종료일
    
    -- 추가 정보
    description             TEXT,                                                           -- 창고 설명
    
    -- 상태 관리
    notes                   TEXT,                                                           -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그
    
    -- 창고 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 2-20자)
    CONSTRAINT ck_warehouses__code                      CHECK (code ~ '^[A-Z0-9_]{2,20}$'),
    
    -- 창고 유형 체크 (MAIN: 본창고, BRANCH: 지점, DISTRIBUTION: 물류센터, COLD_STORAGE: 냉장창고, FREEZER: 냉동창고, EXTERNAL: 외부창고, VIRTUAL: 가상창고, QUARANTINE: 격리창고, RETURN: 반품창고)
    CONSTRAINT ck_warehouses__type                      CHECK (type IN ('MAIN', 'BRANCH', 'DISTRIBUTION', 'COLD_STORAGE', 'FREEZER', 'EXTERNAL', 'VIRTUAL', 'QUARANTINE', 'RETURN')),
    
    -- 국가 코드 형식 체크 (ISO 3166-1 alpha-3, 3자리 영문 대문자)
    CONSTRAINT ck_warehouses__country_code              CHECK (country_code ~ '^[A-Z]{3}$'),
    
    -- 전화번호 형식 체크 (숫자, 하이픈, 플러스, 괄호, 공백 허용, 8-20자)
    CONSTRAINT ck_warehouses__phone                     CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 팩스번호 형식 체크 (숫자, 하이픈, 플러스, 괄호, 공백 허용, 8-20자)
    CONSTRAINT ck_warehouses__fax                       CHECK (fax IS NULL OR fax ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 이메일 형식 체크 (표준 이메일 형식)
    CONSTRAINT ck_warehouses__email                     CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_warehouses__currency                  CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 면적 양수 체크 (0보다 큼)
    CONSTRAINT ck_warehouses__capacity_sqm              CHECK (capacity_sqm IS NULL OR capacity_sqm > 0),
    
    -- 용적 양수 체크 (0보다 큼)
    CONSTRAINT ck_warehouses__capacity_volume           CHECK (capacity_volume IS NULL OR capacity_volume > 0),
    
    -- 중량 양수 체크 (0보다 큼)
    CONSTRAINT ck_warehouses__max_weight                CHECK (max_weight IS NULL OR max_weight > 0),
    
    -- 임대료 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouses__monthly_rent              CHECK (monthly_rent IS NULL OR monthly_rent >= 0),
    
    -- 보관비 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouses__storage_cost              CHECK (storage_cost IS NULL OR storage_cost >= 0),
    
    -- 계약기간 유효성 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_warehouses__contract_date             CHECK (contract_close_date IS NULL OR contract_start_date IS NULL OR contract_close_date >= contract_start_date),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, MAINTENANCE: 보수중, SUSPENDED: 일시중단, CLOSED: 폐쇄)
    CONSTRAINT ck_warehouses__status                    CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'SUSPENDED', 'CLOSED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  wms.warehouses                         IS '창고 마스터 정보 관리 테이블';
COMMENT ON COLUMN wms.warehouses.id                      IS '창고 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.warehouses.created_at              IS '등록 일시';
COMMENT ON COLUMN wms.warehouses.created_by              IS '등록자 UUID';
COMMENT ON COLUMN wms.warehouses.updated_at              IS '수정 일시';
COMMENT ON COLUMN wms.warehouses.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN wms.warehouses.code                    IS '창고 코드 (사내 규칙)';
COMMENT ON COLUMN wms.warehouses.name                    IS '창고명';
COMMENT ON COLUMN wms.warehouses.type                    IS '창고 유형 (MAIN/BRANCH/DISTRIBUTION/COLD_STORAGE/FREEZER/EXTERNAL/VIRTUAL/QUARANTINE/RETURN)';
COMMENT ON COLUMN wms.warehouses.manager_id              IS '창고 관리자 식별자';
COMMENT ON COLUMN wms.warehouses.is_primary              IS '주창고 여부';
COMMENT ON COLUMN wms.warehouses.is_external             IS '외부창고 여부 (3PL 등)';
COMMENT ON COLUMN wms.warehouses.phone                   IS '전화번호';
COMMENT ON COLUMN wms.warehouses.fax                     IS '팩스번호';
COMMENT ON COLUMN wms.warehouses.email                   IS '이메일';
COMMENT ON COLUMN wms.warehouses.postcode                IS '우편번호';
COMMENT ON COLUMN wms.warehouses.address1                IS '기본 주소';
COMMENT ON COLUMN wms.warehouses.address2                IS '상세 주소';
COMMENT ON COLUMN wms.warehouses.building_name           IS '건물명';
COMMENT ON COLUMN wms.warehouses.city                    IS '도시';
COMMENT ON COLUMN wms.warehouses.state_province          IS '주/도';
COMMENT ON COLUMN wms.warehouses.country_code            IS '국가 코드 (ISO 3166-1 alpha-3)';
COMMENT ON COLUMN wms.warehouses.operating_hours         IS '운영 시간';
COMMENT ON COLUMN wms.warehouses.capacity_sqm            IS '면적 (제곱미터)';
COMMENT ON COLUMN wms.warehouses.capacity_volume         IS '용적 (세제곱미터)';
COMMENT ON COLUMN wms.warehouses.max_weight              IS '최대 중량 (kg)';
COMMENT ON COLUMN wms.warehouses.has_dock                IS '도크 보유 여부';
COMMENT ON COLUMN wms.warehouses.has_crane               IS '크레인 보유 여부';
COMMENT ON COLUMN wms.warehouses.has_cold_storage        IS '냉장 시설 여부';
COMMENT ON COLUMN wms.warehouses.has_freezer             IS '냉동 시설 여부';
COMMENT ON COLUMN wms.warehouses.monthly_rent            IS '월 임대료';
COMMENT ON COLUMN wms.warehouses.storage_cost            IS '단위당 보관비';
COMMENT ON COLUMN wms.warehouses.currency                IS '통화 (ISO 4217)';
COMMENT ON COLUMN wms.warehouses.external_provider       IS '외부 업체명 (3PL 등)';
COMMENT ON COLUMN wms.warehouses.contract_start_date     IS '계약 시작일';
COMMENT ON COLUMN wms.warehouses.contract_close_date     IS '계약 종료일';
COMMENT ON COLUMN wms.warehouses.description             IS '창고 설명';
COMMENT ON COLUMN wms.warehouses.notes                   IS '비고';
COMMENT ON COLUMN wms.warehouses.status                  IS '상태 (ACTIVE/INACTIVE/MAINTENANCE/SUSPENDED/CLOSED)';
COMMENT ON COLUMN wms.warehouses.is_deleted              IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_warehouses__code
    ON wms.warehouses (code)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ux_warehouses__code IS '창고 코드 유니크 제약';

CREATE UNIQUE INDEX ux_warehouses__name
    ON wms.warehouses (name)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ux_warehouses__name IS '창고명 유니크 제약';

CREATE UNIQUE INDEX ux_warehouses__primary
    ON wms.warehouses ((is_primary))
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX wms.ux_warehouses__primary IS '본창고는 하나만 존재 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_warehouses__code
    ON wms.warehouses (code)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouses__code IS '창고 코드별 조회 인덱스';

CREATE INDEX ix_warehouses__name
    ON wms.warehouses (name)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouses__name IS '창고명별 조회 인덱스';

CREATE INDEX ix_warehouses__type
    ON wms.warehouses (type)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouses__type IS '창고 유형별 조회 인덱스';

CREATE INDEX ix_warehouses__manager_id
    ON wms.warehouses (manager_id)
 WHERE manager_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouses__manager_id IS '창고 관리자별 조회 인덱스';

CREATE INDEX ix_warehouses__is_primary
    ON wms.warehouses (is_primary)
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouses__is_primary IS '본창고 조회 인덱스';

CREATE INDEX ix_warehouses__is_external
    ON wms.warehouses (is_external, external_provider)
 WHERE is_external = true 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouses__is_external IS '외부창고 조회 인덱스';

CREATE INDEX ix_warehouses__city
    ON wms.warehouses (city)
 WHERE city IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouses__city IS '도시별 창고 조회 인덱스';

CREATE INDEX ix_warehouses__country_code
    ON wms.warehouses (country_code)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouses__country_code IS '국가별 창고 조회 인덱스';

CREATE INDEX ix_warehouses__facilities
    ON wms.warehouses (has_cold_storage, has_freezer, has_dock, has_crane)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouses__facilities IS '시설별 창고 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 창고 관리자 참조 외래키 (관리자 삭제 시 NULL 설정)
ALTER TABLE wms.warehouses
  ADD CONSTRAINT fk_warehouses__manager_id
    FOREIGN KEY (manager_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_warehouses__manager_id ON wms.warehouses IS '창고 관리자 참조 외래키 (SET NULL 삭제)';
