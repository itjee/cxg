-- =====================================================================================
-- 테이블: asm.nps_surveys
-- 설명: NPS(Net Promoter Score) 설문 관리 테이블 - 고객 추천도 조사
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.nps_surveys
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- NPS 설문 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID

    -- 거래처 정보
    customer_id             UUID                     NOT NULL,                               -- 거래처 식별자

    -- NPS 응답
    nps_score               INTEGER                  NOT NULL,                               -- NPS 점수 (0-10)
    recommendation_reason   VARCHAR(20),                                                     -- 추천 의향 (PROMOTER, PASSIVE, DETRACTOR)
    recommendation_text     TEXT,                                                            -- 추천 사유/개선점

    -- 설문 일정
    sent_date               DATE,                                                            -- 설문 발송일
    response_date           DATE,                                                            -- 응답일
    response_time_days      INTEGER,                                                         -- 응답까지 소요 일수

    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그

    -- 제약조건
    -- NPS 점수 범위 체크 (0-10)
    CONSTRAINT ck_nps_surveys__nps_score              CHECK (nps_score BETWEEN 0 AND 10),

    -- 추천 의향 체크
    CONSTRAINT ck_nps_surveys__recommendation_reason  CHECK (recommendation_reason IS NULL OR recommendation_reason IN ('PROMOTER', 'PASSIVE', 'DETRACTOR')),

    -- 상태 체크
    CONSTRAINT ck_nps_surveys__status                 CHECK (status IN ('PENDING', 'SENT', 'RESPONDED', 'CLOSED')),

    -- 응답까지 소요 일수 양수 체크 (NULL이거나 양수)
    CONSTRAINT ck_nps_surveys__response_time_days     CHECK (response_time_days IS NULL OR response_time_days >= 0),

    -- 거래처 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_nps_surveys__customer_id
        FOREIGN KEY (customer_id) REFERENCES crm.partners(id) ON DELETE RESTRICT,

    -- 등록자 참조 외래키
    CONSTRAINT fk_nps_surveys__created_by
        FOREIGN KEY (created_by) REFERENCES sys.users(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  asm.nps_surveys                          IS 'NPS(Net Promoter Score) 설문 관리 테이블 - 고객 추천도 조사';
COMMENT ON COLUMN asm.nps_surveys.id                       IS 'NPS 설문 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.nps_surveys.created_at               IS '등록 일시';
COMMENT ON COLUMN asm.nps_surveys.created_by               IS '등록자 UUID';
COMMENT ON COLUMN asm.nps_surveys.customer_id               IS '거래처 식별자';
COMMENT ON COLUMN asm.nps_surveys.nps_score                IS 'NPS 점수 (0-10, 0-6: Detractor, 7-8: Passive, 9-10: Promoter)';
COMMENT ON COLUMN asm.nps_surveys.recommendation_reason    IS '추천 의향 분류 (PROMOTER: 추천함, PASSIVE: 중립, DETRACTOR: 비추천)';
COMMENT ON COLUMN asm.nps_surveys.recommendation_text      IS '추천 사유 또는 개선점';
COMMENT ON COLUMN asm.nps_surveys.sent_date                IS '설문 발송일';
COMMENT ON COLUMN asm.nps_surveys.response_date            IS '응답일';
COMMENT ON COLUMN asm.nps_surveys.response_time_days       IS '응답까지 소요 일수';
COMMENT ON COLUMN asm.nps_surveys.status                   IS '상태 (PENDING: 대기, SENT: 발송, RESPONDED: 응답, CLOSED: 완료)';
COMMENT ON COLUMN asm.nps_surveys.is_deleted               IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스 (없음)

-- 일반 인덱스
CREATE INDEX ix_nps_surveys__customer_id
    ON asm.nps_surveys (customer_id, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_nps_surveys__customer_id IS '거래처별 NPS 조회 인덱스';

CREATE INDEX ix_nps_surveys__nps_score
    ON asm.nps_surveys (nps_score)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_nps_surveys__nps_score IS 'NPS 점수별 조회 인덱스';

CREATE INDEX ix_nps_surveys__recommendation_reason
    ON asm.nps_surveys (recommendation_reason)
 WHERE recommendation_reason IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_nps_surveys__recommendation_reason IS '추천 의향별 조회 인덱스';

CREATE INDEX ix_nps_surveys__status
    ON asm.nps_surveys (status, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_nps_surveys__status IS '상태별 조회 인덱스';

CREATE INDEX ix_nps_surveys__sent_date
    ON asm.nps_surveys (sent_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_nps_surveys__sent_date IS '발송일별 조회 인덱스';

CREATE INDEX ix_nps_surveys__response_date
    ON asm.nps_surveys (response_date DESC)
 WHERE response_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_nps_surveys__response_date IS '응답일별 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건 설명
-- =====================================================================================

COMMENT ON CONSTRAINT fk_nps_surveys__customer_id ON asm.nps_surveys IS '거래처 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_nps_surveys__created_by ON asm.nps_surveys IS '등록자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: asm.nps_surveys 테이블 생성
-- =====================================================================================
