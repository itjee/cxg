-- =====================================================================================
-- 테이블: srm.promotions
-- 설명: 판매 프로모션/할인 관리 테이블 - 프로모션 및 할인 정책 관리
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.promotions
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 프로모션 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID

    -- 프로모션 기본 정보
    promotion_code          VARCHAR(50)              NOT NULL UNIQUE,                        -- 프로모션 코드
    promotion_name          VARCHAR(200)             NOT NULL,                               -- 프로모션명
    promotion_type          VARCHAR(30)              NOT NULL,                               -- 프로모션 유형
    description             TEXT,                                                            -- 설명

    -- 할인 조건
    discount_percent        NUMERIC(5,2),                                                    -- 할인율 (%)
    discount_amount         NUMERIC(18,2),                                                   -- 할인액
    min_order_amount        NUMERIC(18,2),                                                   -- 최소 주문액
    max_discount_amount     NUMERIC(18,2),                                                   -- 최대 할인액

    -- 대상 범위
    customer_segment_id     UUID,                                                            -- 고객 세그먼트 식별자
    product_id              UUID,                                                            -- 제품 식별자 (NULL이면 전체 상품 대상)

    -- 기간
    start_date              DATE                     NOT NULL,                               -- 시작일
    end_date                DATE,                                                            -- 종료일 (NULL이면 무기한)

    -- 우선순위 및 상태
    priority                INTEGER                  DEFAULT 0,                              -- 우선순위 (높을수록 높은 우선순위)
    is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그

    -- 제약조건
    -- 프로모션 유형 체크
    CONSTRAINT ck_promotions__promotion_type           CHECK (promotion_type IN ('DISCOUNT_PERCENT', 'DISCOUNT_AMOUNT', 'BUY_X_GET_Y', 'BUNDLE', 'SEASONAL', 'OTHER')),

    -- 프로모션 코드 형식 체크
    CONSTRAINT ck_promotions__promotion_code            CHECK (promotion_code ~ '^[A-Z0-9_-]{2,50}$'),

    -- 할인율 범위 체크 (0-100)
    CONSTRAINT ck_promotions__discount_percent          CHECK (discount_percent IS NULL OR (discount_percent > 0 AND discount_percent <= 100)),

    -- 할인액 양수 체크
    CONSTRAINT ck_promotions__discount_amount           CHECK (discount_amount IS NULL OR discount_amount > 0),

    -- 최소 주문액 양수 체크
    CONSTRAINT ck_promotions__min_order_amount          CHECK (min_order_amount IS NULL OR min_order_amount > 0),

    -- 최대 할인액 양수 체크
    CONSTRAINT ck_promotions__max_discount_amount       CHECK (max_discount_amount IS NULL OR max_discount_amount > 0),

    -- 날짜 순서 체크 (종료일 >= 시작일)
    CONSTRAINT ck_promotions__date_order                CHECK (end_date IS NULL OR end_date >= start_date),

    -- 우선순위 0 이상 체크
    CONSTRAINT ck_promotions__priority                  CHECK (priority >= 0),

    -- 할인 종류별 필수 필드 체크 (할인율 또는 할인액 중 하나는 필수)
    CONSTRAINT ck_promotions__discount_required         CHECK (discount_percent IS NOT NULL OR discount_amount IS NOT NULL),

    -- 고객 세그먼트 참조 외래키 (SET NULL 삭제)
    CONSTRAINT fk_promotions__customer_segment_id
        FOREIGN KEY (customer_segment_id) REFERENCES crm.customer_segments(id) ON DELETE SET NULL,

    -- 제품 참조 외래키 (SET NULL 삭제)
    CONSTRAINT fk_promotions__product_id
        FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE SET NULL,

    -- 등록자 참조 외래키
    CONSTRAINT fk_promotions__created_by
        FOREIGN KEY (created_by) REFERENCES sys.users(id) ON DELETE SET NULL,

    -- 수정자 참조 외래키
    CONSTRAINT fk_promotions__updated_by
        FOREIGN KEY (updated_by) REFERENCES sys.users(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  srm.promotions                          IS '판매 프로모션/할인 관리 테이블 - 프로모션 및 할인 정책 관리';
COMMENT ON COLUMN srm.promotions.id                       IS '프로모션 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.promotions.created_at               IS '등록 일시';
COMMENT ON COLUMN srm.promotions.created_by               IS '등록자 UUID';
COMMENT ON COLUMN srm.promotions.updated_at               IS '수정 일시';
COMMENT ON COLUMN srm.promotions.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN srm.promotions.promotion_code            IS '프로모션 코드 (고유)';
COMMENT ON COLUMN srm.promotions.promotion_name           IS '프로모션명';
COMMENT ON COLUMN srm.promotions.promotion_type           IS '프로모션 유형 (DISCOUNT_PERCENT: 할인율, DISCOUNT_AMOUNT: 할인액, BUY_X_GET_Y: 묶음할인, BUNDLE: 번들, SEASONAL: 시즌할인, OTHER: 기타)';
COMMENT ON COLUMN srm.promotions.description              IS '프로모션 설명/상세 조건';
COMMENT ON COLUMN srm.promotions.discount_percent         IS '할인율 (%, 예: 10.5)';
COMMENT ON COLUMN srm.promotions.discount_amount          IS '할인액 (원화)';
COMMENT ON COLUMN srm.promotions.min_order_amount         IS '최소 주문액 (이 금액 이상일 때만 적용)';
COMMENT ON COLUMN srm.promotions.max_discount_amount      IS '최대 할인액 (할인이 이 금액을 초과하지 않음)';
COMMENT ON COLUMN srm.promotions.customer_segment_id      IS '고객 세그먼트 식별자 (NULL이면 전체 고객)';
COMMENT ON COLUMN srm.promotions.product_id               IS '제품 식별자 (NULL이면 전체 상품)';
COMMENT ON COLUMN srm.promotions.start_date               IS '프로모션 시작일';
COMMENT ON COLUMN srm.promotions.end_date                 IS '프로모션 종료일 (NULL이면 무기한)';
COMMENT ON COLUMN srm.promotions.priority                 IS '우선순위 (높을수록 먼저 적용, 여러 프로모션 중복 시 사용)';
COMMENT ON COLUMN srm.promotions.is_active                IS '활성 여부 (false: 일시 중단, 기간과 관계없이 적용 안 됨)';
COMMENT ON COLUMN srm.promotions.is_deleted               IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_promotions__promotion_code
    ON srm.promotions (promotion_code)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ux_promotions__promotion_code IS '프로모션 코드 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_promotions__promotion_type
    ON srm.promotions (promotion_type)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_promotions__promotion_type IS '프로모션 유형별 조회 인덱스';

CREATE INDEX ix_promotions__product_id
    ON srm.promotions (product_id, priority DESC)
 WHERE product_id IS NOT NULL
   AND is_active = true
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_promotions__product_id IS '제품별 활성 프로모션 조회 인덱스';

CREATE INDEX ix_promotions__customer_segment_id
    ON srm.promotions (customer_segment_id, priority DESC)
 WHERE customer_segment_id IS NOT NULL
   AND is_active = true
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_promotions__customer_segment_id IS '고객 세그먼트별 프로모션 조회 인덱스';

CREATE INDEX ix_promotions__date_range
    ON srm.promotions (start_date, end_date)
 WHERE is_active = true
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_promotions__date_range IS '기간별 활성 프로모션 조회 인덱스';

CREATE INDEX ix_promotions__is_active
    ON srm.promotions (is_active, priority DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_promotions__is_active IS '활성 프로모션 조회 인덱스';

CREATE INDEX ix_promotions__created_at
    ON srm.promotions (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_promotions__created_at IS '등록일시 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건 설명
-- =====================================================================================

COMMENT ON CONSTRAINT fk_promotions__customer_segment_id ON srm.promotions IS '고객 세그먼트 참조 외래키 (SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_promotions__product_id ON srm.promotions IS '제품 참조 외래키 (SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_promotions__created_by ON srm.promotions IS '등록자 참조 외래키 (SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_promotions__updated_by ON srm.promotions IS '수정자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: srm.promotions 테이블 생성
-- =====================================================================================
