# Schema Structure Addition - Manager Web

**작업일시**: 2025-10-17 16:39:40
**작업자**: Claude Code
**작업 유형**: 폴더 구조 재구성 및 메뉴 확장

## 작업 개요

데이터베이스 스키마와 일치하도록 Next.js 애플리케이션의 폴더 구조를 재구성하고, 누락된 7개의 스키마에 대한 메뉴 및 페이지를 추가했습니다.

## 작업 내용

### 1. 누락된 스키마 분석

데이터베이스 스키마와 현재 메뉴 구조를 비교하여 다음 7개의 누락된 스키마를 발견:

| 스키마 코드 | 전체 명칭 | 설명 |
|-----------|---------|------|
| `noti` | Notifications | 알림 관리 시스템 |
| `supt` | Support | 고객 지원 관리 |
| `intg` | Integrations | 외부 연동 관리 |
| `cnfg` | Configuration | 시스템 구성 관리 |
| `stat` | Statistics/Analytics | 통계 및 분석 |
| `auto` | Automation | 자동화 워크플로우 |
| `bkup` | Backup | 백업 및 복구 |

### 2. 폴더 구조 생성

#### 2.1 app/(main) 폴더 구조

새로운 라우트를 위한 페이지 폴더 생성:

```
app/(main)/
├── noti/
│   ├── notifications/page.tsx
│   └── campaigns/page.tsx
├── supt/
│   ├── tickets/page.tsx
│   └── knowledge/page.tsx
├── intg/
│   ├── apis/page.tsx
│   └── webhooks/page.tsx
├── cnfg/
│   ├── system/page.tsx
│   └── features/page.tsx
├── stat/
│   ├── analytics/page.tsx
│   └── reports/page.tsx
├── auto/
│   ├── workflows/page.tsx
│   └── schedules/page.tsx
└── bkup/
    ├── backups/page.tsx
    └── recovery/page.tsx
```

#### 2.2 features 폴더 구조

각 스키마별 기능 폴더 및 표준 하위 폴더 생성:

```
features/
├── noti/
│   ├── notification/
│   │   ├── components/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── services/
│   └── campaign/
│       ├── components/
│       ├── types/
│       ├── hooks/
│       └── services/
├── supt/
│   ├── ticket/
│   │   ├── components/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── services/
│   └── knowledge/
│       ├── components/
│       ├── types/
│       ├── hooks/
│       └── services/
├── intg/
│   ├── api/
│   │   ├── components/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── services/
│   └── webhook/
│       ├── components/
│       ├── types/
│       ├── hooks/
│       └── services/
├── cnfg/
│   ├── system/
│   │   ├── components/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── services/
│   └── feature/
│       ├── components/
│       ├── types/
│       ├── hooks/
│       └── services/
├── stat/
│   ├── analytics/
│   │   ├── components/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── services/
│   └── report/
│       ├── components/
│       ├── types/
│       ├── hooks/
│       └── services/
├── auto/
│   ├── workflow/
│   │   ├── components/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── services/
│   └── schedule/
│       ├── components/
│       ├── types/
│       ├── hooks/
│       └── services/
└── bkup/
    ├── backup/
    │   ├── components/
    │   ├── types/
    │   ├── hooks/
    │   └── services/
    └── recovery/
        ├── components/
        ├── types/
        ├── hooks/
        └── services/
```

### 3. Placeholder 페이지 생성

모든 새로운 라우트에 대해 `ListPageLayout`을 사용한 placeholder 페이지 생성:

#### 페이지 템플릿 구조

```typescript
"use client";

import { ListPageLayout } from "@/components/layout/list-page-layout";
import { [Icon] } from "lucide-react";

export default function [PageName]Page() {
  return (
    <ListPageLayout
      title="[페이지 제목]"
      description="[페이지 설명]"
      stats={[
        { title: "[통계 제목]", value: "0", icon: <[Icon] className="h-4 w-4" /> },
      ]}
    >
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">[기능명] 기능이 곧 추가됩니다.</p>
      </div>
    </ListPageLayout>
  );
}
```

#### 생성된 페이지 목록

