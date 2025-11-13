# 사용자·역할·권한 관리 아키텍처 분석 및 개선안

**작성일**: 2024-10-26
**상태**: 분석 완료 및 개선안 제시
**범위**: Manager DB + Tenants DB의 IDAM/TNNT/SYS 스키마
**담당자**: 아키텍처 검토 필요

---

## 📌 Executive Summary

ConexGrow는 **이중 데이터베이스 구조**에서 **두 가지 권한 시스템**을 병행 운영 중입니다:

1. **Manager DB (IDAM)**: 운영자 및 플랫폼 관리자 권한
2. **Tenants DB (SYS)**: 테넌트 직원 및 비즈니스 권한

현재 구조는 기본적으로 **적절히 분리**되어 있으나, **일부 설계 문제**와 **운영 편의성 부족**이 있습니다.

### 현재 상태: ⚠️ 기능함 (Functional but Need Improvement)

✅ **잘된 점:**
- 운영자 vs 테넌트 사용자 물리적 분리
- 계층적 역할 모델 (Manager DB)
- 완전한 감사 추적 (대부분)
- SSO, MFA, API Key 관리 (Manager DB)

❌ **문제점:**
- 테넌트 세션 관리 부재
- 권한 변경 감사 로그 불완전
- 크로스 DB 무결성 보장 없음
- 권한 정책 문서화 부재
- 테넌트 사용자 임시 권한 할당 불가

---

## 🏗️ 현재 아키텍처 분석

### 1. Manager DB (IDAM/TNNT) - 운영자 권한 관리

#### 테이블 구조
```
Manager DB
├── IDAM Schema (사용자/권한/세션)
│   ├── users         (운영자 계정, user_type: MASTER|SYSTEM)
│   ├── roles         (역할 정의, role_type: SYSTEM|PLATFORM|ADMIN|...)
│   ├── permissions   (권한 카탈로그, category: tenant|system|billing|...)
│   ├── role_permissions    (역할-권한 매핑, FK: CASCADE)
│   ├── user_roles         (사용자-역할 매핑, scope: GLOBAL|TENANT)
│   ├── sessions           (세션 관리)
│   ├── api_keys           (API 키)
│   └── login_logs         (감사 로그)
│
└── TNNT Schema (테넌트 메타)
    ├── tenants           (테넌트 정보)
    ├── tenant_users      (사용자-테넌트 연결, is_admin 포함)
    └── tenant_roles      (역할 커스터마이징, optional)
```

#### 권한 모델: RBAC + Context-aware
```
운영자 → [user_roles: GLOBAL/TENANT] → [roles] → [role_permissions] → [permissions]
                ↑
         tenant_context (NULL = 모든 테넌트)
                       (UUID = 특정 테넌트)
```

**특징:**
- `idam.user_roles.scope`: GLOBAL (모든 테넌트) 또는 TENANT (특정 테넌트)
- `idam.user_roles.tenant_context`: NULL(전체) 또는 UUID(특정)
- `idam.user_roles.expires_at`: 임시 역할 지원 (만료일)
- `idam.permissions.applies_to`: ALL | MASTER | TENANT | SYSTEM
- `tnnt.tenant_users.is_admin`: 테넌트 관리자 추가 권한

---

### 2. Tenants DB (SYS) - 테넌트 비즈니스 권한 관리

#### 테이블 구조
```
Tenants DB (테넌트별 독립)
└── SYS Schema (시스템 설정)
    ├── users            (테넌트 직원, tenant_id로 격리)
    ├── roles            (테넌트 역할, tenant_id로 격리, is_system)
    ├── permissions      (테넌트 권한, module_code enum)
    ├── role_permissions (역할-권한 매핑, FK: CASCADE)
    ├── modules          (모듈 정의)
    └── tenant_modules   (모듈 커스터마이징)
```

#### 권한 모델: Module-based RBAC
```
테넌트 사용자 → [role_id] → [sys.roles] → [sys.role_permissions] → [sys.permissions]
                                                                        (module:resource:action)
```

