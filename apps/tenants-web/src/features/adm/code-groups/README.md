# Code Groups Feature

코드그룹 관리 기능입니다. 시스템 코드그룹과 사용자 정의 코드그룹을 관리할 수 있습니다.

## 디렉토리 구조

```
code-groups/
├── components/
│   ├── code-groups-header.tsx     # 페이지 헤더 및 버튼 (신규)
│   ├── code-groups-stats.tsx      # 통계 카드 (신규)
│   ├── code-groups-filters.tsx    # 필터 컴포넌트 (신규)
│   ├── code-groups-list.tsx       # 리스트 필터링 (신규)
│   ├── code-groups-paging.tsx     # 페이지네이션 (신규)
│   ├── code-groups-edit.tsx       # 수정/생성 폼 컨테이너 (신규)
│   ├── code-group-table.tsx       # 테이블 컴포넌트
│   ├── code-group-form.tsx        # 폼 컴포넌트
│   └── index.ts
├── hooks/
│   ├── index.ts
│   └── use-code-group.ts          # 커스텀 훅
├── services/
│   ├── index.ts
│   └── code-group.service.ts      # API 서비스 레이어
├── stores/
│   ├── index.ts
│   └── code-group.store.ts        # Zustand 상태 관리
├── types/
│   ├── index.ts
│   └── code-group.types.ts        # TypeScript 타입 정의
└── index.ts
```

## 주요 기능

- **코드그룹 목록 조회**: 시스템/사용자 코드그룹 필터링
- **코드그룹 생성**: 새로운 코드그룹 추가
- **코드그룹 수정**: 기존 코드그룹 정보 수정
- **코드그룹 삭제**: 시스템 코드그룹 제외 삭제 가능
- **필터링**: 검색, 상태, 구분 필터

## 더미 데이터

```typescript
- GENDER (성별) - 시스템 코드그룹
- STATUS (상태) - 시스템 코드그룹
- PAYMENT (결제방식) - 사용자 정의
- PRIORITY (우선순위) - 사용자 정의
```

## 사용 예시

### 페이지 컴포넌트

```typescript
'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ListPageLayout } from '@/components/layouts/list-page-layout';
import { StatCard } from '@/components/stats/stat-card';
import { CodeGroupTable } from '@/features/adm/code-groups/components/code-group-table';
import { CodeGroupFilter } from '@/features/adm/code-groups/components/code-group-filter';
import { CodeGroupForm } from '@/features/adm/code-groups/components/code-group-form';
import {
  useCodeGroupList,
  useCodeGroupStats,
  useDeleteCodeGroup
} from '@/features/adm/code-groups/hooks/use-code-group';
import { useCodeGroupStore } from '@/features/adm/code-groups/stores/code-group.store';

export default function CodeGroupsPage() {
  const { codeGroups, isLoading } = useCodeGroupList();
  const stats = useCodeGroupStats();
  const { deleteCodeGroup } = useDeleteCodeGroup();
  const { isSidebarOpen, isEditMode, selectedCodeGroup, openSidebar, closeSidebar } = useCodeGroupStore();

  const handleDelete = (codeGroup: CodeGroup) => {
    if (codeGroup.is_system) {
      alert('시스템 코드그룹은 삭제할 수 없습니다.');
      return;
    }
    if (confirm(`'${codeGroup.name}' 코드그룹을 삭제하시겠습니까?`)) {
      deleteCodeGroup(codeGroup.id);
    }
  };

  return (
    <ListPageLayout
      title="코드그룹 관리"
      description="시스템 및 사용자 정의 코드그룹을 관리합니다"
      actions={
        <Button onClick={() => openSidebar(false)}>
          <Plus className="h-4 w-4 mr-2" />
          코드그룹 추가
        </Button>
      }
    >
      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="전체 코드그룹" value={stats.total} color="default" />
        <StatCard title="활성" value={stats.active} color="primary" />
        <StatCard title="비활성" value={stats.inactive} color="warning" />
        <StatCard title="시스템" value={stats.system} color="success" />
        <StatCard title="사용자 정의" value={stats.custom} color="default" />
      </div>

      {/* 필터 */}
      <CodeGroupFilter />

      {/* 테이블 */}
      <CodeGroupTable
        codeGroups={codeGroups}
        isLoading={isLoading}
        onDelete={handleDelete}
      />

      {/* 사이드바 폼 */}
      <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {isEditMode ? '코드그룹 수정' : '코드그룹 추가'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <CodeGroupForm
              codeGroup={selectedCodeGroup || undefined}
              isEditMode={isEditMode}
            />
          </div>
        </SheetContent>
      </Sheet>
    </ListPageLayout>
  );
}
```

## 특징

1. **시스템 코드그룹 보호**: `is_system` 플래그로 시스템 코드그룹 삭제 방지
2. **실시간 필터링**: 검색어, 상태, 구분별 즉시 필터링
3. **타입 안전성**: 모든 함수와 컴포넌트에 명시적 타입 지정
4. **관심사 분리**: Page → Component → Hook → Service → Store 계층 구조
5. **Early Return 패턴**: 조건부 렌더링 최적화
