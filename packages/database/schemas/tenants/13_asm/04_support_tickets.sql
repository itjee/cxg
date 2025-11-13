-- =====================================================================================
-- 테이블: asm.support_tickets
-- 설명: 고객 문의 및 지원 티켓 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.support_tickets 
(
    -- 기본 식별자 및 감사 필드
    id                        UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 지원 티켓 고유 식별자
    created_at                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by                UUID,                                                            -- 등록자 UUID
    updated_at                TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by                UUID,                                                            -- 수정자 UUID
    
    -- 티켓 기본 정보
    ticket_code               VARCHAR(50)              NOT NULL,                               -- 티켓 코드
    customer_id               UUID,                                                            -- 고객 식별자 (NULL 가능: 비회원 문의)
    
    -- 문의자 정보 (비회원 문의 시 필수)
    contact_name              VARCHAR(100),                                                    -- 문의자 이름
    contact_email             VARCHAR(255),                                                    -- 문의자 이메일
    contact_phone             VARCHAR(50),                                                     -- 문의자 연락처
    
    -- 문의 내용
    subject                   VARCHAR(255)             NOT NULL,                               -- 문의 제목
    description               TEXT,                                                            -- 문의 상세 내용
    
    -- 분류 및 우선순위
    category                  VARCHAR(50),                                                     -- 카테고리
    sub_category              VARCHAR(50),                                                     -- 하위 카테고리 (추가)
    priority                  VARCHAR(20)              DEFAULT 'MEDIUM',                       -- 우선순위
    
    -- 처리 정보
    status                    VARCHAR(20)              DEFAULT 'OPEN',                         -- 상태
    assigned_to               UUID,                                                            -- 담당자 식별자
    
    -- 완료 정보
    resolved_at               TIMESTAMP WITH TIME ZONE,                                        -- 해결 일시
    closed_at                 TIMESTAMP WITH TIME ZONE,                                        -- 종료 일시 (추가)
    resolution                TEXT,                                                            -- 해결 내용
    resolution_time_minutes   INTEGER,                                                         -- 해결 소요 시간 (분) (추가)
    
    -- 만족도 평가
    satisfaction_rating       INTEGER,                                                         -- 만족도 평가 (1-5점)
    satisfaction_comment      TEXT,                                                            -- 만족도 평가 코멘트 (추가)
    
    -- A/S 연계 (티켓이 A/S로 전환된 경우)
    linked_service_request_id UUID,                                                            -- 연계된 A/S 요청 식별자
    
    -- 상태 관리
    is_deleted                BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 우선순위 체크
    CONSTRAINT ck_support_tickets__priority         CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    
    -- 상태 체크
    CONSTRAINT ck_support_tickets__status           CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED')),
    
    -- 만족도 범위 체크 (1~5점)
    CONSTRAINT ck_support_tickets__satisfaction     CHECK (satisfaction_rating IS NULL OR satisfaction_rating BETWEEN 1 AND 5),
    
    -- 이메일 형식 체크
    CONSTRAINT ck_support_tickets__email            CHECK (contact_email IS NULL OR contact_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 해결 소요 시간 양수 체크
    CONSTRAINT ck_support_tickets__resolution_time  CHECK (resolution_time_minutes IS NULL OR resolution_time_minutes >= 0),
    
    -- 고객 참조 외래키 (SET NULL)
    CONSTRAINT fk_support_tickets__customer_id      FOREIGN KEY (customer_id) REFERENCES crm.partners(id) ON DELETE SET NULL,
    
    -- 담당자 참조 외래키 (SET NULL)
    CONSTRAINT fk_support_tickets__assigned_to      FOREIGN KEY (assigned_to) REFERENCES hrm.employees(id) ON DELETE SET NULL,
    
    -- A/S 요청 참조 외래키 (SET NULL)
    CONSTRAINT fk_support_tickets__service_request  FOREIGN KEY (linked_service_request_id) REFERENCES asm.service_requests(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

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

COMMENT ON CONSTRAINT fk_support_tickets__customer_id ON asm.support_tickets IS '고객 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_support_tickets__assigned_to ON asm.support_tickets IS '담당자 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_support_tickets__service_request ON asm.support_tickets IS 'A/S 요청 참조 외래키 (SET NULL)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_support_tickets__ticket_code
    ON asm.support_tickets (ticket_code)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ux_support_tickets__ticket_code IS '티켓 코드 유니크 제약 (삭제되지 않은 데이터만)';

-- 일반 인덱스
CREATE INDEX ix_support_tickets__customer_id
    ON asm.support_tickets (customer_id)
 WHERE customer_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__customer_id IS '고객별 티켓 조회 인덱스';

CREATE INDEX ix_support_tickets__assigned_to
    ON asm.support_tickets (assigned_to, status)
 WHERE assigned_to IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__assigned_to IS '담당자별 티켓 조회 인덱스';

CREATE INDEX ix_support_tickets__status
    ON asm.support_tickets (status, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__status IS '티켓 상태별 조회 인덱스';

CREATE INDEX ix_support_tickets__priority
    ON asm.support_tickets (priority, status)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__priority IS '티켓 우선순위 및 상태별 조회 인덱스';

CREATE INDEX ix_support_tickets__category
    ON asm.support_tickets (category, sub_category)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__category IS '카테고리별 티켓 조회 인덱스';

CREATE INDEX ix_support_tickets__created_at
    ON asm.support_tickets (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__created_at IS '티켓 등록일시 조회 인덱스';

CREATE INDEX ix_support_tickets__contact_email
    ON asm.support_tickets (contact_email)
 WHERE contact_email IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__contact_email IS '문의자 이메일별 티켓 조회 인덱스';

CREATE INDEX ix_support_tickets__linked_service_request
    ON asm.support_tickets (linked_service_request_id)
 WHERE linked_service_request_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__linked_service_request IS '연계된 A/S 요청별 티켓 조회 인덱스';

CREATE INDEX ix_support_tickets__satisfaction_rating
    ON asm.support_tickets (satisfaction_rating DESC)
 WHERE satisfaction_rating IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__satisfaction_rating IS '만족도 평가별 티켓 조회 인덱스';
