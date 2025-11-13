-- =====================================================================================
-- 테이블: crm.campaigns
-- 설명: 마케팅 캠페인 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.campaigns 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 캠페인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 캠페인 기본 정보
    campaign_code           VARCHAR(50)              NOT NULL,                               -- 캠페인 코드
    campaign_name           VARCHAR(200)             NOT NULL,                               -- 캠페인명
    campaign_type           VARCHAR(20)              NOT NULL,                               -- 캠페인 유형
    description             TEXT,                                                            -- 설명
    
    -- 캠페인 유형 및 카테고리    
    category                VARCHAR(50),                                                     -- 카테고리
    
    -- 일정 정보
    start_date              DATE                     NOT NULL,                               -- 시작일
    end_date                DATE,                                                            -- 종료일
    
    -- 예산 및 비용
    budget_amount           NUMERIC(18,2)            DEFAULT 0,                              -- 예산
    actual_cost             NUMERIC(18,2)            DEFAULT 0,                              -- 실제 비용
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 목표 설정
    target_audience         TEXT,                                                            -- 목표 대상
    target_leads            INTEGER,                                                         -- 목표 리드 수
    target_opportunities    INTEGER,                                                         -- 목표 영업기회 수
    target_revenue          NUMERIC(18,2),                                                   -- 목표 매출
    
    -- 실적
    actual_leads            INTEGER                  DEFAULT 0,                              -- 실제 리드 수
    actual_opportunities    INTEGER                  DEFAULT 0,                              -- 실제 영업기회 수
    actual_revenue          NUMERIC(18,2)            DEFAULT 0,                              -- 실제 매출
    
    -- 담당자 정보
    owner_id                UUID,                                                            -- 담당자
    department_id           UUID,                                                            -- 담당 팀
    
    -- 채널 정보
    primary_channel         VARCHAR(50),                                                     -- 주 채널
    channels                TEXT[],                                                          -- 사용 채널 (배열)
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'PLANNED',                      -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 링크 및 참조
    landing_page_url        VARCHAR(500),                                                    -- 랜딩 페이지 URL
    tracking_code           VARCHAR(100),                                                    -- 트래킹 코드
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 캠페인 코드 형식 체크
    CONSTRAINT ck_campaigns__code                   CHECK (campaign_code ~ '^[A-Z0-9_-]{2,50}$'),
    
    -- 캠페인 유형 체크 (EMAIL: 이메일, EXHIBITION: 전시회, WEBINAR: 웨비나, AD: 광고, SOCIAL: SNS, EVENT: 이벤트)
    CONSTRAINT ck_campaigns__type                   CHECK (campaign_type IN ('EMAIL', 'EXHIBITION', 'WEBINAR', 'AD', 'SOCIAL', 'EVENT', 'CONTENT', 'REFERRAL', 'OTHER')),
    
    -- 상태 체크 (PLANNED: 계획, IN_PROGRESS: 진행중, COMPLETED: 완료, CANCELLED: 취소, ON_HOLD: 보류)
    CONSTRAINT ck_campaigns__status                 CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD')),
    
    -- 예산 음수 불가 체크
    CONSTRAINT ck_campaigns__budget_amount          CHECK (budget_amount >= 0),
    
    -- 실제 비용 음수 불가 체크
    CONSTRAINT ck_campaigns__actual_cost            CHECK (actual_cost >= 0),
    
    -- 목표 리드 수 양수 체크
    CONSTRAINT ck_campaigns__target_leads           CHECK (target_leads IS NULL OR target_leads > 0),
    
    -- 실제 리드 수 음수 불가 체크
    CONSTRAINT ck_campaigns__actual_leads           CHECK (actual_leads >= 0),
    
    -- 통화 코드 형식 체크
    CONSTRAINT ck_campaigns__currency               CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 종료일은 시작일 이후여야 함
    CONSTRAINT ck_campaigns__dates                  CHECK (end_date IS NULL OR end_date >= start_date)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.campaigns                          IS '마케팅 캠페인 관리 테이블';
