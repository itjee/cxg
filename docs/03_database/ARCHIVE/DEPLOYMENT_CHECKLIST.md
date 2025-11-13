# ConexGrow Database Schema - Deployment Checklist

**작성일**: 2024-10-26
**최종 검토**: 2024-10-26
**담당자**: [배포 팀]

---

## ✅ Pre-Deployment Checklist

### 환경 준비
- [ ] PostgreSQL 15+ 설치 확인
- [ ] 2개 데이터베이스 생성 (mgmt_db, tnnt_db)
- [ ] 데이터베이스 사용자 권한 설정
- [ ] 백업 솔루션 구성

### 파일 검증
- [ ] Manager DB SQL 파일 51개 확인
  ```bash
  find /packages/database/schemas/manager -name "*.sql" | wc -l
  # 예상: 64개 (51 new + 11 original + 2 init scripts)
  ```
- [ ] Tenants DB SQL 파일 4개 신규 확인
  ```bash
  ls -la /packages/database/schemas/tenants/22_sys/{13,14,15,16}_*.sql
  ```
- [ ] Python 모델 파일 3개 확인
  ```bash
  ls -la /apps/backend-api/src/models/tenants/sys/{sessions,user_roles,role_permissions_history}.py
  ```

### 코드 품질 검사
- [ ] SQL 문법 검증
  ```bash
  psql -d template1 --single-transaction -f /path/to/schema.sql --dry-run
  ```
- [ ] Python 타입 체크
  ```bash
  cd /apps/backend-api
  mypy src/models/tenants/sys/
  ```
- [ ] 모든 import 경로 확인
  ```bash
  python -c "from models.tenants.sys import Sessions, UserRoles, RolePermissionsHistory"
  ```

### 문서 검증
- [ ] 모든 마크다운 파일 검토
- [ ] 코드 예시 정확성 확인
- [ ] 링크 유효성 확인

---

## 📋 배포 단계별 작업

### Phase 1: 데이터베이스 초기화 (예상: 30분)

#### Step 1.1: Manager DB 초기화
```bash
#!/bin/bash
set -e

echo "Step 1.1: Manager DB 초기화 시작..."
cd /home/itjee/workspace/cxg/packages/database/schemas/manager

# 백업 생성
pg_dump -U postgres mgmt_db > mgmt_db_backup_$(date +%Y%m%d_%H%M%S).sql

# 스키마 초기화
psql -U postgres -d mgmt_db -f _00_init_all_schemas.sql

echo "✓ Manager DB 초기화 완료"
```

- [ ] 스크립트 실행
- [ ] 로그 확인
- [ ] 에러 없음 확인
- [ ] 스키마 생성 확인: `psql -d mgmt_db -c "\dn"`

**검증 쿼리**:
```sql
-- 스키마 확인 (11개 예상)
SELECT COUNT(*) FROM information_schema.schemata
WHERE schema_name IN ('tnnt','idam','bill','ifra','stat','mntr','intg','supt','audt','auto','cnfg');

-- 테이블 확인 (32개 예상)
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema','pg_catalog');

-- 인덱스 확인 (100+개 예상)
SELECT COUNT(*) FROM pg_stat_user_indexes;
```

**예상 결과**:
- Schemas: 11
- Tables: 32
- Indexes: 100+

#### Step 1.2: Tenants DB 새 테이블 생성
```bash
#!/bin/bash
set -e

echo "Step 1.2: Tenants DB 개선 사항 적용..."
cd /home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys

# 백업 생성
pg_dump -U postgres tnnt_db > tnnt_db_backup_$(date +%Y%m%d_%H%M%S).sql

# 새 테이블 생성
psql -U postgres -d tnnt_db -f 00_init_sys_improvements.sql

echo "✓ Tenants DB 개선 사항 적용 완료"
```

- [ ] 스크립트 실행
- [ ] 로그 확인
- [ ] 에러 없음 확인
- [ ] 테이블 생성 확인

**검증 쿼리**:
```sql
-- 신규 테이블 확인 (3개 예상)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'sys'
  AND table_name IN ('sessions','user_roles','role_permissions_history')
ORDER BY table_name;

-- 인덱스 확인 (19개 예상)
SELECT COUNT(*) FROM pg_stat_user_indexes
WHERE schemaname = 'sys'
  AND tablename IN ('sessions','user_roles','role_permissions_history');

-- 트리거 확인 (1개 예상)
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_schema = 'sys'
  AND trigger_name = 'trigger_record_role_permissions_change';
```

