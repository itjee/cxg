# FAM 스키마 (고정자산 관리)

## 개요
고정자산 관리 스키마로, 유형자산 및 무형자산의 취득부터 감가상각, 처분까지 전체 생애주기를 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_fixed_assets.sql** - 고정자산 테이블
3. **02_asset_depreciation.sql** - 감가상각 이력 테이블
4. **03_asset_disposals.sql** - 자산 처분 테이블

## 테이블 상세

### 1. fixed_assets (고정자산)
유형자산 및 무형자산 관리
- 자산 기본 정보
  - 자산 코드, 명칭
  - 자산 분류, 유형
- 취득 정보
  - 취득일, 취득 방법
  - 취득가액, 잔존가치
  - 상각대상 금액
- 감가상각 정보
  - 상각 방법 (정액법/정률법/연수합계법/생산량비례법)
  - 내용연수 (년/월)
  - 상각률
- 회계 정보
  - 계정과목 코드
  - 감가상각비 계정
  - 감가상각누계액 계정
- 현재 가치
  - 감가상각누계액
  - 장부가액
- 위치 및 관리
  - 위치, 관리 부서, 관리자
- 공급자 정보
- 제조사 정보
  - 제조사, 모델번호, 일련번호
- 보증 및 유지보수
  - 보증 기간
  - 정기점검 주기
- 처분 정보
  - 처분일, 방법, 금액, 손익
- 상태 관리

**취득 방법:**
- PURCHASE: 구매
- LEASE: 리스
- DONATION: 기증
- CONSTRUCTION: 자가건설
- EXCHANGE: 교환

**상각 방법:**
- STRAIGHT_LINE: 정액법
- DECLINING_BALANCE: 정률법
- SUM_OF_YEARS: 연수합계법
- UNITS_OF_PRODUCTION: 생산량비례법

**처분 방법:**
- SALE: 매각
- DISCARD: 폐기
- DONATION: 기증
- EXCHANGE: 교환
- LOSS: 분실

**자산 상태:**
- IN_USE: 사용 중
- IDLE: 유휴
- UNDER_MAINTENANCE: 수리 중
- DISPOSED: 처분
- LOST: 분실

### 2. asset_depreciation (감가상각)
고정자산 월별 감가상각 이력
- 자산 정보 (스냅샷)
- 상각 기간
  - 상각 연도, 월, 일자
- 상각 정보
  - 상각 방법
  - 당월 상각액
  - 감가상각누계액
  - 장부가액
- 분개 연결
- 업무전표 연결
- 전기 정보

### 3. asset_disposals (자산 처분)
고정자산 매각/폐기 이력
- 자산 정보 (스냅샷)
- 처분 정보
  - 처분 번호, 일자
  - 처분 방법, 사유
- 금액 정보
  - 취득가액, 감가상각누계액 (스냅샷)
  - 장부가액 (스냅샷)
  - 처분가액
  - 처분손익
- 매입자 정보
- 분개 연결
- 업무전표 연결
- 승인 정보

## 외래키 관계

```
fixed_assets (department_id) -> hrm.departments (id)  [SET NULL]
fixed_assets (custodian_id) -> hrm.employees (id)  [SET NULL]
fixed_assets (supplier_id) -> crm.partners (id)  [SET NULL]
asset_depreciation (asset_id) -> fixed_assets (id)  [CASCADE]
asset_depreciation (journal_entry_id) -> fim.journal_entries (id)  [SET NULL]
asset_depreciation (business_document_id) -> fim.business_documents (id)  [SET NULL]
asset_disposals (asset_id) -> fixed_assets (id)  [CASCADE]
asset_disposals (buyer_partner_id) -> crm.partners (id)  [SET NULL]
asset_disposals (journal_entry_id) -> fim.journal_entries (id)  [SET NULL]
asset_disposals (business_document_id) -> fim.business_documents (id)  [SET NULL]
asset_disposals (approved_by) -> sys.users (id)  [SET NULL]
```

## 고정자산 관리 프로세스

