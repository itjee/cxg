# 📚 문서 관리 가이드라인

**최종 수정**: 2025-10-27 18:45:00 KST

## 🎯 문서 관리 원칙

이 문서는 ConexGrow 프로젝트의 모든 마크다운 및 텍스트 문서 관리 기준을 정의합니다.

---

## 📂 문서 구조 개요

```
docs/
├── 01_onboarding/              (🚀 시작하기)
├── 02_architecture/            (🏗️ 아키텍처)
├── 03_database/                (💾 데이터베이스)
├── 04_api/                     (🔌 API 및 인증권한)
├── 05_frontend/                (🎨 프론트엔드)
├── 06_deployment/              (🚀 배포)
├── 07_references/              (📚 참고 자료)
└── implementation/             (📖 구현 세부사항)
```

---

## ✨ 각 카테고리 정의

### 01_onboarding - 시작하기
**목적**: 새로운 개발자가 빠르게 프로젝트에 입문하도록 돕기

**포함 내용**:
- 프로젝트 소개
- 빠른 시작 가이드 (Quick Start)
- 개발 환경 설정
- 기본 명령어

**예시 파일**:
- `QUICK_START.md`
- `QUICK_REFERENCE.md`
- `PROJECT_README.md`
- `10-DEVELOPMENT-SETUP.md`

---

### 02_architecture - 아키텍처
**목적**: 시스템 설계 및 전체 구조를 이해하기

**포함 내용**:
- 프로젝트 전체 구조
- 아키텍처 설계
- 기술 스택
- 명명 규칙

**예시 파일**:
- `PROJECT_MANIFEST.md`
- `FRONTEND_STRUCTURE.md`
- `02-ARCHITECTURE.md`
- `03-TECH-STACK.md`
- `04-PROJECT-STRUCTURE.md`

---

### 03_database - 데이터베이스
**목적**: 데이터베이스 설계, DDL, 마이그레이션 관리

**포함 내용**:
- DDL 파일 인덱스 및 분석
- 마이그레이션 가이드
- 컬럼 표준화
- 스키마 설계 및 개선
- 데이터베이스 분석 및 리포트

**하위 폴더**:
- `database_schemas/` - 실제 스키마 폴더 구조
- TXT 파일: 분석 결과 (all_columns.txt, QUICK_STATS.txt 등)

**예시 파일**:
- `DDL_INDEX.md`
- `DDL_SUMMARY.md`
- `MIGRATION_EXECUTION_GUIDE.md`
- `MODULE_REFERENCE_INDEX.md`
- `08-DATABASE-GUIDE.md`

---

### 04_api - API 및 인증권한
**목적**: API 개발, 인증/권한 관리, 백엔드 구현

**포함 내용**:
- 인증/권한 시스템 설계
- API 명세서
- API 라우팅
- 백엔드 개발 가이드
- 인증 관련 구현

**하위 폴더**:
- `backend_analysis/` - 백엔드 분석 자료

**예시 파일**:
- `인증권한_아키텍처분석_*.md`
- `인증권한_DDL개선_*.md`
- `백엔드API_인증권한코드개선_*.md`
- `06-BACKEND-GUIDE.md`
- `09-API-SPECIFICATION.md`
- `로그인방법.md`
- `회원가입방법.md`

---

### 05_frontend - 프론트엔드
**목적**: 프론트엔드 개발 가이드, UI/UX, 컴포넌트

**포함 내용**:
- 프론트엔드 개발 가이드
- 컴포넌트 설계
- UI 스타일 가이드
- 페이지 개발 예시
- 디자인 시스템

**예시 파일**:
- `07-FRONTEND-GUIDE.md`
- `COMPONENT-COMPOSITION-GUIDE.md`
- `CSS-STYLING-GUIDE.md`
- `FRONTEND_ARCHITECTURE_DECISION.md`
- `list-page-development-guide.md`
- `scrollbar-theme-guide.md`
- `stats-card-structure-guide.md`

---

### 06_deployment - 배포
**목적**: 프로덕션 배포 전략 및 운영 가이드

