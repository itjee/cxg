# 아키텍처 (Architecture)

ConexGrow 시스템의 전반적인 설계 및 아키텍처 문서입니다.

## 📚 주요 문서

### 1. **PROJECT_MANIFEST.md**
프로젝트의 전체 구성요소, 파일 구조, 주요 설정 정보

### 2. **FRONTEND_STRUCTURE.md**
프론트엔드(Next.js) 애플리케이션 구조 및 설계 방식

### 3. **IMPLEMENTATION_COMPLETE.md**
현재까지 완료된 구현 항목들의 상세 목록

### 4. **SESSION_COMPLETION_SUMMARY.md**
최근 세션에서 완료된 주요 작업 요약

## 🏗️ 시스템 구조

```
ConexGrow
├── Manager DB + Manager Web (운영자 시스템)
├── Tenant DB + Tenant Web (클라이언트 시스템)
└── Shared Components (공유 리소스)
```

## 🔄 주요 아키텍처 결정사항

### Multi-Tenant Architecture
- **Manager Database**: 테넌트 관리, 청구, 인프라
- **Tenant Database**: 클라이언트별 격리된 데이터

### 역할 및 권한 관리
- **Manager IDAM**: 플랫폼 레벨 인증/권한 관리
- **Tenant SYS**: 테넌트 레벨 사용자 관리

### 프론트엔드 구조
- **Manager Web**: Next.js 15 + Tailwind CSS + shadcn/ui
- **Tenant Web**: Next.js 15 + Tailwind CSS + shadcn/ui

## 📖 관련 문서

- [온보딩](../01_onboarding/)
- [데이터베이스 설계](../03_database/)
- [API 설계](../04_api/)
- [프론트엔드 가이드](../05_frontend/)
