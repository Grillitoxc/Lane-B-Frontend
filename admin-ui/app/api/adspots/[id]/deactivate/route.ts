import { NextRequest, NextResponse } from 'next/server';
import { adSpotStore } from '@/lib/adspot-store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const adSpot = adSpotStore.deactivate(id);

    return NextResponse.json({ adSpot });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'NOT_FOUND') {
        return NextResponse.json(
          { error: 'AdSpot not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }
      if (error.message === 'ALREADY_INACTIVE') {
        return NextResponse.json(
          { error: 'AdSpot is already inactive', code: 'ALREADY_INACTIVE' },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
