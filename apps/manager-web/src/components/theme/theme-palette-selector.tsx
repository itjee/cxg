"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { COLOR_PALETTES, type ColorPalette, getGroupedPalettes } from "@/lib/constants/colors";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PaletteSelectorProps {
  value: ColorPalette;
  onChange: (palette: ColorPalette) => void;
}

export function PaletteSelector({ value, onChange }: PaletteSelectorProps) {
  const grouped = getGroupedPalettes();

  return (
    <div className="space-y-6">
      {/* Neutral Palettes */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">Neutral</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {grouped.neutral.map((paletteInfo) => (
            <PaletteCard
              key={paletteInfo.name}
              palette={paletteInfo.name}
              label={paletteInfo.label}
              selected={value === paletteInfo.name}
              onClick={() => onChange(paletteInfo.name)}
            />
          ))}
        </div>
      </div>

      {/* Warm Palettes */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">Warm</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {grouped.warm.map((paletteInfo) => (
            <PaletteCard
              key={paletteInfo.name}
              palette={paletteInfo.name}
              label={paletteInfo.label}
              selected={value === paletteInfo.name}
              onClick={() => onChange(paletteInfo.name)}
            />
          ))}
        </div>
      </div>

      {/* Cool Palettes */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">Cool</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {grouped.cool.map((paletteInfo) => (
            <PaletteCard
              key={paletteInfo.name}
              palette={paletteInfo.name}
              label={paletteInfo.label}
              selected={value === paletteInfo.name}
              onClick={() => onChange(paletteInfo.name)}
            />
          ))}
        </div>
      </div>

      {/* Vibrant Palettes */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">Vibrant</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {grouped.vibrant.map((paletteInfo) => (
            <PaletteCard
              key={paletteInfo.name}
              palette={paletteInfo.name}
              label={paletteInfo.label}
              selected={value === paletteInfo.name}
              onClick={() => onChange(paletteInfo.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PaletteCardProps {
  palette: ColorPalette;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function PaletteCard({ palette, label, selected, onClick }: PaletteCardProps) {
  const colors = COLOR_PALETTES[palette];
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-105 group",
        selected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Color Grid - 11 shades */}
        <div className="grid grid-cols-11 gap-1">
          {shades.map((shade) => (
            <div
              key={shade}
              className="aspect-square rounded border border-border/30"
              style={{ background: colors[shade] }}
              title={`${palette}-${shade}`}
            />
          ))}
        </div>

        {/* Palette Name */}
        <div className="flex items-center justify-between">
          <span className="text-base font-medium capitalize truncate">{label}</span>
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
            selected ? "border-primary bg-primary scale-110" : "border-border group-hover:border-primary/50"
          )}>
            {selected && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
