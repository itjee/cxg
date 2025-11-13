# SYS 스키마 (시스템 관리)

**최종 업데이트**: 2024-10-26
**상태**: ✅ 정리 완료

---

## 📋 개요

SYS 스키마는 테넌트 시스템의 핵심 사용자/역할/권한 관리와 세션 추적 기능을 담당합니다.

### 핵심 기능

| 기능 | 테이블 | 설명 |
|------|--------|------|
| **사용자 관리** | users | 테넌트 사용자 계정 관리 |
| **역할 정의** | roles | 비즈니스 역할 정의 |
| **권한 카탈로그** | permissions | 시스템 권한 목록 |
| **역할-권한 매핑** | role_permissions | 역할에 권한 부여 |
| **세션 추적** ⭐ | sessions | 로그인 세션 추적 (신규) |
| **사용자-역할 매핑** ⭐ | user_roles | 사용자에게 역할 할당 (신규) |
| **권한 변경 이력** ⭐ | role_permissions_history | 권한 변경 감시 (신규) |

---

## 🗂️ 파일 구조

### 메인 폴더 (필수 테이블)

```
/22_sys/
├── 00_schema.sql                    ← 스키마 생성
├── 01_users.sql                     ← 사용자 (핵심)
├── 02_roles.sql                     ← 역할 (핵심)
├── 03_permissions.sql               ← 권한 (핵심)
├── 04_role_permissions.sql          ← 역할-권한 (핵심)
├── 13_sessions.sql                  ← 세션 추적 ⭐ 신규
├── 14_user_roles.sql                ← 사용자-역할 매핑 ⭐ 신규
├── 15_role_permissions_history.sql  ← 권한 변경 이력 ⭐ 신규
├── 00_init_sys_improvements.sql     ← 신규 3개 테이블 초기화
│
├── _archive/                        ← 선택적 파일 (폴더 정리)
│   ├── 05_code_rules.sql
│   ├── 06_modules.sql
│   ├── 07_tenant_modules.sql
│   ├── 08_modules_init_data.sql
│   ├── 09_permissions_add_module_fk.sql
│   ├── 10_users_add_tenant_id.sql
│   ├── 11_roles_add_tenant_id.sql
│   ├── 12_permissions_add_tenant_id.sql
│   ├── 16_user_roles_migration.sql
│   ├── MODULE_MANAGEMENT_GUIDE.md
│   ├── MODULE_QUERIES_REFERENCE.sql
│   └── README.md
│
├── README.md                        ← 이 파일
├── SCHEMA_IMPROVEMENTS.md           ← 세부 설계
├── IMPLEMENTATION_GUIDE.md          ← Python 구현 가이드
└── (기타 문서)
```

---

## ⚡ 빠른 시작

### 1. 기본 설정 (필수)

```bash
cd /packages/database/schemas/tenants/22_sys

# 스키마 생성
psql -U postgres -d tnnt_db -f 00_schema.sql

# 핵심 테이블 생성 (순서 중요)
psql -U postgres -d tnnt_db -f 01_users.sql
psql -U postgres -d tnnt_db -f 02_roles.sql
psql -U postgres -d tnnt_db -f 03_permissions.sql
psql -U postgres -d tnnt_db -f 04_role_permissions.sql

# 신규 개선사항 적용 (세션, 사용자-역할, 권한 이력)
psql -U postgres -d tnnt_db -f 00_init_sys_improvements.sql
```

### 2. 선택적 설정

모듈 기반 권한, 테넌트 격리 강화 등은 `_archive/` 폴더의 파일을 참고하세요.

---

## 📊 핵심 테이블 (8개)

### 1. users (사용자) - 01_users.sql

**목적**: 테넌트 사용자 계정 관리

**주요 컬럼**:
```sql
id (UUID PK)
tenant_id (UUID FK) ← 테넌트 격리
user_code (varchar, UNIQUE per tenant)
username (varchar, UNIQUE per tenant)
email (varchar)
password_hash (varchar) ← bcrypt 해시
first_name, last_name (varchar)
phone (varchar)
is_active (bool) ← 계정 활성화 여부
last_login_at (timestamp)
created_at, created_by, updated_at, updated_by
```

