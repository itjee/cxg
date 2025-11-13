# Manager DB와 Tenants DB 권한 체계 분석

**작성일**: 2024-10-26
**분석 대상**:
- Manager DB의 tenant_users, tenant_roles 필요성
- Manager DB vs Tenants DB의 사용자/역할/권한 체계 구분

---

## 📊 아키텍처 계층 도해

```
ConexGrow SaaS Platform
│
├─ Manager Layer (중앙 관리)
│  ├─ idam.users (운영자 계정)
│  ├─ idam.roles (운영자 역할)
│  ├─ idam.permissions (운영자 권한)
│  ├─ tnnt.tenants (테넌트 마스터)
│  ├─ tnnt.tenant_users (테넌트 ↔ 운영자 관계) ← 필요함
│  └─ tnnt.tenant_roles (테넌트별 역할 커스터마이징) ← 필요함
│
└─ Tenant Layer (테넌트별 격리)
   └─ Tenants DB (각 테넌트마다 별도 DB)
      ├─ sys.users (테넌트 사용자)
      ├─ sys.roles (테넌트 역할)
      ├─ sys.permissions (테넌트 권한)
      ├─ sys.user_roles (테넌트 사용자-역할)
      ├─ sys.role_permissions (테넌트 역할-권한)
      ├─ sys.sessions (세션 추적)
      ├─ sys.role_permissions_history (감사)
      └─ (비즈니스 도메인 테이블들)
```

---

## 🔍 역할 분석

### Manager DB - tnnt.tenant_users 테이블

**목적**: 운영자 사용자가 어떤 테넌트를 관리하는가?

**구조**:
```sql
tenant_id (FK → tnnt.tenants)
user_id (FK → idam.users)  ← 운영자 사용자

-- 테넌트 내 정보 (비즈니스 컨텍스트)
role, department, position, employee_id
start_date, close_date, status
is_primary, is_admin
```

**사용 시나리오**:
```
운영자 "admin@conexgrow.com" (idam.users)
  ├─ Tenant A 관리
  │  └─ role: "시스템 관리자"
  │     employee_id: "OP-001"
  │
  ├─ Tenant B 관리
  │  └─ role: "기술 지원"
  │     employee_id: "OP-002"
  │
  └─ Tenant C 관리
     └─ role: "컨설턴트"
```

**데이터 흐름**:
```
Manager 관리 화면에서 "Tenant A의 사용자 목록 조회"
→ tnnt.tenant_users에서 조회
→ tenant_id = 'A' AND user_id와 일치
→ 운영자는 Tenant A에 대한 접근 권한이 있음을 확인
```

---

### Manager DB - tnnt.tenant_roles 테이블

**목적**: 각 테넌트가 보유할 수 있는 역할 커스터마이징

**구조**:
```sql
tenant_id (FK → tnnt.tenants)
role_id (FK → idam.roles)

-- 테넌트별 커스터마이징
role_name, description (테넌트별 재정의)
is_default, priority, enabled
max_users, current_users
```

**사용 시나리오**:
```
Platform Role "ADMIN" (idam.roles)
  ├─ Tenant A에서
  │  └─ 다시 정의: "관리자" (한국어)
  │     max_users: 5
  │     enabled: true
  │
  └─ Tenant B에서
     └─ 비활성화
        enabled: false
        (Tenant B는 ADMIN 역할을 사용하지 않음)
```

**데이터 흐름**:
```
Tenant A의 사용자 관리에서 "역할 목록 조회"
→ tnnt.tenant_roles에서 조회
→ tenant_id = 'A' AND enabled = true
→ 해당 테넌트에서 사용 가능한 역할만 표시
```

---

## 📋 비교표: Manager vs Tenants

### 사용자 관리

| 항목 | Manager DB | Tenants DB |
|------|-----------|-----------|
| **테이블** | idam.users | sys.users |
| **사용자** | 운영자/관리자 | 테넌트 최종 사용자 |
| **데이터 격리** | 중앙 집중식 | 테넌트별 격리 |
| **예** | admin@conexgrow.com | 테넌트 사원 계정 |
| **관계 매핑** | tnnt.tenant_users | sys.user_roles |

### 역할 관리

| 항목 | Manager DB | Tenants DB |
|------|-----------|-----------|
| **테이블** | idam.roles | sys.roles |
| **역할** | 플랫폼 운영 역할 | 비즈니스 역할 |
| **커스터마이징** | tnnt.tenant_roles | 테넌트 자체 정의 |
| **예** | PLATFORM_ADMIN | MANAGER, SUPERVISOR |
| **테넌트별 제어** | 역할 활성/비활성 | 해당 없음 |

