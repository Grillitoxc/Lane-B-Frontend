'use client';
import { useState, useEffect } from 'react';
import { Input } from '@heroui/react';
import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput({ value, onChange }: Props) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        type="text"
        placeholder="Buscar por título..."
        value={localValue}
        onValueChange={setLocalValue}
        aria-label="Buscar AdSpots"
        classNames={{
          base: 'w-full',
          inputWrapper:
            'pl-10 bg-muted border-border focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary',
          input: 'text-foreground placeholder:text-muted-foreground'
        }}
        isClearable
        onClear={() => setLocalValue('')}
      />
    </div>
  );
}
