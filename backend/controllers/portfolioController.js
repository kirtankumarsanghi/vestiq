const {
  buildPortfolio,
  getLatestPortfolio,
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

module.exports = {
  getPortfolio,
  buildUserPortfolio,
};
