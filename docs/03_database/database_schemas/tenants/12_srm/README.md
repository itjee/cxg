# SRM 스키마 (판매 및 수익 관리)

## 개요
판매 및 수익 관리 스키마로, 견적, 판매주문(수주), 출고/배송, 송장, 반품 프로세스를 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_quotations.sql** - 판매 견적서 헤더
3. **02_quotation_items.sql** - 판매 견적서 품목
4. **03_sales_orders.sql** - 판매주문 헤더
5. **04_sales_order_items.sql** - 판매주문 품목
6. **05_sales_deliveries.sql** - 판매 출고/배송 헤더
7. **06_sales_delivery_items.sql** - 판매 출고/배송 품목
8. **07_sales_invoices.sql** - 판매 송장/세금계산서 헤더
9. **08_sales_invoice_items.sql** - 판매 송장/세금계산서 품목
10. **09_sales_returns.sql** - 판매 반품 헤더
11. **10_sales_return_items.sql** - 판매 반품 품목

## 테이블 상세

### 1. quotations (판매 견적서)
견적 헤더 정보 관리
- 견적 코드 (quote_code)
- 고객 정보 (customer_id)
- 전표 일자 (doc_date)
- 유효기간 만료일 (valid_until)
- 영업 담당자 (sales_person_id)
- 총 금액 (total_amount)
- 통화 (currency)
- 상태 (DRAFT/SENT/ACCEPTED/REJECTED/EXPIRED)

### 2. quotation_items (판매 견적서 품목)
견적 품목 상세 정보 관리
- 견적 헤더 참조 (quote_id)
- 라인 번호 (line_no)
- 제품 정보 (product_id)
- 품목 설명 (description)
- 견적 수량 (qty)
- 단가 (unit_price)
- 할인율 (discount_rate)
- 총 금액 (total_amount)

### 3. sales_orders (판매주문)
판매주문 헤더 정보 관리
- 판매주문 코드 (so_code)
- 고객 정보 (customer_id)
- 전표 일자 (doc_date)
- 납품 희망일 (delivery_date)
- 출고 창고 (warehouse_id)
- 영업 담당자 (sales_person_id)
- 결제 조건 (payment_terms)
- 총 금액 (total_amount)
- 통화 (currency)
- 상태 (DRAFT/CONFIRMED/PROCESSING/SHIPPED/COMPLETED/CANCELLED)

### 4. sales_order_items (판매주문 품목)
판매주문 품목 상세 정보 관리
- 판매주문 헤더 참조 (so_id)
- 라인 번호 (line_no)
- 제품 정보 (product_id)
- 품목 설명 (description)
- 주문 수량 (qty)
- 단가 (unit_price)
- 할인율 (discount_rate)
- 총 금액 (total_amount)
- 출고 완료 수량 (shipped_qty)

### 5. sales_deliveries (판매 출고/배송)
출고 및 배송 헤더 정보 관리
- 출고 코드 (delivery_code)
- 판매주문 참조 (so_id)
- 고객 정보 (customer_id)
- 전표 일자 (doc_date)
- 실제 배송일 (delivery_date)
- 출고 창고 (warehouse_id)
- 송장 번호 (tracking_no)
- 배송업체 (carrier)
- 배송 주소 (shipping_address)
- 배송 연락처 (shipping_contact)
- 상태 (DRAFT/CONFIRMED/PACKED/SHIPPED/DELIVERED/CANCELLED)

### 6. sales_delivery_items (판매 출고/배송 품목)
출고 품목 상세 정보 관리
- 출고 헤더 참조 (delivery_id)
- 라인 번호 (line_no)
- 판매주문 품목 참조 (so_item_id)
- 제품 정보 (product_id)
- 품목 설명 (description)
- 출고 수량 (qty)

