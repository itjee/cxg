-- =====================================================================================
-- 테이블: hrm.leave_policies
-- 설명: 휴가 정책 관리 테이블 - 연차, 병가, 출산휴가 등 휴가 정책 정의
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS hrm.leave_policies
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 휴가 정책 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID

    -- 휴가 정책 정보
    leave_type              VARCHAR(20)              NOT NULL UNIQUE,                        -- 휴가 유형 (ANNUAL, SICK, MATERNITY, UNPAID)
    leave_name              VARCHAR(100)             NOT NULL,                               -- 휴가명
    description             TEXT,                                                            -- 설명

    -- 휴가 일수 및 조건
    entitled_days_per_year  INTEGER,                                                         -- 연간 부여 일수 (NULL이면 무제한)
    is_paid                 BOOLEAN                  NOT NULL DEFAULT true,                  -- 유급 여부

    -- 유효 기간 및 이월
    validity_years          INTEGER                  DEFAULT 2,                              -- 유효 기간 (연)
    is_carryover_allowed    BOOLEAN                  DEFAULT false,                          -- 이월 가능 여부
    carryover_max_days      INTEGER,                                                         -- 이월 최대 일수 (NULL이면 무제한)

    -- 보상금 관련
    is_compensation_required BOOLEAN                 DEFAULT true,                           -- 미사용 보상금 필요 여부
    compensation_rate       NUMERIC(5,2)             DEFAULT 100,                            -- 보상금 비율 (%)

    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그

    -- 제약조건
    -- 휴가 유형 체크
    CONSTRAINT ck_leave_policies__leave_type           CHECK (leave_type IN ('ANNUAL', 'SICK', 'MATERNITY', 'UNPAID')),

    -- 연간 부여 일수 양수 체크 (NULL이거나 양수)
    CONSTRAINT ck_leave_policies__entitled_days        CHECK (entitled_days_per_year IS NULL OR entitled_days_per_year > 0),

    -- 유효 기간 양수 체크
    CONSTRAINT ck_leave_policies__validity_years       CHECK (validity_years > 0),

    -- 이월 최대 일수 양수 체크 (NULL이거나 양수)
    CONSTRAINT ck_leave_policies__carryover_max_days   CHECK (carryover_max_days IS NULL OR carryover_max_days > 0),

    -- carryover_allowed 제약조건 업데이트 (이름만 변경)
    -- 기존: carryover_allowed → 새로움: is_carryover_allowed

    -- 보상금 비율 체크 (0-100)
    CONSTRAINT ck_leave_policies__compensation_rate    CHECK (compensation_rate >= 0 AND compensation_rate <= 100),

    -- 등록자 참조 외래키
    CONSTRAINT fk_leave_policies__created_by
        FOREIGN KEY (created_by) REFERENCES sys.users(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  hrm.leave_policies                          IS '휴가 정책 관리 테이블 - 연차, 병가, 출산휴가 등 휴가 정책 정의';
COMMENT ON COLUMN hrm.leave_policies.id                       IS '휴가 정책 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.leave_policies.created_at               IS '등록 일시';
COMMENT ON COLUMN hrm.leave_policies.created_by               IS '등록자 UUID';
COMMENT ON COLUMN hrm.leave_policies.leave_type               IS '휴가 유형 (ANNUAL: 연차, SICK: 병가, MATERNITY: 출산휴가, UNPAID: 무급)';
COMMENT ON COLUMN hrm.leave_policies.leave_name               IS '휴가명';
COMMENT ON COLUMN hrm.leave_policies.description              IS '설명';
COMMENT ON COLUMN hrm.leave_policies.entitled_days_per_year   IS '연간 부여 일수 (NULL이면 무제한)';
COMMENT ON COLUMN hrm.leave_policies.is_paid                  IS '유급 여부 (true: 유급, false: 무급)';
COMMENT ON COLUMN hrm.leave_policies.validity_years           IS '유효 기간 (연, 연차는 일반적으로 2년)';
COMMENT ON COLUMN hrm.leave_policies.is_carryover_allowed     IS '이월 가능 여부';
COMMENT ON COLUMN hrm.leave_policies.carryover_max_days       IS '이월 최대 일수 (NULL이면 무제한)';
COMMENT ON COLUMN hrm.leave_policies.is_compensation_required IS '미사용 보상금 필요 여부';
COMMENT ON COLUMN hrm.leave_policies.compensation_rate        IS '보상금 비율 (%)';
COMMENT ON COLUMN hrm.leave_policies.is_active                IS '활성 여부';
COMMENT ON COLUMN hrm.leave_policies.is_deleted               IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_leave_policies__leave_type
    ON hrm.leave_policies (leave_type)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ux_leave_policies__leave_type IS '휴가 유형 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_leave_policies__is_active
    ON hrm.leave_policies (is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_leave_policies__is_active IS '활성 상태 조회 인덱스';

-- =====================================================================================
-- 초기 데이터 (마이그레이션 스크립트에서 실행)
-- =====================================================================================
--
-- 다음 기본 휴가 정책을 생성합니다:
--
-- INSERT INTO hrm.leave_policies (leave_type, leave_name, description, entitled_days_per_year, is_paid, validity_years, carryover_allowed, carryover_max_days, compensation_required, compensation_rate)
-- VALUES
--   ('ANNUAL', '연차', '근로기준법상 연차휴가', 15, true, 2, false, NULL, true, 100),
--   ('SICK', '병가', '질병으로 인한 휴가', 3, true, 1, false, NULL, false, 0),
--   ('MATERNITY', '출산휴가', '출산 전후 휴가', 90, true, 1, false, NULL, false, 0),
--   ('UNPAID', '무급휴가', '무급 휴가', NULL, false, 1, false, NULL, false, 0);
--
-- =====================================================================================

-- =====================================================================================
-- 외래키 제약조건 설명
-- =====================================================================================

COMMENT ON CONSTRAINT fk_leave_policies__created_by ON hrm.leave_policies IS '등록자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: hrm.leave_policies 테이블 생성
-- =====================================================================================
