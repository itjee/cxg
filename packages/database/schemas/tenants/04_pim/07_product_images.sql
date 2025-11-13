-- =====================================================================================
-- 테이블: pim.product_images
-- 설명: 제품 이미지 관리 테이블
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_images 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이미지 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 이미지 기본 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    image_url               VARCHAR(500)             NOT NULL,                               -- 이미지 URL
    image_type              VARCHAR(20)              DEFAULT 'DETAIL',                       -- 이미지 유형
    
    -- 이미지 속성
    display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서
    is_primary              BOOLEAN                  DEFAULT false,                          -- 대표 이미지 여부
    alt_text                VARCHAR(200),                                                    -- 대체 텍스트
    
    -- 이미지 메타데이터
    file_name               VARCHAR(200),                                                    -- 파일명
    file_size               BIGINT,                                                          -- 파일 크기 (bytes)
    mime_type               VARCHAR(50),                                                     -- MIME 타입
    width                   INTEGER,                                                         -- 이미지 너비
    height                  INTEGER,                                                         -- 이미지 높이
    
    -- 추가 정보
    description             TEXT,                                                            -- 이미지 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 이미지 유형 체크 (MAIN: 대표, DETAIL: 상세, THUMBNAIL: 썸네일, GALLERY: 갤러리, SPEC: 스펙, PACKAGE: 패키지)
    CONSTRAINT ck_product_images__type              CHECK (image_type IN ('MAIN', 'DETAIL', 'THUMBNAIL', 'GALLERY', 'SPEC', 'PACKAGE')),
    
    -- 표시 순서 양수 체크 (0 이상)
    CONSTRAINT ck_product_images__display_order     CHECK (display_order >= 0),
    
    -- 파일 크기 양수 체크 (0 초과)
    CONSTRAINT ck_product_images__file_size         CHECK (file_size IS NULL OR file_size > 0),
    
    -- 이미지 크기 양수 체크 (0 초과)
    CONSTRAINT ck_product_images__dimensions        CHECK ((width IS NULL AND height IS NULL) OR (width > 0 AND height > 0)),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, PENDING: 대기)
    CONSTRAINT ck_product_images__status            CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_images                     IS '제품 이미지 관리 테이블';
COMMENT ON COLUMN pim.product_images.id                  IS '이미지 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_images.created_at          IS '등록 일시';
COMMENT ON COLUMN pim.product_images.created_by          IS '등록자 UUID';
COMMENT ON COLUMN pim.product_images.updated_at          IS '수정 일시';
COMMENT ON COLUMN pim.product_images.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN pim.product_images.product_id          IS '제품 식별자';
COMMENT ON COLUMN pim.product_images.image_url           IS '이미지 URL';
COMMENT ON COLUMN pim.product_images.image_type          IS '이미지 유형 (MAIN/DETAIL/THUMBNAIL/GALLERY/SPEC/PACKAGE)';
COMMENT ON COLUMN pim.product_images.display_order       IS '표시 순서';
COMMENT ON COLUMN pim.product_images.is_primary          IS '대표 이미지 여부';
COMMENT ON COLUMN pim.product_images.alt_text            IS '대체 텍스트 (접근성)';
COMMENT ON COLUMN pim.product_images.file_name           IS '파일명';
COMMENT ON COLUMN pim.product_images.file_size           IS '파일 크기 (bytes)';
COMMENT ON COLUMN pim.product_images.mime_type           IS 'MIME 타입 (image/jpeg, image/png 등)';
COMMENT ON COLUMN pim.product_images.width               IS '이미지 너비 (픽셀)';
COMMENT ON COLUMN pim.product_images.height              IS '이미지 높이 (픽셀)';
COMMENT ON COLUMN pim.product_images.description         IS '이미지 설명';
COMMENT ON COLUMN pim.product_images.notes               IS '비고';
COMMENT ON COLUMN pim.product_images.status              IS '상태 (ACTIVE/INACTIVE/PENDING)';
COMMENT ON COLUMN pim.product_images.is_deleted          IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_product_images__product_order
    ON pim.product_images (product_id, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_product_images__product_order IS '제품별 표시 순서 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_product_images__product_id
    ON pim.product_images (product_id, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_product_images__product_id IS '제품별 이미지 조회 인덱스';

CREATE INDEX ix_product_images__type
    ON pim.product_images (image_type, product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_product_images__type IS '이미지 유형별 조회 인덱스';

CREATE INDEX ix_product_images__primary
    ON pim.product_images (product_id)
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_product_images__primary IS '대표 이미지 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 제품 참조 외래키 (제품 삭제 시 이미지도 함께 삭제)
ALTER TABLE pim.product_images
  ADD CONSTRAINT fk_product_images__product_id
    FOREIGN KEY (product_id)     
    REFERENCES pim.products(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_product_images__product_id ON pim.product_images IS '제품 참조 외래키 (CASCADE 삭제)';