### 7. sales_invoices (판매 송장/세금계산서)
송장 및 세금계산서 헤더 정보 관리
- 송장 코드 (invoice_code)
- 송장 유형 (invoice_type: INVOICE/TAX_INVOICE/CREDIT_NOTE)
- 판매주문 참조 (so_id)
- 출고 참조 (delivery_id)
- 고객 정보 (customer_id)
- 전표 일자 (doc_date)
- 지급 기한일 (due_date)
- 세금계산서 번호 (tax_invoice_no)
- 발행일 (issue_date)
- 공급가액 (subtotal)
- 세액 (tax_amount)
- 합계 금액 (total_amount)
- 통화 (currency)
- 상태 (DRAFT/CONFIRMED/ISSUED/PAID/CANCELLED)

### 8. sales_invoice_items (판매 송장/세금계산서 품목)
송장 품목 상세 정보 관리
- 송장 헤더 참조 (invoice_id)
- 라인 번호 (line_no)
- 출고 품목 참조 (delivery_item_id)
- 제품 정보 (product_id)
- 품목 설명 (description)
- 청구 수량 (qty)
- 단가 (unit_price)
- 할인율 (discount_rate)
- 공급가액 (subtotal)
- 세율 (tax_rate)
- 세액 (tax_amount)
- 합계 금액 (total_amount)

### 9. sales_returns (판매 반품)
반품 헤더 정보 관리
- 반품 코드 (return_code)
- 반품 유형 (return_type: RETURN/EXCHANGE/DEFECT)
- 판매주문 참조 (so_id)
- 출고 참조 (delivery_id)
- 송장 참조 (invoice_id)
- 고객 정보 (customer_id)
- 전표 일자 (doc_date)
- 실제 반품일 (return_date)
- 입고 창고 (warehouse_id)
- 반품 사유 코드 (reason_code)
- 반품 사유 설명 (reason_desc)
- 총 금액 (total_amount)
- 통화 (currency)
- 상태 (DRAFT/CONFIRMED/RECEIVED/REFUNDED/CANCELLED)

### 10. sales_return_items (판매 반품 품목)
반품 품목 상세 정보 관리
- 반품 헤더 참조 (return_id)
- 라인 번호 (line_no)
- 출고 품목 참조 (delivery_item_id)
- 제품 정보 (product_id)
- 품목 설명 (description)
- 반품 수량 (qty)
- 단가 (unit_price)
- 할인율 (discount_rate)
- 총 금액 (total_amount)
- 반품 사유 코드 (reason_code)
- 반품 사유 설명 (reason_desc)

## 외래키 관계

```
-- 견적
quotations (customer_id) -> crm.customers (id)  [RESTRICT]
quotations (sales_person_id) -> hrm.employees (id)  [SET NULL]
quotation_items (quote_id) -> quotations (id)  [CASCADE]
quotation_items (product_id) -> pim.products (id)  [RESTRICT]

-- 판매주문
sales_orders (customer_id) -> crm.customers (id)  [RESTRICT]
sales_orders (warehouse_id) -> wms.warehouses (id)  [SET NULL]
sales_orders (sales_person_id) -> hrm.employees (id)  [SET NULL]
sales_order_items (so_id) -> sales_orders (id)  [CASCADE]
sales_order_items (product_id) -> pim.products (id)  [RESTRICT]

-- 출고/배송
sales_deliveries (so_id) -> sales_orders (id)  [RESTRICT]
sales_deliveries (customer_id) -> crm.customers (id)  [RESTRICT]
sales_deliveries (warehouse_id) -> wms.warehouses (id)  [RESTRICT]
sales_delivery_items (delivery_id) -> sales_deliveries (id)  [CASCADE]
sales_delivery_items (so_item_id) -> sales_order_items (id)  [RESTRICT]
sales_delivery_items (product_id) -> pim.products (id)  [RESTRICT]

-- 송장/세금계산서
sales_invoices (so_id) -> sales_orders (id)  [SET NULL]
sales_invoices (delivery_id) -> sales_deliveries (id)  [SET NULL]
sales_invoices (customer_id) -> crm.customers (id)  [RESTRICT]
sales_invoice_items (invoice_id) -> sales_invoices (id)  [CASCADE]
sales_invoice_items (delivery_item_id) -> sales_delivery_items (id)  [SET NULL]
sales_invoice_items (product_id) -> pim.products (id)  [RESTRICT]

-- 반품
sales_returns (so_id) -> sales_orders (id)  [SET NULL]
sales_returns (delivery_id) -> sales_deliveries (id)  [SET NULL]
sales_returns (invoice_id) -> sales_invoices (id)  [SET NULL]
sales_returns (customer_id) -> crm.customers (id)  [RESTRICT]
sales_returns (warehouse_id) -> wms.warehouses (id)  [RESTRICT]
sales_return_items (return_id) -> sales_returns (id)  [CASCADE]
sales_return_items (delivery_item_id) -> sales_delivery_items (id)  [SET NULL]
sales_return_items (product_id) -> pim.products (id)  [RESTRICT]
```

