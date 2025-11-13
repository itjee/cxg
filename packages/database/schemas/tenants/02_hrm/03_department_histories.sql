-- =====================================================================================
-- 테이블: hrm.department_histories
-- 설명: 조직 개편 이력 테이블 - 부서 변경 이력 관리 (부서명, 부서장, 조직개편 등)
-- 작성일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS hrm.department_histories 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이력 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 부서 정보
    department_id           UUID                     NOT NULL,                               -- 부서 식별자
    
    -- 변경 정보
    change_type             VARCHAR(20)              NOT NULL,                               -- 변경 유형
    change_date             DATE                     NOT NULL,                               -- 변경 발령일
    effective_date          DATE                     NOT NULL,                               -- 변경 시행일
    change_reason           TEXT,                                                            -- 변경 사유
    
    -- 변경 전후 데이터
    old_code                VARCHAR(50),                                                     -- 변경 전 부서 코드
    new_code                VARCHAR(50),                                                     -- 변경 후 부서 코드
    old_name                VARCHAR(100),                                                    -- 변경 전 부서명
    new_name                VARCHAR(100),                                                    -- 변경 후 부서명
    old_dept_type           VARCHAR(20),                                                     -- 변경 전 부서 유형
    new_dept_type           VARCHAR(20),                                                     -- 변경 후 부서 유형
    old_parent_id           UUID,                                                            -- 변경 전 상위 부서
    new_parent_id           UUID,                                                            -- 변경 후 상위 부서
    old_manager_id          UUID,                                                            -- 변경 전 부서장
    new_manager_id          UUID,                                                            -- 변경 후 부서장
    
    -- 문서 정보
    order_number            VARCHAR(50),                                                     -- 발령 번호 (추가)
    order_document          TEXT,                                                            -- 발령 문서 내용 (추가)
    attachment_url          VARCHAR(500),                                                    -- 첨부 문서 URL (추가)
    
    -- 승인 정보
    approved_by             UUID,                                                            -- 승인자 UUID (추가)
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시 (추가)
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 상태 (추가)
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 변경 유형 체크
    CONSTRAINT ck_dept_histories__change_type       CHECK (change_type IN ('RENAME', 'REORGANIZE', 'MANAGER_CHANGE', 'TYPE_CHANGE', 'PARENT_CHANGE', 'MERGE', 'SPLIT', 'CLOSE', 'REOPEN')),
    
    -- 상태 체크
    CONSTRAINT ck_dept_histories__status            CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  hrm.department_histories                       IS '조직 개편 이력 테이블 - 부서 변경 이력 관리 (부서명, 부서장, 조직개편 등)';
