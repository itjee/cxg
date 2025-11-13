# 기존 테이블 → 현재 스키마 마이그레이션 분석 리포트

**분석 일시**: /home/itjee/workspace/cxg


## ADM 모듈
- 기존 테이블: 12개
- 현재 테이블: 17개

### 기존 테이블 목록
- TBS_BRND_MST (0개 컬럼)
- TBS_EMPY_MST (0개 컬럼)
- TBS_DEPT_MST (0개 컬럼)
- TSS_EMPY_REWD_ANN_MST (0개 컬럼)
- EMP_MAP (0개 컬럼)
- TBS_CORP_MST (0개 컬럼)
- TSS_EMPY_SUBS_ANN_MST (0개 컬럼)
- TBS_EMPY_HST (0개 컬럼)
- TSS_EMPY_ANN_HIST (0개 컬럼)
- TSS_EMPY_ANN_MST (0개 컬럼)
- ... 외 2개

### 현재 테이블 목록
- adm
- adm
- adm
- adm
- adm
- adm
- adm
- adm
- adm
- adm
- ... 외 7개

**✅ 양호**: 현재 스키마가 더 많은 테이블 포함

## ASM 모듈
- 기존 테이블: 18개
- 현재 테이블: 3개

### 기존 테이블 목록
- TSR_RNTL_SALE_PRDT_HIST (0개 컬럼)
- TSR_RNTL_SALE_PRDT (0개 컬럼)
- TBS_GNTR_MST (0개 컬럼)
- TSR_RNTL_ORDR_PRDT (0개 컬럼)
- TBS_CLMT_MST_HIST (0개 컬럼)
- TSR_RNTL_ORDR_HIST (0개 컬럼)
- TBS_CLMT_SUM (0개 컬럼)
- TBS_CLMT_TRN (0개 컬럼)
- TBS_CLMT_LOCK_HIST (0개 컬럼)
- TBS_CLMT_MST (0개 컬럼)
- ... 외 8개

### 현재 테이블 목록
- asm
- asm
- asm

**⚠️ 권장**: 15개 테이블 추가 검토 필요

## BIM 모듈
- 기존 테이블: 0개
- 현재 테이블: 0개

**✅ 일치**: 테이블 수 동일

## COM 모듈
- 기존 테이블: 3개
- 현재 테이블: 0개

### 기존 테이블 목록
- TEA_BOARD_MST_READ (0개 컬럼)
- TEA_BOARD_MST (0개 컬럼)
- TEA_BOARD_MST_FILE (0개 컬럼)

**⚠️ 권장**: 3개 테이블 추가 검토 필요

## CSM 모듈
- 기존 테이블: 10개
- 현재 테이블: 0개

### 기존 테이블 목록
- TBS_CUST_MGR (0개 컬럼)
- TBS_CUST_BANK (0개 컬럼)
- TBS_CTRT_MST (0개 컬럼)
- TBS_CUST_MST_HIST (0개 컬럼)
- TBS_CUST_MST (0개 컬럼)
- TBS_CUST_ENG (0개 컬럼)
- TBS_CUST_BIZ (0개 컬럼)
- TBS_CUST_STAF (0개 컬럼)
- TBS_CUST_ADDR (0개 컬럼)
- TBS_CUST_MGR_HIST (0개 컬럼)

**⚠️ 권장**: 10개 테이블 추가 검토 필요

## FIM 모듈
- 기존 테이블: 24개
- 현재 테이블: 0개

### 기존 테이블 목록
- TCO_NSPF_MON (0개 컬럼)
- TBS_CRDT_DAY (0개 컬럼)
- TCO_REBT_PAY (0개 컬럼)
- TCO_VSPF_MON (0개 컬럼)
- TCO_COST_EXT (0개 컬럼)
- TBS_EXCH_MST (0개 컬럼)
- TCO_PLAN_SALE_MON (0개 컬럼)
- TCO_REBT_SUM (0개 컬럼)
- TCO_REBT_RCV (0개 컬럼)
- TBS_CRDT_LVL (0개 컬럼)
- ... 외 14개

**⚠️ 권장**: 24개 테이블 추가 검토 필요

## IVM 모듈
- 기존 테이블: 12개
- 현재 테이블: 2개

