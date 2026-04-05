import type { Token, GlobalMarket, OHLCPoint, TimeRange } from '../types';

const BASE = 'https://api.coingecko.com/api/v3';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`CoinGecko ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchTopTokens(page = 1, perPage = 50): Promise<Token[]> {
  return get<Token[]>(
    `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d`,
  );
}

export async function fetchGlobalMarket(): Promise<{ data: GlobalMarket }> {
  return get<{ data: GlobalMarket }>('/global');
}

export async function fetchTokenById(id: string): Promise<Token> {
  return get<Token>(
    `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
  );
}

const DAYS_MAP: Record<TimeRange, string> = {
  '1D': '1',
  '7D': '7',
  '30D': '30',
  '90D': '90',
  '1Y': '365',
};

export async function fetchPriceHistory(
  id: string,
  range: TimeRange,
): Promise<{ prices: [number, number][] }> {
  const days = DAYS_MAP[range];
  return get<{ prices: [number, number][] }>(
    `/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
  );
}

export async function fetchOHLC(id: string, range: TimeRange): Promise<number[][]> {
  const days = DAYS_MAP[range];
  return get<number[][]>(`/coins/${id}/ohlc?vs_currency=usd&days=${days}`);
}

export async function searchTokens(query: string): Promise<{
  coins: { id: string; name: string; symbol: string; thumb: string }[];
}> {
  return get(`/search?query=${encodeURIComponent(query)}`);
}

export async function fetchTrending(): Promise<{
  coins: { item: { id: string; name: string; symbol: string; thumb: string; price_btc: number } }[];
}> {
  return get('/search/trending');
}
