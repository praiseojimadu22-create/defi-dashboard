import type { PortfolioEntry, PortfolioWithPrice, Token } from '../types';

const STORAGE_KEY = 'defi_portfolio_v1';

export function loadPortfolio(): PortfolioEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultPortfolio();
  } catch {
    return getDefaultPortfolio();
  }
}

export function savePortfolio(entries: PortfolioEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getDefaultPortfolio(): PortfolioEntry[] {
  return [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', amount: 0.15, avgBuyPrice: 42000, image: '' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', amount: 2.5, avgBuyPrice: 2200, image: '' },
    { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', amount: 1500, avgBuyPrice: 0.85, image: '' },
  ];
}

export function mergePortfolioWithPrices(
  portfolio: PortfolioEntry[],
  tokens: Token[],
): PortfolioWithPrice[] {
  return portfolio.map(entry => {
    const token = tokens.find(t => t.id === entry.id);
    const currentPrice = token?.current_price ?? entry.avgBuyPrice;
    const currentValue = currentPrice * entry.amount;
    const costBasis = entry.avgBuyPrice * entry.amount;
    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    const change24h = token?.price_change_percentage_24h ?? 0;

    return {
      ...entry,
      image: token?.image ?? entry.image,
      currentPrice,
      currentValue,
      pnl,
      pnlPercent,
      change24h,
    };
  });
}

export function getTotalPortfolioValue(portfolio: PortfolioWithPrice[]): number {
  return portfolio.reduce((sum, p) => sum + p.currentValue, 0);
}

export function getTotalPnL(portfolio: PortfolioWithPrice[]): number {
  return portfolio.reduce((sum, p) => sum + p.pnl, 0);
}