1. **알림 (noti)**
   - `/noti/notifications` - 알림 관리
   - `/noti/campaigns` - 캠페인

2. **고객 지원 (supt)**
   - `/supt/tickets` - 지원 티켓
   - `/supt/knowledge` - 지식 베이스

3. **외부 연동 (intg)**
   - `/intg/apis` - API 연동
   - `/intg/webhooks` - 웹훅

4. **시스템 구성 (cnfg)**
   - `/cnfg/system` - 시스템 설정
   - `/cnfg/features` - 기능 토글

5. **분석 (stat)**
   - `/stat/analytics` - 분석 대시보드
   - `/stat/reports` - 통계 보고서

6. **자동화 (auto)**
   - `/auto/workflows` - 워크플로우
   - `/auto/schedules` - 스케줄

7. **백업 (bkup)**
   - `/bkup/backups` - 백업 관리
   - `/bkup/recovery` - 복구 관리

### 4. 사이드바 네비게이션 업데이트

#### 4.1 새로운 아이콘 임포트

```typescript
import {
  // ... 기존 아이콘
  Bell,          // 알림
  Headphones,    // 고객 지원
  Plug,          // 외부 연동
  Sliders,       // 시스템 구성
  BarChart3,     // 분석
  Zap,           // 자동화
  Database,      // 백업
} from "lucide-react";
```

#### 4.2 새로운 메뉴 그룹 추가

`navGroups` 배열에 7개의 새로운 그룹 추가:

```typescript
const navGroups: NavGroup[] = [
  // ... 기존 그룹들
  {
    id: "notifications",
    label: "알림",
    icon: <Bell className="h-4 w-4" />,
    items: [
      {
        id: "notifications-list",
        label: "알림 관리",
        href: "/noti/notifications",
        icon: <Bell className="h-5 w-5" />,
      },
      {
        id: "campaigns",
        label: "캠페인",
        href: "/noti/campaigns",
        icon: <Bell className="h-5 w-5" />,
      },
    ],
  },
  // ... 나머지 6개 그룹
];
```

#### 4.3 expandedGroups 상태 업데이트

새로운 메뉴 그룹에 대한 확장/축소 상태 관리 추가:

```typescript
const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
  const activeGroupId = getActiveGroupId();
  return {
    // ... 기존 그룹들
    "notifications": activeGroupId === "notifications",
    "support": activeGroupId === "support",
    "integrations": activeGroupId === "integrations",
    "configuration": activeGroupId === "configuration",
    "analytics": activeGroupId === "analytics",
    "automation": activeGroupId === "automation",
    "backup": activeGroupId === "backup",
  };
});
```

### 5. 타입 오류 수정

#### 5.1 StatCardData 인터페이스 불일치 수정

**문제**: placeholder 페이지 생성 시 `label` 속성 사용

**원인**: `ListPageLayout`의 `StatCardData` 인터페이스는 `title` 속성 사용

**해결**:
```typescript
// 잘못된 코드
{ label: "전체 알림", value: "0", icon: <Bell className="h-4 w-4" /> }

// 수정된 코드
{ title: "전체 알림", value: "0", icon: <Bell className="h-4 w-4" /> }
```

모든 14개의 placeholder 페이지에서 `label`을 `title`로 수정하고, 불필요한 `icon` 및 `breadcrumbs` props 제거

## 빌드 결과

### 빌드 성공

```bash
✓ Compiled successfully in 2.4s
✓ Generating static pages (40/40)
✓ Finalizing page optimization
```

### 생성된 라우트 (총 40개)

