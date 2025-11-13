# APM 스키마 (결재/워크플로우 관리)

## 개요
결재 및 워크플로우 관리 스키마로, 결재선 정의, 결재 요청 및 진행, 결재 이력을 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_approval_lines.sql** - 결재선 정의 테이블
3. **02_approval_line_items.sql** - 결재선 상세 테이블
4. **03_approval_requests.sql** - 결재 요청 테이블
5. **04_approval_histories.sql** - 결재 이력 테이블

## 테이블 상세

### 1. approval_lines (결재선)
결재선 정의 및 템플릿 관리
- 결재선 코드 및 명칭
- 다국어 지원 (name, name_en)
- 문서 유형별 결재선 (PURCHASE_ORDER/EXPENSE_REPORT/LEAVE_REQUEST/GENERAL 등)
- 기본 결재선 지정 가능
- 상태 관리 (ACTIVE/INACTIVE)

### 2. approval_line_items (결재선 상세)
결재선의 결재 단계 및 결재자 정의
- 결재선별 순차적 결재 단계
- 단계별 결재자 지정 (직원 참조)
- 결재 유형 (APPROVAL/REVIEW/NOTIFY/REFERENCE)
- 필수 결재 여부
- 대결자 지정 가능
- 상태 관리

### 3. approval_requests (결재 요청)
결재 요청 마스터 정보 관리
- 결재 요청 번호 자동 생성
- 문서 유형 및 참조
- 기안자 정보
- 결재선 정보 (approval_line_id)
- 현재 결재 단계 추적
- 결재 상태 (DRAFT/PENDING/IN_PROGRESS/APPROVED/REJECTED/CANCELLED/WITHDRAWN)
- 제목 및 내용
- 첨부파일 URL
- 승인/반려 일시
- 상태 관리

### 4. approval_histories (결재 이력)
결재 진행 이력 및 코멘트 관리
- 결재 요청별 단계별 이력
- 결재자 정보
- 결재 액션 (SUBMIT/APPROVE/REJECT/RETURN/CANCEL/WITHDRAW/NOTIFY)
- 결재 일시
- 코멘트 및 첨부파일
- 대결 여부
- 상태 관리

## 외래키 관계

```
approval_line_items (approval_line_id) -> approval_lines (id)  [CASCADE]
approval_line_items (approver_id) -> hrm.employees (id)  [RESTRICT]
approval_line_items (deputy_id) -> hrm.employees (id)  [SET NULL]
approval_requests (approval_line_id) -> approval_lines (id)  [RESTRICT]
approval_requests (requester_id) -> hrm.employees (id)  [RESTRICT]
approval_requests (current_approver_id) -> hrm.employees (id)  [SET NULL]
approval_histories (request_id) -> approval_requests (id)  [CASCADE]
approval_histories (approver_id) -> hrm.employees (id)  [RESTRICT]
```

## 주요 특징

### 결재선 템플릿
- 문서 유형별 결재선 정의
- 기본 결재선 설정 가능
- 결재선 재사용 가능

### 순차 결재
- 단계별 순차적 결재 진행
- 현재 결재 단계 추적
- 결재 유형별 처리 (승인/검토/통보/참조)

### 결재 프로세스
1. **DRAFT**: 기안 작성 중
2. **PENDING**: 제출 대기
3. **IN_PROGRESS**: 결재 진행 중
4. **APPROVED**: 최종 승인
5. **REJECTED**: 반려
6. **CANCELLED**: 취소
7. **WITHDRAWN**: 회수

### 결재 액션
- **SUBMIT**: 제출
- **APPROVE**: 승인
- **REJECT**: 반려
- **RETURN**: 반송
- **CANCEL**: 취소
- **WITHDRAW**: 회수
- **NOTIFY**: 통보

### 대결 기능
- 결재자 부재 시 대결자 지정 가능
- 대결 이력 추적

### 이력 관리
- 모든 결재 단계별 이력 기록
- 코멘트 및 첨부파일 관리
- 결재 일시 추적

## DDL 작성 표준
모든 파일은 `/docs/prompts/ddl_standard_prompt.md`의 표준을 따릅니다:

- ✅ 표준 컬럼 형식 (id, created_at, created_by, updated_at, updated_by)
- ✅ 짧은 네이밍 규칙 (code, name, name_en)
- ✅ 줄 주석 및 정렬
- ✅ COMMENT ON 문 작성
- ✅ 인덱스 및 제약조건 주석
- ✅ 외래키 제약조건 및 삭제 옵션

## 작성 이력
- 2025-01-20: 초기 작성
- 2025-10-22: 표준 형식 적용 및 테이블 분리
