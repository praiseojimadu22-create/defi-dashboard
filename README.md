# DeFi Dashboard

A real-time crypto analytics dashboard built with **React**, **TypeScript**, and **Recharts**. Pulls live market data from CoinGecko and streams live prices over Binance WebSocket.

---

## Features

- **Live price ticker** — Binance WebSocket stream, auto-reconnects
- **Market overview** — top 100 tokens by market cap, sortable/searchable
- **7-day sparklines** — inline mini charts per token
- **Price chart** — interactive area chart with 1D / 7D / 30D / 90D / 1Y range selector
- **Token detail panel** — market cap, volume, supply, 24h and 7d change
- **Global market bar** — total market cap, volume, BTC/ETH dominance, 24h change
- **Portfolio tracker** — add holdings with avg buy price, P&L per asset, pie allocation chart, persisted to localStorage
- **Trending panel** — CoinGecko trending coins, clickable to open detail
- **Auto-refresh** — token prices every 60s, global market every 120s

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript (strict) |
| Charts | Recharts |
| Data | CoinGecko API (REST) |
| Live Prices | Binance WebSocket |
| State | React hooks (no external store) |
| Persistence | localStorage |
| Fonts | IBM Plex Mono + Syne (Google Fonts) |

---

## Project Structure

```
defi-dashboard/
├── public/
│   └── index.html
└── src/
    ├── components/
    │   ├── GlobalBar.tsx       # Market cap / volume / dominance bar
    │   ├── LiveTicker.tsx      # WebSocket price ticker strip
    │   ├── TokenTable.tsx      # Sortable/searchable token list
    │   ├── TokenDetail.tsx     # Selected token stats panel
    │   ├── PriceChart.tsx      # Area chart with range selector
    │   ├── PortfolioPanel.tsx  # Holdings tracker + pie chart
    │   └── TrendingPanel.tsx   # CoinGecko trending coins
    ├── hooks/
    │   ├── useTokens.ts        # Token list, sorting, search, auto-refresh
    │   ├── useGlobalMarket.ts  # Global market stats
    │   ├── usePriceChart.ts    # Price history for chart
    │   ├── useWebSocket.ts     # Binance WS live prices
    │   └── usePortfolio.ts     # Portfolio state + P&L calc
    ├── services/
    │   └── coingecko.ts        # All CoinGecko API calls
    ├── types/
    │   └── index.ts
    ├── utils/
    │   ├── format.ts           # USD, percent, compact number formatters
    │   └── portfolio.ts        # Portfolio merge + localStorage helpers
    ├── App.tsx
    ├── App.css
    └── index.tsx
```

---

## Getting Started

```bash
git clone https://github.com/yourusername/defi-dashboard.git
cd defi-dashboard
npm install
npm start
```

Runs on `http://localhost:3000`.

```bash
npm run build   # Production build
npm test        # Run tests
```

---

## Data Sources

- **[CoinGecko API](https://www.coingecko.com/en/api)** — free tier, no API key required for basic endpoints
- **[Binance WebSocket](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams)** — public streams, no auth

> CoinGecko free tier is rate-limited to ~30 calls/min. The app is designed to stay well within this limit.

---

## License

MIT