### 권한 관리

| 항목 | Manager DB | Tenants DB |
|------|-----------|-----------|
| **테이블** | idam.permissions | sys.permissions |
| **권한 범위** | 운영 권한 | 비즈니스 권한 |
| **예** | TENANT:CREATE, TENANT:DELETE | PSM:CREATE, WMS:READ |
| **감시** | (없음) | role_permissions_history |

---

## ✅ 결론: tenant_users, tenant_roles는 필요한가?

### 🟢 YES - 필요함

#### 1. tenant_users가 필요한 이유

**케이스 1: 다중 테넌트 관리**
```
운영자 "kim@conexgrow.com"이 여러 테넌트를 관리하는 경우
├─ Tenant A (주요 고객사) - Admin
├─ Tenant B (기술 지원)    - Support
└─ Tenant C (평가판)       - Evaluator

→ 어느 테넌트에 어떤 운영자가 할당되었는가? = tnnt.tenant_users
```

**케이스 2: 테넌트별 운영자 권한**
```
Tenant A의 관리자: "alice@conexgrow.com"
Tenant B의 관리자: "bob@conexgrow.com"

→ Alice는 A에만 관리자 권한, B는 볼 수 없음
→ tnnt.tenant_users로 검증
```

**케이스 3: 테넌트별 회계/감사**
```
비용 청구 시 "어느 운영자가 이 테넌트를 관리했는가?"
→ tnnt.tenant_users에서 created_by, updated_by로 추적
```

#### 2. tenant_roles가 필요한 이유

**케이스 1: 테넌트별 기능 제어**
```
Tenant A: 전체 기능 사용
  └─ ADMIN, MANAGER, USER, GUEST 역할 모두 활성화

Tenant B: 기본 기능만
  └─ ADMIN, USER만 활성화 (MANAGER, GUEST 비활성화)

Tenant C (평가판): 제한된 기능
  └─ USER만 활성화 (나머지 모두 비활성화)

→ tnnt.tenant_roles.enabled로 제어
```

**케이스 2: 역할 개수 제한 (라이센싱)**
```
Tenant A (Premium): ADMIN 역할 최대 5명
Tenant B (Basic): ADMIN 역할 최대 1명

→ tnnt.tenant_roles.max_users로 제한
→ current_users로 추적
```

**케이스 3: 테넌트별 역할 커스터마이징**
```
Platform: "MANAGER" 역할 정의

Tenant A: "MANAGER" = "팀장"
Tenant B: "MANAGER" = "부서장"
Tenant C: "MANAGER" = "매니저"

→ tnnt.tenant_roles.role_name으로 테넌트별 표시명 변경
```

---

## 🔄 데이터 흐름 예시

### 운영자가 Tenant A 사용자의 권한 확인

```
1. Manager 관리 화면
   "Tenant A의 사용자 'john' 권한 조회"

2. 검증 단계
   ├─ 현재 운영자가 Tenant A를 관리하는가?
   │  └─ SELECT * FROM tnnt.tenant_users
   │     WHERE tenant_id = 'A' AND user_id = current_admin
   │     → 결과: YES → 계속 진행
   │
   └─ Tenant A에서 어떤 역할을 사용 가능한가?
      └─ SELECT * FROM tnnt.tenant_roles
         WHERE tenant_id = 'A' AND enabled = true
         → 결과: ADMIN, MANAGER, USER (GUEST 제외)

3. Tenants DB A 조회 (Tenant A의 격리된 DB)
   SELECT u.id, u.username,
          r.role_name, r.description
   FROM sys.users u
   JOIN sys.user_roles ur ON u.id = ur.user_id
   JOIN sys.roles r ON ur.role_id = r.id
   WHERE u.username = 'john'
   AND ur.is_active = true

4. 결과 반환
   "john은 Tenant A에서 MANAGER 역할 (팀장)을 가지고 있습니다"
```

---

## 📐 완전한 아키텍처 다이어그램

