# FIM 스키마 (재무/회계 관리)

## 개요
재무 및 회계 관리 스키마로, 계정과목, 분개 처리, 매출채권, 매입채무, 지급 거래를 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_accounts.sql** - 계정과목 테이블
3. **02_journal_entries.sql** - 분개 마스터 테이블
4. **03_journal_entry_lines.sql** - 분개 상세 테이블
5. **04_accounts_receivable.sql** - 매출채권 테이블
6. **05_accounts_payable.sql** - 매입채무 테이블
7. **06_payment_transactions.sql** - 지급 거래 테이블
8. **07_business_documents.sql** - 업무전표 테이블

## 테이블 상세

### 1. accounts (계정과목)
계정과목 체계 관리
- 계정 코드 및 명칭
- 다국어 지원 (name, name_en)
- 계정 유형 (ASSET/LIABILITY/EQUITY/REVENUE/EXPENSE)
- 계정 분류
  - 대분류 (major_category)
  - 중분류 (minor_category)
  - 소분류 (detail_category)
- 계층 구조
  - 상위 계정 (parent_id)
  - 레벨 (level)
- 계정 속성
  - 통제 계정 여부 (is_control_account)
  - 현금 계정 여부 (is_cash_account)
  - 은행 계정 여부 (is_bank_account)
  - 재고 계정 여부 (is_inventory_account)
- 통화 코드
- 정렬 순서
- 상태 관리 (ACTIVE/INACTIVE)

### 2. journal_entries (분개)
분개 헤더 정보 관리
- 분개 번호 자동 생성
- 분개 일자
- 전표 유형 (GENERAL/SALES/PURCHASE/CASH_RECEIPT/CASH_PAYMENT/TRANSFER/ADJUSTMENT)
- 참조 정보
  - 참조 유형 (reference_type)
  - 참조 ID (reference_id)
  - 참조 번호 (reference_no)
- 설명
- 첨부파일 URL
- 전기 정보
  - 전기 상태 (is_posted)
  - 전기일 (posted_at)
  - 전기자 (posted_by)
- 결재 정보
  - 결재선 (approval_line_id)
  - 결재 상태 (approval_status)
  - 승인자 (approved_by)
  - 승인일 (approved_at)
- 역분개 정보
  - 역분개 여부 (is_reversed)
  - 역분개일 (reversed_at)
  - 역분개 분개 (reversed_entry_id)
- 상태 관리 (DRAFT/PENDING/APPROVED/REJECTED/POSTED/REVERSED/CANCELLED)

### 3. journal_entry_lines (분개 상세)
분개 라인 정보 관리
- 분개 헤더 참조
- 라인 번호
- 계정과목 (account_id)
- 차변/대변
  - 차변 금액 (debit_amount)
  - 대변 금액 (credit_amount)
- 통화 정보
  - 통화 코드
  - 환율 (exchange_rate)
  - 외화 금액 (foreign_amount)
- 적요 (description)
- 부서 (department_id)
- 프로젝트/원가 중심점
- 거래처 (partner_id)
- 상태 관리

### 4. accounts_receivable (매출채권)
매출채권 관리
- 채권 번호 자동 생성
- 발생 일자 및 만기일
- 고객 정보 (customer_id)
- 영업 담당자 (sales_rep_id)
- 참조 정보 (판매주문, 출고 등)
- 금액 정보
  - 원금 (principal_amount)
  - 수금액 (collected_amount)
  - 미수금 (balance_amount)
  - 통화 코드
- 결제 조건
- 연체 정보
  - 연체일수 (overdue_days)
  - 연체 여부 (is_overdue)
- 분개 정보 (journal_entry_id)
- 상태 관리 (PENDING/PARTIAL/PAID/OVERDUE/WRITTEN_OFF/CANCELLED)

