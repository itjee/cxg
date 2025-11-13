# DDL 개선 마이그레이션 실행 가이드

**작성일**: 2025-10-27
**버전**: 1.0
**상태**: 준비 완료 (Ready for Staging)

---

## 📋 개요

ConexGrow 데이터베이스의 DDL (Data Definition Language) 개선을 위한 포괄적인 마이그레이션 가이드입니다. 이 문서는 Manager DB와 Tenant DB의 모든 개선 사항을 단계별로 적용하는 방법을 설명합니다.

### 마이그레이션 범위

- **Manager DB**: 76개 파일 중 45개 테이블 개선
  - P0 (긴급): 11개 테이블 (`deleted` → `is_deleted` 표준화)
  - P1 (높음): 34개 테이블 (soft-delete 필드 추가)

- **Tenant DB**: 219개 파일 중 80+ 테이블 개선
  - P0 (긴급): 13개 테이블 (시스템/핵심 비즈니스 프로세스)
  - P1 (높음): 30+ 테이블 (CRM, 영업, 구매, 서비스)

### 주요 개선 사항

| 카테고리 | Manager DB | Tenant DB | 합계 |
|---------|-----------|----------|------|
| 테이블 개선 | 45 | 80+ | 125+ |
| 컬럼 추가/수정 | 65+ | 35+ | 100+ |
| 인덱스 추가 | 75+ | 90+ | 165+ |
| 제약조건 개선 | 20+ | 15+ | 35+ |

---

## 🚀 마이그레이션 전략

### Phase 1: Manager DB (1-2주)

**Step 1: P0 Priority (1-2일)**
```bash
# Manager DB P0: deleted → is_deleted 표준화
# 파일: 003_ddl_improvements_manager_p0_20251027.sql
# 영향: 11개 테이블 (bill, tnnt, ifra, mntr, audt)
# 다운타임: 약 5-10분
```

**Step 2: P1 Priority (2-3일)**
```bash
# Manager DB P1: soft-delete 필드 추가
# 파일: 004_ddl_improvements_manager_p1_20251027.sql
# 영향: 34개 테이블 (idam, intg, supt, auto, cnfg, noti, bkup, stat)
# 다운타임: 약 10-15분
```

### Phase 2: Tenant DB (1-2주)

**Step 3: P0 Priority (1-2일)**
```bash
# Tenant DB P0: 시스템 및 핵심 테이블 개선
# 파일: 005_ddl_improvements_tenant_p0_20251027.sql
# 영향: 13개 테이블 (sys, adm, pim, ivm, fim)
# 다운타임: 약 10-15분
# 중요: inventory_balances의 variant_id 지원 (e-commerce 필수)
```

**Step 4: P1 Priority (3-5일)**
```bash
# Tenant DB P1: 비즈니스 프로세스 테이블 개선
# 파일: 006_ddl_improvements_tenant_p1_20251027.sql
# 영향: 30+ 테이블 (crm, wms, psm, srm, csm, apm)
# 다운타임: 약 15-20분
```

### Phase 3: Application Code (1-2주)

- SQLAlchemy ORM 모델 업데이트
- SQL 쿼리 업데이트
- TypeScript 인터페이스 업데이트

### Phase 4: Validation & Deployment (3-5일)

- 스테이징 환경 완전 테스트
- 성능 벤치마크
- 프로덕션 배포

---

## 📝 마이그레이션 스크립트

### 생성된 마이그레이션 파일

```
apps/backend-api/scripts/migrations/
├── 003_ddl_improvements_manager_p0_20251027.sql
├── 004_ddl_improvements_manager_p1_20251027.sql
├── 005_ddl_improvements_tenant_p0_20251027.sql
├── 006_ddl_improvements_tenant_p1_20251027.sql
└── 099_rollback_all_ddl_improvements_20251027.sql
```

### 스크립트 실행 순서

**Manager DB:**
```bash
# Step 1: P0 개선사항 적용
psql -U postgres -d mgmt_db -f 003_ddl_improvements_manager_p0_20251027.sql

# Step 2: P1 개선사항 적용
psql -U postgres -d mgmt_db -f 004_ddl_improvements_manager_p1_20251027.sql
```

**Tenant DB:**
```bash
# Step 3: P0 개선사항 적용
psql -U postgres -d tnnt_db -f 005_ddl_improvements_tenant_p0_20251027.sql

# Step 4: P1 개선사항 적용
psql -U postgres -d tnnt_db -f 006_ddl_improvements_tenant_p1_20251027.sql
```

