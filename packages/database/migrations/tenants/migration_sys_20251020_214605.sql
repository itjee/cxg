-- ============================================================================
-- 레거시 테이블 마이그레이션 스크립트
-- Schema: sys
-- Generated: 2025-10-20 21:46:05
-- ============================================================================

-- ============================================================================
-- 신규 테이블: sys.clsn_mon
-- 레거시: TSS_CLSN_MON
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.clsn_mon (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    base_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] BASE_YM
    clsn_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] CLSN_TP
    clsn_date                      CHAR(8)                                  ,  -- [LEGACY] CLSN_DT
    clsn_tm                        CHAR(4)                                  ,  -- [LEGACY] CLSN_TM
    clsn_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] CLSN_YN
    description                    VARCHAR(300)                             ,  -- [LEGACY] NOTES
    ix_tss_clsn_mon__base_ym       TEXT                                     ,  -- [LEGACY] IX_TSS_CLSN_MON__BASE_YM
    ix_tss_clsn_mon__clsn_date     TEXT                                     ,  -- [LEGACY] IX_TSS_CLSN_MON__CLSN_DT
    ix_tss_clsn_mon__clsn_tm       TEXT                                     ,  -- [LEGACY] IX_TSS_CLSN_MON__CLSN_TM
    ix_tss_clsn_mon__clsn_type     TEXT                                     ,  -- [LEGACY] IX_TSS_CLSN_MON__CLSN_TP
    ix_tss_clsn_mon__clsn_flag     TEXT                                     ,  -- [LEGACY] IX_TSS_CLSN_MON__CLSN_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.clsn_mon
IS '레거시 테이블 TSS_CLSN_MON에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clsn_mon__is_deleted
    ON sys.clsn_mon (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.clsn_mon_log
-- 레거시: TSS_CLSN_MON_LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.clsn_mon_log (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    clsn_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] CLSN_YM
    clsn_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] CLSN_DT
    mnth_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] MNTH_TP
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    message                        TEXT                                     ,  -- [LEGACY] MESSAGE
    ix_tss_clsn_mon_log__base_date TEXT                                     ,  -- [LEGACY] IX_TSS_CLSN_MON_LOG__BASE_DT
    ix_tss_clsn_mon_log__clsn_date TEXT                                     ,  -- [LEGACY] IX_TSS_CLSN_MON_LOG__CLSN_DT
    ix_tss_clsn_mon_log__clsn_ym   TEXT                                     ,  -- [LEGACY] IX_TSS_CLSN_MON_LOG__CLSN_YM
    ix_tss_clsn_mon_log__proc_st   TEXT                                     ,  -- [LEGACY] IX_TSS_CLSN_MON_LOG__PROC_ST
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.clsn_mon_log
IS '레거시 테이블 TSS_CLSN_MON_LOG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clsn_mon_log__is_deleted
    ON sys.clsn_mon_log (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.codes
-- 레거시: TSS_CODE_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.codes (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    code_code                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] CODE_CD
    code_name                      VARCHAR(200)                             ,  -- [LEGACY] CODE_NM
    parent_code                    VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] PARENT_CD
    max_length                     INTEGER                        NOT NULL  ,  -- [LEGACY] MAX_LENGTH
    sort_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] SORT_SEQ
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    code_01                        VARCHAR(100)                             ,  -- [LEGACY] CODE_01
    code_02                        VARCHAR(100)                             ,  -- [LEGACY] CODE_02
    code_03                        VARCHAR(100)                             ,  -- [LEGACY] CODE_03
    code_04                        VARCHAR(100)                             ,  -- [LEGACY] CODE_04
    code_05                        VARCHAR(100)                             ,  -- [LEGACY] CODE_05
    code_06                        VARCHAR(100)                             ,  -- [LEGACY] CODE_06
    code_07                        VARCHAR(100)                             ,  -- [LEGACY] CODE_07
    code_08                        VARCHAR(100)                             ,  -- [LEGACY] CODE_08
    code_09                        VARCHAR(100)                             ,  -- [LEGACY] CODE_09
    ix_tss_code_mst__code_01       TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_01
    ix_tss_code_mst__code_02       TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_02
    ix_tss_code_mst__code_03       TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_03
    ix_tss_code_mst__code_04       TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_04
    ix_tss_code_mst__code_05       TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_05
    ix_tss_code_mst__code_06       TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_06
    ix_tss_code_mst__code_07       TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_07
    ix_tss_code_mst__code_08       TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_08
    ix_tss_code_mst__code_09       TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_09
    ix_tss_code_mst__code_code     TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__CODE_CD
    ix_tss_code_mst__parent_code   TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__PARENT_CD
    ix_tss_code_mst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TSS_CODE_MST__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.codes
