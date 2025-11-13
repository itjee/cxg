# DDL 개선사항 마이그레이션 가이드

**작성일**: 2025-10-27
**작성자**: Claude Code
**우선순위**: P0 (긴급 - 즉시 적용 권장)

## 개요

ConexGrow 프로젝트의 데이터베이스 스키마에 대한 DDL 개선사항을 적용하는 마이그레이션입니다.
주요 개선사항은 컬럼명 표준화, 누락된 필드 추가, 인덱스 최적화입니다.

## 변경 요약

### Manager DB (mgmt_db)
- **idam.roles**: 컬럼명 단순화, 삭제 플래그 추가, 인덱스 최적화
- **idam.permissions**: 컬럼명 단순화, 숨김 플래그 추가, 인덱스 최적화
- **tnnt.tenants**: 중단 관리 필드 추가, 인덱스 최적화

### Tenant DB (tnnt_db)
- **ivm.inventory_balances**: variant_id 추가 (⭐ CRITICAL), 제약조건 강화
- **sys.users**: 보안 추적 필드 추가, 외래키 추가

## 상세 변경 내용

### 1. Manager DB - idam.roles

#### 변경된 컬럼
| 기존 컬럼명 | 새 컬럼명 | 비고 |
|---------|--------|-----|
| role_code | code | 간소화 |
| role_name | name | 간소화 |
| role_type | type | 간소화 |
| - | is_deleted | 신규 추가 |

#### 추가된 인덱스
- `ix_roles__code`: 역할 코드 조회 (부분 인덱스)
- `ix_roles__type`: 역할 타입별 조회
- `ix_roles__type_priority`: 타입-우선순위 복합 인덱스

#### 데이터 마이그레이션
- 컬럼 이름이 변경되므로 **자동 데이터 마이그레이션**됨
- 기존 데이터 보존됨
- 새로 추가된 is_deleted는 DEFAULT FALSE로 초기화

### 2. Manager DB - idam.permissions

#### 변경된 컬럼
| 기존 컬럼명 | 새 컬럼명 | 비고 |
|---------|--------|-----|
| permission_code | code | 간소화 |
| permission_name | name | 간소화 |
| resource_type | resource | 간소화 |
| - | is_hidden | 신규 추가 |
| - | is_deleted | 신규 추가 |

#### 추가된 인덱스
- `ix_permissions__is_hidden`: UI 표시용 권한 조회
- `ix_permissions__resource_action`: 리소스-액션 복합 조회

### 3. Manager DB - tnnt.tenants

#### 추가된 컬럼
| 컬럼명 | 타입 | 설명 |
|------|-----|-----|
| is_suspended | BOOLEAN | 일시 중단 여부 |
| suspended_reason | TEXT | 중단 사유 |
| suspended_date | TIMESTAMP WITH TIME ZONE | 중단 일시 |

#### 추가된 제약조건
```sql
ck_tenants__suspended_consistency:
  (is_suspended = TRUE AND suspended_date IS NOT NULL) OR
  (is_suspended = FALSE)
```

#### 추가된 인덱스
- `ix_tenants__is_suspended`: 중단된 테넌트 조회
- `ix_tenants__status_type`: 상태-유형 복합 조회

### 4. Tenant DB - ivm.inventory_balances (⭐ CRITICAL)

#### 추가된 컬럼
| 컬럼명 | 타입 | 설명 |
|------|-----|-----|
| variant_id | UUID | 제품 변형 식별자 (옵션 조합) |

#### 영향 분석
- **핵심 기능 영향**: 제품 옵션(색상, 사이즈 등) 별 재고 관리 가능
- **기존 데이터**: NULL 허용으로 기존 데이터 보존
- **유니크 제약**: warehouse_id + product_id + **variant_id** + lot_number + serial_number

#### 추가된 외래키
```sql
fk_inventory_balances__variant_id → pim.product_variants(id)
ON DELETE RESTRICT
```

