# Settings Feature

시스템 설정정보를 관리하는 기능입니다. STRING, NUMBER, BOOLEAN, JSON 타입의 설정을 지원합니다.

## 디렉토리 구조

```
settings/
├── components/
│   ├── setting-table.tsx     # 설정정보 테이블 컴포넌트
│   ├── setting-filter.tsx    # 필터 컴포넌트
│   └── setting-form.tsx      # 생성/수정 폼 컴포넌트
├── hooks/
│   └── use-setting.ts        # TanStack Query 커스텀 훅
├── services/
│   └── setting.service.ts    # API 서비스 레이어
├── stores/
│   └── setting.store.ts      # Zustand 상태 관리
└── types/
    └── setting.types.ts      # TypeScript 타입 정의
```

## 주요 기능

- **설정정보 목록 조회**: 타입별 필터링
- **설정정보 생성**: 새로운 설정 추가
- **설정정보 수정**: 기존 설정 값 수정
- **설정정보 삭제**: 설정 삭제
- **필터링**: 검색, 타입, 상태 필터
- **통계**: 전체, 활성, 비활성, 타입별 집계

## 더미 데이터

```typescript
- APP_NAME: 'CXG Platform' (STRING)
- APP_VERSION: '1.0.0' (STRING)
- MAX_LOGIN_ATTEMPTS: '5' (NUMBER)
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
import { SettingTable } from '@/features/adm/settings/components/setting-table';
import { SettingFilter } from '@/features/adm/settings/components/setting-filter';
import { SettingForm } from '@/features/adm/settings/components/setting-form';
import {
  useSettingList,
  useSettingStats,
  useDeleteSetting
} from '@/features/adm/settings/hooks/use-setting';
import { useSettingStore } from '@/features/adm/settings/stores/setting.store';

export default function SettingsPage() {
  const { settings, isLoading } = useSettingList();
  const stats = useSettingStats();
  const { deleteSetting } = useDeleteSetting();
  const { isSidebarOpen, isEditMode, selectedSetting, openSidebar, closeSidebar } = useSettingStore();

  const handleDelete = (setting: Setting) => {
    if (confirm(`'${setting.key}' 설정을 삭제하시겠습니까?`)) {
      deleteSetting(setting.id);
    }
  };

  return (
    <ListPageLayout
      title="설정정보 관리"
      description="시스템 설정정보를 관리합니다"
      actions={
        <Button onClick={() => openSidebar(false)}>
          <Plus className="h-4 w-4 mr-2" />
          설정 추가
        </Button>
      }
    >
      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="전체 설정" value={stats.total} color="default" />
        <StatCard title="활성" value={stats.active} color="primary" />
        <StatCard title="비활성" value={stats.inactive} color="warning" />
        <StatCard
          title="타입 종류"
          value={Object.keys(stats.byType).filter(k => stats.byType[k as SettingType] > 0).length}
          color="success"
        />
      </div>

      {/* 필터 */}
      <SettingFilter />

      {/* 테이블 */}
      <SettingTable
        settings={settings}
        isLoading={isLoading}
        onDelete={handleDelete}
      />

      {/* 사이드바 폼 */}
      <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {isEditMode ? '설정 수정' : '설정 추가'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SettingForm
              setting={selectedSetting || undefined}
              isEditMode={isEditMode}
            />
          </div>
        </SheetContent>
      </Sheet>
    </ListPageLayout>
  );
}
```

## 설정 타입

- **STRING**: 문자열 값 (예: APP_NAME)
- **NUMBER**: 숫자 값 (예: MAX_LOGIN_ATTEMPTS)
- **BOOLEAN**: true/false 값
- **JSON**: JSON 형식 데이터

## 특징

1. **다양한 타입 지원**: STRING, NUMBER, BOOLEAN, JSON
2. **타입별 필터링**: 각 타입별 설정 조회
3. **실시간 통계**: 타입별 설정 수 집계
4. **키 자동 변환**: 대문자 + 언더스코어 자동 변환
5. **타입 안전성**: 완벽한 TypeScript 타입 지원