IS '레거시 테이블 TSS_CODE_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_codes__is_deleted
    ON sys.codes (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.dict_details
-- 레거시: TSS_DICT_DTL
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.dict_details (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    dict_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] DICT_ID
    culture_id                     VARCHAR(10)                    NOT NULL  ,  -- [LEGACY] CULTURE_ID
    dict_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] DICT_NM
    ix_tss_dict_datel__culture_id  TEXT                                     ,  -- [LEGACY] IX_TSS_DICT_DTL__CULTURE_ID
    ix_tss_dict_datel__dict_id     TEXT                                     ,  -- [LEGACY] IX_TSS_DICT_DTL__DICT_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.dict_details
IS '레거시 테이블 TSS_DICT_DTL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_dict_details__is_deleted
    ON sys.dict_details (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.dicts
-- 레거시: TSS_DICT_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.dicts (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    dict_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] DICT_TP
    dict_code                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] DICT_CD
    dict_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] DICT_NM
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tss_dict_mst__dict_code     TEXT                                     ,  -- [LEGACY] IX_TSS_DICT_MST__DICT_CD
    ix_tss_dict_mst__dict_type     TEXT                                     ,  -- [LEGACY] IX_TSS_DICT_MST__DICT_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.dicts
IS '레거시 테이블 TSS_DICT_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_dicts__is_deleted
    ON sys.dicts (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.employee_ann_history
-- 레거시: TSS_EMPY_ANN_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.employee_ann_history (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    empy_code                      VARCHAR(10)                    NOT NULL  ,  -- [LEGACY] EMPY_CD
    hist_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] HIST_DT
    base_ann_cnt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BASE_ANN_CNT
    add_ann_cnt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] ADD_ANN_CNT
    created_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] CREATE_ON
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    created_by_name                VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] CREATE_BY
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    updated_by_name                VARCHAR(20)                              ,  -- [LEGACY] UPDATE_BY
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.employee_ann_history
IS '레거시 테이블 TSS_EMPY_ANN_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_employee_ann_history__is_deleted
    ON sys.employee_ann_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.employee_anns
-- 레거시: TSS_EMPY_ANN_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.employee_anns (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] CREATE_ON
    created_by                     INTEGER                        NOT NULL  ,  -- [LEGACY] CREATE_ID
    created_by_name                VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CREATE_BY
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    updated_by_name                VARCHAR(100)                             ,  -- [LEGACY] UPDATE_BY
    empy_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] EMPY_DT
    empy_code                      VARCHAR(10)                              ,  -- [LEGACY] EMPY_CD
    base_ann_cnt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BASE_ANN_CNT
    add_ann_cnt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] ADD_ANN_CNT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.employee_anns