**특징**:
- 테넌트별 격리된 사용자
- 비밀번호 해시 저장
- 마지막 로그인 추적
- 감사 추적 (생성자, 수정자)

**사용 예**:
```sql
-- 활성 사용자 조회
SELECT * FROM sys.users
WHERE tenant_id = 'tenant-uuid'
  AND is_active = true
  AND is_deleted = false
ORDER BY created_at DESC;
```

---

### 2. roles (역할) - 02_roles.sql

**목적**: 비즈니스 역할 정의

**주요 컬럼**:
```sql
id (UUID PK)
tenant_id (UUID FK) ← 테넌트별 역할
role_code (varchar) ← ADMIN, MANAGER, USER 등
role_name (varchar)
description (text)
is_system_role (bool) ← 시스템 기본 역할
is_active (bool)
created_at, created_by, updated_at, updated_by
```

**표준 역할 예시**:
- SUPER_ADMIN: 최고 관리자
- ADMIN: 시스템 관리자
- MANAGER: 매니저
- USER: 일반 사용자
- GUEST: 게스트

**특징**:
- 테넌트별 커스텀 역할 가능
- 시스템 기본 역할 (삭제 불가)
- 계층적 역할 관리

---

### 3. permissions (권한) - 03_permissions.sql

**목적**: 시스템 권한 카탈로그

**주요 컬럼**:
```sql
id (UUID PK)
tenant_id (UUID FK) ← 테넌트별 권한
permission_code (varchar) ← module:resource:action
permission_name (varchar)
description (text)
is_active (bool)
created_at, created_by, updated_at, updated_by
```

**권한 구조**:
```
module:resource:action
예) PSM:purchase_order:CREATE
    PSM:purchase_order:READ
    PSM:purchase_order:APPROVE
    WMS:inventory:READ
    WMS:inventory:WRITE
```

**권한 분류**:
| 모듈 | 설명 | 예시 |
|------|------|------|
| PSM | 구매 | purchase_order:READ/WRITE/APPROVE |
| WMS | 창고 | inventory:READ/WRITE |
| CRM | 고객 | customer:READ/WRITE/DELETE |
| FIM | 회계 | account:READ/WRITE/APPROVE |

---

### 4. role_permissions (역할-권한 매핑) - 04_role_permissions.sql

**목적**: 역할에 권한 부여

**주요 컬럼**:
```sql
id (UUID PK)
tenant_id (UUID FK)
role_id (UUID FK) → roles
permission_id (UUID FK) → permissions
granted_at (timestamp)
granted_by (UUID FK) → users (누가 부여했나)
created_at, created_by, updated_at, updated_by
```

**특징**:
- 역할별 권한 일괄 관리
- 부여자 추적
- 권한 변경 이력 자동 기록 (trigger)

---

### 5. sessions (세션 추적) ⭐ 신규 - 13_sessions.sql

**목적**: 사용자 로그인 세션 추적

**주요 컬럼**:
```sql
id (UUID PK)
tenant_id (UUID FK)
user_id (UUID FK) → users
session_id (varchar, UNIQUE) ← 세션 토큰
session_token_hash (varchar) ← 토큰 해시
device_type (varchar) ← WEB, MOBILE, API, DESKTOP
device_name (varchar) ← 디바이스 식별
browser (varchar)
ip_address (INET) ← IPv4/IPv6
country_code (char(2)) ← 지리적 위치
city (varchar)
expires_at (timestamp) ← 세션 만료 시간
last_activity_at (timestamp) ← 마지막 활동
status (varchar) ← ACTIVE, EXPIRED, REVOKED
revoked_at (timestamp) ← 로그아웃 시간
```

**특징**:
- 동시 세션 제한 가능
- 보안 모니터링 (IP, 디바이스)
- 자동 만료 관리
- 수동 로그아웃 추적

**8개 인덱스**:
- session_id (UNIQUE)
- user_id, tenant_id, expires_at, last_activity_at
- IP 주소, 국가 코드, 상태

