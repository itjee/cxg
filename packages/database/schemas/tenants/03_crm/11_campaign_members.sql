-- =====================================================================================
-- 테이블: crm.campaign_members
-- 설명: 캠페인 참여자 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.campaign_members 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 참여자 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 캠페인 정보
    campaign_id             UUID                     NOT NULL,                               -- 캠페인 ID
    
    -- 참여자 정보 (거래처 또는 리드)
    member_type             VARCHAR(20)              NOT NULL,                               -- 참여자 유형
    partner_id              UUID,                                                            -- 거래처 ID
    lead_id                 UUID,                                                            -- 리드 ID
    contact_id              UUID,                                                            -- 담당자 ID
    
    -- 참여 정보
    joined_date             DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 참여일
    invited_by              UUID,                                                            -- 초대자
    
    -- 상태 정보
    member_status           VARCHAR(20)              DEFAULT 'INVITED',                      -- 참여 상태
    
    -- 응답 정보
    has_responded           BOOLEAN                  DEFAULT false,                          -- 응답 여부
    response_date           DATE,                                                            -- 응답일
    response_type           VARCHAR(20),                                                     -- 응답 유형

    -- 전환 정보
    is_converted_to_lead    BOOLEAN                  DEFAULT false,                          -- 리드 전환 여부
    is_converted_to_opportunity BOOLEAN              DEFAULT false,                          -- 영업기회 전환 여부
    opportunity_id          UUID,                                                            -- 생성된 영업기회 ID
    
    -- 참여 채널
    channel                 VARCHAR(50),                                                     -- 참여 채널
    
    -- 논리 삭제
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 참여자 유형 체크 (PARTNER: 거래처, LEAD: 리드)
    CONSTRAINT ck_campaign_members__member_type     CHECK (member_type IN ('PARTNER', 'LEAD')),
    
    -- 참여 상태 체크 (INVITED: 초대, REGISTERED: 등록, ATTENDED: 참석, NO_SHOW: 불참, DECLINED: 거절)
    CONSTRAINT ck_campaign_members__status          CHECK (member_status IN ('INVITED', 'REGISTERED', 'ATTENDED', 'NO_SHOW', 'DECLINED', 'CANCELLED')),
    
    -- 응답 유형 체크 (POSITIVE: 긍정, NEUTRAL: 중립, NEGATIVE: 부정, INTERESTED: 관심, NOT_INTERESTED: 무관심)
    CONSTRAINT ck_campaign_members__response_type   CHECK (response_type IS NULL OR response_type IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'INTERESTED', 'NOT_INTERESTED')),
    
    -- 거래처 또는 리드 중 하나는 필수
    CONSTRAINT ck_campaign_members__member          CHECK (
        (member_type = 'PARTNER' AND partner_id IS NOT NULL AND lead_id IS NULL) OR
        (member_type = 'LEAD' AND lead_id IS NOT NULL AND partner_id IS NULL)
    )
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.campaign_members                   IS '캠페인 참여자 관리 테이블';
COMMENT ON COLUMN crm.campaign_members.id                IS '참여자 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.campaign_members.created_at        IS '등록 일시';
COMMENT ON COLUMN crm.campaign_members.created_by        IS '등록자 UUID';
COMMENT ON COLUMN crm.campaign_members.updated_at        IS '수정 일시';
COMMENT ON COLUMN crm.campaign_members.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN crm.campaign_members.campaign_id       IS '캠페인 ID';
COMMENT ON COLUMN crm.campaign_members.member_type       IS '참여자 유형 (PARTNER: 거래처, LEAD: 리드)';
COMMENT ON COLUMN crm.campaign_members.partner_id        IS '거래처 ID';
COMMENT ON COLUMN crm.campaign_members.lead_id           IS '리드 ID';
COMMENT ON COLUMN crm.campaign_members.contact_id        IS '담당자 ID (partner_contacts)';
COMMENT ON COLUMN crm.campaign_members.joined_date       IS '참여일';
COMMENT ON COLUMN crm.campaign_members.invited_by        IS '초대자 UUID';
COMMENT ON COLUMN crm.campaign_members.member_status     IS '참여 상태 (INVITED/REGISTERED/ATTENDED/NO_SHOW/DECLINED/CANCELLED)';
COMMENT ON COLUMN crm.campaign_members.has_responded         IS '응답 여부';
COMMENT ON COLUMN crm.campaign_members.response_date     IS '응답일';
COMMENT ON COLUMN crm.campaign_members.response_type     IS '응답 유형 (POSITIVE/NEUTRAL/NEGATIVE/INTERESTED/NOT_INTERESTED)';
COMMENT ON COLUMN crm.campaign_members.is_converted_to_lead IS '리드 전환 여부';
COMMENT ON COLUMN crm.campaign_members.is_converted_to_opportunity IS '영업기회 전환 여부';
COMMENT ON COLUMN crm.campaign_members.opportunity_id    IS '생성된 영업기회 ID';
COMMENT ON COLUMN crm.campaign_members.channel           IS '참여 채널';
COMMENT ON COLUMN crm.campaign_members.is_deleted        IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.campaign_members.notes             IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_campaign_members__campaign_partner 
    ON crm.campaign_members (campaign_id, partner_id)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_campaign_members__campaign_partner IS '캠페인별 거래처 유니크 제약';

