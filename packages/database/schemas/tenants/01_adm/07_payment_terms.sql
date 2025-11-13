-- =====================================================================================
-- 테이블: adm.payment_terms
-- 설명: 결제 조건 마스터 테이블 - 구매/판매 시 적용되는 표준 결제 조건
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.payment_terms
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결제 조건 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID

    -- 결제 조건 정보
    code                    VARCHAR(20)              NOT NULL UNIQUE,                        -- 결제 조건 코드 (COD, NET7, NET15, NET30, NET45, NET60, NET90, PREPAID)
    name                    VARCHAR(100)             NOT NULL,                               -- 결제 조건명
    description             TEXT,                                                            -- 설명

    -- 결제 기간
    days_to_pay             INTEGER,                                                         -- 결제 기간 (일수, NULL이면 즉시 또는 조건 없음)
    is_cash_on_delivery     BOOLEAN                  DEFAULT false,                          -- 착불 여부

    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그

    -- 제약조건
    -- 결제 조건 코드 형식 체크
    CONSTRAINT ck_payment_terms__code                 CHECK (code ~ '^[A-Z0-9_]{2,20}$'),

    -- 결제 기간 양수 체크 (NULL이거나 양수)
    CONSTRAINT ck_payment_terms__days_to_pay          CHECK (days_to_pay IS NULL OR days_to_pay > 0),

    -- 등록자 참조 외래키
    CONSTRAINT fk_payment_terms__created_by
        FOREIGN KEY (created_by) REFERENCES sys.users(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  adm.payment_terms                          IS '결제 조건 마스터 테이블 - 구매/판매 시 적용되는 표준 결제 조건';
COMMENT ON COLUMN adm.payment_terms.id                       IS '결제 조건 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.payment_terms.created_at               IS '등록 일시';
COMMENT ON COLUMN adm.payment_terms.created_by               IS '등록자 UUID';
COMMENT ON COLUMN adm.payment_terms.code                     IS '결제 조건 코드 (COD, NET7, NET15, NET30 등)';
COMMENT ON COLUMN adm.payment_terms.name                     IS '결제 조건명 (예: 30일 외상)';
COMMENT ON COLUMN adm.payment_terms.description              IS '결제 조건 설명';
COMMENT ON COLUMN adm.payment_terms.days_to_pay             IS '결제 기간 (일수, NULL이면 특수 조건)';
COMMENT ON COLUMN adm.payment_terms.is_cash_on_delivery     IS '착불 여부';
COMMENT ON COLUMN adm.payment_terms.is_active                IS '활성 여부';
COMMENT ON COLUMN adm.payment_terms.is_deleted               IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_payment_terms__code
    ON adm.payment_terms (code)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ux_payment_terms__code IS '결제 조건 코드 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_payment_terms__is_active
    ON adm.payment_terms (is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_payment_terms__is_active IS '활성 결제 조건 조회 인덱스';

CREATE INDEX ix_payment_terms__days_to_pay
    ON adm.payment_terms (days_to_pay)
 WHERE days_to_pay IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX adm.ix_payment_terms__days_to_pay IS '결제 기간별 조회 인덱스';

-- =====================================================================================
-- 초기 데이터 (마이그레이션 스크립트에서 실행)
-- =====================================================================================
--
-- 다음 기본 결제 조건을 생성합니다:
--
-- INSERT INTO adm.payment_terms (code, name, description, days_to_pay, is_cash_on_delivery, is_active)
-- VALUES
--   ('COD', '착불', '상품 인수 시 현금 지급', NULL, true, true),
--   ('PREPAID', '선금', '주문 시 선금 지급', 0, false, true),
--   ('NET7', '7일 외상', '배송 후 7일 내 결제', 7, false, true),
--   ('NET15', '15일 외상', '배송 후 15일 내 결제', 15, false, true),
--   ('NET30', '30일 외상', '배송 후 30일 내 결제', 30, false, true),
--   ('NET45', '45일 외상', '배송 후 45일 내 결제', 45, false, true),
--   ('NET60', '60일 외상', '배송 후 60일 내 결제', 60, false, true),
--   ('NET90', '90일 외상', '배송 후 90일 내 결제', 90, false, true);
--
-- =====================================================================================

-- =====================================================================================
-- 외래키 제약조건 설명
-- =====================================================================================

COMMENT ON CONSTRAINT fk_payment_terms__created_by ON adm.payment_terms IS '등록자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: adm.payment_terms 테이블 생성
-- =====================================================================================
