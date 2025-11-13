-- ============================================================================
-- Asset Management Schema (asm)
-- ============================================================================
-- Description: 자산 관리 (고정자산, 자산등록, 감가상각, 유지보수 등)
-- Database: tnnt_db (Tenant Database)
-- Schema: asm
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS asm;

COMMENT ON SCHEMA asm IS 'ASM: 자산 관리 스키마 (고정자산, 감가상각, 유지보수)';

-- ============================================================================
-- AI 기반 업무지원 플랫폼 - 데이터베이스 DDL
-- 멀티테넌시: schema per tenant 전략
-- PostgreSQL 15+ 사용
-- ============================================================================

-- ============================================================================
-- ASM: A/S 관리 (After Sales Service)
-- ============================================================================

-- =====================================================================================
-- 테이블: asm.service_requests
-- 설명: A/S 요청 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.service_requests 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),	-- A/S 요청 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by              UUID,                                                           -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by              UUID,                                                           -- 수정자 UUID
    
    -- 기본 정보
    company_id              UUID                     NOT NULL,                              -- 회사 식별자
    sr_code                 VARCHAR(50)              NOT NULL,                              -- A/S 요청 코드
    customer_id             UUID                     NOT NULL,                              -- 고객 식별자
    item_id                 UUID                     NOT NULL,                              -- 제품 식별자
    serial_number           VARCHAR(100),                                                   -- 시리얼 번호
    purchase_date           DATE,                                                           -- 구매 일자
    warranty_end_date       DATE,                                                           -- 보증 종료일
    issue_description       TEXT                     NOT NULL,                              -- 문제 설명
    -- A/S 정보
    service_type            VARCHAR(20)              DEFAULT 'REPAIR',                      -- A/S 유형
    priority                VARCHAR(20)              DEFAULT 'MEDIUM',                      -- 우선순위
    status                  VARCHAR(20)              DEFAULT 'RECEIVED',                    -- 상태
    assigned_technician_id  UUID,                                                           -- 배정된 기술자 식별자
    
    -- 비용 정보
    estimated_cost          NUMERIC(18,4)            DEFAULT 0,                             -- 예상 비용
    actual_cost             NUMERIC(18,4)            DEFAULT 0,                             -- 실제 비용
    currency                VARCHAR(3)               DEFAULT 'KRW',                         -- 통화
    
    -- 완료 정보
    completed_at            TIMESTAMP WITH TIME ZONE,                                       -- 완료 일시
    is_warranty             BOOLEAN                  DEFAULT false,                         -- 보증기간 내 여부
    
    -- 상태 관리
    is_deleted                 BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_service_requests__service_type    CHECK (service_type IN ('REPAIR', 'REPLACE', 'MAINTENANCE', 'INSPECTION')),
    CONSTRAINT ck_service_requests__priority        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT ck_service_requests__status          CHECK (status IN ('RECEIVED', 'DIAGNOSED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'CANCELLED')),
    CONSTRAINT ck_service_requests__costs           CHECK (estimated_cost >= 0 AND actual_cost >= 0)
);

-- =====================================================================================
-- 테이블: asm.service_works
-- 설명: A/S 작업 내역 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.service_works 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),	-- 작업 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by              UUID,                                                           -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by              UUID,                                                           -- 수정자 UUID
    
    -- 작업 정보
    service_request_id      UUID                     NOT NULL,                              -- A/S 요청 식별자
    work_date               DATE                     NOT NULL,                              -- 작업 일자
    technician_id           UUID                     NOT NULL,                              -- 기술자 식별자
    work_description        TEXT                     NOT NULL,                              -- 작업 내용 설명
    
    -- 비용 정보
    labor_hours             NUMERIC(5,2)             DEFAULT 0,                             -- 작업 시간 (시간)
    labor_cost              NUMERIC(18,4)            DEFAULT 0,                             -- 인건비
    parts_cost              NUMERIC(18,4)            DEFAULT 0,                             -- 부품비
    total_cost              NUMERIC(18,4)            DEFAULT 0,                             -- 총 비용
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'COMPLETED',                   -- 작업 상태
    
    -- 제약조건
    CONSTRAINT ck_service_works__costs              CHECK (labor_cost >= 0 AND parts_cost >= 0 AND total_cost >= 0),
    CONSTRAINT ck_service_works__labor_hours        CHECK (labor_hours >= 0 AND labor_hours <= 24),
    CONSTRAINT ck_service_works__status             CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

