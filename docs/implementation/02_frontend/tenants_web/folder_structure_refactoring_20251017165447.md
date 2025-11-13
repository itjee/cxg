# tenants-web 폴더 구조 개편 - 20251017165447

## 작업 개요
tenants-web의 앱 라우팅 구조를 스키마 기반 업무모듈 중심으로 재구성했습니다.

## 변경 사항

### 1. 폴더 구조 변경
- `(app)` → `(main)` 폴더명 변경
- `dashboard` → `overview` 폴더명 변경

### 2. 업무모듈 폴더 생성
스키마 기반 업무모듈 폴더를 `(main)` 하위에 생성:

| 폴더명 | 업무모듈 | 설명 |
|--------|----------|------|
| adm | 사용자관리 | Administration/User Management |
| asm | 자산관리 | Asset Management |
| bim | BI분석 | BI/Analytics |
| com | 커뮤니케이션 | Communication/Messaging |
| csm | 고객관리 | Customer/CRM |
| fim | 재무관리 | Finance/Accounting |
| ivm | 재고관리 | Inventory Management |
| lwm | 워크플로우 | Workflow/Approval |
| psm | 구매관리 | Procurement/Purchasing |
| srm | 영업관리 | Sales/Revenue |
| sys | 시스템설정 | System Configuration |

### 3. 라우팅 구조
```
apps/tenants-web/src/app/
├── (marketing)/        # 홍보용 홈페이지
│   └── page.tsx
├── (auth)/            # 인증 페이지
│   ├── signin/
│   └── signup/
└── (main)/            # 업무 시스템
    ├── overview/      # 대시보드
    ├── adm/          # 사용자관리
    ├── asm/          # 자산관리
    ├── bim/          # BI분석
    ├── com/          # 커뮤니케이션
    ├── csm/          # 고객관리
    ├── fim/          # 재무관리
    ├── ivm/          # 재고관리
    ├── lwm/          # 워크플로우
    ├── psm/          # 구매관리
    ├── srm/          # 영업관리
    └── sys/          # 시스템설정
```

### 4. 네비게이션 업데이트
`(main)/layout.tsx`의 네비게이션 메뉴를 업무모듈 기준으로 재구성:
- 대시보드 → `/overview`
- 각 업무모듈 → `/{스키마명}` (예: `/adm`, `/fim`, `/csm` 등)

### 5. 각 업무모듈 페이지 생성
모든 업무모듈 폴더에 기본 `page.tsx` 파일 생성:
- Metadata 설정 (SEO)
- 기본 레이아웃 및 제목
- 향후 확장 가능한 구조

## 설계 원칙

### 1. 스키마 기반 구조
- 백엔드 데이터베이스 스키마(`packages/database/schemas/tenants/`)와 일치
- 프론트엔드와 백엔드 간 일관성 유지
- 모듈별 독립적 개발 및 확장 가능

### 2. 명확한 폴더명
- `(app)` → `(main)`: 업무 시스템임을 명확히 표현
- `dashboard` → `overview`: 전체 현황을 보는 페이지임을 명시

### 3. 확장성
- 각 업무모듈 폴더 하위에 엔티티별 폴더 추가 가능
  - 예: `/csm/customers`, `/csm/contacts`, `/csm/opportunities`
- 모듈별 레이아웃 및 서브 네비게이션 추가 가능

## 향후 작업

### 1. 각 업무모듈 상세 페이지 개발
- 엔티티별 CRUD 페이지
- 리스트, 상세, 생성, 수정 페이지
- 모듈별 대시보드

### 2. 공통 컴포넌트 개발
- 데이터 테이블
- 폼 컴포넌트
- 차트 및 그래프
- 필터 및 검색

### 3. API 연동
- 백엔드 API와 통신
- TanStack Query를 이용한 데이터 fetching
- Zustand를 이용한 전역 상태 관리

### 4. 권한 관리
- 모듈별 접근 권한 설정
- 역할 기반 메뉴 표시
- 페이지 레벨 권한 검증

## 참고사항

### 백엔드 스키마 매핑
프론트엔드 라우팅은 백엔드 스키마 구조와 동일하게 유지:
- Backend: `apps/backend-api/src/api/models/tenant/{스키마명}/`
- Frontend: `apps/tenants-web/src/app/(main)/{스키마명}/`

### 일관성 유지
- 폴더명: 소문자, 약어 사용 (adm, fim, csm)
- 파일명: kebab-case (customer-list.tsx)
- 컴포넌트명: PascalCase (CustomerList)
