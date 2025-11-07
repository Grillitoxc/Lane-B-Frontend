import { z } from 'zod';
import { Placement } from './types';

export const createAdSpotSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  imageUrl: z.string().url('Debe ser una URL válida'),
  placement: z.nativeEnum(Placement, {
    message: 'Placement inválido'
  }),
  ttlMinutes: z.number().int().positive().nullable().optional()
});

export type CreateAdSpotFormData = z.infer<typeof createAdSpotSchema>;
