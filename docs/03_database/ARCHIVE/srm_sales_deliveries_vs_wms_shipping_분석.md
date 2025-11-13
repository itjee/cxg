# srm.sales_deliveries vs wms.shipping 역할 비교 분석

**분석 일시**: 2025-10-24
**질문**: 12_srm/05_sales_deliveries와 05_wms/06_shipping은 서로 다른 역할인가?

---

## 📊 빠른 비교

| 항목 | **srm.sales_deliveries** | **wms.shipping** |
|------|------------------------|------------------|
| **스키마** | srm (판매) | wms (창고) |
| **주요 목적** | 판매 관점의 배송 관리 | 창고 관점의 출고 작업 |
| **비즈니스 도메인** | 영업/판매 | 창고/물류 |
| **상태값** | 6개 (DRAFT→DELIVERED) | 4개 (DRAFT→COMPLETED) |
| **추적 정보** | ✅ 송장번호, 배송업체, 배송주소 | ❌ 없음 |
| **배송일 기록** | ✅ delivery_date | ❌ 없음 |
| **피킹 담당자** | ❌ 없음 | ✅ picker_id |
| **배송지 정보** | ✅ shipping_address, shipping_contact | ❌ 없음 |
| **관계도** | SO → 배송 (고객 중심) | 창고 재고 → 출고 (물류 중심) |

**✅ 결론: 명확하게 다른 역할이다!**

---

## 🎯 상세 비교

### 1. 목적 (Purpose)

#### srm.sales_deliveries
```
판매 프로세스의 "배송" 단계
주문(SO) → 출고 → [배송업체 위탁] → 배송 중 → 배송 완료
         (sales_deliveries 담당)
```

- **고객 중심**: 고객에게 제품을 어떻게 배송할 것인가?
- **배송 추적**: 송장번호, 배송업체, 배송일 추적
- **판매 완결**: 배송 완료 = 판매 프로세스 완료
- **생명주기**: DRAFT → CONFIRMED → PACKED → SHIPPED → DELIVERED

#### wms.shipping
```
창고 운영의 "출고 작업" 단계
내부 재고 관리 → 피킹 및 포장 → 출고 → [판매부서로 전달]
            (shipping 담당)
```

- **창고 중심**: 창고에서 어떻게 상품을 꺼낼 것인가?
- **작업 지시**: 피킹 담당자 지정, 수량 관리
- **창고 운영**: 재고에서 제품을 물리적으로 꺼내는 작업
- **생명주기**: DRAFT → CONFIRMED → COMPLETED

---

### 2. 데이터 구조 비교

#### srm.sales_deliveries (판매 배송)
```sql
CREATE TABLE srm.sales_deliveries
(
    id                  UUID PRIMARY KEY,
    delivery_code       VARCHAR(50),       -- 배송 문서 번호
    so_id               UUID,              -- 판매주문 연결
    customer_id         UUID,              -- 고객 직접 참조
    doc_date            DATE,              -- 문서 일자
    delivery_date       DATE,              -- ✅ 실제 배송 완료일
    warehouse_id        UUID,              -- 출고 창고

    -- 배송업체 정보 (판매 배송 특화)
    tracking_no         VARCHAR(100),      -- ✅ 송장번호
    carrier             VARCHAR(100),      -- ✅ 배송업체명
    shipping_address    TEXT,              -- ✅ 배송 주소
    shipping_contact    VARCHAR(100),      -- ✅ 연락처

    -- 판매 프로세스 상태
    status              VARCHAR(20),       -- DRAFT, CONFIRMED, PACKED, SHIPPED, DELIVERED

    notes               TEXT
);
```

**특징**:
- 송장번호, 배송업체 등 **배송 추적 정보 풍부**
- 배송 주소, 연락처 등 **배송지 정보 포함**
- delivery_date로 **실제 배송 완료 시점 기록**
- 6단계 상태로 **배송 프로세스 상세 추적**

#### wms.shipping (창고 출고)
```sql
CREATE TABLE wms.shipping
(
    id                  UUID PRIMARY KEY,
    gi_code             VARCHAR(50),       -- 출고 코드
    so_id               UUID,              -- 판매주문 참조 (선택사항)
    customer_id         UUID,              -- 고객 참조 (선택사항)
    doc_date            DATE,              -- 문서 일자
    warehouse_id        UUID,              -- 출고 창고

    -- 창고 작업 정보 (WMS 특화)
    picker_id           UUID,              -- ✅ 피킹 담당자
    total_qty           INTEGER,           -- ✅ 총 피킹 수량

    -- 창고 운영 상태
    status              VARCHAR(20)        -- DRAFT, CONFIRMED, COMPLETED, CANCELLED
);
```

