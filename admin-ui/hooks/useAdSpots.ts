'use client';
import useSWR from 'swr';
import { AdSpot, AdSpotFilters, ListAdSpotsResponse } from '@/lib/types';
import { fetchAdSpots } from '@/lib/api-client';

export function useAdSpots(filters: AdSpotFilters, initialData?: AdSpot[]) {
  const key = ['adspots', filters];

  const { data, error, mutate, isLoading, isValidating } = useSWR<ListAdSpotsResponse>(
    key,
    () => fetchAdSpots(filters),
    {
      fallbackData: initialData ? { adSpots: initialData, total: initialData.length } : undefined,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000,
      keepPreviousData: true
    }
  );

  return {
    adSpots: data?.adSpots ?? [],
    total: data?.total ?? 0,
    isLoading: isLoading && !data,
    isValidating,
    error,
    mutate
  };
}