### 5. accounts_payable (매입채무)
매입채무 관리
- 채무 번호 자동 생성
- 발생 일자 및 만기일
- 공급업체 정보 (supplier_id)
- 구매 담당자 (buyer_id)
- 참조 정보 (구매발주, 입고 등)
- 금액 정보
  - 원금 (principal_amount)
  - 지급액 (paid_amount)
  - 미지급 (balance_amount)
  - 통화 코드
- 결제 조건
- 연체 정보
- 분개 정보
- 상태 관리 (PENDING/PARTIAL/PAID/OVERDUE/WRITTEN_OFF/CANCELLED)

### 6. payment_transactions (지급 거래)
지급 거래 정보 관리
- 거래 번호 자동 생성
- 거래 일자
- 거래 유형 (RECEIPT/PAYMENT)
- 결제 방법 (CASH/BANK_TRANSFER/CREDIT_CARD/CHECK/PROMISSORY_NOTE)
- 거래처 정보 (partner_id)
- 은행 계정 정보
  - 은행 계정 (bank_account_id)
  - 은행명
  - 계좌번호
- 금액 정보
  - 거래 금액
  - 통화 코드
  - 환율
  - 외화 금액
- 참조 정보
  - 매출채권 (ar_id)
  - 매입채무 (ap_id)
- 수표/어음 정보
  - 수표번호
  - 발행일
  - 만기일
- 설명 및 첨부파일
- 분개 정보
- 상태 관리 (PENDING/COMPLETED/CANCELLED/BOUNCED)

### 7. business_documents (업무전표)
업무 문서와 회계 분개를 연결하는 전표 관리
- 전표 기본 정보
  - 전표 번호 (document_no)
  - 전표 일자 (document_date)
  - 전표 유형 (document_type)
- 원천 문서 정보
  - 원천 모듈 (source_module)
  - 원천 유형 (source_type)
  - 원천 문서 ID (source_id)
- 회계 정보
  - 회계연도/기간 (fiscal_year, fiscal_period)
  - 회계처리일 (account_date)
- 금액 정보
  - 전표 금액 (total_amount)
  - 세액 (tax_amount)
- 거래처/부서 정보
- 분개 연결 (journal_entry_id)
- 전기 정보 (is_posted, posted_at, posted_by)
- 취소/역분개 정보
- 승인 정보
- 세무 정보 (세금계산서)
- 상태 관리

**전표 유형:**
- 구매/매입: PURCHASE_RECEIPT, PURCHASE_RETURN, PURCHASE_TAX_INVOICE
- 판매/매출: SALES_SHIPMENT, SALES_RETURN, SALES_TAX_INVOICE, COST_OF_SALES
- 재고: INVENTORY_IN, INVENTORY_OUT, INVENTORY_ADJUSTMENT, INVENTORY_TRANSFER, INVENTORY_VALUATION
- 자금/결제: RECEIPT, PAYMENT, TRANSFER, NOTE_RECEIPT, NOTE_PAYMENT
- 급여: PAYROLL, PAYROLL_PAYMENT, SOCIAL_INSURANCE
- 고정자산: ASSET_ACQUISITION, DEPRECIATION, ASSET_DISPOSAL
- 기타: JOURNAL_TRANSFER, JOURNAL_CORRECTION, PERIOD_CLOSING, OPENING_ENTRY

## 외래키 관계

