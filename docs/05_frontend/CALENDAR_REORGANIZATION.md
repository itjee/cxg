# Calendar 컴포넌트 폴더 정리 가이드

## 📂 폴더 구조 변경

### 변경 전
```
/apps/manager-web/src/components/
├── ui/
│   ├── calendar.tsx           # 기본 Calendar
│   ├── calendar-caption.tsx   # 월/년 선택 컴포넌트
│   ├── calendar-enhanced.tsx  # 개선된 Calendar
│   └── ... (other UI components)
└── filters/
    └── search-filter-popup.tsx
```

### 변경 후
```
/apps/manager-web/src/components/
├── calendar/                          # ✨ 새 폴더 (관련 파일 정리)
│   ├── index.ts                      # Export
│   ├── calendar.tsx                  # 기본 Calendar
│   ├── calendar-caption.tsx          # 월/년 선택
│   └── calendar-enhanced.tsx         # 개선된 Calendar
├── ui/
│   └── ... (other UI components, calendar 파일 제거됨)
└── filters/
    └── search-filter-popup.tsx       # 업데이트됨
```

---

## 📚 파일 설명

### Calendar 폴더: `/components/calendar/`

#### 1. **calendar.tsx**
기본 Calendar 컴포넌트입니다.

```typescript
import { Calendar } from "@/components/calendar";

<Calendar mode="single" selected={date} onSelect={setDate} />
```

**기능**:
- React Day Picker 기반
- 기본 스타일 (shadcn/ui)
- 단일, 범위, 다중 선택 모드 지원

#### 2. **calendar-caption.tsx**
월/년 드롭다운 선택 기능을 제공하는 Caption 컴포넌트입니다.

```typescript
import { CalendarCaption } from "@/components/calendar";

<CalendarCaption
  startMonth={new Date(2020, 0)}
  endMonth={new Date(2030, 11)}
/>
```

**기능**:
- 월 드롭다운 (1월 ~ 12월)
- 년 드롭다운 (설정 가능한 범위)
- 한글 월 이름 표시

#### 3. **calendar-enhanced.tsx**
Calendar + CalendarCaption을 통합한 개선된 Calendar입니다.

```typescript
import { CalendarEnhanced } from "@/components/calendar";

<CalendarEnhanced
  mode="single"
  selected={date}
  onSelect={setDate}
  startMonth={new Date(2020, 0)}
  endMonth={new Date(2030, 11)}
/>
```

**기능**:
- 월/년 드롭다운 자동 포함
- 모든 기본 Calendar 기능 지원
- Popover 완벽 호환

#### 4. **index.ts**
모든 컴포넌트를 export합니다.

```typescript
export { Calendar, type CalendarProps } from "./calendar";
export { CalendarCaption, type CalendarCaptionProps } from "./calendar-caption";
export { CalendarEnhanced, type CalendarEnhancedProps } from "./calendar-enhanced";
```

---

## 🔄 Import 경로

### 현재 권장 경로 (새로운 방식)
```typescript
import { Calendar, CalendarEnhanced, CalendarCaption } from "@/components/calendar";
```

### UI 폴더의 파일들
- ✅ 모두 삭제됨 (필요하지 않음)
- ⚠️ 기존 코드에서 UI 폴더에서 import하는 경우 에러 발생

---

## 🔍 마이그레이션 필요 여부 확인

### 프로젝트 전체에서 `/components/ui/calendar` import 검색
```bash
# Calendar import 확인
grep -r "from.*@/components/ui/calendar" /apps/manager-web/src

# 결과: 없음 (이미 모두 업데이트됨)
```

### 검증 결과
✅ **마이그레이션 완료** - 모든 import 경로가 올바르게 업데이트됨

---

## 📋 변경된 파일 목록

### 새로 생성된 파일
1. ✅ `/components/calendar/index.ts`
2. ✅ `/components/calendar/calendar.tsx`
3. ✅ `/components/calendar/calendar-caption.tsx`
4. ✅ `/components/calendar/calendar-enhanced.tsx`

