import { type NextRequest } from 'next/server';
import { mockCapitalGains } from '@/data/mockCapitalGains';

export async function GET(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 300));

  if (request.nextUrl.searchParams.get('simulate') === 'error') {
    return Response.json(
      { error: 'Simulated server error — capital gains unavailable' },
      { status: 500 }
    );
  }

  // Return exact shape from assignment spec
  return Response.json({ capitalGains: mockCapitalGains });
}
