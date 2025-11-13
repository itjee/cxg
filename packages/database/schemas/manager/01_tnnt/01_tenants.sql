-- =====================================================================================
-- 테이블: tnnt.tenants
-- 설명: 테넌트 마스터 정보 - 각 고객사(테넌트)의 기본 정보, 계약 상태, 사업자 정보를 관리하는 멀티테넌트 시스템의 핵심 테이블
-- 작성일: 2024-01-10
-- 수정일: 2025-10-27
-- =====================================================================================

CREATE TABLE IF NOT EXISTS tnnt.tenants
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),         -- 테넌트 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,            -- 테넌트 등록 일시
    created_by          UUID,                                                                   -- 테넌트 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                               -- 테넌트 수정 일시
    updated_by          UUID,                                                                   -- 테넌트 수정자 UUID

    -- 테넌트 기본 정보
    code                VARCHAR(20)              NOT NULL,                                      -- 테넌트 식별 코드 (스키마명으로 사용, 영문+숫자 조합)
    name                VARCHAR(100)             NOT NULL,                                      -- 테넌트(회사)명
    type                VARCHAR(20)              NOT NULL DEFAULT 'STANDARD',                   -- 테넌트 유형 (TRIAL/STANDARD/PREMIUM/ENTERPRISE)

    -- 사업자 등록 정보
    biz_no              VARCHAR(20),                                                            -- 사업자등록번호
    biz_name            VARCHAR(200),                                                           -- 상호(법인명)
    biz_type            CHAR(1)                  DEFAULT 'C',                                   -- 사업자구분 (C:법인, S:개인)
    ceo_name            VARCHAR(50),                                                            -- 대표자명
    biz_kind            VARCHAR(100),                                                           -- 업태
    biz_item            VARCHAR(100),                                                           -- 종목

    -- 주소 정보
    postcode            VARCHAR(10),                                                            -- 우편번호
    address1            VARCHAR(100),                                                           -- 주소1 (기본주소)
    address2            VARCHAR(100),                                                           -- 주소2 (상세주소)
    phone_no            VARCHAR(20),                                                            -- 대표 전화번호
    employee_count      INTEGER                  DEFAULT 0,                                     -- 직원 수 (라이선스 관리용)

    -- 계약 정보
    start_date          DATE                     NOT NULL,                                      -- 계약 시작일
    close_date          DATE,                                                                   -- 계약 종료일 (NULL: 무기한)

    -- 지역화 설정
    timezone            VARCHAR(50)              DEFAULT 'Asia/Seoul',                          -- 시간대 (기본: 한국)
    locale              VARCHAR(10)              DEFAULT 'ko-KR',                               -- 로케일 (언어-국가)
    currency            CHAR(3)                  DEFAULT 'KRW',                                 -- 기본 통화 (ISO 4217)

    -- 확장 가능한 메타데이터
    extra_data          JSONB                    DEFAULT '{}',                                  -- 추가 메타정보 (JSON 형태)

    -- 상태 관리
    status              VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',                     -- 테넌트 상태 (TRIAL/ACTIVE/SUSPENDED/TERMINATED)

    -- 중단 관리 (추가)
    is_suspended        BOOLEAN                  NOT NULL DEFAULT FALSE,                        -- 일시 중단 여부
    suspended_reason    TEXT,                                                                   -- 중단 사유
    suspended_date      TIMESTAMP WITH TIME ZONE,                                               -- 중단 일시

    -- 삭제 관리
    is_deleted          BOOLEAN                  NOT NULL DEFAULT FALSE,                        -- 논리적 삭제 플래그

    -- 제약조건
    CONSTRAINT ck_tenants__status                   CHECK (status IN ('TRIAL', 'ACTIVE', 'SUSPENDED', 'TERMINATED')),
    CONSTRAINT ck_tenants__type                     CHECK (type IN ('TRIAL', 'STANDARD', 'PREMIUM', 'ENTERPRISE')),
    CONSTRAINT ck_tenants__biz_type                 CHECK (biz_type IN ('C', 'S')),
    CONSTRAINT ck_tenants__employee_count           CHECK (employee_count >= 0),
    CONSTRAINT ck_tenants__start_date_valid         CHECK (start_date <= CURRENT_DATE),
    CONSTRAINT ck_tenants__close_date_valid         CHECK (close_date IS NULL OR close_date >= start_date),
    CONSTRAINT ck_tenants__code_format              CHECK (code ~ '^[a-zA-Z0-9_-]{3,20}$'),
    CONSTRAINT ck_tenants__suspended_consistency    CHECK (
        (is_suspended = TRUE AND suspended_date IS NOT NULL) OR
        (is_suspended = FALSE)
    )
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  tnnt.tenants                  IS '테넌트 마스터 정보 - 각 고객사(테넌트)의 기본 정보, 계약 상태, 사업자 정보를 관리하는 멀티테넌트 시스템의 핵심 테이블';
COMMENT ON COLUMN tnnt.tenants.id               IS '테넌트 고유 식별자 - UUID 형태의 기본키, 시스템 내부에서 테넌트를 구분하는 고유값';
COMMENT ON COLUMN tnnt.tenants.created_at       IS '테넌트 등록 일시 - 레코드 생성 시점의 타임스탬프, 계약 시작 추적용';
COMMENT ON COLUMN tnnt.tenants.created_by       IS '테넌트 등록자 - 테넌트를 시스템에 등록한 관리자의 UUID';
COMMENT ON COLUMN tnnt.tenants.updated_at       IS '테넌트 수정 일시 - 레코드 최종 수정 시점의 타임스탬프, 변경 이력 추적용';
COMMENT ON COLUMN tnnt.tenants.updated_by       IS '테넌트 수정자 - 테넌트 정보를 최종 수정한 관리자의 UUID';
COMMENT ON COLUMN tnnt.tenants.code             IS '테넌트 식별 코드 - 스키마명으로 사용되는 고유 코드, 영문+숫자+하이픈+언더스코어 조합 (3-20자)';
COMMENT ON COLUMN tnnt.tenants.name             IS '테넌트(회사)명 - 고객사의 공식 회사명 또는 서비스명';
COMMENT ON COLUMN tnnt.tenants.type             IS '테넌트 유형 - TRIAL(체험판), STANDARD(표준), PREMIUM(프리미엄), ENTERPRISE(기업) 구분';
COMMENT ON COLUMN tnnt.tenants.biz_no           IS '사업자등록번호 - 국세청 발급 사업자등록번호 (하이픈 포함 가능)';
COMMENT ON COLUMN tnnt.tenants.biz_name         IS '상호(법인명) - 사업자등록증상의 공식 상호명';
COMMENT ON COLUMN tnnt.tenants.biz_type         IS '사업자구분 - C(법인사업자), S(개인사업자) 구분';
COMMENT ON COLUMN tnnt.tenants.ceo_name         IS '대표자명 - 사업자등록증상의 대표자 성명';
COMMENT ON COLUMN tnnt.tenants.biz_kind         IS '업태 - 사업의 형태나 성격 (예: 제조업, 서비스업, 도소매업)';
COMMENT ON COLUMN tnnt.tenants.biz_item         IS '종목 - 구체적인 사업 품목 (예: 소프트웨어 개발, 컨설팅)';
COMMENT ON COLUMN tnnt.tenants.postcode         IS '우편번호 - 사업장 소재지 우편번호 (5자리 또는 6자리)';
COMMENT ON COLUMN tnnt.tenants.address1         IS '주소1 - 기본 주소 (시/도, 시/군/구, 읍/면/동)';
COMMENT ON COLUMN tnnt.tenants.address2         IS '주소2 - 상세 주소 (건물명, 층수, 호수 등)';
COMMENT ON COLUMN tnnt.tenants.phone_no         IS '대표 전화번호 - 고객사의 대표 연락처 (하이픈 포함 가능)';
COMMENT ON COLUMN tnnt.tenants.employee_count   IS '직원 수 - 라이선스 산정 및 과금을 위한 임직원 수 (0 이상)';
COMMENT ON COLUMN tnnt.tenants.start_date       IS '계약 시작일 - 서비스 이용 계약 시작 날짜';
COMMENT ON COLUMN tnnt.tenants.close_date       IS '계약 종료일 - 서비스 이용 계약 종료 날짜 (NULL인 경우 무기한 계약)';
COMMENT ON COLUMN tnnt.tenants.timezone         IS '시간대 - 테넌트의 기본 시간대 설정 (예: Asia/Seoul, America/New_York)';
COMMENT ON COLUMN tnnt.tenants.locale           IS '로케일 - 언어 및 지역 설정 (ISO 639-1_ISO 3166-1 형태, 예: ko-KR, en-US)';
COMMENT ON COLUMN tnnt.tenants.currency         IS '기본 통화 - 과금 및 보고서에 사용할 기본 통화 (ISO 4217 코드, 예: KRW, USD)';
COMMENT ON COLUMN tnnt.tenants.extra_data       IS '추가 메타정보 - 확장 가능한 JSON 형태의 부가 정보 (특별 요구사항, 커스텀 설정 등)';
COMMENT ON COLUMN tnnt.tenants.status           IS '테넌트 상태 - TRIAL(체험중), ACTIVE(정상운영), SUSPENDED(일시중단), TERMINATED(계약종료)';
COMMENT ON COLUMN tnnt.tenants.is_suspended     IS '일시 중단 여부 - TRUE(일시중단), FALSE(정상)';
COMMENT ON COLUMN tnnt.tenants.suspended_reason IS '중단 사유 - 일시중단된 경우 그 사유';
COMMENT ON COLUMN tnnt.tenants.suspended_date   IS '중단 일시 - 일시중단된 시점';
COMMENT ON COLUMN tnnt.tenants.is_deleted       IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성 상태), 물리적 삭제 대신 사용';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

