'use client';
import { useState } from 'react';
import { AdSpot, Placement } from '@/lib/types';
import { useAdSpots } from '@/hooks/useAdSpots';
import PlacementFilter from './PlacementFilter';
import SearchInput from './SearchInput';
import AdSpotCard from './AdSpotCard';
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';
import { Button, Card, CardBody } from '@heroui/react';
import { Plus, Filter, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  initialData: AdSpot[];
};

export default function AdSpotList({ initialData }: Props) {
  const [placement, setPlacement] = useState<Placement | undefined>();
  const [search, setSearch] = useState('');
  const { theme, toggleTheme } = useTheme();

  const { adSpots, isLoading, isValidating, error } = useAdSpots(
    { placement, search: search || undefined },
    initialData
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Card className="p-12 text-center bg-card border-border/60 border-dashed">
          <CardBody>
            <p className="text-danger-900 font-medium">
              Error al cargar AdSpots
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur-lg sticky top-0 z-10 shadow-xl">
        <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-(family-name:--font-display) text-foreground">
                AdSpots
              </h1>
              <p className="text-muted-foreground mt-1 text-sm lg:text-base leading-relaxed">
                Gestiona tus espacios publicitarios
              </p>
            </div>
            <div className="flex items-center gap-3">
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
              <Button
                as={Link}
                href="/adspots/new"
                size="lg"
                style={{ background: 'var(--gradient-primary)' }}
                className="text-white shadow-lg hover:shadow-2xl hover:shadow-primary/50 transition-shadow duration-300 gap-2.5 rounded-full px-8 font-semibold"
              >
                <Plus className="h-5 w-5" />
                Crear AdSpot
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-6">
        {/* Filters Section */}
        <Card className="p-5 lg:p-6 mb-6 bg-card border-border shadow-lg rounded-2xl relative">
          {isValidating && (
            <div className="absolute top-3 right-3">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
            </div>
          )}

          {/* Single row layout */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center">
            {/* Search - more compact */}
            <div className="lg:w-80">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground font-(family-name:--font-display)">
                  Buscar por título
                </h2>
              </div>
              <SearchInput value={search} onChange={setSearch} />
            </div>

            {/* Location Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground font-(family-name:--font-display)">
                  Filtrar por ubicación
                </h2>
              </div>
              <PlacementFilter value={placement} onChange={setPlacement} />
            </div>
          </div>
        </Card>

        {/* Loading - Solo en carga inicial */}
        {isLoading && <Spinner />}

        {/* Empty State */}
        {!isLoading && adSpots.length === 0 && (
          <Card className="p-8 lg:p-12 text-center bg-card border-border border-dashed rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 font-(family-name:--font-display)">
                  No se encontraron resultados
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Intenta ajustar tus filtros o búsqueda
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Ad Spots Grid */}
        {!isLoading && adSpots.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 transition-opacity duration-200 ${isValidating ? 'opacity-60' : 'opacity-100'}`}>
            {adSpots.map((adSpot) => (
              <AdSpotCard key={adSpot.id} adSpot={adSpot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
