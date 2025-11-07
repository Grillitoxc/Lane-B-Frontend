import { v4 as uuidv4 } from 'uuid';
import { AdSpot, CreateAdSpotRequest, Placement, Status } from './types';

class AdSpotStore {
  private adSpots: Map<string, AdSpot> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    const now = new Date();
    const seeds: Omit<AdSpot, 'id'>[] = [
      {
        title: 'Promo Verano 2025',
        imageUrl: 'https://picsum.photos/seed/hero/800/400',
        placement: Placement.HOME_HERO,
        status: Status.ACTIVE,
        createdAt: now.toISOString(),
        deactivatedAt: null,
        ttlMinutes: 120
      },
      {
        title: 'Banner Sidebar',
        imageUrl: 'https://picsum.photos/seed/sidebar/300/600',
        placement: Placement.SIDEBAR,
        status: Status.ACTIVE,
        createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
        deactivatedAt: null,
        ttlMinutes: null
      },
      {
        title: 'Footer Ad',
        imageUrl: 'https://picsum.photos/seed/footer/1200/200',
        placement: Placement.FOOTER,
        status: Status.ACTIVE,
        createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // Hace 30 min (no expirado)
        deactivatedAt: null,
        ttlMinutes: 60
      },
      {
        title: 'Popup Promocional',
        imageUrl: 'https://picsum.photos/seed/popup/600/400',
        placement: Placement.POPUP,
        status: Status.ACTIVE, // Ahora activo
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        deactivatedAt: null,
        ttlMinutes: null
      }
    ];

    seeds.forEach((seed) => {
      const adSpot: AdSpot = { ...seed, id: uuidv4() };
      this.adSpots.set(adSpot.id, adSpot);
    });
  }

  list(): AdSpot[] {
    return Array.from(this.adSpots.values());
  }

  getById(id: string): AdSpot | null {
    return this.adSpots.get(id) ?? null;
  }

  create(data: CreateAdSpotRequest): AdSpot {
    const adSpot: AdSpot = {
      id: uuidv4(),
      status: Status.ACTIVE,
      createdAt: new Date().toISOString(),
      deactivatedAt: null,
      title: data.title,
      imageUrl: data.imageUrl,
      placement: data.placement,
      ttlMinutes: data.ttlMinutes ?? null
    };
    this.adSpots.set(adSpot.id, adSpot);
    return adSpot;
  }

  deactivate(id: string): AdSpot {
    const adSpot = this.adSpots.get(id);
    if (!adSpot) {
      throw new Error('NOT_FOUND');
    }
    if (adSpot.status === Status.INACTIVE) {
      throw new Error('ALREADY_INACTIVE');
    }
    adSpot.status = Status.INACTIVE;
    adSpot.deactivatedAt = new Date().toISOString();
    return adSpot;
  }
}

export const adSpotStore = new AdSpotStore();