### 기존 테이블 목록
- TBS_CTGR_MGR (0개 컬럼)
- TBS_CTGR_MRG_MST (0개 컬럼)
- TBS_PRDT_SNO (0개 컬럼)
- TBS_WHSE_MST (0개 컬럼)
- TBS_PRDT_MST_HIST (0개 컬럼)
- TBS_CTGR_MST (0개 컬럼)
- TBS_PRDT_MST (0개 컬럼)
- TIV_SALE_RSV (0개 컬럼)
- TBS_WHSE_EMP (0개 컬럼)
- TIV_SALE_RSV_EXT (0개 컬럼)
- ... 외 2개

### 현재 테이블 목록
- ivm
- ivm

**⚠️ 권장**: 10개 테이블 추가 검토 필요

## LWM 모듈
- 기존 테이블: 64개
- 현재 테이블: 4개

### 기존 테이블 목록
- TEA_DOC_MST_1011 (0개 컬럼)
- TEA_DOC_MST_1008 (0개 컬럼)
- TEA_DOC_MST_50021 (0개 컬럼)
- TEA_DOC_MST_TMPL (0개 컬럼)
- TEA_DOC_MST_30011 (0개 컬럼)
- TEA_DOC_MST (0개 컬럼)
- TEA_DOC_MST_50011 (0개 컬럼)
- TEA_DOC_MST_5002 (0개 컬럼)
- TEA_DOC_MST_10011 (0개 컬럼)
- TEA_DOC_MST_10062 (0개 컬럼)
- ... 외 54개

### 현재 테이블 목록
- lwm
- lwm
- lwm
- lwm

**⚠️ 권장**: 60개 테이블 추가 검토 필요

## PSM 모듈
- 기존 테이블: 1개
- 현재 테이블: 4개

### 기존 테이블 목록
- TBS_VNDR_MST (0개 컬럼)

### 현재 테이블 목록
- psm
- psm
- psm
- psm

**✅ 양호**: 현재 스키마가 더 많은 테이블 포함

## SRM 모듈
- 기존 테이블: 43개
- 현재 테이블: 4개

### 기존 테이블 목록
- TSD_PROC_MST (0개 컬럼)
- TSD_SALE_MST (0개 컬럼)
- TSD_SALE_RTN (0개 컬럼)
- TSD_SALE_RTN_PRDT (0개 컬럼)
- TSD_SALE_MOD (0개 컬럼)
- TSD_PROC_RCV_PRDT (0개 컬럼)
- TSD_SALE_MOD_PRDT (0개 컬럼)
- TSD_WTHD_MST (0개 컬럼)
- TSD_RENT_MST (0개 컬럼)
- TSD_SALE_RTN_DOA_PURC (0개 컬럼)
- ... 외 33개

### 현재 테이블 목록
- srm
- srm
- srm
- srm

**⚠️ 권장**: 39개 테이블 추가 검토 필요

## SYS 모듈
- 기존 테이블: 19개
- 현재 테이블: 5개

### 기존 테이블 목록
- TSS_VIEW_GRID_BAND (0개 컬럼)
- TSS_ERROR_LOG (0개 컬럼)
- TSS_VIEW_GRID_COLUMN (0개 컬럼)
- TSS_CLSN_MON (0개 컬럼)
- TSS_HELP_GRID (0개 컬럼)
- TSS_DICT_DTL (0개 컬럼)
- TSS_CODE_MST (0개 컬럼)
- TSS_VIEW_GRID (0개 컬럼)
- TSS_HELP_MST (0개 컬럼)
- TBS_HLDY_MST (0개 컬럼)
- ... 외 9개

### 현재 테이블 목록
- sys
- sys
- sys
- sys
- sys_code_rules

**⚠️ 권장**: 14개 테이블 추가 검토 필요

## ⚠️ 매핑되지 않은 테이블 (92개)
- TSD_DPST_MST_BANK
- TIV_STCK_AGE
- TMM_PURC_MST_PRDT
- TIV_STCK_STO_PRDT
- TEA_LINE_MST
- TMM_PURC_RMA
- TMM_PYBL_SUM_DAY
- TIV_STCK_SUM_MON
- TSD_OVRD_DAY
- TSD_OVRD_DAY_HIST
- TEA_SIGN_SET_LINE
- TMP_STCK_SUM
- TFI_TAX_BILL_SALE
- TEA_TEMPLATE
- TSD_DPST_MST_CARD
- TEA_SIGN_MST
- TLE_DWEL_ORD
- TMM_PURC_RTN
- TMM_PURC_FILES
- TFI_CARD_EMP
- ... 외 72개

## 📊 전체 통계
- 기존 테이블 총계: 206개
- 현재 테이블 총계: 39개
- 매핑되지 않은 테이블: 92개