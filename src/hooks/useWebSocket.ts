import { useState, useEffect, useRef, useCallback } from 'react';

export interface LivePrice {
  symbol: string;
  price: number;
  change: number;
}

// Binance public WebSocket — no auth required
const WS_BASE = 'wss://stream.binance.com:9443/stream?streams=';

const SYMBOL_MAP: Record<string, string> = {
  BTC: 'btcusdt',
  ETH: 'ethusdt',
  BNB: 'bnbusdt',
  SOL: 'solusdt',
  MATIC: 'maticusdt',
  LINK: 'linkusdt',
  AVAX: 'avaxusdt',
  UNI: 'uniusdt',
  AAVE: 'aaveusdt',
  DOT: 'dotusdt',
};

export function useLivePrices(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, LivePrice>>({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    const streams = symbols
      .map(s => SYMBOL_MAP[s.toUpperCase()])
      .filter(Boolean)
      .map(s => `${s}@miniTicker`)
      .join('/');

    if (!streams) return;

    const ws = new WebSocket(`${WS_BASE}${streams}`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const ticker = msg.data;
        if (!ticker || !ticker.s) return;
        const sym = Object.entries(SYMBOL_MAP).find(
          ([, v]) => v === ticker.s.toLowerCase(),
        )?.[0];
        if (!sym) return;
        setPrices(prev => ({
          ...prev,
          [sym]: {
            symbol: sym,
            price: parseFloat(ticker.c),
            change: parseFloat(ticker.P),
          },
        }));
      } catch { /* ignore parse errors */ }
    };

    ws.onerror = () => setIsConnected(false);
    ws.onclose = () => {
      setIsConnected(false);
      // Reconnect after 5s
      reconnectRef.current = setTimeout(connect, 5000);
    };
  }, [symbols.join(',')]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [connect]);

  return { prices, isConnected };
}
