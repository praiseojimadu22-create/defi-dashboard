import React, { useState } from 'react';
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
} from 'recharts';
import type { Token, SortKey, SortDir } from '../types';
import { formatUsd, formatPercent, formatCompact } from '../utils/format';
import type { LivePrice } from '../hooks/useWebSocket';

interface Props {
  tokens: Token[];
  isLoading: boolean;
  search: string;
  setSearch: (s: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  toggleSort: (k: SortKey) => void;
  livePrices: Record<string, LivePrice>;
  onSelect: (token: Token) => void;
  selectedId: string | null;
}

function SparklineCell({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data?.length) return <span style={{ color: '#3a4060' }}>—</span>;
  const chartData = data.map((price, i) => ({ i, price }));
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={chartData}>
        <Line
          type="monotone" dataKey="price"
          stroke={positive ? '#00C48C' : '#FF6B6B'}
          strokeWidth={1.5} dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="sort-icon">↕</span>;
  return <span className="sort-icon sort-icon--active">{dir === 'desc' ? '↓' : '↑'}</span>;
}

const PAGE_SIZE = 20;

export function TokenTable({
  tokens, isLoading, search, setSearch,
  sortKey, sortDir, toggleSort, livePrices, onSelect, selectedId,
}: Props) {
  const [page, setPage] = useState(1);
  const paged = tokens.slice(0, page * PAGE_SIZE);
  const hasMore = paged.length < tokens.length;

  return (
    <div className="token-table-wrap">
      <div className="token-table-controls">
        <input
          className="search-input"
          placeholder="Search tokens…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <span className="token-count">{tokens.length} tokens</span>
      </div>

      <div className="token-table-scroll">
        <table className="token-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Token</th>
              <th className="th-sort" onClick={() => toggleSort('current_price')}>
                Price <SortIcon active={sortKey === 'current_price'} dir={sortDir} />
              </th>
              <th className="th-sort" onClick={() => toggleSort('price_change_percentage_24h')}>
                24h <SortIcon active={sortKey === 'price_change_percentage_24h'} dir={sortDir} />
              </th>
              <th className="th-sort th--hide-sm" onClick={() => toggleSort('market_cap')}>
                Mkt Cap <SortIcon active={sortKey === 'market_cap'} dir={sortDir} />
              </th>
              <th className="th-sort th--hide-sm" onClick={() => toggleSort('total_volume')}>
                Volume <SortIcon active={sortKey === 'total_volume'} dir={sortDir} />
              </th>
              <th className="th--hide-sm">7D Chart</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && tokens.length === 0
              ? Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td colSpan={7}><div className="skeleton" /></td>
                </tr>
              ))
              : paged.map((token, idx) => {
                const live = livePrices[token.symbol.toUpperCase()];
                const price = live?.price ?? token.current_price;
                const change = live?.change ?? token.price_change_percentage_24h;
                const pos = change >= 0;
                const isSelected = token.id === selectedId;

                return (
                  <tr
                    key={token.id}
                    className={`token-row ${isSelected ? 'token-row--selected' : ''}`}
                    onClick={() => onSelect(token)}>
                    <td className="td-rank">{idx + 1}</td>
                    <td className="td-token">
                      <img src={token.image} alt={token.symbol} className="token-img" />
                      <span className="token-name">{token.name}</span>
                      <span className="token-sym">{token.symbol.toUpperCase()}</span>
                    </td>
                    <td className={`td-price ${live ? 'td-price--live' : ''}`}>
                      {formatUsd(price)}
                    </td>
                    <td className={pos ? 'pos' : 'neg'}>
                      {formatPercent(change)}
                    </td>
                    <td className="th--hide-sm">{formatUsd(token.market_cap, true)}</td>
                    <td className="th--hide-sm">{formatUsd(token.total_volume, true)}</td>
                    <td className="th--hide-sm">
                      <SparklineCell
                        data={token.sparkline_in_7d?.price ?? []}
                        positive={(token.price_change_percentage_7d_in_currency ?? 0) >= 0}
                      />
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button className="load-more" onClick={() => setPage(p => p + 1)}>
          Load more
        </button>
      )}
    </div>
  );
}
