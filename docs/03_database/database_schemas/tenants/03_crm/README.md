# CRM 스키마 (고객관계관리)

## 개요
고객관계관리(CRM) 스키마로, 거래처 관리부터 리드/영업기회 관리, 영업 활동, 캠페인, 목표 관리까지 포괄하는 완전한 CRM 시스템입니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

#### 기본 거래처 관리 (Phase 0)
1. **00_schema.sql** - 스키마 생성
2. **01_partners.sql** - 거래처 마스터 (고객/공급업체 통합)
3. **02_partner_contacts.sql** - 거래처 담당자
4. **03_partner_addresses.sql** - 거래처 주소
5. **04_partner_managers.sql** - 거래처 담당 사원 (자사 담당자)
6. **05_partner_banks.sql** - 거래처 계좌

#### 영업 관리 (Phase 1 - 필수)
7. **06_leads.sql** - 리드/잠재고객 관리
8. **07_opportunities.sql** - 영업 기회 (Sales Funnel/Pipeline)
9. **08_activities.sql** - 영업 활동 (고객 접촉 이력)

#### 마케팅 & 분석 (Phase 2 - 중요)
10. **09_interactions.sql** - 고객 상호작용 이력
11. **10_campaigns.sql** - 마케팅 캠페인
12. **11_campaign_members.sql** - 캠페인 참여자
13. **12_sales_targets.sql** - 영업 목표 및 실적

#### 고급 기능 (Phase 3 - 선택)
14. **13_customer_segments.sql** - 고객 세그먼트
15. **14_customer_segment_members.sql** - 세그먼트 회원
16. **15_customer_surveys.sql** - 고객 만족도 설문 (NPS/CSAT/CES)
17. **16_email_templates.sql** - 이메일 템플릿
18. **17_rfqs.sql** - 견적 요청서 (Request for Quotation)
19. **18_rfq_items.sql** - 견적 요청 품목

## 주요 기능

### 1. 리드 관리 (Lead Management)
- **리드 출처 추적**: 웹사이트, 추천, 전시회, 콜드콜 등
- **리드 스코어링**: 0-100점 자동 점수 부여
- **리드 등급**: HOT/WARM/COLD
- **리드 → 거래처 전환**: 전환 이력 관리
- **담당 영업자 배정**

### 2. 영업 기회 관리 (Opportunity/Pipeline)
- **영업 단계**: LEAD → QUALIFIED → PROPOSAL → NEGOTIATION → CLOSING → WON/LOST
- **성공 확률**: 0-100% 설정
- **예상 수익**: 금액 × 확률
- **경쟁사 정보**: 경쟁 상황 및 우리의 강점 기록
- **실패 사유 분석**: LOST 시 사유 코드 및 상세 기록
- **수주 연계**: WON 시 판매주문 자동 생성

### 3. 영업 활동 관리 (Activity Tracking)
- **활동 유형**: 전화, 이메일, 미팅, 데모, 방문, 업무
- **일정 관리**: 시작/종료 시간, 소요 시간
- **화상회의 지원**: 온라인 미팅 URL 저장
- **후속 활동**: 자동 후속 활동 생성
- **알림 설정**: n분 전 알림

### 4. 고객 상호작용 (Customer Interactions)
- **다채널 추적**: 전화, 이메일, 채팅, SNS, 방문, 웹, 모바일앱
- **방향 구분**: INBOUND/OUTBOUND
- **감정 분석**: POSITIVE/NEUTRAL/NEGATIVE
- **만족도 점수**: 1-5점
- **태그 및 카테고리**: 유연한 분류 체계

### 5. 마케팅 캠페인
- **캠페인 유형**: 이메일, 전시회, 웨비나, 광고, SNS, 이벤트, 컨텐츠
- **목표 및 실적**: 리드 수, 영업기회 수, 매출
- **ROI 분석**: 예산 vs 실제 비용 vs 매출
- **참여자 관리**: 초대, 등록, 참석, 응답 추적
- **전환 추적**: 리드 전환, 영업기회 전환

