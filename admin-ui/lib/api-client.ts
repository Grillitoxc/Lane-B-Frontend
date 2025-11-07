import {
  AdSpotFilters,
  CreateAdSpotRequest,
  CreateAdSpotResponse,
  DeactivateAdSpotResponse,
  ListAdSpotsResponse,
  ApiError as ApiErrorType
} from './types';

export class ApiError extends Error {
  constructor(public response: ApiErrorType) {
    super(response.error);
  }
}

export async function fetchAdSpots(filters: AdSpotFilters): Promise<ListAdSpotsResponse> {
  const params = new URLSearchParams();
  if (filters.placement) params.set('placement', filters.placement);
  if (filters.search) params.set('search', filters.search);
  if (filters.includeExpired) params.set('includeExpired', 'true');

  const res = await fetch(`/api/adspots?${params}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createAdSpot(data: CreateAdSpotRequest): Promise<CreateAdSpotResponse> {
  const res = await fetch('/api/adspots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new ApiError(error);
  }
  return res.json();
}

export async function deactivateAdSpot(id: string): Promise<DeactivateAdSpotResponse> {
  const res = await fetch(`/api/adspots/${id}/deactivate`, { method: 'PATCH' });
  if (!res.ok) {
    const error = await res.json();
    throw new ApiError(error);
  }
  return res.json();
}
