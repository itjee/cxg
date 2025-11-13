-- =====================================================================================
-- 테이블: fam.fixed_assets
-- 설명: 고정자산 - 유형자산 및 무형자산 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fam.fixed_assets 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 고정자산 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 자산 기본 정보
    asset_code              VARCHAR(50)              NOT NULL,                               -- 자산 코드
    asset_name              VARCHAR(200)             NOT NULL,                               -- 자산명
    asset_category          VARCHAR(50)              NOT NULL,                               -- 자산 분류
    asset_type              VARCHAR(50),                                                     -- 자산 유형
    
    -- 취득 정보
    acquisition_date        DATE                     NOT NULL,                               -- 취득일
    acquisition_method      VARCHAR(20),                                                     -- 취득 방법
    acquisition_cost        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 취득가액
    salvage_value           NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 잔존가치
    depreciable_cost        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 상각대상 금액
    
    -- 감가상각 정보
    depreciation_method     VARCHAR(20)              NOT NULL DEFAULT 'STRAIGHT_LINE',       -- 상각 방법
    useful_life_years       INTEGER                  NOT NULL,                               -- 내용연수 (년)
    useful_life_months      INTEGER                  NOT NULL,                               -- 내용연수 (월)
    depreciation_rate       NUMERIC(10,4),                                                   -- 상각률 (%)
    
    -- 회계 정보
    account_code            VARCHAR(50),                                                     -- 계정과목 코드
    depreciation_account    VARCHAR(50),                                                     -- 감가상각비 계정
    accumulated_account     VARCHAR(50),                                                     -- 감가상각누계액 계정
    
    -- 현재 가치
    accumulated_depreciation NUMERIC(18,2)           NOT NULL DEFAULT 0,                     -- 감가상각누계액
    book_value              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 장부가액
    
    -- 위치 및 관리
    location                VARCHAR(200),                                                    -- 위치
    department_id           UUID,                                                            -- 관리 부서
    custodian_id            UUID,                                                            -- 관리자 (사원)
    
    -- 공급자 정보
    supplier_id             UUID,                                                            -- 공급업체
    supplier_name           VARCHAR(200),                                                    -- 공급업체명 (스냅샷)
    
    -- 제조사 정보
    manufacturer            VARCHAR(200),                                                    -- 제조사
    model_no                VARCHAR(100),                                                    -- 모델번호
    serial_no               VARCHAR(100),                                                    -- 일련번호
    
    -- 보증 및 유지보수
    warranty_start_date     DATE,                                                            -- 보증 시작일
    warranty_end_date       DATE,                                                            -- 보증 종료일
    maintenance_cycle       INTEGER,                                                         -- 정기점검 주기 (월)
    last_maintenance_date   DATE,                                                            -- 최근 점검일
    next_maintenance_date   DATE,                                                            -- 다음 점검일
    
    -- 처분 정보
    disposal_date           DATE,                                                            -- 처분일
    disposal_method         VARCHAR(20),                                                     -- 처분 방법
    disposal_amount         NUMERIC(18,2),                                                   -- 처분가액
    disposal_gain_loss      NUMERIC(18,2),                                                   -- 처분손익
    
    -- 비고
    description             TEXT,                                                            -- 설명
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'IN_USE',              -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부
    
    -- 취득 방법 체크
    CONSTRAINT ck_fixed_assets__acquisition_method 
        CHECK (acquisition_method IS NULL OR acquisition_method IN ('PURCHASE', 'LEASE', 'DONATION', 'CONSTRUCTION', 'EXCHANGE')),
    
    -- 상각 방법 체크
    CONSTRAINT ck_fixed_assets__depreciation_method 
        CHECK (depreciation_method IN ('STRAIGHT_LINE', 'DECLINING_BALANCE', 'SUM_OF_YEARS', 'UNITS_OF_PRODUCTION')),
    
    -- 처분 방법 체크
    CONSTRAINT ck_fixed_assets__disposal_method 
        CHECK (disposal_method IS NULL OR disposal_method IN ('SALE', 'DISCARD', 'DONATION', 'EXCHANGE', 'LOSS')),
    
    -- 상태 체크
    CONSTRAINT ck_fixed_assets__status 
        CHECK (status IN ('IN_USE', 'IDLE', 'UNDER_MAINTENANCE', 'DISPOSED', 'LOST')),
    
    -- 금액 유효성 체크
    CONSTRAINT ck_fixed_assets__amounts 
        CHECK (acquisition_cost >= salvage_value AND book_value >= 0),
    
    -- 내용연수 양수 체크
    CONSTRAINT ck_fixed_assets__useful_life 
        CHECK (useful_life_years > 0 AND useful_life_months > 0),
    
    -- 관리 부서 참조 외래키 (SET NULL)
    CONSTRAINT fk_fixed_assets__department_id
        FOREIGN KEY (department_id) REFERENCES hrm.departments(id) ON DELETE SET NULL,
    
    -- 관리자 참조 외래키 (SET NULL)
    CONSTRAINT fk_fixed_assets__custodian_id
        FOREIGN KEY (custodian_id) REFERENCES hrm.employees(id) ON DELETE SET NULL,
    
    -- 공급업체 참조 외래키 (SET NULL)
    CONSTRAINT fk_fixed_assets__supplier_id
        FOREIGN KEY (supplier_id) REFERENCES crm.partners(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fam.fixed_assets IS '고정자산: 유형자산 및 무형자산 관리';
COMMENT ON COLUMN fam.fixed_assets.id IS '고정자산 고유 식별자 (UUID)';
COMMENT ON COLUMN fam.fixed_assets.created_at IS '등록 일시';
COMMENT ON COLUMN fam.fixed_assets.created_by IS '등록자 UUID';
COMMENT ON COLUMN fam.fixed_assets.updated_at IS '수정 일시';
COMMENT ON COLUMN fam.fixed_assets.updated_by IS '수정자 UUID';
COMMENT ON COLUMN fam.fixed_assets.asset_code IS '자산 코드';
COMMENT ON COLUMN fam.fixed_assets.asset_name IS '자산명';
COMMENT ON COLUMN fam.fixed_assets.asset_category IS '자산 분류';
COMMENT ON COLUMN fam.fixed_assets.asset_type IS '자산 유형';
COMMENT ON COLUMN fam.fixed_assets.acquisition_date IS '취득일';
COMMENT ON COLUMN fam.fixed_assets.acquisition_method IS '취득 방법 (PURCHASE/LEASE/DONATION/CONSTRUCTION/EXCHANGE)';
COMMENT ON COLUMN fam.fixed_assets.acquisition_cost IS '취득가액';
COMMENT ON COLUMN fam.fixed_assets.salvage_value IS '잔존가치';
COMMENT ON COLUMN fam.fixed_assets.depreciable_cost IS '상각대상 금액 (취득가액 - 잔존가치)';
COMMENT ON COLUMN fam.fixed_assets.depreciation_method IS '상각 방법 (STRAIGHT_LINE/DECLINING_BALANCE/SUM_OF_YEARS/UNITS_OF_PRODUCTION)';
COMMENT ON COLUMN fam.fixed_assets.useful_life_years IS '내용연수 (년)';
COMMENT ON COLUMN fam.fixed_assets.useful_life_months IS '내용연수 (월)';
COMMENT ON COLUMN fam.fixed_assets.depreciation_rate IS '상각률 (%)';
COMMENT ON COLUMN fam.fixed_assets.account_code IS '계정과목 코드';
COMMENT ON COLUMN fam.fixed_assets.depreciation_account IS '감가상각비 계정';
COMMENT ON COLUMN fam.fixed_assets.accumulated_account IS '감가상각누계액 계정';
COMMENT ON COLUMN fam.fixed_assets.accumulated_depreciation IS '감가상각누계액';
COMMENT ON COLUMN fam.fixed_assets.book_value IS '장부가액 (취득가액 - 감가상각누계액)';
COMMENT ON COLUMN fam.fixed_assets.location IS '위치';
COMMENT ON COLUMN fam.fixed_assets.department_id IS '관리 부서 ID';
COMMENT ON COLUMN fam.fixed_assets.custodian_id IS '관리자 ID (사원)';
COMMENT ON COLUMN fam.fixed_assets.supplier_id IS '공급업체 ID';
COMMENT ON COLUMN fam.fixed_assets.supplier_name IS '공급업체명 (스냅샷)';
COMMENT ON COLUMN fam.fixed_assets.manufacturer IS '제조사';
COMMENT ON COLUMN fam.fixed_assets.model_number IS '모델번호';
COMMENT ON COLUMN fam.fixed_assets.serial_number IS '일련번호';
COMMENT ON COLUMN fam.fixed_assets.warranty_start_date IS '보증 시작일';
COMMENT ON COLUMN fam.fixed_assets.warranty_end_date IS '보증 종료일';
COMMENT ON COLUMN fam.fixed_assets.maintenance_cycle IS '정기점검 주기 (월)';
COMMENT ON COLUMN fam.fixed_assets.last_maintenance_date IS '최근 점검일';
COMMENT ON COLUMN fam.fixed_assets.next_maintenance_date IS '다음 점검일';
COMMENT ON COLUMN fam.fixed_assets.disposal_date IS '처분일';
COMMENT ON COLUMN fam.fixed_assets.disposal_method IS '처분 방법 (SALE/DISCARD/DONATION/EXCHANGE/LOSS)';
COMMENT ON COLUMN fam.fixed_assets.disposal_amount IS '처분가액';
COMMENT ON COLUMN fam.fixed_assets.disposal_gain_loss IS '처분손익';
COMMENT ON COLUMN fam.fixed_assets.description IS '설명';
COMMENT ON COLUMN fam.fixed_assets.notes IS '비고';
COMMENT ON COLUMN fam.fixed_assets.status IS '상태 (IN_USE/IDLE/UNDER_MAINTENANCE/DISPOSED/LOST)';
COMMENT ON COLUMN fam.fixed_assets.is_deleted IS '삭제 여부';

COMMENT ON CONSTRAINT fk_fixed_assets__department_id ON fam.fixed_assets IS '관리 부서 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_fixed_assets__custodian_id ON fam.fixed_assets IS '관리자 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_fixed_assets__supplier_id ON fam.fixed_assets IS '공급업체 참조 외래키 (SET NULL)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_fixed_assets__asset_code 
    ON fam.fixed_assets (asset_code)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ux_fixed_assets__asset_code IS '자산 코드 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_fixed_assets__asset_name 
    ON fam.fixed_assets (asset_name)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_fixed_assets__asset_name IS '자산명 검색 인덱스';

CREATE INDEX ix_fixed_assets__asset_category 
    ON fam.fixed_assets (asset_category, status)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_fixed_assets__asset_category IS '자산 분류별 조회 인덱스';

CREATE INDEX ix_fixed_assets__department_id 
    ON fam.fixed_assets (department_id, status)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fam.ix_fixed_assets__department_id IS '부서별 자산 조회 인덱스';

CREATE INDEX ix_fixed_assets__custodian_id 
    ON fam.fixed_assets (custodian_id, status)
 WHERE custodian_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fam.ix_fixed_assets__custodian_id IS '관리자별 자산 조회 인덱스';

CREATE INDEX ix_fixed_assets__status 
    ON fam.fixed_assets (status)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_fixed_assets__status IS '상태별 자산 조회 인덱스';

CREATE INDEX ix_fixed_assets__acquisition_date 
    ON fam.fixed_assets (acquisition_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fam.ix_fixed_assets__acquisition_date IS '취득일자 조회 인덱스';