### 6. 영업 목표 관리
- **대상별 목표**: 개인, 팀, 부서, 회사
- **기간별 목표**: 월별, 분기별, 연도별, 사용자 정의
- **지표 관리**: 매출, 건수, 리드, 영업기회, 전환율
- **달성률 추적**: 실시간 목표 대비 실적 모니터링

### 7. 고객 세그먼트
- **세그먼트 유형**: 정적, 동적, 행동 기반, 인구통계, 지역, 가치 기반
- **자동 업데이트**: 조건에 따라 자동 추가/제거
- **조건 저장**: JSON 기반 유연한 조건 설정
- **타겟 마케팅**: 세그먼트별 캠페인 실행

### 8. 고객 만족도 (CSAT/NPS/CES)
- **NPS (Net Promoter Score)**: 0-10점
- **CSAT (Customer Satisfaction)**: 1-5점
- **CES (Customer Effort Score)**: 1-7점
- **다채널 발송**: 이메일, SMS, 전화, 웹, 모바일앱
- **감정 분석**: 자동 감정 분류

### 9. 이메일 템플릿
- **카테고리별 템플릿**: 환영, 후속, 캠페인, 견적, 주문, 송장, 설문
- **변수 치환**: {{customer_name}}, {{order_number}} 등
- **HTML/텍스트**: 듀얼 포맷 지원
- **사용 통계**: 사용 횟수 및 마지막 사용일 추적

### 10. 견적 요청서 (RFQ)
- **고객 요청**: 리드 또는 거래처에서 견적 요청
- **품목 관리**: 제품 등록 또는 직접 입력
- **희망 조건**: 희망 단가, 납기일
- **견적서 전환**: RFQ → 견적서 자동 생성

## 판매 프로세스 플로우

```
┌─────────────────────────────────────────────────────────┐
│                    리드 획득 단계                          │
└─────────────────────────────────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │   LEAD    │ ← 캠페인, 웹사이트, 추천 등
                    └─────┬─────┘
                          │
                          ├─ Lead Scoring (자동 점수화)
                          ├─ 담당 영업자 배정
                          └─ 활동 추적 (전화, 이메일 등)
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  영업 기회 전환                            │
└─────────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │  OPPORTUNITY      │ ← 리드 또는 직접 생성
                └─────────┬─────────┘
                          │
            영업 단계 진행 (Sales Pipeline)
                          │
        LEAD → QUALIFIED → PROPOSAL → NEGOTIATION → CLOSING
                          │
                    ┌─────┴─────┐
                    │     WON   │ ← 수주 성공
                    └─────┬─────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  거래처 및 주문 처리                        │
└─────────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │    PARTNER        │ ← 리드 전환 또는 신규 등록
                └─────────┬─────────┘
                          │
                          ├─ 견적서 발행 (Quotation)
                          ├─ 판매주문 (Sales Order)
                          ├─ 출고/배송
                          ├─ 송장/세금계산서
                          └─ 고객 만족도 조사 (CSAT/NPS)
```

## 외래키 관계

### 리드 및 영업 기회
```
leads (owner_id) -> hrm.employees (id)  [SET NULL]
leads (converted_partner_id) -> partners (id)  [SET NULL]
opportunities (partner_id) -> partners (id)  [SET NULL]
opportunities (lead_id) -> leads (id)  [SET NULL]
opportunities (owner_id) -> hrm.employees (id)  [SET NULL]
opportunities (won_so_id) -> srm.sales_orders (id)  [SET NULL]
```

### 활동 및 상호작용
```
activities (partner_id) -> partners (id)  [SET NULL]
activities (lead_id) -> leads (id)  [SET NULL]
activities (opportunity_id) -> opportunities (id)  [SET NULL]
activities (owner_id) -> hrm.employees (id)  [RESTRICT]
interactions (partner_id) -> partners (id)  [SET NULL]
interactions (handled_by) -> hrm.employees (id)  [SET NULL]
```

