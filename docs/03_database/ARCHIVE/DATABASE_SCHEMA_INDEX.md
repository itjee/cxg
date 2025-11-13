# ConexGrow Database Schema - Complete Index

**작성일**: 2024-10-26
**최종 업데이트**: 2024-10-26
**상태**: ✅ 완료

---

## 📌 빠른 시작

### Manager DB 초기화
```bash
cd /home/itjee/workspace/cxg/packages/database/schemas/manager
psql -U postgres -d mgmt_db -f _00_init_all_schemas.sql
```

### Tenants DB 개선 사항 적용
```bash
cd /home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys
psql -U postgres -d tnnt_db -f 00_init_sys_improvements.sql
```

### 데이터 마이그레이션 (선택사항)
```bash
psql -U postgres -d tnnt_db -f 16_user_roles_migration.sql
```

---

## 📚 문서 맵

### 1️⃣ 아키텍처 & 설계

| 문서 | 위치 | 설명 | 대상 |
|------|------|------|------|
| **USER_ROLE_PERMISSION_ARCHITECTURE.md** | `/packages/database/schemas/` | Manager DB와 Tenants DB의 사용자/역할/권한 아키텍처 분석 | 설계자, 개발자 |
| **SCHEMA_IMPROVEMENTS.md** | `/tenants/22_sys/` | 3개 신규 테이블의 세부 설계 및 사양 | 데이터베이스 엔지니어 |
| **IMPLEMENTATION_GUIDE.md** | `/tenants/22_sys/` | Python 백엔드 구현 가이드 및 사용 예시 | 백엔드 개발자 |

### 2️⃣ Manager DB 개편

| 문서 | 위치 | 설명 | 대상 |
|------|------|------|------|
| **README.md** | `/manager/` | Manager DB 전체 구조 개요 | 모든 개발자 |
| **MIGRATION_GUIDE.md** | `/manager/` | 마이그레이션 방법 및 트러블슈팅 | DBA, 배포 담당 |
| **_00_init_all_schemas.sql** | `/manager/` | 통합 초기화 스크립트 (51개 파일 자동 실행) | DBA, 배포 담당 |

### 3️⃣ Tenants DB 개선

| 문서 | 위치 | 설명 | 대상 |
|------|------|------|------|
| **README.md** | `/tenants/22_sys/` | SYS 스키마 개요 (기존) | 테넌트 개발자 |
| **00_init_sys_improvements.sql** | `/tenants/22_sys/` | 3개 테이블 통합 초기화 스크립트 | DBA, 배포 담당 |
| **16_user_roles_migration.sql** | `/tenants/22_sys/` | sys.users.role_id → sys.user_roles 마이그레이션 | DBA, 배포 담당 |

### 4️⃣ 프로젝트 레벨 요약

| 문서 | 위치 | 설명 | 대상 |
|------|------|------|------|
| **SCHEMA_IMPLEMENTATION_SUMMARY.md** | `/` (루트) | 전체 구현 작업 요약 | 프로젝트 관리자, 리더 |
| **DATABASE_SCHEMA_INDEX.md** | `/` (이 파일) | 모든 스키마 문서 인덱스 | 모든 개발자 |

---

## 🗂️ 파일 구조

### Manager DB (`/packages/database/schemas/manager/`)

