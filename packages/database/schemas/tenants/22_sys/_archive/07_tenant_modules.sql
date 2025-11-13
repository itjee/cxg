-- =====================================================================================
-- 테이블: sys.tenant_modules
-- 설명: 테넌트별 모듈 구독 및 활성화 관리
-- 작성일: 2025-01-26
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.tenant_modules 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 테넌트 모듈 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                 -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                                    -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 연관 정보
    tenant_id               UUID                     NOT NULL,                                           -- 테넌트 ID (논리적 참조)
    module_id               UUID                     NOT NULL,                                           -- 모듈 ID
    
    -- 구독 정보
    is_enabled              BOOLEAN                  DEFAULT true,                                       -- 활성화 여부
    subscribed_at           TIMESTAMP WITH TIME ZONE,                                                    -- 구독 시작 일시
    expires_at              TIMESTAMP WITH TIME ZONE,                                                    -- 만료 일시
    
    -- 설정 정보
    configuration           JSONB,                                                                       -- 모듈별 설정 (JSON)
    feature_flags           JSONB,                                                                       -- 기능 플래그 (JSON)
    
    -- 사용 통계
    last_accessed_at        TIMESTAMP WITH TIME ZONE,                                                    -- 마지막 접근 일시
    access_count            INTEGER                  DEFAULT 0,                                          -- 접근 횟수
    
    -- 제약조건
    CONSTRAINT fk_tenant_modules__module    FOREIGN KEY (module_id) REFERENCES sys.modules(id) ON DELETE CASCADE,
    CONSTRAINT uq_tenant_modules__tenant_module UNIQUE (tenant_id, module_id)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.tenant_modules                    IS '테넌트별 모듈 구독 및 활성화 관리 테이블';
COMMENT ON COLUMN sys.tenant_modules.id                 IS '테넌트 모듈 고유 식별자 (UUID)';
COMMENT ON COLUMN sys.tenant_modules.created_at         IS '등록 일시';
COMMENT ON COLUMN sys.tenant_modules.created_by         IS '등록자 UUID';
COMMENT ON COLUMN sys.tenant_modules.updated_at         IS '수정 일시';
COMMENT ON COLUMN sys.tenant_modules.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN sys.tenant_modules.tenant_id          IS '테넌트 ID (manager DB의 tenants 테이블 참조)';
COMMENT ON COLUMN sys.tenant_modules.module_id          IS '모듈 ID (sys.modules 참조)';
COMMENT ON COLUMN sys.tenant_modules.is_enabled         IS '활성화 여부 (false면 해당 테넌트는 모듈 사용 불가)';
COMMENT ON COLUMN sys.tenant_modules.subscribed_at      IS '구독 시작 일시';
COMMENT ON COLUMN sys.tenant_modules.expires_at         IS '만료 일시 (NULL이면 무제한)';
COMMENT ON COLUMN sys.tenant_modules.configuration      IS '모듈별 설정 (JSON 형식, 테넌트별 커스터마이징)';
COMMENT ON COLUMN sys.tenant_modules.feature_flags      IS '기능 플래그 (JSON 형식, 모듈 내 세부 기능 토글)';
COMMENT ON COLUMN sys.tenant_modules.last_accessed_at   IS '마지막 접근 일시 (사용량 추적용)';
COMMENT ON COLUMN sys.tenant_modules.access_count       IS '접근 횟수 (사용 통계)';

-- 유니크 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS ux_tenant_modules__tenant_module
    ON sys.tenant_modules (tenant_id, module_id);
COMMENT ON INDEX sys.ux_tenant_modules__tenant_module IS '테넌트-모듈 조합 유니크 제약';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_tenant_modules__tenant_id
    ON sys.tenant_modules (tenant_id, is_enabled)
 WHERE is_enabled = true;
COMMENT ON INDEX sys.ix_tenant_modules__tenant_id IS '테넌트별 활성 모듈 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_tenant_modules__module_id
    ON sys.tenant_modules (module_id, is_enabled)
 WHERE is_enabled = true;
COMMENT ON INDEX sys.ix_tenant_modules__module_id IS '모듈별 구독 테넌트 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_tenant_modules__expires_at
    ON sys.tenant_modules (expires_at)
 WHERE expires_at IS NOT NULL AND is_enabled = true;
COMMENT ON INDEX sys.ix_tenant_modules__expires_at IS '만료 예정 구독 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_tenant_modules__last_accessed
    ON sys.tenant_modules (last_accessed_at DESC)
 WHERE is_enabled = true;
COMMENT ON INDEX sys.ix_tenant_modules__last_accessed IS '최근 접근 순 조회 인덱스';
