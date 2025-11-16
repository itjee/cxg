# PageHeader 버튼 스타일 리팩토링 보고서

## 개요

`page-header.tsx` 컴포넌트의 버튼 UI를 `ButtonGroup`에서 개별 버튼으로 변경하고, 다양한 버튼 타입을 지원하도록 확장했습니다.

## 변경 내용

### 1️⃣ 파일 위치
`/home/itjee/workspace/cxg/apps/manager-web/src/components/layouts/page-header.tsx`

### 2️⃣ 주요 변경사항

#### Before (수정 전)
```typescript
import { ButtonGroup } from '@/components/ui/button-group';

export interface ActionButtonConfig {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
}

export function PageHeader({ title, description, actions = [] }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>...</div>
      {actions.length > 0 && (
        <ButtonGroup>  {/* ❌ ButtonGroup 사용 */}
          {actions.map((action, index) => (
            <Button key={index} {...}>
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </div>
  );
}
```

#### After (수정 후)
```typescript
// ✅ DropdownMenu 추가
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

// ✅ 다양한 버튼 타입 지원
type ButtonType = 'default' | 'lookup' | 'toggle' | 'text' | 'icon';

// ✅ 룩업 버튼의 메뉴 아이템 설정
export interface LookupMenuItemConfig {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

// ✅ 확장된 ActionButtonConfig
export interface ActionButtonConfig {
  id: string;  // 고유 ID (key로 사용)
  type?: ButtonType;  // 버튼 타입
  label?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
  isActive?: boolean;  // 토글 버튼용
  onToggle?: (isActive: boolean) => void;  // 토글 콜백
  menuItems?: LookupMenuItemConfig[];  // 룩업 메뉴
  size?: 'default' | 'sm' | 'lg';
}

// ✅ 버튼 타입별 렌더러
function ActionButton({ action }: { action: ActionButtonConfig }) {
  // 각 버튼 타입에 따른 구현...
}

export function PageHeader({ ... }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>...</div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2">  {/* ✅ gap-2로 간격 조절 */}
          {actions.map((action) => (
            <ActionButton key={action.id} action={action} />  {/* ✅ 개별 버튼 */}
          ))}
        </div>
      )}
    </div>
  );
}
```

## 지원하는 버튼 타입 (5가지)

### 1. 일반 버튼 (Default)
라벨과 아이콘을 함께 표시하는 기본 버튼입니다.

```typescript
{
  id: '1',
  type: 'default',  // 생략 가능 (기본값)
  label: '새로고침',
  icon: RefreshCw,
  onClick: handleRefresh,
  variant: 'outline',
  size: 'default'
}
```

**UI**: `[아이콘] 새로고침`

---

### 2. 룩업 버튼 (Lookup - 팝업 메뉴)
클릭 시 드롭다운 메뉴를 표시합니다.

```typescript
{
  id: '2',
  type: 'lookup',
  label: '더보기',
  icon: MoreVertical,
  variant: 'outline',
  menuItems: [
    {
      label: '편집',
      icon: Edit,
      onClick: handleEdit
    },
    {
      label: '삭제',
      icon: Trash,
      onClick: handleDelete,
      variant: 'destructive'  // 빨간색
    },
    {
      label: '내보내기',
      icon: Download,
      onClick: handleExport
    }
  ]
}
```

**UI**: `[아이콘] 더보기 ▼` → 드롭다운 메뉴

---

### 3. 토글 버튼 (Toggle)
활성/비활성 상태를 토글할 수 있는 버튼입니다.

```typescript
{
  id: '3',
  type: 'toggle',
  label: '활성화',
  icon: Power,
  isActive: false,  // 초기 상태
  onToggle: (isActive) => {
    console.log('토글됨:', isActive);
    handleToggle(isActive);
  },
  variant: 'outline'
}
```

**UI**:
- 비활성: `[아이콘] 활성화`
- 활성: `[아이콘] 활성화 ✓` (파란색 배경)

---

### 4. 텍스트 버튼 (Text)
라벨만 표시하고 배경 없는 버튼입니다.

```typescript
{
  id: '4',
  type: 'text',
  label: '취소',
  onClick: handleCancel
}
```

