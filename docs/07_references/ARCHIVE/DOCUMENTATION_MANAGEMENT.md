# 📚 문서 관리 시스템 정의서

**최종 수정**: 2025-10-27 18:45:00 KST

## 🎯 목표

ConexGrow 프로젝트의 모든 문서를 체계적으로 관리하고, 팀 모든 구성원이 일관된 방식으로 문서를 추가, 관리, 활용할 수 있도록 합니다.

---

## 📂 최종 문서 구조

```
docs/
├── README.md                           (네비게이션 가이드)
├── README_MAIN.md                      (메인 진입점) ⭐
├── DOCUMENTATION_GUIDELINES.md         (문서 작성 가이드라인) ⭐⭐⭐
│
├── 01_onboarding/                      (🚀 시작하기)
│   ├── README.md
│   ├── QUICK_START.md
│   ├── QUICK_REFERENCE.md
│   └── ... (기타 시작 가이드)
│
├── 02_architecture/                    (🏗️ 아키텍처)
│   ├── README.md
│   ├── PROJECT_MANIFEST.md
│   ├── FRONTEND_STRUCTURE.md
│   └── ... (기타 아키텍처 문서)
│
├── 03_database/                        (💾 데이터베이스)
│   ├── README.md
│   ├── DDL_INDEX.md
│   ├── MIGRATION_EXECUTION_GUIDE.md
│   ├── *.txt (분석 파일)
│   ├── FINAL_DOCS_CLEANUP_20251027.md
│   └── database_schemas/               (스키마 구조)
│
├── 04_api/                             (🔌 API 및 인증권한)
│   ├── README.md
│   ├── 인증권한_아키텍처분석_*.md
│   ├── 인증권한_DDL개선_*.md
│   ├── 백엔드API_인증권한코드개선_*.md
│   └── backend_analysis/               (분석 자료)
│
├── 05_frontend/                        (🎨 프론트엔드)
│   ├── README.md
│   ├── 07-FRONTEND-GUIDE.md
│   ├── COMPONENT-COMPOSITION-GUIDE.md
│   └── ... (기타 프론트엔드 문서)
│
├── 06_deployment/                      (🚀 배포)
│   └── README.md
│
├── 07_references/                      (📚 참고 자료)
│   ├── README.md
│   ├── 05-NAMING-CONVENTIONS.md
│   ├── *.txt (분석 및 참고)
│   └── ... (기타 참고 자료)
│
└── implementation/                     (📖 구현 세부사항)
    ├── 00_overview/
    ├── 01_backend_api/                (60+ 구현 문서)
    ├── 02_frontend/
    │   ├── manager_web/
    │   └── tenants_web/
    ├── 03_database_schema/
    └── 04_system_integration/
```

---

## 🚀 핵심 규칙

### ✅ 해야 할 것

1. **새로운 문서 작성 전**
   - 먼저 [DOCUMENTATION_GUIDELINES.md](docs/DOCUMENTATION_GUIDELINES.md)를 읽기
   - 어느 카테고리에 속하는지 결정하기
   - 올바른 파일명 규칙 따르기

2. **문서 분류**
   - 7개 카테고리 중 하나에 속하는지 확인
   - implementation/ 폴더는 구현 기록만 저장
   - database_schemas/, backend_analysis/ 등 하위 폴더 활용

3. **파일명 규칙**
   - 구현 기록: `{변경내용_한글}_{yyyymmddhhmmss}.md`
   - 가이드/분석: `{주제}_{설명}.md`
   - 분석 결과: `{주제}.txt`

4. **문서 관리**
   - 파일 추가 후 관련 README.md 업데이트
   - 필요시 README_MAIN.md 업데이트
   - Git과 함께 커밋

### ❌ 하지 말아야 할 것

1. **새로운 폴더 임의 생성**
   - 기존 7개 카테고리 + implementation에만 저장
   - 새 폴더 필요시 먼저 논의

2. **docs 루트에 파일 저장**
   - README.md, README_MAIN.md, DOCUMENTATION_GUIDELINES.md만 루트에 위치
   - 다른 모든 파일은 카테고리 폴더에

3. **불필요한 폴더/파일 생성**
   - 백업, 임시 폴더 생성 금지
   - 분석 스크립트는 docs에 저장하지 말기

4. **과거 문서 삭제 없이 새로 추가**
   - 정기적인 문서 정리 필요
   - 월 1회 이상 불필요한 문서 검토

---

## 📋 체크리스트

새로운 문서를 추가할 때마다 확인하세요:

- [ ] DOCUMENTATION_GUIDELINES.md 읽음
- [ ] 올바른 카테고리 선택
- [ ] 파일명이 규칙을 따름
- [ ] 올바른 폴더에 저장
- [ ] 관련 README.md 업데이트
- [ ] 마크다운 형식 검증
- [ ] 필요시 README_MAIN.md 업데이트
- [ ] Git에서 커밋 확인

---

## 🎯 각 카테고리 담당자

| 카테고리 | 주 담당 | 설명 |
|---------|--------|------|
| 01_onboarding | 모두 | 신입 온보딩 가이드 |
| 02_architecture | 설계팀 | 시스템 설계 및 아키텍처 |
| 03_database | DB팀 | 데이터베이스 및 DDL |
| 04_api | 백엔드팀 | API 및 인증/권한 |
| 05_frontend | 프론트팀 | 프론트엔드 개발 |
| 06_deployment | DevOps | 배포 및 운영 |
| 07_references | 모두 | 공통 참고 자료 |
| implementation | 해당 개발자 | 구현 기록 |

---

## 📊 정리 기록

### 2025-10-27: 최종 문서 정리 완료

**작업 내용**:
- TXT 파일 4개 → 카테고리로 이동
- 비정렬 폴더 9개 → 통합 또는 삭제
- guides 폴더 20개 파일 → 해당 카테고리 분류
- 분산된 폴더들 (auth, database, backend-api 등) → 통합
- 분석 스크립트 (.py, .json) → 삭제

**최종 결과**:
- 247개 MD 파일
- 9개 TXT 파일
- 16개 폴더 (최적화됨)
- 7개 카테고리 + implementation

**상세 기록**: [FINAL_DOCS_CLEANUP_20251027.md](docs/03_database/FINAL_DOCS_CLEANUP_20251027.md)

---

## 🔄 유지보수 일정

### 주 단위
- [ ] 새로운 문서 추가 확인
- [ ] 링크 정상 작동 확인

### 월 단위
- [ ] 문서 구조 검토
- [ ] 오래된 분석 문서 정리
- [ ] README 파일 업데이트 필요 여부 확인

### 분기 단위
- [ ] 전체 문서 기록 검토
- [ ] implementation 폴더 정리
- [ ] 정책 업데이트 필요 여부 검토

---

## 📞 문의 및 개선사항

문서 관리 정책에 대한 문의나 개선사항:

1. 간단한 질문: 팀 슬랙 채널
2. 정책 변경 제안: GitHub Issue
3. 가이드라인 개선: Pull Request

---

## 🎉 완료

이 체계로 모든 문서를 관리합니다!

**관련 문서**:
- [📚 DOCUMENTATION_GUIDELINES.md](docs/DOCUMENTATION_GUIDELINES.md) - 상세 가이드라인
- [📖 README_MAIN.md](docs/README_MAIN.md) - 문서 네비게이션
- [📄 FINAL_DOCS_CLEANUP_20251027.md](docs/03_database/FINAL_DOCS_CLEANUP_20251027.md) - 정리 기록

Happy Documentation! 📚✨
