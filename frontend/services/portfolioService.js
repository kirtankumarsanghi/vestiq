import { futureValue, expectedRate, yearsToGoal, growthData, allocation, products, rationale } from '../utils/calculations';
import { api } from './api';

export function generatePortfolio(profile) {
  const { lumpSum, monthlySIP, riskScore, horizonYears, targetCorpus } = profile;
  const rate   = expectedRate(riskScore);
  const alloc  = allocation(riskScore, horizonYears);
  const corpus = futureValue(lumpSum, monthlySIP, rate, horizonYears);
  const years  = yearsToGoal(lumpSum, monthlySIP, rate, targetCorpus);
  const chart  = growthData(lumpSum, monthlySIP, rate, horizonYears);

  return {
    profile,
    rate,
    annualRate: rate,
    projectedCorpus: corpus,
    yearsRequired:   years,
    chart,
    allocation: alloc,
    recommendations: alloc.map(a => ({
      ...a,
      products:  products(a.name),
      rationale: rationale(a.name),
    })),
    generatedAt: Date.now(),
  };
}

export async function buildPortfolio(profile) {
  try {
    return await api.post('/portfolio/build', profile);
  } catch (_error) {
    return generatePortfolio(profile);
  }
}

export async function fetchPortfolio() {
  try {
    return await api.get('/portfolio');
  } catch (_error) {
    return null;
  }
}

export function savePortfolio(p) {
  if (typeof window !== 'undefined')
    localStorage.setItem('vestiq_portfolio', JSON.stringify(p));
}

export function loadPortfolio() {
  if (typeof window === 'undefined') return null;
  const s = localStorage.getItem('vestiq_portfolio');
  return s ? JSON.parse(s) : null;
}