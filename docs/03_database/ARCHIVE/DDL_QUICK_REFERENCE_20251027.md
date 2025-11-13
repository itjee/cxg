# DDL 개선사항 빠른 참조 가이드

## 실행 명령어 (복사하여 사용)

### 백업
```bash
# Manager DB 백업
pg_dump -h localhost -U postgres -d mgmt_db > backup_mgmt_db_$(date +%Y%m%d_%H%M%S).sql

# Tenant DB 백업
pg_dump -h localhost -U postgres -d tnnt_db > backup_tnnt_db_$(date +%Y%m%d_%H%M%S).sql
```

### 마이그레이션 실행
```bash
# Manager DB
psql -h localhost -U postgres -d mgmt_db -f /home/itjee/workspace/cxg/packages/database/migrations/2025-10-27_ddl_improvements/01_manager_db_improvements.sql

# Tenant DB
psql -h localhost -U postgres -d tnnt_db -f /home/itjee/workspace/cxg/packages/database/migrations/2025-10-27_ddl_improvements/02_tenant_db_improvements.sql
```

## 주요 변경사항 체크리스트

### Manager DB
- [ ] idam.roles.code (role_code → code)
- [ ] idam.roles.name (role_name → name)
- [ ] idam.roles.type (role_type → type)
- [ ] idam.roles.is_deleted (신규)
- [ ] idam.permissions.code (permission_code → code)
- [ ] idam.permissions.resource (resource_type → resource)
- [ ] idam.permissions.is_hidden (신규)
- [ ] tnnt.tenants.is_suspended (신규)
- [ ] tnnt.tenants.suspended_reason (신규)
- [ ] tnnt.tenants.suspended_date (신규)

### Tenant DB
- [ ] ivm.inventory_balances.variant_id (신규) ⭐ CRITICAL
- [ ] sys.users.is_system_user (신규)
- [ ] sys.users.last_login_ip (신규)
- [ ] sys.users.failed_login_attempts (신규)
- [ ] sys.users.locked_until (신규)

## 코드 변경 필수사항

### Manager Web (TypeScript)
```typescript
// 역할 타입 정의 업데이트
interface Role {
  code: string;        // role_code → code
  name: string;        // role_name → name
  type: RoleType;      // role_type → type
  is_deleted: boolean; // 신규
}
```

### Tenant Web (TypeScript)
```typescript
// 재고 조회 시 variant_id 추가
getInventoryBalance(warehouseId, productId, variantId?)
```

### Backend API (Python)
```python
# models/manager/idam/roles.py
class Role(Base):
    code = Column(String(100))      # role_code → code
    name = Column(String(100))      # role_name → name
    type = Column(String(50))       # role_type → type
    is_deleted = Column(Boolean)    # 신규

# models/tenant/ivm/inventory_balances.py
class InventoryBalance(Base):
    variant_id = Column(UUID)       # 신규 추가
```

## 빠른 검증 쿼리

### Manager DB
```sql
-- 컬럼 존재 확인
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'idam' AND table_name = 'roles'
AND column_name IN ('code', 'name', 'type', 'is_deleted');
```

### Tenant DB
```sql
-- variant_id 외래키 확인
SELECT constraint_name FROM information_schema.table_constraints
WHERE table_schema = 'ivm' AND table_name = 'inventory_balances'
AND constraint_name = 'fk_inventory_balances__variant_id';
```

## 문제 해결

### 마이그레이션 실패 시
1. 트랜잭션 자동 롤백됨
2. 백업에서 복원:
   ```bash
   psql -h localhost -U postgres -d mgmt_db < backup_mgmt_db_YYYYMMDD_HHMMSS.sql
   ```

### 중복 데이터 확인 (inventory_balances)
```sql
SELECT warehouse_id, product_id, COUNT(*)
FROM ivm.inventory_balances
GROUP BY warehouse_id, product_id
HAVING COUNT(*) > 1;
```

## 지원

- 상세 가이드: `README.md`
- 전체 보고서: `DDL_IMPROVEMENT_REPORT.md`
- 마이그레이션 스크립트: `01_manager_db_improvements.sql`, `02_tenant_db_improvements.sql`