**예상 결과**:
- New Tables: 3
- New Indexes: 19
- New Triggers: 1

#### Step 1.3: 데이터 마이그레이션 (선택사항)
```bash
#!/bin/bash
set -e

echo "Step 1.3: 데이터 마이그레이션..."
cd /home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys

# 마이그레이션 실행
psql -U postgres -d tnnt_db -f 16_user_roles_migration.sql

echo "✓ 데이터 마이그레이션 완료"
```

- [ ] 기존 role_id 데이터 확인
- [ ] 마이그레이션 스크립트 실행
- [ ] 마이그레이션 결과 검증
- [ ] 고아 레코드 확인

**검증 쿼리**:
```sql
-- 마이그레이션된 행 수 확인
SELECT COUNT(*) FROM sys.user_roles WHERE is_active = TRUE;

-- 데이터 일관성 확인
SELECT COUNT(*) FROM sys.users WHERE role_id IS NOT NULL;

-- 고아 레코드 확인
SELECT * FROM sys.user_roles ur
LEFT JOIN sys.users u ON ur.user_id = u.id
WHERE u.id IS NULL AND ur.is_active = TRUE;
```

---

### Phase 2: 백엔드 업데이트 (예상: 1시간)

#### Step 2.1: Python 모델 검증
```bash
cd /home/itjee/workspace/cxg/apps/backend-api

# 모델 import 테스트
python -c "from models.tenants.sys import Sessions, UserRoles, RolePermissionsHistory; print('✓ Models imported successfully')"

# 타입 체크
mypy src/models/tenants/sys/ --strict

# 테스트 실행
pytest tests/unit/models/tenants/sys/ -v
```

- [ ] 모든 모델 정상 import
- [ ] 타입 체크 통과
- [ ] 단위 테스트 통과

#### Step 2.2: 마이그레이션 테스트
```bash
cd /home/itjee/workspace/cxg/apps/backend-api

# 데이터베이스 마이그레이션 (Alembic 사용 시)
alembic upgrade head

# 통합 테스트
pytest tests/integration/test_sessions.py -v
pytest tests/integration/test_user_roles.py -v
```

- [ ] 마이그레이션 성공
- [ ] 통합 테스트 통과

#### Step 2.3: API 엔드포인트 구현
```bash
# 다음 파일들에서 세션/역할 관련 엔드포인트 구현 필요:
# - src/routers/tnnt/auth.py (로그인, 로그아웃, 세션 검증)
# - src/routers/tnnt/user_management.py (역할 할당/해제)
# - src/routers/tnnt/audit.py (권한 변경 이력 조회)
```

- [ ] 로그인 엔드포인트 구현
- [ ] 로그아웃 엔드포인트 구현
- [ ] 세션 검증 미들웨어 구현
- [ ] 역할 관리 엔드포인트 구현
- [ ] 감사 이력 엔드포인트 구현

---

### Phase 3: 테스트 (예상: 2시간)

#### Step 3.1: 데이터베이스 테스트
```bash
cd /home/itjee/workspace/cxg/packages/database/schemas

# SQL 통합 테스트 (있는 경우)
pytest tests/integration/test_schema.py -v

# 성능 테스트
# - 대량 세션 생성/조회
# - 대량 역할 할당
# - 권한 변경 이력 성능
```

- [ ] 모든 CRUD 작업 정상 작동
- [ ] 제약조건 유효성 확인
- [ ] 인덱스 효율성 확인
- [ ] 성능 기준 만족 확인

**성능 기준**:
- 세션 생성: < 100ms
- 세션 조회: < 50ms
- 역할 할당: < 100ms
- 역할 조회: < 50ms

#### Step 3.2: API 테스트
```bash
cd /home/itjee/workspace/cxg/apps/backend-api

# 단위 테스트
pytest tests/unit/ -v --cov

# 통합 테스트
pytest tests/integration/ -v

# E2E 테스트 (Postman, pytest 등)
# - 로그인 → 세션 생성 → 세션 검증 → 로그아웃
# - 역할 할당 → 권한 확인 → 역할 해제
```

