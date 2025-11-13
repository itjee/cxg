-- =====================================================================================
-- 테이블: sys.user_menu_favorites
-- 설명: 사용자별 즐겨찾기 메뉴를 관리하는 테이블
-- 작성일: 2025-11-04
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.user_menu_favorites 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 즐겨찾기 고유 식별자
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    
    -- 매핑 정보
    user_id                 UUID                     NOT NULL,                                           -- 사용자 ID (sys.users.id 참조)
    menu_id                 UUID                     NOT NULL,                                           -- 메뉴 ID (sys.menus.id 참조)
    
    -- 정렬
    sort_order              INTEGER                  NOT NULL DEFAULT 0,                                 -- 즐겨찾기 내 정렬 순서
    
    -- 외래키
    CONSTRAINT fk_user_menu_favorites__user_id     FOREIGN KEY (user_id) REFERENCES sys.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_menu_favorites__menu_id     FOREIGN KEY (menu_id) REFERENCES sys.menus(id) ON DELETE CASCADE
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.user_menu_favorites           IS '사용자별 즐겨찾기 메뉴를 관리하는 테이블';
COMMENT ON COLUMN sys.user_menu_favorites.id        IS '즐겨찾기 고유 식별자';
COMMENT ON COLUMN sys.user_menu_favorites.created_at IS '등록 일시';
COMMENT ON COLUMN sys.user_menu_favorites.user_id   IS '사용자 ID';
COMMENT ON COLUMN sys.user_menu_favorites.menu_id   IS '메뉴 ID';
COMMENT ON COLUMN sys.user_menu_favorites.sort_order IS '즐겨찾기 내 정렬 순서';

-- 유니크 인덱스
-- 사용자-메뉴 조합 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_menu_favorites__user_menu
    ON sys.user_menu_favorites (user_id, menu_id);
COMMENT ON INDEX sys.ux_user_menu_favorites__user_menu IS '사용자-메뉴 조합 유니크 제약 (중복 즐겨찾기 방지)';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_user_menu_favorites__user_id
    ON sys.user_menu_favorites (user_id, sort_order);
COMMENT ON INDEX sys.ix_user_menu_favorites__user_id IS '사용자별 즐겨찾기 메뉴 조회 인덱스';
