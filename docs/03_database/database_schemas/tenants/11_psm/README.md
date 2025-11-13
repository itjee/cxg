# PSM 스키마 (구매 관리)

## 개요
구매 관리 스키마로, 구매요청, 견적, 발주, 입고 전체 프로세스를 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_purchase_requisitions.sql** - 구매요청 헤더 테이블
3. **02_purchase_requisition_items.sql** - 구매요청 품목 테이블
4. **03_purchase_orders.sql** - 구매발주 헤더 테이블
5. **04_purchase_order_items.sql** - 구매발주 품목 테이블
6. **05_purchase_quotations.sql** - 구매 견적 헤더 테이블
7. **06_purchase_quotation_items.sql** - 구매 견적 품목 테이블
8. **07_purchase_price_agreements.sql** - 구매 가격 계약 테이블
9. **08_purchase_order_pr_links.sql** - 구매요청-발주 연결 테이블
10. **09_purchase_order_receipts.sql** - 구매발주 입고 헤더 테이블
11. **10_purchase_order_receipt_items.sql** - 구매발주 입고 품목 테이블

## 테이블 상세

### 1. purchase_requisitions (구매요청 헤더)
구매요청 헤더 정보 관리
- 구매요청 번호, 요청 일자
- 상태: DRAFT → SUBMITTED → APPROVED → ORDERED

### 2. purchase_requisition_items (구매요청 품목)
구매요청 품목 상세 정보 관리
- 라인 번호, 제품, 수량, 단가, 총 금액
- 필요 일자

### 3. purchase_orders (구매발주 헤더)
구매발주 헤더 정보 관리
- 발주 번호, 발주 일자, 공급업체
- 상태: DRAFT → APPROVED → ORDERED → RECEIVING → COMPLETED

### 4. purchase_order_items (구매발주 품목)
구매발주 품목 상세 정보 관리
- 라인 번호, 제품, 발주 수량, 단가
- 입고 완료 수량 추적

### 5. purchase_quotations (구매 견적 헤더)
구매 견적 헤더 정보 관리
- 견적 번호, 견적 일자, 공급업체
- 유효 기간 (valid_from ~ valid_to)
- 상태: DRAFT → SUBMITTED → REVIEWED → SELECTED/REJECTED/EXPIRED
- 선택된 견적은 발주로 전환

### 6. purchase_quotation_items (구매 견적 품목)
구매 견적 품목 상세 정보 관리
- 라인 번호, 제품, 수량, 단가
- 납기 (lead_time_days), 최소 주문 수량

### 7. purchase_price_agreements (구매 가격 계약)
공급업체별 제품 단가 계약 관리
- 계약 번호, 계약 일자
- 공급업체-제품별 단가, 최소 주문 수량
- 계약 유효 기간
- 상태: DRAFT → ACTIVE → EXPIRED/TERMINATED

### 8. purchase_order_pr_links (구매요청-발주 연결)
구매요청과 발주 간 연결 관리
- 하나의 PR이 여러 PO로 분할 가능
- PO 품목과 PR 품목 간 수량 연결

### 9. purchase_order_receipts (구매발주 입고 헤더)
구매발주 입고 헤더 정보 관리
- 입고 번호, 입고 일자, 발주 참조
- 창고, 로케이션
- 배송 정보 (송장번호, 배송업체)
- 검수 정보 (검수자, 검수 결과)
- 상태: DRAFT → IN_PROGRESS → INSPECTING → COMPLETED/REJECTED

### 10. purchase_order_receipt_items (구매발주 입고 품목)
구매발주 입고 품목 상세 정보 관리
- 라인 번호, 발주 품목 참조, 제품
- 발주 수량, 입고 수량, 합격 수량, 불합격 수량
- 검수 상태: PENDING → IN_PROGRESS → PASS/PARTIAL/FAIL
- LOT 번호, 로케이션

## 외래키 관계

