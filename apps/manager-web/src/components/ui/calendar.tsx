"use client";

import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "react-day-picker/style.css";
import "./calendar.css";

export type CalendarProps = DayPickerProps;

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    // selected 날짜에서 초기 month 결정
    const getInitialMonth = () => {
      const selected = (props as any).selected;
      if (selected instanceof Date) {
        return new Date(selected.getFullYear(), selected.getMonth(), 1);
      }
      return props.month || new Date();
    };

    const [displayMonth, setDisplayMonth] = React.useState(getInitialMonth());

    const currentYear = displayMonth.getFullYear();
    const currentMonthNum = displayMonth.getMonth();

    // 월 옵션 (0-11)
    const monthOptions = [
      { value: 0, label: "1월" },
      { value: 1, label: "2월" },
      { value: 2, label: "3월" },
      { value: 3, label: "4월" },
      { value: 4, label: "5월" },
      { value: 5, label: "6월" },
      { value: 6, label: "7월" },
      { value: 7, label: "8월" },
      { value: 8, label: "9월" },
      { value: 9, label: "10월" },
      { value: 10, label: "11월" },
      { value: 11, label: "12월" },
    ];

    // 연도 옵션 (현재 년도 ±10년)
    const yearOptions = Array.from({ length: 21 }, (_, i) => ({
      value: currentYear - 10 + i,
      label: String(currentYear - 10 + i),
    }));

    const handleMonthChange = React.useCallback(
      (monthStr: string) => {
        const month = parseInt(monthStr, 10);
        const newDate = new Date(currentYear, month, 1);
        setDisplayMonth(newDate);
        props.onMonthChange?.(newDate);
      },
      [currentYear, props]
    );

    const handleYearChange = React.useCallback(
      (yearStr: string) => {
        const year = parseInt(yearStr, 10);
        const newDate = new Date(year, currentMonthNum, 1);
        setDisplayMonth(newDate);
        props.onMonthChange?.(newDate);
      },
      [currentMonthNum, props]
    );

    // 이전 월로 이동
    const handlePrevMonth = React.useCallback(() => {
      const newDate = new Date(currentYear, currentMonthNum - 1, 1);
      setDisplayMonth(newDate);
      props.onMonthChange?.(newDate);
    }, [currentYear, currentMonthNum, props]);

    // 다음 월로 이동
    const handleNextMonth = React.useCallback(() => {
      const newDate = new Date(currentYear, currentMonthNum + 1, 1);
      setDisplayMonth(newDate);
      props.onMonthChange?.(newDate);
    }, [currentYear, currentMonthNum, props]);

    // 오늘 날짜로 이동 및 선택
    const handleToday = React.useCallback(() => {
      const today = new Date();
      setDisplayMonth(today);
      props.onMonthChange?.(today);
      // onSelect 콜백이 있으면 호출 (날짜 선택 처리)
      const onSelect = (props as any).onSelect;
      if (onSelect && typeof onSelect === 'function') {
        onSelect(today);
      }
    }, [props]);

    // props.month이 변경되면 displayMonth 업데이트
    React.useEffect(() => {
      if (props.month) {
        setDisplayMonth(props.month);
      }
    }, [props.month]);

    // props.selected가 변경되면 displayMonth를 선택된 날짜의 월로 업데이트
    React.useEffect(() => {
      const selected = (props as any).selected;
      if (selected instanceof Date) {
        setDisplayMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
      } else if (!selected && props.month) {
        // selected가 없으면 month를 사용
        setDisplayMonth(props.month);
      }
    }, [(props as any).selected, props.month]);

    return (
      <div ref={ref}>
        <div className="flex items-center justify-center gap-2 mb-2 px-3 py-2 border-b border-input">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-md transition-colors"
            title="이전 월"
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <Select
            value={String(currentMonthNum)}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-20 h-8" size="sm">
              <SelectValue placeholder={monthOptions[currentMonthNum]?.label} />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(currentYear)} onValueChange={handleYearChange}>
            <SelectTrigger className="w-24 h-8" size="sm">
              <SelectValue placeholder={String(currentYear)} />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-md transition-colors"
            title="다음 월"
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <DayPicker
          showOutsideDays={showOutsideDays}
          className={cn("p-2", className)}
          locale={ko}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          disabled={(date) => {
            if (typeof (props as any).disabled === 'function') {
              return (props as any).disabled(date);
            }
            return false;
          }}
          {...props}
        />
        <div className="flex justify-center border-t border-input pt-1.5 pb-1.5">
          <button
            onClick={handleToday}
            className="w-32 h-8 text-base font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
            type="button"
          >
            오늘
          </button>
        </div>
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

export { Calendar };