```
Route (app)                         Size  First Load JS
┌ ○ /                                0 B         124 kB
├ ○ /audt/logs                   2.32 kB         190 kB
├ ○ /audt/reports                2.67 kB         190 kB
├ ○ /auto/schedules              1.25 kB         180 kB
├ ○ /auto/workflows              1.26 kB         180 kB
├ ○ /bill/invoices               3.57 kB         207 kB
├ ○ /bill/payments               3.16 kB         206 kB
├ ○ /bkup/backups                1.25 kB         180 kB
├ ○ /bkup/recovery               1.25 kB         180 kB
├ ○ /cnfg/features               1.25 kB         180 kB
├ ○ /cnfg/system                 1.25 kB         180 kB
├ ○ /core/dashboard                  0 B         179 kB
├ ○ /core/help                    2.4 kB         182 kB
├ ○ /core/profile                4.33 kB         192 kB
├ ○ /core/settings               3.58 kB         191 kB
├ ○ /idam/access-logs            3.36 kB         206 kB
├ ○ /idam/permissions            8.37 kB         212 kB
├ ○ /idam/roles                  3.32 kB         206 kB
├ ○ /idam/users                  7.87 kB         211 kB
├ ○ /ifra/resources              2.22 kB         190 kB
├ ○ /ifra/servers                2.32 kB         190 kB
├ ○ /intg/apis                   1.25 kB         180 kB
├ ○ /intg/webhooks               1.23 kB         180 kB
├ ○ /logout                      1.03 kB         139 kB
├ ○ /mntr/alerts                 2.27 kB         190 kB
├ ○ /mntr/status                 1.85 kB         181 kB
├ ○ /noti/campaigns              1.25 kB         180 kB
├ ○ /noti/notifications          1.25 kB         180 kB
├ ○ /signin                      8.07 kB         146 kB
├ ○ /signup                      37.8 kB         176 kB
├ ○ /stat/analytics              1.25 kB         180 kB
├ ○ /stat/reports                1.24 kB         180 kB
├ ○ /supt/knowledge              1.25 kB         180 kB
├ ○ /supt/tickets                1.25 kB         180 kB
├ ○ /tnnt/subscription           2.72 kB         206 kB
└ ○ /tnnt/tenant                 7.78 kB         211 kB
```

## 스키마별 메뉴 구조 (최종)

### 현재 구현된 전체 스키마 (14개)

1. **core** - 핵심 기능
   - Dashboard, Profile, Settings, Help

2. **tnnt** - 테넌트 관리
   - Tenant, Subscription

3. **bill** - 빌링
   - Invoices, Payments

4. **idam** - 신원/접근 관리
   - Users, Roles, Permissions, Access Logs

5. **audt** - 감사
   - Logs, Reports

6. **ifra** - 인프라
   - Servers, Resources

7. **mntr** - 모니터링
   - Status, Alerts

8. **noti** - 알림 (신규)
   - Notifications, Campaigns

9. **supt** - 고객 지원 (신규)
   - Tickets, Knowledge Base

10. **intg** - 외부 연동 (신규)
    - APIs, Webhooks

11. **cnfg** - 시스템 구성 (신규)
    - System, Features

12. **stat** - 통계/분석 (신규)
    - Analytics, Reports

13. **auto** - 자동화 (신규)
    - Workflows, Schedules

14. **bkup** - 백업 (신규)
    - Backups, Recovery

## 파일 변경 이력

### 수정된 파일

1. **src/components/layout/sidebar.tsx**
   - 7개의 새로운 아이콘 임포트 추가
   - 7개의 새로운 메뉴 그룹 추가
   - expandedGroups 상태에 새로운 그룹 ID 추가

### 생성된 파일

#### 페이지 파일 (14개)

1. `src/app/(main)/noti/notifications/page.tsx`
2. `src/app/(main)/noti/campaigns/page.tsx`
3. `src/app/(main)/supt/tickets/page.tsx`
4. `src/app/(main)/supt/knowledge/page.tsx`
5. `src/app/(main)/intg/apis/page.tsx`
6. `src/app/(main)/intg/webhooks/page.tsx`
7. `src/app/(main)/cnfg/system/page.tsx`
8. `src/app/(main)/cnfg/features/page.tsx`
9. `src/app/(main)/stat/analytics/page.tsx`
10. `src/app/(main)/stat/reports/page.tsx`
11. `src/app/(main)/auto/workflows/page.tsx`
12. `src/app/(main)/auto/schedules/page.tsx`
13. `src/app/(main)/bkup/backups/page.tsx`
14. `src/app/(main)/bkup/recovery/page.tsx`

