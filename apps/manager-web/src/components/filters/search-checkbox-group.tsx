/**
 * @file checkbox-group.tsx
 * @description 체크박스 그룹 컴포넌트
 *
 * 멀티 선택을 지원하는 체크박스 목록
 */

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FilterOption } from "./search-popup.types";

interface CheckboxGroupProps {
  options: FilterOption[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
}

export function CheckboxGroup({
  options,
  selectedValues,
  onValuesChange,
}: CheckboxGroupProps) {
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      // 추가
      onValuesChange([...selectedValues, value]);
    } else {
      // 제거
      onValuesChange(selectedValues.filter((v) => v !== value));
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={`checkbox-${option.value}`}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(checked) =>
              handleChange(option.value, checked as boolean)
            }
          />
          <Label
            htmlFor={`checkbox-${option.value}`}
            className="text-sm font-normal cursor-pointer flex-1"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
