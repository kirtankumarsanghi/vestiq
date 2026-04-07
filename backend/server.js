const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const portfolioRoutes = require('./routes/portfolioRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const startedAt = Date.now();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    startedAt,
    timestamp: Date.now(),
  });
});

app.use('/api/portfolio', portfolioRoutes);

app.use('/api/*', (_req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled API error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const server = app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Server failed to start:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