**특징**:
- picker_id로 **창고 직원 지정**
- total_qty로 **피킹 수량 추적**
- 배송 추적 정보 **없음** (창고 운영 내부 문제)
- 4단계 상태로 **창고 작업만 추적**

---

### 3. 비즈니스 프로세스에서의 위치

```
판매 프로세스 전체 흐름
═══════════════════════════════════════════════════════════════

① 고객 주문
   ↓
② 판매주문 생성 (srm.sales_orders)
   ↓
③ 보관 위치에서 피킹 작업 필요
   ├─→ [WMS 창고 작업]
   │   ├─→ wms.shipping 생성 (DRAFT)
   │   ├─→ 피커가 지정된 상품 피킹 (wms.shipping_items)
   │   ├─→ 포장 및 준비 (CONFIRMED)
   │   └─→ 출고 완료 (COMPLETED)
   │
   └─→ [판매 배송 추적]
       ├─→ srm.sales_deliveries 생성 (DRAFT)
       ├─→ 배송 준비 및 확정 (CONFIRMED)
       ├─→ 포장 완료 (PACKED)
       ├─→ 배송업체에 전달/출고 (SHIPPED)
       │   └─→ 송장번호 입력
       │   └─→ 배송업체 선택
       └─→ 배송 완료 (DELIVERED)
           └─→ 고객 배송 완료

④ 인보이스 발행 (fim.tax_invoices)
   ↓
⑤ 결제 처리
```

---

### 4. 역할 정의

#### ✅ srm.sales_deliveries의 역할
1. **판매 배송 문서 관리**: 판매주문에 기반한 배송 문서 생성
2. **배송 추적**: 송장번호와 배송업체를 통한 배송 추적
3. **배송 완결**: 고객에게 제품이 실제로 도착했는지 확인
4. **판매 프로세스 종료**: "배송 완료"로 판매 프로세스 종료 신호
5. **청구 및 수익 인식**: 배송 정보를 기반으로 인보이스 발행

**관계 주체**: `고객(customer)` ↔ `배송(delivery)`

#### ✅ wms.shipping의 역할
1. **창고 출고 작업 관리**: 보관된 상품을 물리적으로 꺼내는 작업
2. **피킹 작업 지시**: 창고 직원에게 피킹 업무 할당
3. **재고 이동**: 창고 재고에서 "출고됨" 상태로 변경
4. **창고 작업 완료**: 출고 프로세스 완료 시 inventory 업데이트
5. **작업 효율성 추적**: 피킹 담당자별 작업량 관리

**관계 주체**: `창고(warehouse)` ↔ `재고(inventory)`

---

### 5. 데이터 흐름 예시

#### 시나리오: 고객 A가 제품 10개 주문

```
Step 1: 판매주문 생성
────────────────────
SO-2025-001 생성
- customer: A
- items: 제품 10개
- status: CONFIRMED

Step 2: 창고 작업 시작 [WMS 도메인]
────────────────────────────
wms.shipping 생성
- gi_code: GI-2025-001
- so_id: SO-2025-001
- warehouse_id: 창고1
- picker_id: 직원1 (할당)
- total_qty: 10
- status: DRAFT

wms.shipping_items 생성
- 제품1: 10개

창고 직원이 실제 피킹 작업 수행
↓
wms.shipping status → CONFIRMED
↓
wms.inventory 업데이트
(창고1의 제품1 재고: 100 → 90)

Step 3: 배송 준비 [SRM 도메인]
──────────────────────
srm.sales_deliveries 생성
- delivery_code: SD-2025-001
- so_id: SO-2025-001
- customer_id: A
- warehouse_id: 창고1
- shipping_address: 고객 주소
- status: DRAFT

Step 4: 배송업체 선택 및 출고
──────────────────────────
srm.sales_deliveries 업데이트
- carrier: "택배사 B"
- tracking_no: "1234567890"
- status: SHIPPED

Step 5: 배송 완료
───────────
srm.sales_deliveries 업데이트
- delivery_date: 2025-10-25
- status: DELIVERED

→ 고객은 배송 추적으로 자신의 제품 배송 상태를 확인 가능
→ 영업 팀은 매출 인식 및 인보이스 발행 가능
```

