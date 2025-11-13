# SYS Schema - Archive

**생성일**: 2024-10-26
**목적**: sys 스키마의 보조 파일 및 마이그레이션 스크립트 보관

---

## 📁 폴더 구조

이 폴더는 테넌트 DB의 `sys` 스키마에서 핵심 테이블만 유지하기 위해 정리한 보조 파일들을 보관합니다.

### 이동된 파일 분류

#### 1. 모듈 관련 파일 (Module Management)
- `05_code_rules.sql` - 코드 규칙 테이블
- `06_modules.sql` - 모듈 정의 테이블
- `07_tenant_modules.sql` - 테넌트-모듈 매핑
- `08_modules_init_data.sql` - 초기 데이터
- `09_permissions_add_module_fk.sql` - 모듈 FK 추가

**설명**: 모듈 기반 권한 관리 시스템을 위한 파일들입니다.
사용 시 이 폴더에서 필요한 파일을 꺼내 실행하면 됩니다.

#### 2. 테넌트별 컬럼 추가 파일
- `10_users_add_tenant_id.sql` - users 테이블에 tenant_id 추가
- `11_roles_add_tenant_id.sql` - roles 테이블에 tenant_id 추가
- `12_permissions_add_tenant_id.sql` - permissions 테이블에 tenant_id 추가

**설명**: 테넌트 격리를 위한 컬럼 추가 스크립트입니다.
기존 시스템에서 필요시 실행할 수 있습니다.

#### 3. 마이그레이션 및 참고 파일
- `16_user_roles_migration.sql` - sys.users.role_id → sys.user_roles 마이그레이션
- `MODULE_MANAGEMENT_GUIDE.md` - 모듈 관리 가이드
- `MODULE_QUERIES_REFERENCE.sql` - 자주 사용하는 쿼리

**설명**: 데이터 마이그레이션 및 모듈 관리를 위한 문서/쿼리입니다.

---

## 🗂️ 핵심 sys 스키마 테이블 (메인 폴더)

다음 테이블들만 메인 폴더에 유지됩니다:

```
/packages/database/schemas/tenants/22_sys/
├── 00_schema.sql                    ← 스키마 생성
├── 01_users.sql                     ← 사용자 (핵심)
├── 02_roles.sql                     ← 역할 (핵심)
├── 03_permissions.sql               ← 권한 (핵심)
├── 04_role_permissions.sql          ← 역할-권한 매핑 (핵심)
├── 13_sessions.sql                  ← 세션 추적 ⭐ 신규
├── 14_user_roles.sql                ← 사용자-역할 매핑 ⭐ 신규
├── 15_role_permissions_history.sql  ← 권한 변경 이력 ⭐ 신규
├── 00_init_sys_improvements.sql     ← 신규 3개 테이블 초기화
├── README.md                        ← 개요
├── SCHEMA_IMPROVEMENTS.md           ← 세부 설계
├── IMPLEMENTATION_GUIDE.md          ← Python 구현 가이드
└── _archive/                        ← 이 폴더
```

---

## 🚀 사용 방법

### 기본 설정 (필수)

```bash
cd /packages/database/schemas/tenants/22_sys

# 1. 스키마 생성
psql -U postgres -d tnnt_db -f 00_schema.sql

# 2. 핵심 테이블 생성
psql -U postgres -d tnnt_db -f 01_users.sql
psql -U postgres -d tnnt_db -f 02_roles.sql
psql -U postgres -d tnnt_db -f 03_permissions.sql
psql -U postgres -d tnnt_db -f 04_role_permissions.sql

# 3. 신규 개선사항 적용
psql -U postgres -d tnnt_db -f 00_init_sys_improvements.sql
```

### 모듈 기반 권한 시스템 추가 (선택사항)

```bash
# 모듈 테이블 추가
psql -U postgres -d tnnt_db -f _archive/05_code_rules.sql
psql -U postgres -d tnnt_db -f _archive/06_modules.sql
psql -U postgres -d tnnt_db -f _archive/07_tenant_modules.sql
psql -U postgres -d tnnt_db -f _archive/08_modules_init_data.sql

# 권한 테이블에 모듈 FK 추가
psql -U postgres -d tnnt_db -f _archive/09_permissions_add_module_fk.sql
```

### 테넌트 격리 강화 (선택사항)

```bash
# 기존 테이블에 tenant_id 컬럼 추가
psql -U postgres -d tnnt_db -f _archive/10_users_add_tenant_id.sql
psql -U postgres -d tnnt_db -f _archive/11_roles_add_tenant_id.sql
psql -U postgres -d tnnt_db -f _archive/12_permissions_add_tenant_id.sql
```

### 데이터 마이그레이션 (필요시)

```bash
# sys.users.role_id → sys.user_roles 마이그레이션
psql -U postgres -d tnnt_db -f _archive/16_user_roles_migration.sql
```

---

## 📖 파일별 상세 설명

### 코드 규칙 (05_code_rules.sql)

**목적**: 권한 코드의 명명 규칙 및 포맷 정의

**테이블**:
- `code_rules`: 코드 규칙 카탈로그

**사용 시기**:
- 권한 코드를 체계적으로 관리하려는 경우
- 예: "MODULE:RESOURCE:ACTION" 형식 강제

**특징**:
- 정규식 검증
- 코드 생성 규칙 정의
- 예제 포함

---

### 모듈 관리 (06_modules.sql)

**목적**: 비즈니스 모듈 별 권한 관리

**테이블**:
- `modules`: 모듈 마스터 (PSM, WMS, CRM 등)
- 각 모듈의 권한을 그룹으로 관리

