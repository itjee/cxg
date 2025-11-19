# Enhanced Calendar 구현 가이드

## 개요

**Enhanced Calendar**는 shadcn/ui의 기본 Calendar에 월/년 드롭다운 선택 기능을 추가한 개선된 버전입니다.

- **문제 해결**: 기존 calendar는 화살표로만 네비게이션 가능 (1월에서 12월까지 12번 클릭 필요)
- **솔루션**: 월/년 드롭다운으로 빠른 선택 가능
- **기술 스택**: react-day-picker v9.11.1의 CustomCaption 활용

---

## 새로 생성된 파일

### 1. CalendarCaption 컴포넌트
**파일**: `/apps/manager-web/src/components/ui/calendar-caption.tsx`

월과 년을 드롭다운으로 선택할 수 있는 Caption 컴포넌트입니다.

**주요 기능**:
- 월 드롭다운 (1월 ~ 12월)
- 년 드롭다운 (설정 가능한 범위)
- 선택 가능 범위 자동 계산 (startMonth, endMonth)
- 한글 월 표시 (1월, 2월, ...)

**Props**:
```typescript
interface CalendarCaptionProps {
  startMonth?: Date;  // 선택 가능한 시작 월 (기본값: 2020-01)
  endMonth?: Date;    // 선택 가능한 끝 월 (기본값: 2030-12)
}
```

### 2. CalendarEnhanced 컴포넌트
**파일**: `/apps/manager-web/src/components/ui/calendar-enhanced.tsx`

기본 Calendar에 CalendarCaption을 통합한 컴포넌트입니다.

**주요 기능**:
- 모든 기본 Calendar 기능 지원 (mode: single, range, multiple)
- Caption 자동 교체
- 월/년 네비게이션 자동 처리

**Props**:
```typescript
export type CalendarEnhancedProps = React.ComponentProps<typeof DayPicker> & {
  startMonth?: Date;              // 선택 가능한 시작 월
  endMonth?: Date;                // 선택 가능한 끝 월
  enableMonthYearSelect?: boolean; // 월/년 드롭다운 활성화 (기본값: true)
};
```

---

## 사용 방법

### 기본 사용

```typescript
import { CalendarEnhanced } from "@/components/ui/calendar-enhanced";

export function MyCalendar() {
  const [date, setDate] = useState<Date>();

  return (
    <CalendarEnhanced
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  );
}
```

### Popover와 함께 사용

```typescript
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarEnhanced } from "@/components/ui/calendar-enhanced";
import { Button } from "@/components/ui/button";

export function DatePicker() {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {date ? date.toLocaleDateString("ko-KR") : "날짜 선택"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarEnhanced
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            setOpen(false); // 날짜 선택 후 자동 닫힘
          }}
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2030, 11)}
        />
      </PopoverContent>
    </Popover>
  );
}
```

### 날짜 범위 선택

```typescript
interface DateRange {
  from?: Date;
  to?: Date;
}

export function DateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>();

  return (
    <CalendarEnhanced
      mode="range"
      selected={dateRange}
      onSelect={setDateRange}
      startMonth={new Date(2020, 0)}
      endMonth={new Date(2030, 11)}
    />
  );
}
```

### Search Filter Popup 통합 (이미 적용됨)

```typescript
// search-filter-popup.tsx에서 사용 중
<CalendarEnhanced
  mode="single"
  selected={selectedDate}
  onSelect={(date) => {
    // 날짜 업데이트
    setOpenFromPopover(false); // 팝업 자동 닫힘
  }}
  startMonth={new Date(2020, 0)}
  endMonth={new Date(2030, 11)}
  enableMonthYearSelect
/>
```

---

## Props 상세

### CalendarEnhanced Props

모든 `react-day-picker`의 DayPicker Props를 지원하며, 다음 추가 Props 제공:

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `startMonth` | `Date` | `2020-01-01` | 선택 가능한 시작 월 |
| `endMonth` | `Date` | `2030-12-31` | 선택 가능한 끝 월 |
| `enableMonthYearSelect` | `boolean` | `true` | 월/년 드롭다운 활성화 |
| `mode` | `"single"` \| `"range"` \| `"multiple"` | - | 날짜 선택 모드 |
| `selected` | `Date` \| `DateRange` \| `Date[]` | - | 선택된 날짜 |
| `onSelect` | `(date: Date \| DateRange \| Date[]) => void` | - | 날짜 선택 콜백 |

---

## 기능 비교

### 기본 Calendar vs Enhanced Calendar

| 기능 | 기본 Calendar | Enhanced Calendar |
|------|--------------|-------------------|
| 화살표 네비게이션 | ✅ | ✅ |
| 월 드롭다운 | ❌ | ✅ |
| 년 드롭다운 | ❌ | ✅ |
| 빠른 선택 | ❌ | ✅ |
| 다중 선택 모드 | ✅ | ✅ |
| 범위 선택 모드 | ✅ | ✅ |
| 커스텀 스타일링 | ✅ | ✅ |

---

## 사용 시나리오

### 시나리오 1: 빠른 날짜 선택
**이전**: 2025년 5월을 선택하려면 현재 월부터 17번 클릭
**이후**: 년 드롭다운 → 2025선택 → 월 드롭다운 → 5월 선택 (3번 클릭)

