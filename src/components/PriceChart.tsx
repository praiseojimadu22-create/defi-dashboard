import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { usePriceChart } from '../hooks/usePriceChart';
import { formatUsd, formatPercent } from '../utils/format';
import type { TimeRange } from '../types';

interface Props {
  tokenId: string;
  tokenName: string;
  currentPrice: number;
}

const RANGES: TimeRange[] = ['1D', '7D', '30D', '90D', '1Y'];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__price">{formatUsd(payload[0].value)}</div>
      <div className="chart-tooltip__time">{payload[0].payload.time}</div>
    </div>
  );
}

export function PriceChart({ tokenId, tokenName, currentPrice }: Props) {
  const [range, setRange] = useState<TimeRange>('7D');
  const { data, isLoading, priceDeltaPercent, isPositive } = usePriceChart(tokenId, range);

  const color = isPositive ? '#00C48C' : '#FF6B6B';

  return (
    <div className="price-chart">
      <div className="price-chart__header">
        <div>
          <div className="price-chart__name">{tokenName} Price</div>
          <div className="price-chart__price">{formatUsd(currentPrice)}</div>
          <div className={`price-chart__delta ${isPositive ? 'pos' : 'neg'}`}>
            {formatPercent(priceDeltaPercent)} ({range})
          </div>
        </div>
        <div className="price-chart__ranges">
          {RANGES.map(r => (
            <button
              key={r}
              className={`range-btn ${range === r ? 'range-btn--active' : ''}`}
              onClick={() => setRange(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="price-chart__canvas">
        {isLoading ? (
          <div className="chart-loading">Loading chart…</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2235" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#5a6080', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#5a6080', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => formatUsd(v, true)}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#priceGrad)"
                dot={false}
                activeDot={{ r: 4, fill: color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