**긴급 롤백 (필요시):**
```bash
# Manager DB 롤백
psql -U postgres -d mgmt_db -f 099_rollback_all_ddl_improvements_20251027.sql

# Tenant DB 롤백
psql -U postgres -d tnnt_db -f 099_rollback_all_ddl_improvements_20251027.sql
```

---

## ✅ 체크리스트

### 마이그레이션 전

- [ ] 모든 데이터베이스 전체 백업 수행
- [ ] 스테이징 환경에서 마이그레이션 스크립트 테스트
- [ ] 팀원에게 마이그레이션 계획 공유
- [ ] 마이그레이션 롤백 계획 수립
- [ ] 공지사항 준비 (필요시)

### Manager DB P0 실행 전

- [ ] 애플리케이션 서버 정지
- [ ] 모든 데이터베이스 연결 확인 및 종료
- [ ] 트랜잭션 로그 확인

### 각 마이그레이션 Step 후

- [ ] 스크립트 실행 완료 확인
- [ ] 에러 로그 검토
- [ ] 데이터 무결성 검증 실행 (아래 참조)
- [ ] 애플리케이션 서버 재시작 (해당 Step 후)

### 마이그레이션 완료 후

- [ ] 모든 스크립트 성공적으로 실행 확인
- [ ] 애플리케이션 기능 테스트
- [ ] 성능 벤치마크 실행
- [ ] 모니터링 대시보드 확인

---

## 🔍 데이터 무결성 검증

각 마이그레이션 Step 후 다음 검증 쿼리를 실행하세요:

### Manager DB 검증

```sql
-- P0 검증: deleted → is_deleted 표준화 확인
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema IN ('bill', 'tnnt', 'ifra', 'mntr', 'audt')
  AND column_name IN ('is_deleted', 'deleted')
ORDER BY table_name, column_name;

-- P1 검증: is_deleted 필드 추가 확인
SELECT COUNT(*) as total_tables_with_is_deleted
FROM information_schema.columns
WHERE table_schema IN ('idam', 'intg', 'supt', 'auto', 'cnfg', 'noti', 'bkup', 'stat')
  AND column_name = 'is_deleted';

-- 인덱스 생성 확인
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname IN ('bill', 'tnnt', 'ifra', 'mntr', 'audt', 'idam', 'intg', 'supt', 'auto', 'cnfg', 'noti', 'bkup', 'stat')
  AND indexname LIKE 'ix_%is_deleted'
ORDER BY schemaname, tablename;
```

### Tenant DB 검증

```sql
-- P0 검증: 시스템 테이블 개선 확인
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema IN ('sys', 'adm', 'pim', 'ivm', 'fim')
  AND column_name IN ('is_deleted', 'variant_id', 'is_locked', 'posted_at')
ORDER BY table_name, column_name;

-- P1 검증: 비즈니스 테이블 soft-delete 확인
SELECT COUNT(*) as total_tables_with_is_deleted
FROM information_schema.columns
WHERE table_schema IN ('crm', 'wms', 'psm', 'srm', 'csm', 'apm')
  AND column_name = 'is_deleted';

-- variant_id 외래키 검증 (e-commerce 중요)
SELECT constraint_name, table_name, column_name
FROM information_schema.constraint_column_usage
WHERE table_schema = 'ivm'
  AND column_name = 'variant_id';
```

---

## 🔄 마이그레이션 후 애플리케이션 업데이트

### 1. SQLAlchemy ORM 모델 업데이트

**Manager DB 예시:**
```python
# Before
class Role(Base):
    role_code: str
    role_name: str
    role_type: str

# After
class Role(Base):
    code: str
    name: str
    type: str
    is_deleted: bool = False
```

**영향받는 파일:**
- `apps/backend-api/src/api/models/manager/**/__init__.py`
- `apps/backend-api/src/api/models/tenant/**/__init__.py`

### 2. SQL 쿼리 업데이트

**Manager DB 예시:**
```python
# Before
query = db.select(Role).where(Role.role_code == 'admin')

# After
query = db.select(Role).where(
    (Role.code == 'admin') & (Role.is_deleted == False)
)
```

### 3. TypeScript 인터페이스 업데이트

**Before:**
```typescript
interface Role {
  role_code: string;
  role_name: string;
  role_type: string;
}
```

**After:**
```typescript
interface Role {
  code: string;
  name: string;
  type: string;
  is_deleted?: boolean;
}
```

---

## ⚠️ 주의사항

### 중요한 주의사항

1. **Soft Delete 필드**
   - `is_deleted` 필드는 기본값이 `FALSE`로 설정됩니다
   - 모든 SELECT 쿼리에서 `WHERE is_deleted = FALSE` 조건을 포함해야 합니다
   - ORM 에서 자동으로 처리하도록 Global Filters 설정 권장

