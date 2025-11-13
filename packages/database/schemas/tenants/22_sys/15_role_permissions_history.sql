-- =====================================================================================
-- 역할 권한 변경 이력 (감시/감사용)
-- =====================================================================================
-- 목적: 역할의 권한 변경 이력 추적, 감시/감사 리포트 작성 가능
-- 생성일: 2024-10-26
-- 우선순위: P1 (높음)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.role_permissions_history (
    -- 기본 식별자
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 테넌트, 역할, 권한
    role_id                     UUID                     NOT NULL,  -- 역할
    permission_id               UUID                     NOT NULL,  -- 권한

    -- 변경 정보
    action                      VARCHAR(20)              NOT NULL,  -- GRANTED, REVOKED
    changed_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by                  UUID,                               -- 누가 변경했나

    -- 변경 사유
    reason                      TEXT,                               -- 예: "Audit compliance", "User request"

    -- 제약조건
    CONSTRAINT fk_rp_history__role_id       FOREIGN KEY (role_id) REFERENCES sys.roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_history__permission_id FOREIGN KEY (permission_id) REFERENCES sys.permissions(id) ON DELETE CASCADE,

    CONSTRAINT ck_rp_history__action        CHECK (action IN ('GRANTED', 'REVOKED'))
);

-- 주석
COMMENT ON TABLE  sys.role_permissions_history                  IS '역할 권한 변경 이력 (감시/감사용)';
COMMENT ON COLUMN sys.role_permissions_history.id               IS '변경 이력 고유 식별자';
COMMENT ON COLUMN sys.role_permissions_history.role_id          IS '역할 ID';
COMMENT ON COLUMN sys.role_permissions_history.permission_id    IS '권한 ID';
COMMENT ON COLUMN sys.role_permissions_history.action           IS '변경 유형 (GRANTED: 권한 부여, REVOKED: 권한 제거)';
COMMENT ON COLUMN sys.role_permissions_history.changed_at       IS '변경 시각';
COMMENT ON COLUMN sys.role_permissions_history.changed_by       IS '변경을 수행한 사용자 ID';
COMMENT ON COLUMN sys.role_permissions_history.reason           IS '변경 사유 및 설명';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_rp_history__role_id
    ON sys.role_permissions_history (role_id, changed_at DESC);

CREATE INDEX IF NOT EXISTS ix_rp_history__permission_id
    ON sys.role_permissions_history (permission_id, changed_at DESC);

CREATE INDEX IF NOT EXISTS ix_rp_history__changed_by
    ON sys.role_permissions_history (changed_by, changed_at DESC);

CREATE INDEX IF NOT EXISTS ix_rp_history__action
    ON sys.role_permissions_history (action, changed_at DESC);

CREATE INDEX IF NOT EXISTS ix_rp_history__changed_at
    ON sys.role_permissions_history (changed_at DESC);

-- =====================================================================================
-- 트리거 함수: 권한 변경 시 자동 기록
-- =====================================================================================
CREATE OR REPLACE FUNCTION sys.record_role_permissions_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- 권한 추가
        INSERT INTO sys.role_permissions_history (
            tenant_id, role_id, permission_id,
            action, changed_by, changed_at
        ) VALUES (
            NEW.tenant_id,
            NEW.role_id,
            NEW.permission_id,
            'GRANTED',
            NULLIF(current_setting('app.current_user_id', true), '')::UUID,
            CURRENT_TIMESTAMP
        );
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        -- 권한 제거
        INSERT INTO sys.role_permissions_history (
            tenant_id, role_id, permission_id,
            action, changed_by, changed_at
        ) VALUES (
            OLD.tenant_id,
            OLD.role_id,
            OLD.permission_id,
            'REVOKED',
            NULLIF(current_setting('app.current_user_id', true), '')::UUID,
            CURRENT_TIMESTAMP
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION sys.record_role_permissions_change() IS '역할 권한 변경 시 이력 자동 기록 (INSERT/DELETE 감시)';

-- 트리거 생성
DROP TRIGGER IF EXISTS trigger_record_role_permissions_change ON sys.role_permissions;

CREATE TRIGGER trigger_record_role_permissions_change
    AFTER INSERT OR DELETE ON sys.role_permissions
    FOR EACH ROW
    EXECUTE FUNCTION sys.record_role_permissions_change();

COMMENT ON TRIGGER trigger_record_role_permissions_change ON sys.role_permissions IS '역할 권한 변경 시 이력을 role_permissions_history에 기록';