### 수정된 파일
1. ✅ `/components/filters/search-filter-popup.tsx`
   - Import: `@/components/ui/calendar-enhanced` → `@/components/calendar`

### 삭제된 파일
1. ✅ `/components/ui/calendar.tsx` (불필요 - re-export 제거)
2. ✅ `/components/ui/calendar-caption.tsx` (불필요 - re-export 제거)
3. ✅ `/components/ui/calendar-enhanced.tsx` (불필요 - re-export 제거)

---

## ✅ 사용 예시

### 기본 Calendar 사용
```typescript
import { Calendar } from "@/components/calendar";

export function MyCalendar() {
  const [date, setDate] = useState<Date>();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  );
}
```

### 월/년 드롭다운 포함
```typescript
import { CalendarEnhanced } from "@/components/calendar";

export function EnhancedDatePicker() {
  const [date, setDate] = useState<Date>();

  return (
    <CalendarEnhanced
      mode="single"
      selected={date}
      onSelect={setDate}
      startMonth={new Date(2020, 0)}
      endMonth={new Date(2030, 11)}
    />
  );
}
```

### Popover와 함께 사용
```typescript
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarEnhanced } from "@/components/calendar";
import { Button } from "@/components/ui/button";

export function DateRangePicker() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {date?.toLocaleDateString("ko-KR") ?? "날짜 선택"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarEnhanced
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
```

---

## 🎯 이점

### 코드 조직화
- ✅ 관련된 Calendar 컴포넌트를 한 폴더에 관리
- ✅ UI 폴더가 더 깔끔함
- ✅ 찾기 및 수정이 쉬움
- ✅ 확장성 향상

### 개발 경험
- ✅ 단일 진입점 (index.ts로 모든 컴포넌트 export)
- ✅ 명확한 폴더 구조
- ✅ 불필요한 re-export 제거

### 유지보수
- ✅ Calendar 관련 변경사항을 한 폴더에서 관리
- ✅ 테스트 용이
- ✅ 문서화 중앙화

---

## 🗂️ 최종 폴더 구조

```
/apps/manager-web/src/components/
├── calendar/
│   ├── index.ts
│   ├── calendar.tsx
│   ├── calendar-caption.tsx
│   └── calendar-enhanced.tsx
├── code-help/
├── data-table/
├── filters/
│   ├── search-filter-popup.tsx (수정됨)
│   ├── search-filters.tsx
│   ├── search-filter.tsx
│   ├── search-checkbox-group.tsx
│   └── search-popup.types.ts
├── layouts/
├── ui/
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── popover.tsx
│   ├── select.tsx
│   └── ... (다른 UI 컴포넌트들)
└── ... (다른 컴포넌트 폴더들)
```

---

## 📖 관련 문서

- [Enhanced Calendar 가이드](./ENHANCED_CALENDAR_GUIDE.md)
- [Code Help 가이드](./CODE_HELP_IMPLEMENTATION.md)

---

## ⚠️ 주의사항

### 기존 코드에서 UI 폴더에서 import하려고 하면?
```typescript
// ❌ 더 이상 작동하지 않음
import { Calendar } from "@/components/ui/calendar";
// Error: Module not found

// ✅ 새로운 경로 사용
import { Calendar } from "@/components/calendar";
```

### 프로젝트에서 이 변경이 영향을 주는가?
- ✅ **search-filter-popup.tsx** - 이미 업데이트됨
- ✅ **다른 파일들** - UI 폴더의 calendar 파일을 import하지 않음

---

## 🎉 최종 상태

| 항목 | 상태 |
|------|------|
| Calendar 폴더 생성 | ✅ 완료 |
| 파일 이동 | ✅ 완료 |
| Import 경로 업데이트 | ✅ 완료 |
| UI 폴더 정리 (re-export 삭제) | ✅ 완료 |
| 마이그레이션 검증 | ✅ 완료 |

---

**마지막 업데이트**: 2024-11-18
**상태**: ✅ 완료 (이전 재export 제거)