**특징:**
- `sys.users.role_id`: 기본 역할 (단일)
- `sys.roles.tenant_id`: 테넌트별 완전 격리
- `sys.roles.is_system`: 시스템 기본 역할 (보호됨)
- `sys.permissions.module_code`: enum (ADM, PSM, SRM, IVM, LWM, CSM, ASM, FIM, BIM, COM, SYS)
- `sys.permissions.action`: CREATE | READ | UPDATE | DELETE | APPROVE | REJECT | EXPORT | IMPORT | EXECUTE

---

### 3. 권한 결정 흐름 비교

#### Manager DB (운영자)
```
1. 사용자 인증
   ↓
2. idam.sessions 생성
   ↓
3. 권한 계산
   ├─ idam.user_roles 조회 (user_id)
   │  └─ scope + tenant_context 확인
   │     ├─ GLOBAL: 모든 테넌트 권한
   │     └─ TENANT: 특정 테넌트만
   │
   ├─ idam.role_permissions 조회 (role_id들)
   │  └─ permission_code 수집
   │
   └─ permission.applies_to 확인
      ├─ ALL: 모든 사용자
      ├─ MASTER: 운영자만
      ├─ TENANT: 테넌트 사용자용 (미사용)
      └─ SYSTEM: 시스템 전용
   ↓
4. 권한 세트 캐시 (메모리 또는 Redis)
   ↓
5. API 호출 시 권한 검증
```

#### Tenants DB (테넌트 사용자)
```
1. 사용자 인증 (tenant_id 격리)
   ↓
2. 세션 생성 ❌ (없음!)
   ↓
3. 권한 계산
   ├─ sys.users.role_id 조회
   │  └─ 기본 역할 (단일)
   │
   ├─ sys.role_permissions 조회 (role_id)
   │  └─ permission_code 수집
   │
   └─ 권한 세트 생성
   ↓
4. API 호출 시 권한 검증 (모듈별)
```

---

## ⚠️ 설계상의 문제점 분석

### 문제 1️⃣: 테넌트 사용자 세션 관리 부재

**현황:**
```
Manager DB:
✅ idam.sessions 테이블 존재
  - session_id, user_id, expires_at
  - fingerprint, ip_address, country_code
  - mfa_verified, mfa_verified_at
  - 완전한 세션 추적

Tenants DB:
❌ sys.sessions 없음
  - 로그인 추적 불가
  - 동시 세션 제한 불가
  - 보안 모니터링 불가
```

**위험도**: 🔴 **HIGH**

**영향:**
- 불법 접근 추적 불가
- DDoS 공격 탐지 불가
- 동시 로그인 제한 불가
- 감사 대시보드 구성 불가

**권장 조정:**

```sql
-- 추가 필요: sys.sessions 테이블
CREATE TABLE sys.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,  -- 테넌트 격리
    user_id UUID NOT NULL,    -- FK: sys.users

    session_id VARCHAR(255) NOT NULL UNIQUE,
    session_token_hash VARCHAR(255),  -- 보안상 해시 저장

    -- 세션 메타데이터
    device_type VARCHAR(50),  -- WEB, MOBILE, API
    device_name VARCHAR(255),
    browser VARCHAR(100),
    ip_address INET,
    country_code CHAR(2),
    city VARCHAR(100),

    -- 세션 라이프사이클
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- 상태
    status VARCHAR(20) DEFAULT 'ACTIVE',  -- ACTIVE, EXPIRED, REVOKED

    -- 외래키
    CONSTRAINT fk_sessions_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,

    -- 인덱스
    CONSTRAINT ix_sessions_user_id ON (user_id)
        WHERE status = 'ACTIVE',
    CONSTRAINT ix_sessions_expires_at ON (expires_at)
        WHERE status = 'ACTIVE'
);

COMMENT ON TABLE sys.sessions IS '테넌트 사용자 세션 관리';
```

---

### 문제 2️⃣: 권한 변경 감사 로그 불완전

