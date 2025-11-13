# 테넌트 DB + 사용자 LocalStorage 방식 구현 가이드

## 📐 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  1. 테넌트 설정 (DB)          2. 사용자 설정 (LocalStorage)      │
│     ↓                              ↓                            │
│  [Tenant Config]   ────merge────>  [User Preferences]          │
│     ↓                              ↓                            │
│  ┌────────────────────────────────────────────────────┐         │
│  │         Final View Configuration                    │         │
│  │  - 필터 설정                                         │         │
│  │  - 컬럼 설정                                         │         │
│  │  - 레이아웃 설정                                     │         │
│  └────────────────────────────────────────────────────┘         │
│                         ↓                                        │
│              [DataTable Component]                               │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 설정 우선순위

```typescript
우선순위: 사용자 로컬 > 테넌트 DB > 코드 기본값

1. 코드 기본값 (Fallback)
   - 하드코딩된 기본 스키마
   - 타입 안정성 보장

2. 테넌트 설정 (DB)
   - 조직 표준
   - 관리자가 설정
   - 모든 사용자에게 적용

3. 사용자 설정 (LocalStorage)
   - 개인 커스터마이징
   - 즉시 적용
   - 테넌트 설정 오버라이드
```

## 💾 데이터 흐름

### 1. 페이지 로드 시

```typescript
// Step 1: 코드 기본값 로드
const defaultConfig = getDefaultConfig(menuCode);

// Step 2: 테넌트 설정 로드 (API - 캐시됨)
const tenantConfig = await fetchTenantConfig(menuId);

// Step 3: 사용자 설정 로드 (LocalStorage)
const userPrefs = getUserLocalPreferences(menuId);

// Step 4: 병합
const finalConfig = mergeConfigs(
  defaultConfig,
  tenantConfig,
  userPrefs
);
```

### 2. 사용자 설정 변경 시

```typescript
// LocalStorage에만 저장 (서버 요청 없음)
function saveUserPreferences(menuId: string, prefs: UserPreferences) {
  const key = `menu_prefs_${menuId}`;
  localStorage.setItem(key, JSON.stringify(prefs));
}
```

### 3. 테넌트 설정 변경 시 (관리자)

```typescript
// API로 DB 저장
async function saveTenantConfig(menuId: string, config: TenantConfig) {
  await api.post('/admin/menu-configs', { menuId, config });
  
  // 캐시 무효화
  invalidateCache(`tenant_config_${menuId}`);
  
  // 모든 사용자에게 알림 (WebSocket/SSE)
  broadcastConfigUpdate(menuId);
}
```

## 🔧 TypeScript 구현 예시

### 1. 타입 정의

```typescript
// types/menu-config.types.ts

export type FilterType = 
  | 'text' 
  | 'select' 
  | 'multiSelect' 
  | 'date' 
  | 'dateRange' 
  | 'number'
  | 'numberRange';

export interface FilterConfig {
  field: string;
  type: FilterType;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  default?: any;
  required?: boolean;
  visible?: boolean;
  order?: number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ColumnConfig {
  field: string;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  pinned?: 'left' | 'right' | null;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  order?: number;
  renderType?: 'text' | 'badge' | 'datetime' | 'currency' | 'custom';
  align?: 'left' | 'center' | 'right';
}

export interface LayoutConfig {
  pageSize?: number;
  pageSizeOptions?: number[];
  defaultSort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  showFilters?: boolean;
  showColumnToggle?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  enableRowSelection?: boolean;
  enableBulkActions?: boolean;
  density?: 'compact' | 'comfortable' | 'spacious';
}

export interface DefaultValues {
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pageSize?: number;
}

// 테넌트 설정 (DB에서 로드)
export interface TenantMenuConfig {
  id: string;
  menuId: string;
  configName?: string;
  filterConfig?: {
    filters: FilterConfig[];
  };
  columnConfig?: {
    columns: ColumnConfig[];
    hiddenColumns?: string[];
  };
  layoutConfig?: LayoutConfig;
  defaultValues?: DefaultValues;
  allowedRoles?: string[];
}

// 사용자 설정 (LocalStorage)
export interface UserMenuPreferences {
  columnVisibility?: Record<string, boolean>;
  columnOrder?: string[];
  columnWidths?: Record<string, number>;
  pinnedColumns?: {
    left?: string[];
    right?: string[];
  };
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pageSize?: number;
  density?: 'compact' | 'comfortable' | 'spacious';
}

// 최종 병합된 설정
export interface FinalViewConfig {
  filters: FilterConfig[];
  columns: ColumnConfig[];
  layout: LayoutConfig;
  defaultValues: DefaultValues;
}
```

### 2. 설정 병합 로직

