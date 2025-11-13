-- ============================================================================
-- NOTI Schema - Campaigns Table
-- ============================================================================
-- Purpose: Manage email campaigns for marketing, announcements, and newsletters
-- Created: 2024-10-26
-- ============================================================================

CREATE TABLE IF NOT EXISTS noti.campaigns
(
    -- Basic identifier and audit fields
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- Campaign basic information
    campaign_name               VARCHAR(200)             NOT NULL,
    campaign_type               VARCHAR(50)              NOT NULL,
    description                 TEXT,

    -- Target settings
    target_type                 VARCHAR(20)              NOT NULL DEFAULT 'users',
    target_tenant_types         TEXT[],
    target_user_roles           TEXT[],
    custom_recipients           UUID[],

    -- Email content
    subject                     VARCHAR(500)             NOT NULL,
    html_content                TEXT,
    text_content                TEXT,

    -- Sender settings
    sender_name                 VARCHAR(100)             NOT NULL DEFAULT 'AI 업무지원 플랫폼',
    sender_email                VARCHAR(255)             NOT NULL DEFAULT 'noreply@platform.com',
    reply_to_email              VARCHAR(255),

    -- Scheduling settings
    send_immediately            BOOLEAN                  NOT NULL DEFAULT FALSE,
    scheduled_send_at           TIMESTAMP WITH TIME ZONE,
    timezone                    VARCHAR(50)              NOT NULL DEFAULT 'Asia/Seoul',

    -- Delivery statistics
    total_recipients            INTEGER                  NOT NULL DEFAULT 0,
    sent_count                  INTEGER                  NOT NULL DEFAULT 0,
    delivered_count             INTEGER                  NOT NULL DEFAULT 0,
    opened_count                INTEGER                  NOT NULL DEFAULT 0,
    clicked_count               INTEGER                  NOT NULL DEFAULT 0,
    bounced_count               INTEGER                  NOT NULL DEFAULT 0,
    unsubscribed_count          INTEGER                  NOT NULL DEFAULT 0,

    -- A/B Test settings
    is_ab_test                  BOOLEAN                  NOT NULL DEFAULT FALSE,
    ab_test_rate                INTEGER,
    ab_subject                  VARCHAR(500),
    ab_content                  TEXT,

    -- Status management
    status                      VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',
    sent_at                     TIMESTAMP WITH TIME ZONE,
    completed_at                TIMESTAMP WITH TIME ZONE,

    -- Logical deletion flag
    deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,

    -- Constraints
    CONSTRAINT ck_campaigns__campaign_type
        CHECK (campaign_type IN ('PROMOTIONAL', 'TRANSACTIONAL', 'NEWSLETTER', 'ANNOUNCEMENT', 'SURVEY', 'WELCOME')),
    CONSTRAINT ck_campaigns__target_type
        CHECK (target_type IN ('ALL_USERS', 'users', 'ADMIN_USERS', 'CUSTOM_LIST')),
    CONSTRAINT ck_campaigns__status
        CHECK (status IN ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'PAUSED', 'CANCELED')),
    CONSTRAINT ck_campaigns__ab_test_rate
        CHECK (ab_test_rate IS NULL OR (ab_test_rate BETWEEN 1 AND 99)),
    CONSTRAINT ck_campaigns__statistics_positive
        CHECK (total_recipients >= 0 AND sent_count >= 0 AND delivered_count >= 0 AND opened_count >= 0 AND clicked_count >= 0 AND bounced_count >= 0 AND unsubscribed_count >= 0),
    CONSTRAINT ck_campaigns__statistics_logic
        CHECK (sent_count <= total_recipients AND delivered_count <= sent_count AND opened_count <= delivered_count AND clicked_count <= opened_count),
    CONSTRAINT ck_campaigns__content_required
        CHECK (html_content IS NOT NULL OR text_content IS NOT NULL),
    CONSTRAINT ck_campaigns__ab_test_logic
        CHECK ((is_ab_test = FALSE) OR (is_ab_test = TRUE AND ab_test_rate IS NOT NULL AND ab_subject IS NOT NULL)),
    CONSTRAINT ck_campaigns__sender_email_format
        CHECK (sender_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT ck_campaigns__reply_to_email_format
        CHECK (reply_to_email IS NULL OR reply_to_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Table comment
COMMENT ON TABLE  noti.campaigns
IS '이메일 캠페인 - 마케팅, 공지사항, 뉴스레터 등 대량 이메일 발송 관리';

-- Column comments
COMMENT ON COLUMN noti.campaigns.id
IS '캠페인 고유 식별자 (UUID)';
COMMENT ON COLUMN noti.campaigns.created_at
IS '캠페인 생성 일시';
COMMENT ON COLUMN noti.campaigns.created_by
IS '캠페인 생성자 UUID (마케터 또는 관리자)';
COMMENT ON COLUMN noti.campaigns.updated_at
IS '캠페인 수정 일시';
COMMENT ON COLUMN noti.campaigns.updated_by
IS '캠페인 수정자 UUID';
COMMENT ON COLUMN noti.campaigns.campaign_name
IS '캠페인 이름 - 캠페인을 식별하기 위한 이름';
COMMENT ON COLUMN noti.campaigns.campaign_type
IS '캠페인 유형 - 프로모션, 트랜잭션, 뉴스레터, 공지사항 등';
COMMENT ON COLUMN noti.campaigns.description
IS '캠페인 설명 - 캠페인의 목적과 내용에 대한 설명';
COMMENT ON COLUMN noti.campaigns.target_type
IS '대상 유형 - 전체 사용자, 테넌트 사용자, 관리자, 사용자 정의 목록 중 선택';
COMMENT ON COLUMN noti.campaigns.target_tenant_types
IS '대상 테넌트 유형 목록 - 특정 테넌트 유형에만 발송할 경우 설정';
COMMENT ON COLUMN noti.campaigns.target_user_roles
IS '대상 사용자 역할 목록 - 특정 역할의 사용자에게만 발송할 경우 설정';
COMMENT ON COLUMN noti.campaigns.custom_recipients
IS '사용자 정의 수신자 UUID 목록 - 직접 선택한 수신자들';
COMMENT ON COLUMN noti.campaigns.subject
IS '이메일 제목 - 수신자에게 표시될 이메일 제목';
COMMENT ON COLUMN noti.campaigns.html_content
IS 'HTML 이메일 내용 - 리치 텍스트 형태의 이메일 본문';
COMMENT ON COLUMN noti.campaigns.text_content
IS '텍스트 이메일 내용 - 플레인 텍스트 형태의 이메일 본문';
COMMENT ON COLUMN noti.campaigns.sender_name
IS '발송자 이름 - 수신자에게 표시될 발송자 이름';
COMMENT ON COLUMN noti.campaigns.sender_email
IS '발송자 이메일 - 이메일 발송에 사용할 발송자 주소';
COMMENT ON COLUMN noti.campaigns.reply_to_email
IS '답장 이메일 주소 - 수신자가 답장할 때 사용할 이메일 주소';
COMMENT ON COLUMN noti.campaigns.send_immediately
IS '즉시 발송 여부 - 생성 즉시 발송할지 예약 발송할지 여부';
COMMENT ON COLUMN noti.campaigns.scheduled_send_at
IS '예약 발송 시각 - 이메일이 발송될 예정 시간';
COMMENT ON COLUMN noti.campaigns.timezone
IS '시간대 설정 - 예약 발송 시 적용할 시간대';
COMMENT ON COLUMN noti.campaigns.total_recipients
IS '총 수신자 수 - 이메일을 받을 전체 수신자 수';
COMMENT ON COLUMN noti.campaigns.sent_count
IS '발송 성공 건수 - 성공적으로 발송된 이메일 수';
COMMENT ON COLUMN noti.campaigns.delivered_count
IS '전달 성공 건수 - 수신자에게 실제 전달된 이메일 수';
COMMENT ON COLUMN noti.campaigns.opened_count
IS '열람 건수 - 수신자가 이메일을 열어본 횟수';
COMMENT ON COLUMN noti.campaigns.clicked_count
IS '클릭 건수 - 이메일 내 링크를 클릭한 횟수';
COMMENT ON COLUMN noti.campaigns.bounced_count
IS '반송 건수 - 전달 실패로 반송된 이메일 수';
COMMENT ON COLUMN noti.campaigns.unsubscribed_count
IS '구독 취소 건수 - 이메일을 통해 구독 취소한 수신자 수';
COMMENT ON COLUMN noti.campaigns.is_ab_test
IS 'A/B 테스트 여부 - 두 가지 버전을 테스트할지 여부';
COMMENT ON COLUMN noti.campaigns.ab_test_rate
IS 'A 그룹 비율 (백분율) - A/B 테스트 시 A 그룹에 할당할 비율';
COMMENT ON COLUMN noti.campaigns.ab_subject
IS 'B 그룹 이메일 제목 - A/B 테스트용 대안 제목';
COMMENT ON COLUMN noti.campaigns.ab_content
IS 'B 그룹 이메일 내용 - A/B 테스트용 대안 내용';
COMMENT ON COLUMN noti.campaigns.status
IS '캠페인 상태 - 초안, 예약됨, 발송중, 발송완료, 일시중단, 취소 중 하나';
COMMENT ON COLUMN noti.campaigns.sent_at
IS '발송 시작 시각 - 이메일 발송이 시작된 시간';
COMMENT ON COLUMN noti.campaigns.completed_at
IS '발송 완료 시각 - 모든 이메일 발송이 완료된 시간';
COMMENT ON COLUMN noti.campaigns.deleted
IS '논리적 삭제 플래그 - 실제 삭제 대신 사용하는 소프트 딜리트';

-- ============================================================================
-- Indexes for noti.campaigns
-- Purpose: Optimize campaign queries, delivery management, and analytics
-- ============================================================================

-- Index for campaign status management (most frequent query pattern)
CREATE INDEX IF NOT EXISTS ix_campaigns__status_management
    ON noti.campaigns (status, created_at DESC)
 WHERE deleted = FALSE;

-- Index for campaign type analysis
CREATE INDEX IF NOT EXISTS ix_campaigns__campaign_type_analysis
    ON noti.campaigns (campaign_type, status, created_at DESC)
 WHERE deleted = FALSE;

-- Index for scheduled delivery management
CREATE INDEX IF NOT EXISTS ix_campaigns__scheduled_delivery
    ON noti.campaigns (scheduled_send_at, status)
 WHERE deleted = FALSE
   AND status = 'SCHEDULED';

-- Index for delivery performance analysis
CREATE INDEX IF NOT EXISTS ix_campaigns__performance_analysis
    ON noti.campaigns (campaign_type, sent_at DESC, total_recipients)
 WHERE deleted = FALSE
   AND status = 'SENT';

-- Index for A/B test campaign management
CREATE INDEX IF NOT EXISTS ix_campaigns__ab_test_management
    ON noti.campaigns (is_ab_test, campaign_type, status)
 WHERE deleted = FALSE
   AND is_ab_test = TRUE;

-- Index for target type management
CREATE INDEX IF NOT EXISTS ix_campaigns__target_type_management
    ON noti.campaigns (target_type, campaign_type, created_at DESC)
 WHERE deleted = FALSE;

-- Index for creator-based campaign management
CREATE INDEX IF NOT EXISTS ix_campaigns__creator_management
    ON noti.campaigns (created_by, created_at DESC, status)
 WHERE deleted = FALSE;

-- Index for completed campaigns
CREATE INDEX IF NOT EXISTS ix_campaigns__completed_campaigns
    ON noti.campaigns (completed_at DESC, campaign_type)
 WHERE deleted = FALSE
   AND status = 'SENT';

-- Index for campaign name search
CREATE INDEX IF NOT EXISTS ix_campaigns__campaign_name
    ON noti.campaigns (campaign_name)
 WHERE deleted = FALSE;

-- Index for creation date queries
CREATE INDEX IF NOT EXISTS ix_campaigns__created_at
    ON noti.campaigns (created_at DESC)
 WHERE deleted = FALSE;

-- Index for open rate analysis
CREATE INDEX IF NOT EXISTS ix_campaigns__open_rate_analysis
    ON noti.campaigns (campaign_type, opened_count, delivered_count)
 WHERE deleted = FALSE
   AND status = 'SENT'
   AND delivered_count > 0;

-- Index for click rate analysis
CREATE INDEX IF NOT EXISTS ix_campaigns__click_rate_analysis
    ON noti.campaigns (campaign_type, clicked_count, opened_count)
 WHERE deleted = FALSE
   AND status = 'SENT'
   AND opened_count > 0;

-- Index for bounce rate monitoring
CREATE INDEX IF NOT EXISTS ix_campaigns__bounce_rate_monitoring
    ON noti.campaigns (bounced_count, sent_count, campaign_type)
 WHERE deleted = FALSE
   AND status = 'SENT'
   AND bounced_count > 0;

-- GIN Index for target tenant types search
CREATE INDEX IF NOT EXISTS ix_campaigns__target_tenant_types_gin
    ON noti.campaigns USING GIN (target_tenant_types)
 WHERE deleted = FALSE
   AND target_tenant_types IS NOT NULL;

-- GIN Index for target user roles search
CREATE INDEX IF NOT EXISTS ix_campaigns__target_user_roles_gin
    ON noti.campaigns USING GIN (target_user_roles)
 WHERE deleted = FALSE
   AND target_user_roles IS NOT NULL;

-- GIN Index for custom recipients search
CREATE INDEX IF NOT EXISTS ix_campaigns__custom_recipients_gin
    ON noti.campaigns USING GIN (custom_recipients)
 WHERE deleted = FALSE
   AND target_type = 'CUSTOM_LIST';

-- ============================================================================
-- End of Campaigns Table
-- ============================================================================