## 주요 특징

### 판매 프로세스 흐름
```
견적 (Quotation)
  ↓
판매주문 (Sales Order)
  ↓
출고/배송 (Delivery)
  ↓
송장/세금계산서 (Invoice)
  ↓
반품 (Return) - 선택적
```

### 1. 견적 프로세스
- DRAFT: 임시저장
- SENT: 고객에게 발송
- ACCEPTED: 고객 수락
- REJECTED: 고객 거절
- EXPIRED: 유효기한 만료

### 2. 판매주문 프로세스
- DRAFT: 임시저장
- CONFIRMED: 확정
- PROCESSING: 처리중
- SHIPPED: 출하완료
- COMPLETED: 완료
- CANCELLED: 취소

### 3. 출고/배송 프로세스
- DRAFT: 임시저장
- CONFIRMED: 확정
- PACKED: 포장완료
- SHIPPED: 출고완료
- DELIVERED: 배송완료
- CANCELLED: 취소

### 4. 송장 프로세스
- DRAFT: 임시저장
- CONFIRMED: 확정
- ISSUED: 발행완료
- PAID: 결제완료
- CANCELLED: 취소

### 5. 반품 프로세스
- DRAFT: 임시저장
- CONFIRMED: 확정
- RECEIVED: 입고완료
- REFUNDED: 환불완료
- CANCELLED: 취소

### 수량 추적
**판매주문 품목:**
- qty: 주문 수량
- shipped_qty: 출고 완료 수량
- 미출고 수량 = qty - shipped_qty

**부분 출고 지원:**
- 하나의 판매주문에 대해 여러 번 출고 가능
- 각 출고는 출고 수량만큼 sales_order_items.shipped_qty 증가

**부분 송장 지원:**
- 하나의 출고에 대해 여러 송장 생성 가능
- 출고 없이 직접 송장 발행도 가능 (서비스 판매 등)

### 송장 유형
- INVOICE: 일반 송장
- TAX_INVOICE: 세금계산서 (한국 부가세 포함)
- CREDIT_NOTE: 대변표 (환불/조정)

### 반품 유형
- RETURN: 일반 반품 (환불)
- EXCHANGE: 교환
- DEFECT: 불량 반품

## DDL 작성 표준
모든 파일은 `/docs/prompts/ddl_standard_prompt.md`의 표준을 따릅니다:

- ✅ 표준 컬럼 형식 (id, created_at, created_by, updated_at, updated_by)
- ✅ 짧은 네이밍 규칙 (code, name, name_en)
- ✅ 테이블명 변경: `_lines` → `_items` (품목 테이블)
- ✅ 줄 주석 및 정렬
- ✅ COMMENT ON 문 작성
- ✅ 인덱스 및 제약조건 주석
- ✅ 외래키 제약조건 및 삭제 옵션

## 작성 이력
- 2025-01-20: 초기 작성
- 2025-10-22: 표준 형식 적용 및 테이블 분리
- 2025-10-24: 테이블명 변경 (_lines → _items) 및 추가 테이블 생성 (출고/배송, 송장, 반품)


## 테이블 상세

