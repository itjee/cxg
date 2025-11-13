-- ============================================================================
-- After-Sales Management Schema (asm)
-- ============================================================================
-- Description: A/S 및 고객 지원 관리 스키마 (A/S 수리/교체, 문의/지원, FAQ)
-- Database: tnnt_db (Tenant Database)
-- Schema: asm
-- Created: 2024-10-20
-- Updated: 2025-01-20 (CSM 통합)
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS asm;

COMMENT ON SCHEMA asm IS 'ASM: A/S 및 고객지원 스키마 (수리/교체, 문의/지원, FAQ)';

-- =====================================================================================
-- 테이블: asm.service_requests
-- 설명: A/S 요청 및 처리 정보를 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.service_requests 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- A/S 요청 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- A/S 요청 기본 정보
    sr_code                 VARCHAR(50)              NOT NULL,                                           -- A/S 요청 코드
    customer_id             UUID                     NOT NULL,                                           -- 고객 식별자
    product_id              UUID                     NOT NULL,                                           -- 제품 식별자
    serial_number           VARCHAR(100),                                                                -- 제품 시리얼 번호
    
    -- 구매 및 보증 정보
    purchase_date           DATE,                                                                        -- 제품 구매 일자
    warranty_end_date       DATE,                                                                        -- 보증 종료일
    is_warranty             BOOLEAN                  DEFAULT false,                                      -- 보증기간 내 A/S 여부
    
    -- 문제 정보
    issue_description       TEXT                     NOT NULL,                                           -- 문제 및 고장 내용 설명
    issue_category          VARCHAR(50),                                                                 -- 문제 카테고리 (하드웨어/소프트웨어/외관/기타) -- 추가
    
    -- A/S 처리 정보
    service_type            VARCHAR(20)              DEFAULT 'REPAIR',                                   -- A/S 유형 (REPAIR/REPLACE/MAINTENANCE/INSPECTION)
    priority                VARCHAR(20)              DEFAULT 'MEDIUM',                                   -- 우선순위 (LOW/MEDIUM/HIGH/URGENT)
    status                  VARCHAR(20)              DEFAULT 'RECEIVED',                                 -- 상태 (RECEIVED/DIAGNOSED/IN_PROGRESS/COMPLETED/CLOSED/CANCELLED)
    assigned_technician_id  UUID,                                                                        -- 배정된 기술자 식별자
    
    -- 일정 정보
    scheduled_date          DATE,                                                                        -- 예약 작업일 -- 추가
    expected_completion_date DATE,                                                                       -- 예상 완료일 -- 추가
    completed_at            TIMESTAMP                WITH TIME ZONE,                                     -- 실제 완료 일시
    
    -- 비용 정보
    estimated_cost          NUMERIC(18,4)            DEFAULT 0,                                          -- 예상 비용
    actual_cost             NUMERIC(18,4)            DEFAULT 0,                                          -- 실제 비용
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 코드 (ISO 4217)
    
    -- 고객 피드백
    customer_notes          TEXT,                                                                        -- 고객 요청사항 -- 추가
    technician_notes        TEXT,                                                                        -- 기술자 메모 -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- A/S 유형 체크 (REPAIR: 수리, REPLACE: 교체, MAINTENANCE: 유지보수, INSPECTION: 점검)
    CONSTRAINT ck_asm_service_requests__service_type    CHECK (service_type IN ('REPAIR', 'REPLACE', 'MAINTENANCE', 'INSPECTION')),
    -- 우선순위 체크 (LOW: 낮음, MEDIUM: 보통, HIGH: 높음, URGENT: 긴급)
    CONSTRAINT ck_asm_service_requests__priority        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    -- 상태 체크 (RECEIVED: 접수, DIAGNOSED: 진단완료, IN_PROGRESS: 진행중, COMPLETED: 완료, CLOSED: 종료, CANCELLED: 취소)
    CONSTRAINT ck_asm_service_requests__status          CHECK (status IN ('RECEIVED', 'DIAGNOSED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'CANCELLED')),
    -- 비용 양수 체크
    CONSTRAINT ck_asm_service_requests__costs           CHECK (estimated_cost >= 0 AND actual_cost >= 0),
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_asm_service_requests__currency        CHECK (currency ~ '^[A-Z]{3}$'),
    -- 날짜 유효성 체크 (보증 종료일이 구매일보다 이후)
    CONSTRAINT ck_asm_service_requests__warranty_dates  CHECK (warranty_end_date IS NULL OR purchase_date IS NULL OR warranty_end_date >= purchase_date)
);

COMMENT ON TABLE  asm.service_requests                           IS 'A/S 요청 및 처리 정보 관리 테이블';
COMMENT ON COLUMN asm.service_requests.id                        IS 'A/S 요청 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.service_requests.created_at                IS '등록 일시';
COMMENT ON COLUMN asm.service_requests.created_by                IS '등록자 UUID';
COMMENT ON COLUMN asm.service_requests.updated_at                IS '수정 일시';
COMMENT ON COLUMN asm.service_requests.updated_by                IS '수정자 UUID';
COMMENT ON COLUMN asm.service_requests.sr_code                   IS 'A/S 요청 코드';
COMMENT ON COLUMN asm.service_requests.customer_id               IS '고객 식별자';
COMMENT ON COLUMN asm.service_requests.product_id                IS '제품 식별자';
COMMENT ON COLUMN asm.service_requests.serial_number             IS '제품 시리얼 번호';
COMMENT ON COLUMN asm.service_requests.purchase_date             IS '제품 구매 일자';
COMMENT ON COLUMN asm.service_requests.warranty_end_date         IS '보증 종료일';
COMMENT ON COLUMN asm.service_requests.is_warranty               IS '보증기간 내 A/S 여부';
COMMENT ON COLUMN asm.service_requests.issue_description         IS '문제 및 고장 내용 설명';
COMMENT ON COLUMN asm.service_requests.issue_category            IS '문제 카테고리 (하드웨어/소프트웨어/외관/기타)';
COMMENT ON COLUMN asm.service_requests.service_type              IS 'A/S 유형 (REPAIR: 수리/REPLACE: 교체/MAINTENANCE: 유지보수/INSPECTION: 점검)';
COMMENT ON COLUMN asm.service_requests.priority                  IS '우선순위 (LOW: 낮음/MEDIUM: 보통/HIGH: 높음/URGENT: 긴급)';
COMMENT ON COLUMN asm.service_requests.status                    IS '상태 (RECEIVED: 접수/DIAGNOSED: 진단완료/IN_PROGRESS: 진행중/COMPLETED: 완료/CLOSED: 종료/CANCELLED: 취소)';
COMMENT ON COLUMN asm.service_requests.assigned_technician_id    IS '배정된 기술자 식별자';
COMMENT ON COLUMN asm.service_requests.scheduled_date            IS '예약 작업일';
COMMENT ON COLUMN asm.service_requests.expected_completion_date  IS '예상 완료일';
COMMENT ON COLUMN asm.service_requests.completed_at              IS '실제 완료 일시';
COMMENT ON COLUMN asm.service_requests.estimated_cost            IS '예상 비용';
COMMENT ON COLUMN asm.service_requests.actual_cost               IS '실제 비용';
COMMENT ON COLUMN asm.service_requests.currency                  IS '통화 코드 (ISO 4217)';
COMMENT ON COLUMN asm.service_requests.customer_notes            IS '고객 요청사항';
COMMENT ON COLUMN asm.service_requests.technician_notes          IS '기술자 메모';
COMMENT ON COLUMN asm.service_requests.is_deleted                IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: asm.service_works
-- 설명: A/S 작업 내역 및 진행 상황을 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.service_works 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 작업 내역 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 작업 기본 정보
    service_request_id      UUID                     NOT NULL,                                           -- A/S 요청 식별자
    work_date               DATE                     NOT NULL,                                           -- 작업 실시 일자
    technician_id           UUID                     NOT NULL,                                           -- 작업 기술자 식별자
    work_description        TEXT                     NOT NULL,                                           -- 작업 내용 상세 설명
    
    -- 작업 시간 정보
    work_start_time         TIME,                                                                        -- 작업 시작 시간 -- 추가
    work_end_time           TIME,                                                                        -- 작업 종료 시간 -- 추가
    labor_hours             NUMERIC(5,2)             DEFAULT 0,                                          -- 작업 소요 시간 (시간 단위)
    
    -- 비용 정보
    labor_cost              NUMERIC(18,4)            DEFAULT 0,                                          -- 인건비
    parts_cost              NUMERIC(18,4)            DEFAULT 0,                                          -- 부품비
    other_cost              NUMERIC(18,4)            DEFAULT 0,                                          -- 기타 비용 -- 추가
    total_cost              NUMERIC(18,4)            DEFAULT 0,                                          -- 총 비용 (인건비 + 부품비 + 기타)
    
    -- 작업 결과
    work_result             VARCHAR(20),                                                                 -- 작업 결과 (SUCCESS/PARTIAL/FAILED) -- 추가
    result_notes            TEXT,                                                                        -- 작업 결과 메모 -- 추가
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'COMPLETED',                                -- 작업 상태 (IN_PROGRESS/COMPLETED/CANCELLED)
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 비용 양수 체크
    CONSTRAINT ck_asm_service_works__costs              CHECK (labor_cost >= 0 AND parts_cost >= 0 AND other_cost >= 0 AND total_cost >= 0),
    -- 작업시간 범위 체크 (0~24시간)
    CONSTRAINT ck_asm_service_works__labor_hours        CHECK (labor_hours >= 0 AND labor_hours <= 24),
    -- 작업 상태 체크 (IN_PROGRESS: 진행중, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_asm_service_works__status             CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    -- 작업 결과 체크 (SUCCESS: 성공, PARTIAL: 부분성공, FAILED: 실패)
    CONSTRAINT ck_asm_service_works__work_result        CHECK (work_result IS NULL OR work_result IN ('SUCCESS', 'PARTIAL', 'FAILED')),
    -- 시간 유효성 체크 (종료시간이 시작시간보다 이후)
    CONSTRAINT ck_asm_service_works__time_range         CHECK (work_end_time IS NULL OR work_start_time IS NULL OR work_end_time >= work_start_time)
);

COMMENT ON TABLE  asm.service_works                              IS 'A/S 작업 내역 및 진행 상황 관리 테이블';
COMMENT ON COLUMN asm.service_works.id                           IS '작업 내역 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.service_works.created_at                   IS '등록 일시';
COMMENT ON COLUMN asm.service_works.created_by                   IS '등록자 UUID';
COMMENT ON COLUMN asm.service_works.updated_at                   IS '수정 일시';
COMMENT ON COLUMN asm.service_works.updated_by                   IS '수정자 UUID';
COMMENT ON COLUMN asm.service_works.service_request_id           IS 'A/S 요청 식별자';
COMMENT ON COLUMN asm.service_works.work_date                    IS '작업 실시 일자';
COMMENT ON COLUMN asm.service_works.technician_id                IS '작업 기술자 식별자';
COMMENT ON COLUMN asm.service_works.work_description             IS '작업 내용 상세 설명';
COMMENT ON COLUMN asm.service_works.work_start_time              IS '작업 시작 시간';
COMMENT ON COLUMN asm.service_works.work_end_time                IS '작업 종료 시간';
COMMENT ON COLUMN asm.service_works.labor_hours                  IS '작업 소요 시간 (시간 단위)';
COMMENT ON COLUMN asm.service_works.labor_cost                   IS '인건비';
COMMENT ON COLUMN asm.service_works.parts_cost                   IS '부품비';
COMMENT ON COLUMN asm.service_works.other_cost                   IS '기타 비용';
COMMENT ON COLUMN asm.service_works.total_cost                   IS '총 비용 (인건비 + 부품비 + 기타)';
COMMENT ON COLUMN asm.service_works.work_result                  IS '작업 결과 (SUCCESS: 성공/PARTIAL: 부분성공/FAILED: 실패)';
COMMENT ON COLUMN asm.service_works.result_notes                 IS '작업 결과 메모';
COMMENT ON COLUMN asm.service_works.status                       IS '작업 상태 (IN_PROGRESS: 진행중/COMPLETED: 완료/CANCELLED: 취소)';
COMMENT ON COLUMN asm.service_works.is_deleted                   IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: asm.service_parts
-- 설명: A/S 작업시 사용된 부품 내역을 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.service_parts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 부품 사용 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 부품 사용 기본 정보
    service_request_id      UUID                     NOT NULL,                                           -- A/S 요청 식별자
    product_id              UUID                     NOT NULL,                                           -- 부품(제품) 식별자
    
    -- 부품 정보
    part_name               VARCHAR(200),                                                                -- 부품명 -- 추가
    part_code               VARCHAR(50),                                                                 -- 부품 코드 -- 추가
    serial_number           VARCHAR(100),                                                                -- 부품 시리얼 번호 -- 추가
    
    -- 수량 및 가격
    qty                     INTEGER                  NOT NULL,                                           -- 사용 수량
    unit_cost               NUMERIC(18,4)            NOT NULL,                                           -- 부품 단가
    total_cost              NUMERIC(18,4)            NOT NULL,                                           -- 총 비용 (단가 × 수량)
    
    -- 부품 상태
    part_condition          VARCHAR(20),                                                                 -- 부품 상태 (NEW/REFURBISHED/USED) -- 추가
    warranty_months         INTEGER,                                                                     -- 부품 보증 개월수 -- 추가
    
    -- 비고
    notes                   TEXT,                                                                        -- 비고 -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 수량 양수 체크 (1개 이상)
    CONSTRAINT ck_asm_service_parts__qty                CHECK (qty > 0),
    -- 비용 양수 체크
    CONSTRAINT ck_asm_service_parts__costs              CHECK (unit_cost >= 0 AND total_cost >= 0),
    -- 부품 상태 체크 (NEW: 신품, REFURBISHED: 리퍼, USED: 중고)
    CONSTRAINT ck_asm_service_parts__part_condition     CHECK (part_condition IS NULL OR part_condition IN ('NEW', 'REFURBISHED', 'USED')),
    -- 보증 개월수 양수 체크
    CONSTRAINT ck_asm_service_parts__warranty_months    CHECK (warranty_months IS NULL OR warranty_months >= 0)
);

