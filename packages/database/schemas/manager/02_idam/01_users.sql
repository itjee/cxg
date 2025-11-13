CREATE TABLE IF NOT EXISTS idam.users
(
    id                          UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 사용자 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 생성일시
    created_by                  UUID,                                                               -- 생성자 ID
    updated_at                  TIMESTAMP WITH TIME ZONE,                                           -- 수정일시
    updated_by                  UUID,                                                               -- 수정자 ID

	user_type                   VARCHAR(20)                 NOT NULL DEFAULT 'USER',                -- 사용자 타입 (ADMIN, USER, SYSTEM)
	full_name                   VARCHAR(100)                NOT NULL,                               -- 전체 이름
	email                       VARCHAR(255)                NOT NULL,                               -- 이메일 주소
	phone                       VARCHAR(20),                                                        -- 전화번호

    -- 인증 정보
    username                    VARCHAR(100)                NOT NULL,                               -- 로그인명(아이디)
    password                    VARCHAR(255),                                                       -- 암호화된 비밀번호 (SSO 사용시 NULL)
    salt_key                    VARCHAR(100),                                                       -- 비밀번호 솔트

    -- SSO 정보
    sso_provider                VARCHAR(50),                                                        -- SSO 제공자 (google, azure, okta)
    sso_subject                 VARCHAR(255),                                                       -- SSO 제공자의 고유 식별자

    -- MFA 설정
    mfa_enabled                 BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- MFA 활성화 여부
    mfa_secret                  VARCHAR(255),                                                       -- TOTP 시크릿 키
    backup_codes                TEXT[],                                                             -- MFA 백업 코드 배열

    -- 계정 상태
    status                      VARCHAR(20)                 NOT NULL DEFAULT 'ACTIVE',              -- 계정 상태

    -- 보안 정보
    last_login_at               TIMESTAMP WITH TIME ZONE,                                           -- 마지막 로그인 일시
    last_login_ip               INET,                                                               -- 마지막 로그인 IP
    failed_login_attempts       INTEGER                     NOT NULL DEFAULT 0,                     -- 로그인 실패 횟수
    locked_until                TIMESTAMP WITH TIME ZONE,                                           -- 계정 잠금 해제 일시
    password_changed_at         TIMESTAMP WITH TIME ZONE,                                           -- 비밀번호 변경 일시
    force_password_change       BOOLEAN                     NOT NULL DEFAULT FALSE,                 -- 비밀번호 강제 변경 여부

    -- 추가 메타데이터
    timezone                    VARCHAR(50)                 DEFAULT 'UTC',                          -- 사용자 시간대
    locale                      VARCHAR(10)                 DEFAULT 'ko-KR',                        -- 사용자 로케일


    department                  VARCHAR(100),                                                       -- 부서명
    position                    VARCHAR(100),                                                       -- 직책

    CONSTRAINT uk_users__username              UNIQUE (username),
    CONSTRAINT uk_users__email                 UNIQUE (email),
    CONSTRAINT uk_users__sso_provider_subject  UNIQUE (sso_provider, sso_subject),

    CONSTRAINT ck_users__status                CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED')),
	CONSTRAINT ck_users__user_type             CHECK (user_type IN ('MASTER', 'TENANT', 'SYSTEM')),
    CONSTRAINT ck_users__sso_consistency       CHECK (
														(sso_provider IS NULL AND sso_subject IS NULL) OR
														(sso_provider IS NOT NULL AND sso_subject IS NOT NULL)
													 )
);

COMMENT ON TABLE  idam.users                        IS '운영자 사용자 계정 관리';
COMMENT ON COLUMN idam.users.id                     IS '사용자 고유 식별자';
COMMENT ON COLUMN idam.users.created_at             IS '생성일시';
COMMENT ON COLUMN idam.users.created_by             IS '생성자 ID';
COMMENT ON COLUMN idam.users.updated_at             IS '수정일시';
COMMENT ON COLUMN idam.users.updated_by             IS '수정자 ID';
COMMENT ON COLUMN idam.users.user_type              IS '사용자 타입 (MASTER: 운영관리자, TENANT: 테넌트사용자, SYSTEM: 시스템)';
COMMENT ON COLUMN idam.users.full_name              IS '전체 이름';
COMMENT ON COLUMN idam.users.email                  IS '이메일 주소';
COMMENT ON COLUMN idam.users.phone                  IS '전화번호';
COMMENT ON COLUMN idam.users.username               IS '로그인 사용자명';
COMMENT ON COLUMN idam.users.password               IS '암호화된 비밀번호 (SSO 사용시 NULL)';
COMMENT ON COLUMN idam.users.salt_key               IS '비밀번호 솔트';
COMMENT ON COLUMN idam.users.sso_provider           IS 'SSO 제공자 (google, azure, okta)';
COMMENT ON COLUMN idam.users.sso_subject            IS 'SSO 제공자의 고유 식별자';
COMMENT ON COLUMN idam.users.mfa_enabled            IS 'MFA 활성화 여부';
COMMENT ON COLUMN idam.users.mfa_secret             IS 'TOTP 시크릿 키';
COMMENT ON COLUMN idam.users.backup_codes           IS 'MFA 백업 코드 배열';
COMMENT ON COLUMN idam.users.status                 IS '계정 상태 (ACTIVE, INACTIVE, LOCKED, SUSPENDED)';
COMMENT ON COLUMN idam.users.last_login_at          IS '마지막 로그인 일시';
COMMENT ON COLUMN idam.users.last_login_ip          IS '마지막 로그인 IP';
COMMENT ON COLUMN idam.users.failed_login_attempts  IS '로그인 실패 횟수';
COMMENT ON COLUMN idam.users.locked_until           IS '계정 잠금 해제 일시';
COMMENT ON COLUMN idam.users.password_changed_at    IS '비밀번호 변경 일시';
COMMENT ON COLUMN idam.users.force_password_change  IS '비밀번호 강제 변경 여부';
COMMENT ON COLUMN idam.users.timezone               IS '사용자 시간대';
COMMENT ON COLUMN idam.users.locale                 IS '사용자 로케일';
COMMENT ON COLUMN idam.users.department             IS '부서명';
COMMENT ON COLUMN idam.users.position               IS '직책';

CREATE INDEX IF NOT EXISTS ix_users__user_type
	ON idam.users (user_type);

-- 이메일 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_users__email
    ON idam.users (email)
 WHERE status = 'ACTIVE';

-- 사용자명 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_users__username
    ON idam.users (username)
 WHERE status = 'ACTIVE';

-- 계정 상태별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_users__status
    ON idam.users (status);

-- 마지막 로그인 일시 조회용 인덱스 (비활성 사용자 식별)
CREATE INDEX IF NOT EXISTS ix_users__last_login_at
    ON idam.users (last_login_at)
 WHERE status = 'ACTIVE';

-- SSO 제공자별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_users__sso_provider
    ON idam.users (sso_provider)
 WHERE sso_provider IS NOT NULL;

-- 잠긴 계정 조회용 인덱스 (자동 해제 처리용)
CREATE INDEX IF NOT EXISTS ix_users__locked_until
    ON idam.users (locked_until)
 WHERE locked_until IS NOT NULL;

-- 비밀번호 강제 변경 대상 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_users__force_password_change
    ON idam.users (force_password_change)
 WHERE force_password_change = TRUE;
