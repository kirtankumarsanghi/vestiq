const {
  expectedRate,
  futureValue,
  yearsToGoal,
  growthData,
  allocation,
  products,
  rationale,
} = require('../utils/calculations');

let latestPortfolio = null;

function buildPortfolio(profile = {}) {
  const normalized = {
    goal: profile.goal || 'wealth',
    lumpSum: Number(profile.lumpSum) || 0,
    monthlySIP: Number(profile.monthlySIP) || 0,
    riskScore: Number(profile.riskScore) || 5,
    horizonYears: Number(profile.horizonYears) || 10,
    targetCorpus: Number(profile.targetCorpus) || 10000000,
  };

  if (normalized.monthlySIP < 0 || normalized.lumpSum < 0) {
    throw new Error('Amounts cannot be negative');
  }

  const annualRate = expectedRate(normalized.riskScore);
  const assetAllocation = allocation(normalized.riskScore, normalized.horizonYears);

  const portfolio = {
    profile: normalized,
    annualRate,
    rate: annualRate,
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
    allocation: assetAllocation,
    recommendations: assetAllocation.map((item) => ({
      ...item,
      products: products(item.name),
      rationale: rationale(item.name),
    })),
    generatedAt: Date.now(),
  };

  latestPortfolio = portfolio;
  return portfolio;
}

function getLatestPortfolio() {
  return latestPortfolio;
}

module.exports = {
  buildPortfolio,
  getLatestPortfolio,
};