COMMENT ON TABLE  asm.service_parts                              IS 'A/S 작업시 사용된 부품 내역 관리 테이블';
COMMENT ON COLUMN asm.service_parts.id                           IS '부품 사용 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.service_parts.created_at                   IS '등록 일시';
COMMENT ON COLUMN asm.service_parts.created_by                   IS '등록자 UUID';
COMMENT ON COLUMN asm.service_parts.updated_at                   IS '수정 일시';
COMMENT ON COLUMN asm.service_parts.updated_by                   IS '수정자 UUID';
COMMENT ON COLUMN asm.service_parts.service_request_id           IS 'A/S 요청 식별자';
COMMENT ON COLUMN asm.service_parts.product_id                   IS '부품(제품) 식별자';
COMMENT ON COLUMN asm.service_parts.part_name                    IS '부품명';
COMMENT ON COLUMN asm.service_parts.part_code                    IS '부품 코드';
COMMENT ON COLUMN asm.service_parts.serial_number                IS '부품 시리얼 번호';
COMMENT ON COLUMN asm.service_parts.qty                          IS '사용 수량';
COMMENT ON COLUMN asm.service_parts.unit_cost                    IS '부품 단가';
COMMENT ON COLUMN asm.service_parts.total_cost                   IS '총 비용 (단가 × 수량)';
COMMENT ON COLUMN asm.service_parts.part_condition               IS '부품 상태 (NEW: 신품/REFURBISHED: 리퍼/USED: 중고)';
COMMENT ON COLUMN asm.service_parts.warranty_months              IS '부품 보증 개월수';
COMMENT ON COLUMN asm.service_parts.notes                        IS '비고';
COMMENT ON COLUMN asm.service_parts.is_deleted                   IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- service_requests 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_asm_service_requests__sr_code
    ON asm.service_requests (sr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__sr_code IS 'A/S 요청 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__customer_id
    ON asm.service_requests (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__customer_id IS '고객별 A/S 요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__product_id
    ON asm.service_requests (product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__product_id IS '제품별 A/S 요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__assigned_technician_id
    ON asm.service_requests (assigned_technician_id)
 WHERE assigned_technician_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__assigned_technician_id IS '기술자별 배정된 A/S 요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__status
    ON asm.service_requests (status, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__status IS 'A/S 요청 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__service_type
    ON asm.service_requests (service_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__service_type IS 'A/S 유형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__priority
    ON asm.service_requests (priority, status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__priority IS 'A/S 우선순위 및 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__is_warranty
    ON asm.service_requests (is_warranty)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__is_warranty IS '보증기간 여부별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__created_at
    ON asm.service_requests (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__created_at IS 'A/S 요청 등록일시 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__completed_at
    ON asm.service_requests (completed_at DESC)
 WHERE completed_at IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__completed_at IS 'A/S 요청 완료일시 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__serial_number
    ON asm.service_requests (serial_number)
 WHERE serial_number IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__serial_number IS '시리얼 번호별 A/S 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_requests__scheduled_date
    ON asm.service_requests (scheduled_date)
 WHERE scheduled_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_service_requests__scheduled_date IS '예약 작업일별 조회 인덱스';

-- service_works 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_asm_service_works__service_request_id
    ON asm.service_works (service_request_id, work_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_works__service_request_id IS 'A/S 요청별 작업 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_works__technician_id
    ON asm.service_works (technician_id, work_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_works__technician_id IS '기술자별 작업 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_works__work_date
    ON asm.service_works (work_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_works__work_date IS '작업일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_works__status
    ON asm.service_works (status, work_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_works__status IS '작업 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_works__created_at
    ON asm.service_works (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_works__created_at IS '작업 등록일시 조회 인덱스';

-- service_parts 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_asm_service_parts__service_request_id
    ON asm.service_parts (service_request_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_parts__service_request_id IS 'A/S 요청별 사용 부품 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_parts__product_id
    ON asm.service_parts (product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_parts__product_id IS '부품별 사용 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_parts__created_at
    ON asm.service_parts (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_service_parts__created_at IS '부품 사용 등록일시 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_service_parts__part_code
    ON asm.service_parts (part_code)
 WHERE part_code IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_service_parts__part_code IS '부품 코드별 사용 이력 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- A/S 요청 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_asm_service_requests__code
    ON asm.service_requests (sr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_asm_service_requests__code IS 'A/S 요청 코드 유니크 제약 (삭제되지 않은 데이터만)';

-- 지원 티켓 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_asm_support_tickets__code
    ON asm.support_tickets (ticket_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_asm_support_tickets__code IS '지원 티켓 코드 유니크 제약';

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

-- service_works 테이블 외래키
-- A/S 요청 참조 외래키 (A/S 요청 삭제 시 작업 내역도 함께 삭제)
ALTER TABLE asm.service_works ADD CONSTRAINT fk_asm_service_works__service_request_id
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_asm_service_works__service_request_id ON asm.service_works IS 'A/S 요청 참조 외래키 (CASCADE 삭제)';

-- service_parts 테이블 외래키
-- A/S 요청 참조 외래키 (A/S 요청 삭제 시 부품 내역도 함께 삭제)
ALTER TABLE asm.service_parts ADD CONSTRAINT fk_asm_service_parts__service_request_id
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_asm_service_parts__service_request_id ON asm.service_parts IS 'A/S 요청 참조 외래키 (CASCADE 삭제)';

-- ticket_comments 테이블 외래키
-- 지원 티켓 참조 외래키 (티켓 삭제 시 댓글도 함께 삭제)
ALTER TABLE asm.ticket_comments ADD CONSTRAINT fk_asm_ticket_comments__ticket_id
    FOREIGN KEY (ticket_id) REFERENCES asm.support_tickets(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_asm_ticket_comments__ticket_id ON asm.ticket_comments IS '지원 티켓 참조 외래키 (CASCADE 삭제)';

-- support_tickets 테이블 외래키
-- A/S 요청 연계 외래키 (A/S 요청 삭제 시 연계 정보만 NULL로 설정)
ALTER TABLE asm.support_tickets ADD CONSTRAINT fk_asm_support_tickets__linked_service_request_id
    FOREIGN KEY (linked_service_request_id) REFERENCES asm.service_requests(id) ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_asm_support_tickets__linked_service_request_id ON asm.support_tickets IS 'A/S 요청 연계 외래키 (SET NULL)';

-- =====================================================================================
-- 고객 지원 관리 (Customer Support Management - from CSM)
-- =====================================================================================
-- 통합일: 2025-01-20
-- 사유: 고객 서비스팀에서 문의/지원과 A/S를 함께 관리
-- =====================================================================================
-- 설명: 고객 문의 및 지원 티켓을 관리하는 테이블 (기술지원, 제품문의, 불만사항)
-- 작성일: 2025-01-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.support_tickets 
(
    -- 기본 식별자 및 감사 필드
    id                        UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 지원 티켓 고유 식별자 (UUID)
    created_at                TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by                UUID,                                                                        -- 등록자 UUID
    updated_at                TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by                UUID,                                                                        -- 수정자 UUID
    
    -- 티켓 기본 정보
    ticket_code               VARCHAR(50)              NOT NULL,                                           -- 티켓 코드
    customer_id               UUID,                                                                        -- 고객 식별자 (NULL 가능: 비회원 문의)
    
    -- 문의자 정보 (비회원 문의 시 필수)
    contact_name              VARCHAR(100),                                                                -- 문의자 이름
    contact_email             VARCHAR(255),                                                                -- 문의자 이메일
    contact_phone             VARCHAR(50),                                                                 -- 문의자 연락처
    
    -- 문의 내용
    subject                   VARCHAR(255)             NOT NULL,                                           -- 문의 제목
    description               TEXT,                                                                        -- 문의 상세 내용
    
    -- 분류 및 우선순위
    category                  VARCHAR(50),                                                                 -- 카테고리 (기술지원/제품문의/불만사항/제안)
    sub_category              VARCHAR(50),                                                                 -- 하위 카테고리 -- 추가
    priority                  VARCHAR(20)              DEFAULT 'MEDIUM',                                   -- 우선순위 (LOW/MEDIUM/HIGH/URGENT)
    
    -- 처리 정보
    status                    VARCHAR(20)              DEFAULT 'OPEN',                                     -- 상태 (OPEN/IN_PROGRESS/RESOLVED/CLOSED/CANCELLED)
    assigned_to               UUID,                                                                        -- 담당자 식별자
    
    -- 완료 정보
    resolved_at               TIMESTAMP                WITH TIME ZONE,                                     -- 해결 일시
    closed_at                 TIMESTAMP                WITH TIME ZONE,                                     -- 종료 일시 -- 추가
    resolution                TEXT,                                                                        -- 해결 내용
    resolution_time_minutes   INTEGER,                                                                     -- 해결 소요 시간 (분) -- 추가
    
    -- 만족도 평가
    satisfaction_rating       INTEGER,                                                                     -- 만족도 평가 (1-5점)
    satisfaction_comment      TEXT,                                                                        -- 만족도 평가 코멘트 -- 추가
    
    -- A/S 연계 (티켓이 A/S로 전환된 경우)
    linked_service_request_id UUID,                                                                        -- 연계된 A/S 요청 식별자
    
    -- 상태 관리
    is_deleted                BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 우선순위 체크 (LOW: 낮음, MEDIUM: 보통, HIGH: 높음, URGENT: 긴급)
    CONSTRAINT ck_asm_support_tickets__priority         CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    -- 상태 체크 (OPEN: 접수, IN_PROGRESS: 진행중, RESOLVED: 해결, CLOSED: 종료, CANCELLED: 취소)
    CONSTRAINT ck_asm_support_tickets__status           CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED')),
    -- 만족도 범위 체크 (1~5점)
    CONSTRAINT ck_asm_support_tickets__satisfaction     CHECK (satisfaction_rating IS NULL OR satisfaction_rating BETWEEN 1 AND 5),
    -- 이메일 형식 체크 (표준 이메일 형식)
    CONSTRAINT ck_asm_support_tickets__email            CHECK (contact_email IS NULL OR contact_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    -- 해결 소요 시간 양수 체크
    CONSTRAINT ck_asm_support_tickets__resolution_time  CHECK (resolution_time_minutes IS NULL OR resolution_time_minutes >= 0)
);

COMMENT ON TABLE  asm.support_tickets                             IS '고객 문의 및 지원 티켓 관리 테이블 (기술지원/제품문의/불만사항)';
COMMENT ON COLUMN asm.support_tickets.id                          IS '지원 티켓 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.support_tickets.created_at                  IS '등록 일시';
COMMENT ON COLUMN asm.support_tickets.created_by                  IS '등록자 UUID';
COMMENT ON COLUMN asm.support_tickets.updated_at                  IS '수정 일시';
COMMENT ON COLUMN asm.support_tickets.updated_by                  IS '수정자 UUID';
COMMENT ON COLUMN asm.support_tickets.ticket_code                 IS '티켓 코드';
COMMENT ON COLUMN asm.support_tickets.customer_id                 IS '고객 식별자 (NULL: 비회원 문의)';
COMMENT ON COLUMN asm.support_tickets.contact_name                IS '문의자 이름';
COMMENT ON COLUMN asm.support_tickets.contact_email               IS '문의자 이메일';
COMMENT ON COLUMN asm.support_tickets.contact_phone               IS '문의자 연락처';
COMMENT ON COLUMN asm.support_tickets.subject                     IS '문의 제목';
COMMENT ON COLUMN asm.support_tickets.description                 IS '문의 상세 내용';
COMMENT ON COLUMN asm.support_tickets.category                    IS '카테고리 (기술지원/제품문의/불만사항/제안 등)';
COMMENT ON COLUMN asm.support_tickets.sub_category                IS '하위 카테고리';
COMMENT ON COLUMN asm.support_tickets.priority                    IS '우선순위 (LOW: 낮음/MEDIUM: 보통/HIGH: 높음/URGENT: 긴급)';
COMMENT ON COLUMN asm.support_tickets.status                      IS '상태 (OPEN: 접수/IN_PROGRESS: 진행중/RESOLVED: 해결/CLOSED: 종료/CANCELLED: 취소)';
COMMENT ON COLUMN asm.support_tickets.assigned_to                 IS '담당자 식별자';
COMMENT ON COLUMN asm.support_tickets.resolved_at                 IS '해결 일시';
COMMENT ON COLUMN asm.support_tickets.closed_at                   IS '종료 일시';
COMMENT ON COLUMN asm.support_tickets.resolution                  IS '해결 내용';
COMMENT ON COLUMN asm.support_tickets.resolution_time_minutes     IS '해결 소요 시간 (분 단위)';
COMMENT ON COLUMN asm.support_tickets.satisfaction_rating         IS '만족도 평가 (1-5점)';
COMMENT ON COLUMN asm.support_tickets.satisfaction_comment        IS '만족도 평가 코멘트';
COMMENT ON COLUMN asm.support_tickets.linked_service_request_id   IS '연계된 A/S 요청 식별자 (티켓이 A/S로 전환된 경우)';
COMMENT ON COLUMN asm.support_tickets.is_deleted                  IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: asm.ticket_comments
-- 설명: 지원 티켓의 댓글 및 처리 이력을 관리하는 테이블
-- 작성일: 2025-01-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.ticket_comments 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 댓글 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 티켓 참조
    ticket_id               UUID                     NOT NULL,                                           -- 티켓 식별자
    
    -- 댓글 내용
    comment_text            TEXT                     NOT NULL,                                           -- 댓글 내용
    comment_type            VARCHAR(20)              DEFAULT 'COMMENT',                                  -- 댓글 유형 (COMMENT/STATUS_CHANGE/ASSIGNMENT) -- 추가
    
    -- 댓글 속성
    is_internal             BOOLEAN                  DEFAULT false,                                      -- 내부 메모 여부 (true: 내부용, false: 고객 공개)
    
    -- 첨부파일
    attachments             JSONB,                                                                       -- 첨부파일 정보 (JSON 배열) -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 댓글 유형 체크 (COMMENT: 일반댓글, STATUS_CHANGE: 상태변경, ASSIGNMENT: 담당자배정)
    CONSTRAINT ck_asm_ticket_comments__comment_type     CHECK (comment_type IN ('COMMENT', 'STATUS_CHANGE', 'ASSIGNMENT'))
);

COMMENT ON TABLE  asm.ticket_comments                            IS '지원 티켓의 댓글 및 처리 이력 관리 테이블';
COMMENT ON COLUMN asm.ticket_comments.id                         IS '댓글 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.ticket_comments.created_at                 IS '등록 일시';
COMMENT ON COLUMN asm.ticket_comments.created_by                 IS '등록자 UUID';
COMMENT ON COLUMN asm.ticket_comments.updated_at                 IS '수정 일시';
COMMENT ON COLUMN asm.ticket_comments.updated_by                 IS '수정자 UUID';
COMMENT ON COLUMN asm.ticket_comments.ticket_id                  IS '티켓 식별자';
COMMENT ON COLUMN asm.ticket_comments.comment_text               IS '댓글 내용';
COMMENT ON COLUMN asm.ticket_comments.comment_type               IS '댓글 유형 (COMMENT: 일반댓글/STATUS_CHANGE: 상태변경/ASSIGNMENT: 담당자배정)';
COMMENT ON COLUMN asm.ticket_comments.is_internal                IS '내부 메모 여부 (true: 내부용, false: 고객 공개)';
COMMENT ON COLUMN asm.ticket_comments.attachments                IS '첨부파일 정보 (JSON 배열 형식: [{"name": "file.pdf", "url": "..."}])';
COMMENT ON COLUMN asm.ticket_comments.is_deleted                 IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: asm.faqs
-- 설명: 자주 묻는 질문(FAQ) 정보를 관리하는 테이블
-- 작성일: 2025-01-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.faqs 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- FAQ 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- FAQ 분류
    category                VARCHAR(50),                                                                 -- 카테고리 (제품/기술지원/정책/기타)
    sub_category            VARCHAR(50),                                                                 -- 하위 카테고리 -- 추가
    tags                    VARCHAR(200),                                                                -- 태그 (쉼표 구분) -- 추가
    
    -- FAQ 내용
    question                TEXT                     NOT NULL,                                           -- 질문
    answer                  TEXT                     NOT NULL,                                           -- 답변
    answer_summary          VARCHAR(500),                                                                -- 답변 요약 -- 추가
    
    -- 정렬 및 통계
    sort_order              INTEGER                  DEFAULT 0,                                          -- 정렬 순서
    view_count              INTEGER                  DEFAULT 0,                                          -- 조회수
    helpful_count           INTEGER                  DEFAULT 0,                                          -- 도움됨 카운트 -- 추가
    not_helpful_count       INTEGER                  DEFAULT 0,                                          -- 도움안됨 카운트 -- 추가
    
    -- 링크 정보
    related_articles        JSONB,                                                                       -- 관련 문서 (JSON 배열) -- 추가
    video_url               VARCHAR(500),                                                                -- 동영상 URL -- 추가
    
    -- 상태 관리
    is_published            BOOLEAN                  DEFAULT true,                                       -- 공개 여부
    is_featured             BOOLEAN                  DEFAULT false,                                      -- 추천 FAQ 여부 -- 추가
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 정렬 순서 양수 체크
    CONSTRAINT ck_asm_faqs__sort_order              CHECK (sort_order >= 0),
    -- 조회수 양수 체크
    CONSTRAINT ck_asm_faqs__view_count              CHECK (view_count >= 0),
    -- 도움됨 카운트 양수 체크
    CONSTRAINT ck_asm_faqs__helpful_count           CHECK (helpful_count >= 0),
    -- 도움안됨 카운트 양수 체크
    CONSTRAINT ck_asm_faqs__not_helpful_count       CHECK (not_helpful_count >= 0)
);

COMMENT ON TABLE  asm.faqs                                       IS '자주 묻는 질문(FAQ) 정보 관리 테이블';
COMMENT ON COLUMN asm.faqs.id                                    IS 'FAQ 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.faqs.created_at                            IS '등록 일시';
COMMENT ON COLUMN asm.faqs.created_by                            IS '등록자 UUID';
COMMENT ON COLUMN asm.faqs.updated_at                            IS '수정 일시';
COMMENT ON COLUMN asm.faqs.updated_by                            IS '수정자 UUID';
COMMENT ON COLUMN asm.faqs.category                              IS '카테고리 (제품/기술지원/정책/기타)';
COMMENT ON COLUMN asm.faqs.sub_category                          IS '하위 카테고리';
COMMENT ON COLUMN asm.faqs.tags                                  IS '태그 (쉼표로 구분)';
COMMENT ON COLUMN asm.faqs.question                              IS '질문';
COMMENT ON COLUMN asm.faqs.answer                                IS '답변';
COMMENT ON COLUMN asm.faqs.answer_summary                        IS '답변 요약';
COMMENT ON COLUMN asm.faqs.sort_order                            IS '정렬 순서';
COMMENT ON COLUMN asm.faqs.view_count                            IS '조회수';
COMMENT ON COLUMN asm.faqs.helpful_count                         IS '도움됨 카운트';
COMMENT ON COLUMN asm.faqs.not_helpful_count                     IS '도움안됨 카운트';
COMMENT ON COLUMN asm.faqs.related_articles                      IS '관련 문서 (JSON 배열 형식: [{"title": "...", "url": "..."}])';
COMMENT ON COLUMN asm.faqs.video_url                             IS '설명 동영상 URL';
COMMENT ON COLUMN asm.faqs.is_published                          IS '공개 여부';
COMMENT ON COLUMN asm.faqs.is_featured                           IS '추천 FAQ 여부';
COMMENT ON COLUMN asm.faqs.is_deleted                            IS '논리 삭제 플래그';

-- =====================================================================================
-- 고객 지원 인덱스
-- =====================================================================================

-- support_tickets 인덱스
CREATE INDEX IF NOT EXISTS ix_asm_support_tickets__ticket_code
    ON asm.support_tickets (ticket_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_support_tickets__ticket_code IS '티켓 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_support_tickets__customer_id
    ON asm.support_tickets (customer_id, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_support_tickets__customer_id IS '고객별 지원 티켓 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_support_tickets__status
    ON asm.support_tickets (status, priority, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_support_tickets__status IS '상태 및 우선순위별 지원 티켓 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_support_tickets__assigned_to
    ON asm.support_tickets (assigned_to, status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_support_tickets__assigned_to IS '담당자 및 상태별 지원 티켓 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_support_tickets__category
    ON asm.support_tickets (category, sub_category)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_support_tickets__category IS '카테고리 및 하위카테고리별 지원 티켓 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_support_tickets__created_at
    ON asm.support_tickets (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_support_tickets__created_at IS '등록일시 조회 인덱스 (최신순)';

CREATE INDEX IF NOT EXISTS ix_asm_support_tickets__linked_service_request_id
    ON asm.support_tickets (linked_service_request_id)
 WHERE linked_service_request_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_support_tickets__linked_service_request_id IS 'A/S 요청 연계 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_support_tickets__contact_email
    ON asm.support_tickets (contact_email)
 WHERE contact_email IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_support_tickets__contact_email IS '문의자 이메일별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_support_tickets__resolved_at
    ON asm.support_tickets (resolved_at DESC)
 WHERE resolved_at IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_support_tickets__resolved_at IS '해결일시 조회 인덱스';

-- ticket_comments 인덱스
CREATE INDEX IF NOT EXISTS ix_asm_ticket_comments__ticket_id
    ON asm.ticket_comments (ticket_id, created_at ASC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_ticket_comments__ticket_id IS '티켓별 댓글 조회 인덱스 (시간순)';

CREATE INDEX IF NOT EXISTS ix_asm_ticket_comments__created_by
    ON asm.ticket_comments (created_by, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_ticket_comments__created_by IS '작성자별 댓글 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_ticket_comments__comment_type
    ON asm.ticket_comments (comment_type, ticket_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_asm_ticket_comments__comment_type IS '댓글 유형별 조회 인덱스';

-- faqs 인덱스
CREATE INDEX IF NOT EXISTS ix_asm_faqs__category
    ON asm.faqs (category, sub_category, sort_order)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_faqs__category IS '카테고리 및 하위카테고리별 FAQ 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_faqs__view_count
    ON asm.faqs (view_count DESC)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_faqs__view_count IS '조회수 기준 FAQ 정렬 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_faqs__helpful_count
    ON asm.faqs (helpful_count DESC)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_faqs__helpful_count IS '도움됨 카운트 기준 FAQ 정렬 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_faqs__is_featured
    ON asm.faqs (is_featured, sort_order)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_faqs__is_featured IS '추천 FAQ 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_asm_faqs__question_text
    ON asm.faqs USING gin(to_tsvector('korean', question))
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX ix_asm_faqs__question_text IS 'FAQ 질문 전문 검색 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- A/S 요청 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_asm_service_requests__code
    ON asm.service_requests (sr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_asm_service_requests__code IS 'A/S 요청 코드 유니크 제약 (삭제되지 않은 데이터만)';

-- 지원 티켓 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_asm_support_tickets__code
    ON asm.support_tickets (ticket_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_asm_support_tickets__code IS '지원 티켓 코드 유니크 제약';

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

-- service_works 테이블 외래키
-- A/S 요청 참조 외래키 (A/S 요청 삭제 시 작업 내역도 함께 삭제)
ALTER TABLE asm.service_works ADD CONSTRAINT fk_asm_service_works__service_request_id
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_asm_service_works__service_request_id ON asm.service_works IS 'A/S 요청 참조 외래키 (CASCADE 삭제)';

-- service_parts 테이블 외래키
-- A/S 요청 참조 외래키 (A/S 요청 삭제 시 부품 내역도 함께 삭제)
ALTER TABLE asm.service_parts ADD CONSTRAINT fk_asm_service_parts__service_request_id
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_asm_service_parts__service_request_id ON asm.service_parts IS 'A/S 요청 참조 외래키 (CASCADE 삭제)';

-- ticket_comments 테이블 외래키
-- 지원 티켓 참조 외래키 (티켓 삭제 시 댓글도 함께 삭제)
ALTER TABLE asm.ticket_comments ADD CONSTRAINT fk_asm_ticket_comments__ticket_id
    FOREIGN KEY (ticket_id) REFERENCES asm.support_tickets(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_asm_ticket_comments__ticket_id ON asm.ticket_comments IS '지원 티켓 참조 외래키 (CASCADE 삭제)';

-- support_tickets 테이블 외래키
-- A/S 요청 연계 외래키 (A/S 요청 삭제 시 연계 정보만 NULL로 설정)
ALTER TABLE asm.support_tickets ADD CONSTRAINT fk_asm_support_tickets__linked_service_request_id
    FOREIGN KEY (linked_service_request_id) REFERENCES asm.service_requests(id) ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_asm_support_tickets__linked_service_request_id ON asm.support_tickets IS 'A/S 요청 연계 외래키 (SET NULL)';