**사용 시기**:
- ERP 시스템에서 모듈별 접근 제어
- 예: "구매" 모듈에 속한 모든 권한 한 번에 관리

**특징**:
- 모듈별 권한 그룹화
- 권한 계층 구조
- 모듈 활성/비활성 제어

---

### 테넌트-모듈 매핑 (07_tenant_modules.sql)

**목적**: 테넌트별로 활성화된 모듈 관리

**테이블**:
- `tenant_modules`: 테넌트-모듈 활성화 맵핑

**사용 시기**:
- SaaS에서 테넌트별 기능 제어
- 예: 일부 테넌트는 WMS 비활성화

**특징**:
- 테넌트별 모듈 활성/비활성
- 구독 계획과 연동 가능

---

### 초기 데이터 (08_modules_init_data.sql)

**목적**: 표준 모듈 및 권한 초기 설정

**내용**:
- PSM (구매), WMS (창고), CRM (고객) 등 표준 모듈
- 각 모듈의 기본 권한

**사용 시기**:
- 새로운 테넌트 생성 시 기본 모듈 설정
- 표준 권한 체계 구축

---

### 권한에 모듈 FK 추가 (09_permissions_add_module_fk.sql)

**목적**: 기존 권한 테이블에 모듈 참조 추가

**변경사항**:
- `sys.permissions` 테이블에 `module_id` FK 추가

**주의사항**:
- 기존 권한 데이터가 있을 경우 마이그레이션 필요
- NULL 허용으로 하위호환성 유지

---

### 테넌트 격리 강화 (10-12_*.sql)

**목적**: 테넌트 데이터 격리 추가

**변경사항**:
- `users` 테이블: `tenant_id` 추가
- `roles` 테이블: `tenant_id` 추가
- `permissions` 테이블: `tenant_id` 추가

**효과**:
- 테넌트별 완전 독립된 역할/권한
- 물리적 격리 강화

**주의사항**:
- 기존 데이터의 기본값 설정 필요
- 인덱스 재구성 권장

---

### 데이터 마이그레이션 (16_user_roles_migration.sql)

**목적**: 단일 role_id에서 다중 역할 매핑으로 전환

**마이그레이션 프로세스**:
1. `sys.users.role_id` 데이터를 `sys.user_roles`로 복사
2. 데이터 검증
3. `sys.users.role_id` deprecated 처리 (또는 삭제)

**실행 순서**:
1. `14_user_roles.sql` 실행 (테이블 생성)
2. `16_user_roles_migration.sql` 실행
3. 데이터 검증
4. `sys.users.role_id` 제거

**검증**:
```sql
-- 마이그레이션 확인
SELECT COUNT(*) FROM sys.user_roles WHERE is_active = TRUE;

-- 고아 레코드 확인
SELECT * FROM sys.user_roles ur
LEFT JOIN sys.users u ON ur.user_id = u.id
WHERE u.id IS NULL AND ur.is_active = TRUE;
```

---

## 📚 참고 문서

### MODULE_MANAGEMENT_GUIDE.md

모듈 기반 권한 관리 전체 가이드:
- 아키텍처 설명
- 모듈 추가 방법
- 권한 관리 예시
- 트러블슈팅

### MODULE_QUERIES_REFERENCE.sql

자주 사용하는 SQL 쿼리 모음:
- 모듈별 권한 조회
- 사용자 권한 확인
- 감사 쿼리
- 성능 최적화 쿼리

---

## 🔄 언제 이 파일들을 사용할까?

### 필수 (항상 실행)
- 00_schema.sql
- 01_users.sql
- 02_roles.sql
- 03_permissions.sql
- 04_role_permissions.sql
- 13_sessions.sql (신규)
- 14_user_roles.sql (신규)
- 15_role_permissions_history.sql (신규)

### 선택 (필요시 실행)
- 모듈 기반 권한 관리: 06, 07, 08, 09 파일
- 테넌트 격리 강화: 10, 11, 12 파일
- 데이터 마이그레이션: 16 파일

### 참고용 (읽기만)
- MODULE_MANAGEMENT_GUIDE.md
- MODULE_QUERIES_REFERENCE.sql

---

## ✅ 정리 완료 확인

```bash
# 메인 폴더 확인 (8개 필수 파일만)
ls -la /packages/database/schemas/tenants/22_sys/*.sql | wc -l
# 예상: 8개

# Archive 폴더 확인
ls -la /packages/database/schemas/tenants/22_sys/_archive/ | wc -l
# 예상: 11개 파일
```

---

## 📌 주의사항

1. **실행 순서 중요**: 스키마를 먼저 생성한 후 테이블 생성
2. **외래키 의존성**: 테이블 생성 순서 지켜야 함
3. **마이그레이션 백업**: 16_user_roles_migration.sql 실행 전 백업 필수
4. **선택적 파일**: archive의 파일은 프로젝트 필요에 따라 선택적으로 사용

---

## 🚀 빠른 시작

### 최소 설정 (필수만)
```bash
cd /packages/database/schemas/tenants/22_sys
for f in 00_schema.sql 01_users.sql 02_roles.sql 03_permissions.sql 04_role_permissions.sql; do
  psql -U postgres -d tnnt_db -f "$f"
done
psql -U postgres -d tnnt_db -f 00_init_sys_improvements.sql
```

### 전체 설정 (모듈 포함)
```bash
# 위의 최소 설정 실행 후
cd _archive
for f in 05_code_rules.sql 06_modules.sql 07_tenant_modules.sql 08_modules_init_data.sql 09_permissions_add_module_fk.sql; do
  psql -U postgres -d tnnt_db -f "$f"
done
```

---

**최종 업데이트**: 2024-10-26
**상태**: ✅ 정리 완료
