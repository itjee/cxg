# ConexGrow Tenants-Web - Developer Quick Start Guide

**Last Updated**: 2025-10-26
**Version**: 1.0.0
**Status**: ✅ Production Ready

---

## 🚀 5-Minute Overview

ConexGrow Tenants-Web is a fully structured Next.js 15 application with:
- **16 schemas** organized by business function
- **65 entities** for managing different data types
- **148 routes** for list and detail views
- **4-layer architecture** for clean code separation
- **Centralized menu system** with 16 groups and 60+ items

Everything is ready. You just need to build the UI components.

---

## 📍 Where to Start

### 1. **First Time Setup** (5 minutes)
```bash
cd apps/tenants-web
pnpm install
pnpm dev
# Open http://localhost:8300
```

### 2. **Read Documentation** (15 minutes)
```
Start with: FRONTEND_STRUCTURE.md (this directory)
Then read: docs/implementation/tenants-web/종합_프론트엔드_구조_완성_20251026200000.md
```

### 3. **Review Example** (10 minutes)
Look at complete implementation:
```bash
# Navigate to example
src/features/sys/users/

# Study the pattern:
# - types/index.ts        (Data types)
# - services/usersService.ts (API calls)
# - hooks/useUsers.ts     (Data fetching)
# - components/           (UI components)
```

---

## 🏗️ Project Structure

### Routes
```
src/app/(main)/
├── adm/codes/page.tsx           → List page for codes
├── adm/codes/[id]/page.tsx      → Detail page
├── hrm/employees/page.tsx       → List page for employees
└── ... (146 more pages)
```

### Business Logic
```
src/features/
├── sys/users/
│   ├── types/index.ts           → Interfaces
│   ├── services/usersService.ts → API calls
│   ├── hooks/useUsers.ts        → Data fetching
│   └── components/              → React UI
├── crm/partners/                → (Same pattern)
└── ... (58 more entities)
```

### Navigation
```
src/constants/menu-config.ts    → Menu definition (16 groups, 60+ items)
src/components/layout/sidebar.tsx → Renders menu dynamically
```

---

## 🔄 Understanding the Flow

### Example: View User List

```
1. User clicks "사용자 관리" in sidebar
   ↓
2. Navigate to /sys/users
   ↓
3. Load src/app/(main)/sys/users/page.tsx
   ↓
4. Renders <UserList /> component
   ↓
5. Component calls useUsers() hook
   ↓
6. Hook calls usersService.listUsers()
   ↓
7. Service makes API call: GET /api/22_sys/users
   ↓
8. TanStack Query caches result
   ↓
9. Component renders list with data
```

---

## 💻 Creating Your First Feature

### Step 1: Add to Menu
Edit `src/constants/menu-config.ts`:
```typescript
{
  name: "고객관계",
  icon: Briefcase,
  description: "거래처, 영업기회, 활동 관리",
  items: [
    { name: "거래처 관리", href: "/crm/partners" },  // ← Add here
  ],
}
```

### Step 2: Create Page
```bash
mkdir -p src/app/\(main\)/crm/partners
cat > src/app/\(main\)/crm/partners/page.tsx << 'EOF'
"use client";

import { PartnerList } from "@/features/crm/partners/components/PartnerList";

export default function Page() {
  return <PartnerList />;
}
EOF
```

### Step 3: Create Feature Folder
```bash
mkdir -p src/features/crm/partners/{types,services,hooks,components}
```

### Step 4: Define Types
`src/features/crm/partners/types/index.ts`:
```typescript
export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerRequest {
  name: string;
  email: string;
  phone: string;
}

export interface UpdatePartnerRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface PartnerListResponse {
  data: Partner[];
  total: number;
  page: number;
  pageSize: number;
}
```