---

### 6. user_roles (사용자-역할 매핑) ⭐ 신규 - 14_user_roles.sql

**목적**: 사용자에게 역할 할당 (이력 추적)

**주요 컬럼**:
```sql
id (UUID PK)
tenant_id (UUID FK)
user_id (UUID FK) → users
role_id (UUID FK) → roles
granted_at (timestamp) ← 역할 할당 시간
granted_by (UUID FK) → users (누가 할당했나)
expires_at (timestamp) ← NULL: 무기한, 값: 임시 역할
revoked_at (timestamp) ← 역할 해제 시간
revoked_by (UUID FK) → users (누가 해제했나)
revoke_reason (text)
is_active (bool) ← 활성 여부
created_at, created_by, updated_at, updated_by
```

**특징**:
- 사용자 역할의 완전한 이력 추적
- 임시 역할 지원 (expires_at)
- 다중 역할 지원 가능
- 역할 할당/해제자 기록

**6개 인덱스**:
- user_id, role_id, tenant_id
- expires_at (임시 역할 자동 만료)
- granted_by, revoked_by (감사 추적)

---

### 7. role_permissions_history (권한 변경 이력) ⭐ 신규 - 15_role_permissions_history.sql

**목적**: 권한 변경 이력 자동 감시

**주요 컬럼**:
```sql
id (UUID PK)
tenant_id (UUID FK)
role_id (UUID FK) → roles
permission_id (UUID FK) → permissions
action (varchar) ← GRANTED, REVOKED
changed_at (timestamp) ← 변경 시간
changed_by (UUID FK) → users (변경자)
reason (text) ← 변경 사유
```

**특징**:
- **자동 기록**: role_permissions 테이블의 INSERT/DELETE가 트리거 자동 실행
- 감사 추적 (변경자, 사유)
- 컴플라이언스 리포팅
- 권한 변경 분석 가능

**5개 인덱스**:
- role_id, permission_id, changed_by
- action, changed_at (감사 쿼리 최적화)

**트리거**:
```sql
trigger_record_role_permissions_change
→ role_permissions 테이블 변경 시 자동 이력 기록
```

---

## 🔄 RBAC (Role-Based Access Control)

### 구조

```
User → UserRoles → Roles → RolePermissions → Permissions
```

### 예시

```
john (사용자)
  └── MANAGER (역할) 할당 (active)
      └── permissions:
          - PSM:purchase_order:READ
          - PSM:purchase_order:APPROVE
          - WMS:inventory:READ

sarah (사용자)
  ├── ADMIN (역할) 할당 (expires_at: 2024-12-31)
  └── MANAGER (역할) 할당 (active)
```

---

## 📈 초기화 순서

```sql
1️⃣  00_schema.sql
    CREATE SCHEMA sys;

2️⃣  01_users.sql
    CREATE TABLE sys.users;

3️⃣  02_roles.sql
    CREATE TABLE sys.roles;

4️⃣  03_permissions.sql
    CREATE TABLE sys.permissions;

5️⃣  04_role_permissions.sql
    CREATE TABLE sys.role_permissions;
    CREATE TRIGGER (권한 변경 감시)

6️⃣  00_init_sys_improvements.sql
    CREATE TABLE sys.sessions;
    CREATE TABLE sys.user_roles;
    CREATE TABLE sys.role_permissions_history;
    CREATE TRIGGER (권한 변경 이력 자동 기록)
```

---

## 🔒 보안 특징

### 암호화 & 해싱
- 비밀번호: bcrypt/argon2 해시
- 세션 토큰: SHA-256 해시

### 감시 & 감사
- 모든 변경 기록 (created_by, updated_by)
- 권한 변경 자동 추적 (role_permissions_history)
- 로그인 이력 추적 (sessions)

### 격리 & 제어
- 테넌트별 완전 격리 (tenant_id)
- 임시 역할 자동 만료 (expires_at)
- 세션 자동 만료 (expires_at)

### 삭제 정책
- 논리적 삭제 (is_deleted)
- 데이터 복구 가능

