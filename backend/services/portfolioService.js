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

function ensurePortfolio() {
  if (!latestPortfolio) {
    latestPortfolio = buildPortfolio({
      goal: 'wealth',
      lumpSum: 500000,
      monthlySIP: 15000,
      riskScore: 5,
      horizonYears: 10,
      targetCorpus: 10000000,
    });
  }

  return latestPortfolio;
}

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

function getOverview() {
  const portfolio = ensurePortfolio();
  return {
    portfolio,
    summary: {
      projectedCorpus: portfolio.projectedCorpus,
      annualRate: portfolio.annualRate,
      yearsRequired: portfolio.yearsRequired,
    },
  };
}

function getInsights() {
  const portfolio = ensurePortfolio();
  const target = Number(portfolio.profile.targetCorpus || 10000000);
  const progress = Math.min(100, (portfolio.projectedCorpus / target) * 100).toFixed(1);

  return [
    {
      id: 'insight-progress',
      title: 'Goal Probability Improving',
      detail: `Current projection reaches ${progress}% of your target corpus.`,
      impact: 'High',
    },
    {
      id: 'insight-sip',
      title: 'SIP Consistency Drives Outcome',
      detail: 'Increasing SIP by 10% can materially reduce years-to-goal for most profiles.',
      impact: 'Medium',
    },
    {
      id: 'insight-diversification',
      title: 'Diversification Quality Stable',
      detail: 'Allocation spread is healthy across core and satellite asset classes.',
      impact: 'Low',
    },
  ];
}

function getTransactions() {
  const now = new Date();

  return [
    {
      id: 'tx-1',
      date: now.toISOString().slice(0, 10),
      type: 'SIP Debit',
      asset: 'Mirae Asset Large Cap',
      amount: 5000,
      status: 'Completed',
    },
    {
      id: 'tx-2',
      date: new Date(now.getTime() - 86400000).toISOString().slice(0, 10),
      type: 'Buy',
      asset: 'Nippon Gold ETF',
      amount: 3000,
      status: 'Completed',
    },
    {
      id: 'tx-3',
      date: new Date(now.getTime() - 2 * 86400000).toISOString().slice(0, 10),
      type: 'Rebalance',
      asset: 'Large Cap Basket',
      amount: 18000,
      status: 'Pending',
    },
  ];
}

function getNotifications() {
  return [
    {
      id: 'n-1',
      title: 'Allocation Drift Alert',
      message: 'Equity weight is 2.8% above target. Rebalance is recommended this week.',
      severity: 'warning',
    },
    {
      id: 'n-2',
      title: 'SIP Reminder',
      message: 'Next SIP debit is scheduled for the 10th. Ensure account balance is available.',
      severity: 'info',
    },
    {
      id: 'n-3',
      title: 'Tax Opportunity',
      message: 'Potential tax-loss harvesting opportunity detected in one equity position.',
      severity: 'success',
    },
  ];
}

function getRebalanceSuggestion() {
  const portfolio = ensurePortfolio();
  const equities = portfolio.allocation.find((asset) => asset.name === 'Equities');
  const bonds = portfolio.allocation.find((asset) => asset.name === 'Bonds');

  return {
    action: 'Review',
    summary: 'Portfolio drift is moderate. A small rebalance can improve risk alignment.',
    changes: [
      {
        asset: 'Equities',
        current: (equities?.value || 20) + 2,
        target: equities?.value || 20,
        action: 'Trim',
      },
      {
        asset: 'Bonds',
        current: Math.max(0, (bonds?.value || 15) - 2),
        target: bonds?.value || 15,
        action: 'Add',
      },
    ],
  };
}

function simulateSip(payload = {}) {
  const base = ensurePortfolio().profile;
  const scenario = {
    lumpSum: Number(payload.lumpSum ?? base.lumpSum ?? 0),
    monthlySIP: Number(payload.monthlySIP ?? base.monthlySIP ?? 0),
    riskScore: Number(payload.riskScore ?? base.riskScore ?? 5),
    horizonYears: Number(payload.horizonYears ?? base.horizonYears ?? 10),
    targetCorpus: Number(payload.targetCorpus ?? base.targetCorpus ?? 10000000),
  };

  const annualRate = expectedRate(scenario.riskScore);

  return {
    yearsToGoal: yearsToGoal(
      scenario.lumpSum,
      scenario.monthlySIP,
      annualRate,
      scenario.targetCorpus
    ),
    projectedCorpus: futureValue(
      scenario.lumpSum,
      scenario.monthlySIP,
      annualRate,
      scenario.horizonYears
    ),
  };
}

module.exports = {
  buildPortfolio,
  getLatestPortfolio,
  getOverview,
  getInsights,
  getTransactions,
  getNotifications,
  getRebalanceSuggestion,
  simulateSip,
  ensurePortfolio,
};
