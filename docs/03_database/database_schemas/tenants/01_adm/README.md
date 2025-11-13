# ADM 스키마 (공통 기준정보)

## 개요
공통 기준정보 스키마로, 시스템 전체에서 사용하는 공통코드, 설정, 통화, 단위 등을 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_code_groups.sql** - 공통코드 그룹 테이블
3. **02_codes.sql** - 공통코드 테이블
4. **03_settings.sql** - 시스템 설정 테이블
5. **04_currencies.sql** - 통화 테이블
6. **05_exchange_rates.sql** - 환율 테이블
7. **06_units.sql** - 단위 테이블

## 테이블 상세

### 1. code_groups (공통코드 그룹)
시스템 전체에서 사용하는 코드 분류 관리
- 계층 구조 지원 (parent_group_id, level)
- 논리 삭제 지원 (is_deleted)

### 2. codes (공통코드)
시스템 전체에서 사용하는 코드값 관리
- 코드그룹별 코드 관리
- 다국어 지원 (name, name_en)
- 확장 속성 지원 (attribute1-3)
- 시스템 코드 보호 (is_system)

### 3. settings (시스템 설정)
애플리케이션 설정 및 환경 변수 관리
- 값 타입 지정 (STRING/NUMBER/BOOLEAN/JSON)
- 카테고리 분류
- 암호화 필드 표시 (is_encrypted)

### 4. currencies (통화)
ISO 4217 표준 통화 코드 관리
- 통화 코드는 3자리 영대문자
- 통화별 소수점 자릿수 관리
- 기준 통화 지정 가능

### 5. exchange_rates (환율)
통화간 환율 정보 관리
- 통화 쌍(from_currency, to_currency) 관리
- 날짜별 환율 이력 관리
- 환율 유형 구분 (SPOT/FORWARD/BUYING/SELLING)

### 6. units (단위)
재고, 수량, 길이, 무게 등의 측정 단위 관리
- 단위 유형 분류 (QUANTITY/WEIGHT/LENGTH/VOLUME/AREA)
- 단위 환산 지원 (base_unit_id, conversion_rate)
- 기준 단위 지정 가능

## 외래키 관계

```
code_groups (parent_group_id) -> code_groups (id)  [자기 참조, SET NULL]
codes (group_id) -> code_groups (id)  [CASCADE]
exchange_rates (from_currency) -> currencies (code)  [RESTRICT]
exchange_rates (to_currency) -> currencies (code)  [RESTRICT]
units (base_unit_id) -> units (id)  [자기 참조, SET NULL]
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
- 2025-01-22: 표준 형식 적용 및 테이블 분리