```
├── _00_init_all_schemas.sql          (통합 초기화 스크립트)
├── README.md                          (개요)
├── MIGRATION_GUIDE.md                 (마이그레이션)
│
├── 01_tnnt/                           (테넌트 관리)
│   ├── 00_schema_init.sql
│   ├── 01_tenants.sql
│   ├── 02_subscriptions.sql
│   ├── 03_onboardings.sql
│   ├── 04_tenant_users.sql
│   ├── 05_tenant_roles.sql
│   └── 06_views_functions.sql
│
├── 02_idam/                           (사용자 및 접근 관리)
│   ├── 00_schema_init.sql
│   ├── 01_users.sql
│   ├── 02_permissions.sql
│   ├── 03_roles.sql
│   ├── 04_role_permissions.sql
│   ├── 05_user_roles.sql
│   ├── 06_api_keys.sql
│   ├── 07_sessions.sql
│   └── 08_login_logs.sql
│
├── 03_bill/                           (요금 및 청구 관리)
│   ├── 00_schema_init.sql
│   ├── 01_plans.sql
│   ├── 02_invoices.sql
│   └── 03_transactions.sql
│
├── 04_ifra/                           (인프라 및 리소스 관리)
├── 05_stat/                           (성능 및 분석)
├── 06_mntr/                           (시스템 모니터링)
├── 07_intg/                           (외부 연동)
├── 08_supt/                           (고객 지원)
├── 09_audt/                           (보안 및 감사)
├── 10_auto/                           (자동화)
├── 11_cnfg/                           (설정)
│
└── [원본 파일들]                      (하위호환성 유지)
    ├── tnnt.sql
    ├── idam.sql
    ├── bill.sql
    └── ...
```

### Tenants DB - SYS Schema (`/packages/database/schemas/tenants/22_sys/`)

```
├── 00_schema.sql                      (스키마 초기화)
│
├── [기존 테이블]
├── 01_users.sql
├── 02_roles.sql
├── 03_permissions.sql
├── 04_role_permissions.sql
├── 05_code_rules.sql
├── 06_modules.sql
├── 07_tenant_modules.sql
├── 08_modules_init_data.sql
├── 09_permissions_add_module_fk.sql
├── 10_users_add_tenant_id.sql
├── 11_roles_add_tenant_id.sql
├── 12_permissions_add_tenant_id.sql
│
├── [신규 테이블] ⭐
├── 13_sessions.sql                    (세션 관리)
├── 14_user_roles.sql                  (사용자-역할 매핑)
├── 15_role_permissions_history.sql    (권한 변경 이력)
│
├── [마이그레이션 & 초기화]
├── 16_user_roles_migration.sql        (데이터 마이그레이션)
├── 00_init_sys_improvements.sql       (통합 초기화)
│
├── [문서]
├── README.md                          (개요)
├── SCHEMA_IMPROVEMENTS.md             (세부 설계)
├── IMPLEMENTATION_GUIDE.md            (구현 가이드)
├── MODULE_MANAGEMENT_GUIDE.md         (모듈 관리)
└── MODULE_QUERIES_REFERENCE.sql       (쿼리 참고)
```

### Python Backend Models (`/apps/backend-api/src/models/tenants/sys/`)

```
├── __init__.py                        (updated)
├── code_rules.py
├── permissions.py
├── role_permissions.py
├── roles.py
├── users.py
│
├── [신규 모델] ⭐
├── sessions.py                        (세션)
├── user_roles.py                      (사용자-역할)
└── role_permissions_history.py        (권한 변경 이력)
```

---

## 📊 스키마 통계

### Manager DB
- **총 스키마**: 11개
- **총 테이블**: 32개
- **총 SQL 파일**: 51개 (schema + table + init)
- **총 인덱스**: 100+개
- **외래키 제약**: 30+개
- **문서**: README.md, MIGRATION_GUIDE.md

### Tenants DB (SYS 스키마만)
- **기존 테이블**: 5개 (users, roles, permissions, role_permissions, code_rules, modules 등)
- **신규 테이블**: 3개 ⭐
  - `sessions` (세션 추적)
  - `user_roles` (사용자-역할 매핑)
  - `role_permissions_history` (권한 변경 이력)
- **신규 인덱스**: 19개 (8 + 6 + 5)
- **신규 트리거**: 1개 (자동 권한 변경 이력 기록)

### Python Models
- **기존 모델**: 5개
- **신규 모델**: 3개 ⭐
- **총 export**: 8개

---

## 🎯 사용 시나리오별 가이드

### Scenario 1: 새로운 환경에서 ConexGrow 데이터베이스 구축

