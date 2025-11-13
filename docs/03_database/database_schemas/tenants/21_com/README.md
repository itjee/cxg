# COM 스키마 (공통 관리)

## 개요
공통 관리 스키마로, 코드 그룹, 공통 코드, 워크플로우 정의를 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_code_groups.sql** - 코드 그룹 테이블
3. **02_codes.sql** - 공통 코드 테이블
4. **03_workflows.sql** - 워크플로우 테이블

## 테이블 상세

### 1. code_groups (코드 그룹)
공통 코드의 그룹(카테고리) 정의
- 그룹 코드 (group_code)
- 그룹명
  - 한글명 (group_name)
  - 영문명 (group_name_en)
- 설명
- 사용 여부 (is_enabled)
- 시스템 코드 여부 (is_system)
  - true: 시스템 필수 코드 (수정/삭제 불가)
  - false: 사용자 정의 코드
- 정렬 순서
- 상태 관리

**주요 코드 그룹 예시:**
- USER_STATUS: 사용자 상태
- APPROVAL_STATUS: 결재 상태
- ORDER_STATUS: 주문 상태
- PAYMENT_METHOD: 결제 수단
- SHIPPING_STATUS: 배송 상태
- PRODUCT_STATUS: 제품 상태
- CONTACT_TYPE: 연락처 유형
- ADDRESS_TYPE: 주소 유형

### 2. codes (공통 코드)
공통 코드 상세 정의
- 코드 그룹 참조 (group_code)
- 코드 값 (code_value)
- 코드명
  - 한글명 (code_name)
  - 영문명 (code_name_en)
- 코드 속성
  - 약어 (code_abbr)
  - 추가 값 1~5 (attr_value1~5)
- 설명
- 사용 여부 (is_enabled)
- 기본값 여부 (is_default)
- 시스템 코드 여부 (is_system)
- 정렬 순서
- 상태 관리

**코드 사용 예시:**
```
그룹: PAYMENT_METHOD
- CASH: 현금
- CARD: 신용카드
- BANK: 계좌이체
- CHECK: 수표
```

### 3. workflows (워크플로우)
워크플로우 정의 및 프로세스 관리
- 워크플로우 코드 및 명칭
- 다국어 지원 (name, name_en)
- 워크플로우 유형
  - 문서 유형 (document_type)
  - 프로세스 유형 (process_type)
- 워크플로우 설정
  - 시작 조건 (start_conditions)
  - 종료 조건 (end_conditions)
  - 자동 시작 여부 (is_auto_start)
- 단계 정의 (JSON)
  - 단계 목록 (steps)
  - 각 단계별 설정
- 규칙 정의 (JSON)
  - 분기 규칙 (rules)
  - 조건부 라우팅
- 알림 설정 (JSON)
  - 알림 대상
  - 알림 시점
- 시간 제한
  - 제한 시간 (time_limit_hours)
  - 에스컬레이션 설정
- 버전 관리
  - 버전 (version)
  - 최신 버전 여부 (is_latest)
  - 활성 버전 여부 (is_active)
- 상태 관리

## 외래키 관계

```
codes (group_code) -> code_groups (group_code)  [CASCADE]
```

## 주요 특징

### 코드 관리
**계층 구조:**
- 코드 그룹 (code_groups): 상위 카테고리
- 공통 코드 (codes): 실제 코드 값

**시스템 코드:**
- is_system = true: 시스템 필수 코드
  - 수정/삭제 불가
  - 애플리케이션 로직에서 사용
- is_system = false: 사용자 정의 코드
  - 자유롭게 추가/수정/삭제 가능

**다국어 지원:**
- 한글명과 영문명 제공
- 다국어 확장 가능

**추가 속성:**
- attr_value1~5: 코드별 추가 속성 저장
- 유연한 확장성

### 워크플로우 관리
**워크플로우 구성 요소:**
1. **시작 조건**: 워크플로우 시작 조건
2. **단계(Steps)**: 프로세스 진행 단계
3. **규칙(Rules)**: 분기 및 라우팅 규칙
4. **종료 조건**: 워크플로우 종료 조건

**단계 정의 예시(JSON):**
```json
{
  "steps": [
    {
      "step_no": 1,
      "step_name": "작성",
      "step_type": "DRAFT",
      "required": true
    },
    {
      "step_no": 2,
      "step_name": "팀장 승인",
      "step_type": "APPROVAL",
      "approver_role": "TEAM_MANAGER",
      "required": true
    },
    {
      "step_no": 3,
      "step_name": "부서장 승인",
      "step_type": "APPROVAL",
      "approver_role": "DEPARTMENT_MANAGER",
      "required": true
    }
  ]
}
```

**규칙 정의 예시(JSON):**
```json
{
  "rules": [
    {
      "condition": "amount > 1000000",
      "action": "require_ceo_approval"
    },
    {
      "condition": "priority == 'URGENT'",
      "action": "skip_team_manager"
    }
  ]
}
```

**알림 설정 예시(JSON):**
```json
{
  "notifications": [
    {
      "event": "step_start",
      "recipients": ["approver", "requester"],
      "channels": ["email", "system"]
    },
    {
      "event": "overdue",
      "recipients": ["approver", "manager"],
      "channels": ["email", "sms"]
    }
  ]
}
```

### 버전 관리
- version: 워크플로우 버전 번호
- is_latest: 최신 버전 여부
- is_active: 활성화 여부 (실제 사용 중인 버전)

**버전 관리 시나리오:**
1. 새 버전 생성 시: version++, is_latest=true
2. 이전 버전: is_latest=false
3. 활성화 시: is_active=true (하나만 가능)

## 사용 예시

### 공통 코드 조회
```sql
-- 결제 수단 코드 조회
SELECT code_value, code_name, code_name_en
FROM com.codes
WHERE group_code = 'PAYMENT_METHOD'
  AND is_enabled = true
  AND is_deleted = false
ORDER BY sort_order;
```

### 기본값 코드 조회
```sql
-- 그룹별 기본 코드 조회
SELECT group_code, code_value, code_name
FROM com.codes
WHERE is_default = true
  AND is_enabled = true
  AND is_deleted = false;
```

### 활성 워크플로우 조회
```sql
-- 문서 유형별 활성 워크플로우
SELECT code, name, version, steps
FROM com.workflows
WHERE document_type = 'PURCHASE_ORDER'
  AND is_active = true
  AND is_deleted = false;
```

### 워크플로우 버전 관리
```sql
-- 특정 워크플로우의 모든 버전 조회
SELECT code, version, is_latest, is_active, created_at
FROM com.workflows
WHERE code = 'PO_APPROVAL'
  AND is_deleted = false
ORDER BY version DESC;
```

## 코드 관리 모범 사례

### 코드 네이밍 규칙
- 그룹 코드: 대문자 영문, 언더스코어 사용
  - 예: USER_STATUS, PAYMENT_METHOD
- 코드 값: 대문자 영문, 언더스코어 사용
  - 예: ACTIVE, PENDING, IN_PROGRESS

### 시스템 코드 보호
- 시스템 필수 코드는 is_system=true 설정
- 애플리케이션에서 수정/삭제 방지 로직 구현

### 다국어 지원
- 모든 코드에 한글명/영문명 제공
- 필요시 추가 언어 테이블 생성

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
- 2025-10-23: DDL 표준 프롬프트 기준 적용