**현황:**
```
Manager DB:
✅ idam.user_roles: granted_at, granted_by 기록
✅ idam.role_permissions: granted_at, granted_by 기록
❌ 변경/제거 이력 없음

Tenants DB:
✅ sys.users: created_by, updated_by 기록
✅ sys.roles: created_by, updated_by 기록
❌ role_permissions 변경 이력 없음
❌ user role 할당 이력 없음
```

**위험도**: 🟠 **MEDIUM**

**영향:**
- "언제 누가 권한을 줬나" 조회 불가
- "언제 누가 권한을 뺐나" 조회 불가
- 권한 정책 변경 추적 불가
- 컴플라이언스 요구사항 미충족

**권장 조정:**

```sql
-- 추가 필요: sys.user_roles 테이블 (현재 sys.users.role_id만 있음)
CREATE TABLE sys.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,

    -- 할당 정보
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID,  -- 누가 할당했나

    -- 만료 정보 (임시 역할)
    expires_at TIMESTAMP WITH TIME ZONE,

    -- 상태
    is_active BOOLEAN DEFAULT TRUE,

    -- 감사
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID,
    revoke_reason TEXT,

    -- 외래키
    CONSTRAINT fk_user_roles_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id)
        REFERENCES roles(id) ON DELETE CASCADE,

    -- 유니크
    CONSTRAINT uk_user_roles_tenant_user_role
        UNIQUE (tenant_id, user_id, role_id),

    -- 인덱스
    CONSTRAINT ix_user_roles_user ON (user_id),
    CONSTRAINT ix_user_roles_role ON (role_id)
);

COMMENT ON TABLE sys.user_roles IS '테넌트 사용자-역할 매핑 (감시 포함)';
```

또한 `sys.role_permissions_history` 추가:

```sql
-- 추가 필요: sys.role_permissions_history (변경 이력)
CREATE TABLE sys.role_permissions_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,

    -- 변경 유형
    action VARCHAR(20),  -- GRANTED, REVOKED

    -- 변경자
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by UUID,

    -- 이유
    reason TEXT,

    -- 외래키
    CONSTRAINT fk_rp_history_tenant FOREIGN KEY (tenant_id)
        REFERENCES tenants(id) ON DELETE CASCADE,

    -- 인덱스
    CONSTRAINT ix_rp_history_role ON (role_id, changed_at)
);

COMMENT ON TABLE sys.role_permissions_history
    IS '역할의 권한 변경 이력 (감시/감사용)';
```

---

### 문제 3️⃣: 운영자 vs 테넌트 사용자 관리의 혼재

**현황:**
```
Manager DB - idam.users:
├── user_type: 'MASTER' → 운영자 ✅
├── user_type: 'TENANT' → 테넌트 사용자? (legacy, 미사용) ⚠️
├── user_type: 'SYSTEM' → 시스템 계정 ✅
│
└─ 현재 문제:
   - TENANT 타입이 있지만 실제로는 사용 안 함
   - 테넌트 사용자는 Tenants DB의 sys.users에서만 관리
   - 코드상 혼란 야기

Tenants DB - sys.users:
└─ 테넌트 직원들만 관리 ✅
```

**위험도**: 🟡 **MEDIUM-LOW**

**영향:**
- 코드 복잡도 증가
- 잘못된 역할 할당 가능성
- 문서화 부재로 개발자 혼란

**권장 조정:**

```sql
-- Manager DB - idam.users 수정
-- user_type에서 'TENANT' 제거 (deprecated)

ALTER TABLE idam.users
DROP CONSTRAINT ck_users__user_type;

ALTER TABLE idam.users
ADD CONSTRAINT ck_users__user_type
    CHECK (user_type IN ('MASTER', 'SYSTEM'));

-- 마이그레이션: 기존 TENANT 타입 제거
UPDATE idam.users SET user_type = 'SYSTEM'
WHERE user_type = 'TENANT' AND created_at < '2024-01-01';

-- 주석으로 명확히 함
COMMENT ON COLUMN idam.users.user_type IS
'사용자 타입:
- MASTER: ConexGrow 플랫폼 운영자 (관리자)
- SYSTEM: 시스템 자동화 계정
테넌트 직원은 Tenants DB의 sys.users에서만 관리';
```

---

