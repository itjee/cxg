-- =====================================================================================
-- 테이블: asm.service_requests
-- 설명: 서비스 요청 및 A/S 접수 정보 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.service_requests 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 서비스 요청 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 요청 기본 정보
    code                    VARCHAR(50)              NOT NULL,                               -- 요청 코드
    request_date            DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 요청 일자
    customer_id             UUID                     NOT NULL,                               -- 고객 식별자
    product_id              UUID,                                                            -- 제품 식별자
    serial_no               VARCHAR(100),                                                    -- 시리얼 번호
    
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
    CONSTRAINT ck_service_requests__service_type    CHECK (service_type IN ('REPAIR', 'REPLACE', 'MAINTENANCE', 'INSPECTION')),
    -- 우선순위 체크 (LOW: 낮음, MEDIUM: 보통, HIGH: 높음, URGENT: 긴급)
    CONSTRAINT ck_service_requests__priority        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    -- 상태 체크 (RECEIVED: 접수, DIAGNOSED: 진단완료, IN_PROGRESS: 진행중, COMPLETED: 완료, CLOSED: 종료, CANCELLED: 취소)
    CONSTRAINT ck_service_requests__status          CHECK (status IN ('RECEIVED', 'DIAGNOSED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'CANCELLED')),
    -- 비용 양수 체크
    CONSTRAINT ck_service_requests__costs           CHECK (estimated_cost >= 0 AND actual_cost >= 0),
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_service_requests__currency        CHECK (currency ~ '^[A-Z]{3}$'),
    -- 날짜 유효성 체크 (보증 종료일이 구매일보다 이후)
    CONSTRAINT ck_service_requests__warranty_dates  CHECK (warranty_end_date IS NULL OR purchase_date IS NULL OR warranty_end_date >= purchase_date)
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
