import React, { useEffect, useState } from 'react';
import { fetchTrending } from '../services/coingecko';

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  price_btc: number;
}

export function TrendingPanel({ onSelect }: { onSelect: (id: string) => void }) {
  const [coins, setCoins] = useState<TrendingCoin[]>([]);

  useEffect(() => {
    fetchTrending()
      .then(res => setCoins(res.coins.map(c => c.item).slice(0, 7)))
      .catch(() => {});
  }, []);

  if (!coins.length) return null;

  return (
    <div className="trending-panel">
      <h3 className="panel-title">🔥 Trending</h3>
      <div className="trending-list">
        {coins.map((coin, i) => (
          <button key={coin.id} className="trending-item" onClick={() => onSelect(coin.id)}>
            <span className="trending-rank">{i + 1}</span>
            <img src={coin.thumb} alt={coin.symbol} className="token-img token-img--sm" />
            <span className="trending-name">{coin.name}</span>
            <span className="trending-sym">{coin.symbol.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