### 캠페인 및 목표
```
campaigns (owner_id) -> hrm.employees (id)  [SET NULL]
campaign_members (campaign_id) -> campaigns (id)  [CASCADE]
campaign_members (partner_id) -> partners (id)  [CASCADE]
campaign_members (lead_id) -> leads (id)  [CASCADE]
sales_targets (employee_id) -> hrm.employees (id)  [CASCADE]
sales_targets (team_id) -> hrm.departments (id)  [CASCADE]
```

### 세그먼트 및 설문
```
customer_segments (owner_id) -> hrm.employees (id)  [SET NULL]
customer_segment_members (segment_id) -> customer_segments (id)  [CASCADE]
customer_segment_members (partner_id) -> partners (id)  [CASCADE]
customer_surveys (partner_id) -> partners (id)  [SET NULL]
customer_surveys (so_id) -> srm.sales_orders (id)  [SET NULL]
```

### 견적 요청
```
rfqs (partner_id) -> partners (id)  [SET NULL]
rfqs (lead_id) -> leads (id)  [SET NULL]
rfqs (converted_quote_id) -> srm.quotations (id)  [SET NULL]
rfq_items (rfq_id) -> rfqs (id)  [CASCADE]
rfq_items (product_id) -> pim.products (id)  [SET NULL]
```

## 주요 지표 및 KPI

### 리드 관련 지표
- **리드 전환율**: 전환된 리드 / 전체 리드
- **리드 출처별 효율**: 출처별 전환율 및 매출 기여도
- **리드 스코어 분포**: 점수대별 리드 수
- **평균 전환 기간**: 리드 생성 → 거래처 전환

### 영업 기회 지표
- **파이프라인 가치**: 모든 OPEN 기회의 예상 수익 합계
- **단계별 전환율**: 각 단계에서 다음 단계로의 전환율
- **평균 딜 사이즈**: 수주된 기회의 평균 금액
- **수주율**: WON / (WON + LOST)
- **평균 영업 사이클**: 기회 생성 → 수주

### 활동 지표
- **활동 건수**: 영업자별, 유형별 활동 건수
- **완료율**: 완료된 활동 / 전체 계획된 활동
- **평균 응답 시간**: 리드/기회 생성 → 첫 활동

### 캠페인 ROI
- **리드 획득 비용**: 캠페인 비용 / 생성된 리드 수
- **ROI**: (실제 매출 - 실제 비용) / 실제 비용 × 100
- **전환 퍼널**: 캠페인 참여 → 리드 → 영업기회 → 수주

### 고객 만족도
- **NPS**: (Promoters - Detractors) / 응답자 수 × 100
- **평균 CSAT 점수**: 전체 CSAT 점수 평균
- **평균 CES 점수**: 전체 CES 점수 평균
- **감정 분포**: POSITIVE/NEUTRAL/NEGATIVE 비율

## 사용 사례

### 1. 리드 관리 프로세스
```sql
-- 1. 웹사이트에서 리드 생성
INSERT INTO crm.leads (
    lead_code, company_name, contact_name, contact_email,
    source, lead_score, status, owner_id
) VALUES (
    'LEAD-2025-001', 'ABC Corp', '홍길동', 'hong@abc.com',
    'WEBSITE', 75, 'NEW', '영업자_UUID'
);

-- 2. 리드 점수 업데이트 (행동 기반)
UPDATE crm.leads 
   SET lead_score = lead_score + 10
 WHERE id = 'lead_uuid'
   AND source = 'WEBSITE';

-- 3. 적격 리드로 전환
UPDATE crm.leads 
   SET status = 'QUALIFIED'
 WHERE lead_score >= 70;

-- 4. 거래처로 전환
UPDATE crm.leads 
   SET status = 'CONVERTED',
       converted_partner_id = 'partner_uuid',
       converted_at = NOW()
 WHERE id = 'lead_uuid';
```

