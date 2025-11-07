import { addMinutes, parseISO, isAfter, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AdSpot, Status } from './types';

export function isAdSpotEligible(adSpot: AdSpot, now: Date = new Date()): boolean {
  if (adSpot.status === Status.INACTIVE) return false;
  if (!adSpot.ttlMinutes) return true;

  const expiresAt = addMinutes(parseISO(adSpot.createdAt), adSpot.ttlMinutes);
  return !isAfter(now, expiresAt);
}

export function getExpiresAt(adSpot: AdSpot): Date | null {
  if (!adSpot.ttlMinutes) return null;
  return addMinutes(parseISO(adSpot.createdAt), adSpot.ttlMinutes);
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
}
