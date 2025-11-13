-- ============================================================================
-- NOTI Schema - Notifications Table
-- ============================================================================
-- Purpose: Manage all types of notifications (system, billing, security, etc.)
-- Created: 2024-10-26
-- ============================================================================

CREATE TABLE IF NOT EXISTS noti.notifications
(
    -- Basic identifier and audit fields
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- Notification target information
    tenant_id                   UUID,
    user_id                     UUID,
    target_type                 VARCHAR(20)              NOT NULL DEFAULT 'USER',

    -- Notification content information
    notify_type                 VARCHAR(50)              NOT NULL,
    title                       VARCHAR(200)             NOT NULL,
    message                     TEXT                     NOT NULL,
    priority                    VARCHAR(20)              NOT NULL DEFAULT 'MEDIUM',

    -- Transmission channel settings
    channels                    TEXT[]                   NOT NULL DEFAULT ARRAY['IN_APP'],

    -- Transmission management information
    scheduled_at                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at                     TIMESTAMP WITH TIME ZONE,
    delivery_attempts           INTEGER                  NOT NULL DEFAULT 0,

    -- Receipt confirmation information
    read_at                     TIMESTAMP WITH TIME ZONE,
    acknowledged_at             TIMESTAMP WITH TIME ZONE,

    -- Action management information
    action_required             BOOLEAN                  NOT NULL DEFAULT FALSE,
    action_url                  VARCHAR(500),
    action_deadline             TIMESTAMP WITH TIME ZONE,

    -- Expiration management
    expires_at                  TIMESTAMP WITH TIME ZONE,

    -- Status management
    status                      VARCHAR(20)              NOT NULL DEFAULT 'PENDING',
    delivery_status             JSONB                    NOT NULL DEFAULT '{}',

    -- Logical deletion flag
    deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,

    -- Constraints
    CONSTRAINT fk_notifications__tenant_id
        FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications__user_id
        FOREIGN KEY (user_id) REFERENCES tnnt.users(id) ON DELETE CASCADE,

    CONSTRAINT ck_notifications__target_type
        CHECK (target_type IN ('USER', 'TENANT', 'ADMIN', 'SYSTEM')),
    CONSTRAINT ck_notifications__notify_type
        CHECK (notify_type IN ('SYSTEM_ALERT', 'BILLING_NOTICE', 'FEATURE_UPDATE', 'MAINTENANCE', 'SECURITY_ALERT', 'USER_NOTIFICATION', 'ADMIN_ALERT')),
    CONSTRAINT ck_notifications__priority
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT ck_notifications__status
        CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'EXPIRED')),
    CONSTRAINT ck_notifications__delivery_attempts_positive
        CHECK (delivery_attempts >= 0),
    CONSTRAINT ck_notifications__channels_not_empty
        CHECK (array_length(channels, 1) > 0),
    CONSTRAINT ck_notifications__action_deadline_logic
        CHECK (action_deadline IS NULL OR action_required = TRUE),
    CONSTRAINT ck_notifications__target_consistency
        CHECK (
            (target_type = 'USER' AND user_id IS NOT NULL) OR
            (target_type = 'TENANT' AND tenant_id IS NOT NULL) OR
            (target_type IN ('ADMIN', 'SYSTEM'))
        )
);

-- Table comment
COMMENT ON TABLE  noti.notifications
IS '알림 관리 - 시스템, 청구, 보안 등 모든 유형의 알림 통합 관리';

-- Column comments
COMMENT ON COLUMN noti.notifications.id
IS '알림 고유 식별자 (UUID)';
COMMENT ON COLUMN noti.notifications.created_at
IS '알림 생성 일시';
COMMENT ON COLUMN noti.notifications.created_by
IS '알림 생성자 UUID (시스템 또는 관리자)';
COMMENT ON COLUMN noti.notifications.updated_at
IS '알림 수정 일시';
COMMENT ON COLUMN noti.notifications.updated_by
IS '알림 수정자 UUID';
COMMENT ON COLUMN noti.notifications.tenant_id
IS '특정 테넌트 대상 ID - 테넌트별 알림인 경우 설정';
COMMENT ON COLUMN noti.notifications.user_id
IS '특정 사용자 대상 ID - 개별 사용자 알림인 경우 설정';
COMMENT ON COLUMN noti.notifications.target_type
IS '대상 유형 - 사용자, 테넌트, 관리자, 시스템 중 선택';
COMMENT ON COLUMN noti.notifications.notify_type
IS '알림 유형 - 시스템 경고, 청구 안내, 기능 업데이트, 유지보수, 보안 경고 등';
COMMENT ON COLUMN noti.notifications.title
IS '알림 제목 - 사용자에게 표시될 알림의 제목';
COMMENT ON COLUMN noti.notifications.message
IS '알림 메시지 내용 - 알림의 상세 내용';
COMMENT ON COLUMN noti.notifications.priority
IS '알림 우선순위 - 낮음, 보통, 높음, 긴급 중 선택';
COMMENT ON COLUMN noti.notifications.channels
IS '전송 채널 목록 - 앱 내, 이메일, SMS, 푸시, 웹훅 등 전송 방법';
COMMENT ON COLUMN noti.notifications.scheduled_at
IS '예약 발송 시각 - 알림이 발송되도록 예약된 시간';
COMMENT ON COLUMN noti.notifications.sent_at
IS '실제 발송 시각 - 알림이 실제로 발송된 시간';
COMMENT ON COLUMN noti.notifications.delivery_attempts
IS '전송 시도 횟수 - 알림 전송을 시도한 총 횟수';
COMMENT ON COLUMN noti.notifications.read_at
IS '알림 읽은 시각 - 사용자가 알림을 읽은 시간';
COMMENT ON COLUMN noti.notifications.acknowledged_at
IS '알림 확인 시각 - 사용자가 알림을 확인 처리한 시간';
COMMENT ON COLUMN noti.notifications.action_required
IS '사용자 액션 필요 여부 - 알림에 대한 사용자의 응답이나 조치가 필요한지 여부';
COMMENT ON COLUMN noti.notifications.action_url
IS '액션 수행을 위한 URL - 사용자가 조치를 취할 수 있는 링크';
COMMENT ON COLUMN noti.notifications.action_deadline
IS '액션 수행 마감일 - 사용자 조치가 필요한 경우의 마감 시한';
COMMENT ON COLUMN noti.notifications.expires_at
IS '알림 만료 일시 - 알림이 자동으로 만료되어 숨겨질 시간';
COMMENT ON COLUMN noti.notifications.status
IS '알림 상태 - 대기, 발송, 전달, 실패, 만료 중 하나';
COMMENT ON COLUMN noti.notifications.delivery_status
IS '채널별 전송 상태 - JSON 형태로 각 채널별 전송 결과 저장';
COMMENT ON COLUMN noti.notifications.deleted
IS '논리적 삭제 플래그 - 실제 삭제 대신 사용하는 소프트 딜리트';