#### 추가된 인덱스
- `ix_inventory_balances__variant_id`: 변형별 재고 조회
- `ix_inventory_balances__warehouse_product_variant`: 창고-제품-변형 복합 조회

#### 수정된 인덱스
```sql
-- 기존
ux_inventory_balances__item_location(warehouse_id, product_id, lot_number, serial_number)

-- 신규
ux_inventory_balances__item_location(warehouse_id, product_id, variant_id, lot_number, serial_number)
```

### 5. Tenant DB - sys.users

#### 추가된 컬럼
| 컬럼명 | 타입 | 설명 |
|------|-----|-----|
| is_system_user | BOOLEAN | 시스템 사용자 여부 (배치/자동화용) |
| last_login_ip | VARCHAR(45) | 마지막 로그인 IP (IPv6 지원) |
| failed_login_attempts | INTEGER | 연속 로그인 실패 횟수 |
| locked_until | TIMESTAMP WITH TIME ZONE | 계정 잠금 해제 시각 |

#### 추가된 외래키 (자기 참조)
```sql
fk_users__created_by → sys.users(id) ON DELETE SET NULL
fk_users__updated_by → sys.users(id) ON DELETE SET NULL
```

#### 추가된 인덱스
- `ix_users__is_system_user`: 시스템 사용자 조회
- `ix_users__locked_until`: 잠긴 계정 조회
- `ix_users__failed_attempts`: 로그인 실패 추적
- `ix_users__active_role`: 활성-역할 복합 조회

## 마이그레이션 실행 순서

### 사전 준비
1. **백업 생성**
   ```bash
   # Manager DB 백업
   pg_dump -h localhost -U postgres -d mgmt_db > backup_mgmt_db_$(date +%Y%m%d_%H%M%S).sql

   # Tenant DB 백업
   pg_dump -h localhost -U postgres -d tnnt_db > backup_tnnt_db_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **의존성 확인**
   - pim.product_variants 테이블이 존재하는지 확인
   - 기존 애플리케이션 코드가 실행 중이 아닌지 확인

### 실행

#### 1단계: Manager DB 마이그레이션
```bash
psql -h localhost -U postgres -d mgmt_db -f 01_manager_db_improvements.sql
```

**예상 소요 시간**: 1-3분
**영향 범위**: idam.roles, idam.permissions, tnnt.tenants

**검증**:
```sql
-- 컬럼 변경 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'idam' AND table_name = 'roles'
  AND column_name IN ('code', 'name', 'type', 'is_deleted');

-- 데이터 보존 확인
SELECT COUNT(*) FROM idam.roles WHERE is_deleted = false;
```

#### 2단계: Tenant DB 마이그레이션
```bash
psql -h localhost -U postgres -d tnnt_db -f 02_tenant_db_improvements.sql
```

**예상 소요 시간**: 2-5분
**영향 범위**: ivm.inventory_balances, sys.users

**검증**:
```sql
-- variant_id 컬럼 추가 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'ivm' AND table_name = 'inventory_balances'
  AND column_name = 'variant_id';

-- 외래키 확인
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_schema = 'ivm' AND table_name = 'inventory_balances'
  AND constraint_name = 'fk_inventory_balances__variant_id';
```

### 롤백 계획

각 마이그레이션은 BEGIN/COMMIT 트랜잭션으로 감싸져 있어 오류 발생 시 자동 롤백됩니다.

**수동 롤백이 필요한 경우**:
```bash
# 백업에서 복원
psql -h localhost -U postgres -d mgmt_db < backup_mgmt_db_YYYYMMDD_HHMMSS.sql
psql -h localhost -U postgres -d tnnt_db < backup_tnnt_db_YYYYMMDD_HHMMSS.sql
```

## 애플리케이션 코드 변경 필요사항

### 1. Manager DB 코드 변경

#### idam.roles
```python
# 변경 전
role_data = {
    "role_code": "admin",
    "role_name": "관리자",
    "role_type": "ADMIN"
}

