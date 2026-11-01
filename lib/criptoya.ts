export const BASE_URL = 'https://criptoya.com/api';

export interface Quote {
  ask: number;
  totalAsk: number;
  bid: number;
  totalBid: number;
  time: number;
}

export interface ExchangeQuotes {
  [exchange: string]: Quote;
}

export async function fetchQuotes(coin: string, fiat: string = 'ARS', volumen: number = 100): Promise<ExchangeQuotes> {
  const url = `${BASE_URL}/${coin}/${fiat}/${volumen}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`CryptoYa error: ${res.status}`);
  return res.json();
}

export async function fetchFees(): Promise<any> {
  const res = await fetch(`${BASE_URL}/fees`, { next: { revalidate: 300 } });
  return res.json();
}

export function findArbitrage(quotes: ExchangeQuotes, minProfitPercent: number = 0.5): any[] {
  const entries = Object.entries(quotes)
    .filter(([_, q]) => q.totalAsk > 0 && q.totalBid > 0 && q.totalAsk < 1e9)
    .map(([exchange, q]) => ({ exchange, ...q }));

  if (entries.length < 2) return [];

  const sortedAsk = [...entries].sort((a, b) => a.totalAsk - b.totalAsk);
  const sortedBid = [...entries].sort((a, b) => b.totalBid - a.totalBid);

  const opportunities = [];
  for (const buy of sortedAsk.slice(0, 5)) {
    for (const sell of sortedBid.slice(0, 5)) {
      if (buy.exchange === sell.exchange) continue;
      const gross = (sell.totalBid - buy.totalAsk) / buy.totalAsk * 100;
      if (gross > minProfitPercent) {
        opportunities.push({
          buyExchange: buy.exchange,
          sellExchange: sell.exchange,
          buyPrice: buy.totalAsk,
          sellPrice: sell.totalBid,
          grossProfitPercent: Number(gross.toFixed(3)),
          timestamp: Math.max(buy.time, sell.time)
        });
      }
    }
  }
  return opportunities.sort((a, b) => b.grossProfitPercent - a.grossProfitPercent).slice(0, 10);
}