**단계**:
1. PostgreSQL 15+ 설치 및 2개 데이터베이스 생성 (mgmt_db, tnnt_db)
2. Manager DB 초기화:
   ```bash
   psql -U postgres -d mgmt_db -f _00_init_all_schemas.sql
   ```
3. Tenants DB 초기화 (기본):
   ```bash
   cd tenants/22_sys
   psql -U postgres -d tnnt_db -f 00_schema.sql
   # ... 각 테이블 파일 실행
   ```
4. Tenants DB 개선 사항 적용:
   ```bash
   psql -U postgres -d tnnt_db -f 00_init_sys_improvements.sql
   ```

**참고 문서**:
- `/packages/database/schemas/manager/README.md` - Manager DB 구조
- `/packages/database/schemas/tenants/22_sys/README.md` - Tenants DB 구조

---

### Scenario 2: 기존 Tenants DB에 세션 관리 기능 추가

**단계**:
1. 새 테이블 생성:
   ```bash
   psql -U postgres -d tnnt_db -f 00_init_sys_improvements.sql
   ```
2. 데이터 마이그레이션 (선택):
   ```bash
   psql -U postgres -d tnnt_db -f 16_user_roles_migration.sql
   ```
3. Python 모델 확인:
   - `/apps/backend-api/src/models/tenants/sys/sessions.py`
   - `/apps/backend-api/src/models/tenants/sys/user_roles.py`

**참고 문서**:
- `/packages/database/schemas/tenants/22_sys/SCHEMA_IMPROVEMENTS.md` - 설계
- `/packages/database/schemas/tenants/22_sys/IMPLEMENTATION_GUIDE.md` - 구현

---

### Scenario 3: 사용자/역할/권한 시스템 이해

**아키텍처 이해**:
1. 먼저 읽기:
   - `/packages/database/schemas/USER_ROLE_PERMISSION_ARCHITECTURE.md`

2. Manager DB 이해:
   - `/packages/database/schemas/manager/02_idam/README.md` (또는 주석)
   - `/packages/database/schemas/manager/02_idam/01_users.sql`
   - `/packages/database/schemas/manager/02_idam/03_roles.sql`

3. Tenants DB 이해:
   - `/packages/database/schemas/tenants/22_sys/README.md`
   - `/packages/database/schemas/tenants/22_sys/01_users.sql`
   - `/packages/database/schemas/tenants/22_sys/SCHEMA_IMPROVEMENTS.md`

---

### Scenario 4: 백엔드 API 개발

**필요한 것**:
1. 모델 이해:
   ```python
   from models.tenants.sys import (
       Users, Roles, Permissions,
       Sessions, UserRoles, RolePermissionsHistory
   )
   ```

2. 사용 예시:
   - `/packages/database/schemas/tenants/22_sys/IMPLEMENTATION_GUIDE.md` (Sessions 섹션)
   - `/packages/database/schemas/tenants/22_sys/IMPLEMENTATION_GUIDE.md` (UserRoles 섹션)

3. 쿼리 참고:
   - `/packages/database/schemas/tenants/22_sys/MODULE_QUERIES_REFERENCE.sql`

---

## ⚙️ 운영 가이드

### 데이터베이스 유지보수

**일일 작업**:
```bash
# 만료된 세션 정리
psql -U postgres -d tnnt_db -c \
  "UPDATE sys.sessions SET status = 'EXPIRED'
   WHERE status = 'ACTIVE' AND expires_at <= CURRENT_TIMESTAMP;"

# 만료된 역할 비활성화
psql -U postgres -d tnnt_db -c \
  "UPDATE sys.user_roles SET is_active = FALSE
   WHERE is_active = TRUE AND expires_at IS NOT NULL AND expires_at <= CURRENT_TIMESTAMP;"
```

**주간 작업**:
```bash
# 인덱스 정리 및 분석
psql -U postgres -d tnnt_db -c "REINDEX INDEX CONCURRENTLY ..."
psql -U postgres -d tnnt_db -c "ANALYZE sys.sessions; ANALYZE sys.user_roles;"
```

