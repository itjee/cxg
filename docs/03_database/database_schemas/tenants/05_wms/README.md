# WMS 스키마 (창고관리시스템)

## 개요
창고관리시스템 스키마로, 창고, 로케이션, 입출고 관리 정보를 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_warehouses.sql** - 창고 마스터 테이블
3. **02_warehouse_employees.sql** - 창고 담당자 테이블
4. **03_warehouse_locations.sql** - 창고 로케이션 테이블
5. **04_receiving.sql** - 입고 마스터 테이블
6. **05_receiving_items.sql** - 입고 상세 테이블
7. **06_shipping.sql** - 출고 마스터 테이블
8. **07_shipping_items.sql** - 출고 상세 테이블

## 테이블 상세

### 1. warehouses (창고 마스터)
창고 기본 정보 관리
- 창고 코드 및 명칭
- 다국어 지원 (name, name_en)
- 창고 유형 (MAIN/SUB/DISTRIBUTION/RETURN/EXTERNAL)
- 주소 및 연락처 정보
- 담당자 정보 (manager_id)
- 운영 정보 (운영시간, 면적, 용량)
- 상태 관리 (ACTIVE/INACTIVE/MAINTENANCE/CLOSED)

### 2. warehouse_employees (창고 담당자)
창고별 담당 직원 관리
- 창고별 담당자 지정
- 담당 역할 (MANAGER/SUPERVISOR/WORKER/DRIVER/GUARD)
- 담당 기간 관리 (시작일/종료일)
- 상태 관리

### 3. warehouse_locations (창고 로케이션)
창고 내 로케이션(위치) 관리
- 계층 구조 지원 (parent_id, level, path)
- 로케이션 코드 및 명칭
- 로케이션 유형 (ZONE/RACK/SHELF/BIN/PALLET/FLOOR)
- 위치 좌표 (X, Y, Z)
- 용량 정보 (최대 중량, 부피, 팔레트 수)
- 저장 조건 (온도, 습도)
- 상태 관리 (AVAILABLE/OCCUPIED/RESERVED/BLOCKED/MAINTENANCE)

### 4. receiving (입고 마스터)
입고 헤더 정보 관리
- 입고 번호 및 유형 (PURCHASE_ORDER/RETURN/TRANSFER/PRODUCTION)
- 공급업체 정보
- 입고 예정일/실제일
- 담당 창고 및 직원
- 상태 관리 (SCHEDULED/IN_PROGRESS/COMPLETED/CANCELLED)

### 5. receiving_items (입고 상세)
입고 품목 상세 정보 관리
- 입고 헤더 참조
- 제품 정보 및 수량
- 로케이션 정보
- 단가 및 금액
- 배치/LOT/시리얼 번호
- 유효기간 정보
- 검수 정보 (합격/불합격/보류)
- 상태 관리

### 6. shipping (출고 마스터)
출고 헤더 정보 관리
- 출고 번호 및 유형 (SALES_ORDER/TRANSFER/RETURN/PRODUCTION)
- 고객 정보
- 출고 예정일/실제일
- 담당 창고 및 직원
- 배송 정보 (주소, 운송사, 추적번호)
- 상태 관리 (SCHEDULED/PICKING/PACKING/SHIPPED/DELIVERED/CANCELLED)

### 7. shipping_items (출고 상세)
출고 품목 상세 정보 관리
- 출고 헤더 참조
- 제품 정보 및 수량
- 로케이션 정보
- 단가 및 금액
- 배치/LOT/시리얼 번호
- 피킹 정보
- 상태 관리

## 외래키 관계

```
warehouses (manager_id) -> hrm.employees (id)  [SET NULL]
warehouse_employees (warehouse_id) -> warehouses (id)  [CASCADE]
warehouse_employees (employee_id) -> hrm.employees (id)  [RESTRICT]
warehouse_locations (warehouse_id) -> warehouses (id)  [CASCADE]
warehouse_locations (parent_id) -> warehouse_locations (id)  [자기 참조, CASCADE]
receiving (warehouse_id) -> warehouses (id)  [RESTRICT]
receiving (supplier_id) -> crm.partners (id)  [RESTRICT]
receiving (employee_id) -> hrm.employees (id)  [SET NULL]
receiving_items (receiving_id) -> receiving (id)  [CASCADE]
receiving_items (product_id) -> pim.products (id)  [RESTRICT]
receiving_items (location_id) -> warehouse_locations (id)  [SET NULL]
shipping (warehouse_id) -> warehouses (id)  [RESTRICT]
shipping (customer_id) -> crm.partners (id)  [RESTRICT]
shipping (employee_id) -> hrm.employees (id)  [SET NULL]
shipping_items (shipping_id) -> shipping (id)  [CASCADE]
shipping_items (product_id) -> pim.products (id)  [RESTRICT]
shipping_items (location_id) -> warehouse_locations (id)  [SET NULL]
```

## 주요 특징

### 계층 구조
- warehouse_locations: 자기 참조를 통한 로케이션 계층
- level 및 path 필드로 계층 관리

### 입출고 프로세스
- 입고: SCHEDULED → IN_PROGRESS → COMPLETED
- 출고: SCHEDULED → PICKING → PACKING → SHIPPED → DELIVERED

### 로케이션 관리
- 다양한 로케이션 유형 지원
- 3D 좌표 (X, Y, Z) 관리
- 용량 및 저장 조건 관리

### 재고 추적
- 배치/LOT 번호 관리
- 시리얼 번호 관리
- 유효기간 관리

### 검수 관리
- 입고 시 검수 상태 관리 (합격/불합격/보류)
- 불합격 사유 기록

## DDL 작성 표준
모든 파일은 `/docs/prompts/ddl_standard_prompt.md`의 표준을 따릅니다:

- ✅ 표준 컬럼 형식 (id, created_at, created_by, updated_at, updated_by)
- ✅ 짧은 네이밍 규칙 (code, name, name_en)
- ✅ 줄 주석 및 정렬
- ✅ COMMENT ON 문 작성
- ✅ 인덱스 및 제약조건 주석
- ✅ 외래키 제약조건 및 삭제 옵션

## 작성 이력
- 2024-12-19: 초기 작성
- 2025-10-20: 스키마 생성
- 2025-10-22: 표준 형식 적용 및 테이블 분리
- 2025-10-23: DDL 표준 프롬프트 기준 적용
