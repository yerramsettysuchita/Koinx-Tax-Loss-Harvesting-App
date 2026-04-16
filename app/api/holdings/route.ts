import { type NextRequest } from 'next/server';
import { mockHoldingsRaw } from '@/data/mockHoldings';

export async function GET(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 300));

  if (request.nextUrl.searchParams.get('simulate') === 'error') {
    return Response.json(
      { error: 'Simulated server error — holdings unavailable' },
      { status: 500 }
    );
  }

  return Response.json(mockHoldingsRaw);
}
