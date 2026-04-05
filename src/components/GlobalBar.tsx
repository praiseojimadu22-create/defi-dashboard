import React from 'react';
import { useGlobalMarket } from '../hooks/useGlobalMarket';
import { formatUsd, formatPercent } from '../utils/format';

export function GlobalBar() {
  const { data } = useGlobalMarket();

  if (!data) return <div className="global-bar global-bar--loading">Loading market data…</div>;

  const marketCap = data.total_market_cap.usd;
  const volume = data.total_volume.usd;
  const change = data.market_cap_change_percentage_24h_usd;
  const btcDom = data.market_cap_percentage.btc;
  const ethDom = data.market_cap_percentage.eth;

  return (
    <div className="global-bar">
      <span className="global-bar__item">
        <span className="global-bar__label">Market Cap</span>
        <span className="global-bar__value">{formatUsd(marketCap, true)}</span>
        <span className={`global-bar__change ${change >= 0 ? 'pos' : 'neg'}`}>
          {formatPercent(change)}
        </span>
      </span>
      <span className="global-bar__sep">|</span>
      <span className="global-bar__item">
        <span className="global-bar__label">24h Vol</span>
        <span className="global-bar__value">{formatUsd(volume, true)}</span>
      </span>
      <span className="global-bar__sep">|</span>
      <span className="global-bar__item">
        <span className="global-bar__label">BTC Dom</span>
        <span className="global-bar__value">{btcDom.toFixed(1)}%</span>
      </span>
      <span className="global-bar__sep">|</span>
      <span className="global-bar__item">
        <span className="global-bar__label">ETH Dom</span>
        <span className="global-bar__value">{ethDom.toFixed(1)}%</span>
      </span>
    </div>
  );
}
