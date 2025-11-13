-- =====================================================================================
-- 테이블: asm.service_requests
-- 설명: 서비스 요청 및 A/S 접수 정보 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
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
    sr_code                 VARCHAR(50)              NOT NULL,                               -- A/S 요청 코드
    customer_id             UUID                     NOT NULL,                               -- 고객 식별자
    product_id              UUID,                                                            -- 제품 식별자
    serial_no               VARCHAR(100),                                                    -- 제품 시리얼 번호
    
    -- 구매 및 보증 정보
    purchase_date           DATE,                                                            -- 제품 구매 일자
    warranty_end_date       DATE,                                                            -- 보증 종료일
    is_warranty             BOOLEAN                  DEFAULT false,                          -- 보증기간 내 A/S 여부
    
    -- 문제 정보
    issue_description       TEXT                     NOT NULL,                               -- 문제 및 고장 내용 설명
    issue_category          VARCHAR(50),                                                     -- 문제 카테고리
    
    -- A/S 처리 정보
    service_type            VARCHAR(20)              DEFAULT 'REPAIR',                       -- A/S 유형
    priority                VARCHAR(20)              DEFAULT 'MEDIUM',                       -- 우선순위
    status                  VARCHAR(20)              DEFAULT 'RECEIVED',                     -- 상태
    assigned_technician_id  UUID,                                                            -- 배정된 기술자 식별자
    
    -- 일정 정보
    scheduled_date          DATE,                                                            -- 예약 작업일
    expected_completion_date DATE,                                                           -- 예상 완료일
    completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 실제 완료 일시
    
    -- 비용 정보
    estimated_cost          NUMERIC(18,4)            DEFAULT 0,                              -- 예상 비용
    actual_cost             NUMERIC(18,4)            DEFAULT 0,                              -- 실제 비용
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 코드
    
    -- 고객 피드백
    customer_notes          TEXT,                                                            -- 고객 요청사항
    technician_notes        TEXT,                                                            -- 기술자 메모
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- A/S 유형 체크
    CONSTRAINT ck_service_requests__service_type    CHECK (service_type IN ('REPAIR', 'REPLACE', 'MAINTENANCE', 'INSPECTION')),
    
    -- 우선순위 체크
    CONSTRAINT ck_service_requests__priority        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    
    -- 상태 체크
    CONSTRAINT ck_service_requests__status          CHECK (status IN ('RECEIVED', 'DIAGNOSED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'CANCELLED')),
    
    -- 비용 양수 체크
    CONSTRAINT ck_service_requests__costs           CHECK (estimated_cost >= 0 AND actual_cost >= 0),
    
    -- 통화 코드 형식 체크 (ISO 4217 - 3자리 영대문자)
    CONSTRAINT ck_service_requests__currency        CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 보증기간 유효성 체크 (종료일이 구매일보다 이후)
    CONSTRAINT ck_service_requests__warranty_dates  CHECK (warranty_end_date IS NULL OR purchase_date IS NULL OR warranty_end_date >= purchase_date),
    
    -- 고객 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_service_requests__customer_id     FOREIGN KEY (customer_id) REFERENCES crm.partners(id) ON DELETE RESTRICT,
    
    -- 제품 참조 외래키 (SET NULL)
    CONSTRAINT fk_service_requests__product_id      FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE SET NULL,
    
    -- 기술자 참조 외래키 (SET NULL)
    CONSTRAINT fk_service_requests__technician_id   FOREIGN KEY (assigned_technician_id) REFERENCES hrm.employees(id) ON DELETE SET NULL,
    
    -- 통화 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_service_requests__currency        FOREIGN KEY (currency) REFERENCES adm.currencies(code) ON DELETE RESTRICT
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  asm.service_requests                           IS 'A/S 요청 및 처리 정보 관리 테이블';
COMMENT ON COLUMN asm.service_requests.id                        IS 'A/S 요청 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.service_requests.created_at                IS '등록 일시';
COMMENT ON COLUMN asm.service_requests.created_by                IS '등록자 UUID';
COMMENT ON COLUMN asm.service_requests.updated_at                IS '수정 일시';
COMMENT ON COLUMN asm.service_requests.updated_by                IS '수정자 UUID';
COMMENT ON COLUMN asm.service_requests.sr_code                   IS 'A/S 요청 코드';
COMMENT ON COLUMN asm.service_requests.customer_id               IS '고객 식별자';
COMMENT ON COLUMN asm.service_requests.product_id                IS '제품 식별자';
COMMENT ON COLUMN asm.service_requests.serial_no             IS '제품 시리얼 번호';
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

COMMENT ON CONSTRAINT fk_service_requests__customer_id ON asm.service_requests IS '고객 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_service_requests__product_id ON asm.service_requests IS '제품 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_service_requests__technician_id ON asm.service_requests IS '기술자 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_service_requests__currency ON asm.service_requests IS '통화 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

CREATE INDEX ix_service_requests__sr_code
    ON asm.service_requests (sr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__sr_code IS 'A/S 요청 코드 조회 인덱스';

CREATE INDEX ix_service_requests__customer_id
    ON asm.service_requests (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__customer_id IS '고객별 A/S 요청 조회 인덱스';

CREATE INDEX ix_service_requests__product_id
    ON asm.service_requests (product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__product_id IS '제품별 A/S 요청 조회 인덱스';

CREATE INDEX ix_service_requests__assigned_technician_id
    ON asm.service_requests (assigned_technician_id)
 WHERE assigned_technician_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__assigned_technician_id IS '기술자별 배정된 A/S 요청 조회 인덱스';

CREATE INDEX ix_service_requests__status
    ON asm.service_requests (status, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__status IS 'A/S 요청 상태별 조회 인덱스';

CREATE INDEX ix_service_requests__service_type
    ON asm.service_requests (service_type)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__service_type IS 'A/S 유형별 조회 인덱스';

CREATE INDEX ix_service_requests__priority
    ON asm.service_requests (priority, status)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__priority IS 'A/S 우선순위 및 상태별 조회 인덱스';

CREATE INDEX ix_service_requests__is_warranty
    ON asm.service_requests (is_warranty)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__is_warranty IS '보증기간 여부별 조회 인덱스';

CREATE INDEX ix_service_requests__created_at
    ON asm.service_requests (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__created_at IS 'A/S 요청 등록일시 조회 인덱스';

CREATE INDEX ix_service_requests__completed_at
    ON asm.service_requests (completed_at DESC)
 WHERE completed_at IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__completed_at IS 'A/S 요청 완료일시 조회 인덱스';

CREATE INDEX ix_service_requests__serial_no
    ON asm.service_requests (serial_no)
 WHERE serial_no IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__serial_no IS '시리얼 번호별 A/S 이력 조회 인덱스';

CREATE INDEX ix_service_requests__scheduled_date
    ON asm.service_requests (scheduled_date)
 WHERE scheduled_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_service_requests__scheduled_date IS '예약 작업일별 A/S 요청 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스
-- =====================================================================================

CREATE UNIQUE INDEX ux_service_requests__code
    ON asm.service_requests (sr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ux_service_requests__code IS 'A/S 요청 코드 유니크 제약 (삭제되지 않은 데이터만)';
