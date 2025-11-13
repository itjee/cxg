-- =====================================================================================
-- 테이블: hrm.absences
-- 설명: 결근/휴가 관리 테이블 - 직원의 결근, 휴가, 병가, 휴직 등 관리
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS hrm.absences
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결근 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID

    -- 직원 정보
    employee_id             UUID                     NOT NULL,                               -- 직원 식별자

    -- 결근 정보
    absence_type            VARCHAR(20)              NOT NULL,                               -- 결근 유형
    date_from               DATE                     NOT NULL,                               -- 시작일
    date_to                 DATE                     NOT NULL,                               -- 종료일
    duration_hours          INTEGER,                                                         -- 소요 시간 (NULL이면 전일)
    reason                  TEXT,                                                            -- 사유

    -- 증빙 자료
    attached_document_path  VARCHAR(500),                                                    -- 첨부 문서 경로 (진단서 등)

    -- 승인 정보
    approved_by             UUID,                                                            -- 승인자 UUID
    approval_date           TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    rejection_reason        TEXT,                                                            -- 거부 사유

    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그

    -- 제약조건
    -- 결근 유형 체크 (ABSENCE: 결근, LATE: 지각, SICK: 병가, ANNUAL: 연차, UNPAID: 무급휴가, MATERNITY: 출산휴가, LEAVE: 휴직)
    CONSTRAINT ck_absences__absence_type            CHECK (absence_type IN ('ABSENCE', 'LATE', 'SICK', 'ANNUAL', 'UNPAID', 'MATERNITY', 'LEAVE')),

    -- 상태 체크 (DRAFT: 임시저장, SUBMITTED: 제출, APPROVED: 승인, REJECTED: 거부, CANCELLED: 취소)
    CONSTRAINT ck_absences__status                  CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')),

    -- 소요 시간 양수 체크 (NULL이거나 양수)
    CONSTRAINT ck_absences__duration_hours          CHECK (duration_hours IS NULL OR duration_hours > 0),

    -- 날짜 순서 체크 (종료일 >= 시작일)
    CONSTRAINT ck_absences__date_order              CHECK (date_to >= date_from),

    -- 직원 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_absences__employee_id
        FOREIGN KEY (employee_id) REFERENCES hrm.employees(id) ON DELETE RESTRICT,

    -- 승인자 참조 외래키 (SET NULL 삭제)
    CONSTRAINT fk_absences__approved_by
        FOREIGN KEY (approved_by) REFERENCES hrm.employees(id) ON DELETE SET NULL,

    -- 등록자 참조 외래키
    CONSTRAINT fk_absences__created_by
        FOREIGN KEY (created_by) REFERENCES sys.users(id) ON DELETE SET NULL,

    -- 수정자 참조 외래키
    CONSTRAINT fk_absences__updated_by
        FOREIGN KEY (updated_by) REFERENCES sys.users(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  hrm.absences                          IS '결근/휴가 관리 테이블 - 직원의 결근, 휴가, 병가, 휴직 등 관리';
COMMENT ON COLUMN hrm.absences.id                       IS '결근 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.absences.created_at               IS '등록 일시';
COMMENT ON COLUMN hrm.absences.created_by               IS '등록자 UUID';
COMMENT ON COLUMN hrm.absences.updated_at               IS '수정 일시';
COMMENT ON COLUMN hrm.absences.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN hrm.absences.employee_id              IS '직원 식별자';
COMMENT ON COLUMN hrm.absences.absence_type             IS '결근 유형 (ABSENCE: 결근, LATE: 지각, SICK: 병가, ANNUAL: 연차, UNPAID: 무급휴가, MATERNITY: 출산휴가, LEAVE: 휴직)';
COMMENT ON COLUMN hrm.absences.date_from                IS '시작일';
COMMENT ON COLUMN hrm.absences.date_to                  IS '종료일';
COMMENT ON COLUMN hrm.absences.duration_hours           IS '소요 시간 (NULL이면 전일)';
COMMENT ON COLUMN hrm.absences.reason                   IS '사유';
COMMENT ON COLUMN hrm.absences.attached_document_path   IS '첨부 문서 경로 (진단서 등)';
COMMENT ON COLUMN hrm.absences.approved_by              IS '승인자 UUID';
COMMENT ON COLUMN hrm.absences.approval_date            IS '승인 일시';
COMMENT ON COLUMN hrm.absences.rejection_reason         IS '거부 사유';
COMMENT ON COLUMN hrm.absences.status                   IS '상태 (DRAFT: 임시저장, SUBMITTED: 제출, APPROVED: 승인, REJECTED: 거부, CANCELLED: 취소)';
COMMENT ON COLUMN hrm.absences.is_deleted               IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스 (없음 - 한 직원이 같은 날짜에 여러 결근 기록 가능)

-- 일반 인덱스
CREATE INDEX ix_absences__employee_id
    ON hrm.absences (employee_id, date_from DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_absences__employee_id IS '직원별 결근 기록 조회 인덱스';

CREATE INDEX ix_absences__absence_type
    ON hrm.absences (absence_type)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_absences__absence_type IS '결근 유형별 조회 인덱스';

CREATE INDEX ix_absences__status
    ON hrm.absences (status, employee_id)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_absences__status IS '상태별 조회 인덱스';

CREATE INDEX ix_absences__date_range
    ON hrm.absences (date_from, date_to)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_absences__date_range IS '날짜 범위 조회 인덱스';

CREATE INDEX ix_absences__approved_by
    ON hrm.absences (approved_by)
 WHERE approved_by IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_absences__approved_by IS '승인자별 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건 설명
-- =====================================================================================

COMMENT ON CONSTRAINT fk_absences__employee_id ON hrm.absences IS '직원 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_absences__approved_by ON hrm.absences IS '승인자 참조 외래키 (SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_absences__created_by ON hrm.absences IS '등록자 참조 외래키 (SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_absences__updated_by ON hrm.absences IS '수정자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: hrm.absences 테이블 생성
-- =====================================================================================
