"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: "search" | "select";
  placeholder?: string;
  options?: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
}

interface SearchFilterProps {
  fields: FilterField[];
  defaultExpanded?: boolean;
}

export function SearchFilter({ fields, defaultExpanded = true }: SearchFilterProps) {
  const [filterExpanded, setFilterExpanded] = useState(defaultExpanded);

  return (
    <div>
      {/* 필터 헤더 */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-medium text-foreground">검색필터</span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <button
          onClick={() => setFilterExpanded(!filterExpanded)}
          className="ml-4 p-1 hover:bg-accent rounded-md transition-colors"
          title={filterExpanded ? "필터 숨기기" : "필터 보이기"}
        >
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform ${
              filterExpanded ? "" : "-rotate-90"
            }`}
          />
        </button>
      </div>

      {/* 필터 컨텐츠 */}
      {filterExpanded && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {field.label}
                </label>
                {field.type === "search" ? (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="pl-10 bg-background border-input"
                    />
                  </div>
                ) : (
                  <Select
                    value={field.value || "all"}
                    onValueChange={(value) => field.onChange(value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 {field.label}</SelectItem>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
