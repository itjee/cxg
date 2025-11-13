-- =====================================================================================
-- 테이블: sys.menus
-- 설명: 플랫폼의 메뉴 구조를 관리하는 테이블 (계층형 구조 지원)
-- 작성일: 2025-11-04
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.menus 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 메뉴 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 메뉴 기본 정보
    code                    VARCHAR(100)             NOT NULL,                                           -- 메뉴 코드 (시스템 전체 유니크)
    name                    VARCHAR(200)             NOT NULL,                                           -- 메뉴명
    name_en                 VARCHAR(200),                                                                -- 메뉴명 (영문)
    description             TEXT,                                                                        -- 메뉴 설명
    
    -- 계층 구조
    parent_id               UUID,                                                                        -- 부모 메뉴 ID (NULL이면 최상위 메뉴)
    depth                   INTEGER                  NOT NULL DEFAULT 0,                                 -- 메뉴 깊이 (0: 최상위, 1: 1단계, 2: 2단계...)
    sort_order              INTEGER                  NOT NULL DEFAULT 0,                                 -- 정렬 순서 (같은 depth 내에서)
    path                    TEXT,                                                                        -- 계층 경로 (예: /menu1/menu2/menu3)
    
    -- 메뉴 타입 및 속성
    menu_type               VARCHAR(20)              NOT NULL DEFAULT 'MENU',                            -- 메뉴 타입 (MENU: 일반 메뉴, FOLDER: 폴더형, LINK: 외부 링크)
    module_code             VARCHAR(50),                                                                 -- 모듈 코드 (ADM, PSM, SRM 등)
    
    -- 라우팅 정보
    route_path              VARCHAR(500),                                                                -- 라우트 경로 (예: /admin/users)
    component_path          VARCHAR(500),                                                                -- 컴포넌트 경로 (예: @/pages/admin/users)
    external_url            VARCHAR(1000),                                                               -- 외부 링크 URL
    
    -- UI 표시 정보
    icon                    VARCHAR(100),                                                                -- 아이콘 (예: user, settings, dashboard)
    icon_type               VARCHAR(20)              DEFAULT 'lucide',                                   -- 아이콘 타입 (lucide, fontawesome, custom 등)
    badge_text              VARCHAR(50),                                                                 -- 배지 텍스트 (예: NEW, BETA)
    badge_color             VARCHAR(20),                                                                 -- 배지 색상 (예: red, blue, green)
    
    -- 권한 설정
    permission_code         VARCHAR(100),                                                                -- 필요 권한 코드 (sys.permissions.code 참조)
    is_public               BOOLEAN                  DEFAULT false,                                      -- 공개 메뉴 여부 (권한 없이 접근 가능)
    
    -- 표시 옵션
    is_visible              BOOLEAN                  DEFAULT true,                                       -- 사이드바 표시 여부
    is_favorite             BOOLEAN                  DEFAULT false,                                      -- 즐겨찾기 기본값
    open_in_new_tab         BOOLEAN                  DEFAULT false,                                      -- 새 탭에서 열기
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 메타 데이터
    meta_data               JSONB,                                                                       -- 추가 메타 정보 (JSON)
    
    -- 제약조건
    -- 메뉴 코드 형식 체크 (대문자 영문, 숫자, 언더스코어, 하이픈)
    CONSTRAINT ck_menus__code_format           CHECK (code ~ '^[A-Z0-9_-]+$'),
    
    -- 메뉴 타입 체크
    CONSTRAINT ck_menus__menu_type             CHECK (menu_type IN ('MENU', 'FOLDER', 'LINK', 'DIVIDER')),
    
    -- 모듈 코드 체크
    CONSTRAINT ck_menus__module_code           CHECK (module_code IS NULL OR module_code IN ('ADM', 'ASM', 'BIM', 'COM', 'CRM', 'CSM', 'FAM', 'FIM', 'HRM', 'IVM', 'LWM', 'PIM', 'PSM', 'SRM', 'SYS', 'WMS')),
    
    -- 깊이 체크 (0~5 레벨)
    CONSTRAINT ck_menus__depth                 CHECK (depth >= 0 AND depth <= 5),
    
    -- 정렬 순서 체크
    CONSTRAINT ck_menus__sort_order            CHECK (sort_order >= 0),
    
    -- 아이콘 타입 체크
    CONSTRAINT ck_menus__icon_type             CHECK (icon_type IN ('lucide', 'fontawesome', 'material', 'custom')),
    
    -- LINK 타입인 경우 external_url 필수
    CONSTRAINT ck_menus__link_url              CHECK (menu_type != 'LINK' OR external_url IS NOT NULL),
    
    -- MENU 타입인 경우 route_path 필수 (FOLDER, DIVIDER는 제외)
    CONSTRAINT ck_menus__menu_route            CHECK (menu_type IN ('FOLDER', 'DIVIDER') OR route_path IS NOT NULL),
    
    -- 외래키
    CONSTRAINT fk_menus__parent_id             FOREIGN KEY (parent_id) REFERENCES sys.menus(id) ON DELETE SET NULL
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.menus                         IS '플랫폼의 메뉴 구조를 관리하는 테이블 (사이드바 메뉴 구성 및 권한 기반 메뉴 제어)';
COMMENT ON COLUMN sys.menus.id                      IS '메뉴 고유 식별자 (UUID)';
COMMENT ON COLUMN sys.menus.created_at              IS '등록 일시';
COMMENT ON COLUMN sys.menus.created_by              IS '등록자 UUID';
COMMENT ON COLUMN sys.menus.updated_at              IS '수정 일시';
COMMENT ON COLUMN sys.menus.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN sys.menus.code                    IS '메뉴 코드 (시스템 전체 유니크, 예: ADMIN_USERS, PSM_ORDERS)';
COMMENT ON COLUMN sys.menus.name                    IS '메뉴명 (사용자에게 표시되는 이름)';
COMMENT ON COLUMN sys.menus.name_en                 IS '메뉴명 (영문)';
COMMENT ON COLUMN sys.menus.description             IS '메뉴 설명';
COMMENT ON COLUMN sys.menus.parent_id               IS '부모 메뉴 ID (NULL이면 최상위 메뉴)';
COMMENT ON COLUMN sys.menus.depth                   IS '메뉴 깊이 (0: 최상위, 1~5: 하위 레벨)';
COMMENT ON COLUMN sys.menus.sort_order              IS '정렬 순서 (같은 depth 및 parent_id 내에서 오름차순 정렬)';
COMMENT ON COLUMN sys.menus.path                    IS '계층 경로 (예: /dashboard/admin/users)';
COMMENT ON COLUMN sys.menus.menu_type               IS '메뉴 타입 (MENU: 일반 메뉴, FOLDER: 폴더형, LINK: 외부 링크, DIVIDER: 구분선)';
COMMENT ON COLUMN sys.menus.module_code             IS '모듈 코드 (메뉴가 속한 모듈)';
COMMENT ON COLUMN sys.menus.route_path              IS '라우트 경로 (프론트엔드 라우팅 경로)';
COMMENT ON COLUMN sys.menus.component_path          IS '컴포넌트 경로 (React/Vue 컴포넌트 경로)';
COMMENT ON COLUMN sys.menus.external_url            IS '외부 링크 URL (menu_type이 LINK인 경우)';
COMMENT ON COLUMN sys.menus.icon                    IS '아이콘 (아이콘 이름 또는 코드)';
COMMENT ON COLUMN sys.menus.icon_type               IS '아이콘 타입 (lucide, fontawesome, material, custom)';
COMMENT ON COLUMN sys.menus.badge_text              IS '배지 텍스트 (NEW, BETA 등 표시용)';
COMMENT ON COLUMN sys.menus.badge_color             IS '배지 색상 (red, blue, green 등)';
COMMENT ON COLUMN sys.menus.permission_code         IS '필요 권한 코드 (sys.permissions.code 참조, NULL이면 권한 체크 안 함)';
COMMENT ON COLUMN sys.menus.is_public               IS '공개 메뉴 여부 (true: 권한 없이 접근 가능)';
COMMENT ON COLUMN sys.menus.is_visible              IS '사이드바 표시 여부 (false면 메뉴에 표시하지 않음)';
COMMENT ON COLUMN sys.menus.is_favorite             IS '즐겨찾기 기본값';
COMMENT ON COLUMN sys.menus.open_in_new_tab         IS '새 탭에서 열기 여부';
COMMENT ON COLUMN sys.menus.is_active               IS '활성 상태';
COMMENT ON COLUMN sys.menus.is_deleted              IS '논리 삭제 플래그';
COMMENT ON COLUMN sys.menus.meta_data               IS '추가 메타 정보 (JSON 형식으로 확장 가능)';