CREATE UNIQUE INDEX ux_campaign_members__campaign_lead 
    ON crm.campaign_members (campaign_id, lead_id)
 WHERE lead_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_campaign_members__campaign_lead IS '캠페인별 리드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_campaign_members__campaign_id 
    ON crm.campaign_members (campaign_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_campaign_members__campaign_id IS '캠페인별 조회 인덱스';

CREATE INDEX ix_campaign_members__partner_id 
    ON crm.campaign_members (partner_id)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_campaign_members__partner_id IS '거래처별 조회 인덱스';

CREATE INDEX ix_campaign_members__lead_id 
    ON crm.campaign_members (lead_id)
 WHERE lead_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_campaign_members__lead_id IS '리드별 조회 인덱스';

CREATE INDEX ix_campaign_members__member_status 
    ON crm.campaign_members (member_status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_campaign_members__member_status IS '참여 상태별 조회 인덱스';

CREATE INDEX ix_campaign_members__responded
    ON crm.campaign_members (has_responded, response_date)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_campaign_members__responded IS '응답 여부별 조회 인덱스';

CREATE INDEX ix_campaign_members__converted
    ON crm.campaign_members (is_converted_to_lead, is_converted_to_opportunity)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_campaign_members__converted IS '전환 여부별 조회 인덱스';

-- 외래키 제약조건
-- 캠페인 참조 (CASCADE 삭제)
ALTER TABLE crm.campaign_members 
  ADD CONSTRAINT fk_campaign_members__campaign_id
    FOREIGN KEY (campaign_id) 
    REFERENCES crm.campaigns(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campaign_members__campaign_id ON crm.campaign_members IS '캠페인 참조 외래키 (CASCADE 삭제)';

-- 거래처 참조 (CASCADE 삭제)
ALTER TABLE crm.campaign_members 
  ADD CONSTRAINT fk_campaign_members__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campaign_members__partner_id ON crm.campaign_members IS '거래처 참조 외래키 (CASCADE 삭제)';

-- 리드 참조 (CASCADE 삭제)
ALTER TABLE crm.campaign_members 
  ADD CONSTRAINT fk_campaign_members__lead_id
    FOREIGN KEY (lead_id) 
    REFERENCES crm.leads(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campaign_members__lead_id ON crm.campaign_members IS '리드 참조 외래키 (CASCADE 삭제)';

-- 담당자 참조 (SET NULL 삭제)
ALTER TABLE crm.campaign_members 
  ADD CONSTRAINT fk_campaign_members__contact_id
    FOREIGN KEY (contact_id) 
    REFERENCES crm.partner_contacts(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_campaign_members__contact_id ON crm.campaign_members IS '담당자 참조 외래키 (SET NULL 삭제)';

-- 초대자 참조 (SET NULL 삭제)
ALTER TABLE crm.campaign_members 
  ADD CONSTRAINT fk_campaign_members__invited_by
    FOREIGN KEY (invited_by) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_campaign_members__invited_by ON crm.campaign_members IS '초대자 참조 외래키 (SET NULL 삭제)';

-- 영업기회 참조 (SET NULL 삭제)
ALTER TABLE crm.campaign_members 
  ADD CONSTRAINT fk_campaign_members__opportunity_id
    FOREIGN KEY (opportunity_id) 
    REFERENCES crm.opportunities(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_campaign_members__opportunity_id ON crm.campaign_members IS '영업기회 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.campaign_members 테이블 정의
-- =====================================================================================
