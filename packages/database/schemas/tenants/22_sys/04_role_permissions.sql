-- =====================================================================================
-- 테이블: sys.role_permissions
-- 설명: 역할과 권한의 매핑 테이블 (RBAC 구현)
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.role_permissions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 매핑 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 매핑 정보
    role_id                 UUID                     NOT NULL,                                           -- 역할 ID
    permission_id           UUID                     NOT NULL,                                           -- 권한 ID
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true                                        -- 활성 상태
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.role_permissions              IS '역할과 권한의 매핑 테이블 (RBAC 구현을 위한 역할별 권한 할당 관리)';
COMMENT ON COLUMN sys.role_permissions.id           IS '매핑 고유 식별자 (UUID)';
COMMENT ON COLUMN sys.role_permissions.created_at   IS '등록 일시';
COMMENT ON COLUMN sys.role_permissions.created_by   IS '등록자 UUID';
COMMENT ON COLUMN sys.role_permissions.updated_at   IS '수정 일시';
COMMENT ON COLUMN sys.role_permissions.updated_by   IS '수정자 UUID';
COMMENT ON COLUMN sys.role_permissions.role_id      IS '역할 ID';
COMMENT ON COLUMN sys.role_permissions.permission_id IS '권한 ID';
COMMENT ON COLUMN sys.role_permissions.is_active    IS '활성 상태';

-- 유니크 인덱스
-- 역할-권한 조합 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_role_permissions__role_permission
    ON sys.role_permissions (role_id, permission_id);
COMMENT ON INDEX sys.ux_role_permissions__role_permission IS '역할-권한 조합 유니크 제약';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_role_permissions__role_id
    ON sys.role_permissions (role_id)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_role_permissions__role_id IS '역할별 권한 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_role_permissions__permission_id
    ON sys.role_permissions (permission_id)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_role_permissions__permission_id IS '권한별 역할 조회 인덱스';

-- 외래키 제약조건
-- 역할 참조 (CASCADE 삭제)
ALTER TABLE sys.role_permissions 
  ADD CONSTRAINT fk_role_permissions__role_id
    FOREIGN KEY (role_id) 
    REFERENCES sys.roles(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_role_permissions__role_id ON sys.role_permissions IS '역할 참조 외래키 (CASCADE 삭제)';

-- 권한 참조 (CASCADE 삭제)
ALTER TABLE sys.role_permissions 
  ADD CONSTRAINT fk_role_permissions__permission_id
    FOREIGN KEY (permission_id) 
    REFERENCES sys.permissions(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_role_permissions__permission_id ON sys.role_permissions IS '권한 참조 외래키 (CASCADE 삭제)';