```
accounts (parent_id) -> accounts (id)  [자기 참조, CASCADE]
accounts (currency_code) -> adm.currencies (code)  [RESTRICT]
journal_entries (approval_line_id) -> apm.approval_lines (id)  [SET NULL]
journal_entries (approved_by) -> hrm.employees (id)  [SET NULL]
journal_entries (posted_by) -> hrm.employees (id)  [SET NULL]
journal_entries (reversed_entry_id) -> journal_entries (id)  [SET NULL]
journal_entry_lines (entry_id) -> journal_entries (id)  [CASCADE]
journal_entry_lines (account_id) -> accounts (id)  [RESTRICT]
journal_entry_lines (department_id) -> hrm.departments (id)  [SET NULL]
journal_entry_lines (partner_id) -> crm.partners (id)  [SET NULL]
journal_entry_lines (currency_code) -> adm.currencies (code)  [RESTRICT]
accounts_receivable (customer_id) -> crm.partners (id)  [RESTRICT]
accounts_receivable (sales_rep_id) -> hrm.employees (id)  [SET NULL]
accounts_receivable (journal_entry_id) -> journal_entries (id)  [SET NULL]
accounts_receivable (currency_code) -> adm.currencies (code)  [RESTRICT]
accounts_payable (supplier_id) -> crm.partners (id)  [RESTRICT]
accounts_payable (buyer_id) -> hrm.employees (id)  [SET NULL]
accounts_payable (journal_entry_id) -> journal_entries (id)  [SET NULL]
accounts_payable (currency_code) -> adm.currencies (code)  [RESTRICT]
payment_transactions (partner_id) -> crm.partners (id)  [SET NULL]
payment_transactions (bank_account_id) -> accounts (id)  [SET NULL]
payment_transactions (ar_id) -> accounts_receivable (id)  [SET NULL]
payment_transactions (ap_id) -> accounts_payable (id)  [SET NULL]
payment_transactions (journal_entry_id) -> journal_entries (id)  [SET NULL]
payment_transactions (currency_code) -> adm.currencies (code)  [RESTRICT]
business_documents (journal_entry_id) -> journal_entries (id)  [SET NULL]
business_documents (currency_code) -> adm.currencies (code)  [RESTRICT]
business_documents (partner_id) -> crm.partners (id)  [SET NULL]
business_documents (department_id) -> hrm.departments (id)  [SET NULL]
business_documents (reversed_document_id) -> business_documents (id)  [자기참조, SET NULL]
```

## 주요 특징

### 복식부기 원칙
- 모든 분개는 차변 = 대변 균형 유지
- 분개 상세(journal_entry_lines)에서 차변/대변 관리
- 검증: Σ(debit_amount) = Σ(credit_amount)

### 계정과목 체계
**계정 유형:**
- ASSET: 자산
- LIABILITY: 부채
- EQUITY: 자본
- REVENUE: 수익
- EXPENSE: 비용

**계층 구조:**
- 대분류 → 중분류 → 소분류
- parent_id로 상위 계정 참조
- level로 깊이 표시

### 분개 프로세스
1. **작성**: DRAFT
2. **제출**: PENDING
3. **결재**: APPROVED/REJECTED
4. **전기**: POSTED (is_posted = true)
5. **역분개**: REVERSED (필요시)

### 전표 유형
- GENERAL: 일반 전표
- SALES: 매출 전표
- PURCHASE: 매입 전표
- CASH_RECEIPT: 입금 전표
- CASH_PAYMENT: 출금 전표
- TRANSFER: 대체 전표
- ADJUSTMENT: 조정 전표

### 채권/채무 관리
**매출채권:**
```
balance_amount = principal_amount - collected_amount
```

**매입채무:**
```
balance_amount = principal_amount - paid_amount
```

**연체 관리:**
- overdue_days = CURRENT_DATE - due_date
- is_overdue = true (만기일 경과 시)

### 지급 거래
**거래 유형:**
- RECEIPT: 수금
- PAYMENT: 지급

**결제 방법:**
- CASH: 현금
- BANK_TRANSFER: 계좌이체
- CREDIT_CARD: 신용카드
- CHECK: 수표
- PROMISSORY_NOTE: 어음

### 외화 거래
- 통화 코드 및 환율 관리
- 외화 금액 및 원화 환산 금액
- 분개 라인별 외화 거래 처리

### 결재 연동
- 분개 전표에 결재선 연동
- 승인 후 전기 가능
- 전기 후 수정 불가

## 업무전표 프로세스

