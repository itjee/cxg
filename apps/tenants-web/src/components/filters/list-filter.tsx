"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FilterFieldType = 'text' | 'select' | 'multiSelect' | 'dateRange' | 'date' | 'number';

export interface FilterField {
  name: string;
  type: FilterFieldType;
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  defaultValue?: any;
  validation?: (value: any) => boolean;
}

interface ListFilterProps {
  fields: FilterField[];
  defaultValues?: Record<string, any>;
  onFilter: (values: Record<string, any>) => void;
  onReset?: () => void;
  className?: string;
}

export function ListFilter({
  fields,
  defaultValues = {},
  onFilter,
  className
}: ListFilterProps) {
  const [values, setValues] = useState<Record<string, any>>(defaultValues);

  // 실시간 필터링 - 값이 변경될 때마다 자동으로 필터 적용
  useEffect(() => {
    onFilter(values);
  }, [values, onFilter]);

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={cn("", className)}>
      {/* Filter Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            {field.label && (
              <label className="text-sm font-medium text-foreground">
                {field.label}
              </label>
            )}
            
            {field.type === 'text' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={field.placeholder}
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="pl-9"
                />
              </div>
            )}

            {field.type === 'select' && (
              <Select
                value={values[field.name]?.toString() || field.options?.[0]?.value.toString() || 'all'}
                onValueChange={(value) => handleChange(field.name, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || "선택하세요"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {field.type === 'number' && (
              <Input
                type="number"
                placeholder={field.placeholder}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}

            {field.type === 'date' && (
              <Input
                type="date"
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}

            {field.type === 'dateRange' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  placeholder="시작일"
                  value={values[`${field.name}_start`] || ''}
                  onChange={(e) => handleChange(`${field.name}_start`, e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="종료일"
                  value={values[`${field.name}_end`] || ''}
                  onChange={(e) => handleChange(`${field.name}_end`, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