### 1. quotations (견적)
견적 헤더 정보 관리
- 견적 번호 자동 생성
- 견적 일자 및 유효 기한
- 고객 정보 (customer_id)
- 영업 담당자 (sales_rep_id)
- 영업 부서 (department_id)
- 견적 유형 (STANDARD/COMPETITIVE/REVISED/RENEWAL)
- 우선순위 (URGENT/HIGH/NORMAL/LOW)
- 제목 및 설명
- 첨부파일 URL
- 배송 정보
  - 배송지 주소
  - 납기 희망일
  - 배송 조건 (delivery_terms)
- 결제 조건
  - 결제 조건 (payment_terms)
  - 결제 방법 (payment_method)
- 결재 정보
  - 결재선 (approval_line_id)
  - 결재 상태 (approval_status)
  - 승인자 (approved_by)
  - 승인일 (approved_at)
- 상태 관리 (DRAFT/PENDING/APPROVED/REJECTED/SENT/ACCEPTED/DECLINED/EXPIRED/ORDERED)
- 총 금액 정보
  - 소계 (subtotal_amount)
  - 할인 (discount_amount)
  - 세액 (tax_amount)
  - 총액 (total_amount)
  - 통화 코드

### 2. quotation_lines (견적 상세)
견적 품목 상세 정보 관리
- 견적 헤더 참조
- 라인 번호
- 제품 정보 (product_id)
- 수량 및 단위 (unit_id)
- 납기 희망일
- 단가 및 금액
  - 정가 (list_price)
  - 판매가 (unit_price)
  - 할인율 (discount_rate)
  - 할인액 (discount_amount)
  - 세율 (tax_rate)
  - 세액 (tax_amount)
  - 라인 총액 (line_amount)
- 사양 및 비고
- 수주 정보
  - 수주 수량 (ordered_qty)
  - 출고 수량 (shipped_qty)
- 상태 관리 (PENDING/ORDERED/PARTIALLY_SHIPPED/SHIPPED/CANCELLED)

### 3. sales_orders (판매주문/수주)
판매주문 헤더 정보 관리
- 판매주문 번호 자동 생성
- 수주 일자 및 납기 희망일
- 고객 정보 (customer_id)
- 영업 담당자 (sales_rep_id)
- 영업 부서 (department_id)
- 견적 참조 (quotation_id)
- 수주 유형 (STANDARD/CONTRACT/RUSH/CONSIGNMENT)
- 우선순위
- 제목 및 설명
- 배송 정보
  - 배송지 주소
  - 납기 희망일
  - 배송 조건
  - 창고 (warehouse_id)
- 결제 조건
  - 결제 조건
  - 결제 방법
- 결재 정보
- 상태 관리 (DRAFT/PENDING/APPROVED/REJECTED/CONFIRMED/PICKING/PACKING/SHIPPED/DELIVERED/INVOICED/CANCELLED/CLOSED)
- 총 금액 정보
  - 소계
  - 할인
  - 세액
  - 총액
  - 통화 코드

### 4. sales_order_lines (판매주문 상세)
판매주문 품목 상세 정보 관리
- 판매주문 헤더 참조
- 견적 라인 참조 (quotation_line_id)
- 라인 번호
- 제품 정보
- 수량 및 단위
- 납기 희망일
- 단가 및 금액
  - 정가
  - 판매가
  - 할인율
  - 할인액
  - 세율
  - 세액
  - 라인 총액
- 사양 및 비고
- 출고 정보
  - 출고 수량 (shipped_qty)
  - 미출고 수량 (pending_qty)
- 상태 관리 (PENDING/CONFIRMED/PICKING/PACKING/SHIPPED/DELIVERED/INVOICED/CANCELLED/CLOSED)

## 외래키 관계

