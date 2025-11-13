# WMS 모듈 누락된 테이블 모델 추가 보고서

**작업 일시**: 2025-10-24
**작업 내용**: WMS 스키마의 누락된 4개 테이블 모델 생성 및 추가
**작업 상태**: ✅ 완료

---

## 문제 분석

### 🔍 발견된 문제

WMS (Warehouse Management System) 스키마에 8개의 SQL 테이블이 정의되어 있으나, 자동 생성 스크립트에서 4개의 테이블 모델만 생성됨.

**누락된 테이블**:
1. ❌ `receiving.sql` (입고 헤더)
2. ❌ `receiving_items.sql` (입고 라인 상세)
3. ❌ `shipping.sql` (출고 헤더)
4. ❌ `shipping_items.sql` (출고 라인 상세)

### 🎯 원인

자동 생성 스크립트의 정규식이 `CREATE TABLE IF NOT EXISTS`를 필수로 요구했으나, 위 4개 파일은 `CREATE TABLE` (without `IF NOT EXISTS`)로 정의됨.

```python
# 자동 생성 스크립트의 정규식
pattern = r'CREATE TABLE IF NOT EXISTS\s+(\w+)\.(\w+)\s*\((.*?)\)\s*;'

# ✅ 일치함
CREATE TABLE IF NOT EXISTS wms.warehouses (...)

# ❌ 일치하지 않음
CREATE TABLE wms.receiving (...)
```

---

## 해결 방법

### 📋 추가된 모델

#### 1. **Receiving** (입고 헤더)
**파일**: `wms/receiving.py`

```python
class Receiving(TenantBaseModel):
    """입고 헤더 정보 관리 테이블"""

    __tablename__ = "receiving"
    __table_args__ = {"schema": "wms"}

    # 컬럼들
    gr_code: Mapped[String]              # 입고 코드
    doc_date: Mapped[Date]               # 전표 일자
    po_id: Mapped[UUID | None]           # 구매발주 식별자
    vendor_id: Mapped[UUID | None]       # 공급업체 식별자
    warehouse_id: Mapped[UUID]           # 창고 식별자
    receiver_id: Mapped[UUID | None]     # 입고 담당자 식별자
    total_qty: Mapped[Integer | None]    # 총 수량
    status: Mapped[String]               # 상태
    is_deleted: Mapped[Boolean]          # 논리 삭제 플래그
```

**키 필드**:
- `gr_code`: 입고 코드 (NOT NULL, UNIQUE)
- `doc_date`: 전표 일자 (NOT NULL)
- `warehouse_id`: 창고 외래키 (NOT NULL)
- `status`: 상태 (DRAFT, CONFIRMED, COMPLETED, CANCELLED)

---

#### 2. **ReceivingItems** (입고 라인 상세)
**파일**: `wms/receiving_items.py`

```python
class ReceivingItems(TenantBaseModel):
    """입고 라인 (상세) 정보 관리 테이블"""

    __tablename__ = "receiving_items"
    __table_args__ = {"schema": "wms"}

    # 컬럼들
    gr_id: Mapped[UUID]                  # 입고 헤더 식별자 (FK)
    line_no: Mapped[Integer]             # 라인 번호
    po_line_id: Mapped[UUID | None]      # 구매발주 라인 식별자 (FK)
    item_id: Mapped[UUID]                # 제품 식별자 (FK)
    location_id: Mapped[UUID | None]     # 로케이션 식별자 (FK)
    lot_number: Mapped[String | None]    # 로트 번호
    serial_number: Mapped[String | None] # 시리얼 번호
    ordered_qty: Mapped[Integer | None]  # 발주 수량
    received_qty: Mapped[Integer]        # 입고 수량 (NOT NULL)
    rejected_qty: Mapped[Integer | None] # 불량 수량
    unit_cost: Mapped[Numeric | None]    # 단가
```

**키 필드**:
- `gr_id`: 입고 헤더 외래키 (NOT NULL, CASCADE 삭제)
- `line_no`: 라인 번호 (NOT NULL, 1 이상)
- `received_qty`: 입고 수량 (NOT NULL, 0 이상)
- `unit_cost`: 단가 (NUMERIC(18,4))

---

#### 3. **Shipping** (출고 헤더)
**파일**: `wms/shipping.py`

