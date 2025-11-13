# ConexGrow 문서 가이드

ConexGrow 프로젝트의 모든 문서는 다음과 같이 체계적으로 구조화되어 있습니다.

## 📂 문서 구조

### 🚀 [01_onboarding](01_onboarding/) - 시작하기
**새로운 개발자를 위한 빠른 시작 가이드**

- **QUICK_START.md** ⭐ - 개발 환경 설정 및 기본 명령어
- **QUICK_REFERENCE.md** - 자주 사용되는 명령어 모음
- **CLAUDE_CODE_GUIDE.md** - Claude Code CLI 설정 가이드
- **PROJECT_README.md** - 프로젝트 기본 소개
- **IMPLEMENTATION_OVERVIEW.md** - 현재 구현 상태

👉 **새로운 팀원이라면 여기서 시작하세요!**

---

### 🏗️ [02_architecture](02_architecture/) - 아키텍처 이해
**시스템 설계 및 아키텍처 문서**

- **PROJECT_MANIFEST.md** - 프로젝트 전체 구성도
- **FRONTEND_STRUCTURE.md** - 프론트엔드 설계
- **IMPLEMENTATION_COMPLETE.md** - 완료된 기능 목록
- **SESSION_COMPLETION_SUMMARY.md** - 최근 세션 요약

👉 **시스템 전체 그림을 이해하고 싶다면 여기를 보세요**

---

### 💾 [03_database](03_database/) - 데이터베이스
**DDL, 스키마, 마이그레이션 가이드**

#### DDL 및 설계
- **DDL_INDEX.md** - 모든 DDL 파일 인덱스
- **DDL_SUMMARY.md** - DDL 개선사항 요약
- **DDL_FINAL_REPORT.md** - 최종 분석 보고서

#### 표준화 및 마이그레이션
- **DDL_애플리케이션코드_마이그레이션_20251027.md** - 코드 마이그레이션 가이드
- **컬럼명표준화_추가변경_20251027.md** - 컬럼명 표준화 사항
- **COLUMN_REFERENCES_AUDIT.md** - 컬럼 감시 보고서
- **MIGRATION_EXECUTION_GUIDE.md** - 마이그레이션 실행 가이드

👉 **데이터베이스 구조를 알고 싶거나 마이그레이션해야 한다면 여기를 보세요**

---

### 🔌 [04_api](04_api/) - API 및 인증권한
**FastAPI 백엔드, 인증/권한 관리, API 설계**

#### 인증권한 관리 (최신 개선사항)
- **인증권한_아키텍처분석_20251027.md** ⭐ - 역할 기반 접근 제어(RBAC) 아키텍처
- **인증권한_DDL개선_20251027.md** - DDL 레벨 개선사항
- **백엔드API_인증권한코드개선_20251027.md** ⭐ - ORM 모델 & Pydantic 스키마 개선

👉 **인증/권한 시스템을 이해하거나 구현하고 싶다면 여기를 보세요**

---

### 🎨 [05_frontend](05_frontend/) - 프론트엔드
**Next.js 애플리케이션, UI 컴포넌트, 상태 관리**

- **README.md** - 프론트엔드 전체 가이드
- Manager Web 및 Tenant Web 개발 가이드
- 컴포넌트 라이브러리 및 디자인 시스템
- 상태 관리 및 API 통신 패턴

👉 **프론트엔드를 개발하거나 구조를 이해하고 싶다면 여기를 보세요**

---

### 🚀 [06_deployment](06_deployment/) - 배포
**배포 전략, 체크리스트, 운영 가이드**

- **README.md** - 배포 프로세스 및 전략
- 배포 전 체크리스트
- 무중단 배포 (Blue-Green)
- 롤백 계획 및 모니터링

👉 **프로덕션 배포를 준비하거나 운영하는 경우 여기를 보세요**

---

### 📚 [07_references](07_references/) - 참고 자료
**빠른 참고용 명령어, 링크, 설정**

- **README.md** - 빠른 명령어 및 링크 모음
- 기술 스택 링크
- 환경 변수 설정
- 자주 하는 실수 및 해결책

👉 **명령어를 잊어버렸거나 빠른 참고가 필요하다면 여기를 보세요**

---

### 📖 [implementation](implementation/) - 구현 세부사항
**각 부분별 상세한 구현 문서 및 변경 기록**

```
implementation/
├── 00_overview/          # 개요 및 진행 현황
├── 01_backend_api/       # 백엔드 API 구현 세부사항
├── 02_frontend/
│   ├── manager_web/      # Manager Web 구현
│   └── tenants_web/      # Tenant Web 구현
├── 03_database_schema/   # 데이터베이스 스키마 구현
└── 04_system_integration/# 시스템 통합 및 공유 리소스
```

👉 **특정 모듈의 구현 내용을 자세히 알고 싶다면 여기를 보세요**

---

## 🎯 문서 활용 가이드

### 상황별 문서 선택

