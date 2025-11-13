-- =====================================================================================
-- 테이블: sys.role_menus
-- 설명: 역할별 메뉴 접근 권한을 관리하는 테이블
-- 작성일: 2025-11-04
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.role_menus 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 역할-메뉴 매핑 고유 식별자
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    
    -- 매핑 정보
    role_id                 UUID                     NOT NULL,                                           -- 역할 ID (sys.roles.id 참조)
    menu_id                 UUID                     NOT NULL,                                           -- 메뉴 ID (sys.menus.id 참조)
    
    -- 접근 제어
    is_accessible           BOOLEAN                  DEFAULT true,                                       -- 접근 가능 여부
    is_visible              BOOLEAN                  DEFAULT true,                                       -- 해당 역할에게 메뉴 표시 여부
    
    -- 외래키
    CONSTRAINT fk_role_menus__role_id          FOREIGN KEY (role_id) REFERENCES sys.roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_menus__menu_id          FOREIGN KEY (menu_id) REFERENCES sys.menus(id) ON DELETE CASCADE
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.role_menus                    IS '역할별 메뉴 접근 권한을 관리하는 테이블';
COMMENT ON COLUMN sys.role_menus.id                 IS '역할-메뉴 매핑 고유 식별자';
COMMENT ON COLUMN sys.role_menus.created_at         IS '등록 일시';
COMMENT ON COLUMN sys.role_menus.created_by         IS '등록자 UUID';
COMMENT ON COLUMN sys.role_menus.role_id            IS '역할 ID';
COMMENT ON COLUMN sys.role_menus.menu_id            IS '메뉴 ID';
COMMENT ON COLUMN sys.role_menus.is_accessible      IS '접근 가능 여부';
COMMENT ON COLUMN sys.role_menus.is_visible         IS '해당 역할에게 메뉴 표시 여부';

-- 유니크 인덱스
-- 역할-메뉴 조합 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_role_menus__role_menu
    ON sys.role_menus (role_id, menu_id);
COMMENT ON INDEX sys.ux_role_menus__role_menu IS '역할-메뉴 조합 유니크 제약';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_role_menus__role_id
    ON sys.role_menus (role_id)
 WHERE is_accessible = true;
COMMENT ON INDEX sys.ix_role_menus__role_id IS '역할별 메뉴 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_role_menus__menu_id
    ON sys.role_menus (menu_id)
 WHERE is_accessible = true;
COMMENT ON INDEX sys.ix_role_menus__menu_id IS '메뉴별 역할 조회 인덱스';
