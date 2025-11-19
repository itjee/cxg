"use client";

import { memo } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COLOR_PALETTES, PALETTE_INFO, getGroupedPalettes, type ColorPalette } from '@/lib/constants/colors';

interface ColorPalettePickerProps {
  selected: ColorPalette;
  onSelect: (palette: ColorPalette) => void;
}

interface PaletteCardProps {
  palette: ColorPalette;
  selected: boolean;
  onClick: () => void;
}

const PaletteCard = memo(function PaletteCard({ palette, selected, onClick }: PaletteCardProps) {
  const colors = COLOR_PALETTES[palette];
  const info = PALETTE_INFO[palette];

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-2 p-3 rounded-lg border-2 transition-all",
        "hover:shadow-md hover:scale-105",
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      {/* 선택 체크 */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      {/* 색상 그라데이션 프리뷰 */}
      <div className="flex h-16 rounded-md overflow-hidden shadow-sm border border-border/50">
        <div style={{ background: colors['400'] }} className="flex-1" />
        <div style={{ background: colors['500'] }} className="flex-1" />
        <div style={{ background: colors['600'] }} className="flex-1" />
        <div style={{ background: colors['700'] }} className="flex-1" />
        <div style={{ background: colors['800'] }} className="flex-1" />
      </div>

      {/* 팔레트 정보 */}
      <div className="text-left">
        <p className={cn(
          "text-base font-medium transition-colors",
          selected ? "text-primary" : "text-foreground"
        )}>
          {info.label}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {info.description}
        </p>
      </div>
    </button>
  );
});

export function ColorPalettePicker({ selected, onSelect }: ColorPalettePickerProps) {
  const grouped = getGroupedPalettes();

  return (
    <div className="space-y-6">
      {/* Neutral */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-neutral-400 rounded-full" />
          Neutral
          <span className="text-sm text-muted-foreground font-normal">무채색</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {grouped.neutral.map((info) => (
            <PaletteCard
              key={info.name}
              palette={info.name}
              selected={selected === info.name}
              onClick={() => onSelect(info.name)}
            />
          ))}
        </div>
      </div>

      {/* Warm */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-orange-500 rounded-full" />
          Warm
          <span className="text-sm text-muted-foreground font-normal">따뜻한 색</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {grouped.warm.map((info) => (
            <PaletteCard
              key={info.name}
              palette={info.name}
              selected={selected === info.name}
              onClick={() => onSelect(info.name)}
            />
          ))}
        </div>
      </div>

      {/* Cool */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-cyan-500 rounded-full" />
          Cool
          <span className="text-sm text-muted-foreground font-normal">시원한 색</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {grouped.cool.map((info) => (
            <PaletteCard
              key={info.name}
              palette={info.name}
              selected={selected === info.name}
              onClick={() => onSelect(info.name)}
            />
          ))}
        </div>
      </div>

      {/* Vibrant */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-violet-600 rounded-full" />
          Vibrant
          <span className="text-sm text-muted-foreground font-normal">선명한 색</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {grouped.vibrant.map((info) => (
            <PaletteCard
              key={info.name}
              palette={info.name}
              selected={selected === info.name}
              onClick={() => onSelect(info.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
