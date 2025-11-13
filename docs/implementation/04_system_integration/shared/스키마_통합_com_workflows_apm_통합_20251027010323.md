# 스키마 통합: com.workflows → apm 스키마로 통합

**날짜**: 2025-10-27 01:03:23 KST
**작성자**: Claude (GitHub Copilot CLI)
**유형**: 리팩토링 | 아키텍처 개선
**컴포넌트**: `packages/database/schemas/tenants/06_apm`, `packages/database/schemas/tenants/21_com`

## 개요

전자결재 워크플로우 관리 기능이 `apm` 스키마와 `com` 스키마에 중복 분산되어 있던 문제를 해결하기 위해 `com.workflows`를 삭제하고 `apm` 스키마로 통합했습니다.

## 식별된 문제점

### 1. 스키마 역할 중복
- **apm 스키마**: "결재 및 워크플로우 관리"
- **com 스키마**: "공통 관리 스키마 (코드그룹, 공통코드, **워크플로우**)"
- 결재 워크플로우 기능이 두 스키마에 걸쳐 분산됨

### 2. 테이블 기능 중복
- `apm.approval_lines`: 결재선 정의 (결재자, 순서)
- `com.workflows`: 워크플로우 정의 (모듈, 문서타입, 금액조건, 에스컬레이션)
- 두 테이블 모두 결재 워크플로우를 정의하지만 역할이 불명확

### 3. 설계 일관성 부족
- 결재 프로세스가 두 스키마에 걸쳐 있어 데이터 흐름이 복잡함
- `com.workflows`는 정의만 있고 실제 결재 처리는 `apm`에 있음
- 개발자가 어느 테이블을 사용해야 할지 혼란

## 변경 내용

### 1. com.workflows 관련 파일 삭제
```bash
packages/database/schemas/tenants/21_com/
├── 03_workflows.sql (삭제)
└── 04_workflows_add_module_fk.sql (삭제)
```

### 2. com 스키마 설명 업데이트
**파일**: `21_com/00_schema.sql`

```sql
-- 변경 전
COMMENT ON SCHEMA com IS 'COM: 공통 관리 스키마 (코드그룹, 공통코드, 워크플로우)';

-- 변경 후
COMMENT ON SCHEMA com IS 'COM: 공통 관리 스키마 (코드그룹, 공통코드)';
```

### 3. apm 스키마에 워크플로우 설정 테이블 추가
**신규 파일**: `06_apm/05_approval_workflow_configs.sql`

```sql
CREATE TABLE IF NOT EXISTS apm.approval_workflow_configs
(
    id                      UUID PRIMARY KEY,
    line_id                 UUID NOT NULL,              -- 결재선 참조
    module_code             VARCHAR(50) NOT NULL,       -- 모듈 코드 (PSM, SRM, FIM 등)
    
    -- 우선순위 및 기본 설정
    version                 INTEGER DEFAULT 1,
    is_default              BOOLEAN DEFAULT false,
    priority                INTEGER DEFAULT 0,
    
    -- 조건 설정 (com.workflows에서 가져온 기능)
    condition_rule          JSONB,
    min_amount              NUMERIC(18,4),
    max_amount              NUMERIC(18,4),
    
    -- 알림 설정 (com.workflows에서 가져온 기능)
    is_notification_enabled BOOLEAN DEFAULT true,
    escalation_enabled      BOOLEAN DEFAULT false,
    escalation_hours        INTEGER,
    
    notes                   TEXT,
    is_active               BOOLEAN DEFAULT true,
    is_deleted              BOOLEAN DEFAULT false,
    
    CONSTRAINT fk_approval_workflow_configs__line_id
        FOREIGN KEY (line_id) 
        REFERENCES apm.approval_lines(id) 
        ON DELETE CASCADE
);
```

### 4. apm 스키마 설명 업데이트
**파일**: `06_apm/00_schema.sql`

```sql
-- 변경 전
COMMENT ON SCHEMA apm IS 'APM: 결재/워크플로우 관리 스키마 (결재선, 결재진행, 문서)';

-- 변경 후
COMMENT ON SCHEMA apm IS 'APM: 전자결재 관리 스키마 (결재선, 결재진행, 워크플로우 설정)';
```

## 통합 후 아키텍처