**포함 내용**:
- 배포 프로세스
- 배포 전 체크리스트
- 무중단 배포 전략
- 롤백 계획
- 모니터링 및 로깅

**예시 파일**:
- `README.md` (배포 프로세스 개요)

---

### 07_references - 참고 자료
**목적**: 빠른 참고용 명령어, 링크, 분석 결과

**포함 내용**:
- 빠른 명령어 모음
- 기술 스택 링크
- 포트 설정
- 명명 규칙 참고
- 분석 리포트
- 프롬프트 템플릿

**포함되는 파일 형식**:
- 기술 참고 (05-NAMING-CONVENTIONS.md)
- 설정 가이드 (PORT-CONFIGURATION.md, RUFF_SETUP_GUIDE.md)
- 분석 리포트 (API_ROUTING_REFACTORING.md, SWAGGER_ENTITY_GROUPING.md 등)
- TXT 파일 (ENTITY_GROUPING_SUMMARY.txt, ROUTING_SUMMARY.txt 등)

**예시 파일**:
- `05-NAMING-CONVENTIONS.md`
- `PORT-CONFIGURATION.md`
- `RUFF_SETUP_GUIDE.md`
- `ENTITY_GROUPING_SUMMARY.txt`
- `ROUTING_SUMMARY.txt`

---

### implementation - 구현 세부사항
**목적**: 특정 모듈의 구현 내용 및 완료 기록 보관

**하위 폴더**:
- `00_overview/` - 구현 현황 개요
- `01_backend_api/` - 백엔드 API 구현 (60+ 파일)
- `02_frontend/` - 프론트엔드 구현
  - `manager_web/` - 매니저 웹 구현
  - `tenants_web/` - 테넌트 웹 구현
- `03_database_schema/` - 데이터베이스 구현
- `04_system_integration/` - 시스템 통합

**포함 내용**:
- 완료된 구현 기록
- 모듈별 개선 사항
- DDL 변경 기록
- API 수정 및 개선 기록
- 버그 수정 기록

**파일명 규칙**:
```
{변경내용_한글}_{yyyymmddhhmmss}.md
예) 인증권한_아키텍처분석_20251027180000.md
```

---

## 📝 문서 작성 규칙

### 1. 파일명 규칙

#### 새로운 분석/가이드 문서
```
{주제}_{설명}.md
예) COLUMN_NAMING_ANALYSIS_REPORT.md
```

#### 구현 기록 문서 (implementation/)
```
{변경내용_한글}_{yyyymmddhhmmss}.md
예) 인증권한_아키텍처분석_20251027180000.md
    API_문서_개선_20251027173300.md
```

#### 분석/참고 파일 (TXT)
```
{주제}_{설명}.txt
예) QUICK_STATS.txt
    ENTITY_GROUPING_SUMMARY.txt
```

### 2. 문서 템플릿

#### 기능 구현/개선 문서
```markdown
# [기능명]

**날짜**: YYYY-MM-DD HH:MM:SS KST
**작성자**: [이름/시스템]
**유형**: [기능 구현 | 버그 수정 | 리팩토링 | 개선]
**컴포넌트**: [영향받은 컴포넌트]

## 개요
변경 사항의 간단한 설명

## 식별된 문제점
이 작업이 필요한 이유

## 변경 내용
상세한 설명

### 코드 예시
수정 전/후 비교

## 변경된 파일 목록
영향받은 모든 파일

## 테스트
테스트 방법

## 참고사항
추가 컨텍스트
```

#### 분석/리포트 문서
```markdown
# [분석 제목]

**작성 일시**: YYYY-MM-DD HH:MM:SS KST
**분석 대상**: [대상 설명]

## 개요
분석 목적 및 결론

## 분석 결과
상세 내용

## 권장사항
제안사항

## 참고자료
관련 문서
```

---

## ✅ 문서 추가 체크리스트

새로운 문서를 작성할 때 다음을 확인하세요:

### 문서 분류
- [ ] 7개 카테고리 중 어디에 속하는지 결정했는가?
- [ ] implementation/에 속해야 하는 구현 기록인가?

