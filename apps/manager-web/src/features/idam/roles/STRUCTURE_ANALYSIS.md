# Roles Folder Structure Analysis - Executive Summary

## Current Status

The **roles** folder structure is **NOT synchronized** with the **users** folder pattern. 

- **Roles**: Using REST API + React Query (old architecture)
- **Users**: Using GraphQL + Apollo Client (new architecture)

---

## Quick Comparison Table

| Aspect | Roles (Current) | Users (Target) | Match? |
|--------|-----------------|----------------|--------|
| **API Client** | REST (Axios) | GraphQL (Apollo) | ❌ NO |
| **State Query** | React Query | Apollo Client | ❌ NO |
| **Hooks Pattern** | useQuery/useMutation | Apollo useQuery/useMutation | ❌ NO |
| **Service Layer** | REST endpoints | GraphQL wrapper | ❌ NO |
| **GraphQL Folder** | MISSING | graphql/ | ❌ NO |
| **Type Style** | snake_case | camelCase | ❌ NO |
| **Zustand Store** | Basic (6 items) | Enhanced (8 items + sorting) | ❌ NO |
| **Filter Component** | Hand-crafted | Reusable Filters | ❌ NO |
| **Documentation** | MISSING | ARCHITECTURE.md + README | ❌ NO |
| **Total Files** | 17 | 23 | ❌ NO |

---

## Missing Components in Roles

### Folder: graphql/ (Completely Missing)
```
graphql/
├── queries.ts       - GET_MANAGER_ROLES, GET_MANAGER_ROLE queries
├── mutations.ts     - CREATE/UPDATE_MANAGER_ROLE mutations
└── index.ts         - Exports
```

### Files: Documentation (Missing)
```
ARCHITECTURE.md     - Feature architecture & development guide
README.md           - Feature overview
```

---

## File-by-File Differences

### 1. types/roles.types.ts (Needs Refactoring)

**Current (REST style):**
```typescript
export interface Roles {
  id: string;
  name: string;
  is_active: boolean;      // snake_case ❌
  is_deleted: boolean;
  created_at: string;      // snake_case ❌
  created_by?: string;
}

export interface RolesQueryParams {
  page?: number;           // REST pagination ❌
  pageSize?: number;
  search?: string;
}
```

**Should Be (GraphQL style):**
```typescript
export interface ManagerRole {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;       // camelCase ✓
  createdAt: string;       // camelCase ✓
  updatedAt: string;
  createdBy?: string;
}

export interface ManagerRolesQueryParams {
  limit?: number;          // GraphQL pagination ✓
  offset?: number;
  search?: string;
  isActive?: boolean;
}
```

---

### 2. services/roles.service.ts (Complete Rewrite)

**Current (REST):**
```typescript
const ENDPOINT = "/api/v1/manager/idam/roles";

export const rolesService = {
  async listRoles(params?: RolesQueryParams): Promise<RolesListResponse> {
    const response = await api.get<ApiResponse<RolesListResponse>>(ENDPOINT, {
      params: { page, page_size, search, active },
    });
  }
}
```

**Should Be (GraphQL):**
```typescript
import { apolloClient } from "@/lib/apollo-client";
import { GET_MANAGER_ROLES, CREATE_MANAGER_ROLE, ... } from "../graphql";

export const rolesService = {
  async listRoles(params?: GetManagerRolesVariables): Promise<...> {
    const { data } = await apolloClient.query<GetManagerRolesResponse>({
      query: GET_MANAGER_ROLES,
      variables: { limit: 20, offset: 0, ...params },
      fetchPolicy: "network-only",
    });
  }
}
```

---

### 3. hooks/use-roles.ts (Migrate to Apollo)

**Current (React Query):**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesService } from '../services/roles.service';

export function useRoles(params?: RolesQueryParams) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: ({ signal }) => rolesService.listRoles(params, signal),
    staleTime: 5 * 60 * 1000,
  });
}
```

**Should Be (Apollo):**
```typescript
import { useQuery, useMutation } from "@apollo/client";
import { GET_MANAGER_ROLES, GET_MANAGER_ROLE, ... } from "../graphql";

export function useManagerRoles(variables?: GetManagerRolesVariables) {
  return useQuery<{ managerRoles: ManagerRole[] }>(GET_MANAGER_ROLES, {
    variables: { limit: 20, offset: 0, ...variables },
    fetchPolicy: "cache-and-network",
  });
}
```

---

### 4. stores/roles.store.ts (Enhance Zustand)

**Current:**
```typescript
interface RolesStore {
  selectedStatus: 'active' | 'inactive' | '';  // lowercase ❌
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;
  // Missing: sorting, resetFilters action
}
```

**Should Be:**
```typescript
interface RolesStore {
  selectedStatus: 'ACTIVE' | 'INACTIVE' | '';  // uppercase ✓
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;
  sorting: Array<{ id: string; desc: boolean }>;  // ✓ Added
  