| 상황 | 추천 문서 |
|---|---|
| 👤 새로운 개발자 | [01_onboarding/QUICK_START.md](01_onboarding/QUICK_START.md) |
| 🏗️ 전체 구조 이해 | [02_architecture/PROJECT_MANIFEST.md](02_architecture/PROJECT_MANIFEST.md) |
| 🔑 명령어 찾기 | [07_references/README.md](07_references/README.md) |
| 💾 데이터베이스 설정 | [03_database/README.md](03_database/README.md) |
| 🔌 API 개발 | [04_api/README.md](04_api/README.md) |
| 🎨 프론트엔드 개발 | [05_frontend/README.md](05_frontend/README.md) |
| 🚀 배포 준비 | [06_deployment/README.md](06_deployment/README.md) |
| 🔐 인증권한 구현 | [04_api/인증권한_*.md](04_api/) |

---

## 📖 핵심 문서 TOP 5

1. **[QUICK_START.md](01_onboarding/QUICK_START.md)** - 개발 환경 설정 (5분)
2. **[PROJECT_MANIFEST.md](02_architecture/PROJECT_MANIFEST.md)** - 프로젝트 구조 이해 (10분)
3. **[인증권한_아키텍처분석](04_api/인증권한_아키텍처분석_20251027.md)** - RBAC 아키텍처 이해 (15분)
4. **[MIGRATION_EXECUTION_GUIDE.md](03_database/MIGRATION_EXECUTION_GUIDE.md)** - 마이그레이션 방법 (10분)
5. **[06_deployment/README.md](06_deployment/README.md)** - 배포 프로세스 (20분)

---

## 🔍 문서 검색

### 주요 주제별 문서

**인증 및 권한**
- [인증권한 아키텍처분석](04_api/인증권한_아키텍처분석_20251027.md)
- [인증권한 DDL개선](04_api/인증권한_DDL개선_20251027.md)
- [백엔드API 인증권한 코드개선](04_api/백엔드API_인증권한코드개선_20251027.md)

**데이터베이스**
- [DDL INDEX](03_database/DDL_INDEX.md)
- [마이그레이션 가이드](03_database/MIGRATION_EXECUTION_GUIDE.md)
- [컬럼명 표준화](03_database/컬럼명표준화_추가변경_20251027.md)

**프로젝트 개요**
- [PROJECT_MANIFEST](02_architecture/PROJECT_MANIFEST.md)
- [QUICK_START](01_onboarding/QUICK_START.md)
- [IMPLEMENTATION_OVERVIEW](01_onboarding/IMPLEMENTATION_OVERVIEW.md)

---

## 🚀 빠른 시작

```bash
# 1단계: 환경 설정 가이드 읽기
cat docs/01_onboarding/QUICK_START.md

# 2단계: 프로젝트 구조 이해
cat docs/02_architecture/PROJECT_MANIFEST.md

# 3단계: 명령어 확인
cat docs/07_references/README.md

# 4단계: 개발 시작!
cd apps/backend-api
pnpm dev
```

---

## 📝 문서 작성 규칙

모든 새로운 문서는 다음 규칙을 따릅니다:

### 파일명 형식
```
{기능명}_{설명}_{yyyymmddhhmmss}.md
예) 인증권한_아키텍처분석_20251027170500.md
```

### 문서 구조
```markdown
# 제목

**날짜**: YYYY-MM-DD HH:MM:SS KST
**작성자**: [이름/시스템]
**유형**: [기능 구현 | 버그 수정 | 리팩토링]

## 개요
...

## 1. 섹션
...
```

---

## 🔗 유용한 링크

### 기술 문서
- [FastAPI 문서](https://fastapi.tiangolo.com/)
- [Next.js 문서](https://nextjs.org/docs)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/)

### 프로젝트 링크
- [GitHub Repository](#)
- [Issue Tracker](#)
- [CI/CD Pipeline](#)
- [API Documentation](http://localhost:8100/docs)

---

## 💡 팁

- **브라우저 검색**: Ctrl+F (Cmd+F on Mac) 로 문서 내 검색
- **VsCode**: Markdown Preview 확장 프로그램으로 보기 좋게 읽기
- **Git**: 문서 변경시 함께 커밋하기
- **버전 관리**: 주요 문서 변경시 타임스탐프 포함하기

---

## 📋 문서 추가/관리 방법

모든 새로운 문서는 다음 가이드라인을 따릅니다:

👉 **[📚 문서 관리 가이드라인](DOCUMENTATION_GUIDELINES.md)** ⭐

이 가이드에서는 다음을 설명합니다:
- 7개 카테고리에 문서를 분류하는 방법
- 파일명 명명 규칙
- 올바른 저장 위치
- 문서 작성 템플릿
- 유지보수 프로세스

**새로운 문서를 작성하기 전에 반드시 읽어주세요!**

---

## 📞 문제 해결

문서에 오류가 있거나 추가 설명이 필요한 경우:

1. **간단한 오류**: 직접 수정 후 커밋
2. **추가 정보 필요**: GitHub Issue 생성
3. **질문**: 팀 슬랙 채널에서 논의

---

**최종 수정**: 2025-10-27 18:45:00 KST

Happy Coding! 🎉
