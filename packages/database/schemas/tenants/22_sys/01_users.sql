-- =====================================================================================
-- 테이블: sys.users
-- 설명: 시스템 사용자 정보를 관리하는 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-27
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.users
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 사용자 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID (NULL 허용 - 시스템 사용자용)
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID

    -- 사용자 기본 정보
    username                VARCHAR(100)             NOT NULL,                                           -- 로그인 사용자명 (테넌트 내 유니크)
    password                VARCHAR(255)             NOT NULL,                                           -- 암호화된 비밀번호

    full_name               VARCHAR(100),                                                                -- 이름
    email                   VARCHAR(255)             NOT NULL,                                           -- 이메일 주소 (테넌트 내 유니크)
    phone                   VARCHAR(50),                                                                 -- 전화번호

    -- 역할 및 권한 충돌 해결
    role_id                 UUID,                                                                        -- 기본 역할 ID (단일 역할인 경우)
    default_conflict_resolution_policy_id UUID,                                                          -- 다중 역할 사용 시 기본 권한 충돌 해결 정책

    -- 시스템 사용자 플래그
    is_system_user          BOOLEAN                  NOT NULL DEFAULT FALSE,                             -- 시스템 사용자 여부 (자동화/배치용)

    -- 로그인 추적
    last_login_at           TIMESTAMP                WITH TIME ZONE,                                     -- 마지막 로그인 일시
    last_login_ip           VARCHAR(45),                                                                 -- 마지막 로그인 IP (IPv6 지원)
    failed_login_attempts   INTEGER                  DEFAULT 0,                                          -- 연속 로그인 실패 횟수
    locked_until            TIMESTAMP                WITH TIME ZONE,                                     -- 계정 잠금 해제 시각

    -- 상태 정보
    is_active               BOOLEAN                  DEFAULT TRUE,                                       -- 활성 상태
    is_deleted              BOOLEAN                  DEFAULT FALSE,                                      -- 논리 삭제 플래그

    -- 제약조건
    -- 역할 외래키
    CONSTRAINT fk_users__role_id                FOREIGN KEY (role_id) REFERENCES sys.roles(id) ON DELETE SET NULL,
    CONSTRAINT fk_users__default_conflict_resolution_policy_id FOREIGN KEY (default_conflict_resolution_policy_id) REFERENCES sys.permission_conflict_resolution(id) ON DELETE SET NULL,

    -- 이메일 형식 체크
    CONSTRAINT ck_users__email_format           CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),

    -- 전화번호 형식 체크
    CONSTRAINT ck_users__phone_format           CHECK (phone IS NULL OR phone ~ '^\+?[0-9\-\(\) ]{8,20}$'),

    -- 로그인 실패 횟수 체크
    CONSTRAINT ck_users__failed_attempts        CHECK (failed_login_attempts >= 0)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  sys.users                         IS '시스템 사용자 정보를 관리하는 테이블 (각 테넌트별 사용자 계정 분리 관리)';
COMMENT ON COLUMN sys.users.id                      IS '사용자 고유 식별자 (UUID)';
COMMENT ON COLUMN sys.users.created_at              IS '등록 일시';
COMMENT ON COLUMN sys.users.created_by              IS '등록자 UUID (NULL 가능 - 시스템 초기 사용자)';
COMMENT ON COLUMN sys.users.updated_at              IS '수정 일시';
COMMENT ON COLUMN sys.users.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN sys.users.username                IS '로그인 사용자명';
COMMENT ON COLUMN sys.users.password                IS '암호화된 비밀번호 (bcrypt 등으로 해시화)';
COMMENT ON COLUMN sys.users.full_name               IS '이름';
COMMENT ON COLUMN sys.users.email                   IS '이메일 주소 (사용자 식별 및 알림 발송용)';
COMMENT ON COLUMN sys.users.phone                   IS '전화번호';
COMMENT ON COLUMN sys.users.role_id                 IS '기본 역할 ID (sys.roles 참조) - 단일 역할인 경우, 또는 기본 역할으로 사용';
COMMENT ON COLUMN sys.users.default_conflict_resolution_policy_id IS '다중 역할 사용 시 기본 권한 충돌 해결 정책 ID (sys.permission_conflict_resolution 참조)';
COMMENT ON COLUMN sys.users.is_system_user          IS '시스템 사용자 여부 (TRUE: 자동화/배치용, FALSE: 일반 사용자)';
COMMENT ON COLUMN sys.users.last_login_at           IS '마지막 로그인 일시';
COMMENT ON COLUMN sys.users.last_login_ip           IS '마지막 로그인 IP 주소 (보안 추적용, IPv6 지원)';
COMMENT ON COLUMN sys.users.failed_login_attempts   IS '연속 로그인 실패 횟수 (보안 - 계정 잠금 판단용)';
COMMENT ON COLUMN sys.users.locked_until            IS '계정 잠금 해제 시각 (NULL: 잠금 없음)';
COMMENT ON COLUMN sys.users.is_active               IS '활성 상태 (TRUE: 로그인 가능, FALSE: 로그인 불가)';
COMMENT ON COLUMN sys.users.is_deleted              IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