  // ✓ Added actions
  setSorting: (sorting: Updater<...>) => void;
  resetFilters: () => void;
}
```

---

### 5. components/roles-filters.tsx (Simplify with Filters component)

**Current (Hand-crafted):**
```typescript
export function RolesFilters({ roles }: RolesFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row ...">
      <Input placeholder="role 검색..." />
      <Select value={selectedStatus || ""} onValueChange={...}>
        <SelectItem value="active">활성</SelectItem>
        <SelectItem value="inactive">비활성</SelectItem>
      </Select>
    </div>
  );
}
```

**Should Be (Use Filters component):**
```typescript
import { Filters } from "@/components/filters/filters";

export function RolesFilters() {
  const { selectedStatus, globalFilter, setSelectedStatus, setGlobalFilter } = useRolesStore();

  const filterFields = useMemo(() => [
    { key: "globalFilter", type: "search", label: "검색", placeholder: "역할명 검색..." },
    { key: "selectedStatus", type: "select", label: "상태", 
      options: [
        { label: "활성", value: "ACTIVE" },
        { label: "비활성", value: "INACTIVE" },
      ]
    }
  ], []);

  return <Filters fields={filterFields} values={{...}} onChange={{...}} />;
}
```

---

### 6. index.ts (Add GraphQL Exports)

**Current:**
```typescript
export * from "./components";
export * from "./hooks/use-roles";
export { rolesService } from "./services/roles.service";
export type * from "./types/roles.types";
export { useRolesStore } from "./stores/roles.store";
// Missing: GraphQL exports
```

**Should Be:**
```typescript
export * from "./components";

// GraphQL hooks
export {
  useManagerRoles,
  useManagerRole,
  useCreateManagerRole,
  useUpdateManagerRole,
} from "./hooks";

// GraphQL variables
export type {
  GetManagerRolesVariables,
  GetManagerRoleVariables,
  CreateManagerRoleVariables,
  UpdateManagerRoleVariables,
} from "./graphql";

// Types
export type {
  ManagerRole,
  CreateManagerRoleRequest,
  UpdateManagerRoleRequest,
} from "./types/roles.types";

// Store
export { useRolesStore } from "./stores/roles.store";
```

---

## Summary of Changes Needed

### Files to Create (5 new files)
1. `graphql/queries.ts` - GraphQL GET queries
2. `graphql/mutations.ts` - GraphQL mutations
3. `graphql/index.ts` - GraphQL exports
4. `ARCHITECTURE.md` - Feature documentation
5. `README.md` - Feature readme

### Files to Significantly Modify (6 files)
1. `types/roles.types.ts` - Change to camelCase, update naming
2. `services/roles.service.ts` - Migrate to Apollo Client
3. `hooks/use-roles.ts` - Migrate to Apollo hooks
4. `stores/roles.store.ts` - Add sorting, enhance actions
5. `components/roles-filters.tsx` - Use Filters component
6. `index.ts` - Add GraphQL exports

### Files Unchanged (5 files)
1. `components/roles-columns.tsx` - Keep as is
2. `components/roles-table.tsx` - Keep as is
3. `components/roles-form.tsx` - May need minor updates
4. `components/roles-edit.tsx` - May need minor updates
5. `components/index.ts` - Keep as is

---

## Implementation Priority

### Priority 1: Critical (Core Architecture)
1. Create `graphql/queries.ts` and `graphql/mutations.ts`
2. Update `types/roles.types.ts` to GraphQL style
3. Rewrite `services/roles.service.ts` to use Apollo
4. Rewrite `hooks/use-roles.ts` to use Apollo hooks

### Priority 2: Important (Consistency)
1. Update `stores/roles.store.ts` with sorting & resetFilters
2. Update `components/roles-filters.tsx` to use Filters component
3. Update `index.ts` exports

### Priority 3: Nice-to-Have (Documentation)
1. Create `ARCHITECTURE.md`
2. Create `README.md`

---

## Key Metrics

| Metric | Roles | Users | Difference |
|--------|-------|-------|------------|
| Total Files | 17 | 23 | +6 files (graphql + docs) |
| Folders | 5 | 7 | +2 (graphql) |
| Components | 8 | 8 | Same |
| Type Definition Properties | 6 | 14+ | Need 8+ more |
| Store Properties | 6 | 8 | Need +2 |
| Hooks | 4 | 4+ | Same count, different implementation |

---

## File Size Comparison

```
Roles folder:  ~850 lines of code
Users folder:  ~1500 lines of code (includes GraphQL + docs)

Difference: ~650 lines (graphql definitions + documentation)
```

---

## Conclusion

The roles folder needs **systematic refactoring** to align with the users folder's GraphQL + Apollo architecture. The users folder provides an excellent template for this migration.

**Next Step**: Begin with GraphQL definitions and service layer, then update hooks and components.