2. **Variant ID (Tenant DB - IVM)**
   - `ivm.inventory_balances.variant_id`는 e-commerce 기능의 필수 요소입니다
   - 제품 옵션 (색상, 사이즈 등)을 지원합니다
   - Foreign Key: `pim.product_variants(id)` ON DELETE RESTRICT

3. **Journal Entries (Tenant DB - FIM)**
   - 새로운 회계 제어 필드: `is_locked`, `posted_at`, `reference_doc_type`, `reference_doc_id`
   - `is_locked = TRUE`인 항목은 수정할 수 없어야 합니다
   - 회계 감사 추적을 위해 중요합니다

4. **마이그레이션 시간**
   - Manager DB P0: ~5-10분
   - Manager DB P1: ~10-15분
   - Tenant DB P0: ~10-15분
   - Tenant DB P1: ~15-20분
   - 총 예상 시간: 1시간

5. **동시성 영향**
   - 마이그레이션 중 ALTER TABLE 작업은 행 수정 Lock을 획득합니다
   - 테이블 크기가 크면 Lock 대기 시간이 증가할 수 있습니다
   - 애플리케이션 다운타임을 최소화하기 위해 야간 시간에 실행을 권장합니다

### 롤백 시나리오

**롤백이 필요한 경우:**
```bash
# Manager DB 롤백
psql -U postgres -d mgmt_db -f 099_rollback_all_ddl_improvements_20251027.sql

# Tenant DB 롤백
psql -U postgres -d tnnt_db -f 099_rollback_all_ddl_improvements_20251027.sql
```

**주의:** 롤백 후 다음이 유지됩니다:
- Tenant DB: `ivm.inventory_balances.variant_id` (e-commerce 필수)
- Tenant DB: `fim.journal_entries` 회계 필드 (비즈니스 중요)

---

## 📊 예상 성능 영향

### 긍정적 영향

| 항목 | 개선 정도 | 설명 |
|-----|---------|------|
| 활성 레코드 쿼리 | +15-20% | 부분 인덱스 (WHERE is_deleted = FALSE) |
| 인덱스 크기 | -10-15% | Soft-delete된 레코드 제외 |
| 메모리 사용 | -5-10% | 더 작은 인덱스 크기 |

### 잠재적 영향

| 항목 | 영향 | 완화 방법 |
|-----|------|---------|
| 마이그레이션 시간 | 1-2시간 | 야간 실행, 롤백 계획 |
| 디스크 I/O | 일시적 증가 | 작은 배치로 실행 |
| 메모리 사용 | 일시적 증가 | 마이그레이션 중 모니터링 |

---

## 📞 지원 및 문제 해결

### 마이그레이션 중 문제 발생 시

1. **스크립트 실행 실패**
   ```bash
   # 에러 메시지 확인
   psql -U postgres -d mgmt_db -f 003_... 2>&1 | tee migration_errors.log

   # 롤백 수행
   psql -U postgres -d mgmt_db -f 099_...
   ```

2. **데이터 불일치**
   - 검증 쿼리 실행 (위의 "데이터 무결성 검증" 섹션 참조)
   - 백업에서 복구

3. **성능 저하**
   - 인덱스 상태 확인: `ANALYZE;`
   - 느린 쿼리 로그 검토
   - Query Plan 분석

### 문의처

- Database Team: [database-team@example.com]
- DevOps Team: [devops@example.com]
- 긴급 연락: [on-call@example.com]

---

## 📚 참고 문서

- [DDL 개선사항 상세 분석](./docs/implementation/DDL_improvements_20251027.md)
- [데이터베이스 스키마 종합 분석](./docs/implementation/database_schema_comprehensive_analysis_20251027.md)
- [DDL 개선사항 요약](./DDL_IMPROVEMENTS_SUMMARY.md)

---

## 🎯 다음 단계

1. **스테이징 환경 테스트** (2025-10-28 ~ 2025-10-29)
   - 모든 마이그레이션 스크립트 실행
   - 애플리케이션 코드 업데이트 테스트
   - 성능 벤치마크 실행

2. **애플리케이션 코드 업데이트** (2025-10-29 ~ 2025-11-02)
   - ORM 모델 변경
   - SQL 쿼리 업데이트
   - TypeScript 인터페이스 업데이트

3. **프로덕션 배포** (2025-11-03 이후)
   - 데이터베이스 마이그레이션
   - 애플리케이션 배포
   - 모니터링 및 검증

---

**최종 업데이트**: 2025-10-27
**상태**: 준비 완료 ✅
**승인자**: [Database Architecture Review]