### 자산 취득
```
1. 자산 등록 (fixed_assets)
   - 자산 정보 입력
   - 취득가액, 내용연수, 상각방법 설정
   ↓
2. 업무전표 생성 (fim.business_documents)
   - document_type: 'ASSET_ACQUISITION'
   ↓
3. 분개 생성 (fim.journal_entries)
   차변: 자산 계정
   대변: 현금/미지급금
   ↓
4. 자산 상태: IN_USE
```

### 월별 감가상각
```
1. 감가상각 계산 (자동 배치)
   - 상각 방법에 따라 당월 상각액 계산
   ↓
2. 감가상각 이력 생성 (asset_depreciation)
   ↓
3. 업무전표 생성 (fim.business_documents)
   - document_type: 'DEPRECIATION'
   ↓
4. 분개 생성 (fim.journal_entries)
   차변: 감가상각비
   대변: 감가상각누계액
   ↓
5. 고정자산 누계액 및 장부가액 업데이트
```

### 자산 처분
```
1. 처분 신청
   ↓
2. 처분 승인
   ↓
3. 처분 등록 (asset_disposals)
   - 처분가액 입력
   - 처분손익 자동 계산
   ↓
4. 업무전표 생성 (fim.business_documents)
   - document_type: 'ASSET_DISPOSAL'
   ↓
5. 분개 생성 (fim.journal_entries)
   차변: 현금/미수금, 감가상각누계액, 자산처분손실(경우에 따라)
   대변: 자산 계정, 자산처분이익(경우에 따라)
   ↓
6. 자산 상태: DISPOSED
```

## 감가상각 계산 방식

### 정액법 (STRAIGHT_LINE)
```
연간 상각액 = (취득가액 - 잔존가치) / 내용연수
월 상각액 = 연간 상각액 / 12
```

### 정률법 (DECLINING_BALANCE)
```
연간 상각액 = 기초 장부가액 × 상각률
상각률 = 1 - (잔존가치 / 취득가액)^(1/내용연수)
```

### 연수합계법 (SUM_OF_YEARS)
```
연간 상각액 = (취득가액 - 잔존가치) × (잔여내용연수 / 내용연수합계)
내용연수합계 = n(n+1)/2 (n은 내용연수)
```

## 주요 특징

### 완전한 생애주기 관리
- 취득 → 감가상각 → 처분
- 각 단계별 회계 처리 자동화

### 회계 연동
- 업무전표 자동 생성
- 분개 자동 생성
- 재무제표 반영

### 자산 추적
- 위치 및 관리자 추적
- 부서별 자산 현황
- 유지보수 이력

### 다양한 상각 방법 지원
- 정액법 (가장 일반적)
- 정률법
- 연수합계법
- 생산량비례법

## 사용 예시

### 자산 조회
```sql
-- 사용 중인 자산 목록
SELECT asset_code, asset_name, asset_category, 
       acquisition_cost, book_value, location
FROM fam.fixed_assets
WHERE status = 'IN_USE'
  AND is_deleted = false
ORDER BY acquisition_date DESC;

-- 부서별 자산 현황
SELECT d.name as department, 
       COUNT(*) as asset_count,
       SUM(acquisition_cost) as total_cost,
       SUM(book_value) as total_book_value
FROM fam.fixed_assets a
JOIN hrm.departments d ON a.department_id = d.id
WHERE a.status = 'IN_USE'
  AND a.is_deleted = false
GROUP BY d.name;
```

### 감가상각 조회
```sql
-- 월별 감가상각 집계
SELECT depreciation_year, depreciation_month,
       COUNT(*) as asset_count,
       SUM(depreciation_amount) as total_depreciation
FROM fam.asset_depreciation
WHERE is_deleted = false
GROUP BY depreciation_year, depreciation_month
ORDER BY depreciation_year DESC, depreciation_month DESC;

-- 자산별 감가상각 이력
SELECT a.asset_code, a.asset_name,
       d.depreciation_date, d.depreciation_amount,
       d.accumulated_depreciation, d.book_value
FROM fam.asset_depreciation d
JOIN fam.fixed_assets a ON d.asset_id = a.id
WHERE a.asset_code = 'ASSET-001'
ORDER BY d.depreciation_date DESC;
```

## DDL 작성 표준
모든 파일은 `/docs/prompts/ddl_standard_prompt.md`의 표준을 따릅니다.

## 작성 이력
- 2025-10-23: 초기 작성