### 파일명
- [ ] 올바른 명명 규칙을 따랐는가?
- [ ] 파일명이 내용을 잘 표현하는가?
- [ ] 한글을 포함할 경우 UTF-8 인코딩인가?

### 파일 위치
- [ ] 해당 카테고리 폴더에 배치했는가?
- [ ] 불필요한 새 폴더를 만들지 않았는가?
- [ ] 기존 폴더 구조와 일치하는가?

### 문서 내용
- [ ] 명확한 제목이 있는가?
- [ ] 작성 일시와 작성자가 명시되어 있는가?
- [ ] 마크다운 형식이 올바른가?
- [ ] 관련 파일/코드 경로를 포함했는가?

### 연결/참고
- [ ] 관련 README.md를 업데이트했는가?
- [ ] 다른 문서로의 링크가 필요한가?
- [ ] README_MAIN.md 업데이트가 필요한가?

---

## 🚫 하지 말아야 할 것

❌ **절대 하지 말 것**:
1. 새로운 폴더를 임의로 만들기 (먼저 논의)
2. docs 루트에 문서 파일 추가하기 (카테고리에 분류)
3. 분석 스크립트 (.py, .json) docs에 저장하기
4. 오래된 문서를 삭제하지 않은 채로 새 파일 추가하기
5. 불필요한 백업 폴더 생성하기

---

## 🔄 유지보수 프로세스

### 월 1회 검토
1. docs 폴더 구조 확인
2. 오래된 분석 파일 정리 여부 확인
3. 필요한 업데이트 수행

### 문서 추가 시
1. 올바른 카테고리에 배치
2. 파일명 규칙 확인
3. 관련 README.md 업데이트
4. 필요시 README_MAIN.md 업데이트

### 문서 삭제/이동 시
1. 다른 문서에서의 참조 확인
2. 관련 링크 수정
3. git에서 제거

---

## 📞 예시 시나리오

### 시나리오 1: 새로운 API 분석 문서 작성
**상황**: API 라우팅 개선 사항 문서화

**저장 위치**: `docs/04_api/`
**파일명**: `API_라우팅_개선_20251027180000.md`
**업데이트**: `docs/04_api/README.md`에 링크 추가

### 시나리오 2: 데이터베이스 컬럼 분석 문서
**상황**: 컬럼명 표준화 분석 결과

**저장 위치**: `docs/03_database/`
**파일명**: `COLUMN_NAMING_ANALYSIS_REPORT.md` 또는 `.txt`
**업데이트**: `docs/03_database/README.md`에 링크 추가

### 시나리오 3: 백엔드 구현 기록
**상황**: 새로운 모듈 구현 완료

**저장 위치**: `docs/implementation/01_backend_api/`
**파일명**: `새모듈_구현완료_20251027180000.md`
**업데이트**: `docs/implementation/01_backend_api/`의 최상위 README 또는 목록

### 시나리오 4: 프론트엔드 개발 가이드
**상황**: 새로운 UI 컴포넌트 개발 패턴

**저장 위치**: `docs/05_frontend/`
**파일명**: `{컴포넌트명}_개발_가이드.md`
**업데이트**: `docs/05_frontend/README.md`에 링크 추가

---

## 🎯 목표

이 가이드라인을 따름으로써:

✅ **일관성**: 모든 팀원이 동일한 방식으로 문서 작성
✅ **찾기 쉬움**: 필요한 문서를 빠르게 찾을 수 있음
✅ **유지보수**: 문서 관리가 체계적이고 효율적
✅ **스케일**: 프로젝트 성장에 맞춰 확장 가능
✅ **명확성**: 각 문서의 목적과 위치가 명확함

---

## 📚 관련 문서

- **[README_MAIN.md](README_MAIN.md)** - 전체 문서 네비게이션
- **[FINAL_DOCS_CLEANUP_20251027.md](03_database/FINAL_DOCS_CLEANUP_20251027.md)** - 정리 기록
- **프로젝트 루트 [README.md](../README.md)** - 프로젝트 소개

---

**이 가이드라인은 정기적으로 검토되고 필요에 따라 업데이트됩니다.**

Happy Documentation! 📚✨
