const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const portfolioRoutes = require('./routes/portfolioRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/portfolio', portfolioRoutes);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
