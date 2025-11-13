# Manager vs Tenant DB 빠른 참조 가이드

## 📋 역할 분리 요약

| 구분 | Manager DB (idam) | Tenant DB (sys) |
|------|------------------|-----------------|
| **대상** | 플랫폼 운영자 | 비즈니스 사용자 |
| **접근 앱** | manager-web | tenants-web |
| **URL** | manager.conexgrow.com | {subdomain}.conexgrow.com |
| **사용자 타입** | MASTER | (tenant_id로 구분) |
| **역할 예시** | SUPER_ADMIN, SUPPORT | ADMIN, MANAGER, USER |
| **권한 예시** | TENANT_CREATE, BILLING_VIEW | PSM_ORDER_CREATE, SRM_INVOICE_APPROVE |

---

## 🗄️ 테이블 구조

### Manager DB (mgmt_db)
```
idam 스키마:
├── users          - 플랫폼 운영자 (user_type = 'MASTER')
├── roles          - 운영자 역할 (SUPER_ADMIN, SUPPORT 등)
├── permissions    - 플랫폼 권한 (TENANT_CREATE 등)
├── role_permissions
└── user_roles
```

### Tenant DB (tnnt_db)
```
sys 스키마:
├── users          - 비즈니스 사용자 (tenant_id 포함)
├── roles          - 비즈니스 역할 (tenant_id 포함)
├── permissions    - 비즈니스 권한 (tenant_id nullable)
├── role_permissions
├── modules        - 모듈 정의
└── tenant_modules - 모듈 구독
```

---

## 🔑 주요 차이점

### 1. 사용자 관리

**Manager DB (운영자)**
```sql
-- 운영자 생성
INSERT INTO idam.users (user_type, username, email, password)
VALUES ('MASTER', 'admin', 'admin@conexgrow.com', 'hash');

-- 운영자 조회
SELECT * FROM idam.users WHERE user_type = 'MASTER';
```

**Tenant DB (비즈니스 사용자)**
```sql
-- 테넌트 사용자 생성 (tenant_id 필수)
INSERT INTO sys.users (tenant_id, username, email, password_hash)
VALUES ('tenant-uuid', 'john', 'john@companya.com', 'hash');

-- 테넌트 사용자 조회 (tenant_id로 격리)
SELECT * FROM sys.users 
WHERE tenant_id = 'tenant-uuid' 
  AND is_deleted = false;
```

### 2. 역할 관리

**Manager DB (운영 역할)**
```sql
-- 플랫폼 역할
- SUPER_ADMIN: 모든 권한
- TENANT_MANAGER: 테넌트 관리
- BILLING_ADMIN: 빌링 관리
- SUPPORT: 지원 (읽기 위주)
- AUDITOR: 감사 (읽기 전용)
```

**Tenant DB (비즈니스 역할)**
```sql
-- 테넌트별 커스터마이징 가능
- ADMIN: 테넌트 관리자
- SALES_MANAGER: 영업 관리자
- ACCOUNTANT: 회계 담당자
- USER: 일반 사용자
- GUEST: 게스트 (읽기 전용)
```

### 3. 권한 관리

**Manager DB (플랫폼 권한)**
```
- TENANT_CREATE: 테넌트 생성
- TENANT_DELETE: 테넌트 삭제
- TENANT_SUSPEND: 테넌트 정지
- BILLING_VIEW: 빌링 조회
- BILLING_MANAGE: 빌링 관리
- SYSTEM_MONITOR: 시스템 모니터링
- AUDIT_VIEW: 감사 로그 조회
```

**Tenant DB (비즈니스 권한)**
```
모듈별 권한:
- PSM_ORDER_CREATE: 구매발주 생성
- PSM_ORDER_APPROVE: 구매발주 승인
- SRM_INVOICE_CREATE: 판매송장 생성
- SRM_INVOICE_APPROVE: 판매송장 승인
- IVM_STOCK_ADJUST: 재고 조정
- FIM_JOURNAL_CREATE: 분개 생성
```

---

## 🔐 인증 플로우

### Manager 운영자 로그인
```
1. 사용자 → manager.conexgrow.com/login
2. POST /auth/admin/login
3. Manager DB (idam.users) 인증
4. JWT 발급 (user_type: MASTER)
5. manager-web 앱 접근
```

### Tenant 사용자 로그인
```
1. 사용자 → companya.conexgrow.com/login
2. POST /auth/tenant/login (X-Tenant-Subdomain: companya)
3. Manager DB에서 tenant 조회
4. Tenant DB (sys.users) 인증 (tenant_id 확인)
5. JWT 발급 (user_type: TENANT, tenant_id)
6. tenants-web 앱 접근
```

