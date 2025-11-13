# Deprecated Schema Files

이 디렉토리는 사용되지 않는 스키마 파일들을 보관합니다.

## 파일 목록

### 백업 파일

- **adm.sql.old** (2,752 lines)
  - 구버전 adm 스키마
  - 상태: 01_adm.sql로 대체됨 (축소 버전)
  - 날짜: 2025-01-20

- **lwm.sql.old** (228 lines)
  - Logistics & WMS 스키마
  - 상태: 05_wms.sql에 통합됨
  - 날짜: 2025-01-20

- **05_wms_partial.sql.old**
  - WMS 부분 파일 (임시)
  - 상태: 05_wms.sql로 통합됨
  - 날짜: 2025-01-20

### 통합 완료 파일

- **csm.sql.integrated** (140 lines)
  - Customer Support Management 스키마
  - 상태: 13_asm.sql에 통합됨 ✅
  - 통합일: 2025-01-20
  - 사유: 고객 서비스팀에서 문의/지원과 A/S를 함께 관리

## 통합 이력

### 2025-01-20: CSM → ASM 통합

**통합된 테이블**:
- csm.support_tickets → asm.support_tickets
- csm.ticket_comments → asm.ticket_comments
- csm.faqs → asm.faqs

**추가된 기능**:
- A/S 요청 연계 (`linked_service_request_id`)
- 완전한 인덱스 및 제약조건
- 전체 컬럼 주석

**참고 문서**:
- `docs/database/CSM_ASM_CRM_INTEGRATION_ANALYSIS.md`

## 주의사항

- 이 디렉토리의 파일들은 **사용하지 않습니다**
- 확정된 스키마는 숫자 prefix가 있는 파일입니다 (00_*.sql ~ 22_*.sql)
- 백업 목적으로만 보관됩니다