- [ ] 모든 단위 테스트 통과
- [ ] 모든 통합 테스트 통과
- [ ] E2E 테스트 통과

#### Step 3.3: 부하 테스트 (선택사항)
```bash
# 동시 사용자 테스트
# - 100명 동시 로그인
# - 세션 생성/검증 성능
# - 데이터베이스 연결 풀 성능
```

- [ ] 예상 동시 사용자 수 처리 가능 확인
- [ ] 데이터베이스 연결 풀 최적화 확인
- [ ] 메모리 누수 확인

---

### Phase 4: 배포 전 최종 검증 (예상: 30분)

#### Step 4.1: 프로덕션 준비 체크
```bash
# 백업 확인
ls -lh *_backup_*.sql

# 원본 파일 보존 확인
ls -la /packages/database/schemas/manager/*.sql

# Python 의존성 확인
pip check

# 환경 변수 설정 확인
echo $DATABASE_URL
echo $MGMT_DATABASE_URL
echo $REDIS_URL
```

- [ ] 최근 백업 파일 존재
- [ ] 원본 파일 안전하게 보존
- [ ] 모든 의존성 설치 완료
- [ ] 환경 변수 올바르게 설정

#### Step 4.2: 문서 최종 검증
```bash
# 모든 문서 링크 확인
grep -r "\.md" /packages/database/schemas/ | grep -i "http\|file" | head -20

# 코드 예시 정확성 확인
grep -A5 "python\|sql" *.md | head -30
```

- [ ] 모든 내부 링크 정확
- [ ] 모든 코드 예시 실행 가능

#### Step 4.3: 운영 팀 인수인계
```bash
# 운영 문서 제공
cp /home/itjee/workspace/cxg/DATABASE_SCHEMA_INDEX.md ~/operations/
cp /home/itjee/workspace/cxg/QUICK_REFERENCE.md ~/operations/
cp /home/itjee/workspace/cxg/DEPLOYMENT_CHECKLIST.md ~/operations/

# 모니터링 스크립트 제공
cp /packages/database/schemas/tenants/22_sys/MODULE_QUERIES_REFERENCE.sql ~/operations/

# 운영 팀 교육
# - 일일 유지보수 작업
# - 모니터링 항목
# - 트러블슈팅 가이드
```

- [ ] 운영 문서 인수 완료
- [ ] 모니터링 스크립트 배포
- [ ] 운영 팀 교육 완료

---

## 🚀 실제 배포 명령어

### 배포 스크립트 (deploy.sh)
```bash
#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="deployment_${TIMESTAMP}.log"

echo "ConexGrow Database Schema Deployment" | tee $LOG_FILE
echo "Started: $(date)" >> $LOG_FILE

# ============================================================================
# Phase 1: Database Initialization
# ============================================================================
echo "Phase 1: Database Initialization..." | tee -a $LOG_FILE

# Manager DB
echo "  - Manager DB initialization..." | tee -a $LOG_FILE
pg_dump -U postgres mgmt_db > mgmt_db_backup_${TIMESTAMP}.sql
psql -U postgres -d mgmt_db -f /packages/database/schemas/manager/_00_init_all_schemas.sql >> $LOG_FILE 2>&1
echo "    ✓ Complete" | tee -a $LOG_FILE

# Tenants DB
echo "  - Tenants DB improvements..." | tee -a $LOG_FILE
pg_dump -U postgres tnnt_db > tnnt_db_backup_${TIMESTAMP}.sql
psql -U postgres -d tnnt_db -f /packages/database/schemas/tenants/22_sys/00_init_sys_improvements.sql >> $LOG_FILE 2>&1
echo "    ✓ Complete" | tee -a $LOG_FILE

# Optional Migration
read -p "Run data migration? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "  - Data migration..." | tee -a $LOG_FILE
    psql -U postgres -d tnnt_db -f /packages/database/schemas/tenants/22_sys/16_user_roles_migration.sql >> $LOG_FILE 2>&1
    echo "    ✓ Complete" | tee -a $LOG_FILE
fi

# ============================================================================
# Phase 2: Backend Update
# ============================================================================
echo "Phase 2: Backend Update..." | tee -a $LOG_FILE

cd /apps/backend-api

echo "  - Running tests..." | tee -a $LOG_FILE
pytest tests/ -v >> $LOG_FILE 2>&1
echo "    ✓ All tests passed" | tee -a $LOG_FILE

echo "  - Restarting service..." | tee -a $LOG_FILE
systemctl restart conexgrow-api
echo "    ✓ Service restarted" | tee -a $LOG_FILE

# ============================================================================
# Phase 3: Verification
# ============================================================================
echo "Phase 3: Verification..." | tee -a $LOG_FILE

echo "  - Database verification..." | tee -a $LOG_FILE
psql -U postgres -d mgmt_db -c "SELECT COUNT(*) as manager_tables FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');" >> $LOG_FILE 2>&1
psql -U postgres -d tnnt_db -c "SELECT COUNT(*) as tenant_tables FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');" >> $LOG_FILE 2>&1
echo "    ✓ Complete" | tee -a $LOG_FILE

echo "  - API health check..." | tee -a $LOG_FILE
curl -s http://localhost:8100/health | jq . >> $LOG_FILE 2>&1
echo "    ✓ API is healthy" | tee -a $LOG_FILE

# ============================================================================
# Complete
# ============================================================================
echo "Deployment completed successfully!" | tee -a $LOG_FILE
echo "Completed: $(date)" >> $LOG_FILE
echo "Log file: $LOG_FILE"
```

