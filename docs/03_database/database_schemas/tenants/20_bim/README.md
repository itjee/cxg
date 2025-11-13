# BIM 스키마 (BI/분석)

## 개요
비즈니스 인텔리전스 및 분석 스키마로, KPI 정의 및 목표, 판매 분석, 구매 분석 데이터를 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_kpi_definitions.sql** - KPI 정의 테이블
3. **02_kpi_targets.sql** - KPI 목표 테이블
4. **03_sales_analytics.sql** - 판매 분석 테이블
5. **04_purchase_analytics.sql** - 구매 분석 테이블

## 테이블 상세

### 1. kpi_definitions (KPI 정의)
핵심 성과 지표(KPI) 정의 및 설정
- **기본 정보**
  - KPI 코드 (kpi_code)
  - KPI 명칭 (kpi_name, kpi_name_en)
  - 상세 설명 (description)

- **KPI 분류**
  - 카테고리 (category) - 매출/수익성/효율성/품질/고객만족
  - 하위 카테고리 (sub_category)
  - 사업 영역 (business_area) - 영업/생산/재무/인사 등

- **측정 정보**
  - 측정 단위 (measurement_unit) - 원/%/건수/시간 등
  - 계산 방법 (calculation_formula)
  - 데이터 출처 (data_source)
  - 측정 주기 (measurement_frequency) - DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY

- **목표 설정**
  - 목표 유형 (target_type) - HIGHER_BETTER/LOWER_BETTER/TARGET_VALUE/RANGE
  - 기본 목표값 (default_target_value)
  - 경고 임계값 (threshold_warning)
  - 위험 임계값 (threshold_critical)

- **표시 정보**
  - 표시 순서 (display_order)
  - 차트 유형 (chart_type) - LINE/BAR/PIE/GAUGE/AREA/SCATTER
  - 색상 코드 (color_code)
  - 아이콘 이름 (icon_name)

- **책임 및 소유**
  - KPI 담당자 (owner_user_id)
  - KPI 책임 부서 (owner_department_id)

### 2. kpi_targets (KPI 목표)
KPI별 목표 설정 및 실적 관리
- **기간 정보**
  - 목표 기간 (target_period) - YYYY-MM 형식
  - 회계 연도 (fiscal_year)
  - 분기 (quarter) - Q1/Q2/Q3/Q4
  - 시작일/종료일 (start_date, end_date)

- **조직 단위**
  - 부서 (department_id)
  - 사용자 (user_id)
  - 팀 (team_id)

- **목표 및 실적**
  - 목표값 (target_value)
  - 실적값 (actual_value)
  - 달성률 (achievement_rate)

- **상태 및 평가**
  - 상태 (status) - NOT_STARTED/IN_PROGRESS/ACHIEVED/NOT_ACHIEVED/EXCEEDED/CANCELLED
  - 성과 등급 (performance_grade) - S/A/B/C/D/F

- **편차 분석**
  - 편차값 (variance_value) - 실적-목표
  - 편차율 (variance_rate)

- **추가 정보**
  - 코멘트/메모 (comments)
  - 실행 계획 (action_plan)
  - 최종 측정 일시 (last_measured_at)

### 3. sales_analytics (판매 분석)
월별 매출 데이터 분석 및 집계
- **분석 기간**
  - 분석 기간 (period) - YYYY-MM 형식
  - 회계 연도 (fiscal_year)
  - 분기 (quarter)

- **분석 차원**
  - 고객 (customer_id, customer_segment)
  - 품목 (item_id, item_category_id)
  - 영업 담당자 (sales_person_id)
  - 부서 (department_id)
  - 지역 (region_code)

- **매출 지표**
  - 매출액 (sales_amount)
  - 매출 수량 (sales_qty)
  - 주문 건수 (order_count)

- **원가 및 이익**
  - 원가 (cost_amount)
  - 매출 총이익 (gross_profit)
  - 매출 총이익률 (gross_profit_rate)

- **반품 및 할인**
  - 반품액/반품 수량 (return_amount, return_qty)
  - 할인액 (discount_amount)

- **평균 지표**
  - 평균 주문 금액 (avg_order_value)
  - 평균 단가 (avg_unit_price)

- **성장률**
  - 전년 대비 성장률 (yoy_growth_rate)
  - 전월 대비 성장률 (mom_growth_rate)

- **통화**
  - 통화 코드 (currency) - ISO 4217
  - 환율 (exchange_rate)

### 4. purchase_analytics (구매 분석)
월별 구매 데이터 분석 및 집계
- **분석 기간**
  - 분석 기간 (period) - YYYY-MM 형식
  - 회계 연도 (fiscal_year)
  - 분기 (quarter)

