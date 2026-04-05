import React from 'react';
import { useLivePrices } from '../hooks/useWebSocket';
import { formatUsd, formatPercent } from '../utils/format';

const WATCHED = ['BTC', 'ETH', 'BNB', 'SOL', 'MATIC', 'LINK', 'AVAX', 'UNI'];

export function LiveTicker() {
  const { prices, isConnected } = useLivePrices(WATCHED);

  return (
    <div className="live-ticker">
      <span className={`live-ticker__dot ${isConnected ? 'live-ticker__dot--live' : ''}`} />
      <div className="live-ticker__track">
        {WATCHED.map(sym => {
          const p = prices[sym];
          if (!p) return null;
          const pos = p.change >= 0;
          return (
            <span key={sym} className="live-ticker__item">
              <span className="live-ticker__sym">{sym}</span>
              <span className="live-ticker__price">{formatUsd(p.price)}</span>
              <span className={`live-ticker__chg ${pos ? 'pos' : 'neg'}`}>
                {formatPercent(p.change)}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