### apm 스키마 (전자결재 전용)
```
06_apm/
├── approval_lines              - 결재선 정의 (어떤 결재선인가?)
├── approval_line_items         - 결재자 정의 (누가 결재하는가?)
├── approval_requests           - 결재 요청/진행 (실제 결재 진행)
├── approval_histories          - 결재 이력 (결재 기록)
└── approval_workflow_configs   - 워크플로우 설정 (조건, 에스컬레이션 등)
```

### lwm 스키마 (범용 워크플로우)
```
16_lwm/
├── workflows                   - 범용 워크플로우 엔진 (프로세스 자동화)
├── steps                       - 워크플로우 단계
└── tasks                       - 작업 정의
```

### com 스키마 (공통 코드 관리)
```
21_com/
├── code_groups                 - 코드 그룹
└── codes                       - 공통 코드
```

## 데이터 관계

```
apm.approval_lines (결재선)
    ↓
apm.approval_workflow_configs (워크플로우 설정)
    - 모듈별 설정 (PSM, SRM, FIM 등)
    - 금액 조건 (min_amount, max_amount)
    - 에스컬레이션 설정
    ↓
apm.approval_line_items (결재자)
    ↓
apm.approval_requests (결재 진행)
    ↓
apm.approval_histories (결재 이력)
```

## 변경된 파일 목록

### 삭제된 파일
- `packages/database/schemas/tenants/21_com/03_workflows.sql`
- `packages/database/schemas/tenants/21_com/04_workflows_add_module_fk.sql`

### 수정된 파일
- `packages/database/schemas/tenants/21_com/00_schema.sql`
- `packages/database/schemas/tenants/06_apm/00_schema.sql`
- `packages/database/schemas/tenants/06_apm/01_approval_lines.sql`

### 추가된 파일
- `packages/database/schemas/tenants/06_apm/05_approval_workflow_configs.sql`

## 마이그레이션 가이드

### 기존 com.workflows 데이터 마이그레이션 (필요 시)

```sql
-- 1. approval_workflow_configs로 데이터 이동
INSERT INTO apm.approval_workflow_configs (
    line_id,
    module_code,
    version,
    is_default,
    priority,
    condition_rule,
    min_amount,
    max_amount,
    is_notification_enabled,
    escalation_enabled,
    escalation_hours,
    notes,
    is_active,
    created_at,
    created_by
)
SELECT 
    al.id,                          -- line_id (approval_lines와 매핑 필요)
    cw.module_code,
    cw.version,
    cw.is_default,
    cw.priority,
    cw.condition_rule,
    cw.min_amount,
    cw.max_amount,
    cw.is_notification_enabled,
    cw.escalation_enabled,
    cw.escalation_hours,
    cw.notes,
    cw.is_active,
    cw.created_at,
    cw.created_by
FROM com.workflows cw
JOIN apm.approval_lines al 
    ON al.document_type = cw.document_type;

-- 2. com.workflows 테이블 삭제
DROP TABLE IF EXISTS com.workflows CASCADE;
```

## 이점

1. **명확한 도메인 분리**
   - APM: 전자결재 전용
   - LWM: 범용 워크플로우 자동화
   - COM: 공통 코드 관리

2. **데이터 일관성 향상**
   - 결재 관련 모든 데이터가 apm 스키마에 집중
   - 외래키 관계가 단일 스키마 내에서 관리됨

3. **유지보수성 개선**
   - 결재 기능 개발/수정 시 apm 스키마만 확인
   - 워크플로우 중복 제거로 혼란 방지

4. **확장성 향상**
   - approval_workflow_configs를 통한 유연한 설정 관리
   - 모듈별 독립적인 설정 가능

## 향후 개선사항

1. **approval_workflow_configs 기능 확장**
   - 시간대별 결재선 자동 변경
   - 부재중 대결자 자동 지정
   - 결재 권한 위임 관리

2. **lwm.workflows 연동**
   - 필요 시 apm.approval_requests가 lwm.workflows를 참조하도록 확장
   - 복잡한 비즈니스 프로세스 자동화 지원

3. **알림 시스템 통합**
   - approval_workflow_configs의 알림 설정 활용
   - 실시간 결재 알림 시스템 구축

## 참고사항

- 기존 시스템에 `com.workflows` 데이터가 있다면 위 마이그레이션 스크립트 실행 필요
- 백엔드 API의 `models/tenant/com/` 폴더에서 workflows 관련 모델 제거 필요
- 프론트엔드에서 `com.workflows` 참조하는 코드 확인 및 수정 필요
