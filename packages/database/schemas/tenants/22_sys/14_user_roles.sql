-- =====================================================================================
-- 테넌트 사용자-역할 매핑 (감시 포함)
-- =====================================================================================
-- 목적: 사용자-역할 매핑의 이력 추적, 임시 역할 지원, Manager DB의 idam.user_roles과 동일한 구조
-- 생성일: 2024-10-26
-- 우선순위: P1 (높음)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.user_roles (
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- 사용자, 역할
    user_id                     UUID                     NOT NULL,  -- FK: sys.users
    role_id                     UUID                     NOT NULL,  -- FK: sys.roles

    -- 역할 할당 정보
    granted_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 할당 시각
    granted_by                  UUID,                               -- 누가 할당했나

    -- 역할 만료 (임시 역할 지원)
    expires_at                  TIMESTAMP WITH TIME ZONE,           -- NULL: 무기한, 값: 임시 역할

    -- 권한 충돌 해결 정책 (다중 역할 사용 시)
    conflict_resolution_policy_id UUID,                             -- 이 역할 할당에 적용될 권한 충돌 해결 정책 ID

    -- 역할 해제 정보
    revoked_at                  TIMESTAMP WITH TIME ZONE,           -- 역할 해제 시각
    revoked_by                  UUID,                               -- 누가 해제했나
    revoke_reason               TEXT,                               -- 해제 사유

    -- 상태
    is_active                   BOOLEAN                  NOT NULL DEFAULT TRUE,  -- 활성 여부

    -- 제약조건
    CONSTRAINT fk_user_roles__user_id                       FOREIGN KEY (user_id) REFERENCES sys.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles__role_id                       FOREIGN KEY (role_id) REFERENCES sys.roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles__conflict_resolution_policy_id FOREIGN KEY (conflict_resolution_policy_id) REFERENCES sys.permission_conflict_resolution(id) ON DELETE SET NULL,

    -- 체크 제약
    CONSTRAINT ck_user_roles__expires   CHECK (expires_at IS NULL OR expires_at > granted_at),
    CONSTRAINT ck_user_roles__revoke    CHECK (revoked_at IS NULL OR revoked_at >= granted_at)
);

-- 주석
COMMENT ON TABLE  sys.user_roles                       IS '테넌트 사용자-역할 매핑 (할당 이력 포함)';
COMMENT ON COLUMN sys.user_roles.id                    IS '매핑 고유 식별자';
COMMENT ON COLUMN sys.user_roles.created_at            IS '매핑 생성 시각';
COMMENT ON COLUMN sys.user_roles.created_by            IS '매핑을 생성한 사용자 ID';
COMMENT ON COLUMN sys.user_roles.updated_at            IS '마지막 수정 시각';
COMMENT ON COLUMN sys.user_roles.updated_by            IS '마지막 수정한 사용자 ID';
COMMENT ON COLUMN sys.user_roles.user_id               IS '사용자 ID';
COMMENT ON COLUMN sys.user_roles.role_id               IS '역할 ID';
COMMENT ON COLUMN sys.user_roles.granted_at            IS '역할 할당 시각';
COMMENT ON COLUMN sys.user_roles.granted_by            IS '역할을 할당한 사용자 ID';
COMMENT ON COLUMN sys.user_roles.expires_at            IS '역할 만료 시각 (NULL: 무기한, 값: 임시 역할)';
COMMENT ON COLUMN sys.user_roles.revoked_at            IS '역할 해제 시각';
COMMENT ON COLUMN sys.user_roles.revoked_by            IS '역할을 해제한 사용자 ID';
COMMENT ON COLUMN sys.user_roles.revoke_reason         IS '역할 해제 사유 (예: 휴가 종료)';
COMMENT ON COLUMN sys.user_roles.conflict_resolution_policy_id IS '권한 충돌 해결 정책 ID (사용자가 여러 역할을 가질 때 권한 병합 규칙)';
COMMENT ON COLUMN sys.user_roles.is_active             IS '활성 여부 (TRUE: 활성, FALSE: 비활성/해제됨)';

CREATE INDEX IF NOT EXISTS ux_user_roles__user_role
    ON sys.user_roles (user_id, role_id)
 WHERE is_active = TRUE;

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_user_roles__user_id
    ON sys.user_roles (user_id)
 WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS ix_user_roles__role_id
    ON sys.user_roles (role_id)
 WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS ix_user_roles__expires_at
    ON sys.user_roles (expires_at)
 WHERE expires_at IS NOT NULL AND is_active = TRUE;

CREATE INDEX IF NOT EXISTS ix_user_roles__granted_by
    ON sys.user_roles (granted_by)
 WHERE granted_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_user_roles__revoked_by
    ON sys.user_roles (revoked_by)
 WHERE revoked_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_user_roles__conflict_resolution_policy_id
    ON sys.user_roles (conflict_resolution_policy_id)
 WHERE conflict_resolution_policy_id IS NOT NULL AND is_active = TRUE;