### 배포 실행
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## ⚠️ 롤백 절차

### 만약 문제가 발생한 경우
```bash
#!/bin/bash

BACKUP_FILE="mgmt_db_backup_YYYYMMDD_HHMMSS.sql"

echo "Rolling back..."

# Manager DB 복구
psql -U postgres -d mgmt_db -f $BACKUP_FILE

# Tenants DB 복구
psql -U postgres -d tnnt_db -f tnnt_db_backup_YYYYMMDD_HHMMSS.sql

# 서비스 재시작
systemctl restart conexgrow-api

echo "Rollback completed"
```

---

## 📊 배포 후 모니터링

### 일일 점검 (Daily)
```bash
# 활성 세션 수
psql -U postgres -d tnnt_db -c "SELECT COUNT(*) FROM sys.sessions WHERE status = 'ACTIVE';"

# 최근 권한 변경
psql -U postgres -d tnnt_db -c "SELECT * FROM sys.role_permissions_history WHERE changed_at >= CURRENT_DATE ORDER BY changed_at DESC LIMIT 5;"

# 데이터베이스 상태
psql -U postgres -c "SELECT datname, numbackends FROM pg_stat_database WHERE datname IN ('mgmt_db','tnnt_db');"
```

### 주간 점검 (Weekly)
```bash
# 인덱스 효율성
psql -U postgres -d tnnt_db -c "SELECT schemaname, tablename, indexname FROM pg_stat_user_indexes WHERE schemaname = 'sys' ORDER BY idx_scan DESC LIMIT 10;"

# 테이블 크기
psql -U postgres -d tnnt_db -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables WHERE schemaname = 'sys' ORDER BY pg_total_relation_size DESC;"

# 인덱스 정리
REINDEX INDEX CONCURRENTLY sys.ix_sessions__user_id;
```

### 월간 점검 (Monthly)
```bash
# 감사 리포트 생성
psql -U postgres -d tnnt_db -c "
SELECT action, COUNT(*) as count
FROM sys.role_permissions_history
WHERE changed_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY action;
"

# 느린 쿼리 분석
# (pg_stat_statements 활성화 시)
SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

---

## 📋 최종 체크리스트

- [ ] 모든 Pre-Deployment 체크 완료
- [ ] Phase 1 배포 완료 및 검증
- [ ] Phase 2 배포 완료 및 테스트
- [ ] Phase 3 배포 완료 및 검증
- [ ] Phase 4 최종 검증 완료
- [ ] 백업 파일 보관 확인
- [ ] 운영 팀 인수인계 완료
- [ ] 모니터링 설정 확인
- [ ] 긴급 연락처 배포 완료
- [ ] 배포 완료 보고서 작성

---

**배포 담당자**: _______________
**배포 일시**: _________________
**결과**: ✅ 성공 / ❌ 실패

**상태**: ✅ 배포 준비 완료
