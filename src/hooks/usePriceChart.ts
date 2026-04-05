import { useState, useEffect, useCallback } from 'react';
import { fetchPriceHistory } from '../services/coingecko';
import { formatTimestamp } from '../utils/format';
import type { TimeRange } from '../types';

interface ChartPoint {
  time: string;
  price: number;
  rawTime: number;
}

export function usePriceChart(tokenId: string, range: TimeRange) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!tokenId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchPriceHistory(tokenId, range);
      const points: ChartPoint[] = result.prices.map(([ts, price]) => ({
        rawTime: ts,
        time: formatTimestamp(ts, range),
        price,
      }));
      // Sample down for performance — max 200 points
      const step = Math.max(1, Math.floor(points.length / 200));
      setData(points.filter((_, i) => i % step === 0));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [tokenId, range]);

  useEffect(() => { load(); }, [load]);

  const priceDelta = data.length >= 2
    ? data[data.length - 1].price - data[0].price
    : 0;
  const priceDeltaPercent = data.length >= 2 && data[0].price > 0
    ? (priceDelta / data[0].price) * 100
    : 0;
  const isPositive = priceDelta >= 0;

  return { data, isLoading, error, priceDelta, priceDeltaPercent, isPositive };
}
