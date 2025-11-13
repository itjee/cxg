-- =====================================================================================
-- 테이블: sys.modules
-- 설명: 시스템 모듈 정의 및 관리 (메타데이터 중심 설계)
-- 작성일: 2025-01-26
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.modules 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 모듈 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                 -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                                    -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 기본 정보
    code VARCHAR(10)              NOT NULL UNIQUE,                                    -- 모듈 코드 (ADM, PSM, SRM 등)
    name VARCHAR(100)             NOT NULL,                                           -- 모듈명 (한글)
    module_name_en          VARCHAR(100),                                                                -- 모듈명 (영문)
    description             TEXT,                                                                        -- 모듈 설명
    
    -- 계층 및 정렬
    parent_module_id        UUID,                                                                        -- 상위 모듈 ID (계층 구조)
    display_order           INTEGER                  DEFAULT 0,                                          -- 표시 순서
    level_depth             INTEGER                  DEFAULT 1,                                          -- 계층 깊이
    full_path               VARCHAR(500),                                                                -- 전체 경로
    
    -- UI 정보
    icon                    VARCHAR(50),                                                                 -- 아이콘 이름 (lucide-react 아이콘명)
    color_scheme            VARCHAR(20),                                                                 -- 색상 스킴
    route_path              VARCHAR(100),                                                                -- 라우트 경로
    
    -- 상태 및 라이선스
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태
    is_core                 BOOLEAN                  DEFAULT false,                                      -- 필수 모듈 여부
    requires_license        BOOLEAN                  DEFAULT false,                                      -- 라이선스 필요 여부
    license_type            VARCHAR(30),                                                                 -- 라이선스 유형
    
    -- 기술 정보
    schema_name             VARCHAR(20),                                                                 -- 데이터베이스 스키마명
    version                 VARCHAR(20),                                                                 -- 모듈 버전
    
    -- 제약조건
    CONSTRAINT ck_modules__code_format      CHECK (module_code ~ '^[A-Z]{2,10}$'),
    CONSTRAINT ck_modules__license_type     CHECK (license_type IN ('BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE') OR license_type IS NULL),
    CONSTRAINT fk_modules__parent           FOREIGN KEY (parent_module_id) REFERENCES sys.modules(id) ON DELETE SET NULL
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.modules                       IS '시스템 모듈 마스터 테이블 (메타데이터 중심 설계로 동적 모듈 관리)';
COMMENT ON COLUMN sys.modules.id                    IS '모듈 고유 식별자 (UUID)';
COMMENT ON COLUMN sys.modules.created_at            IS '등록 일시';
COMMENT ON COLUMN sys.modules.created_by            IS '등록자 UUID';
COMMENT ON COLUMN sys.modules.updated_at            IS '수정 일시';
COMMENT ON COLUMN sys.modules.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN sys.modules.code           IS '모듈 코드 (ADM, HRM, CRM, PIM, WMS, APM, IVM, PSM, SRM, ASM, FIM, FAM, LWM, BIM, COM, SYS)';
COMMENT ON COLUMN sys.modules.name           IS '모듈명 (한글, 예: 관리자)';
COMMENT ON COLUMN sys.modules.module_name_en        IS '모듈명 (영문, 예: Administration)';
COMMENT ON COLUMN sys.modules.description           IS '모듈 설명';
COMMENT ON COLUMN sys.modules.parent_module_id      IS '상위 모듈 ID (계층 구조 지원)';
COMMENT ON COLUMN sys.modules.display_order         IS '표시 순서 (메뉴 정렬용)';
COMMENT ON COLUMN sys.modules.level_depth           IS '계층 깊이 (1: 최상위)';
COMMENT ON COLUMN sys.modules.full_path             IS '전체 경로 (계층 경로 표시용)';
COMMENT ON COLUMN sys.modules.icon                  IS '아이콘 이름 (lucide-react 아이콘명, 예: users, shopping-cart)';
COMMENT ON COLUMN sys.modules.color_scheme          IS '색상 스킴 (UI 테마용)';
COMMENT ON COLUMN sys.modules.route_path            IS '라우트 경로 (프론트엔드 라우팅용)';
COMMENT ON COLUMN sys.modules.is_active             IS '활성 상태 (비활성화 시 사용 불가)';
COMMENT ON COLUMN sys.modules.is_core               IS '필수 모듈 여부 (SYS, ADM, COM 등)';
COMMENT ON COLUMN sys.modules.requires_license      IS '라이선스 필요 여부';
COMMENT ON COLUMN sys.modules.license_type          IS '라이선스 유형 (BASIC, STANDARD, PREMIUM, ENTERPRISE)';
COMMENT ON COLUMN sys.modules.schema_name           IS '데이터베이스 스키마명 (adm, psm, srm 등)';
COMMENT ON COLUMN sys.modules.version               IS '모듈 버전';

-- 유니크 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS ux_modules__code
    ON sys.modules (code);
COMMENT ON INDEX sys.ux_modules__module_code IS '모듈 코드 유니크 제약';

CREATE UNIQUE INDEX IF NOT EXISTS ux_modules__schema_name
    ON sys.modules (schema_name)
 WHERE schema_name IS NOT NULL;
COMMENT ON INDEX sys.ux_modules__schema_name IS '스키마명 유니크 제약';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_modules__is_active
    ON sys.modules (is_active, display_order)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_modules__is_active IS '활성 모듈 조회 및 정렬 인덱스';

CREATE INDEX IF NOT EXISTS ix_modules__parent_module_id
    ON sys.modules (parent_module_id, display_order)
 WHERE parent_module_id IS NOT NULL;
COMMENT ON INDEX sys.ix_modules__parent_module_id IS '계층 구조 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_modules__license_type
    ON sys.modules (license_type, is_active)
 WHERE requires_license = true;
COMMENT ON INDEX sys.ix_modules__license_type IS '라이선스 유형별 조회 인덱스';
