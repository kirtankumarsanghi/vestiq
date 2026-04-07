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
  try {
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
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch portfolio' });
  }
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
  try {
    return res.json(getOverview());
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch overview' });
  }
}

function getPortfolioInsights(_req, res) {
  try {
    ensurePortfolio();
    return res.json(getInsights());
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch insights' });
  }
}

function getPortfolioTransactions(_req, res) {
  try {
    ensurePortfolio();
    return res.json(getTransactions());
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch transactions' });
  }
}

function getPortfolioNotifications(_req, res) {
  try {
    ensurePortfolio();
    return res.json(getNotifications());
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch notifications' });
  }
}

function getPortfolioRebalance(_req, res) {
  try {
    ensurePortfolio();
    return res.json(getRebalanceSuggestion());
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch rebalance suggestion' });
  }
}

function runPortfolioSimulation(req, res) {
  try {
    return res.json(simulateSip(req.body || {}));
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Simulation failed' });
  }
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
