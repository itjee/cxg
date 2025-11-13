# 데이터베이스 스키마 재구성 계획

**작성일**: 2025-01-20  
**작성자**: System Architecture Team  
**문서 버전**: 1.0  
**상태**: 제안 (Proposal)

---

## 📋 목차

1. [개요](#개요)
2. [현재 상황 분석](#현재-상황-분석)
3. [문제점](#문제점)
4. [제안하는 새로운 스키마 구조](#제안하는-새로운-스키마-구조)
5. [스키마별 상세 설명](#스키마별-상세-설명)
6. [스키마 간 의존성](#스키마-간-의존성)
7. [파일 구조](#파일-구조)
8. [마이그레이션 전략](#마이그레이션-전략)
9. [장단점 분석](#장단점-분석)
10. [실행 계획](#실행-계획)

---

## 개요

ConexGrow 플랫폼의 Tenant Database(`tnnt_db`)에서 현재 `adm` 스키마에 혼재되어 있는 
조직, 거래처, 제품, 창고 등의 마스터 데이터를 도메인별로 독립적인 스키마로 분리하는 계획입니다.

### 목표

- ✅ 도메인 주도 설계(DDD) 원칙 적용
- ✅ 각 비즈니스 영역의 독립성 확보
- ✅ 확장성 및 유지보수성 향상
- ✅ 업계 표준 용어 및 구조 채택
- ✅ 마이크로서비스 아키텍처 준비

---

## 현재 상황 분석

### 현재 Tenant 스키마 구조 (12개)

```
tnnt_db:
├── adm (Administration)          # 기준정보 - 모든 마스터 데이터 혼재 ⚠️
├── asm (Asset/After-Sales)       # 자산/A/S 관리
├── bim (BI/Analytics)            # 분석
├── com (Communication)           # 메시징
├── csm (Customer/CRM)            # 고객관계관리
├── fim (Finance/Accounting)      # 재무회계
├── ivm (Inventory Management)    # 재고관리
├── lwm (Logistics & WMS)         # 물류/창고관리 ✅
├── psm (Procurement/Purchasing)  # 구매관리
├── srm (Sales/Revenue)           # 판매관리
├── sys (System Configuration)    # 시스템 설정
└── [미구현] 워크플로우/결재       # 현재 누락됨 ⚠️
```

### adm 스키마 현재 테이블 구성 (16개)

```sql
-- 조직 관련 (3개)
adm.companies       -- 주석처리됨
adm.departments     -- 부서
adm.employees       -- 사원

-- 거래처/고객 관련 (5개)
adm.customers               -- 거래처/고객
adm.customer_contacts       -- 거래처 담당자
adm.customer_managers       -- 우리측 영업 담당자
adm.customer_banks          -- 거래처 계좌정보
adm.customer_addresses      -- 거래처 주소

-- 제품 관련 (6개)
adm.makers                  -- 제조사
adm.brands                  -- 브랜드
adm.categories              -- 카테고리
adm.category_managers       -- 카테고리 담당자
adm.products                -- 제품
adm.product_managers        -- 제품 담당자

-- 창고 관련 (3개)
adm.warehouses              -- 창고
adm.warehouse_employees     -- 창고 직원
adm.warehouse_locations     -- 창고 로케이션
```

**파일 크기**: adm.sql = **2,752 줄** (너무 큼)

---

## 문제점

### 1. 도메인 혼재
- 조직(HR), 거래처(CRM), 제품(PIM), 창고(WMS)가 모두 adm에 섞여있음
- 각 도메인의 책임과 경계가 불명확

### 2. 파일 관리 어려움
- 단일 파일이 2,752줄로 너무 커서 유지보수 곤란
- Git diff, merge 시 충돌 가능성 높음
- 코드 리뷰 어려움

### 3. 확장성 제한
- 새로운 기능 추가 시 영향 범위 파악 어려움
- 도메인별 최적화 불가능

### 4. 팀 협업 비효율
- 여러 팀이 동일 파일 수정 시 충돌
- 도메인별 전문가 배치 어려움

### 5. 스키마 명칭 혼동
- `lwm`이 CLAUDE.md에서 "Workflow/Approval"로 잘못 문서화됨
- 실제로는 "Logistics & WMS" (물류/창고관리)
- **워크플로우/결재 관리 모듈이 현재 시스템에 누락됨** ⚠️

### 6. csm과 중복 가능성
- adm.customers와 csm(Customer/CRM)의 역할 불명확
- 데이터 중복 또는 역할 혼동 가능성

---

## 제안하는 새로운 스키마 구조

### 전체 스키마 목록 (15개)

```
tnnt_db:
├── hrm (Human Resources)         # 인사관리 ⭐ NEW
├── crm (Customer Relationship)   # 고객관계관리 ⭐ NEW  
├── pim (Product Information)     # 제품정보관리 ⭐ NEW
├── wms (Warehouse Management)    # 창고관리시스템 ⭐ NEW
├── apm (Approval/Workflow)       # 결재/워크플로우 ⭐ NEW
├── adm (Common Administration)   # 공통 기준정보 ⭐ REDUCED
│
├── ivm (Inventory Management)    # 재고관리 (기존 유지)
├── psm (Procurement/Purchasing)  # 구매관리 (기존 유지)
├── srm (Sales/Revenue)           # 판매관리 (기존 유지)
├── asm (Asset/After-Sales)       # 자산/A/S관리 (기존 유지)
├── fim (Finance/Accounting)      # 재무회계 (기존 유지)
├── bim (BI/Analytics)            # 분석 (기존 유지)
├── com (Communication)           # 메시징 (기존 유지)
└── sys (System Configuration)    # 시스템 설정 (기존 유지)

[검토 및 통합]
├── lwm (Logistics & WMS)         # → wms로 통합 검토
└── csm (Customer/CRM)            # → crm으로 통합 검토
```

---

## 스키마별 상세 설명

### 1️⃣ hrm (Human Resources Management) ⭐ NEW

**목적**: 인적자원 및 조직 관리  
**기존 출처**: adm.departments, adm.employees

#### 주요 테이블

```sql
CREATE SCHEMA IF NOT EXISTS hrm;
COMMENT ON SCHEMA hrm IS 'HRM: 인사관리 스키마 (조직, 사원, 직위, 급여, 근태)';

-- 조직 구조
hrm.departments             -- 부서/조직
hrm.positions               -- 직위/직급
hrm.job_titles              -- 직책

-- 인사 정보
hrm.employees               -- 사원 기본정보
hrm.employee_contracts      -- 계약 정보
hrm.employee_history        -- 인사 이력 (발령, 승진 등)

-- 근태 관리 (향후 확장)
hrm.attendance              -- 근태
hrm.leaves                  -- 휴가

-- 급여 관리 (향후 확장)
hrm.payroll                 -- 급여
hrm.payroll_items           -- 급여 항목
```

#### 특징

- ✅ 조직도 계층 구조 관리
- ✅ 인사 이력 추적
- ✅ 급여, 근태 확장 가능
- ✅ HR 팀 전용 접근 권한 설정

#### 의존성

```
hrm → adm (공통코드)
```

---

### 2️⃣ crm (Customer Relationship Management) ⭐ NEW

**목적**: 거래처 및 고객 통합 관리  
**기존 출처**: adm.customers, adm.customer_*, csm 스키마와 통합 검토

#### 주요 테이블

```sql
CREATE SCHEMA IF NOT EXISTS crm;
COMMENT ON SCHEMA crm IS 'CRM: 고객관계관리 스키마 (거래처, 고객, 영업기회)';

-- 거래처/고객 마스터
crm.customers               -- 거래처/고객 기본정보
crm.customer_types          -- 거래처 유형 (공급업체, 고객사, 대리점 등)
crm.customer_contacts       -- 거래처 담당자
crm.customer_managers       -- 우리측 영업 담당자
crm.customer_banks          -- 거래처 계좌정보
crm.customer_addresses      -- 거래처 주소

-- 고객 세분화
crm.customer_segments       -- 고객 세그먼트 (VIP, 일반 등)
crm.customer_grades         -- 고객 등급

-- 영업 관리
crm.leads                   -- 리드/잠재고객
crm.opportunities           -- 영업 기회
crm.campaigns               -- 마케팅 캠페인

-- 상호작용 관리
crm.interactions            -- 고객 상호작용 이력
crm.customer_notes          -- 고객 메모
```

#### 특징

- ✅ B2B 거래처 + B2C 고객 통합 관리
- ✅ 고객 360도 뷰 제공
- ✅ 영업 파이프라인 관리
- ✅ 마케팅 캠페인 연동

#### csm 스키마와의 관계

**Option 1 (권장)**: csm을 crm으로 완전 통합
- 고객 관련 모든 기능을 crm에 집중
- csm 스키마 제거

**Option 2**: 역할 분담
- crm: 거래처/고객 마스터 데이터
- csm: 고객 서비스/지원 관리 (티켓, 문의, 피드백)

#### 의존성

```
crm → adm (공통코드, 지역정보)
crm → hrm (담당 직원)
```

---

### 3️⃣ pim (Product Information Management) ⭐ NEW

**목적**: 제품 마스터 데이터 중앙 집중 관리  
**기존 출처**: adm.makers, adm.brands, adm.categories, adm.products, adm.product_*

#### 주요 테이블

```sql
CREATE SCHEMA IF NOT EXISTS pim;
COMMENT ON SCHEMA pim IS 'PIM: 제품정보관리 스키마 (제조사, 브랜드, 카테고리, 제품)';

-- 제품 분류 계층
pim.makers                  -- 제조사/제조업체
pim.brands                  -- 브랜드
pim.categories              -- 카테고리 (계층 구조)
pim.category_managers       -- 카테고리 담당자

-- 제품 마스터
pim.products                -- 제품 기본정보
pim.product_managers        -- 제품 담당자
pim.product_variants        -- 제품 변형/옵션 (색상, 사이즈 등)

-- 제품 상세 정보
pim.product_specifications  -- 제품 사양/스펙
pim.product_attributes      -- 제품 속성
pim.product_images          -- 제품 이미지
pim.product_documents       -- 제품 문서 (매뉴얼, 인증서 등)

-- 가격 관리
pim.product_prices          -- 제품 가격 (이력 관리)
pim.price_lists             -- 가격표

-- BOM 관리 (선택)
pim.product_bom             -- BOM (Bill of Materials)
pim.bom_items               -- BOM 구성품
```

#### 특징

- ✅ 제품 정보 단일 진실 공급원(Single Source of Truth)
- ✅ 다채널 상품 관리 (온라인/오프라인)
- ✅ 제품 라이프사이클 관리(PLM) 확장 가능
- ✅ 옵션/변형 상품 지원

#### 의존성

```
pim → adm (공통코드, 통화, 단위)
pim → hrm (제품 담당자, 카테고리 담당자)

참조됨:
ivm → pim.products
psm → pim.products
srm → pim.products
asm → pim.products
```

---

### 4️⃣ wms (Warehouse Management System) ⭐ NEW

**목적**: 창고 및 물류 전문 관리  
**기존 출처**: adm.warehouses, adm.warehouse_*, lwm 일부 기능

#### 주요 테이블

```sql
CREATE SCHEMA IF NOT EXISTS wms;
COMMENT ON SCHEMA wms IS 'WMS: 창고관리시스템 스키마 (창고, 로케이션, 입출고, 피킹)';

-- 창고 마스터
wms.warehouses              -- 창고 기본정보
wms.warehouse_employees     -- 창고 직원
wms.warehouse_types         -- 창고 유형

-- 창고 구조
wms.warehouse_zones         -- 구역/Zone (A구역, B구역 등)
wms.warehouse_racks         -- 랙/선반
wms.warehouse_locations     -- 로케이션 (구역-랙-층-칸)
wms.warehouse_bins          -- 보관함/빈

-- 입출고 관리 (lwm과 통합)
wms.receiving               -- 입고 (lwm.goods_receipts)
wms.receiving_items         -- 입고 상세
wms.shipping                -- 출고 (lwm.goods_issues)
wms.shipping_items          -- 출고 상세

-- 창고 작업
wms.picking_tasks           -- 피킹 작업
wms.packing_tasks           -- 패킹 작업
wms.putaway_tasks           -- 적치 작업

-- 재고 실사
wms.stock_counts            -- 재고 실사
wms.stock_count_items       -- 실사 상세
wms.stock_adjustments       -- 재고 조정

-- 설비 관리 (선택)
wms.equipment               -- 창고 설비 (지게차, 랙 등)
wms.equipment_maintenance   -- 설비 유지보수
```

#### 특징

- ✅ 물리적 창고 구조 관리
- ✅ 로케이션 기반 재고 관리
- ✅ 입출고, 피킹, 패킹 프로세스
- ✅ 바코드/RFID 확장 가능

#### lwm과의 관계

**현재 상황**:
- `lwm` = Logistics & WMS (물류/창고관리)
- 입고(goods_receipts), 출고(goods_issues) 등 테이블 포함

**Option 1 (권장)**: lwm을 wms로 통합
- lwm의 모든 테이블을 wms로 이관
- lwm 스키마 폐기
- wms가 물류 + 창고 통합 관리

**Option 2**: 역할 분리 유지
- wms: 창고 마스터 데이터 (창고, 로케이션, 구역)
- lwm: 물류 트랜잭션 (입출고, 배송, 운송)

**권장**: Option 1 (통합)
- lwm과 wms의 책임이 겹침
- 통합하여 단일 진실 공급원 확보

#### 의존성

```
wms → adm (공통코드)
wms → hrm (창고 직원)
wms → pim (제품 정보)

참조됨:
ivm → wms.warehouses
ivm → wms.warehouse_locations
```

---

### 5️⃣ apm (Approval/Workflow Management) ⭐ NEW

**목적**: 전자결재 및 워크플로우 관리  
**기존 출처**: 현재 시스템에 누락된 기능, 새로 설계 필요

#### 주요 테이블

```sql
CREATE SCHEMA IF NOT EXISTS apm;
COMMENT ON SCHEMA apm IS 'APM: 결재/워크플로우 관리 스키마 (결재선, 결재진행, 문서)';

-- 결재선 관리
apm.approval_lines          -- 결재선 정의
apm.approval_line_items     -- 결재선 상세 (결재 단계별)

-- 워크플로우 정의
apm.workflows               -- 워크플로우 정의
apm.workflow_steps          -- 워크플로우 단계
apm.workflow_conditions     -- 분기 조건

-- 결재 진행
apm.approval_requests       -- 결재 요청
apm.approval_histories      -- 결재 이력
apm.approval_comments       -- 결재 의견

-- 문서 관리
apm.document_types          -- 문서 유형 (휴가신청, 구매요청 등)
apm.documents               -- 전자문서
apm.document_attachments    -- 문서 첨부파일

-- 자동화 규칙
apm.automation_rules        -- 자동 승인 규칙
apm.escalation_rules        -- 에스컬레이션 규칙
```

#### 특징

- ✅ 다양한 문서 유형별 결재선 설정
- ✅ 병렬/순차/조건부 결재 지원
- ✅ 결재 대리/위임 기능
- ✅ 알림/에스컬레이션
- ✅ 결재 이력 추적

#### 적용 대상 모듈

```
- 구매 발주 결재 (psm)
- 판매 견적/계약 결재 (srm)
- 재고 조정 결재 (ivm)
- 휴가 신청 결재 (hrm)
- 지출 결재 (fim)
- 모든 업무 문서
```

#### 의존성

```
apm → hrm (결재자, 조직도)
apm → adm (문서 유형 코드)

참조됨:
psm, srm, ivm, fim 등 → apm.approval_requests
```

---

### 6️⃣ adm (Common Administration) ⭐ REDUCED

**목적**: 스키마별로 분류하기 애매한 공통 기준정보만 관리  
**변경 사항**: 기존 테이블 대부분 다른 스키마로 이관, 최소한만 유지

#### 주요 테이블

```sql
CREATE SCHEMA IF NOT EXISTS adm;
COMMENT ON SCHEMA adm IS 'ADM: 공통 기준정보 스키마 (공통코드, 설정)';

-- 공통 코드
adm.code_groups             -- 공통코드 그룹
adm.codes                   -- 공통코드

-- 시스템 설정
adm.settings                -- 시스템 설정
adm.parameters              -- 파라미터

-- 지역/통화
adm.countries               -- 국가
adm.regions                 -- 지역/행정구역
adm.currencies              -- 통화
adm.exchange_rates          -- 환율

-- 단위
adm.units                   -- 단위 (EA, KG, M 등)
adm.unit_conversions        -- 단위 환산

-- 공휴일
adm.holidays                -- 공휴일
adm.business_calendars      -- 업무 달력

-- 번호 채번
adm.number_sequences        -- 자동 번호 채번
```

#### 특징

- ✅ 모든 스키마에서 공통으로 사용
- ✅ 작고 명확한 책임
- ✅ 확장 최소화

---

## 스키마 간 의존성

### 의존성 다이어그램

```
                    ┌─────────────┐
                    │     adm     │
                    │  (공통코드)  │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
       ┌────────┐     ┌────────┐     ┌────────┐
       │  hrm   │     │  crm   │     │  pim   │
       │ (인사)  │     │ (고객)  │     │ (제품)  │
       └────┬───┘     └────┬───┘     └────┬───┘
            │              │              │
            │              │              ▼
            │              │         ┌────────┐
            │              │         │  wms   │
            │              │         │ (창고)  │
            │              │         └────┬───┘
            │              │              │
            └──────────────┼──────────────┤
                           ▼              ▼
                      ┌─────────────────────┐
                      │   apm (결재)         │
                      └──────────┬──────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
   ┌────────┐              ┌────────┐              ┌────────┐
   │  psm   │              │  srm   │              │  ivm   │
   │ (구매)  │              │ (판매)  │              │ (재고)  │
   └────────┘              └────────┘              └────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 ▼
                            ┌─────────┐
                            │   fim   │
                            │ (재무)   │
                            └─────────┘
```

### 참조 관계 매트릭스

| 참조하는 스키마 ↓ | hrm | crm | pim | wms | apm | adm |
|-------------------|-----|-----|-----|-----|-----|-----|
| **hrm**           | -   |     |     |     |     | ✓   |
| **crm**           | ✓   | -   |     |     |     | ✓   |
| **pim**           | ✓   |     | -   |     |     | ✓   |
| **wms**           | ✓   |     | ✓   | -   |     | ✓   |
| **apm**           | ✓   |     |     |     | -   | ✓   |
| **ivm**           |     |     | ✓   | ✓   |     |     |
| **psm**           |     | ✓   | ✓   | ✓   | ✓   |     |
| **srm**           |     | ✓   | ✓   | ✓   | ✓   |     |
| **asm**           |     | ✓   | ✓   |     |     |     |
| **fim**           | ✓   | ✓   |     |     | ✓   |     |

---

## 파일 구조

### 새로운 스키마 파일 구조

```
packages/database/schemas/tenants/
│
├── init.sql                        # 전체 스키마 생성 및 실행 순서
│
├── 01_adm.sql                      # 공통 기준정보 (REDUCED) ⭐
├── 02_hrm.sql                      # 인사관리 ⭐ NEW
├── 03_crm.sql                      # 고객관계관리 ⭐ NEW
├── 04_pim.sql                      # 제품정보관리 ⭐ NEW
├── 05_wms.sql                      # 창고관리 (wms + lwm 통합) ⭐ NEW
├── 06_apm.sql                      # 결재/워크플로우 ⭐ NEW
│
├── 10_ivm.sql                      # 재고관리 (기존)
├── 11_psm.sql                      # 구매관리 (기존)
├── 12_srm.sql                      # 판매관리 (기존)
├── 13_asm.sql                      # A/S관리 (기존)
├── 14_fim.sql                      # 재무회계 (기존)
│
├── 20_bim.sql                      # 분석 (기존)
├── 21_com.sql                      # 메시징 (기존)
├── 22_sys.sql                      # 시스템 (기존)
│
└── [DEPRECATED]
    ├── adm.sql.old                 # 백업 (분리 전)
    ├── lwm.sql.old                 # 백업 (wms 통합 전)
    └── csm.sql.old                 # 백업 (crm 통합 시)
```

### init.sql 예시

```sql
-- ============================================================================
-- ConexGrow Tenant Database Schema Initialization
-- ============================================================================
-- Description: 모든 스키마 생성 및 실행 순서 관리
-- Database: tnnt_db (Tenant Database)
-- ============================================================================

-- 실행 순서 (의존성 고려)
\echo 'Creating ConexGrow Tenant Schemas...'

-- Phase 1: 공통 기준정보
\i 01_adm.sql

-- Phase 2: 마스터 데이터
\i 02_hrm.sql
\i 03_crm.sql
\i 04_pim.sql
\i 05_wms.sql

-- Phase 3: 워크플로우
\i 06_apm.sql

-- Phase 4: 업무 트랜잭션
\i 10_ivm.sql
\i 11_psm.sql
\i 12_srm.sql
\i 13_asm.sql
\i 14_fim.sql

-- Phase 5: 지원 기능
\i 20_bim.sql
\i 21_com.sql
\i 22_sys.sql

\echo 'All schemas created successfully!'
```

---

## 마이그레이션 전략

### 총 소요 기간: 8주 (약 2개월)

| Phase | 작업 내용 | 기간 | 담당 |
|-------|----------|------|------|
| 1 | 준비 및 설계 | 1주 | DB 설계팀 |
| 2 | 스키마 파일 생성 | 2주 | DB 설계팀 |
| 3 | 의존성 업데이트 | 1주 | DB 설계팀 |
| 4 | Backend 모델 재구성 | 2주 | Backend 개발팀 |
| 5 | API Router 업데이트 | 1주 | Backend 개발팀 |
| 6 | 테스트 및 검증 | 1주 | QA팀 + 개발팀 |
| 7 | 문서화 및 배포 | 1주 | 전체 팀 |

---

## 장단점 분석

### 장점 ✅

1. **도메인 명확화**: 각 비즈니스 영역의 독립성 확보
2. **확장성**: 도메인별 기능 추가 용이
3. **보안**: 스키마별 접근 권한 설정
4. **팀 협업**: 도메인별 팀 분리, Git 충돌 최소화
5. **표준화**: 업계 표준 용어 사용 (HRM, CRM, PIM, WMS, APM)
6. **마이크로서비스 준비**: 향후 서비스 분리 용이
7. **성능**: 스키마별 최적화 가능
8. **유지보수성**: 파일 크기 감소, 코드 리뷰 용이

### 단점 ❌

1. **복잡도 증가**: 스키마 개수 증가 (12개 → 15개)
2. **마이그레이션 비용**: 약 8주 소요
3. **학습 곡선**: 새로운 구조 학습 필요

---

## 실행 계획

### 즉시 시작 가능한 작업

1. **hrm.sql 생성** (Week 1) - 가장 독립적
2. **pim.sql 생성** (Week 2) - 참조가 많지만 명확
3. **crm.sql 생성** (Week 3) - csm 통합 결정 필요
4. **wms.sql 생성** (Week 4) - lwm 통합
5. **apm.sql 설계** (Week 5) - 신규 기능

### 승인 필요 사항

- [ ] lwm과 wms 통합 방식 결정
- [ ] csm과 crm 통합 방식 결정
- [ ] 8주 마이그레이션 일정 승인
- [ ] 인력 배정 승인

---

## 결론

adm 스키마를 **hrm, crm, pim, wms, apm**으로 분리하는 것은  
**장기적으로 매우 유익한 투자**입니다.

### 핵심 요약

1. ✅ **도메인 명확화**: 각 비즈니스 영역의 독립성 확보
2. ✅ **표준화**: 업계 표준 용어 및 구조 채택
3. ✅ **확장성**: 향후 기능 추가 및 마이크로서비스 전환 용이
4. ✅ **워크플로우 추가**: 현재 누락된 결재 시스템 구축 (apm)
5. ✅ **lwm 정정**: Logistics & WMS로 명확화, wms와 통합 검토

---

**문서 끝**