```python
class Shipping(TenantBaseModel):
    """출고 헤더 정보 관리 테이블"""

    __tablename__ = "shipping"
    __table_args__ = {"schema": "wms"}

    # 컬럼들
    gi_code: Mapped[String]              # 출고 코드
    doc_date: Mapped[Date]               # 전표 일자
    so_id: Mapped[UUID | None]           # 판매주문 식별자 (FK)
    customer_id: Mapped[UUID | None]     # 고객 식별자 (FK)
    warehouse_id: Mapped[UUID]           # 창고 식별자 (FK)
    picker_id: Mapped[UUID | None]       # 피킹 담당자 식별자 (FK)
    total_qty: Mapped[Integer | None]    # 총 수량
    status: Mapped[String]               # 상태
    is_deleted: Mapped[Boolean]          # 논리 삭제 플래그
```

**키 필드**:
- `gi_code`: 출고 코드 (NOT NULL, UNIQUE)
- `doc_date`: 전표 일자 (NOT NULL)
- `warehouse_id`: 창고 외래키 (NOT NULL)
- `status`: 상태 (DRAFT, CONFIRMED, COMPLETED, CANCELLED)

---

#### 4. **ShippingItems** (출고 라인 상세)
**파일**: `wms/shipping_items.py`

```python
class ShippingItems(TenantBaseModel):
    """출고 라인 (상세) 정보 관리 테이블"""

    __tablename__ = "shipping_items"
    __table_args__ = {"schema": "wms"}

    # 컬럼들
    gi_id: Mapped[UUID]                  # 출고 헤더 식별자 (FK)
    line_no: Mapped[Integer]             # 라인 번호
    so_line_id: Mapped[UUID | None]      # 판매주문 라인 식별자 (FK)
    item_id: Mapped[UUID]                # 제품 식별자 (FK)
    location_id: Mapped[UUID | None]     # 로케이션 식별자 (FK)
    lot_number: Mapped[String | None]    # 로트 번호
    serial_number: Mapped[String | None] # 시리얼 번호
    requested_qty: Mapped[Integer | None] # 요청 수량
    picked_qty: Mapped[Integer]          # 피킹 수량 (NOT NULL)
```

**키 필드**:
- `gi_id`: 출고 헤더 외래키 (NOT NULL, CASCADE 삭제)
- `line_no`: 라인 번호 (NOT NULL, 1 이상)
- `picked_qty`: 피킹 수량 (NOT NULL, 0 이상)

---

## 최종 통계

### 📊 모듈별 테이블 현황

| 모듈 | 약자 | SQL 테이블 | 생성 모델 | 변경 사항 |
|------|------|----------|---------|---------|
| ADM | adm | 7 | 7 | - |
| APM | apm | 4 | 4 | - |
| ASM | asm | 8 | 8 | - |
| BIM | bim | 4 | 4 | - |
| COM | com | 3 | 3 | - |
| CRM | crm | 19 | 19 | - |
| FAM | fam | 3 | 3 | - |
| FIM | fim | 9 | 9 | - |
| HRM | hrm | 9 | 9 | - |
| IVM | ivm | 10 | 10 | - |
| PIM | pim | 16 | 16 | - |
| PSM | psm | 10 | 10 | - |
| SRM | srm | 11 | 11 | - |
| SYS | sys | 5 | 6 | +1 (users_backup.py) |
| **WMS** | wms | 8 | 8 | **+4 테이블** |
| **총계** | | **126** | **127** | ✅ |

### 🎯 완성도

```
SQL 테이블:      126개
생성 모델:       127개 (SYS 모듈의 추가 모델 1개 포함)

일치율:          100% ✅
누락율:          0% ✅
```

---

## 외래키 관계

### Receiving (입고) 흐름

```
Purchase Orders (psm.purchase_orders)
        ↓
    Receiving
        ├─→ warehouse_id → Warehouses (wms.warehouses)
        ├─→ vendor_id → Partners (crm.partners)
        ├─→ receiver_id → Employees (hrm.employees)
        └─→ po_id → Purchase Orders (psm.purchase_orders)

    ReceivingItems (라인)
        ├─→ gr_id → Receiving (wms.receiving) [CASCADE]
        ├─→ item_id → Products (pim.products)
        ├─→ location_id → Warehouse Locations (wms.warehouse_locations)
        └─→ po_line_id → Purchase Order Items (psm.purchase_order_items)
```

