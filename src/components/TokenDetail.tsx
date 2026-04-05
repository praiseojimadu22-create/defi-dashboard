import React from 'react';
import { PriceChart } from './PriceChart';
import type { Token } from '../types';
import { formatUsd, formatPercent, formatCompact } from '../utils/format';

interface Props {
  token: Token;
  onClose: () => void;
}

interface StatProps { label: string; value: string; sub?: string }
function Stat({ label, value, sub }: StatProps) {
  return (
    <div className="token-stat">
      <div className="token-stat__label">{label}</div>
      <div className="token-stat__value">{value}</div>
      {sub && <div className="token-stat__sub">{sub}</div>}
    </div>
  );
}

export function TokenDetail({ token, onClose }: Props) {
  const pos24 = token.price_change_percentage_24h >= 0;
  const pos7 = (token.price_change_percentage_7d_in_currency ?? 0) >= 0;

  return (
    <div className="token-detail">
      <div className="token-detail__header">
        <div className="token-detail__identity">
          <img src={token.image} alt={token.symbol} className="token-detail__img" />
          <div>
            <div className="token-detail__name">{token.name}</div>
            <div className="token-detail__sym">{token.symbol.toUpperCase()}</div>
          </div>
        </div>
        <button className="token-detail__close" onClick={onClose}>✕</button>
      </div>

      <div className="token-detail__price-row">
        <span className="token-detail__price">{formatUsd(token.current_price)}</span>
        <span className={`token-detail__change ${pos24 ? 'pos' : 'neg'}`}>
          {formatPercent(token.price_change_percentage_24h)} (24h)
        </span>
        {token.price_change_percentage_7d_in_currency !== undefined && (
          <span className={`token-detail__change ${pos7 ? 'pos' : 'neg'}`}>
            {formatPercent(token.price_change_percentage_7d_in_currency)} (7d)
          </span>
        )}
      </div>

      <PriceChart
        tokenId={token.id}
        tokenName={token.name}
        currentPrice={token.current_price}
      />

      <div className="token-detail__stats">
        <Stat label="Market Cap" value={formatUsd(token.market_cap, true)} />
        <Stat label="24h Volume" value={formatUsd(token.total_volume, true)} />
        <Stat label="Circulating Supply"
          value={`${formatCompact(token.circulating_supply)} ${token.symbol.toUpperCase()}`} />
        <Stat
          label="Vol / Mkt Cap"
          value={(token.total_volume / token.market_cap * 100).toFixed(2) + '%'}
        />
      </div>
    </div>
  );
}
