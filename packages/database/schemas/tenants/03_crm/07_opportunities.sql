-- =====================================================================================
-- 테이블: crm.opportunities
-- 설명: 영업 기회 관리 테이블 (Sales Funnel/Pipeline)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.opportunities 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 영업 기회 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    code                    VARCHAR(50)              NOT NULL,                               -- 영업 기회 코드
    name                    VARCHAR(200)             NOT NULL,                               -- 영업 기회명
    description             TEXT,                                                            -- 설명
    
    -- 관계 정보
    partner_id              UUID,                                                            -- 거래처 ID
    lead_id                 UUID,                                                            -- 리드 ID
    contact_id              UUID,                                                            -- 담당자 ID
    
    -- 영업 단계 및 상태
    stage                   VARCHAR(20)              NOT NULL DEFAULT 'LEAD',                -- 영업 단계
    status                  VARCHAR(20)              DEFAULT 'OPEN',                         -- 상태
    
    -- 금액 정보
    amount                  NUMERIC(18,2)            DEFAULT 0,                              -- 예상 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    win_probability         INTEGER                  DEFAULT 0,                              -- 성공 확률 (%)
    expected_revenue        NUMERIC(18,2)            DEFAULT 0,                              -- 예상 수익 (금액 × 확률)
    
    -- 일정 정보
    expected_close_date     DATE,                                                            -- 예상 마감일
    actual_close_date       DATE,                                                            -- 실제 마감일
    
    -- 담당자 정보
    owner_id                UUID,                                                            -- 담당 영업자
    department_id           UUID,                                                            -- 담당 팀
    
    -- 출처 정보
    source                  VARCHAR(50),                                                     -- 기회 출처
    source_detail           VARCHAR(200),                                                    -- 출처 상세
    campaign_id             UUID,                                                            -- 관련 캠페인
    
    -- 제품/서비스 정보
    product_interest        VARCHAR(200),                                                    -- 관심 제품
    service_interest        VARCHAR(200),                                                    -- 관심 서비스
    
    -- 경쟁사 정보
    competitors             TEXT,                                                            -- 경쟁사
    our_advantage           TEXT,                                                            -- 우리의 강점
    
    -- 실패 사유 (상태가 LOST인 경우)
    lost_reason             VARCHAR(50),                                                     -- 실패 사유 코드
    lost_reason_detail      TEXT,                                                            -- 실패 사유 상세
    
    -- 수주 정보 (상태가 WON인 경우)
    won_so_id               UUID,                                                            -- 수주된 판매주문 ID
    
    -- 논리 삭제
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 영업 기회 코드 형식 체크
    CONSTRAINT ck_opportunities__code               CHECK (code ~ '^[A-Z0-9_-]{2,50}$'),
    
    -- 영업 단계 체크 (LEAD: 리드, QUALIFIED: 적격, PROPOSAL: 제안, NEGOTIATION: 협상, CLOSING: 마감)
    CONSTRAINT ck_opportunities__stage              CHECK (stage IN ('LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSING', 'WON', 'LOST')),
    
    -- 상태 체크 (OPEN: 진행중, WON: 수주, LOST: 실주, CANCELLED: 취소)
    CONSTRAINT ck_opportunities__status             CHECK (status IN ('OPEN', 'WON', 'LOST', 'CANCELLED')),
    
    -- 금액 음수 불가 체크
    CONSTRAINT ck_opportunities__amount             CHECK (amount >= 0),
    
    -- 성공 확률 범위 체크 (0-100%)
    CONSTRAINT ck_opportunities__win_probability    CHECK (win_probability >= 0 AND win_probability <= 100),
    
    -- 예상 수익 음수 불가 체크
    CONSTRAINT ck_opportunities__expected_revenue   CHECK (expected_revenue >= 0),
    
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_opportunities__currency           CHECK (currency ~ '^[A-Z]{3}$')
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.opportunities                      IS '영업 기회 관리 테이블 (Sales Funnel/Pipeline)';
COMMENT ON COLUMN crm.opportunities.id                   IS '영업 기회 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.opportunities.created_at           IS '등록 일시';
COMMENT ON COLUMN crm.opportunities.created_by           IS '등록자 UUID';
COMMENT ON COLUMN crm.opportunities.updated_at           IS '수정 일시';
COMMENT ON COLUMN crm.opportunities.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN crm.opportunities.code                 IS '영업 기회 코드 (고유번호)';
COMMENT ON COLUMN crm.opportunities.name                 IS '영업 기회명';
COMMENT ON COLUMN crm.opportunities.description          IS '설명';
COMMENT ON COLUMN crm.opportunities.partner_id           IS '거래처 ID';
COMMENT ON COLUMN crm.opportunities.lead_id              IS '리드 ID';
COMMENT ON COLUMN crm.opportunities.contact_id           IS '담당자 ID (partner_contacts)';
COMMENT ON COLUMN crm.opportunities.stage                IS '영업 단계 (LEAD/QUALIFIED/PROPOSAL/NEGOTIATION/CLOSING/WON/LOST)';
COMMENT ON COLUMN crm.opportunities.status               IS '상태 (OPEN/WON/LOST/CANCELLED)';
COMMENT ON COLUMN crm.opportunities.amount               IS '예상 금액';
COMMENT ON COLUMN crm.opportunities.currency             IS '통화 (ISO 4217)';
COMMENT ON COLUMN crm.opportunities.win_probability      IS '성공 확률 (0-100%)';
COMMENT ON COLUMN crm.opportunities.expected_revenue     IS '예상 수익 (금액 × 확률)';
COMMENT ON COLUMN crm.opportunities.expected_close_date  IS '예상 마감일';
COMMENT ON COLUMN crm.opportunities.actual_close_date    IS '실제 마감일';
COMMENT ON COLUMN crm.opportunities.owner_id             IS '담당 영업자 UUID';
COMMENT ON COLUMN crm.opportunities.department_id              IS '담당 팀 UUID';
COMMENT ON COLUMN crm.opportunities.source               IS '기회 출처 (WEBSITE/REFERRAL/EXHIBITION/CAMPAIGN/COLD_CALL 등)';
COMMENT ON COLUMN crm.opportunities.source_detail        IS '출처 상세 설명';
COMMENT ON COLUMN crm.opportunities.campaign_id          IS '관련 캠페인 ID';
COMMENT ON COLUMN crm.opportunities.product_interest     IS '관심 제품';
COMMENT ON COLUMN crm.opportunities.service_interest     IS '관심 서비스';
COMMENT ON COLUMN crm.opportunities.competitors          IS '경쟁사 정보';
COMMENT ON COLUMN crm.opportunities.our_advantage        IS '우리의 강점';
COMMENT ON COLUMN crm.opportunities.lost_reason          IS '실패 사유 코드 (PRICE/COMPETITOR/NO_BUDGET/NO_DECISION/TIMING 등)';
COMMENT ON COLUMN crm.opportunities.lost_reason_detail   IS '실패 사유 상세';
COMMENT ON COLUMN crm.opportunities.won_so_id            IS '수주된 판매주문 ID';
COMMENT ON COLUMN crm.opportunities.is_deleted           IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.opportunities.notes                IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_opportunities__code 
    ON crm.opportunities (code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_opportunities__code IS '영업 기회 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_opportunities__name 
    ON crm.opportunities (name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__name IS '영업 기회명별 조회 인덱스';

CREATE INDEX ix_opportunities__partner_id 
    ON crm.opportunities (partner_id)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__partner_id IS '거래처별 조회 인덱스';

CREATE INDEX ix_opportunities__lead_id 
    ON crm.opportunities (lead_id)
 WHERE lead_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__lead_id IS '리드별 조회 인덱스';

CREATE INDEX ix_opportunities__stage 
    ON crm.opportunities (stage)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__stage IS '영업 단계별 조회 인덱스';

CREATE INDEX ix_opportunities__status 
    ON crm.opportunities (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__status IS '상태별 조회 인덱스';

CREATE INDEX ix_opportunities__owner_id 
    ON crm.opportunities (owner_id)
 WHERE owner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__owner_id IS '담당 영업자별 조회 인덱스';

CREATE INDEX ix_opportunities__department_id 
    ON crm.opportunities (department_id)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__department_id IS '담당 팀별 조회 인덱스';

CREATE INDEX ix_opportunities__expected_close_date 
    ON crm.opportunities (expected_close_date)
 WHERE expected_close_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__expected_close_date IS '예상 마감일별 조회 인덱스';

CREATE INDEX ix_opportunities__amount 
    ON crm.opportunities (amount DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__amount IS '예상 금액별 조회 인덱스';

CREATE INDEX ix_opportunities__win_probability 
    ON crm.opportunities (win_probability DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__win_probability IS '성공 확률별 조회 인덱스';

CREATE INDEX ix_opportunities__source 
    ON crm.opportunities (source)
 WHERE source IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__source IS '출처별 조회 인덱스';

CREATE INDEX ix_opportunities__campaign_id 
    ON crm.opportunities (campaign_id)
 WHERE campaign_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__campaign_id IS '캠페인별 조회 인덱스';

CREATE INDEX ix_opportunities__created_at 
    ON crm.opportunities (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_opportunities__created_at IS '등록일시별 조회 인덱스';

-- 외래키 제약조건
-- 거래처 참조 (SET NULL 삭제)
ALTER TABLE crm.opportunities 
  ADD CONSTRAINT fk_opportunities__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_opportunities__partner_id ON crm.opportunities IS '거래처 참조 외래키 (SET NULL 삭제)';

-- 리드 참조 (SET NULL 삭제)
ALTER TABLE crm.opportunities 
  ADD CONSTRAINT fk_opportunities__lead_id
    FOREIGN KEY (lead_id) 
    REFERENCES crm.leads(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_opportunities__lead_id ON crm.opportunities IS '리드 참조 외래키 (SET NULL 삭제)';

-- 담당자 참조 (SET NULL 삭제)
ALTER TABLE crm.opportunities 
  ADD CONSTRAINT fk_opportunities__contact_id
    FOREIGN KEY (contact_id) 
    REFERENCES crm.partner_contacts(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_opportunities__contact_id ON crm.opportunities IS '담당자 참조 외래키 (SET NULL 삭제)';

-- 담당 영업자 참조 (SET NULL 삭제)
ALTER TABLE crm.opportunities 
  ADD CONSTRAINT fk_opportunities__owner_id
    FOREIGN KEY (owner_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_opportunities__owner_id ON crm.opportunities IS '담당 영업자 참조 외래키 (SET NULL 삭제)';

-- 담당 팀 참조 (SET NULL 삭제)
ALTER TABLE crm.opportunities 
  ADD CONSTRAINT fk_opportunities__department_id
    FOREIGN KEY (department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_opportunities__department_id ON crm.opportunities IS '담당 팀 참조 외래키 (SET NULL 삭제)';

-- 판매주문 참조 (SET NULL 삭제)
-- ALTER TABLE crm.opportunities 
--   ADD CONSTRAINT fk_opportunities__won_so_id
--     FOREIGN KEY (won_so_id) 
--     REFERENCES srm.sales_orders(id) 
--     ON DELETE SET NULL;
-- COMMENT ON CONSTRAINT fk_opportunities__won_so_id ON crm.opportunities IS '수주된 판매주문 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.opportunities 테이블 정의
-- =====================================================================================
