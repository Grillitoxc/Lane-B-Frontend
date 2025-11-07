import { Spinner as HeroSpinner } from '@heroui/react';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center p-8" role="status">
      <HeroSpinner size="lg" color="primary" label="Cargando..." />
    </div>
  );
}