-- ============================================================================
-- Indexes for noti.notifications
-- Purpose: Optimize notification queries, monitoring, and delivery management
-- ============================================================================

-- Index for user notification queries
-- Description: Optimize user notification retrieval (most frequent query pattern)
CREATE INDEX IF NOT EXISTS ix_notifications__user_notifications
    ON noti.notifications (user_id, created_at DESC, status)
 WHERE deleted = FALSE
   AND target_type = 'USER';

-- Index for tenant notification queries
-- Description: Optimize tenant notification retrieval
CREATE INDEX IF NOT EXISTS ix_notifications__tenant_notifications
    ON noti.notifications (tenant_id, created_at DESC, priority)
 WHERE deleted = FALSE
   AND target_type = 'TENANT';

-- Index for status-based notification queries
-- Description: Optimize admin monitoring, status-based notification retrieval
CREATE INDEX IF NOT EXISTS ix_notifications__status_management
    ON noti.notifications (status, priority, created_at DESC)
 WHERE deleted = FALSE;

-- Index for scheduled delivery management
-- Description: Optimize scheduler's retrieval of pending delivery notifications
CREATE INDEX IF NOT EXISTS ix_notifications__scheduled_delivery
    ON noti.notifications (scheduled_at, status)
 WHERE deleted = FALSE
   AND status = 'PENDING';

-- Index for notification type queries
-- Description: Optimize notification type-based queries and analysis
CREATE INDEX IF NOT EXISTS ix_notifications__notification_type
    ON noti.notifications (notify_type, priority, created_at DESC)
 WHERE deleted = FALSE;

-- Index for priority-based queries
-- Description: Optimize urgent notification (HIGH, URGENT) management
CREATE INDEX IF NOT EXISTS ix_notifications__priority_management
    ON noti.notifications (priority, status, scheduled_at)
 WHERE deleted = FALSE
   AND priority IN ('HIGH', 'URGENT');

-- Index for unread notifications
-- Description: Optimize unread notification retrieval
CREATE INDEX IF NOT EXISTS ix_notifications__unread_notifications
    ON noti.notifications (user_id, target_type, created_at DESC)
 WHERE deleted = FALSE
   AND read_at IS NULL;

-- Index for action-required notifications
-- Description: Optimize retrieval of notifications requiring user action
CREATE INDEX IF NOT EXISTS ix_notifications__action_required
    ON noti.notifications (action_required, action_deadline, user_id)
 WHERE deleted = FALSE
   AND action_required = TRUE;

-- Index for expiration management
-- Description: Optimize retrieval and cleanup of expiring notifications
CREATE INDEX IF NOT EXISTS ix_notifications__expiration_management
    ON noti.notifications (expires_at, status)
 WHERE deleted = FALSE
   AND expires_at IS NOT NULL;

-- Index for delivery failure management
-- Description: Optimize failed notification retrieval and redelivery management
CREATE INDEX IF NOT EXISTS ix_notifications__delivery_failures
    ON noti.notifications (status, delivery_attempts, scheduled_at)
 WHERE deleted = FALSE
   AND status = 'FAILED';

-- Index for target type queries
-- Description: Optimize queries by notification target type (USER, TENANT)
CREATE INDEX IF NOT EXISTS ix_notifications__target_type_analysis
    ON noti.notifications (target_type, notify_type, created_at DESC)
 WHERE deleted = FALSE;

-- Index for creation date queries
-- Description: Optimize recent notification retrieval
CREATE INDEX IF NOT EXISTS ix_notifications__created_at
    ON noti.notifications (created_at DESC)
 WHERE deleted = FALSE;

-- Index for unacknowledged notifications
-- Description: Optimize retrieval of unacknowledged action-required notifications
CREATE INDEX IF NOT EXISTS ix_notifications__unacknowledged
    ON noti.notifications (acknowledged_at, action_deadline, user_id)
 WHERE deleted = FALSE
   AND acknowledged_at IS NULL
   AND action_required = TRUE;

-- GIN Index for channel search
-- Description: Optimize notification channel array search
CREATE INDEX IF NOT EXISTS ix_notifications__channels_gin
    ON noti.notifications USING GIN (channels)
 WHERE deleted = FALSE;

-- GIN Index for delivery status JSON search
-- Description: Optimize delivery_status JSON search
CREATE INDEX IF NOT EXISTS ix_notifications__delivery_status_gin
    ON noti.notifications USING GIN (delivery_status)
 WHERE deleted = FALSE
   AND delivery_status != '{}';

-- ============================================================================
-- End of Notifications Table
-- ============================================================================
