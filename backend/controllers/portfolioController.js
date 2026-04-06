const {
  buildPortfolio,
  ensurePortfolio,
  getInsights,
  getLatestPortfolio,
  getNotifications,
  getOverview,
  getRebalanceSuggestion,
  getTransactions,
  simulateSip,
} = require('../services/portfolioService');

function getPortfolio(_req, res) {
  let portfolio = getLatestPortfolio();

  if (!portfolio) {
    portfolio = buildPortfolio({
      goal: 'wealth',
      lumpSum: 500000,
      monthlySIP: 15000,
      riskScore: 5,
      horizonYears: 10,
      targetCorpus: 10000000,
    });
  }

  return res.json(portfolio);
}

function buildUserPortfolio(req, res) {
  try {
    const portfolio = buildPortfolio(req.body || {});
    return res.status(201).json(portfolio);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Invalid profile data' });
  }
}

function getPortfolioOverview(_req, res) {
  return res.json(getOverview());
}

function getPortfolioInsights(_req, res) {
  ensurePortfolio();
  return res.json(getInsights());
}

function getPortfolioTransactions(_req, res) {
  ensurePortfolio();
  return res.json(getTransactions());
}

function getPortfolioNotifications(_req, res) {
  ensurePortfolio();
  return res.json(getNotifications());
}

function getPortfolioRebalance(_req, res) {
  ensurePortfolio();
  return res.json(getRebalanceSuggestion());
}

function runPortfolioSimulation(req, res) {
  return res.json(simulateSip(req.body || {}));
}

module.exports = {
  getPortfolio,
  buildUserPortfolio,
  getPortfolioOverview,
  getPortfolioInsights,
  getPortfolioTransactions,
  getPortfolioNotifications,
  getPortfolioRebalance,
  runPortfolioSimulation,
};
