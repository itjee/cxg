-- =====================================================================================
-- 테이블: sys.menu_configs
-- 설명: 테넌트별 메뉴 뷰 설정 (필터, 컬럼, 레이아웃 등)
-- 작성일: 2025-11-04
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.menu_configs 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              UUID,
    updated_at              TIMESTAMP                WITH TIME ZONE,
    updated_by              UUID,
    
    -- 메뉴 연결
    menu_id                 UUID                     NOT NULL,
    
    -- 설정 정보
    config_name             VARCHAR(200),                                                                -- 설정명 (예: "기본 뷰", "영업팀 뷰")
    config_type             VARCHAR(50)              NOT NULL,                                           -- 설정 타입 (FILTER, COLUMN, LAYOUT, COMBINED)
    is_default              BOOLEAN                  DEFAULT false,                                      -- 기본 설정 여부
    
    -- 필터 설정 (JSONB)
    filter_config           JSONB,                                                                       -- 필터 필드 정의
    
    -- 컬럼 설정 (JSONB)
    column_config           JSONB,                                                                       -- 컬럼 정의 및 설정
    
    -- 레이아웃 설정 (JSONB)
    layout_config           JSONB,                                                                       -- 페이지 레이아웃 설정
    
    -- 기본값 설정 (JSONB)
    default_values          JSONB,                                                                       -- 필터 기본값, 정렬, 페이지 크기 등
    
    -- 권한 제어
    allowed_roles           TEXT[],                                                                      -- 이 설정을 사용할 수 있는 역할 목록
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,
    is_deleted              BOOLEAN                  DEFAULT false,
    
    -- 제약조건
    CONSTRAINT ck_menu_configs__config_type  CHECK (config_type IN ('FILTER', 'COLUMN', 'LAYOUT', 'COMBINED')),
    
    -- 외래키
    CONSTRAINT fk_menu_configs__menu_id      FOREIGN KEY (menu_id) REFERENCES sys.menus(id) ON DELETE CASCADE
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.menu_configs                  IS '테넌트별 메뉴 뷰 설정 (필터, 컬럼, 레이아웃 등)';
COMMENT ON COLUMN sys.menu_configs.id               IS '설정 고유 식별자';
COMMENT ON COLUMN sys.menu_configs.menu_id          IS '메뉴 ID';
COMMENT ON COLUMN sys.menu_configs.config_name      IS '설정명';
COMMENT ON COLUMN sys.menu_configs.config_type      IS '설정 타입 (FILTER: 필터만, COLUMN: 컬럼만, LAYOUT: 레이아웃만, COMBINED: 통합)';
COMMENT ON COLUMN sys.menu_configs.is_default       IS '기본 설정 여부 (true면 모든 사용자에게 기본 적용)';
COMMENT ON COLUMN sys.menu_configs.filter_config    IS '필터 설정 JSON { "filters": [{ "field": "status", "type": "select", "label": "상태", "options": [...], "default": "ACTIVE" }] }';
COMMENT ON COLUMN sys.menu_configs.column_config    IS '컬럼 설정 JSON { "columns": [{ "field": "id", "label": "ID", "width": 100, "visible": true, "sortable": true, "filterable": false }] }';
COMMENT ON COLUMN sys.menu_configs.layout_config    IS '레이아웃 설정 JSON { "pageSize": 20, "defaultSort": { "field": "createdAt", "order": "desc" }, "showFilters": true }';
COMMENT ON COLUMN sys.menu_configs.default_values   IS '기본값 설정 JSON { "filters": { "status": "ACTIVE" }, "sort": { "field": "name", "order": "asc" } }';
COMMENT ON COLUMN sys.menu_configs.allowed_roles    IS '이 설정을 사용할 수 있는 역할 코드 배열 (NULL이면 모든 역할)';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_menu_configs__menu_id
    ON sys.menu_configs (menu_id)
 WHERE is_deleted = false AND is_active = true;
COMMENT ON INDEX sys.ix_menu_configs__menu_id IS '메뉴별 설정 조회 인덱스';

CREATE UNIQUE INDEX IF NOT EXISTS ux_menu_configs__menu_default
    ON sys.menu_configs (menu_id)
 WHERE is_default = true AND is_deleted = false;
COMMENT ON INDEX sys.ux_menu_configs__menu_default IS '메뉴별 기본 설정 유니크 제약 (하나만 기본 가능)';


-- =====================================================================================
-- 예시 데이터 구조
-- =====================================================================================

/*
-- Filter Config 예시
{
  "filters": [
    {
      "field": "status",
      "type": "select",
      "label": "상태",
      "placeholder": "상태 선택",
      "options": [
        { "value": "ACTIVE", "label": "활성" },
        { "value": "INACTIVE", "label": "비활성" }
      ],
      "default": "ACTIVE",
      "required": false,
      "visible": true,
      "order": 1
    },
    {
      "field": "createdAt",
      "type": "dateRange",
      "label": "생성일",
      "visible": true,
      "order": 2
    },
    {
      "field": "name",
      "type": "text",
      "label": "이름",
      "placeholder": "이름 검색",
      "visible": true,
      "order": 3
    }
  ]
}

-- Column Config 예시
{
  "columns": [
    {
      "field": "id",
      "label": "ID",
      "width": 80,
      "minWidth": 60,
      "visible": true,
      "pinned": "left",
      "sortable": true,
      "filterable": false,
      "resizable": true,
      "order": 1
    },
    {
      "field": "name",
      "label": "이름",
      "width": 200,
      "visible": true,
      "sortable": true,
      "filterable": true,
      "order": 2
    },
    {
      "field": "email",
      "label": "이메일",
      "width": 250,
      "visible": true,
      "sortable": true,
      "order": 3
    },
    {
      "field": "status",
      "label": "상태",
      "width": 100,
      "visible": true,
      "sortable": true,
      "filterable": true,
      "order": 4,
      "renderType": "badge"
    },
    {
      "field": "createdAt",
      "label": "생성일",
      "width": 180,
      "visible": true,
      "sortable": true,
      "order": 5,
      "renderType": "datetime"
    },
    {
      "field": "actions",
      "label": "작업",
      "width": 100,
      "visible": true,
      "pinned": "right",
      "sortable": false,
      "order": 99
    }
  ],
  "hiddenColumns": ["internalCode", "deletedAt"]
}

-- Layout Config 예시
{
  "pageSize": 20,
  "pageSizeOptions": [10, 20, 50, 100],
  "defaultSort": {
    "field": "createdAt",
    "order": "desc"
  },
  "showFilters": true,
  "showColumnToggle": true,
  "showExport": true,
  "showRefresh": true,
  "enableRowSelection": true,
  "enableBulkActions": true,
  "density": "comfortable"
}

-- Default Values 예시
{
  "filters": {
    "status": "ACTIVE",
    "dateRange": "last7days"
  },
  "sort": {
    "field": "name",
    "order": "asc"
  },
  "pageSize": 50
}
*/
