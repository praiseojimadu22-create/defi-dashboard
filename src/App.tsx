import React, { useState } from 'react';
import './App.css';
import { GlobalBar } from './components/GlobalBar';
import { LiveTicker } from './components/LiveTicker';
import { TokenTable } from './components/TokenTable';
import { TokenDetail } from './components/TokenDetail';
import { PriceChart } from './components/PriceChart';
import { PortfolioPanel } from './components/PortfolioPanel';
import { TrendingPanel } from './components/TrendingPanel';
import { useTokens } from './hooks/useTokens';
import { useLivePrices } from './hooks/useWebSocket';
import type { Token } from './types';

type View = 'market' | 'portfolio';

const LIVE_SYMBOLS = ['BTC', 'ETH', 'BNB', 'SOL', 'MATIC', 'LINK', 'AVAX', 'UNI', 'AAVE', 'DOT'];

export default function App() {
  const {
    filtered, tokens, isLoading, error,
    search, setSearch, sortKey, sortDir,
    toggleSort, lastUpdated, refresh,
  } = useTokens();

  const { prices: livePrices } = useLivePrices(LIVE_SYMBOLS);

  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [view, setView] = useState<View>('market');

  function handleSelectToken(token: Token) {
    setSelectedToken(prev => prev?.id === token.id ? null : token);
  }

  function handleTrendingSelect(id: string) {
    const token = tokens.find(t => t.id === id);
    if (token) {
      setSelectedToken(token);
      setView('market');
    }
  }

  return (
    <div className="app">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar__logo">DeFi<span>Dash</span></div>
        <nav className="topbar__nav">
          <button
            className={`nav-btn ${view === 'market' ? 'nav-btn--active' : ''}`}
            onClick={() => setView('market')}>
            Market
          </button>
          <button
            className={`nav-btn ${view === 'portfolio' ? 'nav-btn--active' : ''}`}
            onClick={() => setView('portfolio')}>
            Portfolio
          </button>
        </nav>
      </header>

      {/* Global stats bar */}
      <GlobalBar />

      <main className="main-layout">
        {/* ── LEFT ── */}
        <div className="main-left">
          {/* Live ticker */}
          <LiveTicker />

          {/* Error */}
          {error && (
            <div className="error-box">
              ⚠ {error}
              <button className="refresh-btn" onClick={refresh}>Retry</button>
            </div>
          )}

          {/* Last updated */}
          {lastUpdated && (
            <span className="last-updated">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          {/* Chart for selected token */}
          {selectedToken && (
            <PriceChart
              tokenId={selectedToken.id}
              tokenName={selectedToken.name}
              currentPrice={
                livePrices[selectedToken.symbol.toUpperCase()]?.price ??
                selectedToken.current_price
              }
            />
          )}

          {/* Main content by view */}
          {view === 'market' ? (
            <>
              <TokenTable
                tokens={filtered}
                isLoading={isLoading}
                search={search}
                setSearch={setSearch}
                sortKey={sortKey}
                sortDir={sortDir}
                toggleSort={toggleSort}
                livePrices={livePrices}
                onSelect={handleSelectToken}
                selectedId={selectedToken?.id ?? null}
              />
            </>
          ) : (
            <PortfolioPanel tokens={tokens} />
          )}
        </div>

        {/* ── RIGHT ── */}
        <div className="main-right">
          {selectedToken && (
            <TokenDetail
              token={selectedToken}
              onClose={() => setSelectedToken(null)}
            />
          )}
          <TrendingPanel onSelect={handleTrendingSelect} />
          {view === 'market' && <PortfolioPanel tokens={tokens} />}
        </div>
      </main>
    </div>
  );
}