### 2. 영업 기회 관리
```sql
-- 1. 영업 기회 생성
INSERT INTO crm.opportunities (
    opportunity_code, name, partner_id, 
    stage, amount, win_probability, owner_id
) VALUES (
    'OPP-2025-001', 'ERP 시스템 구축', 'partner_uuid',
    'QUALIFIED', 50000000, 60, 'sales_person_uuid'
);

-- 2. 단계 진행
UPDATE crm.opportunities 
   SET stage = 'PROPOSAL',
       win_probability = 75
 WHERE id = 'opp_uuid';

-- 3. 수주 성공
UPDATE crm.opportunities 
   SET status = 'WON',
       stage = 'WON',
       actual_close_date = CURRENT_DATE,
       won_so_id = 'sales_order_uuid'
 WHERE id = 'opp_uuid';
```

### 3. 캠페인 실행 및 분석
```sql
-- 1. 캠페인 생성
INSERT INTO crm.campaigns (
    campaign_code, name, campaign_type,
    start_date, end_date, budget_amount, target_leads
) VALUES (
    'CAMP-2025-Q1', '2025 1분기 웨비나', 'WEBINAR',
    '2025-01-01', '2025-03-31', 5000000, 100
);

-- 2. 참여자 등록
INSERT INTO crm.campaign_members (
    campaign_id, member_type, partner_id, member_status
) VALUES (
    'campaign_uuid', 'PARTNER', 'partner_uuid', 'INVITED'
);

-- 3. ROI 계산
SELECT 
    c.name,
    c.budget_amount,
    c.actual_cost,
    c.actual_leads,
    c.actual_revenue,
    (c.actual_revenue - c.actual_cost) / c.actual_cost * 100 AS roi_percent
FROM crm.campaigns c
WHERE c.status = 'COMPLETED';
```

## 보고서 예시

### 영업 파이프라인 현황
```sql
SELECT 
    o.stage,
    COUNT(*) AS opportunity_count,
    SUM(o.amount) AS total_amount,
    SUM(o.expected_revenue) AS expected_revenue,
    AVG(o.win_probability) AS avg_probability
FROM crm.opportunities o
WHERE o.status = 'OPEN'
  AND o.is_deleted = false
GROUP BY o.stage
ORDER BY 
    CASE o.stage
        WHEN 'LEAD' THEN 1
        WHEN 'QUALIFIED' THEN 2
        WHEN 'PROPOSAL' THEN 3
        WHEN 'NEGOTIATION' THEN 4
        WHEN 'CLOSING' THEN 5
    END;
```

### 영업자별 실적
```sql
SELECT 
    e.name AS sales_person,
    COUNT(DISTINCT o.id) AS total_opportunities,
    COUNT(DISTINCT CASE WHEN o.status = 'WON' THEN o.id END) AS won_count,
    SUM(CASE WHEN o.status = 'WON' THEN o.amount ELSE 0 END) AS won_revenue,
    COUNT(DISTINCT a.id) AS total_activities
FROM hrm.employees e
LEFT JOIN crm.opportunities o ON e.id = o.owner_id
LEFT JOIN crm.activities a ON e.id = a.owner_id
WHERE e.is_deleted = false
GROUP BY e.id, e.name
ORDER BY won_revenue DESC;
```

### 월별 리드 생성 및 전환
```sql
SELECT 
    TO_CHAR(l.created_at, 'YYYY-MM') AS month,
    COUNT(*) AS total_leads,
    COUNT(CASE WHEN l.status = 'CONVERTED' THEN 1 END) AS converted_leads,
    ROUND(COUNT(CASE WHEN l.status = 'CONVERTED' THEN 1 END)::NUMERIC / COUNT(*) * 100, 2) AS conversion_rate
FROM crm.leads l
WHERE l.is_deleted = false
  AND l.created_at >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY TO_CHAR(l.created_at, 'YYYY-MM')
ORDER BY month DESC;
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
- 2025-01-20: 초기 작성 (기본 거래처 관리)
- 2025-10-23: partners 통합 관리로 전환
- 2025-10-24: CRM 핵심 기능 추가
  - Phase 1: 리드, 영업 기회, 활동 관리
  - Phase 2: 상호작용, 캠페인, 목표 관리
  - Phase 3: 세그먼트, 설문, 템플릿, RFQ
  - 총 19개 테이블, 3,253 라인 완성
