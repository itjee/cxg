-- =====================================================================================
-- 테이블: srm.promotion_usage
-- 설명: 프로모션 사용 이력 테이블 - 판매주문에서 적용된 프로모션 기록
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.promotion_usage
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 사용 이력 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID

    -- 연결 정보
    promotion_id            UUID                     NOT NULL,                               -- 프로모션 식별자
    sales_order_id          UUID                     NOT NULL,                               -- 판매주문 식별자
    sales_order_item_id     UUID,                                                            -- 판매주문 항목 식별자 (NULL이면 전체 주문)

    -- 할인 정보
    discount_applied        NUMERIC(18,2)            NOT NULL,                               -- 적용된 할인액
    discount_percentage     NUMERIC(5,2),                                                    -- 적용된 할인율 (%)
    applied_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 적용 일시

    -- 제약조건
    -- 할인액 양수 체크
    CONSTRAINT ck_promotion_usage__discount_applied    CHECK (discount_applied > 0),

    -- 할인율 범위 체크 (NULL이거나 0-100)
    CONSTRAINT ck_promotion_usage__discount_percentage CHECK (discount_percentage IS NULL OR (discount_percentage > 0 AND discount_percentage <= 100)),

    -- 프로모션 참조 외래키 (CASCADE 삭제)
    CONSTRAINT fk_promotion_usage__promotion_id
        FOREIGN KEY (promotion_id) REFERENCES srm.promotions(id) ON DELETE CASCADE,

    -- 판매주문 참조 외래키 (CASCADE 삭제)
    CONSTRAINT fk_promotion_usage__sales_order_id
        FOREIGN KEY (sales_order_id) REFERENCES srm.sales_orders(id) ON DELETE CASCADE,

    -- 판매주문 항목 참조 외래키 (CASCADE 삭제)
    CONSTRAINT fk_promotion_usage__sales_order_item_id
        FOREIGN KEY (sales_order_item_id) REFERENCES srm.sales_order_items(id) ON DELETE CASCADE,

    -- 등록자 참조 외래키
    CONSTRAINT fk_promotion_usage__created_by
        FOREIGN KEY (created_by) REFERENCES sys.users(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  srm.promotion_usage                          IS '프로모션 사용 이력 테이블 - 판매주문에서 적용된 프로모션 기록';
COMMENT ON COLUMN srm.promotion_usage.id                       IS '사용 이력 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.promotion_usage.created_at               IS '등록 일시';
COMMENT ON COLUMN srm.promotion_usage.created_by               IS '등록자 UUID';
COMMENT ON COLUMN srm.promotion_usage.promotion_id             IS '프로모션 식별자';
COMMENT ON COLUMN srm.promotion_usage.sales_order_id           IS '판매주문 식별자';
COMMENT ON COLUMN srm.promotion_usage.sales_order_item_id      IS '판매주문 항목 식별자 (NULL이면 전체 주문에 적용)';
COMMENT ON COLUMN srm.promotion_usage.discount_applied         IS '실제 적용된 할인액';
COMMENT ON COLUMN srm.promotion_usage.discount_percentage      IS '실제 적용된 할인율';
COMMENT ON COLUMN srm.promotion_usage.applied_at               IS '프로모션 적용 일시';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스 (없음 - 같은 프로모션을 여러 항목에 적용 가능)

-- 일반 인덱스
CREATE INDEX ix_promotion_usage__promotion_id
    ON srm.promotion_usage (promotion_id, applied_at DESC);
COMMENT ON INDEX srm.ix_promotion_usage__promotion_id IS '프로모션별 사용 이력 조회 인덱스';

CREATE INDEX ix_promotion_usage__sales_order_id
    ON srm.promotion_usage (sales_order_id);
COMMENT ON INDEX srm.ix_promotion_usage__sales_order_id IS '판매주문별 프로모션 조회 인덱스';

CREATE INDEX ix_promotion_usage__sales_order_item_id
    ON srm.promotion_usage (sales_order_item_id)
 WHERE sales_order_item_id IS NOT NULL;
COMMENT ON INDEX srm.ix_promotion_usage__sales_order_item_id IS '판매주문 항목별 프로모션 조회 인덱스';

CREATE INDEX ix_promotion_usage__applied_at
    ON srm.promotion_usage (applied_at DESC);
COMMENT ON INDEX srm.ix_promotion_usage__applied_at IS '적용일시 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건 설명
-- =====================================================================================

COMMENT ON CONSTRAINT fk_promotion_usage__promotion_id ON srm.promotion_usage IS '프로모션 참조 외래키 (CASCADE 삭제)';
COMMENT ON CONSTRAINT fk_promotion_usage__sales_order_id ON srm.promotion_usage IS '판매주문 참조 외래키 (CASCADE 삭제)';
COMMENT ON CONSTRAINT fk_promotion_usage__sales_order_item_id ON srm.promotion_usage IS '판매주문 항목 참조 외래키 (CASCADE 삭제)';
COMMENT ON CONSTRAINT fk_promotion_usage__created_by ON srm.promotion_usage IS '등록자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: srm.promotion_usage 테이블 생성
-- =====================================================================================
