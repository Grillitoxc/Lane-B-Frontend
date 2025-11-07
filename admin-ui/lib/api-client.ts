import {
  AdSpotFilters,
  CreateAdSpotRequest,
  CreateAdSpotResponse,
  DeactivateAdSpotResponse,
  ListAdSpotsResponse,
  ApiError as ApiErrorType,
  AdSpot,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(public response: ApiErrorType) {
    super(response.error);
  }
}

export async function fetchAdSpots(
  filters: AdSpotFilters
): Promise<ListAdSpotsResponse> {
  const params = new URLSearchParams();
  if (filters.placement) params.set('placement', filters.placement);
  if (filters.search) params.set('search', filters.search);
  params.set('status', 'active');

  const res = await fetch(`${API_BASE_URL}/adspots?${params}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createAdSpot(
  data: CreateAdSpotRequest
): Promise<CreateAdSpotResponse> {
  const res = await fetch(`${API_BASE_URL}/adspots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new ApiError(error);
  }
  const adSpot: AdSpot = await res.json();
  return { adSpot };
}

export async function deactivateAdSpot(
  id: string
): Promise<DeactivateAdSpotResponse> {
  const res = await fetch(`${API_BASE_URL}/adspots/${id}/deactivate`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new ApiError(error);
  }
  const adSpot: AdSpot = await res.json();
  return { adSpot };
}