**월간 작업**:
```bash
# 감사 리포트 생성
psql -U postgres -d tnnt_db -c \
  "SELECT action, COUNT(*) FROM sys.role_permissions_history
   WHERE changed_at >= CURRENT_DATE - INTERVAL '30 days'
   GROUP BY action;"
```

---

### 모니터링

**주의할 점**:
1. **세션 폭증**: sys.sessions에서 ACTIVE 세션 수 모니터링
2. **권한 변경**: sys.role_permissions_history 급증 감시
3. **비정상 로그인**: sys.sessions에서 ip_address 변화 추적

**확인 쿼리**:
```sql
-- 현재 활성 세션 수
SELECT COUNT(*) FROM sys.sessions WHERE status = 'ACTIVE';

-- 사용자당 세션 수
SELECT user_id, COUNT(*) FROM sys.sessions
WHERE status = 'ACTIVE' GROUP BY user_id HAVING COUNT(*) > 5;

-- 최근 권한 변경
SELECT * FROM sys.role_permissions_history
WHERE changed_at >= CURRENT_TIMESTAMP - INTERVAL '1 day'
ORDER BY changed_at DESC;
```

---

## 🔐 보안 고려사항

1. **세션 토큰**: 항상 해시값으로 저장 (session_token_hash)
2. **암호화**: 민감한 정보 암호화 저장 (IP 제외)
3. **감사 추적**: 모든 권한 변경 이력 자동 기록
4. **만료 관리**: 임시 역할 및 세션 자동 만료
5. **격리**: tenant_id를 통한 테넌트 데이터 격리

---

## 📖 레퍼런스

### SQL 레퍼런스
- `/packages/database/schemas/manager/*/` - 각 테이블 DDL
- `/packages/database/schemas/tenants/22_sys/MODULE_QUERIES_REFERENCE.sql` - 자주 사용하는 쿼리

### Python 레퍼런스
- `/apps/backend-api/src/models/base.py` - BaseModel, TenantBaseModel
- `/apps/backend-api/src/models/tenants/sys/sessions.py` - Sessions 모델
- `/apps/backend-api/src/models/tenants/sys/user_roles.py` - UserRoles 모델

### 아키텍처 레퍼런스
- `/packages/database/schemas/USER_ROLE_PERMISSION_ARCHITECTURE.md` - 전체 아키텍처
- `/packages/database/schemas/SCHEMA_IMPROVEMENTS.md` - 개선 사항 분석

---

## 📝 체크리스트

### 배포 전
- [ ] 모든 SQL 파일 검증
- [ ] 마이그레이션 스크립트 테스트
- [ ] Python 모델 타입 체크
- [ ] API 엔드포인트 구현
- [ ] 통합 테스트 완료

### 배포 중
- [ ] Manager DB 초기화
- [ ] Tenants DB 업데이트
- [ ] 데이터 마이그레이션 (필요시)
- [ ] 백엔드 배포

### 배포 후
- [ ] 세션 생성/검증 테스트
- [ ] 역할 관리 기능 테스트
- [ ] 권한 변경 이력 확인
- [ ] 모니터링 설정
- [ ] 성능 검증

---

## 🆘 트러블슈팅

### Manager DB 관련
→ `/packages/database/schemas/manager/MIGRATION_GUIDE.md` 참고

### Tenants DB 관련
→ `/packages/database/schemas/tenants/22_sys/IMPLEMENTATION_GUIDE.md` 참고

### 아키텍처 이해
→ `/packages/database/schemas/USER_ROLE_PERMISSION_ARCHITECTURE.md` 참고

---

## 📅 버전 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| 1.0 | 2024-10-26 | 초기 완성: Manager DB 개편 + Tenants DB 3개 테이블 추가 |

---

**작성자**: 데이터베이스 설계팀
**최종 업데이트**: 2024-10-26
**상태**: ✅ 완료 및 배포 준비 완료