### Shipping (출고) 흐름

```
Sales Orders (srm.sales_orders)
        ↓
    Shipping
        ├─→ warehouse_id → Warehouses (wms.warehouses)
        ├─→ customer_id → Partners (crm.partners)
        ├─→ picker_id → Employees (hrm.employees)
        └─→ so_id → Sales Orders (srm.sales_orders)

    ShippingItems (라인)
        ├─→ gi_id → Shipping (wms.shipping) [CASCADE]
        ├─→ item_id → Products (pim.products)
        ├─→ location_id → Warehouse Locations (wms.warehouse_locations)
        └─→ so_line_id → Sales Order Items (srm.sales_order_items)
```

---

## 수정된 파일

### 추가된 모델 파일 (4개)
- ✅ `apps/backend-api/src/models/tenants/wms/receiving.py`
- ✅ `apps/backend-api/src/models/tenants/wms/receiving_items.py`
- ✅ `apps/backend-api/src/models/tenants/wms/shipping.py`
- ✅ `apps/backend-api/src/models/tenants/wms/shipping_items.py`

### 업데이트된 파일 (1개)
- ✅ `apps/backend-api/src/models/tenants/wms/__init__.py`
  - 4개의 새로운 import 추가
  - `__all__` 리스트 업데이트 (4 → 8)
  - 문서 문자열 업데이트 (4개 → 8개)

---

## WMS 모듈 완전한 모델 목록

```python
from src.models.tenants.wms import (
    # 기본 구성
    Warehouses,             # 창고
    WarehouseEmployees,     # 창고 직원
    WarehouseLocations,     # 창고 로케이션

    # 입고 프로세스
    Receiving,              # 입고 헤더
    ReceivingItems,         # 입고 라인 (상세)

    # 출고 프로세스
    Shipping,               # 출고 헤더
    ShippingItems,          # 출고 라인 (상세)

    # 재고 관리
    Inventory,              # 재고
)
```

---

## 사용 예시

### 입고 프로세스 쿼리
```python
from sqlalchemy import select
from src.models.tenants.wms import Receiving, ReceivingItems

# 입고 헤더 조회
async def get_receiving(session: AsyncSession, receiving_id: UUID):
    result = await session.execute(
        select(Receiving).where(Receiving.id == receiving_id)
    )
    return result.scalar_one_or_none()

# 입고 라인 조회
async def get_receiving_items(session: AsyncSession, receiving_id: UUID):
    result = await session.execute(
        select(ReceivingItems).where(ReceivingItems.gr_id == receiving_id)
    )
    return result.scalars().all()
```

### 출고 프로세스 쿼리
```python
from sqlalchemy import select
from src.models.tenants.wms import Shipping, ShippingItems

# 출고 헤더 조회
async def get_shipping(session: AsyncSession, shipping_id: UUID):
    result = await session.execute(
        select(Shipping).where(Shipping.id == shipping_id)
    )
    return result.scalar_one_or_none()

# 출고 라인 조회
async def get_shipping_items(session: AsyncSession, shipping_id: UUID):
    result = await session.execute(
        select(ShippingItems).where(ShippingItems.gi_id == shipping_id)
    )
    return result.scalars().all()
```

---

## 향후 개선 사항

1. ✅ **현재 완료**: WMS 누락된 모델 추가
2. ⏳ **다음 단계**: 자동 생성 스크립트 수정
   - 정규식을 `CREATE TABLE IF NOT EXISTS|CREATE TABLE`로 변경
   - 다른 모듈의 유사 문제 사전 방지

3. ⏳ **향후 작업**: Relationship 정의
   - 양방향 관계 설정
   - Lazy loading 전략 구성

---

## 검증 체크리스트

- [x] 4개 모델 파일 생성
- [x] 올바른 외래키 정의
- [x] __init__.py 업데이트
- [x] 모듈 임포트 가능 확인
- [x] mapped_column 인수 순서 정정
- [x] 전체 통계 일치성 검증

---

**상태**: ✅ 완료
**WMS 모듈**: 완전한 8개 테이블 모델 구성
**전체 시스템**: 126개 SQL 테이블 ↔ 127개 생성 모델 (100% 커버)
