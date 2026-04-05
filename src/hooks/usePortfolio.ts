import { useState, useCallback } from 'react';
import type { Token, PortfolioEntry, PortfolioWithPrice } from '../types';
import {
  loadPortfolio, savePortfolio,
  mergePortfolioWithPrices,
  getTotalPortfolioValue,
  getTotalPnL,
} from '../utils/portfolio';

export function usePortfolio(tokens: Token[]) {
  const [entries, setEntries] = useState<PortfolioEntry[]>(() => loadPortfolio());

  const portfolio: PortfolioWithPrice[] = mergePortfolioWithPrices(entries, tokens);
  const totalValue = getTotalPortfolioValue(portfolio);
  const totalPnL = getTotalPnL(portfolio);
  const totalPnLPercent = totalValue > 0
    ? (totalPnL / (totalValue - totalPnL)) * 100
    : 0;

  const addEntry = useCallback((entry: PortfolioEntry) => {
    setEntries(prev => {
      const existing = prev.findIndex(e => e.id === entry.id);
      let updated: PortfolioEntry[];
      if (existing >= 0) {
        // Average in
        const old = prev[existing];
        const totalAmount = old.amount + entry.amount;
        const avgPrice =
          (old.avgBuyPrice * old.amount + entry.avgBuyPrice * entry.amount) / totalAmount;
        updated = prev.map((e, i) =>
          i === existing ? { ...e, amount: totalAmount, avgBuyPrice: avgPrice } : e,
        );
      } else {
        updated = [...prev, entry];
      }
      savePortfolio(updated);
      return updated;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      savePortfolio(updated);
      return updated;
    });
  }, []);

  const updateAmount = useCallback((id: string, amount: number) => {
    setEntries(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, amount } : e);
      savePortfolio(updated);
      return updated;
    });
  }, []);

  // Allocation % per asset
  const allocations = portfolio.map(p => ({
    id: p.id,
    symbol: p.symbol,
    value: p.currentValue,
    percent: totalValue > 0 ? (p.currentValue / totalValue) * 100 : 0,
  }));

  return {
    portfolio,
    totalValue,
    totalPnL,
    totalPnLPercent,
    allocations,
    addEntry,
    removeEntry,
    updateAmount,
  };
}