COMMENT ON COLUMN crm.campaigns.id                       IS '캠페인 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.campaigns.created_at               IS '등록 일시';
COMMENT ON COLUMN crm.campaigns.created_by               IS '등록자 UUID';
COMMENT ON COLUMN crm.campaigns.updated_at               IS '수정 일시';
COMMENT ON COLUMN crm.campaigns.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN crm.campaigns.campaign_code            IS '캠페인 코드 (고유번호)';
COMMENT ON COLUMN crm.campaigns.campaign_name            IS '캠페인명';
COMMENT ON COLUMN crm.campaigns.description              IS '설명';
COMMENT ON COLUMN crm.campaigns.campaign_type            IS '캠페인 유형 (EMAIL/EXHIBITION/WEBINAR/AD/SOCIAL/EVENT/CONTENT/REFERRAL/OTHER)';
COMMENT ON COLUMN crm.campaigns.category                 IS '카테고리';
COMMENT ON COLUMN crm.campaigns.start_date               IS '시작일';
COMMENT ON COLUMN crm.campaigns.end_date                 IS '종료일';
COMMENT ON COLUMN crm.campaigns.budget_amount            IS '예산';
COMMENT ON COLUMN crm.campaigns.actual_cost              IS '실제 비용';
COMMENT ON COLUMN crm.campaigns.currency                 IS '통화 (ISO 4217)';
COMMENT ON COLUMN crm.campaigns.target_audience          IS '목표 대상 (페르소나, 세그먼트 등)';
COMMENT ON COLUMN crm.campaigns.target_leads             IS '목표 리드 수';
COMMENT ON COLUMN crm.campaigns.target_opportunities     IS '목표 영업기회 수';
COMMENT ON COLUMN crm.campaigns.target_revenue           IS '목표 매출';
COMMENT ON COLUMN crm.campaigns.actual_leads             IS '실제 생성된 리드 수';
COMMENT ON COLUMN crm.campaigns.actual_opportunities     IS '실제 생성된 영업기회 수';
COMMENT ON COLUMN crm.campaigns.actual_revenue           IS '실제 매출';
COMMENT ON COLUMN crm.campaigns.owner_id                 IS '담당자 UUID';
COMMENT ON COLUMN crm.campaigns.department_id                  IS '담당 팀 UUID';
COMMENT ON COLUMN crm.campaigns.primary_channel          IS '주 채널';
COMMENT ON COLUMN crm.campaigns.channels                 IS '사용 채널 배열 (이메일, SNS, 웹광고 등)';
COMMENT ON COLUMN crm.campaigns.status                   IS '상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED/ON_HOLD)';
COMMENT ON COLUMN crm.campaigns.is_deleted               IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.campaigns.landing_page_url         IS '랜딩 페이지 URL';
COMMENT ON COLUMN crm.campaigns.tracking_code            IS '트래킹 코드 (UTM 코드 등)';
COMMENT ON COLUMN crm.campaigns.notes                    IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_campaigns__code 
    ON crm.campaigns (campaign_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_campaigns__code IS '캠페인 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_campaigns__name 
    ON crm.campaigns (campaign_name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_campaigns__name IS '캠페인명별 조회 인덱스';

CREATE INDEX ix_campaigns__campaign_type 
    ON crm.campaigns (campaign_type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_campaigns__campaign_type IS '캠페인 유형별 조회 인덱스';

CREATE INDEX ix_campaigns__status 
    ON crm.campaigns (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_campaigns__status IS '상태별 조회 인덱스';

CREATE INDEX ix_campaigns__owner_id 
    ON crm.campaigns (owner_id)
 WHERE owner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_campaigns__owner_id IS '담당자별 조회 인덱스';

CREATE INDEX ix_campaigns__start_date 
    ON crm.campaigns (start_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_campaigns__start_date IS '시작일별 조회 인덱스';

CREATE INDEX ix_campaigns__channels 
    ON crm.campaigns USING GIN (channels)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_campaigns__channels IS '채널별 조회 인덱스 (GIN)';

-- 외래키 제약조건
-- 담당자 참조 (SET NULL 삭제)
ALTER TABLE crm.campaigns 
  ADD CONSTRAINT fk_campaigns__owner_id
    FOREIGN KEY (owner_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_campaigns__owner_id ON crm.campaigns IS '담당자 참조 외래키 (SET NULL 삭제)';

-- 담당 팀 참조 (SET NULL 삭제)
ALTER TABLE crm.campaigns 
  ADD CONSTRAINT fk_campaigns__department_id
    FOREIGN KEY (department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_campaigns__department_id ON crm.campaigns IS '담당 팀 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.campaigns 테이블 정의
-- =====================================================================================
