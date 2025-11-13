-- =====================================================================================
-- 테이블: sys.permissions
-- 설명: 시스템의 모든 권한을 정의하는 마스터 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.permissions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 권한 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 권한 정보
    code                    VARCHAR(100)             NOT NULL,                                           -- 권한 코드 (전체 시스템 유니크)
    name                    VARCHAR(200)             NOT NULL,                                           -- 권한명
    code VARCHAR(50)              NOT NULL,                                           -- 모듈 코드 (ADM, PSM, SRM 등)
    resource                VARCHAR(100)             NOT NULL,                                           -- 리소스명 (테이블명 또는 기능명)
    action                  VARCHAR(50)              NOT NULL,                                           -- 액션 (CREATE, READ, UPDATE, DELETE, APPROVE 등)
    description             TEXT,                                                                        -- 권한 설명
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태
    
    -- 제약조건
    -- 권한 코드 형식 체크 (대문자 영문, 숫자, 언더스코어)
    CONSTRAINT ck_permissions__code_format      CHECK (code ~ '^[A-Z0-9_]+$'),
    
    -- 모듈 코드 체크
    CONSTRAINT ck_permissions__code      CHECK (module_code IN ('ADM', 'ASM', 'BIM', 'COM', 'CSM', 'FIM', 'IVM', 'LWM', 'PSM', 'SRM', 'SYS')),
    
    -- 액션 체크
    CONSTRAINT ck_permissions__action           CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'EXPORT', 'IMPORT', 'EXECUTE'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.permissions                   IS '시스템의 모든 권한을 정의하는 마스터 테이블 (모듈별 리소스에 대한 액션 권한 관리)';
COMMENT ON COLUMN sys.permissions.id                IS '권한 고유 식별자 (UUID)';
COMMENT ON COLUMN sys.permissions.created_at        IS '등록 일시';
COMMENT ON COLUMN sys.permissions.created_by        IS '등록자 UUID';
COMMENT ON COLUMN sys.permissions.updated_at        IS '수정 일시';
COMMENT ON COLUMN sys.permissions.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN sys.permissions.code              IS '권한 코드 (전체 시스템 유니크, 예: ADM_USERS_CREATE)';
COMMENT ON COLUMN sys.permissions.name              IS '권한명 (사용자에게 표시되는 이름)';
COMMENT ON COLUMN sys.permissions.code       IS '모듈 코드 (ADM, PSM, SRM, IVM, LWM, CSM, ASM, FIM, BIM, COM, SYS)';
COMMENT ON COLUMN sys.permissions.resource          IS '리소스명 (권한이 적용되는 대상: 테이블명, 화면명, 기능명 등)';
COMMENT ON COLUMN sys.permissions.action            IS '액션 (리소스에 대한 작업: CREATE, READ, UPDATE, DELETE, APPROVE, EXPORT 등)';
COMMENT ON COLUMN sys.permissions.description       IS '권한 설명';
COMMENT ON COLUMN sys.permissions.is_active         IS '활성 상태';

-- 유니크 인덱스
-- 권한 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_permissions__code
    ON sys.permissions (code);
COMMENT ON INDEX sys.ux_permissions__code IS '권한 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_permissions__code
    ON sys.permissions (code)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_permissions__module_code IS '모듈별 권한 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_permissions__resource
    ON sys.permissions (resource)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_permissions__resource IS '리소스별 권한 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_permissions__action
    ON sys.permissions (action)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_permissions__action IS '액션별 권한 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_permissions__module_resource
    ON sys.permissions (module_code, resource)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_permissions__module_resource IS '모듈-리소스 복합 조회 인덱스';
