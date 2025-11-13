# ConexGrow Database Schema - Quick Reference Card

**최종 업데이트**: 2024-10-26

---

## 🚀 5분 안에 시작하기

### 1. Manager DB 초기화
```bash
cd /packages/database/schemas/manager
psql -U postgres -d mgmt_db -f _00_init_all_schemas.sql
```

### 2. Tenants DB 업데이트
```bash
cd /packages/database/schemas/tenants/22_sys
psql -U postgres -d tnnt_db -f 00_init_sys_improvements.sql
```

### 3. 데이터 마이그레이션 (선택사항)
```bash
psql -U postgres -d tnnt_db -f 16_user_roles_migration.sql
```

---

## 📚 핵심 문서 링크

| 필요한 정보 | 문서 | 읽기 시간 |
|-----------|------|---------|
| **전체 구조 이해** | DATABASE_SCHEMA_INDEX.md | 10분 |
| **아키텍처 분석** | USER_ROLE_PERMISSION_ARCHITECTURE.md | 15분 |
| **Manager DB** | manager/README.md | 5분 |
| **세션/역할 구현** | tenants/22_sys/IMPLEMENTATION_GUIDE.md | 20분 |
| **배포 가이드** | manager/MIGRATION_GUIDE.md | 10분 |

---

## 🛠️ Python 모델 사용 예시

### Sessions (세션 관리)
```python
from models.tenants.sys import Sessions
from sqlalchemy import select

# 활성 세션 조회
async def get_session(db, session_id: str):
    stmt = select(Sessions).where(
        Sessions.session_id == session_id,
        Sessions.status == "ACTIVE"
    )
    return await db.scalar(stmt)

# 세션 생성
session = Sessions(
    tenant_id=tenant_id,
    user_id=user_id,
    session_id=session_id,
    ip_address=ip_address,
    expires_at=expires_at,
    status="ACTIVE"
)
db.add(session)
await db.commit()
```

### UserRoles (사용자-역할 매핑)
```python
from models.tenants.sys import UserRoles

# 역할 할당
role_assignment = UserRoles(
    tenant_id=tenant_id,
    user_id=user_id,
    role_id=role_id,
    granted_by=admin_user_id,
    expires_at=None  # 또는 datetime (임시 역할)
)
db.add(role_assignment)
await db.commit()

# 활성 역할 조회
stmt = select(UserRoles).where(
    UserRoles.user_id == user_id,
    UserRoles.is_active == True
)
```

### RolePermissionsHistory (권한 변경 이력)
```python
from models.tenants.sys import RolePermissionsHistory

# 이력은 자동으로 기록됨 (트리거)
# sys.role_permissions에 INSERT/DELETE 시 자동으로 이력 생성

# 권한 변경 이력 조회
stmt = select(RolePermissionsHistory).where(
    RolePermissionsHistory.role_id == role_id
).order_by(RolePermissionsHistory.changed_at.desc())
```

---

## 📊 테이블 요약

### Manager DB - IDAM 스키마 (사용자 관리)
```
users (UUID PK)
  ├── user_type: MASTER, TENANT, SYSTEM
  ├── email, password_hash
  └── mfa_enabled, sso_enabled

roles (UUID PK)
  ├── role_type: SYSTEM, PLATFORM, ADMIN, MANAGER, USER, GUEST
  ├── scope: GLOBAL, TENANT
  └── permissions: M-to-M

user_roles (UUID PK)
  ├── user_id → users
  ├── role_id → roles
  ├── tenant_context (NULL=GLOBAL, UUID=specific)
  ├── expires_at (임시 역할)
  └── is_active

sessions (UUID PK)
  ├── user_id → users
  ├── session_token_hash
  ├── ip_address, country_code
  ├── expires_at
  └── status: ACTIVE, EXPIRED, REVOKED
```

