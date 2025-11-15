"use client";

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { COLOR_PALETTES, type ColorPalette, getGroupedPalettes } from '@/lib/constants/colors';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const grouped = getGroupedPalettes();

  const handleColorSelect = (color: string) => {
    onChange(color);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            "w-10 h-10 rounded border-2 border-border shadow-sm transition-all hover:scale-110 hover:shadow-md relative group",
            disabled && "opacity-50 cursor-not-allowed hover:scale-100"
          )}
          style={{ background: value || 'transparent' }}
        >
          {!value && (
            <Palette className="h-4 w-4 absolute inset-0 m-auto text-muted-foreground" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0" align="start">
        <Tabs defaultValue="neutral" className="w-full">
          <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
            <TabsTrigger value="neutral" className="rounded-none">Neutral</TabsTrigger>
            <TabsTrigger value="warm" className="rounded-none">Warm</TabsTrigger>
            <TabsTrigger value="cool" className="rounded-none">Cool</TabsTrigger>
            <TabsTrigger value="vibrant" className="rounded-none">Vibrant</TabsTrigger>
          </TabsList>

          {/* Neutral */}
          <TabsContent value="neutral" className="p-4 m-0 space-y-3">
            {grouped.neutral.map((paletteInfo) => (
              <ColorPaletteRow
                key={paletteInfo.name}
                palette={paletteInfo.name}
                label={paletteInfo.label}
                onSelect={handleColorSelect}
              />
            ))}
          </TabsContent>

          {/* Warm */}
          <TabsContent value="warm" className="p-4 m-0 space-y-3">
            {grouped.warm.map((paletteInfo) => (
              <ColorPaletteRow
                key={paletteInfo.name}
                palette={paletteInfo.name}
                label={paletteInfo.label}
                onSelect={handleColorSelect}
              />
            ))}
          </TabsContent>

          {/* Cool */}
          <TabsContent value="cool" className="p-4 m-0 space-y-3">
            {grouped.cool.map((paletteInfo) => (
              <ColorPaletteRow
                key={paletteInfo.name}
                palette={paletteInfo.name}
                label={paletteInfo.label}
                onSelect={handleColorSelect}
              />
            ))}
          </TabsContent>

          {/* Vibrant */}
          <TabsContent value="vibrant" className="p-4 m-0 space-y-3">
            {grouped.vibrant.map((paletteInfo) => (
              <ColorPaletteRow
                key={paletteInfo.name}
                palette={paletteInfo.name}
                label={paletteInfo.label}
                onSelect={handleColorSelect}
              />
            ))}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

interface ColorPaletteRowProps {
  palette: ColorPalette;
  label: string;
  onSelect: (color: string) => void;
}

function ColorPaletteRow({ palette, label, onSelect }: ColorPaletteRowProps) {
  const colors = COLOR_PALETTES[palette];
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground capitalize">{label}</p>
      <div className="grid grid-cols-11 gap-1">
        {shades.map((shade) => (
          <button
            key={shade}
            onClick={() => onSelect(colors[shade])}
            className="w-8 h-8 rounded border border-border/50 hover:scale-110 hover:shadow-md transition-all hover:z-10 relative group"
            style={{ background: colors[shade] }}
            title={`${palette}-${shade}: ${colors[shade]}`}
          >
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {shade}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
