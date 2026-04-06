import {
  allocation,
  expectedRate,
  futureValue,
  growthData,
  products,
  rationale,
  yearsToGoal,
} from '../utils/calculations';
import { api } from './api';

function fallbackPortfolio(profile = {}) {
  const normalized = {
    goal: profile.goal || 'wealth',
    lumpSum: Number(profile.lumpSum) || 500000,
    monthlySIP: Number(profile.monthlySIP) || 15000,
    riskScore: Number(profile.riskScore) || 5,
    horizonYears: Number(profile.horizonYears) || 10,
    targetCorpus: Number(profile.targetCorpus) || 10000000,
  };

  const annualRate = expectedRate(normalized.riskScore);
  const baseAllocation = allocation(normalized.riskScore, normalized.horizonYears);

  return {
    profile: normalized,
    annualRate,
    projectedCorpus: futureValue(
      normalized.lumpSum,
      normalized.monthlySIP,
      annualRate,
      normalized.horizonYears
    ),
    yearsRequired: yearsToGoal(
      normalized.lumpSum,
      normalized.monthlySIP,
      annualRate,
      normalized.targetCorpus
    ),
    chart: growthData(
      normalized.lumpSum,
      normalized.monthlySIP,
      annualRate,
      normalized.horizonYears
    ),
    allocation: baseAllocation,
    recommendations: baseAllocation.map((asset) => ({
      ...asset,
      products: products(asset.name),
      rationale: rationale(asset.name),
    })),
    generatedAt: Date.now(),
    riskScore: normalized.riskScore,
  };
}

export async function getOverview() {
  try {
    return await api.get('/portfolio/overview');
  } catch (_error) {
    return { portfolio: fallbackPortfolio() };
  }
}

export async function getPortfolio() {
  try {
    return await api.get('/portfolio');
  } catch (_error) {
    return fallbackPortfolio();
  }
}

export async function buildPortfolio(profile) {
  try {
    return await api.post('/portfolio/build', profile);
  } catch (_error) {
    return fallbackPortfolio(profile);
  }
}

export async function getInsights() {
  try {
    return await api.get('/portfolio/insights');
  } catch (_error) {
    return [];
  }
}

export async function getTransactions() {
  try {
    return await api.get('/portfolio/transactions');
  } catch (_error) {
    return [];
  }
}

export async function getNotifications() {
  try {
    return await api.get('/portfolio/notifications');
  } catch (_error) {
    return [];
  }
}

export async function getRebalanceSuggestion() {
  try {
    return await api.get('/portfolio/rebalance');
  } catch (_error) {
    return {
      action: 'Monitor',
      summary: 'Your portfolio is close to target allocation.',
      changes: [],
    };
  }
}

export async function runSipSimulation(payload) {
  try {
    return await api.post('/portfolio/simulate', payload);
  } catch (_error) {
    return {
      yearsToGoal: yearsToGoal(
        payload.lumpSum || 0,
        payload.monthlySIP || 0,
        expectedRate(payload.riskScore || 5),
        payload.targetCorpus || 10000000
      ),
      projectedCorpus: futureValue(
        payload.lumpSum || 0,
        payload.monthlySIP || 0,
        expectedRate(payload.riskScore || 5),
        payload.horizonYears || 10
      ),
    };
  }
}

export function savePortfolio(portfolio) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('vestiq_portfolio', JSON.stringify(portfolio));
}

export function loadPortfolio() {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem('vestiq_portfolio');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}