IS '레거시 테이블 TSS_EMPY_ANN_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_employee_anns__is_deleted
    ON sys.employee_anns (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.employee_rewd_anns
-- 레거시: TSS_EMPY_REWD_ANN_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.employee_rewd_anns (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] CREATE_ON
    created_by                     INTEGER                        NOT NULL  ,  -- [LEGACY] CREATE_ID
    created_by_name                VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CREATE_BY
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    updated_by_name                VARCHAR(100)                             ,  -- [LEGACY] UPDATE_BY
    empy_code                      VARCHAR(10)                              ,  -- [LEGACY] EMPY_CD
    rewd_ann_cnt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] REWD_ANN_CNT
    leave_type                     CHAR(4)                                  ,  -- [LEGACY] LEAVE_TP
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.employee_rewd_anns
IS '레거시 테이블 TSS_EMPY_REWD_ANN_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_employee_rewd_anns__is_deleted
    ON sys.employee_rewd_anns (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.employee_subs_anns
-- 레거시: TSS_EMPY_SUBS_ANN_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.employee_subs_anns (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] CREATE_ON
    created_by                     INTEGER                        NOT NULL  ,  -- [LEGACY] CREATE_ID
    created_by_name                VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CREATE_BY
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    updated_by_name                VARCHAR(100)                             ,  -- [LEGACY] UPDATE_BY
    empy_code                      VARCHAR(10)                              ,  -- [LEGACY] EMPY_CD
    leave_type                     CHAR(4)                                  ,  -- [LEGACY] LEAVE_TP
    prov_date                      VARCHAR(8)                     NOT NULL  ,  -- [LEGACY] PROV_DT
    subs_ann_cnt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUBS_ANN_CNT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.employee_subs_anns
IS '레거시 테이블 TSS_EMPY_SUBS_ANN_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_employee_subs_anns__is_deleted
    ON sys.employee_subs_anns (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.error_log
-- 레거시: TSS_ERROR_LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.error_log (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    forminstance                   VARCHAR(100)                             ,  -- [LEGACY] FormInstance
    formid                         VARCHAR(20)                              ,  -- [LEGACY] FormID
    formname                       VARCHAR(200)                             ,  -- [LEGACY] FormName
    empno                          VARCHAR(8)                               ,  -- [LEGACY] EmpNo
    errdate                        TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] ErrDate
    errmsg                         VARCHAR(500)                             ,  -- [LEGACY] ErrMsg
    stacktrace                     VARCHAR(2000)                            ,  -- [LEGACY] StackTrace
    imgname                        VARCHAR(200)                             ,  -- [LEGACY] ImgName
    macaddress                     VARCHAR(30)                              ,  -- [LEGACY] MacAddress
    ipaddress                      VARCHAR(20)                              ,  -- [LEGACY] IPAddress
    status                         CHAR(1)                                  ,  -- [LEGACY] Status
    regdate                        TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] RegDate
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.error_log
IS '레거시 테이블 TSS_ERROR_LOG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_error_log__is_deleted
    ON sys.error_log (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.files
-- 레거시: TSS_FILE_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.files (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    org_file_name                  VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] ORG_FILE_NM
    file_name                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] FILE_NM
    file_path                      VARCHAR(200)                             ,  -- [LEGACY] FILE_PATH
    file_ext                       VARCHAR(10)                              ,  -- [LEGACY] FILE_EXT
    file_size                      NUMERIC(17, 2)                           ,  -- [LEGACY] FILE_SIZE
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tss_file_mst                TEXT                                     ,  -- [LEGACY] IX_TSS_FILE_MST
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.files
IS '레거시 테이블 TSS_FILE_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_files__is_deleted
    ON sys.files (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.help_grid
-- 레거시: TSS_HELP_GRID
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.help_grid (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    help_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] HELP_ID
    field_name                     VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] FIELD_NAME
    field_desc                     VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] FIELD_DESC
    halignment                     CHAR(1)                        NOT NULL  ,  -- [LEGACY] HALIGNMENT
    formattype                     CHAR(1)                        NOT NULL  ,  -- [LEGACY] FORMATTYPE
    formatstring                   VARCHAR(20)                              ,  -- [LEGACY] FORMATSTRING
    summary_flag                   CHAR(1)                        NOT NULL  ,  -- [LEGACY] SUMMARY_YN
    merge_flag                     CHAR(1)                                  ,  -- [LEGACY] MERGE_YN
    sort_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] SORT_ORDER
    width                          INTEGER                                  ,  -- [LEGACY] WIDTH
    description                    TEXT                                     ,  -- [LEGACY] DESCRIPTION
    ix_tss_help_grid__help_id      TEXT                                     ,  -- [LEGACY] IX_TSS_HELP_GRID__HELP_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.help_grid