-- =====================================================================================
-- 테이블: asm.service_parts
-- 설명: A/S 부품 사용 이력 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.service_parts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),	-- 부품 사용 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by              UUID,                                                           -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by              UUID,                                                           -- 수정자 UUID
    
    -- 부품 정보
    service_request_id      UUID                     NOT NULL,                              -- A/S 요청 식별자
    item_id                 UUID                     NOT NULL,                              -- 부품 식별자
    qty                     INTEGER                  NOT NULL,                              -- 수량
    unit_cost               NUMERIC(18,4)            NOT NULL,                              -- 단가
    total_cost              NUMERIC(18,4)            NOT NULL,                              -- 총 비용
    
    -- 제약조건
    CONSTRAINT ck_service_parts__qty                CHECK (qty > 0),
    CONSTRAINT ck_service_parts__costs              CHECK (unit_cost >= 0 AND total_cost >= 0)
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  asm.service_requests                     IS 'A/S 요청 관리 테이블';
COMMENT ON COLUMN asm.service_requests.id                  IS 'A/S 요청 고유 식별자';
COMMENT ON COLUMN asm.service_requests.created_at          IS '등록 일시';
COMMENT ON COLUMN asm.service_requests.created_by          IS '등록자 UUID';
COMMENT ON COLUMN asm.service_requests.updated_at          IS '수정 일시';
COMMENT ON COLUMN asm.service_requests.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN asm.service_requests.company_id          IS '회사 식별자';
COMMENT ON COLUMN asm.service_requests.sr_code             IS 'A/S 요청 코드';
COMMENT ON COLUMN asm.service_requests.customer_id         IS '고객 식별자';
COMMENT ON COLUMN asm.service_requests.item_id             IS '제품 식별자';
COMMENT ON COLUMN asm.service_requests.serial_number       IS '시리얼 번호';
COMMENT ON COLUMN asm.service_requests.purchase_date       IS '구매 일자';
COMMENT ON COLUMN asm.service_requests.warranty_end_date   IS '보증 종료일';
COMMENT ON COLUMN asm.service_requests.issue_description   IS '문제 설명';
COMMENT ON COLUMN asm.service_requests.service_type        IS 'A/S 유형 (REPAIR/REPLACE/MAINTENANCE/INSPECTION)';
COMMENT ON COLUMN asm.service_requests.priority            IS '우선순위 (LOW/MEDIUM/HIGH/URGENT)';
COMMENT ON COLUMN asm.service_requests.status              IS '상태 (RECEIVED/DIAGNOSED/IN_PROGRESS/COMPLETED/CLOSED/CANCELLED)';
COMMENT ON COLUMN asm.service_requests.assigned_technician_id IS '배정된 기술자 식별자';
COMMENT ON COLUMN asm.service_requests.estimated_cost      IS '예상 비용';
COMMENT ON COLUMN asm.service_requests.actual_cost         IS '실제 비용';
COMMENT ON COLUMN asm.service_requests.currency            IS '통화 (ISO 4217)';
COMMENT ON COLUMN asm.service_requests.completed_at        IS '완료 일시';
COMMENT ON COLUMN asm.service_requests.is_warranty         IS '보증기간 내 여부';
COMMENT ON COLUMN asm.service_requests.is_deleted             IS '논리 삭제 플래그';