### 시나리오 2: 과거 날짜 검색
**이전**: 2020년 1월 날짜를 찾으려면 60번 이상 클릭
**이후**: 년 드롭다운에서 2020 선택 → 월 드롭다운에서 1월 선택 (2번 클릭)

### 시나리오 3: 범위 필터링
**이전**: From: 2023-01, To: 2024-12 선택 시 너무 많은 클릭 필요
**이후**: 드롭다운으로 빠르게 범위 설정

---

## 기술 세부사항

### react-day-picker CustomCaption 활용

```typescript
// DayPicker의 useDayPicker() Hook 사용
const { month, onMonthChange } = useDayPicker();

// month 변경
const newDate = new Date(year, monthIndex, 1);
onMonthChange?.(newDate);
```

### Radix UI Select 통합

```typescript
// 기존 shadcn/ui 컴포넌트와 일관성 유지
<Select
  value={currentMonth.toString()}
  onValueChange={(value) => handleMonthChange(Number(value))}
>
  <SelectTrigger className="w-28">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {/* 옵션 렌더링 */}
  </SelectContent>
</Select>
```

### 선택 가능 범위 자동 계산

```typescript
// startMonth, endMonth 기준으로 자동 계산
const availableMonths = MONTHS.map((monthName, monthIndex) => {
  const isDisabled =
    (currentYear === startMonth.getFullYear() && monthIndex < startMonth.getMonth()) ||
    (currentYear === endMonth.getFullYear() && monthIndex > endMonth.getMonth());
  return { label: monthName, value: monthIndex, disabled: isDisabled };
});
```

---

## 확장 방법

### 1. 언어 변경

```typescript
// calendar-caption.tsx의 MONTHS 상수 변경
const MONTHS = [
  "January", "February", "March", // 영문 월 이름
  // ...
];
```

### 2. 년 범위 동적 설정

```typescript
// Props로 전달
<CalendarEnhanced
  startMonth={customStartDate}
  endMonth={customEndDate}
/>
```

### 3. 커스텀 Caption 만들기

```typescript
// 다른 형식의 Caption을 원하면 CalendarCaption을 복사해서 커스터마이징
export function CustomCaption() {
  const { month, onMonthChange } = useDayPicker();
  // 커스텀 UI 구현
}

// CalendarEnhanced에 적용
<CalendarEnhanced
  components={{
    Caption: CustomCaption,
  }}
/>
```

---

## 성능

### 번들 크기 증가
- `calendar-caption.tsx`: ~2KB
- `calendar-enhanced.tsx`: ~3KB
- 총: ~5KB (gzip)

### 렌더링 성능
- react-day-picker 기반이므로 최적화됨
- 드롭다운 메뉴는 필요시에만 렌더링
- 메모이제이션 자동 처리

---

## 트러블슈팅

### 문제: 월/년 드롭다운이 보이지 않음

```typescript
// ❌ 잘못된 사용
<CalendarEnhanced enableMonthYearSelect={false} />

// ✅ 올바른 사용
<CalendarEnhanced enableMonthYearSelect={true} />
// 또는
<CalendarEnhanced /> {/* 기본값이 true */}
```

### 문제: 선택 가능한 년이 제한됨

```typescript
// startMonth, endMonth 범위 확장
<CalendarEnhanced
  startMonth={new Date(1990, 0)}  // 1990년부터
  endMonth={new Date(2050, 11)}   // 2050년까지
/>
```

### 문제: Popover가 자동으로 닫히지 않음

```typescript
// ✅ onSelect에서 Popover 상태 변경
onSelect={(date) => {
  setDate(date);
  setOpen(false); // 자동 닫힘 추가
}}
```

---

## 마이그레이션 가이드

### 기존 Calendar를 CalendarEnhanced로 변경

```typescript
// Before
import { Calendar } from "@/components/ui/calendar";
<Calendar mode="single" selected={date} onSelect={setDate} />

// After
import { CalendarEnhanced } from "@/components/ui/calendar-enhanced";
<CalendarEnhanced mode="single" selected={date} onSelect={setDate} />
```

### 점진적 마이그레이션

1. 새로운 날짜 선택 UI부터 CalendarEnhanced 사용
2. 기존 Calendar 사용처를 천천히 교체
3. 기본 Calendar는 필요시 유지 (다른 용도)

---

## 파일 목록

### 생성된 파일
1. `/apps/manager-web/src/components/ui/calendar-caption.tsx` (월/년 선택 컴포넌트)
2. `/apps/manager-web/src/components/ui/calendar-enhanced.tsx` (메인 컴포넌트)

### 수정된 파일
1. `/apps/manager-web/src/components/filters/search-filter-popup.tsx` (CalendarEnhanced 적용)

---

## 다음 단계

1. ✅ Enhanced Calendar 구현 완료
2. ✅ Search Filter Popup에 적용 완료
3. ⬜ 다른 날짜 선택 UI에도 적용 (선택사항)
4. ⬜ 여러 개월 동시 표시 기능 (선택사항)

---

## 참고 자료

- [react-day-picker 문서](https://react-day-picker.js.org/)
- [date-fns 문서](https://date-fns.org/)
- [shadcn/ui Calendar](https://ui.shadcn.com/docs/components/calendar)

