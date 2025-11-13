# Backend API 구현 이력

이 폴더는 backend-api 시스템의 구현 및 변경 이력을 관리합니다.

## 파일 명명 규칙

- 작업 완료 시점의 타임스탬프를 파일명에 포함: `{작업명}_yyyymmddhhmmss.md`
- 예: `api_routes_reference_20251017155434.md`

## 주요 문서

### API 구조
- `API_DOCUMENTATION.md`: API 전체 문서
- `API_STRUCTURE.txt`: API 구조 트리
- `QUICK_START.md`: 빠른 시작 가이드

### 모델 정의
- `MODELS.md`: 데이터 모델 기본 문서
- `MODELS_COMPLETE.md`: 데이터 모델 상세 문서
- `CRUD_MODULES_COMPLETE.md`: CRUD 모듈 완전 문서

### 구현 이력
- `route_groups_implementation_*.md`: 라우트 그룹화 구현
- `api_routes_reference_*.md`: API 라우트 참조
- `format_quick_start_*.md`: 포맷 빠른 시작

## 최근 주요 변경사항

1. API 라우팅을 스키마 단위로 재구성
   - 패턴: `/api/v1/{system}/{schema}/{entity}`
   - 예: `/api/v1/manager/bill/invoices`

2. Swagger 문서화 개선
   - 시스템 > 스키마 > 엔티티 3단계 그룹화
   - 한글 설명 우선 표시, 경로는 괄호 안에 표시

3. 자동 포맷팅 설정
   - 저장 시 import 정렬 및 린트 자동 적용
