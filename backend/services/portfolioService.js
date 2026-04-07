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
let marketState = {
  nifty: 22450,
  sentiment: 'Neutral',
  regime: 'Range-bound',
  lastUpdatedAt: Date.now(),
};

const ASSET_POOL = [
  'Mirae Asset Large Cap',
  'Parag Parikh Flexi Cap',
  'Nippon Gold ETF',
  'Embassy REIT',
  'Bharat Bond ETF',
  'NASDAQ 100 Index Fund',
  'BTC-ETF Basket',
];

const TX_TYPES = ['SIP Debit', 'Buy', 'Sell', 'Rebalance'];
const STATUS_TYPES = ['Completed', 'Completed', 'Completed', 'Pending'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(items) {
  return items[randomInt(0, items.length - 1)];
}

function drift(base, percentage = 0.02) {
  const delta = base * percentage;
  return Math.max(1, Math.round(base + (Math.random() * 2 - 1) * delta));
}

function updateMarketState() {
  const now = Date.now();
  if (now - marketState.lastUpdatedAt < 2000) {
    return marketState;
  }

  marketState.nifty = drift(marketState.nifty, 0.004);
  const move = randomInt(-9, 9);

  if (move >= 5) {
    marketState.sentiment = 'Bullish';
    marketState.regime = 'Risk-on';
  } else if (move <= -5) {
    marketState.sentiment = 'Bearish';
    marketState.regime = 'Risk-off';
  } else {
    marketState.sentiment = 'Neutral';
    marketState.regime = 'Range-bound';
  }

  marketState.lastUpdatedAt = now;
  return marketState;
}

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
  const market = updateMarketState();

  return {
    portfolio,
    summary: {
      projectedCorpus: portfolio.projectedCorpus,
      annualRate: portfolio.annualRate,
      yearsRequired: portfolio.yearsRequired,
    },
    market,
  };
}

function getInsights() {
  const portfolio = ensurePortfolio();
  const market = updateMarketState();
  const target = Number(portfolio.profile.targetCorpus || 10000000);
  const progress = Math.min(100, (portfolio.projectedCorpus / target) * 100).toFixed(1);
  const niftyDelta = ((Math.random() * 1.8 - 0.9)).toFixed(2);

  return [
    {
      id: 'insight-progress',
      title: 'Goal Probability Improving',
      detail: `Current projection reaches ${progress}% of your target corpus.`,
      impact: 'High',
    },
    {
      id: 'insight-sip',
      title: 'SIP Sensitivity Check',
      detail: `A SIP increase of ₹${randomInt(1500, 6000).toLocaleString('en-IN')} can materially improve completion probability.`,
      impact: 'Medium',
    },
    {
      id: 'insight-market',
      title: `${market.sentiment} Market Pulse`,
      detail: `NIFTY is around ${market.nifty.toLocaleString('en-IN')} with intraday move ${niftyDelta}%. ${market.regime} conditions detected.`,
      impact: 'Low',
    },
  ];
}

function getTransactions() {
  const now = new Date();

  return Array.from({ length: 5 }, (_, idx) => {
    const timestamp = now.getTime() - idx * 86400000;
    return {
      id: `tx-${timestamp}-${idx}`,
      date: new Date(timestamp).toISOString().slice(0, 10),
      type: randomPick(TX_TYPES),
      asset: randomPick(ASSET_POOL),
      amount: randomInt(2500, 35000),
      status: randomPick(STATUS_TYPES),
    };
  });
}

function getNotifications() {
  const market = updateMarketState();

  return [
    {
      id: `n-${Date.now()}-1`,
      title: 'Allocation Drift Alert',
      message: `Equity drift touched ${randomInt(2, 5)}.${randomInt(0, 9)}%. Rebalance is recommended this week.`,
      severity: 'warning',
    },
    {
      id: `n-${Date.now()}-2`,
      title: 'SIP Reminder',
      message: `Next SIP debit is scheduled on ${randomInt(5, 15)}th. Keep sufficient balance in your mandate account.`,
      severity: 'info',
    },
    {
      id: `n-${Date.now()}-3`,
      title: `${market.sentiment} Regime Update`,
      message: `${market.regime} signal generated with NIFTY near ${market.nifty.toLocaleString('en-IN')}. Review hedges and exposure balance.`,
      severity: 'success',
    },
  ];
}

function getRebalanceSuggestion() {
  const portfolio = ensurePortfolio();
  updateMarketState();
  const equities = portfolio.allocation.find((asset) => asset.name === 'Equities');
  const bonds = portfolio.allocation.find((asset) => asset.name === 'Bonds');
  const equityDrift = randomInt(1, 4);

  return {
    action: 'Review',
    summary: 'Portfolio drift is moderate. Small tactical shifts can improve alignment and downside control.',
    changes: [
      {
        asset: 'Equities',
        current: (equities?.value || 20) + equityDrift,
        target: equities?.value || 20,
        action: 'Trim',
      },
      {
        asset: 'Bonds',
        current: Math.max(0, (bonds?.value || 15) - equityDrift),
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
    marketAtSimulation: updateMarketState(),
    simulatedAt: Date.now(),
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