```
# 구매요청
purchase_requisitions → psm.purchase_requisitions  [헤더]
purchase_requisition_items → psm.purchase_requisitions  [CASCADE]
purchase_requisition_items → pim.products  [RESTRICT]

# 구매발주
purchase_orders → csm.customers (supplier)  [RESTRICT]
purchase_order_items → psm.purchase_orders  [CASCADE]
purchase_order_items → pim.products  [RESTRICT]

# 견적
purchase_quotations → psm.purchase_requisitions  [SET NULL]
purchase_quotations → csm.customers (supplier)  [RESTRICT]
purchase_quotation_items → psm.purchase_quotations  [CASCADE]
purchase_quotation_items → pim.products  [RESTRICT]

# 가격 계약
purchase_price_agreements → csm.customers (supplier)  [RESTRICT]
purchase_price_agreements → pim.products  [RESTRICT]

# PR-PO 연결
purchase_order_pr_links → psm.purchase_orders  [CASCADE]
purchase_order_pr_links → psm.purchase_order_items  [CASCADE]
purchase_order_pr_links → psm.purchase_requisitions  [CASCADE]
purchase_order_pr_links → psm.purchase_requisition_items  [CASCADE]

# 입고
purchase_order_receipts → psm.purchase_orders  [RESTRICT]
purchase_order_receipts → ivm.warehouses  [RESTRICT]
purchase_order_receipts → ivm.warehouse_locations  [RESTRICT]
purchase_order_receipt_items → psm.purchase_order_receipts  [CASCADE]
purchase_order_receipt_items → psm.purchase_order_items  [RESTRICT]
purchase_order_receipt_items → pim.products  [RESTRICT]
purchase_order_receipt_items → ivm.warehouse_locations  [RESTRICT]
```

## 주요 특징

### 구매 프로세스 흐름

```
┌─────────────────┐
│ 구매요청 (PR)    │  DRAFT → SUBMITTED → APPROVED → ORDERED
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│ 견적 요청 (RFQ)  │  │ 가격 계약       │
│ 여러 업체        │  │ (장기 계약)     │
└────────┬────────┘  └────────┬────────┘
         │                    │
         │  견적 비교 선택     │  계약 단가 적용
         │                    │
         └─────────┬──────────┘
                   │
                   ▼
         ┌─────────────────┐
         │ 구매발주 (PO)    │  DRAFT → APPROVED → ORDERED
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ 입고 (Receipt)   │  DRAFT → IN_PROGRESS → INSPECTING
         │ + 검수          │  → COMPLETED / REJECTED
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ 재고 증가       │
         │ (IVM 연동)      │
         └─────────────────┘
```

### 1. 구매요청 (Purchase Requisition)
- 부서/개인이 필요한 품목 요청
- 상태: DRAFT → SUBMITTED → APPROVED → ORDERED

### 2. 견적 프로세스 (Quotation)
- PR 기반으로 여러 공급업체에 견적 요청
- 견적 비교 후 최적 견적 선택
- 선택된 견적으로 PO 생성

### 3. 가격 계약 (Price Agreement)
- 장기 공급 계약
- 공급업체-제품별 단가, 기간, 최소 수량 관리
- 발주 시 계약 단가 자동 적용

### 4. PR-PO 연결 (PR-PO Links)
- 하나의 PR이 여러 PO로 분할 가능
- 하나의 PO에 여러 PR 통합 가능
- 품목 단위 수량 추적

### 5. 구매발주 (Purchase Order)
- 공급업체에 정식 발주
- 상태: DRAFT → APPROVED → ORDERED → RECEIVING → COMPLETED

### 6. 입고 및 검수 (Receipt & Inspection)
- 발주 품목 입고 등록
- 품목별 검수 수행
  - 합격 수량: 재고 증가
  - 불합격 수량: 반품 처리
- LOT 번호, 로케이션 관리

### 수량 추적 체계

**구매요청 품목:**
- qty: 요청 수량

**구매발주 품목:**
- qty: 발주 수량
- received_qty: 입고 완료 수량 (누적)

**입고 품목:**
- ordered_qty: 발주 수량
- received_qty: 입고 수량
- accepted_qty: 합격 수량
- rejected_qty: 불합격 수량
- 제약: accepted_qty + rejected_qty = received_qty

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
- 2025-10-24: 테이블명 변경 (_lines → _items) 및 추가 테이블 생성
  - 견적 관리 (quotations, quotation_items)
  - 가격 계약 (price_agreements)
  - PR-PO 연결 (purchase_order_pr_links)
  - 입고 관리 (receipts, receipt_items)
