import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import { usePortfolio } from '../hooks/usePortfolio';
import type { Token, PortfolioEntry } from '../types';
import { formatUsd, formatPercent } from '../utils/format';

const PIE_COLORS = ['#627EEA', '#00C48C', '#FF6B35', '#FFB020', '#9B59B6', '#E74C3C'];

interface Props { tokens: Token[] }

function AddEntryForm({
  tokens,
  onAdd,
  onClose,
}: {
  tokens: Token[];
  onAdd: (e: PortfolioEntry) => void;
  onClose: () => void;
}) {
  const [id, setId] = useState('');
  const [amount, setAmount] = useState('');
  const [avgPrice, setAvgPrice] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = tokens.find(t => t.id === id);
    if (!token || !amount || !avgPrice) return;
    onAdd({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      image: token.image,
      amount: parseFloat(amount),
      avgBuyPrice: parseFloat(avgPrice),
    });
    onClose();
  }

  return (
    <form className="add-entry-form" onSubmit={submit}>
      <select className="form-select" value={id} onChange={e => {
        setId(e.target.value);
        const t = tokens.find(tok => tok.id === e.target.value);
        if (t) setAvgPrice(t.current_price.toFixed(4));
      }}>
        <option value="">Select token…</option>
        {tokens.slice(0, 50).map(t => (
          <option key={t.id} value={t.id}>{t.name} ({t.symbol.toUpperCase()})</option>
        ))}
      </select>
      <input
        className="form-input"
        type="number"
        placeholder="Amount held"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        step="any"
        min="0"
      />
      <input
        className="form-input"
        type="number"
        placeholder="Avg buy price (USD)"
        value={avgPrice}
        onChange={e => setAvgPrice(e.target.value)}
        step="any"
        min="0"
      />
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary">Add</button>
      </div>
    </form>
  );
}

export function PortfolioPanel({ tokens }: Props) {
  const {
    portfolio, totalValue, totalPnL, totalPnLPercent,
    allocations, addEntry, removeEntry,
  } = usePortfolio(tokens);

  const [showForm, setShowForm] = useState(false);
  const isPnLPos = totalPnL >= 0;

  return (
    <div className="portfolio-panel">
      <div className="portfolio-panel__header">
        <h2 className="panel-title">Portfolio</h2>
        <button className="btn-add" onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <AddEntryForm tokens={tokens} onAdd={addEntry} onClose={() => setShowForm(false)} />
      )}

      {/* Summary */}
      <div className="portfolio-summary">
        <div>
          <div className="summary-label">Total Value</div>
          <div className="summary-value">{formatUsd(totalValue)}</div>
        </div>
        <div>
          <div className="summary-label">Total P&amp;L</div>
          <div className={`summary-value ${isPnLPos ? 'pos' : 'neg'}`}>
            {formatUsd(totalPnL)} ({formatPercent(totalPnLPercent)})
          </div>
        </div>
      </div>

      {/* Pie chart */}
      {allocations.length > 0 && (
        <div className="portfolio-pie">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={allocations}
                dataKey="value"
                nameKey="symbol"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}>
                {allocations.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatUsd(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {allocations.map((a, i) => (
              <div key={a.id} className="pie-legend-item">
                <span className="pie-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="pie-sym">{a.symbol.toUpperCase()}</span>
                <span className="pie-pct">{a.percent.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holdings table */}
      <div className="holdings">
        {portfolio.map(p => (
          <div key={p.id} className="holding-row">
            <div className="holding-left">
              {p.image && <img src={p.image} alt={p.symbol} className="token-img" />}
              <div>
                <div className="holding-sym">{p.symbol.toUpperCase()}</div>
                <div className="holding-amount">{p.amount} @ {formatUsd(p.avgBuyPrice)}</div>
              </div>
            </div>
            <div className="holding-right">
              <div className="holding-value">{formatUsd(p.currentValue)}</div>
              <div className={`holding-pnl ${p.pnl >= 0 ? 'pos' : 'neg'}`}>
                {formatPercent(p.pnlPercent)}
              </div>
            </div>
            <button
              className="holding-remove"
              onClick={() => removeEntry(p.id)}
              title="Remove">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
