'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAdSpot } from '@/lib/api-client';
import { createAdSpotSchema } from '@/lib/validations';
import { useToast } from '@/hooks/useToast';
import { Placement } from '@/lib/types';
import {
  Input,
  Select,
  SelectItem,
  Button,
  Card,
  CardBody,
} from '@heroui/react';

export default function AdSpotForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const ttlValue = formData.get('ttlMinutes');
    const data = {
      title: formData.get('title') as string,
      imageUrl: formData.get('imageUrl') as string,
      placement: formData.get('placement') as Placement,
      ttlMinutes: ttlValue ? parseInt(ttlValue as string, 10) : null,
    };

    const result = createAdSpotSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] ?? ''])
        )
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createAdSpot(result.data);
      showToast('AdSpot creado exitosamente', 'success');
      router.push('/adspots');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Error al crear AdSpot',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-card border-border shadow-xl rounded-2xl">
      <CardBody className="p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Título"
            name="title"
            placeholder="Ej: Promo Verano 2025"
            size="lg"
            isRequired
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            classNames={{
              label:
                'font-semibold text-foreground font-[family-name:var(--font-display)]',
              inputWrapper:
                'bg-muted border-border focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary',
              input: 'text-foreground placeholder:text-muted-foreground'
            }}
          />

          <Input
            label="URL de imagen"
            name="imageUrl"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            size="lg"
            isRequired
            isInvalid={!!errors.imageUrl}
            errorMessage={errors.imageUrl}
            classNames={{
              label:
                'font-semibold text-foreground font-[family-name:var(--font-display)]',
              inputWrapper:
                'bg-muted border-border focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary',
              input: 'text-foreground placeholder:text-muted-foreground'
            }}
          />

          <Select
            label="Ubicación"
            name="placement"
            placeholder="Seleccionar ubicación"
            size="lg"
            isRequired
            isInvalid={!!errors.placement}
            errorMessage={errors.placement}
            classNames={{
              label:
                'font-semibold text-foreground font-[family-name:var(--font-display)]',
              trigger:
                'bg-muted border-border focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary',
              value: 'text-foreground'
            }}
          >
            {Object.values(Placement).map((p) => (
              <SelectItem key={p}>{p.replace('_', ' ')}</SelectItem>
            ))}
          </Select>

          <Input
            label="TTL (minutos)"
            name="ttlMinutes"
            type="number"
            placeholder="Ej: 60"
            size="lg"
            min="1"
            step="1"
            isInvalid={!!errors.ttlMinutes}
            errorMessage={errors.ttlMinutes}
            description="Opcional: tiempo de vida del AdSpot en minutos"
            classNames={{
              label:
                'font-semibold text-foreground font-[family-name:var(--font-display)]',
              inputWrapper:
                'bg-muted border-border focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary',
              input: 'text-foreground placeholder:text-muted-foreground'
            }}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              size="lg"
              style={{ background: 'var(--gradient-primary)' }}
              className="flex-1 text-white shadow-lg hover:shadow-2xl hover:shadow-primary/50 transition-shadow duration-300 font-semibold rounded-full h-12"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear AdSpot'}
            </Button>
            <Button
              type="button"
              variant="bordered"
              size="lg"
              className="flex-1 border-border hover:bg-accent hover:text-foreground transition-colors duration-300 font-semibold rounded-full h-12 text-muted-foreground"
              onPress={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