---

## 📚 사용 예시

### 사용자의 권한 확인

```sql
-- 특정 사용자의 모든 활성 권한
SELECT DISTINCT p.permission_code
FROM sys.users u
JOIN sys.user_roles ur ON u.id = ur.user_id
  AND ur.is_active = TRUE
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
JOIN sys.role_permissions rp ON ur.role_id = rp.role_id
JOIN sys.permissions p ON rp.permission_id = p.id
WHERE u.id = 'user-uuid'
  AND u.tenant_id = 'tenant-uuid'
  AND u.is_active = TRUE;
```

### 세션 검증

```sql
-- 세션 유효성 확인
SELECT user_id, expires_at FROM sys.sessions
WHERE session_id = 'session-token'
  AND status = 'ACTIVE'
  AND expires_at > NOW();
```

### 권한 변경 이력 조회

```sql
-- 지난 30일 권한 변경 이력
SELECT role_id, permission_id, action, changed_at, changed_by
FROM sys.role_permissions_history
WHERE tenant_id = 'tenant-uuid'
  AND changed_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY changed_at DESC;
```

### 사용자 역할 할당

```sql
-- 사용자에게 역할 할당
INSERT INTO sys.user_roles (
  tenant_id, user_id, role_id,
  granted_by, is_active
) VALUES (
  'tenant-uuid', 'user-uuid', 'role-uuid',
  'admin-uuid', TRUE
);
```

---

## 🔗 선택적 파일 (_archive/)

메인 폴더를 깔끔하게 유지하기 위해 다음 파일들을 `_archive/` 폴더로 이동했습니다:

### 모듈 기반 권한 시스템
- `05_code_rules.sql` - 코드 규칙 정의
- `06_modules.sql` - 모듈 마스터
- `07_tenant_modules.sql` - 테넌트-모듈 활성화
- `08_modules_init_data.sql` - 표준 모듈 초기 데이터

### 테넌트 격리 강화
- `10_users_add_tenant_id.sql`
- `11_roles_add_tenant_id.sql`
- `12_permissions_add_tenant_id.sql`

### 마이그레이션
- `16_user_roles_migration.sql` - role_id → user_roles 마이그레이션

### 문서
- `MODULE_MANAGEMENT_GUIDE.md` - 모듈 관리 가이드
- `MODULE_QUERIES_REFERENCE.sql` - 자주 사용하는 쿼리

필요시 `_archive/README.md`를 참고하세요.

---

## ✅ 검증

### 테이블 생성 확인
```bash
psql -U postgres -d tnnt_db -c "\dt sys.*"
# 8개 테이블 확인: users, roles, permissions, role_permissions,
#                  sessions, user_roles, role_permissions_history
```

### 인덱스 확인
```bash
psql -U postgres -d tnnt_db -c "\di sys.*"
# 약 20개 인덱스 생성
```

### 트리거 확인
```bash
psql -U postgres -d tnnt_db -c "\dy sys.*"
# trigger_record_role_permissions_change 확인
```

---

## 📖 추가 문서

| 문서 | 내용 |
|------|------|
| **SCHEMA_IMPROVEMENTS.md** | 3개 신규 테이블 세부 설계 |
| **IMPLEMENTATION_GUIDE.md** | Python ORM 사용 방법 및 API 구현 예시 |
| **_archive/README.md** | 선택적 파일 설명 및 사용 방법 |

---

## 🚀 다음 단계

1. **API 엔드포인트 구현**
   - 로그인/로그아웃 (세션 생성/종료)
   - 사용자 역할 관리 (할당/해제)
   - 권한 확인

2. **미들웨어 구현**
   - 세션 검증 미들웨어
   - RBAC 권한 검사

3. **백그라운드 작업**
   - 만료된 세션 정리
   - 만료된 역할 비활성화

4. **모니터링**
   - 활성 세션 수 모니터링
   - 권한 변경 이력 리포팅

---

**최종 업데이트**: 2024-10-26
**상태**: ✅ 정리 완료 및 배포 준비 완료
