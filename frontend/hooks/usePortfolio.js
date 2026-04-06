'use client';
import { useState, useEffect } from 'react';
import {
  buildPortfolio,
  getPortfolio,
  savePortfolio,
  loadPortfolio,
} from '../services/portfolioService';

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = loadPortfolio();
    if (saved) {
      setPortfolio(saved);
    }

    async function hydrateFromBackend() {
      try {
        const remote = await getPortfolio();
        setPortfolio(remote);
        savePortfolio(remote);
      } catch (_err) {
        // Ignore on initial page load. We still have local fallback.
      }
    }

    hydrateFromBackend();
  }, []);

  async function build(profileData) {
    setLoading(true);
    setError('');

    try {
      const result = await buildPortfolio(profileData);
      setPortfolio(result);
      savePortfolio(result);
      return result;
    } catch (_error) {
      setError('Unable to build portfolio. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPortfolio(null);
    if (typeof window !== 'undefined') localStorage.removeItem('vestiq_portfolio');
  }

  return { portfolio, loading, error, build, reset };
}