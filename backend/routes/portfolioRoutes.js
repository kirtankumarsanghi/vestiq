const express = require('express');
const {
  getPortfolio,
  buildUserPortfolio,
} = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getPortfolio);
router.post('/build', authMiddleware, buildUserPortfolio);

module.exports = router;
