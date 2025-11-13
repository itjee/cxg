-- ============================================================================
-- Warehouse Management System Schema (wms)
-- ============================================================================
-- Description: 창고관리시스템 스키마 (창고, 로케이션, 입출고)
-- Database: tnnt_db (Tenant Database)
-- Schema: wms
-- Created: 2025-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS wms;

COMMENT ON SCHEMA wms IS 'WMS: 창고관리시스템 스키마 (창고, 로케이션, 입출고)';

-- ============================================================================
-- WAREHOUSE MANAGEMENT SYSTEM
-- ============================================================================

-- =====================================================================================
-- 테이블: wms.warehouses
-- 설명: 창고 마스터 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================
CREATE TABLE IF NOT EXISTS wms.warehouses 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),	-- 창고 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by              UUID,                                                           -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by              UUID,                                                           -- 수정자 UUID
    
    -- 창고 기본 정보
    warehouse_code          VARCHAR(20)              NOT NULL,                              -- 창고 코드
    warehouse_name          VARCHAR(100)             NOT NULL,                              -- 창고명
    warehouse_type          VARCHAR(20)              NOT NULL,                              -- 창고 유형
    
    -- 창고 관리 정보
    manager_id              UUID,                                                          	-- 창고 관리자 식별자
    is_primary   		    BOOLEAN                  DEFAULT false,                        	-- 본창고 여부
    is_external             BOOLEAN                  DEFAULT false,                        	-- 외부창고 여부 (3PL 등)
    
    -- 연락처 정보
    phone                   VARCHAR(50),                                                   	-- 전화번호
    fax                     VARCHAR(50),                                                   	-- 팩스번호
    email                   VARCHAR(255),                                                  	-- 이메일
    
    -- 주소 정보
    postcode         	    VARCHAR(20),                                                   	-- 우편번호
    address1                VARCHAR(200),                                                  	-- 기본 주소
    address2                VARCHAR(200),                                                  	-- 상세 주소
	
	building_name           VARCHAR(200),                                                   -- 건물명
    city                    VARCHAR(100),                                                   -- 도시
    state_province          VARCHAR(100),                                                   -- 주/도
    country_code            VARCHAR(3)               DEFAULT 'KOR',                         -- 국가 코드
    
    -- 창고 운영 정보
    operating_hours         VARCHAR(100),                                                  	-- 운영 시간
    capacity_sqm            NUMERIC(12,2),                                                	-- 면적 (제곱미터)
    capacity_volume         NUMERIC(12,2),                                                	-- 용적 (세제곱미터)
    max_weight              NUMERIC(12,2),                                                	-- 최대 중량 (kg)
    
    -- 시설 정보
    has_dock                BOOLEAN                  DEFAULT false,                        	-- 도크 보유 여부
    has_crane               BOOLEAN                  DEFAULT false,                        	-- 크레인 보유 여부
    has_cold_storage        BOOLEAN                  DEFAULT false,                        	-- 냉장 시설 여부
    has_freezer             BOOLEAN                  DEFAULT false,                        	-- 냉동 시설 여부
    
    -- 비용 정보
    monthly_rent            NUMERIC(18,4),                                                	-- 월 임대료
    storage_cost 		    NUMERIC(18,4),                                             	    -- 단위당 보관비
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
	
	-- 외래키 제약 조건
	-- 창고 관리자 참조 외래키
    CONSTRAINT fk_warehouses__manager_id    FOREIGN KEY (manager_id) REFERENCES wms.employees(id)	ON DELETE CASCADE,
    
	-- 제약조건
	-- 창고 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 2-20자)
    CONSTRAINT ck_warehouses__warehouse_code_format     CHECK (warehouse_code ~ '^[A-Z0-9_]{2,20}$'),
	-- 창고 유형 체크 (MAIN: 본창고, BRANCH: 지점, DISTRIBUTION: 물류센터, COLD_STORAGE: 냉장창고, FREEZER: 냉동창고, EXTERNAL: 외부창고, VIRTUAL: 가상창고, QUARANTINE: 격리창고, RETURN: 반품창고)
    CONSTRAINT ck_warehouses__warehouse_type_format     CHECK (warehouse_type IN ('MAIN', 'BRANCH', 'DISTRIBUTION', 'COLD_STORAGE', 'FREEZER', 'EXTERNAL', 'VIRTUAL', 'QUARANTINE', 'RETURN')),
	-- 국가 코드 형식 체크 (ISO 3166-1 alpha-3, 3자리 영문 대문자)
    CONSTRAINT ck_warehouses__country_code_format       CHECK (country_code ~ '^[A-Z]{3}$'),
	-- 전화번호 형식 체크 (숫자, 하이픈, 플러스, 괄호, 공백 허용, 8-20자)
    CONSTRAINT ck_warehouses__phone_format              CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
	-- 팩스번호 형식 체크 (숫자, 하이픈, 플러스, 괄호, 공백 허용, 8-20자)
    CONSTRAINT ck_warehouses__fax_format                CHECK (fax IS NULL OR fax ~ '^[0-9\-\+\(\)\s]{8,20}$'),
	-- 이메일 형식 체크 (표준 이메일 형식)
    CONSTRAINT ck_warehouses__email_format              CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	-- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_warehouses__currency_format           CHECK (currency ~ '^[A-Z]{3}$'),
	-- 면적 양수 체크 (0보다 큼)
    CONSTRAINT ck_warehouses__capacity_positive         CHECK (capacity_sqm IS NULL OR capacity_sqm > 0),
	-- 용적 양수 체크 (0보다 큼)
    CONSTRAINT ck_warehouses__volume_positive           CHECK (capacity_volume IS NULL OR capacity_volume > 0),
	-- 중량 양수 체크 (0보다 큼)
    CONSTRAINT ck_warehouses__weight_positive           CHECK (max_weight IS NULL OR max_weight > 0),
	-- 임대료 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouses__rent_positive             CHECK (monthly_rent IS NULL OR monthly_rent >= 0),
	-- 보관비 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouses__storage_cost_positive     CHECK (storage_cost IS NULL OR storage_cost >= 0),
	-- 계약기간 유효성 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_warehouses__contract_date_valid       CHECK (contract_close_date IS NULL OR contract_start_date IS NULL OR contract_close_date >= contract_start_date),
	-- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, MAINTENANCE: 보수중, SUSPENDED: 일시중단, CLOSED: 폐쇄)
    CONSTRAINT ck_warehouses__status_format             CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'SUSPENDED', 'CLOSED'))
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  wms.warehouses 						IS '창고 마스터 정보 관리 테이블';
COMMENT ON COLUMN wms.warehouses.id            			IS '창고 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.warehouses.created_at    			IS '등록 일시';
COMMENT ON COLUMN wms.warehouses.created_by    			IS '등록자 UUID';
COMMENT ON COLUMN wms.warehouses.updated_at    			IS '수정 일시';
COMMENT ON COLUMN wms.warehouses.updated_by    			IS '수정자 UUID';
COMMENT ON COLUMN wms.warehouses.warehouse_code 		IS '창고 코드 (사내 규칙)';
COMMENT ON COLUMN wms.warehouses.warehouse_name 		IS '창고명';
COMMENT ON COLUMN wms.warehouses.warehouse_type 		IS '창고 유형 (MAIN/BRANCH/DISTRIBUTION/COLD_STORAGE/FREEZER/EXTERNAL/VIRTUAL/QUARANTINE/RETURN)';
COMMENT ON COLUMN wms.warehouses.manager_id    			IS '창고 관리자 식별자';
COMMENT ON COLUMN wms.warehouses.is_primary 			IS '주창고 여부';
COMMENT ON COLUMN wms.warehouses.is_external   			IS '외부창고 여부 (3PL 등)';
COMMENT ON COLUMN wms.warehouses.phone         			IS '전화번호';
COMMENT ON COLUMN wms.warehouses.fax           			IS '팩스번호';
COMMENT ON COLUMN wms.warehouses.email         			IS '이메일';
COMMENT ON COLUMN wms.warehouses.postcode   			IS '우편번호';
COMMENT ON COLUMN wms.warehouses.address1      			IS '기본 주소';
COMMENT ON COLUMN wms.warehouses.address2      			IS '상세 주소';
COMMENT ON COLUMN wms.warehouses.building_name 			IS '건물명';
COMMENT ON COLUMN wms.warehouses.city          			IS '도시';
COMMENT ON COLUMN wms.warehouses.state_province 		IS '주/도';
COMMENT ON COLUMN wms.warehouses.country_code  			IS '국가 코드 (ISO 3166-1 alpha-3)';
COMMENT ON COLUMN wms.warehouses.operating_hours 		IS '운영 시간';
COMMENT ON COLUMN wms.warehouses.capacity_sqm  			IS '면적 (제곱미터)';
COMMENT ON COLUMN wms.warehouses.capacity_volume 		IS '용적 (세제곱미터)';
COMMENT ON COLUMN wms.warehouses.max_weight    			IS '최대 중량 (kg)';
COMMENT ON COLUMN wms.warehouses.has_dock      			IS '도크 보유 여부';
COMMENT ON COLUMN wms.warehouses.has_crane     			IS '크레인 보유 여부';
COMMENT ON COLUMN wms.warehouses.has_cold_storage 		IS '냉장 시설 여부';
COMMENT ON COLUMN wms.warehouses.has_freezer   			IS '냉동 시설 여부';
COMMENT ON COLUMN wms.warehouses.monthly_rent  			IS '월 임대료';
COMMENT ON COLUMN wms.warehouses.storage_cost 			IS '단위당 보관비';
COMMENT ON COLUMN wms.warehouses.currency      			IS '통화 (ISO 4217)';
COMMENT ON COLUMN wms.warehouses.external_provider 		IS '외부 업체명 (3PL 등)';
COMMENT ON COLUMN wms.warehouses.contract_start_date 	IS '계약 시작일';
COMMENT ON COLUMN wms.warehouses.contract_close_date 	IS '계약 종료일';
COMMENT ON COLUMN wms.warehouses.description   			IS '창고 설명';
COMMENT ON COLUMN wms.warehouses.notes         			IS '비고';
COMMENT ON COLUMN wms.warehouses.status        			IS '상태 (ACTIVE/INACTIVE/MAINTENANCE/SUSPENDED/CLOSED)';
COMMENT ON COLUMN wms.warehouses.is_deleted       		IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_warehouses__warehouse_code
    ON wms.warehouses (warehouse_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouses__warehouse_code IS '창고 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouses__warehouse_name
    ON wms.warehouses (warehouse_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouses__warehouse_name IS '창고명별 조회 인덱스';

-- 창고 유형별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouses__warehouse_type
    ON wms.warehouses (warehouse_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouses__warehouse_type IS '창고 유형별 조회 인덱스';

-- 관리자별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouses__manager_id
    ON wms.warehouses (manager_id)
 WHERE manager_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouses__manager_id IS '창고 관리자별 조회 인덱스';

-- 본창고 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouses__is_primary
    ON wms.warehouses (is_primary)
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouses__is_primary IS '본창고 조회 인덱스';

-- 외부창고 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouses__is_external
    ON wms.warehouses (is_external, external_provider)
 WHERE is_external = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouses__is_external IS '외부창고 조회 인덱스';

-- 도시별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouses__city
    ON wms.warehouses (city)
 WHERE city IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouses__city IS '도시별 창고 조회 인덱스';

-- 국가별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouses__country_code
    ON wms.warehouses (country_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouses__country_code IS '국가별 창고 조회 인덱스';

-- 시설별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouses__facilities
    ON wms.warehouses (has_cold_storage, has_freezer, has_dock, has_crane)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouses__facilities IS '시설별 창고 조회 인덱스';

-- 계약 만료 조회 인덱스 (관리용)
-- CREATE INDEX IF NOT EXISTS ix_warehouses__contract_expiring
    -- ON wms.warehouses (contract_close_date, external_provider)
 -- WHERE contract_close_date IS NOT NULL 
   -- AND contract_close_date >= CURRENT_DATE 
   -- AND contract_close_date <= CURRENT_DATE + INTERVAL '90 days'
   -- AND is_deleted = false;

-- 상태별 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_warehouses__status

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 전체 창고 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouses__code
    ON wms.warehouses (warehouse_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_warehouses__code IS '창고 코드 유니크 제약';

-- 전체 창고명 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouses__name
    ON wms.warehouses (warehouse_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_warehouses__name IS '창고명 유니크 제약';

-- 전체 본창고는 하나만
CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouses__primary
    ON wms.warehouses ((is_primary))
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX ux_warehouses__primary IS '본창고는 하나만 존재 제약';
   

-- =====================================================================================
-- 테이블: wms.warehouse_employees
-- 설명: 창고별 사원 배정 및 알림 설정을 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================
CREATE TABLE IF NOT EXISTS wms.warehouse_employees 
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(), -- 창고사원 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by          UUID,                                                           -- 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by          UUID,                                                           -- 수정자 UUID
    
    -- 배정 기본 정보
    warehouse_id        UUID                     NOT NULL,                              -- 창고 식별자
    employee_id         UUID                     NOT NULL,                              -- 사원 식별자
    -- 역할 및 권한
    role_type           VARCHAR(20)              DEFAULT 'OPERATOR',                    -- 역할 유형
    is_primary          BOOLEAN                  DEFAULT false,                         -- 주담당자 여부
    access_level        VARCHAR(20)              DEFAULT 'READ_write',                  -- 접근 권한
    
    -- 알림 설정
    notify_receipt   	BOOLEAN                  DEFAULT true,                          -- 입고 알림 여부
    notify_shipment  	BOOLEAN                  DEFAULT true,                          -- 출고 알림 여부
    notify_cancel 		BOOLEAN              	 DEFAULT true,                          -- 취소 알림 여부
    notify_adjust 		BOOLEAN                	 DEFAULT false,                         -- 재고조정 알림 여부
    notify_emergency 	BOOLEAN                  DEFAULT true,                          -- 긴급상황 알림 여부
    
    -- 알림 방법
    notify_method 		VARCHAR(20)              DEFAULT 'EMAIL',                       -- 알림 방법
    notify_email  		VARCHAR(255),                                                   -- 알림용 이메일
    notify_phone  		VARCHAR(50),                                                    -- 알림용 전화번호
    
    -- 근무 정보
    work_shift          VARCHAR(20),                                                    -- 근무 시간대
    start_date          DATE,                                                           -- 배정 시작일
    close_date          DATE,                                                           -- 배정 종료일
    
    -- 상태 관리
    notes               TEXT,                                                           -- 비고
    status              VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태
    is_deleted          BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그
	
	-- 외래키 제약 조건
	-- 창고 참조 외래키
    CONSTRAINT fk_warehouse_employees__warehouse_id FOREIGN KEY (warehouse_id) REFERENCES wms.warehouses(id),
	-- 사원 참조 외래키
    CONSTRAINT fk_warehouse_employees__employee_id  FOREIGN KEY (employee_id) REFERENCES wms.employees(id),
	-- 등록자 참조 외래키
    CONSTRAINT fk_warehouse_employees__created_by   FOREIGN KEY (created_by) REFERENCES wms.employees(id),
	-- 수정자 참조 외래키
    CONSTRAINT fk_warehouse_employees__updated_by   FOREIGN KEY (updated_by) REFERENCES wms.employees(id),
    
	-- 제약조건
	-- 역할 유형 체크 (MANAGER: 관리자, SUPERVISOR: 감독자, OPERATOR: 작업자, PICKER: 피커, PACKER: 포장자, LOADER: 적재자, CHECKER: 검수자, ADMIN: 관리자)
    CONSTRAINT ck_warehouse_employees__role_type_format     CHECK (role_type IN ('MANAGER', 'SUPERVISOR', 'OPERATOR', 'PICKER', 'PACKER', 'LOADER', 'CHECKER', 'ADMIN')),
	-- 접근 권한 체크 (read_only: 읽기전용, read_write: 읽기쓰기, admin: 관리자, full_control: 전체권한)
    CONSTRAINT ck_warehouse_employees__access_level_format  CHECK (access_level IN ('read_only', 'read_write', 'admin', 'full_control')),
	-- 알림 방법 체크 (EMAIL: 이메일, SMS: 문자, PHONE: 전화, PUSH: 푸시알림, ALL: 모두)
    CONSTRAINT ck_warehouse_employees__notify_method      	CHECK (notify_method IN ('EMAIL', 'SMS', 'PHONE', 'PUSH', 'ALL')),
	-- 근무 시간대 체크 (DAY: 주간, NIGHT: 야간, SWING: 교대, ROTATING: 순환, FLEXIBLE: 유연)
    CONSTRAINT ck_warehouse_employees__work_shift_format    CHECK (work_shift IS NULL OR work_shift IN ('DAY', 'NIGHT', 'SWING', 'ROTATING', 'FLEXIBLE')),
	-- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 일시중지, TERMINATED: 해지)
    CONSTRAINT ck_warehouse_employees__status_format        CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED')),
	-- 이메일 형식 체크 (표준 이메일 형식)
    CONSTRAINT ck_warehouse_employees__email_format         CHECK (notify_email IS NULL OR notify_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	-- 전화번호 형식 체크 (숫자, 하이픈, 플러스, 괄호, 공백 허용, 8-20자)
    CONSTRAINT ck_warehouse_employees__phone_format         CHECK (notify_phone IS NULL OR notify_phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
	-- 날짜 범위 유효성 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_warehouse_employees__date_range_valid     CHECK (close_date IS NULL OR start_date IS NULL OR close_date >= start_date)
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  wms.warehouse_employees 					IS '창고별 사원 배정 및 알림 설정 관리 테이블';
COMMENT ON COLUMN wms.warehouse_employees.id           		IS '창고사원 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.warehouse_employees.created_at   		IS '등록 일시';
COMMENT ON COLUMN wms.warehouse_employees.created_by   		IS '등록자 UUID';
COMMENT ON COLUMN wms.warehouse_employees.updated_at   		IS '수정 일시';
COMMENT ON COLUMN wms.warehouse_employees.updated_by   		IS '수정자 UUID';
COMMENT ON COLUMN wms.warehouse_employees.warehouse_id 		IS '창고 식별자';
COMMENT ON COLUMN wms.warehouse_employees.employee_id  		IS '사원 식별자';
COMMENT ON COLUMN wms.warehouse_employees.role_type    		IS '역할 유형 (MANAGER/SUPERVISOR/OPERATOR/PICKER/PACKER/LOADER/CHECKER/ADMIN)';
COMMENT ON COLUMN wms.warehouse_employees.is_primary   		IS '주담당자 여부';
COMMENT ON COLUMN wms.warehouse_employees.access_level 		IS '접근 권한 (read_only/read_write/admin/full_control)';
COMMENT ON COLUMN wms.warehouse_employees.notify_receipt 	IS '입고 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.notify_shipment 	IS '출고 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.notify_cancel 	IS '취소 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.notify_adjust 	IS '재고조정 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.notify_emergency 	IS '긴급상황 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.notify_method 	IS '알림 방법 (EMAIL/SMS/PHONE/PUSH/ALL)';
COMMENT ON COLUMN wms.warehouse_employees.notify_email 		IS '알림용 이메일';
COMMENT ON COLUMN wms.warehouse_employees.notify_phone 		IS '알림용 전화번호';
COMMENT ON COLUMN wms.warehouse_employees.work_shift    	IS '근무 시간대 (DAY/NIGHT/SWING/ROTATING/FLEXIBLE)';
COMMENT ON COLUMN wms.warehouse_employees.start_date   		IS '배정 시작일';
COMMENT ON COLUMN wms.warehouse_employees.close_date     	IS '배정 종료일';
COMMENT ON COLUMN wms.warehouse_employees.notes        		IS '비고';
COMMENT ON COLUMN wms.warehouse_employees.status       		IS '상태 (ACTIVE/INACTIVE/SUSPENDED/TERMINATED)';
COMMENT ON COLUMN wms.warehouse_employees.is_deleted      	IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_warehouse_employees__warehouse_id
    ON wms.warehouse_employees (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_employees__warehouse_id IS '창고별 사원 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_employees__employee_id
    ON wms.warehouse_employees (employee_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_employees__employee_id IS '사원별 창고 조회 인덱스';

-- 창고별 사원 목록 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_warehouse_employees__warehouse_active

-- 사원별 창고 목록 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_warehouse_employees__employee_active

-- 역할별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_employees__role_type
    ON wms.warehouse_employees (role_type, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_employees__role_type IS '역할별 창고사원 조회 인덱스';

-- 주담당자 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_employees__primary
    ON wms.warehouse_employees (warehouse_id, is_primary)
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_employees__primary IS '창고별 주담당자 조회 인덱스';

-- 접근 권한별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_employees__access_level
    ON wms.warehouse_employees (access_level, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_employees__access_level IS '접근 권한별 조회 인덱스';

-- 알림 설정별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_employees__notifications
    ON wms.warehouse_employees (warehouse_id, notify_method)
 WHERE (notify_receipt = true OR notify_shipment = true OR notify_cancel = true OR notify_emergency = true)
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_employees__notifications IS '알림 설정 사원 조회 인덱스';

-- 근무 시간대별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_employees__work_shift
    ON wms.warehouse_employees (work_shift, warehouse_id)
 WHERE work_shift IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_employees__work_shift IS '근무 시간대별 조회 인덱스';

-- 배정 기간별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_employees__date_range
    ON wms.warehouse_employees (start_date, close_date, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_employees__date_range IS '배정 기간별 조회 인덱스';

-- 현재 활성 배정 조회 인덱스
-- CREATE INDEX IF NOT EXISTS ix_warehouse_employees__current_active
    -- ON wms.warehouse_employees (warehouse_id, employee_id)
 -- WHERE status = 'ACTIVE' 
   -- AND (start_date IS NULL OR start_date <= CURRENT_DATE)
   -- AND (close_date IS NULL OR close_date >= CURRENT_DATE)
   -- AND is_deleted = false;

-- 상태별 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_warehouse_employees__status

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 창고별 사원 중복 배정 방지 (현재 활성 기간)
CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_employees__warehouse_employee_active
    ON wms.warehouse_employees (warehouse_id, employee_id)
 WHERE status = 'ACTIVE' 
   AND is_deleted = false;
COMMENT ON INDEX ux_warehouse_employees__warehouse_employee_active IS '창고별 사원 중복 배정 방지 제약';

-- 창고별 주담당자는 하나만
CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_employees__warehouse_primary
    ON wms.warehouse_employees (warehouse_id)
 WHERE is_primary = true 
   AND status = 'ACTIVE'
   AND is_deleted = false;
COMMENT ON INDEX ux_warehouse_employees__warehouse_primary IS '창고별 주담당자는 하나만 제약';


-- =====================================================================================
-- 테이블: wms.warehouse_locations
-- 설명	: 창고 로케이션 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================
CREATE TABLE IF NOT EXISTS wms.warehouse_locations 
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),	-- 로케이션 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by          UUID,                                                           -- 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by          UUID,                                                           -- 수정자 UUID
    
    -- 로케이션 기본 정보
    warehouse_id        UUID                     NOT NULL,                              -- 창고 식별자
    location_code       VARCHAR(50)              NOT NULL,                              -- 로케이션 코드
    location_name       VARCHAR(100)             NOT NULL,                              -- 로케이션명
    location_type       VARCHAR(20)              DEFAULT 'BIN',                         -- 로케이션 유형
    
    -- 계층 구조 정보
    parent_id  			UUID,                                                           -- 상위 로케이션 식별자
    level_depth         INTEGER                  DEFAULT 1,                             -- 계층 깊이
    full_path           VARCHAR(500),                                                   -- 전체 경로 (예: ZONE-A/AISLE-01/RACK-001/BIN-A001)
    
    -- 물리적 정보
    zone_code           VARCHAR(20),                                                    -- 구역 코드
    aisle_code          VARCHAR(20),                                                    -- 통로 코드
    rack_code           VARCHAR(20),                                                    -- 랙 코드
    bin_code            VARCHAR(20),                                                    -- 빈 코드
    
    -- 위치 좌표 (선택적)
    x_coordinate        NUMERIC(10,2),                                                  -- X 좌표
    y_coordinate        NUMERIC(10,2),                                                  -- Y 좌표
    z_coordinate        NUMERIC(10,2),                                                  -- Z 좌표 (높이)
    
    -- 용량 및 규격 정보
    capacity_weight     NUMERIC(12,2),                                                  -- 중량 용량 (kg)
    capacity_volume     NUMERIC(12,2),                                                  -- 부피 용량 (㎥)
    capacity_units      INTEGER,                                                        -- 단위 용량 (개수)
    width_cm            NUMERIC(8,2),                                                   -- 가로 (cm)
    height_cm           NUMERIC(8,2),                                                   -- 세로 (cm)
    depth_cm            NUMERIC(8,2),                                                   -- 깊이 (cm)
    
    -- 로케이션 속성
    is_pickable         BOOLEAN                  DEFAULT true,                          -- 피킹 가능 여부
    is_receivable       BOOLEAN                  DEFAULT true,                          -- 입고 가능 여부
    is_virtual          BOOLEAN                  DEFAULT false,                         -- 가상 로케이션 여부
    is_damaged_area     BOOLEAN                  DEFAULT false,                         -- 불량품 구역 여부
    is_quarantine       BOOLEAN                  DEFAULT false,                         -- 격리 구역 여부
    
    -- 환경 조건
    temperature_min     NUMERIC(5,2),                                                   -- 최저 온도 (℃)
    temperature_max     NUMERIC(5,2),                                                   -- 최고 온도 (℃)
    humidity_min        NUMERIC(5,2),                                                   -- 최저 습도 (%)
    humidity_max        NUMERIC(5,2),                                                   -- 최고 습도 (%)
    
    -- 정렬 및 우선순위
    sort_order          INTEGER                  DEFAULT 0,                             -- 정렬 순서
    picking_priority    INTEGER                  DEFAULT 0,                             -- 피킹 우선순위
    
    -- 바코드 및 RFID
    barcode             VARCHAR(100),                                                   -- 바코드
    rfid_tag            VARCHAR(100),                                                   -- RFID 태그
    
    -- 추가 정보
    description         TEXT,                                                           -- 로케이션 설명    
    
    -- 상태 관리
    notes               TEXT,                                                           -- 비고
    status              VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태
    is_deleted          BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그
	
	-- 외래키 제약 조건
	-- 창고 참조 외래키 (창고 삭제 시 로케이션도 함께 삭제)
    CONSTRAINT fk_warehouse_locations__warehouse_id     FOREIGN KEY (warehouse_id) 	REFERENCES wms.warehouses(id)			ON DELETE CASCADE,
	-- 상위 로케이션 참조 외래키 (상위 로케이션 삭제 시 하위도 함께 삭제)
    CONSTRAINT fk_warehouse_locations__parent_id 		FOREIGN KEY (parent_id) 	REFERENCES wms.warehouse_locations(id)	ON DELETE CASCADE,
    
	-- 제약조건
	-- 로케이션 코드 형식 체크 (영문 대문자, 숫자, 하이픈, 언더스코어, 1-50자)
    CONSTRAINT ck_warehouse_locations__location_code_format     CHECK (location_code ~ '^[A-Z0-9\-_]{1,50}$'),
	-- 로케이션 유형 체크 (ZONE: 구역, AISLE: 통로, RACK: 랙, SHELF: 선반, BIN: 빈, PALLET: 파렛트, FLOOR: 바닥, DOOR: 문, STAGING: 스테이징, VIRTUAL: 가상)
    CONSTRAINT ck_warehouse_locations__location_type_format     CHECK (location_type IN ('ZONE', 'AISLE', 'RACK', 'SHELF', 'BIN', 'PALLET', 'FLOOR', 'DOOR', 'STAGING', 'VIRTUAL')),
	-- 계층 깊이 범위 체크 (1~10단계)
    CONSTRAINT ck_warehouse_locations__level_depth_range        CHECK (level_depth BETWEEN 1 AND 10),
	-- 중량 용량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__capacity_positive        CHECK (capacity_weight IS NULL OR capacity_weight >= 0),
	-- 부피 용량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__volume_positive          CHECK (capacity_volume IS NULL OR capacity_volume >= 0),
	-- 단위 용량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__units_positive           CHECK (capacity_units IS NULL OR capacity_units >= 0),
	-- 규격 양수 체크 (가로, 세로, 깊이 모두 0보다 커야 함)
    CONSTRAINT ck_warehouse_locations__dimensions_positive      CHECK ((width_cm IS NULL OR width_cm > 0) AND (height_cm IS NULL OR height_cm > 0) AND (depth_cm IS NULL OR depth_cm > 0)),
	-- 온도 범위 체크 (최저온도가 최고온도보다 낮거나 같아야 함)
    CONSTRAINT ck_warehouse_locations__temperature_range        CHECK ((temperature_min IS NULL OR temperature_max IS NULL) OR temperature_min <= temperature_max),
	-- 습도 범위 체크 (최저습도가 최고습도보다 낮거나 같고, 0~100% 범위 내여야 함)
    CONSTRAINT ck_warehouse_locations__humidity_range           CHECK ((humidity_min IS NULL OR humidity_max IS NULL) OR (humidity_min <= humidity_max AND humidity_min >= 0 AND humidity_max <= 100)),
	-- 정렬 순서 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__sort_order_positive      CHECK (sort_order >= 0),
	-- 피킹 우선순위 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__picking_priority 		CHECK (picking_priority >= 0),
	-- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, MAINTENANCE: 보수중, BLOCKED: 차단됨, DAMAGED: 손상됨, RESERVED: 예약됨)
    CONSTRAINT ck_warehouse_locations__status_format            CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'BLOCKED', 'DAMAGED', 'RESERVED')),
	-- 자기 참조 방지 체크 (부모 로케이션이 자기 자신이 될 수 없음)
    CONSTRAINT ck_warehouse_locations__parent_not_self          CHECK (parent_id != id)
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  wms.warehouse_locations 					IS '창고 로케이션 정보 관리 테이블';
COMMENT ON COLUMN wms.warehouse_locations.id           		IS '로케이션 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.warehouse_locations.created_at   		IS '등록 일시';
COMMENT ON COLUMN wms.warehouse_locations.created_by   		IS '등록자 UUID';
COMMENT ON COLUMN wms.warehouse_locations.updated_at   		IS '수정 일시';
COMMENT ON COLUMN wms.warehouse_locations.updated_by   		IS '수정자 UUID';
COMMENT ON COLUMN wms.warehouse_locations.warehouse_id 		IS '창고 식별자';
COMMENT ON COLUMN wms.warehouse_locations.location_code 	IS '로케이션 코드';
COMMENT ON COLUMN wms.warehouse_locations.location_name 	IS '로케이션명';
COMMENT ON COLUMN wms.warehouse_locations.location_type 	IS '로케이션 유형 (ZONE/AISLE/RACK/SHELF/BIN/PALLET/FLOOR/DOOR/STAGING/VIRTUAL)';
COMMENT ON COLUMN wms.warehouse_locations.parent_id 		IS '상위 로케이션 식별자 (계층구조)';
COMMENT ON COLUMN wms.warehouse_locations.level_depth  		IS '계층 깊이 (1=ZONE, 2=AISLE, 3=RACK, 4=BIN)';
COMMENT ON COLUMN wms.warehouse_locations.full_path    		IS '전체 경로 (ZONE-A/AISLE-01/RACK-001/BIN-A001)';
COMMENT ON COLUMN wms.warehouse_locations.zone_code    		IS '구역 코드';
COMMENT ON COLUMN wms.warehouse_locations.aisle_code   		IS '통로 코드';
COMMENT ON COLUMN wms.warehouse_locations.rack_code    		IS '랙 코드';
COMMENT ON COLUMN wms.warehouse_locations.bin_code     		IS '빈 코드';
COMMENT ON COLUMN wms.warehouse_locations.x_coordinate 		IS 'X 좌표';
COMMENT ON COLUMN wms.warehouse_locations.y_coordinate 		IS 'Y 좌표';
COMMENT ON COLUMN wms.warehouse_locations.z_coordinate 		IS 'Z 좌표 (높이)';
COMMENT ON COLUMN wms.warehouse_locations.capacity_weight 	IS '중량 용량 (kg)';
COMMENT ON COLUMN wms.warehouse_locations.capacity_volume 	IS '부피 용량 (㎥)';
COMMENT ON COLUMN wms.warehouse_locations.capacity_units 	IS '단위 용량 (개수)';
COMMENT ON COLUMN wms.warehouse_locations.width_cm     		IS '가로 (cm)';
COMMENT ON COLUMN wms.warehouse_locations.height_cm    		IS '세로 (cm)';
COMMENT ON COLUMN wms.warehouse_locations.depth_cm     		IS '깊이 (cm)';
COMMENT ON COLUMN wms.warehouse_locations.is_pickable  		IS '피킹 가능 여부';
COMMENT ON COLUMN wms.warehouse_locations.is_receivable 	IS '입고 가능 여부';
COMMENT ON COLUMN wms.warehouse_locations.is_virtual   		IS '가상 로케이션 여부';
COMMENT ON COLUMN wms.warehouse_locations.is_damaged_area 	IS '불량품 구역 여부';
COMMENT ON COLUMN wms.warehouse_locations.is_quarantine 	IS '격리 구역 여부';
COMMENT ON COLUMN wms.warehouse_locations.temperature_min 	IS '최저 온도 (℃)';
COMMENT ON COLUMN wms.warehouse_locations.temperature_max 	IS '최고 온도 (℃)';
COMMENT ON COLUMN wms.warehouse_locations.humidity_min 		IS '최저 습도 (%)';
COMMENT ON COLUMN wms.warehouse_locations.humidity_max 		IS '최고 습도 (%)';
COMMENT ON COLUMN wms.warehouse_locations.sort_order   		IS '정렬 순서';
COMMENT ON COLUMN wms.warehouse_locations.picking_priority 	IS '피킹 우선순위';
COMMENT ON COLUMN wms.warehouse_locations.barcode      		IS '바코드';
COMMENT ON COLUMN wms.warehouse_locations.rfid_tag     		IS 'RFID 태그';
COMMENT ON COLUMN wms.warehouse_locations.description  		IS '로케이션 설명';
COMMENT ON COLUMN wms.warehouse_locations.notes        		IS '비고';
COMMENT ON COLUMN wms.warehouse_locations.status       		IS '상태 (ACTIVE/INACTIVE/MAINTENANCE/BLOCKED/DAMAGED/RESERVED)';
COMMENT ON COLUMN wms.warehouse_locations.is_deleted      	IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__warehouse_id
    ON wms.warehouse_locations (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__warehouse_id IS '창고별 로케이션 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__location_code
    ON wms.warehouse_locations (location_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__location_code IS '로케이션 코드별 조회 인덱스';

-- 계층구조 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__parent_id
    ON wms.warehouse_locations (parent_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__parent_id IS '상위 로케이션별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__level_depth
    ON wms.warehouse_locations (warehouse_id, level_depth, sort_order)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__level_depth IS '창고별 계층 깊이 조회 인덱스';

-- 로케이션 유형별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__location_type
    ON wms.warehouse_locations (location_type, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__location_type IS '로케이션 유형별 조회 인덱스';

-- 구역별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__zone_code
    ON wms.warehouse_locations (zone_code)
 WHERE zone_code IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__zone_code IS '구역별 로케이션 조회 인덱스';

-- 피킹 최적화 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__picking
    ON wms.warehouse_locations (warehouse_id, is_pickable, picking_priority, sort_order)
 WHERE is_pickable = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__picking IS '피킹 최적화 조회 인덱스';

-- 입고 가능 로케이션 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__receivable
    ON wms.warehouse_locations (warehouse_id, is_receivable)
 WHERE is_receivable = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__receivable IS '입고 가능 로케이션 조회 인덱스';

-- 좌표 기반 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__coordinates
    ON wms.warehouse_locations (warehouse_id, x_coordinate, y_coordinate, z_coordinate)
 WHERE x_coordinate IS NOT NULL 
   AND y_coordinate IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__coordinates IS '좌표 기반 로케이션 조회 인덱스';

-- 바코드 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__barcode
    ON wms.warehouse_locations (barcode)
 WHERE barcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__barcode IS '바코드별 로케이션 조회 인덱스';

-- RFID 태그 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__rfid_tag
    ON wms.warehouse_locations (rfid_tag)
 WHERE rfid_tag IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__rfid_tag IS 'RFID 태그별 로케이션 조회 인덱스';

-- 전체 경로 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_locations__full_path
    ON wms.warehouse_locations (full_path)
 WHERE full_path IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_warehouse_locations__full_path IS '전체 경로별 로케이션 조회 인덱스';

-- 상태별 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_warehouse_locations__status

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 창고별 로케이션 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_locations__warehouse_code
    ON wms.warehouse_locations (warehouse_id, location_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_warehouse_locations__warehouse_code IS '창고별 로케이션 코드 유니크 제약';

-- 바코드 유니크 (전역)
CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_locations__barcode
    ON wms.warehouse_locations (barcode)
 WHERE barcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ux_warehouse_locations__barcode IS '로케이션 바코드 유니크 제약';

-- RFID 태그 유니크 (전역)
CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_locations__rfid_tag
    ON wms.warehouse_locations (rfid_tag)
 WHERE rfid_tag IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ux_warehouse_locations__rfid_tag IS '로케이션 RFID 태그 유니크 제약';   



-- ============================================================================
-- 물류 프로세스 (Logistics Process) - from lwm
-- ============================================================================

-- =====================================================================================
-- 테이블: wms.receiving
-- 설명: 자재/제품 입고 헤더 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE wms.receiving 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),     -- 입고 고유 식별자
    created_at              TIMESTAMPTZ              DEFAULT CURRENT_TIMESTAMP,                 -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMPTZ,                                                        -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gr_code                 VARCHAR(50)              NOT NULL,                                  -- 입고 코드
    doc_date                DATE                     NOT NULL,                                  -- 전표 일자
    
    -- 참조 정보
    po_id                   UUID,                                                               -- 구매발주 식별자
    vendor_id               UUID,                                                               -- 공급업체 식별자
    warehouse_id            UUID                     NOT NULL,                                  -- 창고 식별자
    receiver_id             UUID,                                                               -- 입고 담당자 식별자
    
    -- 수량 정보
    total_qty               INTEGER                  DEFAULT 0,                                 -- 총 수량
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                           -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- 제약조건
    -- 입고 코드 유니크 제약
    CONSTRAINT uk_wms_goods_receipts__code UNIQUE (gr_code),
    -- 상태 체크 (DRAFT: 임시저장, CONFIRMED: 확정, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_wms_receiving__status CHECK (status IN ('DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    -- 총 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_wms_receiving__total_qty CHECK (total_qty >= 0)
);

COMMENT ON TABLE  wms.receiving                IS '자재/제품 입고 헤더 관리 테이블';
COMMENT ON COLUMN wms.receiving.id             IS '입고 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.receiving.created_at     IS '등록 일시';
COMMENT ON COLUMN wms.receiving.created_by     IS '등록자 UUID';
COMMENT ON COLUMN wms.receiving.updated_at     IS '수정 일시';
COMMENT ON COLUMN wms.receiving.updated_by     IS '수정자 UUID';
COMMENT ON COLUMN wms.receiving.gr_code        IS '입고 코드 (입고번호)';
COMMENT ON COLUMN wms.receiving.doc_date       IS '전표 일자';
COMMENT ON COLUMN wms.receiving.po_id          IS '구매발주 식별자';
COMMENT ON COLUMN wms.receiving.vendor_id      IS '공급업체 식별자';
COMMENT ON COLUMN wms.receiving.warehouse_id   IS '창고 식별자';
COMMENT ON COLUMN wms.receiving.receiver_id    IS '입고 담당자 식별자';
COMMENT ON COLUMN wms.receiving.total_qty      IS '총 수량';
COMMENT ON COLUMN wms.receiving.status         IS '상태 (DRAFT/CONFIRMED/COMPLETED/CANCELLED)';
COMMENT ON COLUMN wms.receiving.is_deleted     IS '논리 삭제 플래그';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_wms_receiving__gr_code
    ON wms.receiving (gr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_wms_receiving__gr_code IS '입고 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_receiving__warehouse_id
    ON wms.receiving (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_wms_receiving__warehouse_id IS '창고별 입고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_receiving__doc_date
    ON wms.receiving (doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_wms_receiving__doc_date IS '전표 일자별 입고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_receiving__vendor_id
    ON wms.receiving (vendor_id)
 WHERE vendor_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_wms_receiving__vendor_id IS '공급업체별 입고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_receiving__status
    ON wms.receiving (status, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_wms_receiving__status IS '상태별 입고 조회 인덱스';

-- =====================================================================================
-- 테이블: wms.receiving_items
-- 설명: 입고 라인(상세) 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE wms.receiving_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 입고 라인 고유 식별자
    created_at              TIMESTAMPTZ              DEFAULT CURRENT_TIMESTAMP,                 -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMPTZ,                                                        -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gr_id                   UUID                     NOT NULL,                                  -- 입고 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                                  -- 라인 번호
    po_line_id              UUID,                                                               -- 구매발주 라인 식별자
    item_id                 UUID                     NOT NULL,                                  -- 제품 식별자
    location_id             UUID,                                                               -- 로케이션 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                       -- 로트 번호
    serial_number           VARCHAR(100),                                                       -- 시리얼 번호
    
    -- 수량 정보
    ordered_qty             INTEGER                  DEFAULT 0,                                 -- 발주 수량
    received_qty            INTEGER                  NOT NULL,                                  -- 입고 수량
    rejected_qty            INTEGER                  DEFAULT 0,                                 -- 불량 수량
    
    -- 원가 정보
    unit_cost               NUMERIC(18,4)            DEFAULT 0,                                 -- 단가
    
    -- 제약조건
    -- 입고 헤더별 라인번호 유니크 제약
    CONSTRAINT uk_wms_gr_lines__gr_line UNIQUE (gr_id, line_no),
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_wms_receiving_items__line_no CHECK (line_no > 0),
    -- 발주 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_wms_receiving_items__ordered_qty CHECK (ordered_qty >= 0),
    -- 입고 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_wms_receiving_items__received_qty CHECK (received_qty >= 0),
    -- 불량 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_wms_receiving_items__rejected_qty CHECK (rejected_qty >= 0),
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_wms_receiving_items__unit_cost CHECK (unit_cost >= 0)
);

COMMENT ON TABLE  wms.receiving_items                IS '입고 라인(상세) 관리 테이블';
COMMENT ON COLUMN wms.receiving_items.id             IS '입고 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.receiving_items.created_at     IS '등록 일시';
COMMENT ON COLUMN wms.receiving_items.created_by     IS '등록자 UUID';
COMMENT ON COLUMN wms.receiving_items.updated_at     IS '수정 일시';
COMMENT ON COLUMN wms.receiving_items.updated_by     IS '수정자 UUID';
COMMENT ON COLUMN wms.receiving_items.gr_id          IS '입고 헤더 식별자';
COMMENT ON COLUMN wms.receiving_items.line_no        IS '라인 번호';
COMMENT ON COLUMN wms.receiving_items.po_line_id     IS '구매발주 라인 식별자';
COMMENT ON COLUMN wms.receiving_items.item_id        IS '제품 식별자';
COMMENT ON COLUMN wms.receiving_items.location_id    IS '로케이션 식별자';
COMMENT ON COLUMN wms.receiving_items.lot_number     IS '로트 번호';
COMMENT ON COLUMN wms.receiving_items.serial_number  IS '시리얼 번호';
COMMENT ON COLUMN wms.receiving_items.ordered_qty    IS '발주 수량';
COMMENT ON COLUMN wms.receiving_items.received_qty   IS '입고 수량';
COMMENT ON COLUMN wms.receiving_items.rejected_qty   IS '불량 수량';
COMMENT ON COLUMN wms.receiving_items.unit_cost      IS '단가';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_wms_receiving_items__gr_id
    ON wms.receiving_items (gr_id, line_no);
COMMENT ON INDEX ix_wms_receiving_items__gr_id IS '입고 헤더별 라인 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_receiving_items__item_id
    ON wms.receiving_items (item_id);
COMMENT ON INDEX ix_wms_receiving_items__item_id IS '제품별 입고 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_receiving_items__location_id
    ON wms.receiving_items (location_id)
 WHERE location_id IS NOT NULL;
COMMENT ON INDEX ix_wms_receiving_items__location_id IS '로케이션별 입고 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_receiving_items__lot_number
    ON wms.receiving_items (lot_number)
 WHERE lot_number IS NOT NULL;
COMMENT ON INDEX ix_wms_receiving_items__lot_number IS '로트 번호별 조회 인덱스';

-- =====================================================================================
-- 테이블: wms.shipping
-- 설명: 자재/제품 출고 헤더 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE wms.shipping 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 출고 고유 식별자
    created_at              TIMESTAMPTZ              DEFAULT CURRENT_TIMESTAMP,                 -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMPTZ,                                                        -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gi_code                 VARCHAR(50)              NOT NULL,                                  -- 출고 코드
    doc_date                DATE                     NOT NULL,                                  -- 전표 일자
    
    -- 참조 정보
    so_id                   UUID,                                                               -- 판매주문 식별자
    customer_id             UUID,                                                               -- 고객 식별자
    warehouse_id            UUID                     NOT NULL,                                  -- 창고 식별자
    picker_id               UUID,                                                               -- 피킹 담당자 식별자
    
    -- 수량 정보
    total_qty               INTEGER                  DEFAULT 0,                                 -- 총 수량
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                           -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- 제약조건
    -- 출고 코드 유니크 제약
    CONSTRAINT uk_wms_goods_issues__code UNIQUE (gi_code),
    -- 상태 체크 (DRAFT: 임시저장, CONFIRMED: 확정, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_wms_shipping__status CHECK (status IN ('DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    -- 총 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_wms_shipping__total_qty CHECK (total_qty >= 0)
);

COMMENT ON TABLE  wms.shipping                IS '자재/제품 출고 헤더 관리 테이블';
COMMENT ON COLUMN wms.shipping.id             IS '출고 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.shipping.created_at     IS '등록 일시';
COMMENT ON COLUMN wms.shipping.created_by     IS '등록자 UUID';
COMMENT ON COLUMN wms.shipping.updated_at     IS '수정 일시';
COMMENT ON COLUMN wms.shipping.updated_by     IS '수정자 UUID';
COMMENT ON COLUMN wms.shipping.gi_code        IS '출고 코드 (출고번호)';
COMMENT ON COLUMN wms.shipping.doc_date       IS '전표 일자';
COMMENT ON COLUMN wms.shipping.so_id          IS '판매주문 식별자';
COMMENT ON COLUMN wms.shipping.customer_id    IS '고객 식별자';
COMMENT ON COLUMN wms.shipping.warehouse_id   IS '창고 식별자';
COMMENT ON COLUMN wms.shipping.picker_id      IS '피킹 담당자 식별자';
COMMENT ON COLUMN wms.shipping.total_qty      IS '총 수량';
COMMENT ON COLUMN wms.shipping.status         IS '상태 (DRAFT/CONFIRMED/COMPLETED/CANCELLED)';
COMMENT ON COLUMN wms.shipping.is_deleted     IS '논리 삭제 플래그';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_wms_shipping__gi_code
    ON wms.shipping (gi_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_wms_shipping__gi_code IS '출고 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_shipping__warehouse_id
    ON wms.shipping (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_wms_shipping__warehouse_id IS '창고별 출고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_shipping__doc_date
    ON wms.shipping (doc_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_wms_shipping__doc_date IS '전표 일자별 출고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_shipping__customer_id
    ON wms.shipping (customer_id)
 WHERE customer_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_wms_shipping__customer_id IS '고객별 출고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_shipping__status
    ON wms.shipping (status, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_wms_shipping__status IS '상태별 출고 조회 인덱스';

-- =====================================================================================
-- 테이블: wms.shipping_items
-- 설명: 출고 라인(상세) 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
CREATE TABLE wms.shipping_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 출고 라인 고유 식별자
    created_at              TIMESTAMPTZ              DEFAULT CURRENT_TIMESTAMP,                 -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMPTZ,                                                        -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gi_id                   UUID                     NOT NULL,                                  -- 출고 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                                  -- 라인 번호
    so_line_id              UUID,                                                               -- 판매주문 라인 식별자
    item_id                 UUID                     NOT NULL,                                  -- 제품 식별자
    location_id             UUID,                                                               -- 로케이션 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                       -- 로트 번호
    serial_number           VARCHAR(100),                                                       -- 시리얼 번호
    
    -- 수량 정보
    requested_qty           INTEGER                  DEFAULT 0,                                 -- 요청 수량
    picked_qty              INTEGER                  NOT NULL,                                  -- 피킹 수량
    
    -- 제약조건
    -- 출고 헤더별 라인번호 유니크 제약
    CONSTRAINT uk_wms_gi_lines__gi_line UNIQUE (gi_id, line_no),
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_wms_shipping_items__line_no CHECK (line_no > 0),
    -- 요청 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_wms_shipping_items__requested_qty CHECK (requested_qty >= 0),
    -- 피킹 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_wms_shipping_items__picked_qty CHECK (picked_qty >= 0)
);

COMMENT ON TABLE  wms.shipping_items                IS '출고 라인(상세) 관리 테이블';
COMMENT ON COLUMN wms.shipping_items.id             IS '출고 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.shipping_items.created_at     IS '등록 일시';
COMMENT ON COLUMN wms.shipping_items.created_by     IS '등록자 UUID';
COMMENT ON COLUMN wms.shipping_items.updated_at     IS '수정 일시';
COMMENT ON COLUMN wms.shipping_items.updated_by     IS '수정자 UUID';
COMMENT ON COLUMN wms.shipping_items.gi_id          IS '출고 헤더 식별자';
COMMENT ON COLUMN wms.shipping_items.line_no        IS '라인 번호';
COMMENT ON COLUMN wms.shipping_items.so_line_id     IS '판매주문 라인 식별자';
COMMENT ON COLUMN wms.shipping_items.item_id        IS '제품 식별자';
COMMENT ON COLUMN wms.shipping_items.location_id    IS '로케이션 식별자';
COMMENT ON COLUMN wms.shipping_items.lot_number     IS '로트 번호';
COMMENT ON COLUMN wms.shipping_items.serial_number  IS '시리얼 번호';
COMMENT ON COLUMN wms.shipping_items.requested_qty  IS '요청 수량';
COMMENT ON COLUMN wms.shipping_items.picked_qty     IS '피킹 수량';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_wms_shipping_items__gi_id
    ON wms.shipping_items (gi_id, line_no);
COMMENT ON INDEX ix_wms_shipping_items__gi_id IS '출고 헤더별 라인 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_shipping_items__item_id
    ON wms.shipping_items (item_id);
COMMENT ON INDEX ix_wms_shipping_items__item_id IS '제품별 출고 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_shipping_items__location_id
    ON wms.shipping_items (location_id)
 WHERE location_id IS NOT NULL;
COMMENT ON INDEX ix_wms_shipping_items__location_id IS '로케이션별 출고 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_wms_shipping_items__serial_number
    ON wms.shipping_items (serial_number)
 WHERE serial_number IS NOT NULL;
COMMENT ON INDEX ix_wms_shipping_items__serial_number IS '시리얼 번호별 조회 인덱스';

-- ============================================================================
-- 인덱스 및 제약조건 추가
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_wms_workflows_created_at ON wms.workflows(created_at);
CREATE INDEX IF NOT EXISTS idx_wms_approvals_created_at ON wms.approvals(created_at);