-- 테넌트 코드 고유성 보장 (스키마명 중복 방지)
CREATE UNIQUE INDEX IF NOT EXISTS ux_tenants__code
    ON tnnt.tenants (code)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX tnnt.ux_tenants__code IS '테넌트 코드 유니크 제약 (미삭제 레코드만)';

-- 사업자등록번호 고유성 보장 (중복 가입 방지)
CREATE UNIQUE INDEX IF NOT EXISTS ux_tenants__biz_no
    ON tnnt.tenants (biz_no)
 WHERE biz_no IS NOT NULL
   AND is_deleted = FALSE;
COMMENT ON INDEX tnnt.ux_tenants__biz_no IS '사업자등록번호 유니크 제약 (미삭제 레코드만)';

-- 활성 상태 테넌트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tenants__status
    ON tnnt.tenants (status)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__status IS '상태별 테넌트 조회 인덱스';

-- 테넌트 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tenants__type
    ON tnnt.tenants (type)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__type IS '테넌트 유형별 조회 인덱스';

-- 계약 시작일 기준 정렬 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tenants__start_date
    ON tnnt.tenants (start_date DESC)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__start_date IS '계약 시작일 조회 인덱스';

-- 계약 만료 예정 테넌트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tenants__close_date
    ON tnnt.tenants (close_date)
 WHERE close_date IS NOT NULL
   AND is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__close_date IS '계약 종료일 조회 인덱스';