```
quotations (customer_id) -> crm.partners (id)  [RESTRICT]
quotations (sales_rep_id) -> hrm.employees (id)  [RESTRICT]
quotations (department_id) -> hrm.departments (id)  [SET NULL]
quotations (approval_line_id) -> apm.approval_lines (id)  [SET NULL]
quotations (approved_by) -> hrm.employees (id)  [SET NULL]
quotations (currency_code) -> adm.currencies (code)  [RESTRICT]
quotation_lines (quotation_id) -> quotations (id)  [CASCADE]
quotation_lines (product_id) -> pim.products (id)  [RESTRICT]
quotation_lines (unit_id) -> adm.units (id)  [RESTRICT]
sales_orders (customer_id) -> crm.partners (id)  [RESTRICT]
sales_orders (sales_rep_id) -> hrm.employees (id)  [RESTRICT]
sales_orders (department_id) -> hrm.departments (id)  [SET NULL]
sales_orders (quotation_id) -> quotations (id)  [SET NULL]
sales_orders (warehouse_id) -> wms.warehouses (id)  [SET NULL]
sales_orders (approval_line_id) -> apm.approval_lines (id)  [SET NULL]
sales_orders (approved_by) -> hrm.employees (id)  [SET NULL]
sales_orders (currency_code) -> adm.currencies (code)  [RESTRICT]
sales_order_lines (so_id) -> sales_orders (id)  [CASCADE]
sales_order_lines (quotation_line_id) -> quotation_lines (id)  [SET NULL]
sales_order_lines (product_id) -> pim.products (id)  [RESTRICT]
sales_order_lines (unit_id) -> adm.units (id)  [RESTRICT]
```

## 주요 특징

### 판매 프로세스
1. **견적 (Quotation)**
   - 견적 생성: DRAFT
   - 제출: PENDING
   - 결재: APPROVED/REJECTED
   - 고객 발송: SENT
   - 고객 응답: ACCEPTED/DECLINED
   - 유효기한 만료: EXPIRED
   - 수주 전환: ORDERED
   
2. **판매주문 (Sales Order)**
   - 수주 생성: DRAFT
   - 제출: PENDING
   - 결재: APPROVED/REJECTED
   - 수주 확정: CONFIRMED
   - 출고 진행: PICKING → PACKING → SHIPPED
   - 배송 완료: DELIVERED
   - 청구: INVOICED
   - 종결: CLOSED

### 결재 연동
- 결재선(approval_line) 연동
- 결재 상태(approval_status) 추적
- 승인자 및 승인일 기록

### 견적 → 수주 연계
- 견적에서 수주 생성
- 수주에서 견적 추적 (quotation_id)
- 수주 라인에서 견적 라인 추적 (quotation_line_id)
- 수주/출고 수량 추적

### 금액 계산
**견적/판매주문 공통:**
```
line_amount = (quantity × unit_price) × (1 - discount_rate) + tax_amount
subtotal = Σ(quantity × unit_price)
total_discount = Σ(discount_amount)
total_tax = Σ(tax_amount)
total_amount = subtotal - total_discount + total_tax
```

### 수량 추적
**견적 라인:**
- quantity: 견적 수량
- ordered_qty: 수주된 수량
- shipped_qty: 출고된 수량

**판매주문 라인:**
- quantity: 수주 수량
- shipped_qty: 출고된 수량
- pending_qty: 미출고 수량 (= quantity - shipped_qty)

### 우선순위
- URGENT: 긴급
- HIGH: 높음
- NORMAL: 보통
- LOW: 낮음

### 견적 유형
- STANDARD: 일반 견적
- COMPETITIVE: 경쟁 입찰
- REVISED: 수정 견적
- RENEWAL: 재견적

### 수주 유형
- STANDARD: 일반 수주
- CONTRACT: 계약 수주
- RUSH: 긴급 수주
- CONSIGNMENT: 위탁 판매

## DDL 작성 표준
모든 파일은 `/docs/prompts/ddl_standard_prompt.md`의 표준을 따릅니다:

- ✅ 표준 컬럼 형식 (id, created_at, created_by, updated_at, updated_by)
- ✅ 짧은 네이밍 규칙 (code, name, name_en)
- ✅ 줄 주석 및 정렬
- ✅ COMMENT ON 문 작성
- ✅ 인덱스 및 제약조건 주석
- ✅ 외래키 제약조건 및 삭제 옵션

## 작성 이력
- 2025-01-20: 초기 작성
- 2025-10-22: 표준 형식 적용 및 테이블 분리