---

### 6. 사용하는 사람/시스템

#### srm.sales_deliveries 사용자
- 📊 **판매팀/영업팀**: 고객에게 언제 배송될지 확인
- 📦 **배송 담당자**: 배송 준비 및 배송사 선택
- 💼 **재무팀**: 배송 완료 후 매출 인식 및 인보이스 발행
- 👤 **고객**: 배송 추적 (송장번호)

#### wms.shipping 사용자
- 👷 **창고 직원/피커**: "어떤 상품을 피킹할지" 지시받음
- 📈 **창고 관리자**: 피킹 효율, 처리량 모니터링
- 🏭 **재고 관리 시스템**: 자동으로 재고 감소 처리

---

### 7. 독립적인 이유

#### Q: 왜 두 테이블이 필요한가?

**답**: 비즈니스 프로세스의 두 가지 관점을 다루기 때문

```
┌─ SRM (판매 관점): "고객에게 어떻게 배송할 것인가?"
│  └─ sales_deliveries: 배송 추적, 고객 서비스
│
└─ WMS (물류 관점): "창고에서 어떻게 꺼낼 것인가?"
   └─ shipping: 재고 관리, 창고 작업
```

1. **도메인 분리**: 각 도메인의 관심사가 다름
2. **독립적 라이프사이클**:
   - wms.shipping: 창고 내부 작업 (COMPLETED로 끝)
   - srm.sales_deliveries: 배송 완료까지 (DELIVERED로 끝)
3. **다양한 배송 방식**:
   - 고객이 직접 픽업: wms.shipping만 필요
   - 3자 배송: 둘 다 필요
   - 내부 이전: wms.shipping만 필요
4. **감사 추적**: 각 도메인의 기록 독립 유지

---

### 8. 관계도

```
srm.sales_orders
    ↓ 1:N
    ├─→ srm.sales_deliveries (배송 관점)
    │   ├─ carrier: "DHL"
    │   ├─ tracking_no: "1234567"
    │   └─ shipping_address: "서울시..."
    │
    └─→ wms.shipping (창고 관점, 선택적)
        ├─ picker_id: 직원1
        ├─ total_qty: 10
        └─ status: COMPLETED
```

**중요**: 둘은 같은 SO에서 나왔지만, 각각 독립적으로 진행된다!

---

## 🎓 최종 결론

### ✅ YES, 서로 다른 역할이다!

| 항목 | 설명 |
|------|------|
| **srm.sales_deliveries** | 🚚 **배송 추적 중심**: 고객 관점, 배송 상태 추적, 송장번호 관리 |
| **wms.shipping** | 🏭 **창고 작업 중심**: 물류 관점, 재고 출고, 피킹 작업 관리 |

### 관계
- **독립적이지만 연관됨**: 같은 SO에서 나왔으나 다른 프로세스
- **선택적 관계**: wms.shipping이 없을 수도 있음 (픽업, 3자배송 등)
- **순차적 진행**: wms.shipping → srm.sales_deliveries 순서

### 추천
- **현재 설계 유지**: 두 테이블 모두 필요하며 역할이 명확함
- **필드 검토 불필요**: 각각 자신의 도메인에 필요한 필드만 가짐
- **외래키 추가 검토**: 필요시 srm.sales_deliveries → wms.shipping 연결 고려

---

## 참고: 테이블 필드 체크리스트

### srm.sales_deliveries가 가지는 것
- ✅ 송장번호 (tracking_no)
- ✅ 배송업체 (carrier)
- ✅ 배송주소 (shipping_address)
- ✅ 배송 연락처 (shipping_contact)
- ✅ 배송일 (delivery_date)

### wms.shipping이 가지는 것
- ✅ 피킹 담당자 (picker_id)
- ✅ 총 수량 (total_qty)
- ✅ 창고 특화 상태 (DRAFT → COMPLETED)

### 둘 다 가지는 것
- ✅ so_id (판매주문 연결)
- ✅ customer_id
- ✅ warehouse_id
- ✅ doc_date
- ✅ status
- ✅ is_deleted
