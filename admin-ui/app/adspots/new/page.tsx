'use client';
import AdSpotForm from '../_components/AdSpotForm';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function NewAdSpotPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur-lg sticky top-0 z-10 shadow-xl">
        <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                as={Link}
                href="/adspots"
                variant="light"
                isIconOnly
                size="lg"
                aria-label="Volver"
                className="hover:bg-muted transition-all duration-300 rounded-full text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-[family-name:var(--font-display)] text-foreground">
                  Crear AdSpot
                </h1>
                <p className="text-muted-foreground mt-1 text-sm lg:text-base leading-relaxed">
                  Completa el formulario para crear un nuevo espacio publicitario
                </p>
              </div>
            </div>
            <Button
              isIconOnly
              variant="bordered"
              size="lg"
              onClick={toggleTheme}
              className="border-border hover:bg-accent transition-colors rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <AdSpotForm />
      </div>
    </div>
  );
}
