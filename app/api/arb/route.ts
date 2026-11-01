import { NextResponse } from 'next/server';
import { fetchQuotes, findArbitrage } from '@/lib/criptoya';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const coin = searchParams.get('coin') || 'USDT';
  const minProfit = Number(searchParams.get('min') || '0.3');

  try {
    const quotes = await fetchQuotes(coin, 'ARS', 100);
    const opps = findArbitrage(quotes, minProfit);
    return NextResponse.json({ coin, opportunities: opps, fetchedAt: Date.now() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}