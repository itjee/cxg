-- ============================================================================
-- Communication Schema (com)
-- ============================================================================
-- Description: 커뮤니케이션/메시징 (알림, 메시지, 캘린더, 이메일)
-- Database: tnnt_db (Tenant Database)
-- Schema: com
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS com;

COMMENT ON SCHEMA com IS 'COM: 커뮤니케이션/메시징 스키마 (알림, 메시지, 캘린더)';

-- ============================================================================
-- AI 기반 업무지원 플랫폼 - 데이터베이스 DDL
-- 멀티테넌시: schema per tenant 전략
-- PostgreSQL 15+ 사용
-- ============================================================================

-- ============================================================================
-- COM: 공통/지원 모듈 (Enterprise Services)
-- 전사 공통으로 사용되는 기능들을 관리하는 스키마
-- ============================================================================

-- =====================================================================================
-- 테이블: com.code_groups
-- 설명: 공통 코드 그룹 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.code_groups 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 코드 그룹 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    group_code              VARCHAR(50)              NOT NULL,                                  -- 그룹 코드
    group_name              VARCHAR(100)             NOT NULL,                                  -- 그룹명
    description             TEXT,                                                               -- 그룹 설명
    
    -- 상태 관리
    is_system_group         BOOLEAN                  DEFAULT false,                             -- 시스템 기본 그룹 여부
    is_active               BOOLEAN                  DEFAULT true,                              -- 활성 상태
    deleted                 BOOLEAN                  DEFAULT false                              -- 논리 삭제 플래그
);

-- =====================================================================================
-- 테이블: com.codes
-- 설명: 공통 코드 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.codes 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 코드 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    group_id                UUID                     NOT NULL,                                  -- 코드 그룹 식별자
    code                    VARCHAR(50)              NOT NULL,                                  -- 코드값
    name                    VARCHAR(100)             NOT NULL,                                  -- 코드명
    description             TEXT,                                                               -- 코드 설명
    sort_order              INTEGER                  DEFAULT 0,                                 -- 정렬 순서
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                              -- 활성 상태
    deleted                 BOOLEAN                  DEFAULT false                              -- 논리 삭제 플래그
);

-- =====================================================================================
-- 테이블: com.workflows
-- 설명: 전자결재 워크플로우 정의 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.workflows 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 워크플로우 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID,                                                               -- 회사 식별자
    workflow_code           VARCHAR(50)              NOT NULL,                                  -- 워크플로우 코드
    workflow_name           VARCHAR(100)             NOT NULL,                                  -- 워크플로우명
    module_code             VARCHAR(50)              NOT NULL,                                  -- 모듈 코드
    document_type           VARCHAR(50)              NOT NULL,                                  -- 문서 유형
    description             TEXT,                                                               -- 워크플로우 설명
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                              -- 활성 상태
    deleted                 BOOLEAN                  DEFAULT false                              -- 논리 삭제 플래그
);

-- =====================================================================================
-- 테이블: com.workflow_steps
-- 설명: 워크플로우 단계 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.workflow_steps 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 워크플로우 단계 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    workflow_id             UUID                     NOT NULL,                                  -- 워크플로우 식별자
    step_order              INTEGER                  NOT NULL,                                  -- 단계 순서
    step_name               VARCHAR(100)             NOT NULL,                                  -- 단계명
    approver_type           VARCHAR(20)              NOT NULL,                                  -- 승인자 유형
    approver_id             UUID,                                                               -- 승인자 식별자
    is_parallel             BOOLEAN                  DEFAULT false,                             -- 병렬 처리 여부
    is_required             BOOLEAN                  DEFAULT true,                              -- 필수 단계 여부
    
    -- 제약조건
    CONSTRAINT ck_workflow_steps__approver_type     CHECK (approver_type IN ('USER', 'ROLE', 'DEPARTMENT'))
);

