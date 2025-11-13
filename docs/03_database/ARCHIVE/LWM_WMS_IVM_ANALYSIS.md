# LWM, WMS, IVM 스키마 통합/분리 분석

**작성일**: 2025-01-20  
**작성자**: Database Architecture Team  
**문서 버전**: 1.0  
**상태**: 분석 및 권장안

---

## 📋 목차

1. [현재 상황](#현재-상황)
2. [각 스키마 상세 분석](#각-스키마-상세-분석)
3. [유사성 및 차이점 분석](#유사성-및-차이점-분석)
4. [통합/분리 시나리오](#통합분리-시나리오)
5. [최종 권장안](#최종-권장안)
6. [마이그레이션 계획](#마이그레이션-계획)

---

## 현재 상황

### 스키마 개요

| 스키마 | 명칭 | 현재 테이블 수 | 주요 기능 |
|--------|------|---------------|-----------|
| **lwm** | Logistics & WMS | 4개 | 입출고 트랜잭션 |
| **wms** | Warehouse Management | 3개 (adm에 있음) | 창고 마스터 |
| **ivm** | Inventory Management | 2개 | 재고 현황/이동 |

### 현재 테이블 배치

```
lwm (Logistics & WMS):
├── goods_receipts          # 입고 헤더
├── goods_receipt_lines     # 입고 라인
├── goods_issues            # 출고 헤더
└── goods_issue_lines       # 출고 라인

adm (현재 창고 마스터 위치):
├── warehouses              # 창고 기본정보
├── warehouse_employees     # 창고 직원
└── warehouse_locations     # 창고 로케이션

ivm (Inventory Management):
├── inventory_balances      # 재고 현황
└── inventory_movements     # 재고 이동 이력
```

---

## 각 스키마 상세 분석

### 1️⃣ lwm (Logistics & WMS)

**목적**: 물류 트랜잭션 관리 (입고/출고 프로세스)

#### 테이블 구조

```sql
-- 1. goods_receipts (입고 헤더)
- id, created_at, created_by, updated_at, updated_by
- gr_code                    # 입고 코드
- doc_date                   # 전표 일자
- po_id                      # 구매발주 참조
- vendor_id                  # 공급업체 (crm.customers)
- warehouse_id               # 창고 (adm.warehouses)
- receiver_id                # 입고 담당자
- total_qty                  # 총 수량
- status                     # 상태 (DRAFT/CONFIRMED/COMPLETED/CANCELLED)

-- 2. goods_receipt_lines (입고 라인)
- id, created_at, created_by, updated_at, updated_by
- gr_id                      # 입고 헤더 참조
- line_no                    # 라인 번호
- po_line_id                 # 구매발주 라인 참조
- item_id                    # 제품 (pim.products)
- location_id                # 로케이션 (adm.warehouse_locations)
- lot_number                 # 로트 번호
- serial_number              # 시리얼 번호
- ordered_qty                # 발주 수량
- received_qty               # 입고 수량
- rejected_qty               # 불량 수량
- unit_cost                  # 단가

-- 3. goods_issues (출고 헤더)
- id, created_at, created_by, updated_at, updated_by
- gi_code                    # 출고 코드
- doc_date                   # 전표 일자
- so_id                      # 판매주문 참조
- customer_id                # 고객 (crm.customers)
- warehouse_id               # 창고
- picker_id                  # 피킹 담당자
- total_qty                  # 총 수량
- status                     # 상태

-- 4. goods_issue_lines (출고 라인)
- id, created_at, created_by, updated_at, updated_by
- gi_id                      # 출고 헤더 참조
- line_no                    # 라인 번호
- so_line_id                 # 판매주문 라인 참조
- item_id                    # 제품
- location_id                # 로케이션
- lot_number                 # 로트 번호
- serial_number              # 시리얼 번호
- ordered_qty                # 주문 수량
- picked_qty                 # 피킹 수량
- issued_qty                 # 출고 수량
- unit_cost                  # 단가
```

#### 특징
- ✅ **트랜잭션 중심**: 입고/출고 프로세스 관리
- ✅ **문서 기반**: 헤더-라인 구조
- ✅ **외부 참조**: 구매(psm), 판매(srm) 연동
- ✅ **로트/시리얼 추적**: 이력 관리
- ✅ **재고 트리거**: 입출고 시 ivm.inventory_movements 생성

---

### 2️⃣ wms (Warehouse Management) - 현재 adm에 위치

**목적**: 창고 마스터 데이터 및 물리적 구조 관리

#### 테이블 구조 (현재 adm 스키마)

```sql
-- 1. warehouses (창고 기본정보)
- id, created_at, created_by, updated_at, updated_by
- warehouse_code             # 창고 코드
- warehouse_name             # 창고명
- warehouse_type             # 창고 유형 (RAW/FINISHED/TRANSIT)
- manager_id                 # 창고 관리자
- address                    # 주소
- phone                      # 전화번호
- is_active                  # 활성 여부
- is_deleted                 # 삭제 여부

-- 2. warehouse_employees (창고 직원)
- id, created_at, created_by, updated_at, updated_by
- warehouse_id               # 창고 참조
- employee_id                # 직원 (hrm.employees)
- role                       # 역할 (MANAGER/PICKER/PACKER/FORKLIFT)
- assigned_date              # 배정 일자
- is_active                  # 활성 여부

-- 3. warehouse_locations (창고 로케이션)
- id, created_at, created_by, updated_at, updated_by
- warehouse_id               # 창고 참조
- location_code              # 로케이션 코드
- location_name              # 로케이션명
- location_type              # 유형 (ZONE/RACK/BIN)
- parent_location_id         # 상위 로케이션 (계층구조)
- capacity                   # 용량
- is_active                  # 활성 여부
```

#### 특징
- ✅ **마스터 데이터**: 창고 기본정보
- ✅ **물리적 구조**: 로케이션 계층 관리
- ✅ **인력 관리**: 창고 직원 배정
- ✅ **정적 데이터**: 변경 빈도 낮음

---

### 3️⃣ ivm (Inventory Management)

**목적**: 재고 현황 및 이동 이력 관리

#### 테이블 구조

```sql
-- 1. inventory_balances (재고 현황)
- id, created_at, created_by, updated_at, updated_by
- warehouse_id               # 창고 참조
- location_id                # 로케이션 참조
- product_id                 # 제품 참조
- lot_number                 # 로트 번호
- serial_number              # 시리얼 번호
- on_hand_qty                # 현재고 수량
- available_qty              # 가용 수량
- reserved_qty               # 예약 수량
- avg_cost                   # 평균 단가
- last_movement_date         # 최종 이동 일시

-- 2. inventory_movements (재고 이동 이력)
- id, created_at, created_by, updated_at, updated_by
- movement_code              # 이동 코드
- doc_date                   # 전표 일자
- movement_type              # 이동 유형 (IN/OUT/TRANSFER/ADJUSTMENT)
- reference_doc_type         # 참조 문서 유형 (GR/GI/TRANSFER/COUNT)
- reference_doc_id           # 참조 문서 식별자
- warehouse_id               # 창고
- location_id                # 로케이션
- product_id                 # 제품
- lot_number                 # 로트 번호
- serial_number              # 시리얼 번호
- qty                        # 이동 수량 (양수/음수)
- unit_cost                  # 단가
- total_cost                 # 총 원가
- reason_code                # 사유 코드
- notes                      # 비고
```

#### 특징
- ✅ **현황 관리**: 실시간 재고 현황
- ✅ **이력 추적**: 모든 재고 이동 기록
- ✅ **다차원 집계**: 창고/로케이션/제품/로트별
- ✅ **원가 관리**: 평균 단가 계산
- ✅ **참조 통합**: 모든 재고 이동 소스 통합

---

## 유사성 및 차이점 분석

### 공통점 🔗

| 항목 | lwm | wms | ivm |
|------|-----|-----|-----|
| **창고 참조** | ✓ | ✓ (마스터) | ✓ |
| **로케이션 참조** | ✓ | ✓ (마스터) | ✓ |
| **제품 참조** | ✓ | - | ✓ |
| **로트/시리얼** | ✓ | - | ✓ |
| **수량 관리** | ✓ | - | ✓ |
| **원가 관리** | ✓ | - | ✓ |

### 차이점 ⚡

#### 1. 데이터 특성

| 특성 | lwm | wms | ivm |
|------|-----|-----|-----|
| **데이터 성격** | 트랜잭션 | 마스터 | 집계/이력 |
| **변경 빈도** | 매우 높음 | 낮음 | 높음 |
| **데이터 양** | 대용량 | 소량 | 대용량 |
| **시간성** | 시점 기록 | 정적 | 실시간 + 이력 |

#### 2. 책임 범위

```
lwm (Logistics & WMS):
├─ 입고 프로세스 (GR)
├─ 출고 프로세스 (GI)
├─ 외부 문서 연동 (PO, SO)
└─ 재고 이동 발생 (트리거)

wms (Warehouse Management):
├─ 창고 마스터 관리
├─ 로케이션 구조 관리
├─ 창고 직원 관리
└─ 창고 설비/작업 관리

ivm (Inventory Management):
├─ 재고 현황 집계
├─ 재고 이동 이력
├─ 다양한 소스 통합 (GR, GI, TRANSFER, ADJUSTMENT)
└─ 원가 계산
```

#### 3. 데이터 흐름

```
┌─────────────┐
│    psm      │ 구매발주
│ (Purchase)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐
│     lwm     │──────▶│     ivm     │
│ goods_      │ 트리거 │ inventory_  │
│ receipts    │ 생성  │ movements   │
└──────┬──────┘      └──────┬──────┘
       │                    │
       │                    ▼
       │             ┌─────────────┐
       │             │     ivm     │
       │             │ inventory_  │
       │             │ balances    │
       │             └─────────────┘
       │
       │             ┌─────────────┐
       └────────────▶│     fim     │
                     │ (Accounting)│
                     └─────────────┘

┌─────────────┐
│     srm     │ 판매주문
│ (Sales)     │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐
│     lwm     │──────▶│     ivm     │
│ goods_      │ 트리거 │ inventory_  │
│ issues      │ 생성  │ movements   │
└─────────────┘      └─────────────┘

[참조만 함]
┌─────────────┐
│     wms     │ 창고/로케이션
│ warehouses  │ 마스터 데이터
│ locations   │
└─────────────┘
```

---

## 통합/분리 시나리오

### 시나리오 1: 완전 통합 (하나의 스키마)

```
wim (Warehouse & Inventory Management):
├── warehouses                  # from adm
├── warehouse_employees         # from adm
├── warehouse_locations         # from adm
├── goods_receipts              # from lwm
├── goods_receipt_lines         # from lwm
├── goods_issues                # from lwm
├── goods_issue_lines           # from lwm
├── inventory_balances          # from ivm
└── inventory_movements         # from ivm
```

#### 장점 ✅
- 창고/재고 관련 모든 기능 통합
- 조인 성능 향상 (동일 스키마)
- 단일 접근 권한 관리

#### 단점 ❌
- 책임 범위 불명확
- 스키마 크기 과대 (9개 테이블)
- 마스터와 트랜잭션 혼재
- 팀 분리 어려움

#### 평가: ⭐⭐ (권장하지 않음)

---

### 시나리오 2: 완전 분리 (세 개의 독립 스키마)

```
wms (Warehouse Management):
├── warehouses
├── warehouse_employees
└── warehouse_locations

lwm (Logistics Management):
├── goods_receipts
├── goods_receipt_lines
├── goods_issues
└── goods_issue_lines

ivm (Inventory Management):
├── inventory_balances
└── inventory_movements
```

#### 장점 ✅
- 책임과 경계 명확
- 각 도메인 독립 관리
- 병렬 개발 가능
- 확장성 우수

#### 단점 ❌
- 크로스 스키마 참조 증가
- 조인 복잡도 증가
- 스키마 개수 증가

#### 평가: ⭐⭐⭐⭐ (좋음, 하지만 개선 가능)

---

### 시나리오 3: 2단계 통합 (wms + lwm 통합)

```
wms (Warehouse & Logistics Management):
├── warehouses                  # 창고 마스터
├── warehouse_employees         # 창고 직원
├── warehouse_locations         # 로케이션
├── warehouse_zones             # 구역 (추가)
├── goods_receipts              # 입고
├── goods_receipt_lines         # 입고 라인
├── goods_issues                # 출고
├── goods_issue_lines           # 출고 라인
├── picking_tasks               # 피킹 작업 (추가)
└── packing_tasks               # 패킹 작업 (추가)

ivm (Inventory Management):
├── inventory_balances          # 재고 현황
└── inventory_movements         # 재고 이동 이력
```

#### 장점 ✅
- 창고 물리적 관리와 물류 프로세스 통합
- 로케이션 참조 간소화
- 창고 중심의 일관된 관리
- 스키마 개수 적절 (2개)

#### 단점 ❌
- wms가 다소 비대해짐
- 마스터와 트랜잭션 혼재

#### 평가: ⭐⭐⭐⭐⭐ (강력 권장) ✅

---

### 시나리오 4: 2단계 통합 (ivm + lwm 통합)

```
ivm (Inventory & Logistics Management):
├── goods_receipts              # 입고
├── goods_receipt_lines         # 입고 라인
├── goods_issues                # 출고
├── goods_issue_lines           # 출고 라인
├── inventory_balances          # 재고 현황
└── inventory_movements         # 재고 이동 이력

wms (Warehouse Management):
├── warehouses
├── warehouse_employees
└── warehouse_locations
```

#### 장점 ✅
- 재고 소스와 현황 통합
- 트랜잭션 일관성 향상
- wms는 순수 마스터

#### 단점 ❌
- ivm이 과도하게 비대
- "Inventory" 명칭과 입출고의 불일치
- 물류 프로세스와 재고 집계의 책임 혼재

#### 평가: ⭐⭐⭐ (보통)

---

## 최종 권장안

### ⭐⭐⭐⭐⭐ 시나리오 3: wms + lwm 통합, ivm 독립

#### 새로운 구조

```
┌─────────────────────────────────────────────────────────┐
│ wms (Warehouse & Logistics Management System)          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [창고 마스터]                                            │
│ ├── warehouses                  # 창고 기본정보         │
│ ├── warehouse_employees         # 창고 직원             │
│ ├── warehouse_types             # 창고 유형             │
│ ├── warehouse_zones             # 창고 구역 ⭐ NEW      │
│ ├── warehouse_racks             # 랙/선반 ⭐ NEW        │
│ └── warehouse_locations         # 로케이션              │
│                                                         │
│ [입고 프로세스]                                          │
│ ├── receiving                   # 입고 헤더 (renamed)   │
│ ├── receiving_items             # 입고 라인 (renamed)   │
│ └── receiving_inspections       # 입고 검수 ⭐ NEW      │
│                                                         │
│ [출고 프로세스]                                          │
│ ├── shipping                    # 출고 헤더 (renamed)   │
│ ├── shipping_items              # 출고 라인 (renamed)   │
│ ├── picking_tasks               # 피킹 작업 ⭐ NEW      │
│ └── packing_tasks               # 패킹 작업 ⭐ NEW      │
│                                                         │
│ [재고 실사]                                              │
│ ├── stock_counts                # 재고 실사 ⭐ NEW      │
│ └── stock_count_items           # 실사 상세 ⭐ NEW      │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ivm (Inventory Management)                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [재고 현황]                                              │
│ └── inventory_balances          # 재고 현황             │
│                                                         │
│ [재고 이력]                                              │
│ └── inventory_movements         # 재고 이동 이력        │
│                                                         │
│ [참조 소스]                                              │
│ - wms.receiving → movements (입고)                      │
│ - wms.shipping → movements (출고)                       │
│ - wms.stock_counts → movements (실사 조정)              │
│ - Manual adjustment → movements (수동 조정)             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 권장 이유

#### 1. 도메인 책임 명확화

**wms (Warehouse & Logistics Management)**:
- ✅ 창고의 **물리적 구조** 관리
- ✅ 창고 내 **물류 프로세스** 관리
- ✅ 입고, 출고, 피킹, 패킹 등 **창고 작업** 통합
- ✅ 실물 재고 **물리적 이동** 관리

**ivm (Inventory Management)**:
- ✅ 재고의 **논리적 현황** 관리
- ✅ 재고 **회계적 가치** 추적
- ✅ 다양한 소스의 재고 이동 **통합 이력**
- ✅ 재고 **분석 및 리포팅** 기반 제공

#### 2. 데이터 흐름 최적화

```
┌────────────┐
│    psm     │ 구매발주 생성
└─────┬──────┘
      │
      ▼
┌─────────────────────────────┐
│           wms               │
│  receiving (입고 프로세스)   │◀─── 물리적 입고 작업
│  - 검수                      │
│  - 로케이션 배정              │
│  - 라벨링                    │
└──────┬──────────────────────┘
       │
       │ 트리거/이벤트
       ▼
┌─────────────────────────────┐
│           ivm               │
│  inventory_movements (이력)  │
│  inventory_balances (현황)   │◀─── 회계/분석용 집계
└─────────────────────────────┘
```

#### 3. 네이밍 개선

**기존 lwm 테이블 → wms 테이블 (명칭 개선)**

| 기존 (lwm) | 개선 (wms) | 이유 |
|-----------|-----------|------|
| goods_receipts | **receiving** | 간결, 업계 표준 |
| goods_receipt_lines | **receiving_items** | 일관성 |
| goods_issues | **shipping** | 명확성 |
| goods_issue_lines | **shipping_items** | 일관성 |

#### 4. 확장성

**wms 추가 기능 (향후)**:
- ✅ 피킹 최적화 (Zone Picking, Wave Picking)
- ✅ 패킹 자동화
- ✅ 바코드/RFID 통합
- ✅ 반품 처리 (Returns)
- ✅ 크로스도킹 (Cross-docking)
- ✅ 재고 이동 (Transfer)

**ivm 추가 기능 (향후)**:
- ✅ 재고 예측 (Forecasting)
- ✅ 안전재고 관리
- ✅ ABC 분석
- ✅ 재고 회전율 분석
- ✅ 재고 가치 평가 (FIFO, LIFO, AVCO)

---

### 스키마 간 관계

```
┌─────────┐
│   adm   │ 공통코드, 지역정보
└────┬────┘
     │
     ▼
┌─────────┐
│   hrm   │ 직원 정보
└────┬────┘
     │
     ▼
┌─────────┐
│   crm   │ 거래처 (공급업체, 고객)
└────┬────┘
     │
     ▼
┌─────────┐
│   pim   │ 제품 정보
└────┬────┘
     │
     ├──────────────────┐
     │                  │
     ▼                  ▼
┌─────────┐        ┌─────────┐
│   psm   │        │   srm   │
│ (구매)   │        │ (판매)   │
└────┬────┘        └────┬────┘
     │                  │
     └────────┬─────────┘
              ▼
         ┌─────────┐
         │   wms   │ 입고/출고 프로세스
         │         │ (창고 + 물류)
         └────┬────┘
              │
              │ 트리거/이벤트
              ▼
         ┌─────────┐
         │   ivm   │ 재고 현황/이력
         │         │ (논리적 재고)
         └────┬────┘
              │
              ▼
         ┌─────────┐
         │   fim   │ 재무/원가
         └─────────┘
```

---

## 마이그레이션 계획

### Phase 1: 스키마 재설계 (1주)

#### Week 1: 설계 및 DDL 작성

**Day 1-2: wms 스키마 설계**
```sql
-- 1. adm에서 창고 마스터 이관
CREATE SCHEMA wms;

-- 기존 테이블 이관
CREATE TABLE wms.warehouses AS SELECT * FROM adm.warehouses;
CREATE TABLE wms.warehouse_employees AS SELECT * FROM adm.warehouse_employees;
CREATE TABLE wms.warehouse_locations AS SELECT * FROM adm.warehouse_locations;

-- 2. lwm 테이블 명칭 변경 및 이관
CREATE TABLE wms.receiving AS SELECT * FROM lwm.goods_receipts;
CREATE TABLE wms.receiving_items AS SELECT * FROM lwm.goods_receipt_lines;
CREATE TABLE wms.shipping AS SELECT * FROM lwm.goods_issues;
CREATE TABLE wms.shipping_items AS SELECT * FROM lwm.goods_issue_lines;

-- 3. 새로운 테이블 추가
CREATE TABLE wms.warehouse_zones (...);
CREATE TABLE wms.picking_tasks (...);
CREATE TABLE wms.packing_tasks (...);
CREATE TABLE wms.stock_counts (...);
CREATE TABLE wms.stock_count_items (...);
```

**Day 3-4: ivm 스키마 검토**
```sql
-- ivm은 그대로 유지
-- reference_doc_type 값 업데이트
UPDATE ivm.inventory_movements
SET reference_doc_type = 
  CASE 
    WHEN reference_doc_type = 'GR' THEN 'RECEIVING'
    WHEN reference_doc_type = 'GI' THEN 'SHIPPING'
    ELSE reference_doc_type
  END;
```

**Day 5: 외래키 및 인덱스 재생성**
```sql
-- wms 내부 외래키
ALTER TABLE wms.receiving 
  ADD CONSTRAINT fk_receiving__warehouse
  FOREIGN KEY (warehouse_id) REFERENCES wms.warehouses(id);

-- wms → 다른 스키마 참조
ALTER TABLE wms.receiving 
  ADD CONSTRAINT fk_receiving__vendor
  FOREIGN KEY (vendor_id) REFERENCES crm.customers(id);

ALTER TABLE wms.receiving_items 
  ADD CONSTRAINT fk_receiving_items__product
  FOREIGN KEY (product_id) REFERENCES pim.products(id);
```

---

### Phase 2: Backend 모델 재구성 (2주)

#### 디렉토리 구조

```python
# Before
apps/backend-api/src/api/models/tenant/
├── adm/
│   ├── warehouse.py
│   └── warehouse_location.py
├── lwm/
│   ├── goods_receipt.py
│   └── goods_issue.py
└── ivm/
    ├── inventory_balance.py
    └── inventory_movement.py

# After
apps/backend-api/src/api/models/tenant/
├── wms/
│   ├── __init__.py
│   ├── warehouse.py
│   ├── warehouse_location.py
│   ├── receiving.py          # renamed from goods_receipt
│   ├── shipping.py           # renamed from goods_issue
│   ├── picking_task.py       # NEW
│   └── packing_task.py       # NEW
└── ivm/
    ├── __init__.py
    ├── inventory_balance.py
    └── inventory_movement.py
```

#### 모델 임포트 업데이트

```python
# Before
from api.models.tenant.adm.warehouse import Warehouse
from api.models.tenant.lwm.goods_receipt import GoodsReceipt
from api.models.tenant.ivm.inventory_balance import InventoryBalance

# After
from api.models.tenant.wms.warehouse import Warehouse
from api.models.tenant.wms.receiving import Receiving
from api.models.tenant.ivm.inventory_balance import InventoryBalance
```

---

### Phase 3: API 업데이트 (1주)

#### Router 재구성

```python
# apps/backend-api/src/api/routers/tnnt/wms.py
from fastapi import APIRouter, Depends
from api.models.tenant.wms import Warehouse, Receiving, Shipping

router = APIRouter(prefix="/wms", tags=["WMS"])

@router.get("/warehouses")
async def list_warehouses(): ...

@router.post("/receiving")
async def create_receiving(): ...

@router.post("/shipping")
async def create_shipping(): ...

@router.get("/picking-tasks")
async def list_picking_tasks(): ...
```

#### API 경로 변경

```
# Before
GET  /api/v1/adm/warehouses
POST /api/v1/lwm/goods-receipts
POST /api/v1/lwm/goods-issues

# After
GET  /api/v1/wms/warehouses
POST /api/v1/wms/receiving
POST /api/v1/wms/shipping
```

---

### Phase 4: 테스트 및 검증 (1주)

#### 검증 항목

```sql
-- 1. 데이터 이관 확인
SELECT COUNT(*) FROM wms.warehouses;
SELECT COUNT(*) FROM wms.receiving;
SELECT COUNT(*) FROM wms.shipping;

-- 2. 외래키 검증
SELECT * FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'wms';

-- 3. 재고 이력 연동 확인
SELECT reference_doc_type, COUNT(*)
FROM ivm.inventory_movements
GROUP BY reference_doc_type;

-- 4. 트리거 동작 확인
-- wms.receiving 생성 시 ivm.inventory_movements 생성 여부
```

---

### Phase 5: 문서화 및 배포 (1주)

#### 문서 업데이트

```
docs/database/
├── wms_schema.md               # WMS 스키마 상세 (NEW)
│   ├── 창고 마스터
│   ├── 입출고 프로세스
│   ├── 피킹/패킹
│   └── 재고 실사
├── ivm_schema.md               # IVM 스키마 상세 (UPDATE)
│   ├── 재고 현황
│   └── 재고 이력
└── migration_lwm_to_wms.md     # 마이그레이션 가이드
```

#### CLAUDE.md 업데이트

```markdown
**Tenant Models:**
- `hrm` - Human Resources Management (인사관리)
- `crm` - Customer Relationship Management (고객관계관리)
- `pim` - Product Information Management (제품정보관리)
- `wms` - Warehouse & Logistics Management (창고/물류관리) ⭐ NEW
- `ivm` - Inventory Management (재고관리)
- `apm` - Approval/Workflow Management (결재/워크플로우)
- `adm` - Common Administration (공통 기준정보)
- `psm` - Procurement/Purchasing (구매관리)
- `srm` - Sales/Revenue Management (판매관리)
- `asm` - Asset/After-Sales Management (A/S관리)
- `fim` - Finance/Accounting (재무회계)
- `bim` - BI/Analytics (분석)
- `com` - Communication (메시징)
- `sys` - System Configuration (시스템)

[DEPRECATED]
- `lwm` - Logistics & WMS → **통합됨: wms**
```

---

## 총 소요 기간

**5주 (약 1.5개월)**

| Phase | 작업 내용 | 기간 |
|-------|----------|------|
| 1 | 스키마 재설계 | 1주 |
| 2 | Backend 모델 재구성 | 2주 |
| 3 | API 업데이트 | 1주 |
| 4 | 테스트 및 검증 | 1주 |
| 5 | 문서화 및 배포 | 1주 |

---

## 결론

### 최종 권장: 시나리오 3 (wms + lwm 통합, ivm 독립)

#### 핵심 이유

1. ✅ **도메인 책임 명확**
   - wms: 창고의 물리적 관리 + 물류 프로세스
   - ivm: 재고의 논리적 현황 + 회계적 추적

2. ✅ **업계 표준 부합**
   - WMS (Warehouse Management System) = 창고 + 물류
   - IMS (Inventory Management System) = 재고 집계 + 분석

3. ✅ **확장성 확보**
   - wms: 피킹/패킹/크로스도킹 등 물류 고도화
   - ivm: ABC분석, 예측, 최적화 등 재고 분석

4. ✅ **팀 분리 용이**
   - 창고/물류팀 → wms 관리
   - 재고관리팀 → ivm 관리

5. ✅ **성능 최적화**
   - wms: 트랜잭션 최적화 (입출고 처리 속도)
   - ivm: 분석 최적화 (대용량 집계 쿼리)

### 다음 단계

1. ✅ 이 분석 문서 검토 및 승인
2. ✅ Phase 1 시작: wms 스키마 DDL 작성
3. ✅ 점진적 마이그레이션 진행

---

**문서 끝**
