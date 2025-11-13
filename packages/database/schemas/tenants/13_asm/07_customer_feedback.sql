-- =====================================================================================
-- 테이블: asm.customer_feedback
-- 설명: 고객 피드백/평가 관리 테이블 - 고객 만족도, 피드백 의견 관리
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.customer_feedback
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 피드백 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID

    -- 거래처 정보
    customer_id             UUID                     NOT NULL,                               -- 거래처 식별자

    -- 거래 정보
    transaction_type        VARCHAR(20)              NOT NULL,                               -- 거래 유형 (SALE, SERVICE, SUPPORT)
    transaction_id          UUID,                                                            -- 거래 식별자 (주문, 서비스, 티켓)

    -- 평가 정보
    rating                  INTEGER                  NOT NULL,                               -- 별점 (1-5)
    comment                 TEXT,                                                            -- 피드백 의견
    feedback_categories     VARCHAR(100)[],                                                  -- 피드백 카테고리 배열 (품질, 배송, 고객서비스, 가격 등)

    -- 회신 정보
    response_text           TEXT,                                                            -- 회신 내용
    response_by             UUID,                                                            -- 회신자 UUID
    response_date           TIMESTAMP WITH TIME ZONE,                                        -- 회신 일시

    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'NEW',                 -- 상태 (NEW, REVIEWED, RESPONDED, CLOSED)
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그

    -- 제약조건
    -- 거래 유형 체크
    CONSTRAINT ck_customer_feedback__transaction_type  CHECK (transaction_type IN ('SALE', 'SERVICE', 'SUPPORT')),

    -- 별점 범위 체크 (1-5)
    CONSTRAINT ck_customer_feedback__rating             CHECK (rating BETWEEN 1 AND 5),

    -- 상태 체크
    CONSTRAINT ck_customer_feedback__status             CHECK (status IN ('NEW', 'REVIEWED', 'RESPONDED', 'CLOSED')),

    -- 거래처 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_customer_feedback__customer_id
        FOREIGN KEY (customer_id) REFERENCES crm.partners(id) ON DELETE RESTRICT,

    -- 회신자 참조 외래키 (SET NULL 삭제)
    CONSTRAINT fk_customer_feedback__response_by
        FOREIGN KEY (response_by) REFERENCES hrm.employees(id) ON DELETE SET NULL,

    -- 등록자 참조 외래키
    CONSTRAINT fk_customer_feedback__created_by
        FOREIGN KEY (created_by) REFERENCES sys.users(id) ON DELETE SET NULL,

    -- 수정자 참조 외래키
    CONSTRAINT fk_customer_feedback__updated_by
        FOREIGN KEY (updated_by) REFERENCES sys.users(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  asm.customer_feedback                          IS '고객 피드백/평가 관리 테이블 - 고객 만족도, 피드백 의견 관리';
COMMENT ON COLUMN asm.customer_feedback.id                       IS '피드백 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.customer_feedback.created_at               IS '등록 일시';
COMMENT ON COLUMN asm.customer_feedback.created_by               IS '등록자 UUID';
COMMENT ON COLUMN asm.customer_feedback.updated_at               IS '수정 일시';
COMMENT ON COLUMN asm.customer_feedback.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN asm.customer_feedback.customer_id               IS '거래처 식별자';
COMMENT ON COLUMN asm.customer_feedback.transaction_type         IS '거래 유형 (SALE: 판매, SERVICE: 서비스, SUPPORT: 지원)';
COMMENT ON COLUMN asm.customer_feedback.transaction_id           IS '거래 식별자 (판매주문, 서비스, 티켓 등)';
COMMENT ON COLUMN asm.customer_feedback.rating                   IS '별점 (1-5, 1: 매우 불만족, 5: 매우 만족)';
COMMENT ON COLUMN asm.customer_feedback.comment                  IS '피드백 의견';
COMMENT ON COLUMN asm.customer_feedback.feedback_categories      IS '피드백 카테고리 배열 (예: {품질, 배송})';
COMMENT ON COLUMN asm.customer_feedback.response_text            IS '회신 내용';
COMMENT ON COLUMN asm.customer_feedback.response_by              IS '회신자 직원 UUID';
COMMENT ON COLUMN asm.customer_feedback.response_date            IS '회신 일시';
COMMENT ON COLUMN asm.customer_feedback.status                   IS '상태 (NEW: 신규, REVIEWED: 검토, RESPONDED: 회신, CLOSED: 종결)';
COMMENT ON COLUMN asm.customer_feedback.is_deleted               IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스 (없음)

-- 일반 인덱스
CREATE INDEX ix_customer_feedback__customer_id
    ON asm.customer_feedback (customer_id, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_customer_feedback__customer_id IS '거래처별 피드백 조회 인덱스';

CREATE INDEX ix_customer_feedback__rating
    ON asm.customer_feedback (rating)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_customer_feedback__rating IS '별점별 조회 인덱스';

CREATE INDEX ix_customer_feedback__status
    ON asm.customer_feedback (status, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_customer_feedback__status IS '상태별 조회 인덱스';

CREATE INDEX ix_customer_feedback__transaction_type
    ON asm.customer_feedback (transaction_type, customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_customer_feedback__transaction_type IS '거래 유형별 조회 인덱스';

CREATE INDEX ix_customer_feedback__response_by
    ON asm.customer_feedback (response_by)
 WHERE response_by IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_customer_feedback__response_by IS '회신자별 조회 인덱스';

CREATE INDEX ix_customer_feedback__created_at
    ON asm.customer_feedback (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_customer_feedback__created_at IS '등록일시 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건 설명
-- =====================================================================================

COMMENT ON CONSTRAINT fk_customer_feedback__customer_id ON asm.customer_feedback IS '거래처 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_customer_feedback__response_by ON asm.customer_feedback IS '회신자 참조 외래키 (SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_customer_feedback__created_by ON asm.customer_feedback IS '등록자 참조 외래키 (SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_customer_feedback__updated_by ON asm.customer_feedback IS '수정자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: asm.customer_feedback 테이블 생성
-- =====================================================================================