### Step 5: Create API Service
`src/features/crm/partners/services/partnersService.ts`:
```typescript
import axios from "axios";
import type {
  Partner,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  PartnerListResponse,
} from "../types";

const API_BASE = "/api/03_crm/partners";

export const partnerService = {
  async listPartners(params?: any): Promise<PartnerListResponse> {
    try {
      const response = await axios.get(API_BASE, { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch partners:", error);
      throw error;
    }
  },

  async getPartner(id: string): Promise<Partner> {
    try {
      const response = await axios.get(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch partner ${id}:`, error);
      throw error;
    }
  },

  async createPartner(data: CreatePartnerRequest): Promise<Partner> {
    try {
      const response = await axios.post(API_BASE, data);
      return response.data;
    } catch (error) {
      console.error("Failed to create partner:", error);
      throw error;
    }
  },

  async updatePartner(
    id: string,
    data: UpdatePartnerRequest
  ): Promise<Partner> {
    try {
      const response = await axios.patch(`${API_BASE}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update partner ${id}:`, error);
      throw error;
    }
  },

  async deletePartner(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error(`Failed to delete partner ${id}:`, error);
      throw error;
    }
  },
};
```

### Step 6: Create Hooks
`src/features/crm/partners/hooks/usePartners.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { partnerService } from "../services/partnersService";
import type { CreatePartnerRequest, UpdatePartnerRequest } from "../types";

const QUERY_KEY = ["partners"];

