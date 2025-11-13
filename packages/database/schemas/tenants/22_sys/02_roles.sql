-- =====================================================================================
-- 테이블: sys.roles
-- 설명: 시스템 역할 정보를 관리하는 테이블 (RBAC 구현)
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.roles 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 역할 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 역할 정보
    code                    VARCHAR(50)              NOT NULL,                                           -- 역할 코드 (테넌트 내 유니크)
    name                    VARCHAR(100)             NOT NULL,                                           -- 역할명
    description             TEXT,                                                                        -- 역할 설명
    
    -- 역할 속성
    is_system               BOOLEAN                  DEFAULT false,                                      -- 시스템 기본 역할 여부 (삭제 불가)
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 역할 코드 형식 체크 (대문자 영문, 숫자, 언더스코어)
    CONSTRAINT ck_roles__code_format       CHECK (code ~ '^[A-Z0-9_]+$'),
    
    -- 역할명 길이 체크
    CONSTRAINT ck_roles__name_length       CHECK (char_length(name) >= 2)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.roles                         IS '시스템 역할 정보를 관리하는 테이블 (RBAC - Role-Based Access Control 구현)';
COMMENT ON COLUMN sys.roles.id                      IS '역할 고유 식별자 (UUID)';
COMMENT ON COLUMN sys.roles.created_at              IS '등록 일시';
COMMENT ON COLUMN sys.roles.created_by              IS '등록자 UUID';
COMMENT ON COLUMN sys.roles.updated_at              IS '수정 일시';
COMMENT ON COLUMN sys.roles.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN sys.roles.code                    IS '역할 코드 (테넌트 내 유니크, 예: ADMIN, MANAGER, USER)';
COMMENT ON COLUMN sys.roles.name                    IS '역할명 (사용자에게 표시되는 이름)';
COMMENT ON COLUMN sys.roles.description             IS '역할 설명';
COMMENT ON COLUMN sys.roles.is_system               IS '시스템 기본 역할 여부 (true: 시스템 기본 역할/삭제 불가, false: 사용자 정의 역할)';
COMMENT ON COLUMN sys.roles.is_active               IS '활성 상태';
COMMENT ON COLUMN sys.roles.is_deleted              IS '논리 삭제 플래그';

-- 유니크 인덱스
-- 역할 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_roles__code
    ON sys.roles (code)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_roles__code IS '역할 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_roles__is_active
    ON sys.roles (is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_roles__is_active IS '활성 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_roles__is_system
    ON sys.roles (is_system)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_roles__is_system IS '시스템 역할 조회 인덱스';