**UI**: `취소` (텍스트만, hover시 색상 변경)

---

### 5. 아이콘 버튼 (Icon)
아이콘만 표시하는 작은 버튼입니다.

```typescript
{
  id: '5',
  type: 'icon',
  icon: Bell,
  label: '알림',  // title 속성으로 사용
  onClick: handleNotification
}
```

**UI**: `[아이콘만]` (정사각형, 작은 크기)

---

## 사용 예제

### 예제 1: 일반 버튼 + 아이콘 버튼 조합

```typescript
import { PageHeader } from '@/components/layouts/page-header';
import { RefreshCw, Plus, Bell, Settings } from 'lucide-react';

export function UsersPage() {
  return (
    <PageHeader
      title="사용자 관리"
      description="시스템 사용자 계정을 관리합니다"
      actions={[
        {
          id: 'refresh',
          type: 'default',
          label: '새로고침',
          icon: RefreshCw,
          onClick: handleRefresh,
          variant: 'outline'
        },
        {
          id: 'add',
          type: 'default',
          label: '사용자 추가',
          icon: Plus,
          onClick: handleAdd,
          variant: 'default'
        },
        {
          id: 'notify',
          type: 'icon',
          icon: Bell,
          label: '알림',
          onClick: handleNotification
        },
        {
          id: 'settings',
          type: 'icon',
          icon: Settings,
          label: '설정',
          onClick: handleSettings
        }
      ]}
    />
  );
}
```

---

### 예제 2: 룩업 버튼 (드롭다운)

```typescript
import { PageHeader } from '@/components/layouts/page-header';
import { MoreVertical, Edit, Trash, Download } from 'lucide-react';

export function RolesPage() {
  return (
    <PageHeader
      title="역할 관리"
      description="사용자 역할을 관리합니다"
      actions={[
        {
          id: 'menu',
          type: 'lookup',
          label: '작업',
          icon: MoreVertical,
          menuItems: [
            {
              label: '편집',
              icon: Edit,
              onClick: () => handleEdit()
            },
            {
              label: '삭제',
              icon: Trash,
              onClick: () => handleDelete(),
              variant: 'destructive'
            },
            {
              label: '내보내기',
              icon: Download,
              onClick: () => handleExport()
            }
          ]
        }
      ]}
    />
  );
}
```

---

### 예제 3: 토글 버튼

```typescript
import { PageHeader } from '@/components/layouts/page-header';
import { Power } from 'lucide-react';

export function SettingsPage() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <PageHeader
      title="시스템 설정"
      description="시스템 기능을 설정합니다"
      actions={[
        {
          id: 'toggle-feature',
          type: 'toggle',
          label: '신기능 활성화',
          icon: Power,
          isActive: isEnabled,
          onToggle: (isActive) => {
            setIsEnabled(isActive);
            handleFeatureToggle(isActive);
          }
        }
      ]}
    />
  );
}
```

---

### 예제 4: 다양한 타입 조합

```typescript
import { PageHeader } from '@/components/layouts/page-header';
import {
  Plus,
  Download,
  MoreVertical,
  RefreshCw,
  Search,
  Eye,
  Edit,
  Trash
} from 'lucide-react';

export function PermissionsPage() {
  return (
    <PageHeader
      title="권한 관리"
      description="사용자 권한을 설정합니다"
      actions={[
        // 일반 버튼
        {
          id: 'add',
          type: 'default',
          label: '권한 추가',
          icon: Plus,
          onClick: handleAdd,
          variant: 'default'
        },
        // 텍스트 버튼
        {
          id: 'export',
          type: 'text',
          label: '내보내기',
          onClick: handleExport
        },
        // 아이콘 버튼
        {
          id: 'search',
          type: 'icon',
          icon: Search,
          label: '검색',
          onClick: handleSearch
        },
        // 룩업 버튼
        {
          id: 'menu',
          type: 'lookup',
          label: '추가 작업',
          icon: MoreVertical,
          menuItems: [
            { label: '보기', icon: Eye, onClick: handleView },
            { label: '편집', icon: Edit, onClick: handleEdit },
            { label: '삭제', icon: Trash, onClick: handleDelete, variant: 'destructive' }
          ]
        }
      ]}
    />
  );
}
```

