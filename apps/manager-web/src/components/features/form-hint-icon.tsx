/**
 * FormHintIcon
 * 필드 설명을 표시하는 공통 힌트 아이콘 컴포넌트
 */

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormHintIconProps {
  hint: string;
}

export function FormHintIcon({ hint }: FormHintIconProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center w-4 h-4 ml-1 text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 text-sm p-2">{hint}</PopoverContent>
    </Popover>
  );
}
