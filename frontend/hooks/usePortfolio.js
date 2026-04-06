'use client';
import { useState, useEffect } from 'react';
import {
  buildPortfolio,
  fetchPortfolio,
  savePortfolio,
  loadPortfolio,
} from '../services/portfolioService';

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    const saved = loadPortfolio();
    if (saved) {
      setPortfolio(saved);
    }

    async function hydrateFromBackend() {
      const remote = await fetchPortfolio();
      if (remote) {
        setPortfolio(remote);
        savePortfolio(remote);
      }
    }

    hydrateFromBackend();
  }, []);

  async function build(profileData) {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // short dramatic pause
    const result = await buildPortfolio(profileData);
    setPortfolio(result);
    savePortfolio(result);
    setLoading(false);
    return result;
  }

  function reset() {
    setPortfolio(null);
    if (typeof window !== 'undefined') localStorage.removeItem('vestiq_portfolio');
  }

  return { portfolio, loading, build, reset };
}