- **분석 차원**
  - 공급업체 (vendor_id, vendor_category)
  - 품목 (item_id, item_category_id)
  - 구매 담당자 (buyer_id)
  - 부서 (department_id)

- **구매 지표**
  - 구매액 (purchase_amount)
  - 구매 수량 (purchase_qty)
  - 발주 건수 (order_count)

- **반품 및 할인**
  - 반품액/반품 수량 (return_amount, return_qty)
  - 할인액 (discount_amount)

- **평균 지표**
  - 평균 발주 금액 (avg_order_value)
  - 평균 단가 (avg_unit_price)
  - 평균 리드타임 (avg_lead_time_days)

- **품질 지표**
  - 불량 수량 (defect_qty)
  - 불량률 (defect_rate)
  - 정시 납품률 (on_time_delivery_rate)

- **성장률**
  - 전년 대비 성장률 (yoy_growth_rate)
  - 전월 대비 성장률 (mom_growth_rate)

- **통화**
  - 통화 코드 (currency) - ISO 4217
  - 환율 (exchange_rate)

## 외래키 관계

```
kpi_targets (kpi_id) -> kpi_definitions (id)  [CASCADE]
```

## 주요 특징

### KPI 관리
- **측정 주기**: DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY
- **목표 유형**:
  - HIGHER_BETTER: 높을수록 좋음 (매출, 이익 등)
  - LOWER_BETTER: 낮을수록 좋음 (비용, 불량률 등)
  - TARGET_VALUE: 목표값 달성
  - RANGE: 목표 범위 내
- **차트 지원**: LINE/BAR/PIE/GAUGE/AREA/SCATTER

### KPI 목표 및 실적
- **달성률 계산**: `(actual_value / target_value) × 100`
- **상태 관리**: NOT_STARTED/IN_PROGRESS/ACHIEVED/NOT_ACHIEVED/EXCEEDED/CANCELLED
- **성과 등급**: S/A/B/C/D/F
- **편차 분석**: 목표 대비 실적 편차 추적

### 판매 분석
- **핵심 지표**:
  - 순매출 = 매출액 - 반품액
  - 매출총이익 = 순매출 - 원가
  - 매출총이익률 = (매출총이익 / 순매출) × 100
- **분석 차원**: 시간/고객/제품/영업담당자/부서/지역
- **성장률 추적**: 전년 대비(YoY), 전월 대비(MoM)

### 구매 분석
- **핵심 지표**:
  - 불량률 = (불량 수량 / 구매 수량) × 100
  - 정시 납품률 계산
- **분석 차원**: 시간/공급업체/제품/구매담당자/부서
- **품질 관리**: 불량 수량 및 불량률 추적
- **납기 관리**: 정시 납품률 추적
- **성장률 추적**: 전년 대비(YoY), 전월 대비(MoM)

## 분석 활용 예시

### 매출 추이 분석
```sql
SELECT 
    period,
    SUM(sales_amount) as total_sales,
    SUM(gross_profit) as total_profit,
    AVG(gross_profit_rate) as avg_margin
FROM bim.sales_analytics
WHERE is_deleted = false
  AND period >= '2025-01'
GROUP BY period
ORDER BY period;
```

### 제품 카테고리별 판매 분석
```sql
SELECT 
    item_category_id,
    SUM(sales_qty) as total_quantity,
    SUM(sales_amount) as total_amount,
    COUNT(DISTINCT customer_id) as customer_count
FROM bim.sales_analytics
WHERE is_deleted = false
  AND period = '2025-01'
GROUP BY item_category_id;
```

### 공급업체 품질 분석
```sql
SELECT 
    vendor_id,
    SUM(purchase_qty) as total_received,
    SUM(defect_qty) as total_defect,
    AVG(defect_rate) as avg_defect_rate,
    AVG(on_time_delivery_rate) as avg_otd_rate
FROM bim.purchase_analytics
WHERE is_deleted = false
  AND period >= '2025-01'
GROUP BY vendor_id;
```

### KPI 달성률 조회
```sql
SELECT 
    k.kpi_name,
    t.target_value,
    t.actual_value,
    t.achievement_rate,
    t.status
FROM bim.kpi_targets t
JOIN bim.kpi_definitions k ON t.kpi_id = k.id
WHERE t.is_deleted = false
  AND k.is_deleted = false
  AND t.target_period = '2025-01'
ORDER BY k.display_order;
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
- 2025-10-23: DDL 표준 프롬프트 기준으로 재정리 (테이블별 파일 분리)