IS '레거시 테이블 TSS_HELP_GRID에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_help_grid__is_deleted
    ON sys.help_grid (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.helps
-- 레거시: TSS_HELP_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.helps (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    help_code                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] HELP_CD
    help_name                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] HELP_NM
    sp_name                        VARCHAR(50)                              ,  -- [LEGACY] SP_NAME
    sql_query                      TEXT                                     ,  -- [LEGACY] SQL_QUERY
    sql_param                      VARCHAR(200)                             ,  -- [LEGACY] SQL_PARAM
    form_title                     VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] FORM_TITLE
    form_width                     INTEGER                        NOT NULL  ,  -- [LEGACY] FORM_WIDTH
    form_height                    INTEGER                        NOT NULL  ,  -- [LEGACY] FORM_HEIGHT
    disp_field                     VARCHAR(500)                             ,  -- [LEGACY] DISP_FIELD
    is_find_text                   CHAR(1)                        NOT NULL  ,  -- [LEGACY] IS_FIND_TEXT
    is_use_flag                    CHAR(1)                        NOT NULL  ,  -- [LEGACY] IS_USE_YN
    is_paging                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] IS_PAGING
    is_tree                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] IS_TREE
    use_def_value                  CHAR(1)                                  ,  -- [LEGACY] USE_DEF_VALUE
    key_field                      VARCHAR(50)                              ,  -- [LEGACY] KEY_FIELD
    pid_field                      VARCHAR(50)                              ,  -- [LEGACY] PID_FIELD
    root_value                     VARCHAR(50)                              ,  -- [LEGACY] ROOT_VALUE
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.helps
IS '레거시 테이블 TSS_HELP_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_helps__is_deleted
    ON sys.helps (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.role
-- 레거시: TSS_ROLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.role (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    role_name                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] ROLE_NM
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] DESCRIPTION
    ix_tss_role__use_flag          TEXT                                     ,  -- [LEGACY] IX_TSS_ROLE__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.role
IS '레거시 테이블 TSS_ROLE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_role__is_deleted
    ON sys.role (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.view
-- 레거시: TSS_VIEW
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.view (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    view_name                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] VIEW_NM
    module_id                      INTEGER                        NOT NULL  ,  -- [LEGACY] MODULE_ID
    namespace                      VARCHAR(50)                              ,  -- [LEGACY] NAMESPACE
    instance                       VARCHAR(50)                              ,  -- [LEGACY] INSTANCE
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] DESCRIPTION
    ix_tss_view__instance          TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW__INSTANCE
    ix_tss_view__module_id         TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW__MODULE_ID
    ix_tss_view__namespace         TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW__NAMESPACE
    ix_tss_view__use_flag          TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.view
