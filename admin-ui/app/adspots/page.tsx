import { Metadata } from 'next';
import { ListAdSpotsResponse } from '@/lib/types';
import AdSpotList from './_components/AdSpotList';

export const metadata: Metadata = {
  title: 'AdSpots | Admin',
  description: 'Gestión de espacios publicitarios'
};

type Props = {
  searchParams: Promise<{ placement?: string }>;
};

export default async function AdSpotsPage({ searchParams }: Props) {
  const params = await searchParams;
  const url = new URL('http://localhost:3000/api/adspots');
  if (params.placement) {
    url.searchParams.set('placement', params.placement);
  }

  const res = await fetch(url, { cache: 'no-store' });
  const data: ListAdSpotsResponse = await res.json();

  return <AdSpotList initialData={data.adSpots} />;
}
