export interface Token {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  image: string;
  sparkline_in_7d?: { price: number[] };
}

export interface PortfolioEntry {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  avgBuyPrice: number;
  image: string;
}

export interface PortfolioWithPrice extends PortfolioEntry {
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  change24h: number;
}

export interface GlobalMarket {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
}

export interface OHLCPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type TimeRange = '1D' | '7D' | '30D' | '90D' | '1Y';
export type SortKey = 'market_cap' | 'price_change_percentage_24h' | 'total_volume' | 'current_price';
export type SortDir = 'asc' | 'desc';