### 문제 4️⃣: 크로스 DB 무결성 보장 없음

**현황:**
```
Manager DB (tnnt.tenants) ────┐
                              ├─ 물리적 외래키 없음 (다른 DB)
                              │  논리적 참조만 있음
Tenants DB (sys.users) ◄──────┘

위험 시나리오:
1. Manager에서 테넌트 삭제
   → Tenants DB의 sys.users는 고아 레코드 (orphaned)

2. 테넌트 Rename
   → Tenants DB 스키마 메타데이터는 미갱신
```

**위험도**: 🔴 **HIGH**

**영향:**
- 데이터 불일치 가능성
- 마이그레이션/복제 문제
- 감사 추적 불가능

**권장 조정:**

```python
# 1. 애플리케이션 레벨 무결성 검증
# /apps/backend-api/src/services/manager/tenant_service.py

class TenantDeletionService:
    """
    테넌트 삭제 시 크로스 DB 무결성 보장
    """

    async def delete_tenant(self, tenant_id: UUID):
        """테넌트 삭제 (Tenants DB 정정 포함)"""

        async with manager_db.transaction():
            # 1. Manager DB에서 테넌트 조회
            tenant = await tnnt.tenants.get(id=tenant_id)
            if not tenant:
                raise NotFound()

            # 2. 해당 Tenants DB 존재 확인
            tenant_db = get_tenant_db(tenant.tenant_code)

            async with tenant_db.transaction():
                # 3. Tenants DB 정정
                await tenant_db.sys.users.delete_all(
                    where={'deleted': False}
                )
                await tenant_db.sys.roles.delete_all()
                # ... 나머지 테이블들

            # 4. Manager DB 삭제
            await tnnt.tenants.delete(id=tenant_id)

            # 5. 감시 로그
            logger.info(f"Tenant {tenant.tenant_code} deleted with cascade")
```

```python
# 2. 정기적 무결성 검사 배치
# /apps/backend-api/src/tasks/integrity_check.py

class CrossDBIntegrityCheck:
    """매일 00:00 실행"""

    async def check_orphaned_tenants(self):
        """고아 테넌트 검사"""

        # 1. Tenants DB 목록
        tenant_dbs = await list_all_tenant_databases()

        # 2. Manager DB 테넌트 목록
        manager_tenants = await tnnt.tenants.filter(deleted=False)
        manager_codes = {t.tenant_code for t in manager_tenants}

        # 3. 불일치 확인
        orphaned = set(tenant_dbs) - manager_codes

        if orphaned:
            logger.error(f"Orphaned tenant DBs: {orphaned}")
            # 알림 또는 자동 정정
```

---

### 문제 5️⃣: 테넌트 사용자 임시 권한 할당 불가

**현황:**
```
Manager DB - idam.user_roles:
✅ expires_at: 임시 역할 지원 가능
   예: 3개월 한정으로 '보고서 승인' 권한 부여

Tenants DB - sys.users:
❌ role_id: 단순 FK (expires_at 없음)
   테넌트 사용자는 항상 해당 역할 유지
   임시 권한 할당 불가능
```

**위험도**: 🟡 **MEDIUM**

**영향:**
- 임시 위임 불가 (예: 부서장 휴가 중 권한 위임)
- 교육 목적 임시 권한 불가
- 계절 권한 (예: 년말 결산 권한) 불가

**권장 조정:**

```sql
-- Tenants DB - sys.user_roles 추가
-- (문제 2에서 추가한 테이블에 이미 포함)

-- sys.user_roles에 expires_at 추가
-- 이를 통해 Manager DB와 동일한 임시 권한 지원 가능

-- 예: 3개월간 임시 권한 부여
INSERT INTO sys.user_roles (
    tenant_id, user_id, role_id,
    granted_by, expires_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440999',
    CURRENT_TIMESTAMP + INTERVAL '3 months'
);
```

---

## 🎯 권장 조정안 (우선순위별)

### P0 - 긴급 (보안/무결성) 🔴

#### 1. Tenants DB에 sys.sessions 추가
```
목표: 테넌트 사용자 세션 추적
일정: 즉시
영향도: Manager DB 세션 로직과 동일하게 구현
```

