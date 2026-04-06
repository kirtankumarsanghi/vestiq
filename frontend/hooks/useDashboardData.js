'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getInsights,
  getNotifications,
  getPortfolio,
  getRebalanceSuggestion,
  getTransactions,
  runSipSimulation,
} from '../services/portfolioService';

export function useDashboardData() {
  const [portfolio, setPortfolio] = useState(null);
  const [insights, setInsights] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [rebalance, setRebalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');

    try {
      const [portfolioData, insightsData, txData, notificationData, rebalanceData] =
        await Promise.all([
          getPortfolio(),
          getInsights(),
          getTransactions(),
          getNotifications(),
          getRebalanceSuggestion(),
        ]);

      setPortfolio(portfolioData);
      setInsights(insightsData);
      setTransactions(txData);
      setNotifications(notificationData);
      setRebalance(rebalanceData);
    } catch (_err) {
      setError('Unable to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const profile = portfolio?.profile || {};

  const metrics = useMemo(() => {
    const sip = Number(profile.monthlySIP || 0);
    const lump = Number(profile.lumpSum || 0);
    const target = Number(profile.targetCorpus || 10000000);
    const projected = Number(portfolio?.projectedCorpus || 0);
    const invested = lump + sip * 12;

    return {
      projected,
      invested,
      gains: projected - invested,
      progress: target ? Math.min(100, (projected / target) * 100) : 0,
      target,
      riskScore: Number(profile.riskScore || 5),
    };
  }, [portfolio, profile]);

  async function simulate(payload) {
    return runSipSimulation(payload);
  }

  return {
    portfolio,
    insights,
    transactions,
    notifications,
    rebalance,
    metrics,
    loading,
    error,
    refresh,
    simulate,
  };
}