```
Manager DB (운영 관리)
═══════════════════════════════════════════

tnnt.tenants
├─ id: tenant-a-uuid
├─ name: "Customer A Inc."
└─ ...

idam.users
├─ id: admin-uuid
├─ email: "admin@conexgrow.com"
└─ user_type: "PLATFORM_ADMIN"

idam.roles
├─ id: admin-role-uuid
├─ code: "PLATFORM_ADMIN"
└─ scope: "GLOBAL"

tnnt.tenant_users ◄── 관계 정의
├─ tenant_id: tenant-a-uuid
├─ user_id: admin-uuid
├─ role: "시스템 관리자"
├─ is_admin: true
└─ start_date: 2024-10-26

tnnt.tenant_roles ◄── 테넌트별 커스터마이징
├─ tenant_id: tenant-a-uuid
├─ role_id: admin-role-uuid
├─ role_name: "관리자" (한국어)
├─ enabled: true
├─ max_users: 5
└─ current_users: 2

                    ║ Tenant A DB (격리)
                    ║ ═══════════════════════════════════════════
                    ║
                    ╚─→ sys.users
                        ├─ id: user-1-uuid
                        ├─ username: "john"
                        └─ tenant_id: tenant-a-uuid (격리)

                        sys.user_roles
                        ├─ user_id: user-1-uuid
                        ├─ role_id: (sys.roles 내 역할)
                        └─ is_active: true

                        sys.sessions
                        ├─ user_id: user-1-uuid
                        ├─ session_id: "..."
                        └─ status: "ACTIVE"
```

---

## 🎯 정리: 각 계층의 책임

### Manager DB (중앙 관리)

**tnnt.tenant_users**: "누가 어떤 테넌트를 관리하는가?"
- ✅ 운영자 ↔ 테넌트 관계
- ✅ 테넌트별 운영자 역할/직책
- ✅ 접근 제어 (운영자 권한 검증)
- ✅ 감사 추적 (운영자 변경 이력)

**tnnt.tenant_roles**: "각 테넌트가 어떤 역할을 사용할 수 있는가?"
- ✅ 역할 활성화/비활성화
- ✅ 역할 개수 제한 (라이센싱)
- ✅ 테넌트별 역할 커스터마이징
- ✅ 플랫폼 기능 제어

### Tenants DB (테넌트 비즈니스)

**sys.user_roles**: "어떤 사원이 어떤 역할을 가지고 있는가?"
- ✅ 사원 ↔ 역할 관계
- ✅ 역할 할당/해제 이력
- ✅ 임시 역할 (expires_at)
- ✅ 다중 역할 지원

---

## 💡 구체적 예제

### 예제 1: 테넌트 라이선싱

```sql
-- Manager DB: 테넌트가 최대 5명의 ADMIN만 가질 수 있음 설정
UPDATE tnnt.tenant_roles
SET max_users = 5
WHERE tenant_id = 'tenant-a'
  AND role_id = (SELECT id FROM idam.roles WHERE code = 'ADMIN');

-- 운영자가 새 ADMIN 역할 사용자 추가 시
-- 검증 로직:
SELECT current_users, max_users
FROM tnnt.tenant_roles
WHERE tenant_id = 'tenant-a'
  AND role_id = admin_role_id;

IF current_users >= max_users THEN
  RAISE ERROR 'Max admin users reached';
END IF;
```

### 예제 2: 운영자 접근 제어

```sql
-- 운영자 "admin@conexgrow.com"이 Tenant A 관리 가능한지 확인
SELECT EXISTS (
  SELECT 1 FROM tnnt.tenant_users
  WHERE tenant_id = 'tenant-a'
    AND user_id = (SELECT id FROM idam.users WHERE email = 'admin@conexgrow.com')
    AND status = 'ACTIVE'
    AND close_date IS NULL
) as can_access;
```

### 예제 3: 기능 제어

```sql
-- Tenant B에서 "GUEST" 역할 사용 가능 여부 확인
SELECT enabled FROM tnnt.tenant_roles
WHERE tenant_id = 'tenant-b'
  AND role_id = (SELECT id FROM idam.roles WHERE code = 'GUEST');

-- false 이면: Tenant B는 GUEST 역할을 제공하지 않음
-- → 계정 생성 시 GUEST 역할 선택 옵션 숨김
```

---

## ✅ 최종 결론

| 테이블 | 필요 여부 | 이유 |
|--------|---------|------|
| **tnnt.tenant_users** | **🟢 필요** | 운영자-테넌트 관계 정의, 접근 제어, 감사 추적 |
| **tnnt.tenant_roles** | **🟢 필요** | 테넌트별 역할 활성화, 라이센싱, 기능 제어 |
| **sys.user_roles** | **🟢 필요** | 사원-역할 관계, 임시 역할, 이력 추적 |
| **sys.sessions** | **🟢 필요** | 세션 관리, 동시 접속 제한, 보안 모니터링 |

---

**결론**: Manager DB의 `tenant_users`, `tenant_roles`는 **반드시 필요**합니다.

이들은 **다중 테넌트 SaaS 아키텍처의 핵심 구조**입니다.
