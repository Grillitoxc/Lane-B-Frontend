import { NextRequest, NextResponse } from 'next/server';
import { adSpotStore } from '@/lib/adspot-store';
import { createAdSpotSchema } from '@/lib/validations';
import { Placement } from '@/lib/types';
import { isAdSpotEligible } from '@/lib/date-utils';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placement = searchParams.get('placement');
    const search = searchParams.get('search');
    const includeExpired = searchParams.get('includeExpired') === 'true';

    // Validar placement si existe
    if (placement && !Object.values(Placement).includes(placement as Placement)) {
      return NextResponse.json(
        { error: 'Invalid placement value', code: 'INVALID_QUERY' },
        { status: 400 }
      );
    }

    let adSpots = adSpotStore.list();

    // Filtrar por placement
    if (placement) {
      adSpots = adSpots.filter((ad) => ad.placement === placement);
    }

    // Filtrar por búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      adSpots = adSpots.filter((ad) => ad.title.toLowerCase().includes(searchLower));
    }

    // Filtrar expirados
    if (!includeExpired) {
      adSpots = adSpots.filter((ad) => isAdSpotEligible(ad));
    }

    return NextResponse.json({
      adSpots,
      total: adSpots.length
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createAdSpotSchema.parse(body);

    const adSpot = adSpotStore.create(data);

    return NextResponse.json({ adSpot }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: fieldErrors
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
