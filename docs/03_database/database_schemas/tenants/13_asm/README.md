# ASM 스키마 (애프터서비스 관리)

## 개요
애프터서비스 관리 스키마로, 서비스 요청, 작업 관리, 부품 관리, 고객 지원 티켓 및 FAQ를 관리합니다.

## 테이블 구조

### 실행 순서
파일은 숫자 순서대로 실행되어야 합니다:

1. **00_schema.sql** - 스키마 생성
2. **01_service_requests.sql** - 서비스 요청 테이블
3. **02_service_works.sql** - 서비스 작업 테이블
4. **03_service_parts.sql** - 서비스 부품 테이블
5. **04_support_tickets.sql** - 지원 티켓 테이블
6. **05_ticket_comments.sql** - 티켓 댓글 테이블
7. **06_faqs.sql** - FAQ 테이블

## 테이블 상세

### 1. service_requests (서비스 요청)
고객 서비스 요청 정보 관리
- 서비스 요청 번호 자동 생성
- 요청 일자
- 고객 정보 (customer_id)
- 제품 정보 (product_id)
- 시리얼 번호 (serial_no)
- 요청 유형 (REPAIR/MAINTENANCE/INSPECTION/INSTALLATION/CONSULTATION)
- 우선순위 (URGENT/HIGH/NORMAL/LOW)
- 증상 및 요청 내용
- 방문 정보
  - 방문 희망일 (preferred_date)
  - 방문 주소
- 담당자 정보
  - 담당 기사 (technician_id)
  - 접수자 (received_by)
- 상태 관리 (PENDING/ASSIGNED/SCHEDULED/IN_PROGRESS/COMPLETED/CANCELLED/CLOSED)
- 비용 정보
  - 예상 비용 (estimated_cost)
  - 실제 비용 (actual_cost)
  - 통화 코드
- 완료 정보
  - 완료일 (completed_at)
  - 고객 평점 (rating)
  - 고객 피드백

### 2. service_works (서비스 작업)
서비스 작업 내역 및 진행 상황 관리
- 서비스 요청 참조 (request_id)
- 작업 순번
- 작업 유형 (DIAGNOSIS/REPAIR/REPLACEMENT/ADJUSTMENT/CLEANING/TESTING)
- 작업 내용 및 결과
- 담당 기사 (technician_id)
- 작업 일시
  - 시작 시간 (started_at)
  - 종료 시간 (completed_at)
  - 소요 시간 (duration_minutes)
- 작업 비용
  - 인건비 (labor_cost)
  - 부품비 (parts_cost)
  - 총 비용 (total_cost)
  - 통화 코드
- 상태 관리 (PENDING/IN_PROGRESS/COMPLETED/FAILED/CANCELLED)

### 3. service_parts (서비스 부품)
서비스 작업에 사용된 부품 정보 관리
- 서비스 요청 참조 (request_id)
- 서비스 작업 참조 (work_id)
- 제품 정보 (product_id)
- 부품 정보
  - 부품 코드
  - 부품명
  - 사양
- 수량
- 부품 유형 (NEW/REFURBISHED/EXCHANGE/WARRANTY)
- 비용 정보
  - 단가
  - 총액
  - 통화 코드
- 재고 정보
  - 창고 (warehouse_id)
  - 로케이션 (location_id)
- 시리얼 번호
- 상태 관리 (PENDING/USED/RETURNED/CANCELLED)

### 4. support_tickets (지원 티켓)
고객 지원 티켓 및 문의 관리
- 티켓 번호 자동 생성
- 생성 일시
- 고객 정보 (customer_id)
- 제품 정보 (product_id)
- 티켓 유형 (QUESTION/BUG/FEATURE_REQUEST/COMPLAINT/FEEDBACK)
- 우선순위
- 채널 (EMAIL/PHONE/WEB/CHAT/SOCIAL_MEDIA)
- 제목 및 내용
- 첨부파일 URL
- 담당자 정보
  - 담당자 (assigned_to)
  - 할당일 (assigned_at)
- 상태 관리 (OPEN/PENDING/IN_PROGRESS/RESOLVED/CLOSED/REOPENED)
- 해결 정보
  - 해결일 (resolved_at)
  - 종결일 (closed_at)
  - 해결 내용
- 고객 평가
  - 평점 (rating)
  - 피드백