```typescript
// lib/menu-config.ts

import { merge, cloneDeep } from 'lodash-es';

export class MenuConfigManager {
  /**
   * 설정 병합 (코드 기본값 → 테넌트 설정 → 사용자 설정)
   */
  static mergeConfigs(
    defaultConfig: FinalViewConfig,
    tenantConfig?: TenantMenuConfig,
    userPrefs?: UserMenuPreferences
  ): FinalViewConfig {
    const result = cloneDeep(defaultConfig);

    // 1. 테넌트 설정 병합
    if (tenantConfig) {
      if (tenantConfig.filterConfig?.filters) {
        result.filters = this.mergeFilters(
          result.filters,
          tenantConfig.filterConfig.filters
        );
      }

      if (tenantConfig.columnConfig?.columns) {
        result.columns = this.mergeColumns(
          result.columns,
          tenantConfig.columnConfig.columns,
          tenantConfig.columnConfig.hiddenColumns
        );
      }

      if (tenantConfig.layoutConfig) {
        result.layout = merge(result.layout, tenantConfig.layoutConfig);
      }

      if (tenantConfig.defaultValues) {
        result.defaultValues = merge(
          result.defaultValues,
          tenantConfig.defaultValues
        );
      }
    }

    // 2. 사용자 설정 병합 (최우선)
    if (userPrefs) {
      result.columns = this.applyUserColumnPrefs(result.columns, userPrefs);
      
      if (userPrefs.filters) {
        result.defaultValues.filters = {
          ...result.defaultValues.filters,
          ...userPrefs.filters,
        };
      }

      if (userPrefs.sort) {
        result.defaultValues.sort = userPrefs.sort;
      }

      if (userPrefs.pageSize) {
        result.layout.pageSize = userPrefs.pageSize;
      }

      if (userPrefs.density) {
        result.layout.density = userPrefs.density;
      }
    }

    return result;
  }

  private static mergeFilters(
    base: FilterConfig[],
    override: FilterConfig[]
  ): FilterConfig[] {
    const result = [...base];

    override.forEach((overrideFilter) => {
      const index = result.findIndex((f) => f.field === overrideFilter.field);
      if (index >= 0) {
        result[index] = merge(result[index], overrideFilter);
      } else {
        result.push(overrideFilter);
      }
    });

    return result.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private static mergeColumns(
    base: ColumnConfig[],
    override: ColumnConfig[],
    hiddenColumns?: string[]
  ): ColumnConfig[] {
    const result = [...base];

    override.forEach((overrideCol) => {
      const index = result.findIndex((c) => c.field === overrideCol.field);
      if (index >= 0) {
        result[index] = merge(result[index], overrideCol);
      } else {
        result.push(overrideCol);
      }
    });

    // 숨김 컬럼 처리
    if (hiddenColumns) {
      result.forEach((col) => {
        if (hiddenColumns.includes(col.field)) {
          col.visible = false;
        }
      });
    }

    return result.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private static applyUserColumnPrefs(
    columns: ColumnConfig[],
    userPrefs: UserMenuPreferences
  ): ColumnConfig[] {
    let result = [...columns];

    // 가시성
    if (userPrefs.columnVisibility) {
      result = result.map((col) => ({
        ...col,
        visible: userPrefs.columnVisibility![col.field] ?? col.visible,
      }));
    }

    // 너비
    if (userPrefs.columnWidths) {
      result = result.map((col) => ({
        ...col,
        width: userPrefs.columnWidths![col.field] ?? col.width,
      }));
    }

    // 고정
    if (userPrefs.pinnedColumns) {
      result = result.map((col) => {
        if (userPrefs.pinnedColumns!.left?.includes(col.field)) {
          return { ...col, pinned: 'left' as const };
        }
        if (userPrefs.pinnedColumns!.right?.includes(col.field)) {
          return { ...col, pinned: 'right' as const };
        }
        return col;
      });
    }

    // 순서
    if (userPrefs.columnOrder) {
      result = result.sort((a, b) => {
        const aIndex = userPrefs.columnOrder!.indexOf(a.field);
        const bIndex = userPrefs.columnOrder!.indexOf(b.field);
        
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        
        return aIndex - bIndex;
      });
    }

    return result;
  }
}
```

### 3. React Hook 구현

```typescript
// hooks/use-menu-config.ts

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MenuConfigManager } from '@/lib/menu-config';

export function useMenuConfig(menuId: string) {
  const [finalConfig, setFinalConfig] = useState<FinalViewConfig | null>(null);

  // 1. 코드 기본값
  const defaultConfig = useMemo(() => getDefaultConfig(menuId), [menuId]);

  // 2. 테넌트 설정 (React Query로 캐싱)
  const { data: tenantConfig } = useQuery({
    queryKey: ['tenantConfig', menuId],
    queryFn: () => fetchTenantConfig(menuId),
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });

  // 3. 사용자 설정 (LocalStorage)
  const [userPrefs, setUserPrefs] = useState<UserMenuPreferences>(() => {
    const stored = localStorage.getItem(`menu_prefs_${menuId}`);
    return stored ? JSON.parse(stored) : {};
  });

  // 4. 병합
  useEffect(() => {
    const merged = MenuConfigManager.mergeConfigs(
      defaultConfig,
      tenantConfig,
      userPrefs
    );
    setFinalConfig(merged);
  }, [defaultConfig, tenantConfig, userPrefs]);

  // 사용자 설정 저장
  const saveUserPreferences = useCallback(
    (prefs: Partial<UserMenuPreferences>) => {
      const updated = { ...userPrefs, ...prefs };
      setUserPrefs(updated);
      localStorage.setItem(`menu_prefs_${menuId}`, JSON.stringify(updated));
    },
    [menuId, userPrefs]
  );

  // 사용자 설정 초기화
  const resetUserPreferences = useCallback(() => {
    setUserPrefs({});
    localStorage.removeItem(`menu_prefs_${menuId}`);
  }, [menuId]);

  return {
    config: finalConfig,
    isLoading: !finalConfig,
    saveUserPreferences,
    resetUserPreferences,
  };
}
```

