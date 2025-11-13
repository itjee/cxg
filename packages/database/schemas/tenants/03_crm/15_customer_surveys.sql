-- =====================================================================================
-- 테이블: crm.customer_surveys
-- 설명: 고객 만족도 설문 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.customer_surveys 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 설문 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 설문 기본 정보
    survey_code             VARCHAR(50)              NOT NULL,                               -- 설문 코드
    survey_type             VARCHAR(20)              NOT NULL,                               -- 설문 유형
    
    -- 대상 정보
    partner_id              UUID,                                                            -- 거래처 ID
    lead_id                 UUID,                                                            -- 리드 ID
    contact_id              UUID,                                                            -- 담당자 ID
    opportunity_id          UUID,                                                            -- 영업기회 ID
    so_id                   UUID,                                                            -- 판매주문 ID
    
    -- 설문 질문
    question                TEXT                     NOT NULL,                               -- 질문
    
    -- 응답 정보
    response_score          INTEGER,                                                         -- 응답 점수
    response_text           TEXT,                                                            -- 응답 텍스트
    response_at             TIMESTAMP WITH TIME ZONE,                                        -- 응답일시
    
    -- 감정 분석
    sentiment               VARCHAR(20),                                                     -- 감정 분석
    
    -- 설문 발송 정보
    sent_date               DATE,                                                            -- 발송일
    sent_by                 UUID,                                                            -- 발송자
    send_channel            VARCHAR(20),                                                     -- 발송 채널
    
    -- 상태
    status                  VARCHAR(20)              DEFAULT 'PENDING',                      -- 상태
    is_anonymous            BOOLEAN                  DEFAULT false,                          -- 익명 여부
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 설문 코드 형식 체크
    CONSTRAINT ck_customer_surveys__code            CHECK (survey_code ~ '^[A-Z0-9_-]{2,50}$'),
    
    -- 설문 유형 체크 (NPS: Net Promoter Score, CSAT: Customer Satisfaction, CES: Customer Effort Score, CUSTOM: 사용자 정의)
    CONSTRAINT ck_customer_surveys__type            CHECK (survey_type IN ('NPS', 'CSAT', 'CES', 'GENERAL', 'CUSTOM')),
    
    -- 상태 체크 (PENDING: 대기, SENT: 발송, RESPONDED: 응답, EXPIRED: 만료)
    CONSTRAINT ck_customer_surveys__status          CHECK (status IN ('PENDING', 'SENT', 'RESPONDED', 'EXPIRED', 'CANCELLED')),
    
    -- 감정 분석 체크
    CONSTRAINT ck_customer_surveys__sentiment       CHECK (sentiment IS NULL OR sentiment IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
    
    -- 발송 채널 체크
    CONSTRAINT ck_customer_surveys__channel         CHECK (send_channel IS NULL OR send_channel IN ('EMAIL', 'SMS', 'PHONE', 'WEB', 'MOBILE_APP')),
    
    -- NPS 점수 범위 체크 (0-10)
    CONSTRAINT ck_customer_surveys__nps_score       CHECK (
        survey_type != 'NPS' OR 
        (response_score IS NULL OR (response_score >= 0 AND response_score <= 10))
    ),
    
    -- CSAT 점수 범위 체크 (1-5)
    CONSTRAINT ck_customer_surveys__csat_score      CHECK (
        survey_type != 'CSAT' OR 
        (response_score IS NULL OR (response_score >= 1 AND response_score <= 5))
    ),
    
    -- CES 점수 범위 체크 (1-7)
    CONSTRAINT ck_customer_surveys__ces_score       CHECK (
        survey_type != 'CES' OR 
        (response_score IS NULL OR (response_score >= 1 AND response_score <= 7))
    )
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.customer_surveys                   IS '고객 만족도 설문 관리 테이블';
COMMENT ON COLUMN crm.customer_surveys.id                IS '설문 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.customer_surveys.created_at        IS '등록 일시';
COMMENT ON COLUMN crm.customer_surveys.created_by        IS '등록자 UUID';
COMMENT ON COLUMN crm.customer_surveys.updated_at        IS '수정 일시';
COMMENT ON COLUMN crm.customer_surveys.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN crm.customer_surveys.survey_code       IS '설문 코드 (고유번호)';
COMMENT ON COLUMN crm.customer_surveys.survey_type       IS '설문 유형 (NPS: 0-10, CSAT: 1-5, CES: 1-7, GENERAL, CUSTOM)';
COMMENT ON COLUMN crm.customer_surveys.partner_id        IS '거래처 ID';
COMMENT ON COLUMN crm.customer_surveys.lead_id           IS '리드 ID';
COMMENT ON COLUMN crm.customer_surveys.contact_id        IS '담당자 ID (partner_contacts)';
COMMENT ON COLUMN crm.customer_surveys.opportunity_id    IS '영업기회 ID';
COMMENT ON COLUMN crm.customer_surveys.so_id             IS '판매주문 ID';
COMMENT ON COLUMN crm.customer_surveys.question          IS '질문 내용';
COMMENT ON COLUMN crm.customer_surveys.response_score    IS '응답 점수 (NPS: 0-10, CSAT: 1-5, CES: 1-7)';
COMMENT ON COLUMN crm.customer_surveys.response_text     IS '응답 텍스트 (자유 의견)';
COMMENT ON COLUMN crm.customer_surveys.response_at       IS '응답 일시';
COMMENT ON COLUMN crm.customer_surveys.sentiment         IS '감정 분석 (POSITIVE/NEUTRAL/NEGATIVE)';
COMMENT ON COLUMN crm.customer_surveys.sent_date         IS '발송일';
COMMENT ON COLUMN crm.customer_surveys.sent_by           IS '발송자 UUID';
COMMENT ON COLUMN crm.customer_surveys.send_channel      IS '발송 채널 (EMAIL/SMS/PHONE/WEB/MOBILE_APP)';
COMMENT ON COLUMN crm.customer_surveys.status            IS '상태 (PENDING/SENT/RESPONDED/EXPIRED/CANCELLED)';
COMMENT ON COLUMN crm.customer_surveys.is_anonymous      IS '익명 여부';
COMMENT ON COLUMN crm.customer_surveys.is_deleted        IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.customer_surveys.notes             IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_customer_surveys__code 
    ON crm.customer_surveys (survey_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_customer_surveys__code IS '설문 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_customer_surveys__survey_type 
    ON crm.customer_surveys (survey_type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_surveys__survey_type IS '설문 유형별 조회 인덱스';

CREATE INDEX ix_customer_surveys__partner_id 
    ON crm.customer_surveys (partner_id)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_surveys__partner_id IS '거래처별 조회 인덱스';

CREATE INDEX ix_customer_surveys__opportunity_id 
    ON crm.customer_surveys (opportunity_id)
 WHERE opportunity_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_surveys__opportunity_id IS '영업기회별 조회 인덱스';

CREATE INDEX ix_customer_surveys__so_id 
    ON crm.customer_surveys (so_id)
 WHERE so_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_surveys__so_id IS '판매주문별 조회 인덱스';

CREATE INDEX ix_customer_surveys__status 
    ON crm.customer_surveys (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_surveys__status IS '상태별 조회 인덱스';

CREATE INDEX ix_customer_surveys__response_score 
    ON crm.customer_surveys (survey_type, response_score)
 WHERE response_score IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_surveys__response_score IS '설문 유형/점수별 조회 인덱스';

CREATE INDEX ix_customer_surveys__sentiment 
    ON crm.customer_surveys (sentiment)
 WHERE sentiment IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_surveys__sentiment IS '감정 분석별 조회 인덱스';

CREATE INDEX ix_customer_surveys__response_at
    ON crm.customer_surveys (response_at DESC)
 WHERE response_at IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_surveys__response_at IS '응답일시별 조회 인덱스';

-- 외래키 제약조건
-- 거래처 참조 (SET NULL 삭제)
ALTER TABLE crm.customer_surveys 
  ADD CONSTRAINT fk_customer_surveys__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_customer_surveys__partner_id ON crm.customer_surveys IS '거래처 참조 외래키 (SET NULL 삭제)';

-- 리드 참조 (SET NULL 삭제)
ALTER TABLE crm.customer_surveys 
  ADD CONSTRAINT fk_customer_surveys__lead_id
    FOREIGN KEY (lead_id) 
    REFERENCES crm.leads(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_customer_surveys__lead_id ON crm.customer_surveys IS '리드 참조 외래키 (SET NULL 삭제)';

-- 담당자 참조 (SET NULL 삭제)
ALTER TABLE crm.customer_surveys 
  ADD CONSTRAINT fk_customer_surveys__contact_id
    FOREIGN KEY (contact_id) 
    REFERENCES crm.partner_contacts(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_customer_surveys__contact_id ON crm.customer_surveys IS '담당자 참조 외래키 (SET NULL 삭제)';

-- 영업기회 참조 (SET NULL 삭제)
ALTER TABLE crm.customer_surveys 
  ADD CONSTRAINT fk_customer_surveys__opportunity_id
    FOREIGN KEY (opportunity_id) 
    REFERENCES crm.opportunities(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_customer_surveys__opportunity_id ON crm.customer_surveys IS '영업기회 참조 외래키 (SET NULL 삭제)';

-- 판매주문 참조 (SET NULL 삭제)
-- ALTER TABLE crm.customer_surveys 
--   ADD CONSTRAINT fk_customer_surveys__so_id
--     FOREIGN KEY (so_id) 
--     REFERENCES srm.sales_orders(id) 
--     ON DELETE SET NULL;
-- COMMENT ON CONSTRAINT fk_customer_surveys__so_id ON crm.customer_surveys IS '판매주문 참조 외래키 (SET NULL 삭제)';

-- 발송자 참조 (SET NULL 삭제)
ALTER TABLE crm.customer_surveys 
  ADD CONSTRAINT fk_customer_surveys__sent_by
    FOREIGN KEY (sent_by) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_customer_surveys__sent_by ON crm.customer_surveys IS '발송자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.customer_surveys 테이블 정의
-- =====================================================================================