### 구매 입고 프로세스
```
1. WMS 입고 완료 (wms.receiving)
   ↓
2. 업무전표 생성 (fim.business_documents)
   - document_type: 'PURCHASE_RECEIPT'
   - source_module: 'WMS'
   - source_type: 'RECEIVING'
   ↓
3. 분개 자동 생성 (fim.journal_entries)
   차변: 재고자산
   대변: 미지급금
   ↓
4. 전표 승인 및 전기
   ↓
5. 매입채무 생성 (fim.accounts_payable)
```

### 판매 출고 프로세스
```
1. WMS 출고 완료 (wms.shipping)
   ↓
2. 매출 업무전표 생성 (fim.business_documents)
   - document_type: 'SALES_SHIPMENT'
   ↓
3. 매출 분개 생성
   차변: 매출채권
   대변: 매출
   ↓
4. 매출원가 업무전표 생성 (fim.business_documents)
   - document_type: 'COST_OF_SALES'
   ↓
5. 매출원가 분개 생성
   차변: 매출원가
   대변: 재고자산
   ↓
6. 전표 승인 및 전기
   ↓
7. 매출채권 생성 (fim.accounts_receivable)
```

### 입금 처리 프로세스
```
1. 입금 처리 (fim.payment_transactions)
   ↓
2. 입금 업무전표 생성 (fim.business_documents)
   - document_type: 'RECEIPT'
   ↓
3. 분개 생성
   차변: 현금/예금
   대변: 매출채권
   ↓
4. 전표 전기
```

## 회계 처리 예시

### 매출 발생 시
```
차변: 매출채권 1,000,000
대변: 매출 1,000,000
```

### 매입 발생 시
```
차변: 매입 500,000
대변: 매입채무 500,000
```

### 수금 시
```
차변: 현금/예금 1,000,000
대변: 매출채권 1,000,000
```

### 지급 시
```
차변: 매입채무 500,000
대변: 현금/예금 500,000
```

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
- 2025-10-22: 업무전표(business_documents) 테이블 추가

### 8. tax_invoices (세금계산서)
전자세금계산서 발행 및 관리
- 세금계산서 번호 및 유형
- 발행 유형 (정발행/역발행/영세율)
- 작성일자, 발행일자
- 국세청 승인 정보
  - 승인번호, 승인일시
  - 전송 확인
- 공급자 정보 (사업자등록번호, 상호, 대표자 등)
- 공급받는자 정보
- 거래처 연결
- 금액 정보
  - 공급가액, 세액, 합계
- 원천 문서 연결
- 업무전표 연결
- 상태 관리

### 9. tax_invoice_lines (세금계산서 상세)
품목별 공급가액 및 세액
- 세금계산서 참조
- 품목 정보 (코드, 명칭, 규격, 단위)
- 수량 및 단가
- 금액 (공급가액, 세액, 합계)
- 비고

## 세금계산서 프로세스

### 매출 세금계산서 발행
```
1. 판매 출고 완료 (wms.shipping)
   ↓
2. 매출 업무전표 생성 (business_documents)
   ↓
3. 세금계산서 작성 (tax_invoices)
   - 공급자: 자사 정보
   - 공급받는자: 고객 정보
   - 품목별 공급가액 및 세액
   ↓
4. 세금계산서 발행
   ↓
5. 국세청 전송
   ↓
6. 승인번호 취득
   ↓
7. 분개 자동 생성
   차변: 매출채권
   대변: 매출, 부가세예수금
```

### 매입 세금계산서 수신
```
1. 구매 입고 완료 (wms.receiving)
   ↓
2. 매입 업무전표 생성 (business_documents)
   ↓
3. 세금계산서 수신 (tax_invoices)
   - 공급자: 공급업체 정보
   - 공급받는자: 자사 정보
   ↓
4. 승인번호 확인
   ↓
5. 분개 자동 생성
   차변: 재고자산, 부가세대급금
   대변: 미지급금
```
