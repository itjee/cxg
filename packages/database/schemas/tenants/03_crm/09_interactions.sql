-- =====================================================================================
-- 테이블: crm.interactions
-- 설명: 고객 상호작용 이력 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.interactions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 상호작용 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 상호작용 기본 정보
    interaction_type        VARCHAR(20)              NOT NULL,                               -- 상호작용 유형
    channel                 VARCHAR(20)              NOT NULL,                               -- 채널
    direction               VARCHAR(20)              NOT NULL,                               -- 방향
    
    -- 관련 대상
    partner_id              UUID,                                                            -- 거래처 ID
    lead_id                 UUID,                                                            -- 리드 ID
    contact_id              UUID,                                                            -- 담당자 ID
    opportunity_id          UUID,                                                            -- 영업 기회 ID
    
    -- 상호작용 상세
    subject                 VARCHAR(200),                                                    -- 제목
    content                 TEXT,                                                            -- 내용
    summary                 TEXT,                                                            -- 요약
    
    -- 일시 정보
    interaction_date        TIMESTAMP WITH TIME ZONE NOT NULL,                               -- 상호작용 일시
    duration_seconds        INTEGER,                                                         -- 소요 시간 (초)
    
    -- 담당자 정보
    handled_by              UUID,                                                            -- 처리자 (자사 직원)
    
    -- 상호작용 결과
    sentiment               VARCHAR(20),                                                     -- 감정 분석
    satisfaction_score      INTEGER,                                                         -- 만족도 점수 (1-5)
    outcome                 VARCHAR(50),                                                     -- 결과
    
    -- 후속 조치
    is_follow_up_required   BOOLEAN                  DEFAULT false,                          -- 후속 조치 필요 여부
    follow_up_notes         TEXT,                                                            -- 후속 조치 메모
    follow_up_date          DATE,                                                            -- 후속 조치 예정일
    
    -- 태그 및 카테고리
    tags                    TEXT[],                                                          -- 태그 (배열)
    category                VARCHAR(50),                                                     -- 카테고리
    
    -- 첨부파일 및 참조
    attachments             JSONB,                                                           -- 첨부파일 정보 (JSON)
    reference_url           VARCHAR(500),                                                    -- 참조 URL
    
    -- 논리 삭제
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 상호작용 유형 체크 (INQUIRY: 문의, COMPLAINT: 불만, FEEDBACK: 피드백, SUPPORT: 지원, SALES: 영업)
    CONSTRAINT ck_interactions__type                CHECK (interaction_type IN ('INQUIRY', 'COMPLAINT', 'FEEDBACK', 'SUPPORT', 'SALES', 'FOLLOW_UP', 'OTHER')),
    
    -- 채널 체크 (PHONE: 전화, EMAIL: 이메일, CHAT: 채팅, SNS: SNS, VISIT: 방문, WEB: 웹사이트)
    CONSTRAINT ck_interactions__channel             CHECK (channel IN ('PHONE', 'EMAIL', 'CHAT', 'SNS', 'VISIT', 'WEB', 'MOBILE_APP', 'OTHER')),
    
    -- 방향 체크 (INBOUND: 인바운드, OUTBOUND: 아웃바운드)
    CONSTRAINT ck_interactions__direction           CHECK (direction IN ('INBOUND', 'OUTBOUND')),
    
    -- 감정 분석 체크 (POSITIVE: 긍정, NEUTRAL: 중립, NEGATIVE: 부정)
    CONSTRAINT ck_interactions__sentiment           CHECK (sentiment IS NULL OR sentiment IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
    
    -- 만족도 점수 범위 체크 (1-5)
    CONSTRAINT ck_interactions__satisfaction_score  CHECK (satisfaction_score IS NULL OR (satisfaction_score >= 1 AND satisfaction_score <= 5)),
    
    -- 소요 시간 양수 체크
    CONSTRAINT ck_interactions__duration_seconds    CHECK (duration_seconds IS NULL OR duration_seconds > 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.interactions                       IS '고객 상호작용 이력 관리 테이블';
COMMENT ON COLUMN crm.interactions.id                    IS '상호작용 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.interactions.created_at            IS '등록 일시';
COMMENT ON COLUMN crm.interactions.created_by            IS '등록자 UUID';
COMMENT ON COLUMN crm.interactions.updated_at            IS '수정 일시';
COMMENT ON COLUMN crm.interactions.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN crm.interactions.interaction_type      IS '상호작용 유형 (INQUIRY/COMPLAINT/FEEDBACK/SUPPORT/SALES/FOLLOW_UP/OTHER)';
COMMENT ON COLUMN crm.interactions.channel               IS '채널 (PHONE/EMAIL/CHAT/SNS/VISIT/WEB/MOBILE_APP/OTHER)';
COMMENT ON COLUMN crm.interactions.direction             IS '방향 (INBOUND: 고객→자사, OUTBOUND: 자사→고객)';
COMMENT ON COLUMN crm.interactions.partner_id            IS '거래처 ID';
COMMENT ON COLUMN crm.interactions.lead_id               IS '리드 ID';
COMMENT ON COLUMN crm.interactions.contact_id            IS '담당자 ID (partner_contacts)';
COMMENT ON COLUMN crm.interactions.opportunity_id        IS '영업 기회 ID';
COMMENT ON COLUMN crm.interactions.subject               IS '제목';
COMMENT ON COLUMN crm.interactions.content               IS '내용';
COMMENT ON COLUMN crm.interactions.summary               IS '요약';
COMMENT ON COLUMN crm.interactions.interaction_date      IS '상호작용 일시';
COMMENT ON COLUMN crm.interactions.duration_seconds      IS '소요 시간 (초)';
COMMENT ON COLUMN crm.interactions.handled_by            IS '처리자 UUID (자사 직원)';
COMMENT ON COLUMN crm.interactions.sentiment             IS '감정 분석 (POSITIVE/NEUTRAL/NEGATIVE)';
COMMENT ON COLUMN crm.interactions.satisfaction_score    IS '만족도 점수 (1-5점)';
COMMENT ON COLUMN crm.interactions.outcome               IS '결과 (RESOLVED/PENDING/ESCALATED/CLOSED 등)';
COMMENT ON COLUMN crm.interactions.is_follow_up_required IS '후속 조치 필요 여부';
COMMENT ON COLUMN crm.interactions.follow_up_notes       IS '후속 조치 메모';
COMMENT ON COLUMN crm.interactions.follow_up_date        IS '후속 조치 예정일';
COMMENT ON COLUMN crm.interactions.tags                  IS '태그 배열';
COMMENT ON COLUMN crm.interactions.category              IS '카테고리';
COMMENT ON COLUMN crm.interactions.attachments           IS '첨부파일 정보 (JSON)';
COMMENT ON COLUMN crm.interactions.reference_url         IS '참조 URL (이메일, 채팅 링크 등)';
COMMENT ON COLUMN crm.interactions.is_deleted            IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.interactions.notes                 IS '비고';

-- 일반 인덱스
CREATE INDEX ix_interactions__interaction_type 
    ON crm.interactions (interaction_type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__interaction_type IS '상호작용 유형별 조회 인덱스';

CREATE INDEX ix_interactions__channel 
    ON crm.interactions (channel)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__channel IS '채널별 조회 인덱스';

CREATE INDEX ix_interactions__direction 
    ON crm.interactions (direction)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__direction IS '방향별 조회 인덱스';

CREATE INDEX ix_interactions__partner_id 
    ON crm.interactions (partner_id)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__partner_id IS '거래처별 조회 인덱스';

CREATE INDEX ix_interactions__lead_id 
    ON crm.interactions (lead_id)
 WHERE lead_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__lead_id IS '리드별 조회 인덱스';

CREATE INDEX ix_interactions__opportunity_id 
    ON crm.interactions (opportunity_id)
 WHERE opportunity_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__opportunity_id IS '영업 기회별 조회 인덱스';

CREATE INDEX ix_interactions__handled_by 
    ON crm.interactions (handled_by)
 WHERE handled_by IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__handled_by IS '처리자별 조회 인덱스';

CREATE INDEX ix_interactions__interaction_date 
    ON crm.interactions (interaction_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__interaction_date IS '상호작용 일시별 조회 인덱스';

CREATE INDEX ix_interactions__sentiment 
    ON crm.interactions (sentiment)
 WHERE sentiment IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__sentiment IS '감정 분석별 조회 인덱스';

CREATE INDEX ix_interactions__satisfaction_score 
    ON crm.interactions (satisfaction_score)
 WHERE satisfaction_score IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__satisfaction_score IS '만족도 점수별 조회 인덱스';

CREATE INDEX ix_interactions__follow_up_required
    ON crm.interactions (is_follow_up_required, follow_up_date)
 WHERE is_follow_up_required = true
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__follow_up_required IS '후속 조치 필요 조회 인덱스';

CREATE INDEX ix_interactions__category 
    ON crm.interactions (category)
 WHERE category IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__category IS '카테고리별 조회 인덱스';

CREATE INDEX ix_interactions__tags 
    ON crm.interactions USING GIN (tags)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_interactions__tags IS '태그별 조회 인덱스 (GIN)';

-- 외래키 제약조건
-- 거래처 참조 (SET NULL 삭제)
ALTER TABLE crm.interactions 
  ADD CONSTRAINT fk_interactions__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_interactions__partner_id ON crm.interactions IS '거래처 참조 외래키 (SET NULL 삭제)';

-- 리드 참조 (SET NULL 삭제)
ALTER TABLE crm.interactions 
  ADD CONSTRAINT fk_interactions__lead_id
    FOREIGN KEY (lead_id) 
    REFERENCES crm.leads(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_interactions__lead_id ON crm.interactions IS '리드 참조 외래키 (SET NULL 삭제)';

-- 담당자 참조 (SET NULL 삭제)
ALTER TABLE crm.interactions 
  ADD CONSTRAINT fk_interactions__contact_id
    FOREIGN KEY (contact_id) 
    REFERENCES crm.partner_contacts(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_interactions__contact_id ON crm.interactions IS '담당자 참조 외래키 (SET NULL 삭제)';

-- 영업 기회 참조 (SET NULL 삭제)
ALTER TABLE crm.interactions 
  ADD CONSTRAINT fk_interactions__opportunity_id
    FOREIGN KEY (opportunity_id) 
    REFERENCES crm.opportunities(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_interactions__opportunity_id ON crm.interactions IS '영업 기회 참조 외래키 (SET NULL 삭제)';

-- 처리자 참조 (SET NULL 삭제)
ALTER TABLE crm.interactions 
  ADD CONSTRAINT fk_interactions__handled_by
    FOREIGN KEY (handled_by) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_interactions__handled_by ON crm.interactions IS '처리자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.interactions 테이블 정의
-- =====================================================================================