-- 직원 수 기준 라이선스 관리 최적화
CREATE INDEX IF NOT EXISTS ix_tenants__employee_count
    ON tnnt.tenants (employee_count DESC)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__employee_count IS '직원 수별 조회 인덱스';

-- 최신 가입 테넌트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tenants__created_at
    ON tnnt.tenants (created_at DESC)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__created_at IS '생성일시 조회 인덱스';

-- 회사명으로 검색 최적화
CREATE INDEX IF NOT EXISTS ix_tenants__name
    ON tnnt.tenants (name)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__name IS '테넌트명 검색 인덱스';

-- 상호명으로 검색 최적화
CREATE INDEX IF NOT EXISTS ix_tenants__biz_name
    ON tnnt.tenants (biz_name)
 WHERE biz_name IS NOT NULL
   AND is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__biz_name IS '상호명 검색 인덱스';

-- 중단된 테넌트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tenants__is_suspended
    ON tnnt.tenants (is_suspended, suspended_date DESC)
 WHERE is_suspended = TRUE
   AND is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__is_suspended IS '중단된 테넌트 조회 인덱스';

-- 복합 인덱스 (상태 + 유형)
CREATE INDEX IF NOT EXISTS ix_tenants__status_type
    ON tnnt.tenants (status, type)
 WHERE is_deleted = FALSE;
COMMENT ON INDEX tnnt.ix_tenants__status_type IS '상태-유형 복합 조회 인덱스';