-- 유니크 인덱스
-- 메뉴 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_menus__code
    ON sys.menus (code)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_menus__code IS '메뉴 코드 유니크 제약';

-- 일반 인덱스
-- 계층 구조 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_menus__parent_id_sort
    ON sys.menus (parent_id, sort_order)
 WHERE is_deleted = false AND is_active = true;
COMMENT ON INDEX sys.ix_menus__parent_id_sort IS '부모 메뉴별 자식 메뉴 정렬 조회 인덱스';

-- 깊이별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_menus__depth
    ON sys.menus (depth, sort_order)
 WHERE is_deleted = false AND is_active = true;
COMMENT ON INDEX sys.ix_menus__depth IS '깊이별 메뉴 조회 인덱스';

-- 모듈별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_menus__module_code
    ON sys.menus (module_code)
 WHERE is_deleted = false AND is_active = true;
COMMENT ON INDEX sys.ix_menus__module_code IS '모듈별 메뉴 조회 인덱스';

-- 권한 기반 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_menus__permission_code
    ON sys.menus (permission_code)
 WHERE is_deleted = false AND is_active = true AND permission_code IS NOT NULL;
COMMENT ON INDEX sys.ix_menus__permission_code IS '권한별 메뉴 조회 인덱스';

-- 라우트 경로 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_menus__route_path
    ON sys.menus (route_path)
 WHERE is_deleted = false AND is_active = true;
COMMENT ON INDEX sys.ix_menus__route_path IS '라우트 경로 조회 인덱스';

-- 표시 가능한 메뉴 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_menus__visible
    ON sys.menus (is_visible, sort_order)
 WHERE is_deleted = false AND is_active = true;
COMMENT ON INDEX sys.ix_menus__visible IS '표시 가능한 메뉴 조회 인덱스';
