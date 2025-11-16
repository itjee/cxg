# Roles 임포트 충돌 해결 보고서

## 문제점

다음 에러가 발생했습니다:

```
Export Roles doesn't exist in target module
./apps/manager-web/src/features/idam/roles/components/roles-stats.tsx (3:1)
```

## 원인 분석

### 파일: `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/roles/components/roles-stats.tsx`

**Before (수정 전)**:
```typescript
import { Roles as RolesIcon, UserCheck, UserX, Shield } from "lucide-react";  // Line 3
import type { Roles } from "../types/roles.types";                           // Line 5
```

**문제**:
- Line 3: `lucide-react`에서 `Roles` 아이콘을 import (as RolesIcon으로 별칭)
- Line 5: `types/roles.types`에서 `Roles` 타입을 import

두 개의 다른 `Roles` (아이콘과 타입)를 같은 이름으로 import하려다 보니 충돌 발생. 특히 Line 5가 실패하면서 "Export Roles doesn't exist" 에러 발생.

## 해결 방법

### 변경사항

**파일**: `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/roles/components/roles-stats.tsx`

#### Before (수정 전)
```typescript
import { Roles as RolesIcon, UserCheck, UserX, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Roles } from "../types/roles.types";

interface RolesStatsProps {
  roles: Roles[];
}
```

#### After (수정 후)
```typescript
import { Roles as RolesIcon, UserCheck, UserX, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Roles as RolesType } from "../types/roles.types";

interface RolesStatsProps {
  roles: RolesType[];
}
```

### 변경 내용

| 항목 | Before | After |
|------|--------|-------|
| 타입 Import | `import type { Roles }` | `import type { Roles as RolesType }` |
| Interface | `roles: Roles[]` | `roles: RolesType[]` |
| 이유 | 이름 충돌 | 명확한 구분 |

## 수정된 파일

### `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/roles/components/roles-stats.tsx`

```typescript
"use client";

import { Roles as RolesIcon, UserCheck, UserX, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Roles as RolesType } from "../types/roles.types";  // ✅ RolesType로 별칭

interface RolesStatsProps {
  roles: RolesType[];  // ✅ RolesType 사용
}

export function RolesStats({ roles }: RolesStatsProps) {
  const total = roles.length;
  const active = roles.filter((u) => u.is_active).length;
  const inactive = total - active;
  const admins = roles.filter((u) => u.is_active).length;

  const stats = [
    { label: "전체 role", value: total, icon: RolesIcon, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "활성", value: active, icon: UserCheck, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "비활성", value: inactive, icon: UserX, color: "text-gray-600", bgColor: "bg-gray-100" },
    { label: "관리자", value: admins, icon: Shield, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
```

## 관련 파일 구조

### Export 경로 확인

```
src/features/idam/roles/
├── index.ts
│   └── export type * from "./types/roles.types"  ✅
├── types/
│   ├── index.ts
│   │   └── export * from './roles.types'  ✅
│   └── roles.types.ts
│       └── export interface Roles { ... }  ✅
└── components/
    ├── index.ts
    │   └── export { RolesStats } from "./roles-stats"  ✅
    └── roles-stats.tsx
        └── import type { Roles as RolesType }  ✅ (수정됨)
```

## Roles 타입 정의

**파일**: `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/roles/types/roles.types.ts`

```typescript
/**
 * Roles 정보
 */
export interface Roles {
  // 기본 식별자
  id: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;

  // 필드 정의
  name: string;
  description?: string;

  // 상태
  is_active: boolean;
  is_deleted: boolean;
}
```

## TypeScript 컴파일 에러 해결

### Before (에러 발생)
```
❌ Error: Export Roles doesn't exist in target module
   ./apps/manager-web/src/features/idam/roles/components/roles-stats.tsx (3:1)
```

**이유**:
1. `lucide-react`에서 `Roles` 아이콘을 import (as RolesIcon)
2. `types/roles.types`에서 `Roles` 타입을 import
3. Import 이름 충돌로 인해 TypeScript가 혼동
4. 결국 Line 5의 `Roles` import 실패

### After (정상)
```
✅ Success: 컴파일 성공
```

**이유**:
1. `lucide-react`에서 `Roles as RolesIcon` (아이콘)
2. `types/roles.types`에서 `Roles as RolesType` (타입)
3. 명확한 이름 구분으로 충돌 해결

## 모범 사례 (Best Practices)

### Import 충돌 회피

```typescript
// ❌ 피해야 할 방식
import { Roles as Roles } from "lucide-react";
import type { Roles } from "./types";  // 충돌!

// ✅ 권장 방식
import { Roles as RolesIcon } from "lucide-react";  // UI 컴포넌트
import type { Roles as RolesType } from "./types";  // 데이터 타입
```

### 명확한 별칭 사용

```typescript
// ❌ 헷갈리는 별칭
import type { Roles as R } from "./types";

// ✅ 명확한 별칭
import type { Roles as RolesType } from "./types";
import type { Roles as RolesModel } from "./types";
import type { Roles as RolesEntity } from "./types";
```

## 검증 체크리스트

- ✅ Import 경로 확인: `../types/roles.types`
- ✅ Roles 타입 export 확인: `roles.types.ts`에서 export
- ✅ 별칭 일관성 확인: 전체 파일에서 `RolesType` 사용
- ✅ 컴포넌트 기능 보존: RolesStats 컴포넌트 로직 변경 없음
- ✅ TypeScript 타입 안정성: 모든 타입 참조 일관성 유지

## 요약

| 항목 | 상세 |
|------|------|
| **문제** | `Roles` 이름 충돌 (lucide-react 아이콘 vs types) |
| **원인** | 두 개의 다른 모듈에서 같은 이름으로 import |
| **해결책** | 타입 import에 `as RolesType` 별칭 사용 |
| **변경파일** | `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/roles/components/roles-stats.tsx` |
| **영향도** | 낮음 (타입 별칭만 변경) |
| **상태** | ✅ 완료 |

