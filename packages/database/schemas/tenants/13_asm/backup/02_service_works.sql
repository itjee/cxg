CREATE TABLE IF NOT EXISTS asm.service_works 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 작업 내역 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 작업 기본 정보
    service_request_id      UUID                     NOT NULL,                                           -- A/S 요청 식별자
    work_date               DATE                     NOT NULL,                                           -- 작업 실시 일자
    technician_id           UUID                     NOT NULL,                                           -- 작업 기술자 식별자
    work_description        TEXT                     NOT NULL,                                           -- 작업 내용 상세 설명
    
    -- 작업 시간 정보
    work_start_time         TIME,                                                                        -- 작업 시작 시간 -- 추가
    work_end_time           TIME,                                                                        -- 작업 종료 시간 -- 추가
    labor_hours             NUMERIC(5,2)             DEFAULT 0,                                          -- 작업 소요 시간 (시간 단위)
    
    -- 비용 정보
    labor_cost              NUMERIC(18,4)            DEFAULT 0,                                          -- 인건비
    parts_cost              NUMERIC(18,4)            DEFAULT 0,                                          -- 부품비
    other_cost              NUMERIC(18,4)            DEFAULT 0,                                          -- 기타 비용 -- 추가
    total_cost              NUMERIC(18,4)            DEFAULT 0,                                          -- 총 비용 (인건비 + 부품비 + 기타)
    
    -- 작업 결과
    work_result             VARCHAR(20),                                                                 -- 작업 결과 (SUCCESS/PARTIAL/FAILED) -- 추가
    result_notes            TEXT,                                                                        -- 작업 결과 메모 -- 추가
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'COMPLETED',                                -- 작업 상태 (IN_PROGRESS/COMPLETED/CANCELLED)
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 비용 양수 체크
    CONSTRAINT ck_service_works__costs              CHECK (labor_cost >= 0 AND parts_cost >= 0 AND other_cost >= 0 AND total_cost >= 0),
    -- 작업시간 범위 체크 (0~24시간)
    CONSTRAINT ck_service_works__labor_hours        CHECK (labor_hours >= 0 AND labor_hours <= 24),
    -- 작업 상태 체크 (IN_PROGRESS: 진행중, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_service_works__status             CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    -- 작업 결과 체크 (SUCCESS: 성공, PARTIAL: 부분성공, FAILED: 실패)
    CONSTRAINT ck_service_works__work_result        CHECK (work_result IS NULL OR work_result IN ('SUCCESS', 'PARTIAL', 'FAILED')),
    -- 시간 유효성 체크 (종료시간이 시작시간보다 이후)
    CONSTRAINT ck_service_works__time_range         CHECK (work_end_time IS NULL OR work_start_time IS NULL OR work_end_time >= work_start_time)
);

COMMENT ON TABLE  asm.service_works                              IS 'A/S 작업 내역 및 진행 상황 관리 테이블';
COMMENT ON COLUMN asm.service_works.id                           IS '작업 내역 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.service_works.created_at                   IS '등록 일시';
COMMENT ON COLUMN asm.service_works.created_by                   IS '등록자 UUID';
COMMENT ON COLUMN asm.service_works.updated_at                   IS '수정 일시';
COMMENT ON COLUMN asm.service_works.updated_by                   IS '수정자 UUID';
COMMENT ON COLUMN asm.service_works.service_request_id           IS 'A/S 요청 식별자';
COMMENT ON COLUMN asm.service_works.work_date                    IS '작업 실시 일자';
COMMENT ON COLUMN asm.service_works.technician_id                IS '작업 기술자 식별자';
COMMENT ON COLUMN asm.service_works.work_description             IS '작업 내용 상세 설명';
COMMENT ON COLUMN asm.service_works.work_start_time              IS '작업 시작 시간';
COMMENT ON COLUMN asm.service_works.work_end_time                IS '작업 종료 시간';
COMMENT ON COLUMN asm.service_works.labor_hours                  IS '작업 소요 시간 (시간 단위)';
COMMENT ON COLUMN asm.service_works.labor_cost                   IS '인건비';
COMMENT ON COLUMN asm.service_works.parts_cost                   IS '부품비';
COMMENT ON COLUMN asm.service_works.other_cost                   IS '기타 비용';
COMMENT ON COLUMN asm.service_works.total_cost                   IS '총 비용 (인건비 + 부품비 + 기타)';
COMMENT ON COLUMN asm.service_works.work_result                  IS '작업 결과 (SUCCESS: 성공/PARTIAL: 부분성공/FAILED: 실패)';
COMMENT ON COLUMN asm.service_works.result_notes                 IS '작업 결과 메모';
COMMENT ON COLUMN asm.service_works.status                       IS '작업 상태 (IN_PROGRESS: 진행중/COMPLETED: 완료/CANCELLED: 취소)';
COMMENT ON COLUMN asm.service_works.is_deleted                   IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: asm.service_parts
-- 설명: A/S 작업시 사용된 부품 내역을 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================