### 4. 컴포넌트 사용 예시

```typescript
// pages/users/index.tsx

import { useMenuConfig } from '@/hooks/use-menu-config';
import { DynamicDataTable } from '@/components/dynamic-data-table';

export default function UsersPage() {
  const { config, isLoading, saveUserPreferences } = useMenuConfig('SYS_USERS');

  if (isLoading) return <Loading />;

  return (
    <div>
      <DynamicDataTable
        config={config}
        onConfigChange={(changes) => {
          // 사용자가 컬럼 순서/가시성 변경 시
          saveUserPreferences(changes);
        }}
      />
    </div>
  );
}
```

## ⚡ 최적화 전략

### 1. 캐싱 전략

```typescript
// 테넌트 설정 캐싱 (React Query)
export const tenantConfigQueryOptions = {
  staleTime: 5 * 60 * 1000,      // 5분간 fresh
  cacheTime: 30 * 60 * 1000,     // 30분간 캐시 유지
  refetchOnWindowFocus: false,
  refetchOnMount: false,
};

// 앱 시작 시 프리페치
queryClient.prefetchQuery({
  queryKey: ['tenantConfigs'],
  queryFn: fetchAllTenantConfigs,
});
```

### 2. 번들 크기 최적화

```typescript
// 메뉴별로 설정 코드 분리 (Dynamic Import)
const getDefaultConfig = (menuId: string) => {
  switch(menuId) {
    case 'SYS_USERS':
      return import('./configs/users.config').then(m => m.default);
    case 'PSM_ORDERS':
      return import('./configs/orders.config').then(m => m.default);
    // ...
  }
};
```

### 3. 실시간 업데이트 (선택사항)

```typescript
// WebSocket으로 테넌트 설정 변경 알림
useEffect(() => {
  const ws = new WebSocket('/ws/config-updates');
  
  ws.onmessage = (event) => {
    const { menuId, configVersion } = JSON.parse(event.data);
    
    // 캐시 무효화
    queryClient.invalidateQueries(['tenantConfig', menuId]);
  };
  
  return () => ws.close();
}, []);
```

## 📊 DB vs LocalStorage 저장 기준

| 항목 | 저장 위치 | 이유 |
|------|----------|------|
| 필터 필드 정의 | DB (테넌트) | 조직 표준 |
| 필터 기본값 | DB (테넌트) | 조직 정책 |
| 필터 현재값 | LocalStorage | 개인 작업 맥락 |
| 컬럼 정의 | DB (테넌트) | 조직 표준 |
| 컬럼 가시성 | LocalStorage | 개인 선호 |
| 컬럼 순서 | LocalStorage | 개인 선호 |
| 컬럼 너비 | LocalStorage | 개인 선호 |
| 페이지 크기 | LocalStorage | 개인 선호 |
| 정렬 기본값 | DB (테넌트) | 조직 표준 |
| 현재 정렬 | LocalStorage | 개인 작업 맥락 |

## ✅ 장점 요약

1. ✅ **성능**: 사용자 설정은 서버 요청 없음
2. ✅ **비용**: DB 저장 공간 절약
3. ✅ **유연성**: 조직 표준 + 개인 커스터마이징
4. ✅ **확장성**: 테넌트 수 증가해도 부하 없음
5. ✅ **UX**: 즉시 반영, 빠른 반응

## ⚠️ 주의사항

1. **LocalStorage 용량 제한**: 5-10MB (충분함)
2. **브라우저 간 동기화 불가**: 같은 사용자도 다른 브라우저면 다른 설정
3. **시크릿 모드**: LocalStorage 초기화됨
4. **백업 불가**: 사용자가 브라우저 캐시 삭제 시 사라짐

## 🚀 향후 확장 (옵션)

필요시 추가 가능:

```typescript
// 사용자 설정 클라우드 동기화 (선택사항)
async function syncUserPreferences() {
  const local = getLocalPreferences();
  const cloud = await fetchUserPreferences();
  
  const merged = mergeByTimestamp(local, cloud);
  
  await saveUserPreferences(merged);
  localStorage.setItem('prefs', JSON.stringify(merged));
}
```

이 방식은 멀티테넌트 환경에서 최적의 균형점입니다! 🎯