### Tenants DB - SYS 스키마 (테넌트 사용자 관리)
```
users (UUID PK)
  ├── username, email
  ├── password_hash
  └── role_id → roles (deprecated)

roles (UUID PK)
  ├── role_code, role_name
  ├── is_system_role
  └── permissions: M-to-M

sessions ⭐ (UUID PK)
  ├── user_id → users
  ├── session_token_hash
  ├── device_type, ip_address
  ├── expires_at
  └── status: ACTIVE, EXPIRED, REVOKED

user_roles ⭐ (UUID PK)
  ├── user_id → users
  ├── role_id → roles
  ├── granted_by, granted_at
  ├── expires_at (임시 역할)
  ├── revoked_by, revoked_at
  └── is_active

role_permissions_history ⭐ (UUID PK)
  ├── role_id → roles
  ├── permission_id → permissions
  ├── action: GRANTED, REVOKED
  ├── changed_by, changed_at
  └── reason
```

---

## 🔍 자주 사용하는 쿼리

### 현재 활성 세션 수
```sql
SELECT COUNT(*) FROM sys.sessions
WHERE status = 'ACTIVE' AND expires_at > NOW();
```

### 사용자의 활성 역할
```sql
SELECT r.role_name FROM sys.user_roles ur
JOIN sys.roles r ON ur.role_id = r.id
WHERE ur.user_id = $1 AND ur.is_active = TRUE
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW());
```

### 권한 변경 이력 (최근 30일)
```sql
SELECT * FROM sys.role_permissions_history
WHERE changed_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY changed_at DESC;
```

### 비정상 로그인 감지 (IP 변화)
```sql
SELECT DISTINCT user_id, ip_address, country_code, last_activity_at
FROM sys.sessions
WHERE status = 'ACTIVE' AND user_id = $1
ORDER BY last_activity_at DESC;
```

---

## 🚨 중요 주의사항

### 마이그레이션 전
- [ ] 데이터베이스 백업 생성
- [ ] 마이그레이션 스크립트 테스트 환경에서 검증
- [ ] 기존 API 호환성 확인

### 마이그레이션 후
- [ ] 세션 생성/검증 기능 테스트
- [ ] 역할 할당/해제 기능 테스트
- [ ] 권한 변경 이력 기록 확인

### 성능 고려사항
- sessions 테이블: 동시 사용자 수에 따라 자동 정리 필요
- user_roles 테이블: 대량의 역할 할당 시 배치 처리 권장
- role_permissions_history: 매월 정리 고려

---

## 🔑 주요 변경사항

### Manager DB
- 51개 SQL 파일로 분리 (모듈화)
- 통합 초기화 스크립트 제공
- 11개 스키마, 32개 테이블, 100+ 인덱스

### Tenants DB
- 3개 테이블 추가
  - `sys.sessions`: 세션 관리 (8 인덱스)
  - `sys.user_roles`: 사용자-역할 매핑 (6 인덱스)
  - `sys.role_permissions_history`: 권한 변경 이력 (5 인덱스 + 1 트리거)

### Python Backend
- 3개 ORM 모델 추가
- __init__.py 업데이트

---

## 💡 팁

1. **테스트 환경 우선**: 새로운 기능은 항상 테스트 환경에서 먼저 검증
2. **점진적 마이그레이션**: 한 번에 모든 것을 변경하지 말 것
3. **모니터링**: 배포 후 세션/역할/권한 관련 메트릭 모니터링
4. **문서 업데이트**: 새로운 API 엔드포인트 추가 시 문서 함께 업데이트
5. **백업**: 중요한 변경 전 항상 백업 생성

---

## 📞 연락처

**문의 사항**: 데이터베이스 설계팀
**에러 리포팅**: GitHub Issues
**기여**: Pull Request 환영

---

## 📌 북마크

### 자주 보는 파일
- `/CLAUDE.md` - 프로젝트 전체 가이드
- `/DATABASE_SCHEMA_INDEX.md` - 스키마 전체 인덱스
- `/SCHEMA_IMPLEMENTATION_SUMMARY.md` - 구현 요약
- `/packages/database/schemas/USER_ROLE_PERMISSION_ARCHITECTURE.md` - 아키텍처
- `/packages/database/schemas/tenants/22_sys/IMPLEMENTATION_GUIDE.md` - 구현 가이드

---

**최종 업데이트**: 2024-10-26 | **상태**: ✅ 배포 준비 완료