COMMENT ON TABLE  asm.service_works                        IS 'A/S 작업 내역 관리 테이블';
COMMENT ON COLUMN asm.service_works.id                     IS '작업 고유 식별자';
COMMENT ON COLUMN asm.service_works.created_at             IS '등록 일시';
COMMENT ON COLUMN asm.service_works.created_by             IS '등록자 UUID';
COMMENT ON COLUMN asm.service_works.updated_at             IS '수정 일시';
COMMENT ON COLUMN asm.service_works.updated_by             IS '수정자 UUID';
COMMENT ON COLUMN asm.service_works.service_request_id     IS 'A/S 요청 식별자';
COMMENT ON COLUMN asm.service_works.work_date              IS '작업 일자';
COMMENT ON COLUMN asm.service_works.technician_id          IS '기술자 식별자';
COMMENT ON COLUMN asm.service_works.work_description       IS '작업 내용 설명';
COMMENT ON COLUMN asm.service_works.labor_hours            IS '작업 시간 (시간)';
COMMENT ON COLUMN asm.service_works.labor_cost             IS '인건비';
COMMENT ON COLUMN asm.service_works.parts_cost             IS '부품비';
COMMENT ON COLUMN asm.service_works.total_cost             IS '총 비용';
COMMENT ON COLUMN asm.service_works.status                 IS '작업 상태';