-- 유니크 인덱스
-- 사용자명 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_users__username
    ON sys.users (username)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX sys.ux_users__username IS '사용자명 유니크 제약';

-- 이메일 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_users__email
    ON sys.users (email)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX sys.ux_users__email IS '이메일 유니크 제약';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_users__role_id
    ON sys.users (role_id)
 WHERE role_id IS NOT NULL
   AND is_deleted = FALSE;
COMMENT ON INDEX sys.ix_users__role_id IS '역할별 사용자 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_users__is_active
    ON sys.users (is_active)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX sys.ix_users__is_active IS '활성 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_users__last_login_at
    ON sys.users (last_login_at DESC)
 WHERE last_login_at IS NOT NULL
   AND is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS ix_users__default_conflict_resolution_policy_id
    ON sys.users (default_conflict_resolution_policy_id)
 WHERE default_conflict_resolution_policy_id IS NOT NULL
   AND is_deleted = FALSE;
COMMENT ON INDEX sys.ix_users__last_login_at IS '최근 로그인 조회 인덱스';

-- 시스템 사용자 조회
CREATE INDEX IF NOT EXISTS ix_users__is_system_user
    ON sys.users (is_system_user)
 WHERE is_system_user = TRUE
   AND is_deleted = FALSE;
COMMENT ON INDEX sys.ix_users__is_system_user IS '시스템 사용자 조회 인덱스';

-- 잠긴 계정 조회
CREATE INDEX IF NOT EXISTS ix_users__locked_until
    ON sys.users (locked_until)
 WHERE locked_until IS NOT NULL
   AND locked_until > CURRENT_TIMESTAMP
   AND is_deleted = FALSE;
COMMENT ON INDEX sys.ix_users__locked_until IS '잠긴 계정 조회 인덱스';

-- 로그인 실패 추적
CREATE INDEX IF NOT EXISTS ix_users__failed_attempts
    ON sys.users (failed_login_attempts DESC)
 WHERE failed_login_attempts > 0
   AND is_deleted = FALSE;
COMMENT ON INDEX sys.ix_users__failed_attempts IS '로그인 실패 추적 인덱스';

-- 복합 인덱스 (활성 + 역할)
CREATE INDEX IF NOT EXISTS ix_users__active_role
    ON sys.users (is_active, role_id)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX sys.ix_users__active_role IS '활성-역할 복합 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 역할 참조 (SET NULL 삭제)
ALTER TABLE sys.users
  ADD CONSTRAINT fk_users__role_id
    FOREIGN KEY (role_id)
    REFERENCES sys.roles(id)
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_users__role_id ON sys.users IS '역할 참조 외래키 (SET NULL 삭제)';

-- 생성자 참조 (SET NULL 삭제) - 자기 참조
ALTER TABLE sys.users
  ADD CONSTRAINT fk_users__created_by
    FOREIGN KEY (created_by)
    REFERENCES sys.users(id)
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_users__created_by ON sys.users IS '생성자 참조 외래키 (자기 참조, SET NULL 삭제)';

-- 수정자 참조 (SET NULL 삭제) - 자기 참조
ALTER TABLE sys.users
  ADD CONSTRAINT fk_users__updated_by
    FOREIGN KEY (updated_by)
    REFERENCES sys.users(id)
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_users__updated_by ON sys.users IS '수정자 참조 외래키 (자기 참조, SET NULL 삭제)';
