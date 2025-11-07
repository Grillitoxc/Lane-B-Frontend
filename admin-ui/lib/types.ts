export enum Placement {
  HOME_HERO = 'HOME_HERO',
  SIDEBAR = 'SIDEBAR',
  FOOTER = 'FOOTER',
  POPUP = 'POPUP'
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface AdSpot {
  id: string;
  title: string;
  imageUrl: string;
  placement: Placement;
  status: Status;
  createdAt: string;
  deactivatedAt: string | null;
  ttlMinutes: number | null;
}

export interface CreateAdSpotRequest {
  title: string;
  imageUrl: string;
  placement: Placement;
  ttlMinutes?: number | null;
}

export interface CreateAdSpotResponse {
  adSpot: AdSpot;
}

export interface ListAdSpotsResponse {
  adSpots: AdSpot[];
  total: number;
}

export interface DeactivateAdSpotResponse {
  adSpot: AdSpot;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, string[]>;
}

export type AdSpotFilters = {
  placement?: Placement;
  search?: string;
};