IS '레거시 테이블 TSS_VIEW에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_view__is_deleted
    ON sys.view (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.view_grid
-- 레거시: TSS_VIEW_GRID
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.view_grid (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    view_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] VIEW_ID
    grid_number                    INTEGER                        NOT NULL  ,  -- [LEGACY] GRID_NO
    comment                        TEXT                                     ,  -- [LEGACY] COMMENT
    dbsp_id                        VARCHAR(100)                             ,  -- [LEGACY] DBSP_ID
    smry_flag                      CHAR(1)                                  ,  -- [LEGACY] SMRY_YN
    pagn_flag                      CHAR(1)                                  ,  -- [LEGACY] PAGN_YN
    pagn_size                      INTEGER                                  ,  -- [LEGACY] PAGN_SIZE
    ix_tss_view_grid__dbsp_id      TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_GRID__DBSP_ID
    ix_tss_view_grid__grid_number  TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_GRID__GRID_NO
    ix_tss_view_grid__smry_flag    TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_GRID__SMRY_YN
    ix_tss_view_grid__view_id      TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_GRID__VIEW_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.view_grid
IS '레거시 테이블 TSS_VIEW_GRID에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_view_grid__is_deleted
    ON sys.view_grid (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.view_grid_band
-- 레거시: TSS_VIEW_GRID_BAND
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.view_grid_band (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    grid_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] GRID_ID
    caption                        VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CAPTION
    comment                        TEXT                                     ,  -- [LEGACY] COMMENT
    sort_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] SORT_SEQ
    ix_tss_view_grid_band__grid_id TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_GRID_BAND__GRID_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.view_grid_band
IS '레거시 테이블 TSS_VIEW_GRID_BAND에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_view_grid_band__is_deleted
    ON sys.view_grid_band (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.view_grid_column
-- 레거시: TSS_VIEW_GRID_COLUMN
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.view_grid_column (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    grid_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] GRID_ID
    caption                        VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CAPTION
    field_name                     VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] FIELD_NAME
    field_type                     CHAR(3)                                  ,  -- [LEGACY] FIELD_TYPE
    halignment                     CHAR(3)                        NOT NULL  ,  -- [LEGACY] HALIGNMENT
    formattype                     CHAR(3)                        NOT NULL  ,  -- [LEGACY] FORMATTYPE
    formatstring                   VARCHAR(20)                              ,  -- [LEGACY] FORMATSTRING
    width                          INTEGER                        NOT NULL  ,  -- [LEGACY] WIDTH
    smry_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SMRY_YN
    fixd_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] FIXD_YN
    merg_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] MERG_YN
    edit_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] EDIT_YN
    mand_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] MAND_YN
    sort_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] SORT_SEQ
    band_id                        INTEGER                                  ,  -- [LEGACY] BAND_ID
    back_color                     VARCHAR(20)                              ,  -- [LEGACY] BACK_COLOR
    fore_color                     VARCHAR(20)                              ,  -- [LEGACY] FORE_COLOR
    comment                        TEXT                                     ,  -- [LEGACY] COMMENT
    grid_edit_type                 CHAR(4)                                  ,  -- [LEGACY] GRID_EDIT_TP
    lookup_para1                   VARCHAR(100)                             ,  -- [LEGACY] LOOKUP_PARA1
    lookup_para2                   VARCHAR(100)                             ,  -- [LEGACY] LOOKUP_PARA2
    lookup_para3                   VARCHAR(100)                             ,  -- [LEGACY] LOOKUP_PARA3
    lookup_para4                   VARCHAR(100)                             ,  -- [LEGACY] LOOKUP_PARA4
    lookup_para5                   VARCHAR(100)                             ,  -- [LEGACY] LOOKUP_PARA5
    ix_tss_view_grid_column__band_id TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_GRID_COLUMN__BAND_ID
    ix_tss_view_grid_column__field_name TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_GRID_COLUMN__FIELD_NAME
    ix_tss_view_grid_column__grid_id TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_GRID_COLUMN__GRID_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.view_grid_column
IS '레거시 테이블 TSS_VIEW_GRID_COLUMN에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_view_grid_column__is_deleted
    ON sys.view_grid_column (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: sys.view_role
-- 레거시: TSS_VIEW_ROLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS sys.view_role (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    view_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] VIEW_ID
    role_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] ROLE_ID
    inq_flag                       CHAR(1)                                  ,  -- [LEGACY] INQ_YN
    sav_flag                       CHAR(1)                                  ,  -- [LEGACY] SAV_YN
    del_flag                       CHAR(1)                                  ,  -- [LEGACY] DEL_YN
    fix_flag                       CHAR(1)                                  ,  -- [LEGACY] FIX_YN
    prt_flag                       CHAR(1)                                  ,  -- [LEGACY] PRT_YN
    description                    TEXT                                     ,  -- [LEGACY] DESCRIPTION
    ix_tss_view_role__role_id      TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_ROLE__ROLE_ID
    ix_tss_view_role__user_id      TEXT                                     ,  -- [LEGACY] IX_TSS_VIEW_ROLE__USER_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE sys.view_role
IS '레거시 테이블 TSS_VIEW_ROLE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_view_role__is_deleted
    ON sys.view_role (is_deleted)
 WHERE is_deleted = false;