**구현 순서:**
1. `sys.sessions` 테이블 생성
2. 로그인 시 세션 생성 로직 구현
3. 로그아웃 시 세션 종료 로직 구현
4. 세션 만료 배치 작업 구현
5. 감시/모니터링 대시보드 추가

**파일 생성:**
```
/packages/database/schemas/tenants/22_sys/
├── 09_sessions.sql (신규)
└── 10_login_logs.sql (기존, 필요 시 확장)
```

#### 2. 크로스 DB 무결성 검증 로직 추가
```
목표: 테넌트 삭제 시 Tenants DB 정정
일정: 2주 이내
영향도: 테넌트 삭제 엔드포인트 재구현
```

**구현:**
- TenantDeletionService 구현
- Cascade 삭제 로직
- 일일 무결성 검사 배치

---

### P1 - 높음 (기능성) 🟠

#### 1. sys.user_roles 테이블 추가 (Manager DB와 패리티)
```
목표: 테넌트 사용자 역할 할당 이력 추적
일정: 3주
영향도: 기존 sys.users.role_id는 유지, 신규 테이블 병행
```

**단계:**
1. `sys.user_roles` 생성
2. 기존 데이터 마이그레이션 (sys.users.role_id → sys.user_roles)
3. `sys.users.role_id` 제거 또는 deprecated 표시
4. ORM 모델 업데이트

#### 2. sys.role_permissions_history 추가
```
목표: 권한 변경 이력 추적
일정: 3주
영향도: 권한 변경 시 자동으로 이력 기록
```

**로직:**
- `sys.role_permissions` 변경 시 트리거
- 또는 서비스 레이어에서 명시적 기록

---

### P2 - 중간 (최적화/운영) 🟡

#### 1. idam.users에서 user_type='TENANT' 제거
```
목표: 코드 정리 및 혼란 제거
일정: 4주
영향도: 낮음 (현재 미사용)
```

#### 2. 권한 정책 문서화
```
목표: 개발자/운영자 가이드 작성
일정: 지속적
영향도: 높음 (개발 생산성)

포함 내용:
- 권한 정책 아키텍처
- 운영자 vs 테넌트 권한 설명
- 권한 추가 방법
- 역할 정의 가이드
- 감사 추적 방법
```

#### 3. 권한 마이그레이션 도구
```
목표: 테넌트 간 권한/역할 복제 도구
일정: 6주
영향도: 운영 효율성

예: 새로운 테넌트 생성 시 기본 역할/권한 자동 복제
```

---

### P3 - 낮음 (향후 개선) 💚

#### 1. 권한 정책 캐싱 개선
```
목표: 권한 계산 성능 최적화
방안: Redis 캐시 + 이벤트 기반 무효화

현재: 매 요청마다 권한 계산
개선: 캐시 활용으로 DB 쿼리 감소
```

#### 2. 감사 대시보드
```
목표: 권한 변경 이력 시각화
포함:
- 사용자별 권한 변경 이력
- 역할별 권한 변경 이력
- 대량 권한 변경 추적
- 규정 준수 리포트
```

---

## 📋 체크리스트: 설계 변경 전 확인

현재 시스템에서 다음을 확인하세요:

### Manager DB (IDAM)
- [ ] `idam.users.user_type` 모든 값 확인
  ```sql
  SELECT DISTINCT user_type, COUNT(*) FROM idam.users GROUP BY user_type;
  ```

- [ ] `idam.user_roles.scope` 분포 확인
  ```sql
  SELECT scope, COUNT(*) FROM idam.user_roles
  WHERE status = 'ACTIVE' GROUP BY scope;
  ```

- [ ] `idam.sessions` 활성 세션 개수
  ```sql
  SELECT COUNT(*) FROM idam.sessions WHERE status = 'ACTIVE';
  ```

### Manager DB (TNNT)
- [ ] `tnnt.tenant_users.is_admin` 사용 현황
  ```sql
  SELECT COUNT(*) FROM tnnt.tenant_users WHERE is_admin = true;
  ```

