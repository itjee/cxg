# HRM 스키마 (인사관리)

## 개요
인사관리 스키마로, 조직/부서 구조, 사원 정보, 인사 발령 이력 등을 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_departments.sql** - 조직/부서 정보 테이블
3. **02_employees.sql** - 사원 기본 정보 테이블
4. **03_department_histories.sql** - 조직 개편 이력 테이블
5. **04_employee_histories.sql** - 인사 발령 이력 테이블

## 테이블 상세

### 1. departments (조직/부서)
회사 조직도 및 부서 계층 구조 관리
- 계층 구조 지원 (parent_id, level)
- 부서 유형 분류 (COMPANY/DIVISION/DEPARTMENT/TEAM)
- 부서장 관리 (manager_id)
- 원가센터 연계 (cost_center_code)
- 위치 정보 (location, floor)
- 상태 관리 (ACTIVE/INACTIVE/CLOSED)

### 2. employees (사원)
임직원 인사정보 및 재직 이력 관리
- 개인 정보 (생년월일, 성별, 국적, 주민등록번호)
- 다국어 이름 (name, name_en, name_cn)
- 연락처 정보 (phone, mobile, email, 비상연락처)
- 주소 정보
- 조직/직무 정보 (부서, 직책, 직급)
- 근무 정보 (근무지, 근무형태, 고용형태)
- 입퇴사 정보 (입사일, 수습종료일, 퇴사일)
- 급여 정보 (급여유형, 기본급, 통화코드)
- 재직 상태 (ACTIVE/PROBATION/LEAVE/TERMINATED/RETIRED)

### 3. department_histories (조직 개편 이력)
부서 변경 이력 관리
- 변경 유형 (RENAME/REORGANIZE/MANAGER_CHANGE/TYPE_CHANGE/PARENT_CHANGE/MERGE/SPLIT/CLOSE/REOPEN)
- 발령일/시행일 관리
- 변경 전후 데이터 추적 (코드, 명칭, 유형, 상위부서, 부서장)
- 문서 관리 (발령번호, 발령문서, 첨부파일)
- 승인 프로세스 (승인자, 승인일시)
- 상태 관리 (PENDING/APPROVED/REJECTED/CANCELLED)

### 4. employee_histories (인사 발령 이력)
사원 인사 변경 이력 관리
- 발령 유형 (HIRE/TRANSFER/PROMOTION/DEMOTION/POSITION_CHANGE/LOCATION_CHANGE/WORK_TYPE_CHANGE/EMPLOYMENT_TYPE_CHANGE/SALARY_CHANGE/LEAVE/RETURN/TERMINATE/RETIRE)
- 발령일/시행일 관리
- 변경 전후 데이터 추적
  - 조직: 부서
  - 직급/직책: 직급, 직책
  - 근무: 근무지, 근무형태, 고용형태
  - 급여: 급여유형, 기본급
  - 상태: 재직상태
- 문서 관리 (발령번호, 발령문서, 첨부파일)
- 승인 프로세스 (승인자, 승인일시)
- 상태 관리 (PENDING/APPROVED/REJECTED/CANCELLED)

## 외래키 관계

```
departments (parent_id) -> departments (id)  [자기 참조, CASCADE]
departments (manager_id) -> employees (id)  [SET NULL]
employees (department_id) -> departments (id)  [SET NULL]
employees (currency_code) -> adm.currencies (code)  [RESTRICT]
department_histories (department_id) -> departments (id)  [CASCADE]
department_histories (old_parent_id) -> departments (id)  [SET NULL]
department_histories (new_parent_id) -> departments (id)  [SET NULL]
department_histories (old_manager_id) -> employees (id)  [SET NULL]
department_histories (new_manager_id) -> employees (id)  [SET NULL]
employee_histories (employee_id) -> employees (id)  [CASCADE]
employee_histories (old_department_id) -> departments (id)  [SET NULL]
employee_histories (new_department_id) -> departments (id)  [SET NULL]
```

## 주요 특징

### 계층 구조
- departments: 자기 참조를 통한 조직 계층 구조
- level 필드로 계층 깊이 관리

### 순환 참조 해결
- departments와 employees 간 순환 참조 존재
  - departments.manager_id -> employees.id
  - employees.department_id -> departments.id
- 외래키 제약조건은 나중에 추가하여 순환 참조 문제 해결

### 이력 관리
- 부서와 사원의 모든 변경 이력 추적
- 발령일/시행일 분리로 정확한 시점 관리
- 변경 전후 데이터 비교 가능

### 승인 프로세스
- 조직 개편 및 인사 발령에 대한 승인 워크플로 지원
- 상태 관리를 통한 프로세스 추적

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
- 2025-01-22: 표준 형식 적용 및 테이블 분리

### 5. salary_structures (급여 구조)
직위/부서별 급여 체계 정의
- 급여 구조 코드 및 명칭
- 적용 대상 (직위, 부서, 고용형태)
- 기본급 및 통화
- 지급 주기 (일급/주급/월급/연봉)
- 유효 기간

### 6. payroll_records (급여 내역)
사원별 월별 급여 계산 및 지급
- 급여 번호, 지급일, 귀속월
- 사원 정보 (스냅샷)
- 근무 정보 (근무일수, 시간)
- 지급 항목
  - 기본급, 각종 수당
  - 총 지급액
- 공제 항목
  - 4대보험, 세금
  - 총 공제액
- 실 지급액
- 지급 방법 및 상태
- 분개 연결

### 7. attendances (근태)
사원별 출퇴근 및 근무 시간 관리
- 근태 일자 및 유형
- 출퇴근 시간
- 계산된 근무시간
  - 근무시간, 초과근무, 야간근무
- 지각/조퇴 시간
- 휴게 시간
- 상태 관리

## 급여 처리 프로세스

### 월별 급여 계산
```
1. 근태 집계 (attendances)
   ↓
2. 급여 계산 (payroll_records)
   - 기본급 + 수당 계산
   - 공제액 계산
   - 실지급액 산정
   ↓
3. 급여 승인
   ↓
4. 업무전표 생성 (fim.business_documents)
   - document_type: 'PAYROLL'
   ↓
5. 분개 생성 (fim.journal_entries)
   차변: 급여(비용)
   대변: 미지급금/예수금
   ↓
6. 급여 지급 처리
   ↓
7. 지급 분개 생성
   차변: 미지급금
   대변: 현금/예금
```
