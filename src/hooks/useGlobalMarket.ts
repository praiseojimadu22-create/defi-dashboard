import { useState, useEffect } from 'react';
import { fetchGlobalMarket } from '../services/coingecko';
import type { GlobalMarket } from '../types';

export function useGlobalMarket() {
  const [data, setData] = useState<GlobalMarket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGlobalMarket()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));

    const id = setInterval(() => {
      fetchGlobalMarket().then(res => setData(res.data)).catch(() => {});
    }, 120_000);
    return () => clearInterval(id);
  }, []);

  return { data, isLoading };
}