- [ ] `tnnt.tenant_roles` 사용 여부
  ```sql
  SELECT COUNT(*) FROM tnnt.tenant_roles;
  ```

### Tenants DB (SYS)
- [ ] `sys.users.role_id` NULL 여부
  ```sql
  SELECT COUNT(*) FROM sys.users WHERE role_id IS NULL;
  ```

- [ ] `sys.roles` 테넌트별 개수
  ```sql
  SELECT tenant_id, COUNT(*) FROM sys.roles
  GROUP BY tenant_id LIMIT 10;
  ```

- [ ] `sys.role_permissions` 테이블 용량
  ```sql
  SELECT COUNT(*) FROM sys.role_permissions;
  ```

---

## 🔄 추천 개선 로드맵

### Phase 1: 보안 강화 (1개월)
```
Week 1-2:
  ✓ sys.sessions 테이블 설계 및 생성
  ✓ 세션 관리 로직 구현

Week 3-4:
  ✓ 크로스 DB 무결성 검증 로직
  ✓ 테넌트 삭제 프로세스 재정의
  ✓ 무결성 검사 배치 구현
```

### Phase 2: 기능성 개선 (4주)
```
Week 1-2:
  ✓ sys.user_roles 테이블 생성
  ✓ 기존 데이터 마이그레이션

Week 3-4:
  ✓ sys.role_permissions_history 생성
  ✓ 권한 변경 트리거/로직 구현
```

### Phase 3: 운영 정의 (진행중)
```
Week 1-4:
  ✓ 권한 정책 문서화
  ✓ 운영 가이드 작성
  ✓ 개발자 교육
```

---

## 🎓 개념 정리: 3-Tier 권한 관리

ConexGrow의 권한 시스템을 이렇게 이해하면 됩니다:

### Tier 1: 플랫폼 레벨 (Manager DB - IDAM)
```
누가: 운영자 (user_type = MASTER)
무엇: 플랫폼 관리 권한
  ├─ 테넌트 관리
  ├─ 사용자 관리
  ├─ 시스템 설정
  └─ 감시/감시
범위: 모든 테넌트 또는 특정 테넌트
제어: idam.permissions + idam.roles
```

### Tier 2: 테넌트 메타 레벨 (Manager DB - TNNT)
```
누가: 테넌트 관리자 (is_admin = true)
무엇: 테넌트 메타 관리
  ├─ 테넌트 내 사용자 관리
  ├─ 테넌트 내 역할 커스터마이징
  └─ 테넌트 기본 설정
범위: 해당 테넌트만
제어: tnnt.tenant_users + tnnt.tenant_roles
```

### Tier 3: 비즈니스 레벨 (Tenants DB - SYS)
```
누가: 테넌트 직원 (sys.users)
무엇: 비즈니스 기능 권한
  ├─ 영업 관리 (SRM)
  ├─ 구매 관리 (PSM)
  ├─ 재고 관리 (IVM)
  ├─ 재무 관리 (FIM)
  └─ 기타 모듈
범위: 해당 테넌트만 (tenant_id로 격리)
제어: sys.permissions + sys.roles
```

---

## 📊 권한 시스템 비교표

