const express = require('express');
const {
  buildUserPortfolio,
  getPortfolio,
  getPortfolioInsights,
  getPortfolioNotifications,
  getPortfolioOverview,
  getPortfolioRebalance,
  getPortfolioTransactions,
  runPortfolioSimulation,
} = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getPortfolio);
router.get('/overview', authMiddleware, getPortfolioOverview);
router.get('/insights', authMiddleware, getPortfolioInsights);
router.get('/transactions', authMiddleware, getPortfolioTransactions);
router.get('/notifications', authMiddleware, getPortfolioNotifications);
router.get('/rebalance', authMiddleware, getPortfolioRebalance);
router.post('/build', authMiddleware, buildUserPortfolio);
router.post('/simulate', authMiddleware, runPortfolioSimulation);

module.exports = router;
