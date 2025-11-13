# PIM 스키마 (제품정보관리)

## 개요
제품정보관리 스키마로, 제조사, 브랜드, 카테고리, 제품 정보를 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_makers.sql** - 제조사 테이블
3. **02_brands.sql** - 브랜드 테이블
4. **03_categories.sql** - 카테고리 테이블
5. **04_category_managers.sql** - 카테고리 담당자 테이블
6. **05_products.sql** - 제품 테이블
7. **06_product_managers.sql** - 제품 담당자 테이블

## 테이블 상세

### 1. makers (제조사)
제조사 마스터 정보 관리
- 제조사 코드 및 명칭
- 다국어 지원 (name, name_en)
- 본사 국가 정보
- 연락처 및 주소 정보
- 로고 및 정렬 순서
- 상태 관리 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)

### 2. brands (브랜드)
브랜드 마스터 정보 관리
- 브랜드 코드 및 명칭
- 다국어 지원 (name, name_en)
- 제조사 연계 (maker_id)
- 로고 및 정렬 순서
- 상태 관리

### 3. categories (카테고리)
제품 카테고리 계층 구조 관리
- 계층 구조 지원 (parent_id, level, path)
- 카테고리 코드 및 명칭
- 다국어 지원
- 정렬 순서
- 상태 관리

### 4. category_managers (카테고리 담당자)
카테고리별 담당자 관리
- 카테고리별 주/부 담당자 지정
- 담당 기간 관리 (시작일/종료일)
- 상태 관리

### 5. products (제품)
제품 마스터 정보 관리
- 제품 코드 및 명칭
- 다국어 지원 (name, name_en)
- 제조사/브랜드/카테고리 연계
- 제품 사양 (모델명, 규격, 단위)
- 바코드/QR코드
- 이미지 및 첨부파일
- 원가/판매가 정보
- 재고 관리 (안전재고, 최소/최대 주문량)
- 상태 관리 (ACTIVE/INACTIVE/DISCONTINUED/PENDING/OUT_OF_STOCK)

### 6. product_managers (제품 담당자)
제품별 담당자 관리
- 제품별 주/부 담당자 지정
- 담당 기간 관리
- 상태 관리

## 외래키 관계

```
brands (maker_id) -> makers (id)  [RESTRICT]
categories (parent_id) -> categories (id)  [자기 참조, CASCADE]
category_managers (category_id) -> categories (id)  [CASCADE]
category_managers (employee_id) -> hrm.employees (id)  [RESTRICT]
products (maker_id) -> makers (id)  [RESTRICT]
products (brand_id) -> brands (id)  [RESTRICT]
products (category_id) -> categories (id)  [RESTRICT]
products (currency_code) -> adm.currencies (code)  [RESTRICT]
products (unit_id) -> adm.units (id)  [RESTRICT]
product_managers (product_id) -> products (id)  [CASCADE]
product_managers (employee_id) -> hrm.employees (id)  [RESTRICT]
```

## 주요 특징

### 계층 구조
- categories: 자기 참조를 통한 카테고리 계층
- level 및 path 필드로 계층 관리

### 다국어 지원
- 제조사, 브랜드, 카테고리, 제품: name, name_en 필드

### 담당자 관리
- 카테고리별, 제품별 담당자 지정 가능
- 주/부 담당자 구분
- 담당 기간 관리

### 재고 관리
- 제품별 안전재고 수량
- 최소/최대 주문 수량
- 재고 부족 상태 표시

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