COMMENT ON TABLE  asm.service_parts                        IS 'A/S 부품 사용 이력 관리 테이블';
COMMENT ON COLUMN asm.service_parts.id                     IS '부품 사용 고유 식별자';
COMMENT ON COLUMN asm.service_parts.created_at             IS '등록 일시';
COMMENT ON COLUMN asm.service_parts.created_by             IS '등록자 UUID';
COMMENT ON COLUMN asm.service_parts.updated_at             IS '수정 일시';
COMMENT ON COLUMN asm.service_parts.updated_by             IS '수정자 UUID';
COMMENT ON COLUMN asm.service_parts.service_request_id     IS 'A/S 요청 식별자';
COMMENT ON COLUMN asm.service_parts.item_id                IS '부품 식별자';
COMMENT ON COLUMN asm.service_parts.qty                    IS '수량';
COMMENT ON COLUMN asm.service_parts.unit_cost              IS '단가';
COMMENT ON COLUMN asm.service_parts.total_cost             IS '총 비용';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 기본 조회 인덱스
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__company_id
    ON asm.service_requests (company_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__sr_code
    ON asm.service_requests (sr_code)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__customer_id
    ON asm.service_requests (customer_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__item_id
    ON asm.service_requests (item_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__assigned_technician_id
    ON asm.service_requests (assigned_technician_id)
 WHERE assigned_technician_id IS NOT NULL
   AND is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__status
    ON asm.service_requests (status, company_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__service_type
    ON asm.service_requests (service_type)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__priority
    ON asm.service_requests (priority)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__is_warranty
    ON asm.service_requests (is_warranty)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__created_at
    ON asm.service_requests (created_at)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_requests__completed_at
    ON asm.service_requests (completed_at)
 WHERE completed_at IS NOT NULL
   AND is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_service_works__service_request_id
    ON asm.service_works (service_request_id);

CREATE INDEX IF NOT EXISTS ix_service_works__technician_id
    ON asm.service_works (technician_id);

CREATE INDEX IF NOT EXISTS ix_service_works__work_date
    ON asm.service_works (work_date);

CREATE INDEX IF NOT EXISTS ix_service_works__status
    ON asm.service_works (status);

CREATE INDEX IF NOT EXISTS ix_service_works__created_at
    ON asm.service_works (created_at);

CREATE INDEX IF NOT EXISTS ix_service_parts__service_request_id
    ON asm.service_parts (service_request_id);

CREATE INDEX IF NOT EXISTS ix_service_parts__item_id
    ON asm.service_parts (item_id);

CREATE INDEX IF NOT EXISTS ix_service_parts__created_at
    ON asm.service_parts (created_at);

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 회사별 A/S 요청 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_service_requests__company_code
    ON asm.service_requests (company_id, sr_code)
 WHERE is_deleted = false;

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

ALTER TABLE asm.service_works ADD CONSTRAINT fk_service_works__service_request_id
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;

ALTER TABLE asm.service_parts ADD CONSTRAINT fk_service_parts__service_request_id
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;-- ============================================================================
-- ASM 스키마 인덱스 및 제약조건 추가
-- ============================================================================

-- ============================================================================
-- asm.service_requests 테이블
-- ============================================================================

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_company_id ON asm.service_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_sr_code ON asm.service_requests(sr_code);
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_customer_id ON asm.service_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_item_id ON asm.service_requests(item_id);
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_assigned_technician_id ON asm.service_requests(assigned_technician_id) WHERE assigned_technician_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_status ON asm.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_service_type ON asm.service_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_priority ON asm.service_requests(priority);
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_is_warranty ON asm.service_requests(is_warranty);
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_created_at ON asm.service_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_asm_service_requests_completed_at ON asm.service_requests(completed_at) WHERE completed_at IS NOT NULL;

-- CHECK 제약조건
ALTER TABLE asm.service_requests DROP CONSTRAINT IF EXISTS chk_asm_service_requests_service_type;
ALTER TABLE asm.service_requests ADD CONSTRAINT chk_asm_service_requests_service_type 
    CHECK (service_type IN ('REPAIR', 'REPLACE', 'MAINTENANCE', 'INSPECTION'));

ALTER TABLE asm.service_requests DROP CONSTRAINT IF EXISTS chk_asm_service_requests_priority;
ALTER TABLE asm.service_requests ADD CONSTRAINT chk_asm_service_requests_priority 
    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT'));

ALTER TABLE asm.service_requests DROP CONSTRAINT IF EXISTS chk_asm_service_requests_status;
ALTER TABLE asm.service_requests ADD CONSTRAINT chk_asm_service_requests_status 
    CHECK (status IN ('RECEIVED', 'DIAGNOSED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'CANCELLED'));

ALTER TABLE asm.service_requests DROP CONSTRAINT IF EXISTS chk_asm_service_requests_costs;
ALTER TABLE asm.service_requests ADD CONSTRAINT chk_asm_service_requests_costs 
    CHECK (estimated_cost >= 0 AND actual_cost >= 0);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE asm.service_requests IS 'A/S 요청 관리 테이블';
COMMENT ON COLUMN asm.service_requests.sr_code IS 'A/S 요청 번호';
COMMENT ON COLUMN asm.service_requests.service_type IS 'A/S 유형 (수리/교체/유지보수/점검)';
COMMENT ON COLUMN asm.service_requests.priority IS 'A/S 우선순위';
COMMENT ON COLUMN asm.service_requests.status IS 'A/S 진행 상태';
COMMENT ON COLUMN asm.service_requests.is_warranty IS '보증기간 내 여부';

-- ============================================================================
-- asm.service_works 테이블
-- ============================================================================

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_asm_service_works_service_request_id ON asm.service_works(service_request_id);
CREATE INDEX IF NOT EXISTS idx_asm_service_works_technician_id ON asm.service_works(technician_id);
CREATE INDEX IF NOT EXISTS idx_asm_service_works_work_date ON asm.service_works(work_date);
CREATE INDEX IF NOT EXISTS idx_asm_service_works_status ON asm.service_works(status);
CREATE INDEX IF NOT EXISTS idx_asm_service_works_created_at ON asm.service_works(created_at);

-- 외래키
ALTER TABLE asm.service_works DROP CONSTRAINT IF EXISTS fk_asm_service_works_service_request_id;
ALTER TABLE asm.service_works ADD CONSTRAINT fk_asm_service_works_service_request_id 
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;

-- CHECK 제약조건
ALTER TABLE asm.service_works DROP CONSTRAINT IF EXISTS chk_asm_service_works_costs;
ALTER TABLE asm.service_works ADD CONSTRAINT chk_asm_service_works_costs 
    CHECK (labor_cost >= 0 AND parts_cost >= 0 AND total_cost >= 0);

ALTER TABLE asm.service_works DROP CONSTRAINT IF EXISTS chk_asm_service_works_labor_hours;
ALTER TABLE asm.service_works ADD CONSTRAINT chk_asm_service_works_labor_hours 
    CHECK (labor_hours >= 0 AND labor_hours <= 24);

ALTER TABLE asm.service_works DROP CONSTRAINT IF EXISTS chk_asm_service_works_status;
ALTER TABLE asm.service_works ADD CONSTRAINT chk_asm_service_works_status 
    CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'CANCELLED'));

-- 테이블 및 컬럼 주석
COMMENT ON TABLE asm.service_works IS 'A/S 작업 내역 테이블';
COMMENT ON COLUMN asm.service_works.labor_hours IS '작업 시간 (시간 단위)';
COMMENT ON COLUMN asm.service_works.labor_cost IS '인건비';
COMMENT ON COLUMN asm.service_works.parts_cost IS '부품비';
COMMENT ON COLUMN asm.service_works.total_cost IS '총 비용';

-- ============================================================================
-- asm.service_parts 테이블
-- ============================================================================

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_asm_service_parts_service_request_id ON asm.service_parts(service_request_id);
CREATE INDEX IF NOT EXISTS idx_asm_service_parts_created_at ON asm.service_parts(created_at);

-- 외래키
ALTER TABLE asm.service_parts DROP CONSTRAINT IF EXISTS fk_asm_service_parts_service_request_id;
ALTER TABLE asm.service_parts ADD CONSTRAINT fk_asm_service_parts_service_request_id 
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;

-- 테이블 주석
COMMENT ON TABLE asm.service_parts IS 'A/S 부품 사용 이력 테이블';

-- ============================================================================
-- ASM 추가 CHECK 제약조건
-- ============================================================================

-- service_requests 테이블
ALTER TABLE asm.service_requests DROP CONSTRAINT IF EXISTS chk_asm_service_requests_service_type;
ALTER TABLE asm.service_requests ADD CONSTRAINT chk_asm_service_requests_service_type 
    CHECK (service_type IN ('REPAIR', 'REPLACE', 'MAINTENANCE', 'INSPECTION'));

ALTER TABLE asm.service_requests DROP CONSTRAINT IF EXISTS chk_asm_service_requests_priority;
ALTER TABLE asm.service_requests ADD CONSTRAINT chk_asm_service_requests_priority 
    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT'));

ALTER TABLE asm.service_requests DROP CONSTRAINT IF EXISTS chk_asm_service_requests_status;
ALTER TABLE asm.service_requests ADD CONSTRAINT chk_asm_service_requests_status 
    CHECK (status IN ('RECEIVED', 'DIAGNOSED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'CANCELLED'));

ALTER TABLE asm.service_requests DROP CONSTRAINT IF EXISTS chk_asm_service_requests_costs;
ALTER TABLE asm.service_requests ADD CONSTRAINT chk_asm_service_requests_costs 
    CHECK (estimated_cost >= 0 AND actual_cost >= 0);

-- service_works 테이블
ALTER TABLE asm.service_works DROP CONSTRAINT IF EXISTS chk_asm_service_works_costs;
ALTER TABLE asm.service_works ADD CONSTRAINT chk_asm_service_works_costs 
    CHECK (labor_cost >= 0 AND parts_cost >= 0 AND total_cost >= 0);

ALTER TABLE asm.service_works DROP CONSTRAINT IF EXISTS chk_asm_service_works_labor_hours;
ALTER TABLE asm.service_works ADD CONSTRAINT chk_asm_service_works_labor_hours 
    CHECK (labor_hours >= 0 AND labor_hours <= 24);

ALTER TABLE asm.service_works DROP CONSTRAINT IF EXISTS chk_asm_service_works_status;
ALTER TABLE asm.service_works ADD CONSTRAINT chk_asm_service_works_status 
    CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'CANCELLED'));

-- ============================================================================
-- ASM 스키마 추가 컬럼 주석
-- ============================================================================

-- service_requests 테이블 상세 주석
COMMENT ON COLUMN asm.service_requests.id IS 'A/S 요청 고유 식별자';
COMMENT ON COLUMN asm.service_requests.company_id IS '회사 ID';
COMMENT ON COLUMN asm.service_requests.sr_code IS 'A/S 요청 코드';
COMMENT ON COLUMN asm.service_requests.customer_id IS '고객 ID';
COMMENT ON COLUMN asm.service_requests.item_id IS '제품 ID';
COMMENT ON COLUMN asm.service_requests.serial_number IS '제품 시리얼 번호';
COMMENT ON COLUMN asm.service_requests.purchase_date IS '구매 일자';
COMMENT ON COLUMN asm.service_requests.warranty_end_date IS '보증 종료일';
COMMENT ON COLUMN asm.service_requests.issue_description IS '문제 설명';
COMMENT ON COLUMN asm.service_requests.service_type IS 'A/S 유형 (수리, 교체, 유지보수, 점검)';
COMMENT ON COLUMN asm.service_requests.priority IS '우선순위 (낮음, 보통, 높음, 긴급)';
COMMENT ON COLUMN asm.service_requests.status IS 'A/S 상태';
COMMENT ON COLUMN asm.service_requests.assigned_technician_id IS '배정된 기술자 ID';
COMMENT ON COLUMN asm.service_requests.estimated_cost IS '예상 비용';
COMMENT ON COLUMN asm.service_requests.actual_cost IS '실제 비용';
COMMENT ON COLUMN asm.service_requests.currency IS '통화';
COMMENT ON COLUMN asm.service_requests.completed_at IS '완료 일시';
COMMENT ON COLUMN asm.service_requests.is_warranty IS '보증기간 내 여부';
COMMENT ON COLUMN asm.service_requests.is_deleted IS '삭제 여부';
COMMENT ON COLUMN asm.service_requests.created_at IS '생성일시';
COMMENT ON COLUMN asm.service_requests.created_by IS '생성자 ID';
COMMENT ON COLUMN asm.service_requests.updated_at IS '수정일시';
COMMENT ON COLUMN asm.service_requests.updated_by IS '수정자 ID';

-- service_works 테이블 상세 주석
COMMENT ON COLUMN asm.service_works.id IS 'A/S 작업 고유 식별자';
COMMENT ON COLUMN asm.service_works.service_request_id IS 'A/S 요청 ID';
COMMENT ON COLUMN asm.service_works.work_date IS '작업 일자';
COMMENT ON COLUMN asm.service_works.technician_id IS '작업 기술자 ID';
COMMENT ON COLUMN asm.service_works.work_description IS '작업 내용 설명';
COMMENT ON COLUMN asm.service_works.labor_hours IS '작업 시간 (시간)';
COMMENT ON COLUMN asm.service_works.labor_cost IS '인건비';
COMMENT ON COLUMN asm.service_works.parts_cost IS '부품비';
COMMENT ON COLUMN asm.service_works.total_cost IS '총 비용';
COMMENT ON COLUMN asm.service_works.status IS '작업 상태';
COMMENT ON COLUMN asm.service_works.created_at IS '생성일시';
COMMENT ON COLUMN asm.service_works.created_by IS '생성자 ID';
COMMENT ON COLUMN asm.service_works.updated_at IS '수정일시';
COMMENT ON COLUMN asm.service_works.updated_by IS '수정자 ID';

-- service_parts 테이블 상세 주석
COMMENT ON COLUMN asm.service_parts.id IS '사용 부품 고유 식별자';
COMMENT ON COLUMN asm.service_parts.service_request_id IS 'A/S 요청 ID';
COMMENT ON COLUMN asm.service_parts.created_at IS '생성일시';
COMMENT ON COLUMN asm.service_parts.created_by IS '생성자 ID';
COMMENT ON COLUMN asm.service_parts.updated_at IS '수정일시';
COMMENT ON COLUMN asm.service_parts.updated_by IS '수정자 ID';