#### 기능 폴더 구조 (56개 폴더)

각 스키마별 features 폴더에 components, types, hooks, services 폴더 생성:
- `features/noti/notification/` (4개 하위 폴더)
- `features/noti/campaign/` (4개 하위 폴더)
- `features/supt/ticket/` (4개 하위 폴더)
- `features/supt/knowledge/` (4개 하위 폴더)
- `features/intg/api/` (4개 하위 폴더)
- `features/intg/webhook/` (4개 하위 폴더)
- `features/cnfg/system/` (4개 하위 폴더)
- `features/cnfg/feature/` (4개 하위 폴더)
- `features/stat/analytics/` (4개 하위 폴더)
- `features/stat/report/` (4개 하위 폴더)
- `features/auto/workflow/` (4개 하위 폴더)
- `features/auto/schedule/` (4개 하위 폴더)
- `features/bkup/backup/` (4개 하위 폴더)
- `features/bkup/recovery/` (4개 하위 폴더)

## 기술적 세부사항

### 사용된 기술 스택

- **Next.js 15.5.5** with Turbopack
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **lucide-react** icons

### 코딩 패턴 및 규칙

1. **페이지 구조**
   - 모든 페이지는 "use client" 지시문 사용
   - ListPageLayout 컴포넌트로 일관된 레이아웃 유지
   - 통계 카드(stats)는 StatCardData 인터페이스 준수

2. **폴더 구조**
   - 스키마별 4글자 약어 사용 (noti, supt, intg, cnfg, stat, auto, bkup)
   - features 폴더는 표준 하위 구조 유지 (components, types, hooks, services)
   - app 폴더는 라우트 기반 구조

3. **네이밍 컨벤션**
   - 페이지 컴포넌트: `[PageName]Page` (예: NotificationsPage)
   - 파일명: kebab-case (예: notifications/page.tsx)
   - 폴더명: kebab-case (예: access-logs)

## 다음 단계

### 우선순위 높음
1. **알림 시스템 (noti)** 구현
   - 알림 테이블 컴포넌트 작성
   - 알림 전송 기능 구현
   - 캠페인 관리 기능 구현

2. **고객 지원 (supt)** 구현
   - 티켓 관리 시스템
   - 지식 베이스 에디터

### 우선순위 중간
3. **분석 (stat)** 구현
   - 차트 라이브러리 통합
   - 통계 대시보드 개발
   - 보고서 생성 기능

4. **외부 연동 (intg)** 구현
   - API 키 관리
   - 웹훅 설정 UI

### 우선순위 낮음
5. **자동화 (auto)** 구현
   - 워크플로우 빌더
   - 스케줄러 UI

6. **백업 (bkup)** 구현
   - 백업 관리 인터페이스
   - 복구 프로세스 UI

## 참고 사항

### 데이터베이스 스키마 위치
- `/packages/database/schemas/manager/noti.sql`
- `/packages/database/schemas/manager/supt.sql`
- `/packages/database/schemas/manager/intg.sql`
- `/packages/database/schemas/manager/cnfg.sql`
- `/packages/database/schemas/manager/stat.sql`
- `/packages/database/schemas/manager/auto.sql`
- `/packages/database/schemas/manager/bkup.sql`

### 프로젝트 문서
- `/home/itjee/workspace/cxg/CLAUDE.md` - 프로젝트 개요 및 가이드라인

## 작업 완료 체크리스트

- [x] 누락된 스키마 분석
- [x] app/(main) 폴더 구조 생성
- [x] features 폴더 구조 생성
- [x] placeholder 페이지 생성
- [x] 사이드바 네비게이션 업데이트
- [x] 타입 오류 수정
- [x] 빌드 테스트 및 검증
- [x] 문서 작성

## 결론

데이터베이스 스키마와 완전히 일치하는 애플리케이션 구조를 구축했습니다. 모든 14개 스키마가 이제 메뉴에 표시되며, 각 기능에 대한 기본 페이지와 폴더 구조가 준비되어 향후 기능 구현을 위한 탄탄한 기반을 마련했습니다.