COMMENT ON COLUMN hrm.department_histories.id                    IS '이력 고유 식별자 (UUID)';
COMMENT ON COLUMN hrm.department_histories.created_at            IS '등록 일시';
COMMENT ON COLUMN hrm.department_histories.created_by            IS '등록자 UUID';
COMMENT ON COLUMN hrm.department_histories.updated_at            IS '수정 일시';
COMMENT ON COLUMN hrm.department_histories.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN hrm.department_histories.department_id         IS '부서 식별자';
COMMENT ON COLUMN hrm.department_histories.change_type           IS '변경 유형 (RENAME: 명칭변경, REORGANIZE: 조직개편, MANAGER_CHANGE: 부서장변경, TYPE_CHANGE: 유형변경, PARENT_CHANGE: 상위부서변경, MERGE: 통합, SPLIT: 분할, CLOSE: 폐쇄, REOPEN: 재개)';
COMMENT ON COLUMN hrm.department_histories.change_date           IS '변경 발령일';
COMMENT ON COLUMN hrm.department_histories.effective_date        IS '변경 시행일 (실제 적용일)';
COMMENT ON COLUMN hrm.department_histories.change_reason         IS '변경 사유';
COMMENT ON COLUMN hrm.department_histories.old_code              IS '변경 전 부서 코드';
COMMENT ON COLUMN hrm.department_histories.new_code              IS '변경 후 부서 코드';
COMMENT ON COLUMN hrm.department_histories.old_name              IS '변경 전 부서명';
COMMENT ON COLUMN hrm.department_histories.new_name              IS '변경 후 부서명';
COMMENT ON COLUMN hrm.department_histories.old_dept_type         IS '변경 전 부서 유형';
COMMENT ON COLUMN hrm.department_histories.new_dept_type         IS '변경 후 부서 유형';
COMMENT ON COLUMN hrm.department_histories.old_parent_id         IS '변경 전 상위 부서 식별자';
COMMENT ON COLUMN hrm.department_histories.new_parent_id         IS '변경 후 상위 부서 식별자';
COMMENT ON COLUMN hrm.department_histories.old_manager_id        IS '변경 전 부서장 식별자';
COMMENT ON COLUMN hrm.department_histories.new_manager_id        IS '변경 후 부서장 식별자';
COMMENT ON COLUMN hrm.department_histories.order_number          IS '발령 번호';
COMMENT ON COLUMN hrm.department_histories.order_document        IS '발령 문서 내용';
COMMENT ON COLUMN hrm.department_histories.attachment_url        IS '첨부 문서 URL';
COMMENT ON COLUMN hrm.department_histories.approved_by           IS '승인자 UUID';
COMMENT ON COLUMN hrm.department_histories.approved_at           IS '승인 일시';
COMMENT ON COLUMN hrm.department_histories.status                IS '상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)';
COMMENT ON COLUMN hrm.department_histories.is_deleted            IS '논리 삭제 플래그';

-- 일반 인덱스
CREATE INDEX ix_dept_histories__department_id 
    ON hrm.department_histories (department_id)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_dept_histories__department_id IS '부서별 이력 조회 인덱스';

CREATE INDEX ix_dept_histories__change_date 
    ON hrm.department_histories (change_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_dept_histories__change_date IS '변경 발령일 조회 인덱스 (최신순)';

CREATE INDEX ix_dept_histories__effective_date 
    ON hrm.department_histories (effective_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_dept_histories__effective_date IS '변경 시행일 조회 인덱스 (최신순)';

CREATE INDEX ix_dept_histories__change_type 
    ON hrm.department_histories (change_type)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_dept_histories__change_type IS '변경 유형별 조회 인덱스';

CREATE INDEX ix_dept_histories__status 
    ON hrm.department_histories (status)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_dept_histories__status IS '상태별 조회 인덱스';

CREATE INDEX ix_dept_histories__order_number 
    ON hrm.department_histories (order_number)
 WHERE order_number IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX hrm.ix_dept_histories__order_number IS '발령 번호별 조회 인덱스';

-- 외래키 제약조건
-- 부서 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__department_id
    FOREIGN KEY (department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_dept_histories__department_id ON hrm.department_histories IS '부서 참조 외래키 (CASCADE 삭제)';

-- 변경 전 상위 부서 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__old_parent_id
    FOREIGN KEY (old_parent_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_dept_histories__old_parent_id ON hrm.department_histories IS '변경 전 상위 부서 참조 외래키 (SET NULL 삭제)';

-- 변경 후 상위 부서 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__new_parent_id
    FOREIGN KEY (new_parent_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_dept_histories__new_parent_id ON hrm.department_histories IS '변경 후 상위 부서 참조 외래키 (SET NULL 삭제)';

-- 변경 전 부서장 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__old_manager_id
    FOREIGN KEY (old_manager_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_dept_histories__old_manager_id ON hrm.department_histories IS '변경 전 부서장 참조 외래키 (SET NULL 삭제)';

-- 변경 후 부서장 참조
ALTER TABLE hrm.department_histories 
  ADD CONSTRAINT fk_dept_histories__new_manager_id
    FOREIGN KEY (new_manager_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_dept_histories__new_manager_id ON hrm.department_histories IS '변경 후 부서장 참조 외래키 (SET NULL 삭제)';
