# IVM 스키마 (재고 관리)

## 개요
재고 관리 스키마로, 제품별/창고별/로케이션별 재고 현황 및 재고 이동 이력을 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_inventory_balances.sql** - 재고 현황 테이블
3. **02_inventory_movements.sql** - 재고 이동 이력 테이블

## 테이블 상세

### 1. inventory_balances (재고 현황)
제품별 창고/로케이션별 재고 현황 관리
- 제품 정보 (product_id)
- 창고 정보 (warehouse_id)
- 로케이션 정보 (location_id)
- 재고 수량
  - 가용 재고 (available_qty): 출고 가능한 재고
  - 예약 재고 (reserved_qty): 예약/할당된 재고
  - 불량 재고 (damaged_qty): 불량/결함 재고
  - 총 재고 (total_qty): 전체 재고
- 배치/LOT 정보
  - 배치 번호 (batch_no)
  - LOT 번호 (lot_no)
  - 시리얼 번호 (serial_no)
  - 제조일 (manufactured_date)
  - 유효기간 (expiry_date)
- 원가 정보
  - 단위 원가 (unit_cost)
  - 총 원가 (total_cost)
  - 통화 코드 (currency_code)
- 최종 이동 정보
  - 최종 입고일 (last_received_at)
  - 최종 출고일 (last_shipped_at)
  - 최종 재고조사일 (last_counted_at)
- 상태 관리

### 2. inventory_movements (재고 이동)
재고 이동 이력 및 트랜잭션 관리
- 이동 유형 (movement_type)
  - **IN**: 입고 (RECEIVING/RETURN/TRANSFER_IN/PRODUCTION/ADJUSTMENT)
  - **OUT**: 출고 (SHIPPING/TRANSFER_OUT/CONSUMPTION/ADJUSTMENT/DAMAGE)
- 제품 정보 (product_id)
- 창고/로케이션 정보
  - from_warehouse_id / to_warehouse_id
  - from_location_id / to_location_id
- 수량 정보
  - 이동 수량 (quantity)
  - 이동 전 수량 (before_qty)
  - 이동 후 수량 (after_qty)
- 배치/LOT 정보
- 원가 정보
- 참조 정보
  - 참조 유형 (reference_type): RECEIVING/SHIPPING/TRANSFER/PRODUCTION/ADJUSTMENT
  - 참조 ID (reference_id)
  - 참조 번호 (reference_no)
- 담당자 정보 (employee_id)
- 이동 사유 및 메모
- 이동 일시 (moved_at)
- 상태 관리

## 외래키 관계

```
inventory_balances (product_id) -> pim.products (id)  [RESTRICT]
inventory_balances (warehouse_id) -> wms.warehouses (id)  [RESTRICT]
inventory_balances (location_id) -> wms.warehouse_locations (id)  [SET NULL]
inventory_balances (currency_code) -> adm.currencies (code)  [RESTRICT]
inventory_movements (product_id) -> pim.products (id)  [RESTRICT]
inventory_movements (from_warehouse_id) -> wms.warehouses (id)  [RESTRICT]
inventory_movements (to_warehouse_id) -> wms.warehouses (id)  [RESTRICT]
inventory_movements (from_location_id) -> wms.warehouse_locations (id)  [SET NULL]
inventory_movements (to_location_id) -> wms.warehouse_locations (id)  [SET NULL]
inventory_movements (employee_id) -> hrm.employees (id)  [SET NULL]
inventory_movements (currency_code) -> adm.currencies (code)  [RESTRICT]
```

## 주요 특징

### 실시간 재고 현황
- 제품별/창고별/로케이션별 실시간 재고 수량
- 가용/예약/불량 재고 구분 관리
- 배치/LOT별 재고 추적

### 재고 이동 추적
- 모든 재고 이동 이력 기록
- 이동 전/후 수량 추적
- 참조 문서 연계 (입고/출고/이전/생산/조정)

### 이동 유형
**입고 (IN):**
- RECEIVING: 일반 입고
- RETURN: 반품 입고
- TRANSFER_IN: 이전 입고
- PRODUCTION: 생산 입고
- ADJUSTMENT: 재고 조정 증가

**출고 (OUT):**
- SHIPPING: 일반 출고
- TRANSFER_OUT: 이전 출고
- CONSUMPTION: 소비/사용
- ADJUSTMENT: 재고 조정 감소
- DAMAGE: 불량/파손

### 배치/LOT 관리
- 배치 번호별 재고 추적
- LOT 번호별 재고 추적
- 시리얼 번호별 개별 추적
- 제조일/유효기간 관리

### 원가 관리
- 단위 원가 및 총 원가 관리
- 다중 통화 지원
- 이동 시점의 원가 기록

### 참조 연계
- 입출고 문서 연계
- 이전/생산/조정 문서 연계
- 참조 유형 및 번호 추적

## 재고 계산 로직

### 총 재고 (total_qty)
```
total_qty = available_qty + reserved_qty + damaged_qty
```

### 출고 가능 수량
```
출고 가능 = available_qty (예약 및 불량 제외)
```

### 재고 이동 시 업데이트
1. **입고 시**:
   - available_qty += quantity
   - total_qty += quantity
   - last_received_at = now

2. **출고 시**:
   - available_qty -= quantity
   - total_qty -= quantity
   - last_shipped_at = now

3. **예약 시**:
   - available_qty -= quantity
   - reserved_qty += quantity

4. **불량 처리 시**:
   - available_qty -= quantity
   - damaged_qty += quantity

## DDL 작성 표준
모든 파일은 `/docs/prompts/ddl_standard_prompt.md`의 표준을 따릅니다:

- ✅ 표준 컬럼 형식 (id, created_at, created_by, updated_at, updated_by)
- ✅ 짧은 네이밍 규칙 (code, name, name_en)
- ✅ 줄 주석 및 정렬
- ✅ COMMENT ON 문 작성
- ✅ 인덱스 및 제약조건 주석
- ✅ 외래키 제약조건 및 삭제 옵션

## 작성 이력
- 2024-10-20: 초기 작성
- 2025-10-22: 표준 형식 적용 및 테이블 분리