---

## API 문서

### ActionButtonConfig Interface

```typescript
interface ActionButtonConfig {
  // 필수 항목
  id: string;
  // 버튼 타입 (생략 시 'default')
  type?: 'default' | 'lookup' | 'toggle' | 'text' | 'icon';

  // 표시 내용
  label?: string;              // 버튼 라벨
  icon?: LucideIcon;            // lucide-react 아이콘

  // 이벤트 핸들러
  onClick?: () => void;         // 일반/텍스트/아이콘 버튼용
  onToggle?: (isActive: boolean) => void;  // 토글 버튼용

  // 스타일
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
  size?: 'default' | 'sm' | 'lg';

  // 토글 버튼 전용
  isActive?: boolean;          // 초기 활성 상태

  // 룩업 버튼 전용
  menuItems?: LookupMenuItemConfig[];
}
```

### LookupMenuItemConfig Interface

```typescript
interface LookupMenuItemConfig {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}
```

---

## 마이그레이션 가이드

### 기존 코드 → 새 코드

#### Before
```typescript
<PageHeader
  title="사용자 관리"
  description="계정 관리"
  actions={[
    { label: '새로고침', icon: RefreshCw, onClick: handleRefresh },
    { label: '추가', icon: Plus, onClick: handleAdd }
  ]}
/>
```

#### After
```typescript
<PageHeader
  title="사용자 관리"
  description="계정 관리"
  actions={[
    {
      id: 'refresh',
      type: 'default',
      label: '새로고침',
      icon: RefreshCw,
      onClick: handleRefresh,
      variant: 'outline'
    },
    {
      id: 'add',
      type: 'default',
      label: '추가',
      icon: Plus,
      onClick: handleAdd,
      variant: 'default'
    }
  ]}
/>
```

**변경사항:**
- `id` 필드 추가 (필수) - 고유 식별자
- `type` 필드 추가 (선택) - 버튼 타입 지정

---

## 레이아웃 변경

### ButtonGroup → Flex Layout

```typescript
// Before: ButtonGroup 사용
<ButtonGroup>
  <Button>...</Button>
  <Button>...</Button>
</ButtonGroup>

// After: Flex 레이아웃
<div className="flex items-center gap-2">
  <ActionButton action={...} />
  <ActionButton action={...} />
</div>
```

**장점:**
- ✅ 더 유연한 레이아웃
- ✅ 다양한 버튼 타입 지원
- ✅ 개별 버튼 스타일 조절 가능
- ✅ 드롭다운 메뉴 통합

---

## 특징

| 특징 | 설명 |
|------|------|
| **5가지 버튼 타입** | default, lookup, toggle, text, icon |
| **드롭다운 메뉴** | 룩업 버튼으로 팝업 메뉴 지원 |
| **토글 상태** | 활성/비활성 버튼 지원 |
| **아이콘 통합** | lucide-react 아이콘 완벽 지원 |
| **유연한 크기** | sm, default, lg 크기 선택 |
| **Variant 지원** | default, outline, ghost, secondary, destructive |
| **자동 Title** | label을 title 속성으로 자동 설정 |
| **반응형 간격** | gap-2로 일관된 간격 유지 |

---

## 체크리스트

- ✅ ButtonGroup import 제거
- ✅ DropdownMenu import 추가
- ✅ 5가지 버튼 타입 구현
- ✅ ActionButton 컴포넌트 분리
- ✅ 토글 상태 관리 (useState)
- ✅ 레이아웃 변경 (flex gap-2)
- ✅ 완벽한 문서화
- ✅ 다양한 예제 제공

---

## 요약

| 항목 | 내용 |
|------|------|
| **파일** | `/home/itjee/workspace/cxg/apps/manager-web/src/components/layouts/page-header.tsx` |
| **변경 타입** | 리팩토링 & 기능 확장 |
| **ButtonGroup** | ❌ 제거 |
| **개별 버튼** | ✅ 추가 |
| **버튼 타입** | 5가지 (default, lookup, toggle, text, icon) |
| **상태** | ✅ 완료 |