export function usePartners(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => partnerService.listPartners(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePartner(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => partnerService.getPartner(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePartnerRequest) =>
      partnerService.createPartner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartnerRequest }) =>
      partnerService.updatePartner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerService.deletePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
```

### Step 7: Create Components
`src/features/crm/partners/components/PartnerList.tsx`:
```typescript
"use client";

import { usePartners, useCreatePartner, useDeletePartner } from "../hooks/usePartners";
import { useState } from "react";
import Link from "next/link";

export function PartnerList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePartners({ page });
  const { mutate: deletePartner } = useDeletePartner();

  if (isLoading) return <div className="p-8">로딩 중...</div>;
  if (error) return <div className="p-8 text-red-600">오류: {error.message}</div>;

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">거래처 관리</h1>
        <Link
          href="/crm/partners/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          새 거래처 추가
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">이름</th>
              <th className="p-3 text-left">이메일</th>
              <th className="p-3 text-left">전화</th>
              <th className="p-3 text-center">작업</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((partner) => (
              <tr key={partner.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{partner.name}</td>
                <td className="p-3">{partner.email}</td>
                <td className="p-3">{partner.phone}</td>
                <td className="p-3 text-center space-x-2">
                  <Link
                    href={`/crm/partners/${partner.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    상세
                  </Link>
                  <button
                    onClick={() => deletePartner(partner.id)}
                    className="text-red-600 hover:underline"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-4 py-2">페이지 {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded"
        >
          다음
        </button>
      </div>
    </div>
  );
}
```

---

## 📚 Key Files Reference

### Configuration
| File | Purpose |
|------|---------|
| `src/constants/menu-config.ts` | Menu structure (16 groups, 60+ items) |
| `src/components/layout/sidebar.tsx` | Navigation component |

### Example Implementation
| File | Purpose |
|------|---------|
| `src/features/sys/users/types/index.ts` | Data types |
| `src/features/sys/users/services/usersService.ts` | API service |
| `src/features/sys/users/hooks/useUsers.ts` | TanStack Query hooks |
| `src/features/sys/users/components/UserList.tsx` | List component |

### Documentation
| File | Purpose |
|------|---------|
| `FRONTEND_STRUCTURE.md` | Quick reference |
| `docs/implementation/tenants-web/종합_프론트엔드_구조_완성_20251026200000.md` | Complete guide |
| `docs/implementation/tenants-web/사이드바_메뉴_구성_20251026195530.md` | Menu system |
| `docs/implementation/tenants-web/features폴더_CRUD_구현_20251026194500.md` | CRUD patterns |

---

## 🔗 API Integration

### URL Pattern
```
Frontend:  /[schema]/[entity]
API:       /api/[01-22]_[schema]/[entity]
Database:  [01-22]_[schema].[entity]

Example:
Frontend:  /adm/codes
API:       /api/01_adm/codes
Database:  01_adm.codes
```

### Schema Mapping
| Frontend | API | Database | Name |
|----------|-----|----------|------|
| /adm | /api/01_adm | 01_adm | 기본 설정 |
| /hrm | /api/02_hrm | 02_hrm | 인사/급여 |
| /crm | /api/03_crm | 03_crm | 고객관계 |
| /pim | /api/04_pim | 04_pim | 제품 정보 |
| /wms | /api/05_wms | 05_wms | 창고 관리 |
| /apm | /api/06_apm | 06_apm | 승인 관리 |
| /ivm | /api/10_ivm | 10_ivm | 재고 관리 |
| /psm | /api/11_psm | 11_psm | 구매 관리 |
| /srm | /api/12_srm | 12_srm | 판매 관리 |
| /fsm | /api/13_fsm | 13_fsm | 고객 지원 |
| /fim | /api/14_fim | 14_fim | 재무 회계 |
| /fam | /api/15_fam | 15_fam | 고정 자산 |
| /lwm | /api/16_lwm | 16_lwm | 워크플로우 |
| /bim | /api/20_bim | 20_bim | 경영 분석 |
| /sys | /api/22_sys | 22_sys | 시스템 관리 |

---

## 🎨 Design System

### Colors
- **Primary**: indigo-600
- **Active**: indigo-50 (light) / indigo-900/50 (dark)
- **Hover**: gray-50 (light) / gray-700 (dark)
- **Text**: gray-700 (light) / gray-300 (dark)

### Spacing
- **Page Padding**: 8 (32px)
- **Group Padding**: 3 (12px)
- **Item Padding**: 2-3 (8-12px)

### Components
- Use **shadcn/ui** components where possible
- Icons from **lucide-react**
- Forms with **native HTML** or shadcn forms

---

## 🧪 Testing

### Manual Testing
```bash
# 1. Start dev server
pnpm dev

# 2. Navigate to entity page
http://localhost:8300/sys/users

# 3. Test CRUD operations
- Load list
- Click item
- Create new
- Edit item
- Delete item
```

### Console Logging
Services have built-in logging:
```typescript
console.error("Failed to fetch:", error);
```

---

## 🐛 Common Issues & Solutions

### Issue: Menu item doesn't show
**Solution**: Check menu-config.ts has correct href format (`/schema/entity`)

### Issue: API 404 error
**Solution**:
1. Check service uses correct endpoint (`/api/XX_schema/entity`)
2. Verify backend API is running
3. Check network tab for actual URL

### Issue: Data not loading
**Solution**:
1. Check browser console for errors
2. Check Network tab for API response
3. Verify hook is called correctly
4. Check TanStack Query dev tools

### Issue: TypeScript errors
**Solution**:
1. Ensure all types are exported from `types/index.ts`
2. Check import paths are correct
3. Run `tsc --noEmit` to check all errors

---

## 📖 Documentation Links

### In-Depth Guides
1. **Architecture**: `docs/implementation/tenants-web/종합_프론트엔드_구조_완성_20251026200000.md`
2. **CRUD Patterns**: `docs/implementation/tenants-web/features폴더_CRUD_구현_20251026194500.md`
3. **Menu System**: `docs/implementation/tenants-web/사이드바_메뉴_구성_20251026195530.md`
4. **Database Mapping**: `docs/implementation/tenants-web/테넌트웹_스키마동기화_폴더구조최적화_20251026192030.md`

### Quick References
- **Quick Start**: This file
- **Structure Overview**: `FRONTEND_STRUCTURE.md`
- **Session Summary**: `SESSION_COMPLETION_SUMMARY.md`
- **Project Standards**: `CLAUDE.md`

---

## ✅ Checklist Before Commit

- [ ] Component renders without errors
- [ ] All CRUD operations work
- [ ] Types are properly exported
- [ ] No console errors
- [ ] API endpoints match backend
- [ ] Menu-config is updated (if adding new entity)
- [ ] Code follows naming conventions
- [ ] Tests pass (if applicable)

---

## 🚀 Ready to Code?

1. ✅ Environment set up
2. ✅ Architecture understood
3. ✅ Example reviewed
4. ✅ Documentation available

**Go ahead and start building!**

---

## 📞 Need Help?

- **Architecture Questions**: See `FRONTEND_STRUCTURE.md`
- **CRUD Implementation**: Review `src/features/sys/users/`
- **Menu System**: Check `src/constants/menu-config.ts`
- **API Endpoints**: Reference schema mapping table above
- **General Issues**: Check documentation files

---

**Happy coding! 🎉**