-- =====================================================================================
-- 테이블: com.approval_instances
-- 설명: 결재 인스턴스 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.approval_instances 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 결재 인스턴스 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID,                                                               -- 회사 식별자
    workflow_id             UUID                     NOT NULL,                                  -- 워크플로우 식별자
    document_id             UUID                     NOT NULL,                                  -- 문서 식별자
    document_type           VARCHAR(50)              NOT NULL,                                  -- 문서 유형
    request_user_id         UUID                     NOT NULL,                                  -- 결재 요청자 식별자
    request_date            TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,                 -- 결재 요청 일시
    
    -- 상태 정보
    status                  VARCHAR(20)              DEFAULT 'PENDING',                         -- 결재 상태
    completed_at            TIMESTAMP WITH TIME ZONE,                                           -- 결재 완료 일시
    
    -- 제약조건
    CONSTRAINT ck_approval_instances__status        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED'))
);

-- =====================================================================================
-- 테이블: com.approval_steps
-- 설명: 결재 단계별 승인 내역 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.approval_steps 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 승인 단계 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    approval_instance_id    UUID                     NOT NULL,                                  -- 결재 인스턴스 식별자
    step_order              INTEGER                  NOT NULL,                                  -- 단계 순서
    approver_id             UUID                     NOT NULL,                                  -- 실제 승인자 식별자
    status                  VARCHAR(20)              DEFAULT 'PENDING',                         -- 승인 상태
    approved_at             TIMESTAMP WITH TIME ZONE,                                           -- 승인 일시
    comments                TEXT,                                                               -- 승인 의견
    
    -- 제약조건
    CONSTRAINT ck_approval_steps__status            CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SKIPPED'))
);

-- =====================================================================================
-- 테이블: com.attachments
-- 설명: 첨부파일 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.attachments 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 첨부파일 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    document_id             UUID                     NOT NULL,                                  -- 연결된 문서 식별자
    document_type           VARCHAR(50)              NOT NULL,                                  -- 연결된 문서 타입
    
    -- 파일 정보
    file_name               VARCHAR(255)             NOT NULL,                                  -- 저장된 파일명
    original_name           VARCHAR(255)             NOT NULL,                                  -- 원본 파일명
    file_path               VARCHAR(500)             NOT NULL,                                  -- 파일 저장 경로
    file_size               BIGINT,                                                             -- 파일 크기 (bytes)
    mime_type               VARCHAR(100),                                                       -- MIME 타입
    
    -- 상태 관리
    deleted                 BOOLEAN                  DEFAULT false                              -- 논리 삭제 플래그
);

