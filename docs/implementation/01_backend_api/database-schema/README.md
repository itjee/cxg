# 데이터베이스 스키마 개선 문서

이 폴더는 ConexGrow 데이터베이스 스키마에 대한 분석 및 개선 작업 관련 문서를 포함합니다.

## 📁 폴더 구조

```
database-schema/
├── README.md (이 파일)
├── 컬럼명_네이밍_개선_종합보고서_20251024211736.md    # 📌 메인 문서
├── Boolean_컬럼_개선_추적_20251024211736.md          # 상세 추적 자료
└── 컬럼명_개선_구현완료_20251024211736.md             # 구현 완료 보고서
```

## 📄 문서 설명

### 1. 컬럼명_네이밍_개선_종합보고서 ⭐ (메인 문서)
**읽는 순서**: 1번 - 먼저 읽기

전체 프로젝트의 종합 보고서입니다. 다음 내용을 포함합니다:
- 분석 목표 및 범위
- 주요 분석 결과 (2,818개 컬럼 분석)
- 구현된 22개 컬럼의 모든 개선사항
- 12개 테이블의 상세 변경 내역
- 영향 분석 및 마이그레이션 계획
- 다음 단계 작업 (ORM, API, DB 마이그레이션)

**대상 독자**: 프로젝트 매니저, 리드 개발자, 아키텍트

### 2. Boolean_컬럼_개선_추적 (상세 추적 자료)
**읽는 순서**: 2번 - 세부 정보 확인 시 읽기

Boolean 컬럼 네이밍 개선의 추적 과정입니다. 다음 내용을 포함합니다:
- 11개 테이블의 21개 Boolean 컬럼 개선 내역
- 각 컬럼의 변경 전/후 비교
- 관련 인덱스 수정 사항
- 완료 체크리스트

**대상 독자**: 개발팀, 데이터베이스 관리자

### 3. 컬럼명_개선_구현완료 (구현 완료 보고서)
**읽는 순서**: 3번 - 구현 세부사항 확인 시 읽기

전체 구현 작업의 최종 보고서입니다. 다음 내용을 포함합니다:
- Phase 1: Boolean 컬럼 (21개, 11개 테이블)
- Phase 2: Temporal 컬럼 (1개, 1개 테이블)
- 파일별 수정 내역
- 다음 단계 (ORM, API, DB 마이그레이션, 테스트)

**대상 독자**: 개발팀, QA팀

---

## 🎯 주요 내용 요약

### 분석 대상
- **파일**: 127개 SQL 스키마 파일
- **컬럼**: 2,818개 컬럼 정의
- **데이터베이스**: PostgreSQL 15+, 테넌트 데이터베이스

### 개선 내용
- **Boolean 컬럼**: 21개 컬럼 → `is_`, `has_`, `should_` 접두어 적용
- **Temporal 컬럼**: 1개 컬럼 → `_at` 접미어 적용

### 영향받는 모듈 (4/15개)
1. HRM (hrm) - 1개 테이블
2. CRM (crm) - 4개 테이블
3. WMS (wms) - 1개 테이블
4. IVM (ivm) - 2개 테이블
5. FIM (fim) - 1개 테이블
6. COM (com) - 1개 테이블

---

## 🔧 다음 단계 (Action Items)

### Phase 1: 백엔드 업데이트
1. **ORM 모델 업데이트** (`apps/backend-api/src/models/`)
   - 12개 테이블의 SQLAlchemy 모델 필드명 수정

2. **API 스키마 업데이트** (`apps/backend-api/src/schemas/`)
   - Pydantic 스키마 필드명 수정
   - 요청/응답 모델 필드명 수정

3. **데이터베이스 마이그레이션**
   - Alembic 마이그레이션 스크립트 생성
   - 개발 DB 테스트
   - 스테이징 DB 테스트

### Phase 2: 프론트엔드 업데이트
1. **TypeScript 타입 정의** (`packages/shared-types/`)
2. **API 응답 처리** (`apps/tenants-web/`)
3. **폼 필드 바인딩** (`apps/tenants-web/`)

### Phase 3: 테스트 및 배포
1. 단위 테스트 (Unit Tests)
2. 통합 테스트 (Integration Tests)
3. 회귀 테스트 (Regression Tests)
4. 배포 준비

---

## 📊 통계

| 항목 | 수치 |
|------|------|
| **전체 컬럼 수** | 2,818 |
| **개선 필요 컬럼** | 22 |
| **수정된 파일** | 12 |
| **수정된 인덱스** | 7 |
| **Boolean 컬럼** | 21 |
| **Temporal 컬럼** | 1 |

---

## 📚 관련 자료

### 프로젝트 문서
- `/CLAUDE.md` - 프로젝트 아키텍처 및 개발 가이드
- `/packages/database/README.md` - 데이터베이스 구조

### 외부 참고 자료
- [Django ORM Naming Conventions](https://docs.djangoproject.com/en/stable/ref/models/fields/)
- [Rails Active Record Naming Conventions](https://guides.rubyonrails.org/active_record_basics.html)
- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/current/)

---

## 💬 문의 사항

이 문서에 대한 질문이나 피드백은 개발팀 리더에게 문의하시기 바랍니다.

---

**최종 업데이트**: 2025-10-24
**작성자**: Claude Code
**상태**: 구현 완료, 통합 테스트 대기