```
┌────────────────────┬──────────────────────────┬──────────────────────────┐
│ 항목               │ Manager DB (IDAM)        │ Tenants DB (SYS)         │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ 대상 사용자        │ 운영자 (MASTER)          │ 테넌트 직원               │
│ 데이터베이스       │ 중앙 집중식               │ 테넌트별 분산             │
│ 격리 방식          │ 논리적 (user_type)       │ 물리적 (tenant_id)       │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ 역할 정의          │ SYSTEM/PLATFORM/ADMIN/...│ 테넌트별 커스텀          │
│ 역할 상속          │ 글로벌 역할 기본          │ 없음 (독립)              │
│ 역할 임시성        │ expires_at 지원          │ ❌ 향후 추가 필요        │
│ 사용자-역할 매핑   │ idam.user_roles          │ ❌ sys.user_roles 필요   │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ 권한 구조          │ category+resource+action │ module+resource+action   │
│ 권한 수             │ ~50개 (플랫폼)          │ 모듈당 ~20개 (~200개)    │
│ 권한 정책          │ applies_to 기반          │ 없음 (역할 기반)         │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ 세션 관리          │ idam.sessions ✅         │ ❌ sys.sessions 필요     │
│ 감사 추적          │ 완전                     │ 불완전 (permission 이력)│
│ 감시 로그          │ idam.login_logs          │ ❌ sys.login_logs 필요   │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ 임시 권한          │ expires_at 지원          │ ❌ 향후 지원 필요        │
│ 권한 위임          │ 역할 할당으로 가능       │ ❌ 직접 권한 위임 불가   │
│ 권한 변경 이력     │ 있음 (granted_at 등)     │ ❌ 없음 (history 필요)   │
│ 규정 준수 보고     │ 가능                     │ ❌ 데이터 부족           │
└────────────────────┴──────────────────────────┴──────────────────────────┘
```

---

## 💡 구현 팁

### 1. 세션 만료 처리
```python
# 주기적으로 실행 (예: 1시간마다)
async def cleanup_expired_sessions():
    # Manager DB
    await idam.sessions.update(
        status='EXPIRED',
        where={'expires_at': {'<': now()}, 'status': 'ACTIVE'}
    )

    # Tenants DB (모든 테넌트)
    for tenant_db in list_all_tenant_databases():
        await tenant_db.sys.sessions.update(
            status='EXPIRED',
            where={'expires_at': {'<': now()}, 'status': 'ACTIVE'}
        )
```

### 2. 권한 변경 이벤트
```python
# 권한 변경 시 감시 로그 기록
@event_dispatcher.on('permission_changed')
async def log_permission_change(event: PermissionChangedEvent):
    await sys.role_permissions_history.create(
        tenant_id=event.tenant_id,
        role_id=event.role_id,
        permission_id=event.permission_id,
        action=event.action,  # GRANTED | REVOKED
        changed_by=event.changed_by,
        reason=event.reason
    )
```

### 3. 권한 캐싱 전략
```python
# 권한 변경 시 캐시 무효화
@event_dispatcher.on('user_role_changed')
async def invalidate_permission_cache(event: UserRoleChangedEvent):
    cache_key = f"perms:{event.user_id}:{event.tenant_context}"
    await redis.delete(cache_key)
```

---

## 📚 참고 자료

### SQL 파일 위치
- Manager IDAM: `/packages/database/schemas/manager/02_idam/`
- Manager TNNT: `/packages/database/schemas/manager/01_tnnt/`
- Tenants SYS: `/packages/database/schemas/tenants/22_sys/`

### 생성 필요한 파일
```
/packages/database/schemas/tenants/22_sys/
├── 08_sessions.sql (신규)
├── 09_login_logs.sql (확장)
├── 10_user_roles.sql (신규)
└── 11_role_permissions_history.sql (신규)
```

### 마이그레이션 스크립트
```
/apps/backend-api/src/migrations/
├── cross_db_integrity.py
├── sys_sessions_migration.py
├── sys_user_roles_migration.py
└── sys_role_permissions_history_migration.py
```

---

## ✅ 최종 체크리스트

변경 적용 전:
- [ ] 현재 sys.users.role_id 데이터 백업
- [ ] 기존 권한 계산 로직 검토
- [ ] 테넌트별 권한 정책 분석
- [ ] 개발팀과 검토 및 합의
- [ ] 마이그레이션 계획 수립
- [ ] 테스트 계획 작성
- [ ] 롤백 계획 수립

변경 적용 후:
- [ ] 세션 기능 테스트
- [ ] 권한 변경 이력 기록 확인
- [ ] 크로스 DB 무결성 검증 테스트
- [ ] 감사 데이터 검증
- [ ] 성능 테스트 (쿼리 최적화)
- [ ] 운영 매뉴얼 업데이트
- [ ] 팀 교육 실시

---

**작성자**: 아키텍처 검토팀
**최종 업데이트**: 2024-10-26
**상태**: 📋 검토 및 의견 수렴 진행 중