-- =====================================================================================
-- 테이블: com.calendars
-- 설명: 캘린더 및 휴일 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.calendars 
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(), -- 캘린더 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by          UUID,                                                           -- 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by          UUID,                                                           -- 수정자 UUID
    
    -- 캘린더 기본 정보
    tenant_id           UUID                     NOT NULL,                              -- 테넌트 식별자
    company_id          UUID                     NOT NULL,                              -- 회사 식별자
    
    calendar_date       DATE                     NOT NULL,                              -- 날짜
    
    -- 날짜 분해 정보
    calendar_year       INTEGER                  NOT NULL,                              -- 연도 (YYYY)
    calendar_month      INTEGER                  NOT NULL,                              -- 월 (1-12)
    calendar_day        INTEGER                  NOT NULL,                              -- 일 (1-31)
    day_of_week         INTEGER                  NOT NULL,                              -- 요일 (1=일요일, 7=토요일)
    day_of_week_name    VARCHAR(10)              NOT NULL,                              -- 요일명 (SUN, MON, TUE, WED, THU, FRI, SAT)
    
    -- 주차 정보
    week_of_year        INTEGER                  NOT NULL,                              -- 연간 주차 (1-53)
    week_of_month       INTEGER                  NOT NULL,                              -- 월간 주차 (1-6)
    
    -- 분기 정보
    quarter             INTEGER                  NOT NULL,                              -- 분기 (1-4)
    quarter_name        VARCHAR(10)              NOT NULL,                              -- 분기명 (Q1, Q2, Q3, Q4)
    
    -- 휴일 정보
    is_holiday          BOOLEAN                  DEFAULT false,                        -- 휴일 여부
    holiday_name        VARCHAR(100),                                                  -- 휴일명
    holiday_type        VARCHAR(20),                                                   -- 휴일 유형
    
    -- 업무일 정보
    is_weekend          BOOLEAN                  DEFAULT false,                        -- 주말 여부
    is_workday          BOOLEAN                  DEFAULT true,                         -- 업무일 여부
    
    -- 특별일 정보
    is_fiscal_year_end  BOOLEAN                  DEFAULT false,                        -- 회계연도말 여부
    is_month_end        BOOLEAN                  DEFAULT false,                        -- 월말 여부
    is_quarter_end      BOOLEAN                  DEFAULT false,                        -- 분기말 여부
    
    -- 추가 정보
    lunar_date          VARCHAR(10),                                                   -- 음력 날짜 (MMDD)
    special_note        TEXT,                                                          -- 특별 메모
    
    -- 상태 관리
    status              VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태
    is_deleted             BOOLEAN                  DEFAULT false,                        -- 논리 삭제 플래그
    
    -- 외래키 제약 조건
    CONSTRAINT fk_calendars__company_id     FOREIGN KEY (company_id) REFERENCES adm.companies(id)   ON DELETE CASCADE,
    
    -- 제약조건
    CONSTRAINT ck_calendars__calendar_year_range        CHECK (calendar_year BETWEEN 1900 AND 2199),
    CONSTRAINT ck_calendars__calendar_month_range       CHECK (calendar_month BETWEEN 1 AND 12),
    CONSTRAINT ck_calendars__calendar_day_range         CHECK (calendar_day BETWEEN 1 AND 31),
    CONSTRAINT ck_calendars__day_of_week_range          CHECK (day_of_week BETWEEN 1 AND 7),
    CONSTRAINT ck_calendars__day_of_week_name_format    CHECK (day_of_week_name IN ('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT')),
    CONSTRAINT ck_calendars__week_of_year_range         CHECK (week_of_year BETWEEN 1 AND 53),
    CONSTRAINT ck_calendars__week_of_month_range        CHECK (week_of_month BETWEEN 1 AND 6),
    CONSTRAINT ck_calendars__quarter_range              CHECK (quarter BETWEEN 1 AND 4),
    CONSTRAINT ck_calendars__quarter_name_format        CHECK (quarter_name IN ('Q1', 'Q2', 'Q3', 'Q4')),
    CONSTRAINT ck_calendars__holiday_type_format        CHECK (holiday_type IS NULL OR holiday_type IN ('NATIONAL', 'RELIGIOUS', 'COMPANY', 'OBSERVANCE', 'OTHER')),
    CONSTRAINT ck_calendars__status_format              CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    CONSTRAINT ck_calendars__date_consistency           CHECK (calendar_date = make_date(calendar_year, calendar_month, calendar_day))
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  com.calendars                     IS '캘린더 및 휴일 정보 관리 테이블';
COMMENT ON COLUMN com.calendars.id                  IS '캘린더 고유 식별자 (UUID)';
COMMENT ON COLUMN com.calendars.created_at          IS '등록 일시';
COMMENT ON COLUMN com.calendars.created_by          IS '등록자 UUID';
COMMENT ON COLUMN com.calendars.updated_at          IS '수정 일시';
COMMENT ON COLUMN com.calendars.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN com.calendars.tenant_id           IS '테넌트 식별자';
COMMENT ON COLUMN com.calendars.company_id          IS '회사 식별자';
COMMENT ON COLUMN com.calendars.calendar_date       IS '날짜';
COMMENT ON COLUMN com.calendars.calendar_year       IS '연도 (YYYY)';
COMMENT ON COLUMN com.calendars.calendar_month      IS '월 (1-12)';
COMMENT ON COLUMN com.calendars.calendar_day        IS '일 (1-31)';
COMMENT ON COLUMN com.calendars.day_of_week         IS '요일 (1=일요일, 7=토요일)';
COMMENT ON COLUMN com.calendars.day_of_week_name    IS '요일명 (SUN/MON/TUE/WED/THU/FRI/SAT)';
COMMENT ON COLUMN com.calendars.week_of_year        IS '연간 주차 (1-53)';
COMMENT ON COLUMN com.calendars.week_of_month       IS '월간 주차 (1-6)';
COMMENT ON COLUMN com.calendars.quarter             IS '분기 (1-4)';
COMMENT ON COLUMN com.calendars.quarter_name        IS '분기명 (Q1/Q2/Q3/Q4)';
COMMENT ON COLUMN com.calendars.is_holiday          IS '휴일 여부';
COMMENT ON COLUMN com.calendars.holiday_name        IS '휴일명';
COMMENT ON COLUMN com.calendars.holiday_type        IS '휴일 유형 (NATIONAL/RELIGIOUS/COMPANY/OBSERVANCE/OTHER)';
COMMENT ON COLUMN com.calendars.is_weekend          IS '주말 여부';
COMMENT ON COLUMN com.calendars.is_workday          IS '업무일 여부';
COMMENT ON COLUMN com.calendars.is_fiscal_year_end  IS '회계연도말 여부';
COMMENT ON COLUMN com.calendars.is_month_end        IS '월말 여부';
COMMENT ON COLUMN com.calendars.is_quarter_end      IS '분기말 여부';
COMMENT ON COLUMN com.calendars.lunar_date          IS '음력 날짜 (MMDD)';
COMMENT ON COLUMN com.calendars.special_note        IS '특별 메모';
COMMENT ON COLUMN com.calendars.status              IS '상태 (ACTIVE/INACTIVE/ARCHIVED)';
COMMENT ON COLUMN com.calendars.is_deleted             IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 기본 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__tenant_id
    ON com.calendars (tenant_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_calendars__company_id
    ON com.calendars (company_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_calendars__calendar_date
    ON com.calendars (calendar_date)
 WHERE is_deleted = false;

-- 연도별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__calendar_year
    ON com.calendars (calendar_year, calendar_month)
 WHERE is_deleted = false;

-- 월별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__year_month
    ON com.calendars (calendar_year, calendar_month, calendar_day)
 WHERE is_deleted = false;

-- 요일별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__day_of_week
    ON com.calendars (day_of_week)
 WHERE is_deleted = false;

-- 주차별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__week_of_year
    ON com.calendars (calendar_year, week_of_year)
 WHERE is_deleted = false;

-- 분기별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__quarter
    ON com.calendars (calendar_year, quarter)
 WHERE is_deleted = false;

-- 휴일 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__is_holiday
    ON com.calendars (calendar_year, is_holiday)
 WHERE is_holiday = true 
   AND is_deleted = false;

-- 업무일 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__is_workday
    ON com.calendars (calendar_date, is_workday)
 WHERE is_workday = true 
   AND is_deleted = false;

-- 주말 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__is_weekend
    ON com.calendars (calendar_date, is_weekend)
 WHERE is_weekend = true 
   AND is_deleted = false;

-- 특별일 조회 인덱스 (월말, 분기말, 회계연도말)
CREATE INDEX IF NOT EXISTS ix_calendars__special_dates
    ON com.calendars (calendar_date)
 WHERE (is_month_end = true OR is_quarter_end = true OR is_fiscal_year_end = true)
   AND is_deleted = false;

-- 휴일 유형별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__holiday_type
    ON com.calendars (holiday_type, calendar_year)
 WHERE holiday_type IS NOT NULL 
   AND is_deleted = false;

-- 상태별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_calendars__status
    ON com.calendars (status, company_id)
 WHERE is_deleted = false;

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 회사별 날짜 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_calendars__company_date
    ON com.calendars (company_id, calendar_date)
 WHERE is_deleted = false;
 
-- =====================================================================================
-- 테이블: com.holidays
-- 설명: 휴일 마스터 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.holidays 
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(), -- 휴일 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by          UUID,                                                           -- 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by          UUID,                                                           -- 수정자 UUID
    
    -- 휴일 기본 정보
    tenant_id           UUID                     NOT NULL,                              -- 테넌트 식별자
    company_id          UUID                     NOT NULL,                              -- 회사 식별자
    
    holiday_date        DATE                     NOT NULL,                              -- 휴일 날짜
    holiday_name        VARCHAR(100)             NOT NULL,                              -- 휴일명
    
    -- 휴일 상세 정보
    holiday_type        VARCHAR(20)              DEFAULT 'COMPANY',                     -- 휴일 유형
    holiday_category    VARCHAR(30),                                                    -- 휴일 분류
    is_recurring        BOOLEAN                  DEFAULT false,                         -- 매년 반복 여부
    
    -- 반복 설정 (매년 반복 휴일용)
    recurring_month     INTEGER,                                                       -- 반복 월 (1-12)
    recurring_day       INTEGER,                                                       -- 반복 일 (1-31)
    
    -- 대체휴일 정보
    is_substitute       BOOLEAN                  DEFAULT false,                        -- 대체휴일 여부
    original_date       DATE,                                                          -- 원래 휴일 날짜
    substitute_reason   VARCHAR(200),                                                  -- 대체 사유
    
    -- 휴일 적용 범위
    applies_to_all      BOOLEAN                  DEFAULT true,                         -- 전체 적용 여부
    department_ids      UUID[],                                                        -- 적용 부서 목록 (부분 적용시)
    
    -- 추가 정보
    description         TEXT,                                                          -- 휴일 설명
    notes               TEXT,                                                          -- 비고
    
    -- 상태 관리
    status              VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태
    is_deleted             BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그
    
    -- 외래키 제약 조건
    CONSTRAINT fk_holidays__company_id      FOREIGN KEY (company_id) REFERENCES adm.companies(id)   ON DELETE CASCADE,
    
    -- 제약조건
    CONSTRAINT ck_holidays__holiday_type_format         CHECK (holiday_type IN ('NATIONAL', 'RELIGIOUS', 'COMPANY', 'MEMORIAL', 'OBSERVANCE', 'OTHER')),
    CONSTRAINT ck_holidays__holiday_category_format     CHECK (holiday_category IS NULL OR holiday_category IN ('LEGAL', 'TRADITIONAL', 'RELIGIOUS', 'COMPANY_ANNIVERSARY', 'FOUNDER_DAY', 'TRAINING_DAY', 'CUSTOM')),
    CONSTRAINT ck_holidays__recurring_month_range       CHECK (recurring_month IS NULL OR (recurring_month BETWEEN 1 AND 12)),
    CONSTRAINT ck_holidays__recurring_day_range         CHECK (recurring_day IS NULL OR (recurring_day BETWEEN 1 AND 31)),
    CONSTRAINT ck_holidays__status_format               CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    CONSTRAINT ck_holidays__recurring_consistency       CHECK ((is_recurring = true AND recurring_month IS NOT NULL AND recurring_day IS NOT NULL) OR is_recurring = false),
    CONSTRAINT ck_holidays__substitute_consistency      CHECK ((is_substitute = true AND original_date IS NOT NULL) OR is_substitute = false)
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  com.holidays                      IS '휴일 마스터 정보 관리 테이블';
COMMENT ON COLUMN com.holidays.id                   IS '휴일 고유 식별자 (UUID)';
COMMENT ON COLUMN com.holidays.created_at           IS '등록 일시';
COMMENT ON COLUMN com.holidays.created_by           IS '등록자 UUID';
COMMENT ON COLUMN com.holidays.updated_at           IS '수정 일시';
COMMENT ON COLUMN com.holidays.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN com.holidays.tenant_id            IS '테넌트 식별자';
COMMENT ON COLUMN com.holidays.company_id           IS '회사 식별자';
COMMENT ON COLUMN com.holidays.holiday_date         IS '휴일 날짜';
COMMENT ON COLUMN com.holidays.holiday_name         IS '휴일명';
COMMENT ON COLUMN com.holidays.holiday_type         IS '휴일 유형 (NATIONAL/RELIGIOUS/COMPANY/MEMORIAL/OBSERVANCE/OTHER)';
COMMENT ON COLUMN com.holidays.holiday_category     IS '휴일 분류 (LEGAL/TRADITIONAL/RELIGIOUS/COMPANY_ANNIVERSARY/FOUNDER_DAY/TRAINING_DAY/CUSTOM)';
COMMENT ON COLUMN com.holidays.is_recurring         IS '매년 반복 여부';
COMMENT ON COLUMN com.holidays.recurring_month      IS '반복 월 (1-12, 매년 반복시)';
COMMENT ON COLUMN com.holidays.recurring_day        IS '반복 일 (1-31, 매년 반복시)';
COMMENT ON COLUMN com.holidays.is_substitute        IS '대체휴일 여부';
COMMENT ON COLUMN com.holidays.original_date        IS '원래 휴일 날짜 (대체휴일인 경우)';
COMMENT ON COLUMN com.holidays.substitute_reason    IS '대체 사유';
COMMENT ON COLUMN com.holidays.applies_to_all       IS '전체 적용 여부';
COMMENT ON COLUMN com.holidays.department_ids       IS '적용 부서 목록 (부분 적용시)';
COMMENT ON COLUMN com.holidays.description          IS '휴일 설명';
COMMENT ON COLUMN com.holidays.notes                IS '비고';
COMMENT ON COLUMN com.holidays.status               IS '상태 (ACTIVE/INACTIVE/ARCHIVED)';
COMMENT ON COLUMN com.holidays.is_deleted              IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 기본 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_holidays__tenant_id
    ON com.holidays (tenant_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_holidays__company_id
    ON com.holidays (company_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_holidays__holiday_date
    ON com.holidays (holiday_date)
 WHERE is_deleted = false;

-- 연도별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_holidays__year
    ON com.holidays (EXTRACT(YEAR FROM holiday_date), company_id)
 WHERE is_deleted = false;

-- 월별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_holidays__month
    ON com.holidays (EXTRACT(MONTH FROM holiday_date), company_id)
 WHERE is_deleted = false;

-- 휴일 유형별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_holidays__holiday_type
    ON com.holidays (holiday_type, company_id)
 WHERE is_deleted = false;

-- 휴일 분류별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_holidays__holiday_category
    ON com.holidays (holiday_category)
 WHERE holiday_category IS NOT NULL 
   AND is_deleted = false;

-- 반복 휴일 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_holidays__recurring
    ON com.holidays (is_recurring, recurring_month, recurring_day)
 WHERE is_recurring = true 
   AND is_deleted = false;

-- 대체휴일 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_holidays__substitute
    ON com.holidays (is_substitute, original_date)
 WHERE is_substitute = true 
   AND is_deleted = false;

-- 기간별 조회 인덱스 (휴일 범위 검색)
CREATE INDEX IF NOT EXISTS ix_holidays__date_range
    ON com.holidays (company_id, holiday_date, status)
 WHERE is_deleted = false;

-- 부서별 적용 조회 인덱스 (GIN 인덱스 사용)
CREATE INDEX IF NOT EXISTS ix_holidays__department_ids
    ON com.holidays USING GIN (department_ids)
 WHERE department_ids IS NOT NULL 
   AND is_deleted = false;

-- 상태별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_holidays__status
    ON com.holidays (status, company_id)
 WHERE is_deleted = false;

-- 다음 휴일 조회 인덱스 (업무용)
-- CREATE INDEX IF NOT EXISTS ix_holidays__upcoming
    -- ON com.holidays (company_id, holiday_date)
 -- WHERE holiday_date >= CURRENT_DATE 
   -- AND status = 'ACTIVE'
   -- AND is_deleted = false;

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 회사별 날짜+휴일명 유니크 (같은 날 동일한 휴일명 중복 방지)
