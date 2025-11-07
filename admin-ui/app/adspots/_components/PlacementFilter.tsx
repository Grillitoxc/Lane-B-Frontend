'use client';
import { Placement } from '@/lib/types';
import { Button } from '@heroui/react';

type Props = {
  value: Placement | undefined;
  onChange: (value: Placement | undefined) => void;
};

export default function PlacementFilter({ value, onChange }: Props) {
  const options = [
    { label: 'Todos', value: undefined },
    { label: 'Hero', value: Placement.HOME_HERO },
    { label: 'Sidebar', value: Placement.SIDEBAR },
    { label: 'Footer', value: Placement.FOOTER },
    { label: 'Popup', value: Placement.POPUP }
  ];

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrar por ubicación">
      {options.map((option) => (
        <Button
          key={option.label}
          variant={value === option.value ? 'solid' : 'bordered'}
          size="sm"
          onClick={() => onChange(option.value)}
          style={value === option.value ? { background: 'var(--gradient-primary)' } : undefined}
          className={
            value === option.value
              ? 'text-white shadow-lg shadow-primary/30 font-semibold rounded-full px-5 h-9 transition-colors duration-200 text-sm'
              : 'hover:bg-accent hover:text-foreground font-semibold border-border rounded-full px-5 h-9 transition-colors duration-200 text-sm text-muted-foreground'
          }
          role="radio"
          aria-checked={value === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