### 5. ticket_comments (티켓 댓글)
지원 티켓 댓글 및 대화 이력 관리
- 티켓 참조 (ticket_id)
- 작성자 정보
  - 작성자 유형 (CUSTOMER/AGENT/SYSTEM)
  - 작성자 ID (author_id)
  - 작성자명 (author_name)
- 댓글 내용
- 첨부파일 URL
- 내부 메모 여부 (is_internal)
- 작성 일시
- 상태 관리

### 6. faqs (FAQ)
자주 묻는 질문 관리
- FAQ 코드
- 카테고리
- 제품 카테고리 (product_category_id)
- 질문 및 답변
  - 질문 (question)
  - 답변 (answer)
  - 다국어 지원 (question_en, answer_en)
- 키워드 (검색용)
- 정렬 순서
- 조회수 (view_count)
- 도움됨 카운트 (helpful_count)
- 공개 여부 (is_published)
- 상태 관리

## 외래키 관계

```
service_requests (customer_id) -> crm.partners (id)  [RESTRICT]
service_requests (product_id) -> pim.products (id)  [SET NULL]
service_requests (technician_id) -> hrm.employees (id)  [SET NULL]
service_requests (received_by) -> hrm.employees (id)  [SET NULL]
service_requests (currency_code) -> adm.currencies (code)  [RESTRICT]
service_works (request_id) -> service_requests (id)  [CASCADE]
service_works (technician_id) -> hrm.employees (id)  [SET NULL]
service_works (currency_code) -> adm.currencies (code)  [RESTRICT]
service_parts (request_id) -> service_requests (id)  [CASCADE]
service_parts (work_id) -> service_works (id)  [SET NULL]
service_parts (product_id) -> pim.products (id)  [RESTRICT]
service_parts (warehouse_id) -> wms.warehouses (id)  [SET NULL]
service_parts (location_id) -> wms.warehouse_locations (id)  [SET NULL]
service_parts (currency_code) -> adm.currencies (code)  [RESTRICT]
support_tickets (customer_id) -> crm.partners (id)  [RESTRICT]
support_tickets (product_id) -> pim.products (id)  [SET NULL]
support_tickets (assigned_to) -> hrm.employees (id)  [SET NULL]
ticket_comments (ticket_id) -> support_tickets (id)  [CASCADE]
faqs (product_category_id) -> pim.categories (id)  [SET NULL]
```

## 주요 특징

### 서비스 프로세스
1. **서비스 요청**
   - 요청 접수: PENDING
   - 담당자 배정: ASSIGNED
   - 일정 확정: SCHEDULED
   - 작업 진행: IN_PROGRESS
   - 작업 완료: COMPLETED
   - 종결: CLOSED

2. **서비스 작업**
   - 대기: PENDING
   - 진행중: IN_PROGRESS
   - 완료: COMPLETED
   - 실패: FAILED

### 지원 티켓 프로세스
- 생성: OPEN
- 대기: PENDING
- 진행중: IN_PROGRESS
- 해결: RESOLVED
- 종결: CLOSED
- 재오픈: REOPENED

### 비용 계산
**서비스 요청:**
```
actual_cost = Σ(service_works.total_cost)
```

**서비스 작업:**
```
total_cost = labor_cost + parts_cost
parts_cost = Σ(service_parts.amount)
```

### 요청 유형
- REPAIR: 수리
- MAINTENANCE: 유지보수
- INSPECTION: 점검
- INSTALLATION: 설치
- CONSULTATION: 상담

### 작업 유형
- DIAGNOSIS: 진단
- REPAIR: 수리
- REPLACEMENT: 교체
- ADJUSTMENT: 조정
- CLEANING: 청소
- TESTING: 테스트

### 부품 유형
- NEW: 신품
- REFURBISHED: 리퍼비시
- EXCHANGE: 교환
- WARRANTY: 무상 (보증)

### 티켓 유형
- QUESTION: 문의
- BUG: 버그 신고
- FEATURE_REQUEST: 기능 요청
- COMPLAINT: 불만
- FEEDBACK: 피드백

### 고객 만족도
- 서비스 완료 시 평점(rating) 1-5점
- 고객 피드백 텍스트
- 티켓 해결 시 평점 및 피드백

### FAQ 관리
- 카테고리별 분류
- 제품별 분류
- 키워드 검색
- 조회수 및 도움됨 카운트 추적
- 공개/비공개 설정

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