---

## 📝 JWT 페이로드 구조

### Manager 운영자 JWT
```json
{
  "user_id": "uuid",
  "user_type": "MASTER",
  "role": "SUPER_ADMIN",
  "username": "admin@conexgrow.com",
  "permissions": ["TENANT_CREATE", "BILLING_VIEW", ...]
}
```

### Tenant 사용자 JWT
```json
{
  "user_id": "uuid",
  "user_type": "TENANT",
  "tenant_id": "tenant-uuid",
  "username": "john@companya.com",
  "permissions": ["PSM_ORDER_CREATE", "SRM_INVOICE_VIEW", ...]
}
```

---

## 🚀 코드 예시

### 미들웨어: DB 라우팅
```python
def get_database_from_token(token: str):
    payload = decode_jwt(token)
    
    if payload["user_type"] == "MASTER":
        # 운영자 → Manager DB
        return get_manager_database()
    
    elif payload["user_type"] == "TENANT":
        # 테넌트 사용자 → Tenant DB
        return get_tenant_database(payload["tenant_id"])
    
    else:
        raise AuthenticationError("Invalid user type")
```

### 테넌트 격리 검증
```python
async def verify_tenant_access(
    user: User,
    tenant_id: UUID
) -> bool:
    """사용자가 해당 테넌트에 접근 권한이 있는지 확인"""
    if user.tenant_id != tenant_id:
        raise ForbiddenError(
            f"User {user.id} cannot access tenant {tenant_id}"
        )
    return True
```

---

## ⚠️ 주의사항

### 절대 하지 말아야 할 것
❌ Manager DB의 idam.users에 TENANT 타입 사용자 생성  
❌ Tenant DB의 sys.users에 tenant_id 없이 사용자 생성  
❌ 크로스 DB 외래키 설정 (논리적 참조만)  
❌ JWT에 user_type 없이 발급  

### 반드시 해야 할 것
✅ Manager 로그인 시 user_type = 'MASTER' 확인  
✅ Tenant 로그인 시 tenant_id 검증  
✅ 모든 Tenant API에서 tenant_id 격리 확인  
✅ JWT에 명확한 user_type 포함  

---

## 📊 데이터 격리 확인 쿼리

### Manager DB
```sql
-- 운영자 수
SELECT COUNT(*) FROM idam.users WHERE user_type = 'MASTER';

-- 역할별 운영자 수
SELECT r.role_name, COUNT(ur.user_id)
FROM idam.roles r
JOIN idam.user_roles ur ON r.id = ur.role_id
GROUP BY r.role_name;
```

### Tenant DB
```sql
-- 테넌트별 사용자 수
SELECT tenant_id, COUNT(*) as user_count
FROM sys.users
WHERE is_deleted = false
GROUP BY tenant_id;

-- 특정 테넌트 활성 사용자
SELECT username, email, position
FROM sys.users
WHERE tenant_id = :tenant_id
  AND is_active = true
  AND is_deleted = false;
```

---

## 🔧 마이그레이션 명령어

### Manager DB
```bash
# 1. TENANT 타입 제거 (MASTER만 허용)
psql -d mgmt_db -f packages/database/schemas/manager/migration_01_restrict_users_to_master.sql

# 2. 주석 업데이트
psql -d mgmt_db -f packages/database/schemas/manager/migration_02_update_idam_comments.sql
```

### Tenant DB
```bash
# 1. tenant_id 컬럼 추가
psql -d tnnt_db -f packages/database/schemas/tenants/22_sys/10_users_add_tenant_id.sql
psql -d tnnt_db -f packages/database/schemas/tenants/22_sys/11_roles_add_tenant_id.sql
psql -d tnnt_db -f packages/database/schemas/tenants/22_sys/12_permissions_add_tenant_id.sql

# 2. tenant_id 데이터 설정
psql -d tnnt_db -c "UPDATE sys.users SET tenant_id = :tenant_id;"

# 3. NOT NULL 제약 추가
psql -d tnnt_db -c "ALTER TABLE sys.users ALTER COLUMN tenant_id SET NOT NULL;"
```

---

## 📚 관련 문서

- 상세 구현: `docs/implementation/shared/Manager_Tenant_역할_분리_구현_20251026130342.md`
- 아키텍처 결정: `docs/implementation/shared/사용자_권한_아키텍처_결정_20251026125758.md`
- 모듈 관리: `packages/database/schemas/tenants/22_sys/MODULE_MANAGEMENT_GUIDE.md`

---

**버전**: 1.0  
**최종 수정**: 2025-01-26