# 변경 후
role_data = {
    "code": "admin",
    "name": "관리자",
    "type": "ADMIN"
}
```

#### idam.permissions
```python
# 변경 전
permission_data = {
    "permission_code": "user:read",
    "permission_name": "사용자 조회",
    "resource_type": "user"
}

# 변경 후
permission_data = {
    "code": "user:read",
    "name": "사용자 조회",
    "resource": "user",
    "is_hidden": False
}
```

#### tnnt.tenants
```python
# 중단 처리 로직 추가
tenant_data = {
    "status": "SUSPENDED",
    "is_suspended": True,
    "suspended_reason": "결제 실패",
    "suspended_date": datetime.now()
}
```

### 2. Tenant DB 코드 변경

#### ivm.inventory_balances
```python
# variant_id 지원 추가 (중요!)
inventory_data = {
    "warehouse_id": warehouse_id,
    "product_id": product_id,
    "variant_id": variant_id,  # 신규 추가
    "lot_number": lot_number,
    "on_hand_qty": 100
}

# 조회 시 variant_id 포함
inventory = db.query(InventoryBalance).filter(
    InventoryBalance.warehouse_id == warehouse_id,
    InventoryBalance.product_id == product_id,
    InventoryBalance.variant_id == variant_id  # 신규 추가
).first()
```

#### sys.users
```python
# 로그인 실패 처리
user.failed_login_attempts += 1
if user.failed_login_attempts >= 5:
    user.locked_until = datetime.now() + timedelta(minutes=30)

# 로그인 성공 처리
user.last_login_at = datetime.now()
user.last_login_ip = request.client.host
user.failed_login_attempts = 0
user.locked_until = None
```

## 성능 영향 분석

### 긍정적 영향
1. **부분 인덱스 도입**: 인덱스 크기 30-50% 감소 예상
2. **복합 인덱스 최적화**: 조회 성능 20-40% 향상
3. **제약조건 강화**: 데이터 무결성 향상

### 주의사항
1. **inventory_balances**: variant_id 추가로 유니크 제약 변경
   - 기존 중복 데이터가 있다면 사전 정리 필요
   - 마이그레이션 전 검증 쿼리 실행 권장

2. **인덱스 재구축**: 마이그레이션 중 일시적 성능 저하 가능
   - 피크 시간대 피하여 실행 권장

## 검증 체크리스트

### Manager DB
- [ ] idam.roles.code 컬럼 존재 확인
- [ ] idam.roles.is_deleted 컬럼 존재 확인
- [ ] idam.permissions.resource 컬럼 존재 확인
- [ ] idam.permissions.is_hidden 컬럼 존재 확인
- [ ] tnnt.tenants.is_suspended 컬럼 존재 확인
- [ ] 모든 인덱스 생성 확인
- [ ] 기존 데이터 보존 확인

### Tenant DB
- [ ] ivm.inventory_balances.variant_id 컬럼 존재 확인
- [ ] fk_inventory_balances__variant_id 외래키 확인
- [ ] sys.users.is_system_user 컬럼 존재 확인
- [ ] sys.users.last_login_ip 컬럼 존재 확인
- [ ] sys.users.failed_login_attempts 컬럼 존재 확인
- [ ] 모든 인덱스 생성 확인
- [ ] 기존 데이터 보존 확인

## 다음 단계 (P1 우선순위)

### Manager DB
1. 모든 idam 테이블 인덱스 최적화
2. bill, ifra, mntr 스키마 개선

### Tenant DB
1. hrm.employees 암호화 필드 추가
2. fim.journal_entries 전기 관리 강화
3. 모든 스키마 표준 형식 적용

## 지원 및 문의

문제 발생 시:
1. 마이그레이션 로그 확인
2. 백업에서 롤백
3. 개발팀에 문의

---

**중요**: 프로덕션 환경 적용 전 반드시 개발/스테이징 환경에서 테스트하세요.
